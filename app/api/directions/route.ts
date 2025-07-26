import { NextRequest, NextResponse } from "next/server";
import { Client, Language, UnitSystem } from "@googlemaps/google-maps-services-js";

const googleMapsClient = new Client({});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Attendre des coordonnées sous la forme { lat: number, lng: number }
    const { start, destination } = body;

    if (!start?.lat || !start?.lng || !destination?.lat || !destination?.lng) {
      return NextResponse.json({ error: "Les points de départ et d'arrivée sont requis." }, { status: 400 });
    }
    
    const directionsResponse = await googleMapsClient.directions({
      params: {
        origin: start,
        destination: destination,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        // Optionnel : langue et unités de mesure
        language: Language.fr, // Pour avoir les instructions en français
        units: UnitSystem.metric,      // Pour avoir les distances en kilomètres
      },
    });

    // Traiter la réponse
    const route = directionsResponse.data.routes[0];
    if (route && route.legs && route.legs.length > 0) {
      const leg = route.legs[0];
      
      const result = {
        // Le polyline encodé, la donnée la plus importante
        polyline: route.overview_polyline.points,
        
        // Les informations sur la distance et la durée
        distance: leg.distance, // Ex: { text: "12,3 km", value: 12345 }
        duration: leg.duration, // Ex: { text: "25 mins", value: 1500 }
        
        // Les limites géographiques pour un zoom automatique
        bounds: route.bounds, // { northeast: { lat, lng }, southwest: { lat, lng } }
        startLocation: leg.start_location, // { lat, lng }
        endLocation: leg.end_location, // { lat, lng }
      };
      
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: "Aucun itinéraire trouvé." }, { status: 404 });
    }

  } catch (error) {
    console.error("Erreur dans l'API Directions:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}