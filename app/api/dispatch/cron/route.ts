import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebase/admin';

// ============================================================================
// ROUTE POUR LA TÂCHE PLANIFIÉE (CRON JOB)
// ============================================================================
export async function GET(req: NextRequest) {
    // 1. Sécuriser la route avec un "Cron Secret"
    // C'est un secret que seul Vercel et cette fonction connaîtront.
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (authToken !== process.env.CRON_SECRET) {
        console.warn("Accès non autorisé au Cron Job de dispatch.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Cron Job: Vérification des offres de courses expirées...");
    
    try {
        const now = admin.firestore.Timestamp.now();

        // 2. Requête pour trouver les offres expirées
        const expiredOffersQuery = adminDb.collection("rides")
            .where("status", "==", "SEARCHING")
            .where("dispatch.offerExpiresAt", "<=", now);

        const snapshot = await expiredOffersQuery.get();

        if (snapshot.empty) {
            console.log("Cron Job: Aucune offre expirée trouvée.");
            return NextResponse.json({ success: true, processed: 0 });
        }
        
        console.log(`Cron Job: ${snapshot.size} offres expirées trouvées.`);

        // 3. Pour chaque offre expirée, on relance le moteur de dispatching principal
        const dispatchApiUrl = `${req.nextUrl.origin}/api/dispatch/process`;
        const apiSecretKey = process.env.TOLEKA_SECRET;
        
        const processPromises: Promise<any>[] = [];

        for (const doc of snapshot.docs) {
            const rideId = doc.id;
            console.log(`[${rideId}] Offre expirée. Relance du dispatching...`);

            const fetchPromise = fetch(dispatchApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiSecretKey}`,
                },
                body: JSON.stringify({ rideId: rideId }),
            });
            processPromises.push(fetchPromise);
        }

        await Promise.all(processPromises);
        
        return NextResponse.json({ success: true, processed: snapshot.size });

    } catch (error) {
        console.error("Erreur critique dans le Cron Job de dispatch:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}