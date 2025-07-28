import { adminDb } from '@/lib/firebase/admin';

// Interface pour garantir la structure de nos données de prix
export interface PricingParams {
  baseFare: number;
  perMinuteRate: number;
  perKilometerRate: number;
  bookingFee: number;
  isActive: boolean;
  displayName: string;
}

// Un cache simple en mémoire pour éviter de lire Firestore à chaque requête.
let cachedPricingConfig: Record<string, PricingParams> | null = null;
let lastFetchTime: number = 0;

/**
 * Récupère la configuration de tarification depuis Firestore.
 * Utilise un cache en mémoire pour limiter les lectures de la base de données (pendant 5 minutes).
 * @returns La configuration de tarification.
 */
export async function getPricingConfig(): Promise<Record<string, PricingParams>> {
  const now = Date.now();
  // Si le cache est valide (moins de 5 minutes), on le retourne
  if (cachedPricingConfig && (now - lastFetchTime < 5 * 60 * 1000)) {
    return cachedPricingConfig;
  }
  
  console.log("Fetching pricing configuration from Firestore...");
  const docRef = adminDb.collection('configuration').doc('wteyHkz9AhywmEXj1jzS');
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("Le document de configuration 'pricing' n'existe pas dans Firestore !");
  }

  const configData = docSnap.data()?.pricing as Record<string, PricingParams>;
  
  // Mettre à jour le cache
  cachedPricingConfig = configData;
  lastFetchTime = now;
  
  return cachedPricingConfig!;
}

// La fonction de calcul du tarif reste la même
export function calculateFare(distanceInMeters: number, durationInSeconds: number, params: PricingParams): number {
  const distanceInKm = distanceInMeters / 1000;
  const durationInMinutes = durationInSeconds / 60;
  const timeFare = durationInMinutes * params.perMinuteRate;
  const distanceFare = distanceInKm * params.perKilometerRate;
  const subtotal = Math.max(params.baseFare, timeFare + distanceFare) + params.bookingFee;
  return Math.ceil(subtotal / 100) * 100;
}