// Fichier : app/api/dispatch/process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import * as geofire from 'geofire-common';
import { adminDb } from '@/lib/firebase/admin'; // Utiliser notre initialisation centralisée

// ============================================================================
// FONCTION UTILITAIRE DE RECHERCHE DE CHAUFFEURS
// (On garde cette fonction ici car c'est le seul endroit où elle est utilisée)
// ============================================================================
async function findAvailableDrivers(center: [number, number], excludedDriverIds: string[] = []): Promise<string[]> {
    const radiusInM = 10 * 1000;
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises: Promise<admin.firestore.QuerySnapshot>[] = [];

    for (const b of bounds) {
        const q = adminDb.collection("drivers")
            .where("isApproved", "==", true)
            .where("presence.status", "==", "ONLINE")
            .where("dispatchStatus", "==", "AVAILABLE")
            .orderBy("location.geohash")
            .startAt(b[0]).endAt(b[1]);
        promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const potentialDrivers: { id: string; distanceInKm: number }[] = [];

    for (const snap of snapshots) {
        for (const doc of snap.docs) {
            if (excludedDriverIds.includes(doc.id)) continue;
            if (!doc.data().location?.geoPoint) continue;
            
            const driverData = doc.data();
            const driverLocation = driverData.location.geoPoint as admin.firestore.GeoPoint;
            const distanceInKm = geofire.distanceBetween([driverLocation.latitude, driverLocation.longitude], center);

            if (distanceInKm <= radiusInM / 1000) {
                potentialDrivers.push({ id: doc.id, distanceInKm });
            }
        }
    }
    
    potentialDrivers.sort((a, b) => a.distanceInKm - b.distanceInKm);
    console.log(`[Recherche interne] ${potentialDrivers.length} chauffeurs potentiels trouvés.`);
    return potentialDrivers.map(d => d.id);
}


// ============================================================================
// LE HANDLER PRINCIPAL DE LA ROUTE API
// ============================================================================
export async function POST(req: NextRequest) {
    // 1. Sécuriser avec la clé secrète partagée
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (token !== process.env.TOLEKA_SECRET) {
        console.warn("Accès non autorisé à l'API de dispatch.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rideId } = await req.json();
    if (!rideId) {
        return NextResponse.json({ error: 'rideId manquant' }, { status: 400 });
    }
    
    console.log(`[${rideId}] Moteur de dispatching activé...`);

    try {
        await adminDb.runTransaction(async (transaction) => {
            const rideRef = adminDb.collection('rides').doc(rideId);
            const rideDoc = await transaction.get(rideRef);

            if (!rideDoc.exists) throw new Error("Course non trouvée.");
            const rideData = rideDoc.data()!;
            
            if (rideData.status !== 'SEARCHING') {
                console.log(`[${rideId}] Course non en recherche (statut: ${rideData.status}). Arrêt.`);
                return;
            }

            // 2. Libérer le chauffeur précédent s'il y en avait un dont l'offre a expiré
            // Cette logique est appelée par la Cloud Function checkExpiredOffers
            const previouslyOfferedDriverId = rideData.dispatch.currentOfferedDriverId;
            if (previouslyOfferedDriverId) {
                const previousDriverRef = adminDb.collection('drivers').doc(previouslyOfferedDriverId);
                transaction.update(previousDriverRef, { 'dispatchStatus': 'AVAILABLE' });
            }

            let potentialDrivers: string[] = rideData.dispatch.potentialDrivers || [];
            const contactedDrivers: string[] = rideData.dispatch.contactedDrivers || [];

            // 3. Logique de rafraîchissement : si la liste est vide, on cherche à nouveau.
            if (potentialDrivers.length === 0) {
                console.log(`[${rideId}] Liste potentielle vide, nouvelle recherche en cours...`);
                const center: [number, number] = [rideData.pickupLocation.geoPoint.latitude, rideData.pickupLocation.geoPoint.longitude];
                const newDriversFound = await findAvailableDrivers(center, contactedDrivers);
                
                potentialDrivers = newDriversFound;
                transaction.update(rideRef, { 'dispatch.potentialDrivers': newDriversFound });
            }
            
            // 4. Si même après la recherche, il n'y a personne, on arrête et on attend le prochain cycle du Scheduler.
            if (potentialDrivers.length === 0) {
                console.log(`[${rideId}] Aucun chauffeur disponible pour le moment. Attente du prochain cycle de scheduler.`);
                transaction.update(rideRef, {
                    'dispatch.currentOfferedDriverId': null,
                    'dispatch.offerExpiresAt': null,
                });
                return;
            }
            
            // 5. Proposer la course au premier chauffeur de la liste
            const nextDriverId = potentialDrivers[0];
            const driverRef = adminDb.collection('drivers').doc(nextDriverId);
            const driverDoc = await transaction.get(driverRef);

            // Si le chauffeur n'est plus disponible, on le retire et on relancera au prochain cycle
            if(!driverDoc.exists || driverDoc.data()?.dispatchStatus !== 'AVAILABLE') {
                console.warn(`[${rideId}] Chauffeur ${nextDriverId} n'est plus disponible. Retrait de la liste.`);
                transaction.update(rideRef, {
                    'dispatch.potentialDrivers': admin.firestore.FieldValue.arrayRemove(nextDriverId)
                });
                // Le prochain appel (par le scheduler ou un refus) traitera le chauffeur suivant
                return;
            }
            
            const offerDurationInSeconds = 30;
            const offerExpiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + offerDurationInSeconds * 1000);

            console.log(`[${rideId}] Proposition de la course au chauffeur ${nextDriverId}`);
            
            // Verrouiller le chauffeur
            transaction.update(driverRef, { 'dispatchStatus': 'BUSY' });
            
            // Mettre à jour la course avec les détails de l'offre
            transaction.update(rideRef, {
                'dispatch.currentOfferedDriverId': nextDriverId,
                'dispatch.offerExpiresAt': offerExpiresAt,
                'dispatch.potentialDrivers': admin.firestore.FieldValue.arrayRemove(nextDriverId),
                'dispatch.contactedDrivers': admin.firestore.FieldValue.arrayUnion(nextDriverId),
            });
        });

    } catch (error) {
        console.error(`[${rideId}] Erreur dans la transaction de dispatch:`, error);
        // Ne mettez pas 'FAILED' ici, laissez le scheduler réessayer
        // On pourrait logguer l'erreur dans un champ spécifique
        await adminDb.collection('rides').doc(rideId).update({
            'dispatch.lastError': 'DISPATCH_TRANSACTION_FAILED'
        });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Dispatching pour ${rideId} traité.` });
}