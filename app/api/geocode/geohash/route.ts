// app/api/geo/get-geohash/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { geohashForLocation } from 'geofire-common';

/**
 * API Route pour calculer un geohash à partir de coordonnées GPS.
 * 
 * Comment l'appeler depuis le client (ex: avec `fetch` ou `dio` en Dart) :
 * POST /api/geo/get-geohash
 * Headers: { 'Content-Type': 'application/json' }
 * Body: { "latitude": 48.8566, "longitude": 2.3522 }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Lire et valider les données du corps de la requête
    const body = await req.json();
    const { latitude, longitude } = body;

    // Vérifier que la latitude et la longitude sont des nombres valides
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude et longitude sont requises et doivent être des nombres.' },
        { status: 400 } // Bad Request
      );
    }
    
    // 2. Calculer le geohash avec la bibliothèque
    const hash = geohashForLocation([latitude, longitude]);

    // 3. Renvoyer le résultat au format JSON
    return NextResponse.json(
      { 
        success: true,
        geohash: hash,
        input: { latitude, longitude }
      },
      { status: 200 } // OK
    );

  } catch (error) {
    // Gérer les erreurs (ex: si le corps de la requête n'est pas un JSON valide)
    console.error("Erreur dans l'API get-geohash:", error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue.' },
      { status: 500 } // Internal Server Error
    );
  }
}