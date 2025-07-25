// app/api/geocode/reverse/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

// 1. Initialiser le client Google Maps une seule fois pour la réutiliser.
// C'est plus performant que de le créer à chaque requête.
const googleMapsClient = new Client({});

// 2. Définir le handler pour la méthode POST
export async function POST(request: NextRequest) {
  try {
    // 3. Récupérer et valider les données du corps de la requête.
    const body = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      // Si les données sont invalides, retourner une erreur 400 (Bad Request).
      return NextResponse.json(
        { error: "Les coordonnées 'latitude' et 'longitude' sont requises et doivent être des nombres." },
        { status: 400 }
      );
    }

    // 4. Effectuer l'appel à l'API de géocodage inversé.
    const geocodeResponse = await googleMapsClient.reverseGeocode({
      params: {
        latlng: { latitude, longitude },
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    // 5. Traiter la réponse de l'API Google Maps.
    if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
      // Le premier résultat est généralement le plus précis.
      const formattedAddress = geocodeResponse.data.results[0].formatted_address;

      // 6. Renvoyer une réponse de succès à l'application Flutter.
      // Le format { "address": "..." } correspond à ce que notre ApiService Flutter attend.
      return NextResponse.json({ address: formattedAddress }, { status: 200 });
    } else {
      // Si aucune adresse n'est trouvée pour ces coordonnées.
      return NextResponse.json({ error: "Aucune adresse trouvée pour ces coordonnées." }, { status: 404 });
    }
  } catch (error) {
    // 7. Gérer les erreurs internes (clé API invalide, problème réseau, etc.).
    console.error("Erreur dans l'API de géocodage inversé :", error);
    
    // Renvoyer une erreur générique au client pour ne pas exposer de détails sensibles.
    return NextResponse.json(
      { error: "Une erreur interne est survenue sur le serveur." },
      { status: 500 }
    );
  }
}