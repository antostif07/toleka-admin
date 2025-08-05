// Fichier : app/api/rides/[rideId]/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { rideId: string } }
) {
    const { rideId } = params;

    // 1. Authentifier le chauffeur qui fait la demande
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Token manquant.' }, { status: 401 });
    }

    let driverId: string;
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        // On pourrait vérifier si l'utilisateur a bien le rôle "driver" via ses custom claims
        driverId = decodedToken.uid;
    } catch (error) {
        return NextResponse.json({ error: 'Token invalide.' }, { status: 401 });
    }
    
    console.log(`[${rideId}] Chauffeur ${driverId} tente d'accepter via API.`);

    try {
        // 2. Utiliser une transaction pour garantir l'intégrité
        await adminDb.runTransaction(async (transaction) => {
            const rideRef = adminDb.collection("rides").doc(rideId);
            const rideDoc = await transaction.get(rideRef);

            if (!rideDoc.exists) throw new Error("Course non trouvée.");
            
            const rideData = rideDoc.data()!;
            
            // 3. Vérifier que la course est bien en attente POUR CE chauffeur
            if (rideData.status !== "SEARCHING" || rideData.dispatch.currentOfferedDriverId !== driverId) {
                throw new Error("Course non disponible pour ce chauffeur.");
            }
            
            // Tout est bon, on attribue la course !
            transaction.update(rideRef, {
                status: "ACCEPTED",
                assignedDriverId: driverId,
                acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // On met à jour le statut du chauffeur
            const driverRef = adminDb.collection("drivers").doc(driverId);
            transaction.update(driverRef, {
                "presence.status": "ON_RIDE",
                "dispatchStatus": "BUSY",
            });
        });

        console.log(`[${rideId}] Course acceptée avec succès par ${driverId}.`);
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error(`[${rideId}] Erreur d'acceptation par ${driverId}:`, error);
        return NextResponse.json({ error: error.message || 'Erreur interne.' }, { status: 500 });
    }
}