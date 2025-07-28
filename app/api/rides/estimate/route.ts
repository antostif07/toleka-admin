import { NextRequest, NextResponse } from "next/server";
import { Client, Language, TrafficModel, TravelMode, UnitSystem } from "@googlemaps/google-maps-services-js";
import { calculateFare, getPricingConfig, PricingParams } from "@/lib/config/pricing";

// Un cache simple en mémoire pour éviter de lire Firestore à chaque requête.
let cachedPricingConfig: Record<string, PricingParams> | null = null;
let lastFetchTime: number = 0;

const googleMapsClient = new Client({});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start, destination } = body;

    if (!start?.lat || !start?.lng || !destination?.lat || !destination?.lng) {
      return NextResponse.json({ error: "Les points de départ et d'arrivée sont requis." }, { status: 400 });
    }

    // --- 1. Appeler l'API Google Directions ---
    const [directionsResponse, pricingConfig] = await Promise.all([
        googleMapsClient.directions({
      params: {
        origin: start,
        destination: destination,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        // TRÈS IMPORTANT : inclure une estimation du trafic.
        traffic_model: TrafficModel.best_guess,
        // On peut aussi spécifier le mode de transport, par exemple "driving" pour les véhicules.
        mode: TravelMode.driving,
        departure_time: "now", 
        language: Language.fr,
        units: UnitSystem.metric,
      },
    }),
    getPricingConfig(),
    ]);
    
    const leg = directionsResponse.data.routes[0]!.legs[0]!;
    const distanceInMeters = leg.distance.value;
    const durationInSeconds = leg.duration_in_traffic?.value ?? leg.duration.value;
    
    // --- 3. Préparer et retourner les options de course complètes ---
    // Cette structure correspond au `RideOption` model de Flutter.
    const rideOptions = [];

    for (const vehicleType in pricingConfig) {
      // Ignorer les champs comme 'lastUpdated' et les types inactifs
      if (typeof pricingConfig[vehicleType] === 'object' && pricingConfig[vehicleType].isActive) {
        
        const params = pricingConfig[vehicleType] as PricingParams;
        const price = calculateFare(distanceInMeters, durationInSeconds, params);
        
        rideOptions.push({
          id: vehicleType,
          name: params.displayName,
          // Vous devrez avoir une logique pour mapper le 'vehicleType' à une image
          imagePath: `/assets/images/${vehicleType}.png`,
          price: price,
          distance: leg.distance,
          duration: leg.duration,
          eta: new Date(Date.now() + (durationInSeconds + 300) * 1000).toISOString(),
        });
      }
    }

    // On retourne également la polyline pour l'affichage
    const responsePayload = {
      polyline: directionsResponse.data.routes[0]!.overview_polyline.points,
      options: rideOptions,
      startLocation: leg.start_location,
      endLocation: leg.end_location,
    };
    
    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API d'estimation de course:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}