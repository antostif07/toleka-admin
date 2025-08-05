import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { adminDb, adminAuth } from '@/lib/firebase/admin'; // Utiliser notre initialisation centralisée
import { findAvailableDrivers } from '@/lib/dispatchUtils'; // Importer la fonction de recherche

export async function POST(req: NextRequest) {
    // 1. Authentifier le passager qui fait la demande
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Token d\'authentification manquant.' }, { status: 401 });
    }

    let riderId: string;
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        riderId = decodedToken.uid;
    } catch (error) {
        console.error("Erreur de validation du token:", error);
        return NextResponse.json({ error: 'Token invalide.' }, { status: 401 });
    }

    try {
        // 2. Récupérer les données de la course depuis la requête du client
        const rideDetails = await req.json();
        const { pickupLocation, destinationLocation, estimatedPrice, vehicleType, distance, duration, polyline } = rideDetails;

        // 3. Créer le document de la course dans Firestore
        const rideRef = await adminDb.collection('rides').add({
            riderId: riderId,
            status: 'SEARCHING', // On commence directement en recherche !
            pickupLocation,
            destinationLocation,
            estimatedPrice,
            vehicleType,
            distance,
            duration,
            polyline,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            assignedDriverId: null,
            dispatch: {
                potentialDrivers: [],
                contactedDrivers: [],
                currentOfferedDriverId: null,
                offerExpiresAt: null,
                lastError: null,
            },
        });
        const rideId = rideRef.id;
        console.log(`[${rideId}] Course créée pour le passager ${riderId}.`);

        // 4. Lancer immédiatement la première recherche de chauffeurs
        const center: [number, number] = [pickupLocation.geoPoint.latitude, pickupLocation.geoPoint.longitude];
        const driverIds = await findAvailableDrivers(center);
        
        await rideRef.update({
            'dispatch.potentialDrivers': driverIds,
        });
        console.log(`[${rideId}] Recherche initiale terminée. ${driverIds.length} chauffeurs trouvés.`);

        // 5. Si on a trouvé des chauffeurs, on lance le processus de dispatching
        if (driverIds.length > 0) {
            // On déclenche le moteur de dispatching. C'est un appel "fire-and-forget",
            // on n'attend pas sa réponse pour ne pas ralentir le client.
            fetch(`${req.nextUrl.origin}/api/dispatch/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TOLEKA_SECRET}`,
                },
                body: JSON.stringify({ rideId }),
            }).catch(error => console.error(`[${rideId}] Erreur interne lors du déclenchement du dispatching:`, error));
        }
        
        // 6. Renvoyer l'ID de la course au client
        return NextResponse.json({ success: true, rideId: rideId }, { status: 201 });
        
    } catch (error) {
        console.error("Erreur critique lors de la création de la course:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}