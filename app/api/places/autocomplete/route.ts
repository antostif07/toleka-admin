// app/api/places/autocomplete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

const googleMapsClient = new Client({});

// On va utiliser un handler GET cette fois, car une recherche
// est sémantiquement une récupération de données.
export async function GET(request: NextRequest) {
  // 1. Récupérer les paramètres de la requête depuis l'URL.
  // ex: /api/places/autocomplete?query=kfc&lat=48.85&lng=2.29
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  
  // 2. Valider l'entrée. Le 'query' est obligatoire.
  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: "Le paramètre 'query' est requis et doit contenir au moins 3 caractères." },
      { status: 400 }
    );
  }
  
  // 3. Préparer les paramètres pour l'appel à l'API Google.
  const apiParams: { input: string, key: string, location?: { lat: number, lng: number}, radius?: number, types?: PlaceAutocompleteType } = {
    input: query,
    key: process.env.GOOGLE_MAPS_API_KEY!,
    // Optionnel, mais fortement recommandé : restreindre les résultats autour
    // de la position actuelle de l'utilisateur pour une meilleure pertinence.
    ...(lat && lng && {
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: 50000 // Rayon de 100km
    }),
    types: PlaceAutocompleteType.address,
  };
  
  try {
    // 4. Appeler l'API Place Autocomplete de Google.
    const autocompleteResponse = await googleMapsClient.placeAutocomplete({
      params: apiParams,
    });
    
    // 5. Formater la réponse pour notre application Flutter.
    // On ne renvoie que les données dont on a besoin pour garder la réponse légère.
    const results = autocompleteResponse.data.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text,
    }));
    
    // 6. Renvoyer la liste des suggestions formatées.
    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API Place Autocomplete:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue sur le serveur." },
      { status: 500 }
    );
  }
}