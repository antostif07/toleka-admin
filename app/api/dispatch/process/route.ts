import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import * as geofire from 'geofire-common';

// --- Configuration de Firebase Admin SDK ---
// Assurez-vous que cette initialisation n'est faite qu'une seule fois dans votre projet.
// Si vous l'avez déjà dans un autre fichier, vous pouvez l'enlever d'ici.
if (!admin.apps.length) {
    admin.initializeApp({
        // Cette configuration est idéale pour les environnements de production comme Vercel
        // qui utilisent des variables d'environnement pour les credentials.
        credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

// ============================================================================
// FONCTION UTILITAIRE DE RECHERCHE DE CHAUFFEURS
// ============================================================================
/**
 * Recherche les chauffeurs disponibles à proximité d'un point donné.
 * @param center Les coordonnées [latitude, longitude] du point de recherche.
 * @param excludedDriverIds Une liste d'IDs de chauffeurs à ignorer dans la recherche (ceux déjà contactés).
 * @returns Une promesse qui se résout avec une liste triée d'IDs de chauffeurs.
 */
async function findAvailableDrivers(center: [number, number], excludedDriverIds: string[] = []): Promise<string[]> {
    console.log(`Recherche de chauffeurs autour de [${center.join(',')}] en excluant ${excludedDriverIds.length} chauffeur(s).`);
    
    const radiusInM = 10 * 1000; // Rayon de 10 km
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises: Promise<admin.firestore.QuerySnapshot>[] = [];

    for (const b of bounds) {
      const q = db.collection("drivers")
        .where("isApproved", "==", true)
        .where("presence.status", "==", "ONLINE")
        .where("dispatchStatus", "==", "AVAILABLE")
        .orderBy("location.geohash")
        .startAt(b[0])
        .endAt(b[1]);
      promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const potentialDrivers: { id: string; distanceInKm: number }[] = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
          // On s'assure de ne pas rajouter un chauffeur qu'on a déjà contacté.
          if (excludedDriverIds.includes(doc.id)) {
              continue;
          }

          const driverData = doc.data();
          // Vérification de sécurité pour éviter les crashs si les données sont mal formées
          if (!driverData.location?.geoPoint) continue;

          const driverLocation = driverData.location.geoPoint as admin.firestore.GeoPoint;
          const distanceInKm = geofire.distanceBetween([driverLocation.latitude, driverLocation.longitude], center);

          if (distanceInKm <= radiusInM / 1000) {
              potentialDrivers.push({ id: doc.id, distanceInKm });
          }
      }
    }
    
    potentialDrivers.sort((a, b) => a.distanceInKm - b.distanceInKm);
    console.log(`${potentialDrivers.length} chauffeurs potentiels trouvés dans la recherche.`);
    return potentialDrivers.map(d => d.id);
}

// ============================================================================
// LE HANDLER PRINCIPAL DE LA ROUTE API
// ============================================================================
export async function POST(req: NextRequest) {
    // 1. Sécuriser l'API avec la clé secrète
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (token !== process.env.SESSION_SECRET_KEY) { // Assurez-vous que le nom correspond à votre .env
        console.warn("Accès non autorisé à l'API de dispatch.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rideId } = await req.json();
    if (!rideId) {
        return NextResponse.json({ error: 'rideId manquant' }, { status: 400 });
    }
    
    console.log(`[${rideId}] Activation du moteur de dispatching...`);

    try {
        await db.runTransaction(async (transaction) => {
            const rideRef = db.collection('rides').doc(rideId);
            const rideDoc = await transaction.get(rideRef);

            if (!rideDoc.exists) throw new Error("Course non trouvée.");
            const rideData = rideDoc.data()!;
            
            if (rideData.status !== 'SEARCHING') {
                console.log(`[${rideId}] Course non en recherche (statut: ${rideData.status}). Arrêt.`);
                return;
            }

            // Libérer le chauffeur précédent s'il y en avait un dont l'offre a expiré
            const previouslyOfferedDriverId = rideData.dispatch.currentOfferedDriverId;
            if (previouslyOfferedDriverId) {
                const previousDriverRef = db.collection('drivers').doc(previouslyOfferedDriverId);
                transaction.update(previousDriverRef, { 'dispatchStatus': 'AVAILABLE' });
            }

            let potentialDrivers: string[] = rideData.dispatch.potentialDrivers || [];
            const contactedDrivers: string[] = rideData.dispatch.contactedDrivers || [];

            // 2. Logique de rafraîchissement : si la liste est vide, on cherche à nouveau.
            if (potentialDrivers.length === 0) {
                console.log(`[${rideId}] Liste potentielle vide, nouvelle recherche.`);
                const center: [number, number] = [rideData.pickupLocation.geoPoint.latitude, rideData.pickupLocation.geoPoint.longitude];
                const newDriversFound = await findAvailableDrivers(center, contactedDrivers);
                
                potentialDrivers = newDriversFound;
                transaction.update(rideRef, { 'dispatch.potentialDrivers': newDriversFound });
            }
            
            // 3. Si même après la recherche, il n'y a personne, on arrête et on attend le prochain cycle.
            if (potentialDrivers.length === 0) {
                console.log(`[${rideId}] Aucun chauffeur disponible. En attente du prochain cycle de scheduler.`);
                // On s'assure que l'offre est bien vide
                transaction.update(rideRef, {
                    'dispatch.currentOfferedDriverId': null,
                    'dispatch.offerExpiresAt': null,
                });
                return;
            }
            
            // 4. Proposer au premier chauffeur de la liste
            const nextDriverId = potentialDrivers[0];
            const driverRef = db.collection('drivers').doc(nextDriverId);
            
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
        // await db.collection('rides').doc(rideId).update({ 
        //     status: 'FAILED', 
        //     'dispatch.lastError': 'DISPATCH_TRANSACTION_FAILED' 
        // });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Dispatching pour ${rideId} traité.` });
}