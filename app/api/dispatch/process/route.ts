// app/api/dispatch/process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// --- Configuration de Firebase Admin SDK ---
// (À placer idéalement dans un fichier d'initialisation séparé pour ne pas le répéter)
if (!admin.apps.length) {
    // Cette configuration est pour Vercel/Google Cloud Run.
    // Elle lit automatiquement la variable d'environnement GOOGLE_APPLICATION_CREDENTIALS.
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();

// --- Le Handler de la Route API ---
export async function POST(req: NextRequest) {
    // 1. Sécuriser l'API avec la clé secrète
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (token !== process.env.SESSION_SECRET_KEY) {
        console.warn("Tentative d'accès non autorisée à l'API de dispatch.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rideId } = await req.json();
    if (!rideId) {
        return NextResponse.json({ error: 'rideId manquant dans le corps de la requête.' }, { status: 400 });
    }
    
    console.log(`[${rideId}] Activation du moteur de dispatching...`);

    try {
        // 2. Utiliser une transaction Firestore pour garantir l'intégrité des données
        await db.runTransaction(async (transaction) => {
            const rideRef = db.collection('rides').doc(rideId);
            const rideDoc = await transaction.get(rideRef);

            if (!rideDoc.exists) {
                console.error(`[${rideId}] Erreur critique: la course n'a pas été trouvée.`);
                throw new Error("Ride not found");
            }

            const rideData = rideDoc.data()!;
            
            // Si la course n'est plus en recherche (déjà acceptée, annulée, etc.), on arrête tout.
            if (rideData.status !== 'SEARCHING') {
                console.log(`[${rideId}] La course n'est plus en recherche (statut: ${rideData.status}). Processus arrêté.`);
                return;
            }

            // --- Logique principale : trouver le prochain chauffeur ---
            const potentialDrivers: string[] = rideData.dispatch.potentialDrivers || [];
            
            if (potentialDrivers.length === 0) {
                console.log(`[${rideId}] Il n'y a plus de chauffeurs potentiels à qui proposer la course.`);
                transaction.update(rideRef, { 
                    status: 'FAILED', 
                    'dispatch.lastError': 'NO_MORE_DRIVERS_AVAILABLE' 
                });
                return;
            }

            // On prend le premier chauffeur de la liste. C'est notre candidat.
            const nextDriverId = potentialDrivers[0];
            
            console.log(`[${rideId}] Prochain candidat chauffeur : ${nextDriverId}`);

            // On vérifie l'état de ce chauffeur DANS la transaction pour éviter les conflits
            const driverRef = db.collection('drivers').doc(nextDriverId);
            const driverDoc = await transaction.get(driverRef);

            // Si le chauffeur n'existe plus ou n'est plus disponible...
            if (!driverDoc.exists || driverDoc.data()?.dispatchStatus !== 'AVAILABLE') {
                console.warn(`[${rideId}] Le chauffeur ${nextDriverId} n'est plus disponible. On le retire de la liste.`);
                // On le retire de la liste des potentiels et on s'arrête.
                // Le processus devra être relancé (par un refus ou un timeout) pour tester le suivant.
                transaction.update(rideRef, {
                    'dispatch.potentialDrivers': admin.firestore.FieldValue.arrayRemove(nextDriverId)
                });
                // TODO: Pour améliorer, on pourrait créer une boucle ici pour tester immédiatement le suivant,
                // mais cela complique la transaction. La relance externe est plus simple et robuste.
                return;
            }

            // --- Le chauffeur est disponible ! On lui envoie l'offre. ---
            
            const offerDurationInSeconds = 30;
            const offerExpiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + offerDurationInSeconds * 1000);

            // 1. Verrouiller le chauffeur : son statut passe à "BUSY"
            transaction.update(driverRef, { 'dispatchStatus': 'BUSY' });

            // 2. Mettre à jour la course avec les détails de l'offre
            transaction.update(rideRef, {
                // On assigne l'offre au chauffeur
                'dispatch.currentOfferedDriverId': nextDriverId,
                'dispatch.offerExpiresAt': offerExpiresAt,
                // On le retire de la liste d'attente
                'dispatch.potentialDrivers': admin.firestore.FieldValue.arrayRemove(nextDriverId),
                // On l'ajoute à la liste de ceux qui ont été contactés
                'dispatch.contactedDrivers': admin.firestore.FieldValue.arrayUnion(nextDriverId),
            });
            
            console.log(`[${rideId}] Offre envoyée avec succès à ${nextDriverId}. Elle expire dans ${offerDurationInSeconds} secondes.`);
        });

    } catch (error) {
        console.error(`[${rideId}] Erreur dans la transaction de dispatch :`, error);
        // En cas d'erreur dans la transaction, on met la course en échec pour informer le client.
        await db.collection('rides').doc(rideId).update({ 
            status: 'FAILED', 
            'dispatch.lastError': 'DISPATCH_TRANSACTION_FAILED' 
        });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Processus de dispatching traité pour ${rideId}` });
}