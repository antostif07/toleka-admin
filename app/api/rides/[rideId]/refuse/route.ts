// Fichier : app/api/rides/[rideId]/refuse/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function POST(
  req: NextRequest,
//   { params }: { params: { rideId: string } }
) {
    console.log(req);
    
    return NextResponse.json({ error: 'Cette API est désactivée pour le moment.' }, { status: 503 });
    // const { rideId } = params;
    
    // // 1. Authentifier le chauffeur
    // const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    // if (!token) return NextResponse.json({ error: 'Token manquant.' }, { status: 401 });

    // let driverId: string;
    // try {
    //     const decodedToken = await adminAuth.verifyIdToken(token);
    //     driverId = decodedToken.uid;
    // } catch (error) {
    //     console.error(`[${rideId}] Erreur de vérification du token:`, error);
    //     return NextResponse.json({ error: 'Token invalide.' }, { status: 401 });
    // }

    // console.log(`[${rideId}] Chauffeur ${driverId} a refusé via API.`);

    // try {
    //     // 2. Libérer le chauffeur et nettoyer l'offre sur la course
    //     const driverRef = adminDb.collection("drivers").doc(driverId);
    //     const rideRef = adminDb.collection("rides").doc(rideId);
        
    //     await Promise.all([
    //         driverRef.update({ dispatchStatus: "AVAILABLE" }),
    //         rideRef.update({
    //             'dispatch.currentOfferedDriverId': null,
    //             'dispatch.offerExpiresAt': null
    //         })
    //     ]);
        
    //     // 3. Relancer le moteur de dispatching pour trouver le prochain chauffeur
    //     fetch(`${req.nextUrl.origin}/api/dispatch/process`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${process.env.TOLEKA_SECRET}`,
    //         },
    //         body: JSON.stringify({ rideId }),
    //     }).catch(err => console.error(`[${rideId}] Erreur interne de relance du dispatching après refus:`, err));

    //     return NextResponse.json({ success: true }, { status: 200 });

    // } catch (error) {
    //     console.error(`[${rideId}] Erreur lors du refus par ${driverId}:`, error);
    //     return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
    // }
}