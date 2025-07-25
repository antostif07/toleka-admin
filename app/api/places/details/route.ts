import { NextRequest, NextResponse } from "next/server";
import { Client, Language, PlaceDetailsRequest } from "@googlemaps/google-maps-services-js";

const googleMapsClient = new Client({});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "Le paramètre 'placeId' est requis." }, { status: 400 });
  }

  try {
    const request: PlaceDetailsRequest = {
        params: {
            place_id: placeId,
            fields: ["geometry", "formatted_address", "name"],
            language: Language.fr,
            key: process.env.GOOGLE_MAPS_API_KEY!,
        }
    }
    const placeDetailsResponse = await googleMapsClient.placeDetails(request);

    const placeDetails = placeDetailsResponse.data.result;

    if (placeDetails && placeDetails.geometry) {
      const result = {
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        address: placeDetails.formatted_address || placeDetails.name, // Fallback sur le nom si l'adresse n'est pas formatée
      };
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: "Impossible de trouver les détails pour ce lieu." }, { status: 404 });
    }
  } catch (error) {
    console.error("Erreur dans l'API Place Details:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}