import { Timestamp, GeoPoint } from 'firebase-admin/firestore'; // Pour le côté serveur (api.ts)
// Côté client, on importerait depuis 'firebase/firestore' si nécessaire

// Interface pour la sous-structure des détails du véhicule
export interface VehicleDetails {
    mark: string;
    model: string;
    color: string;
    licensePlate: string;
    year?: number; // Optionnel
}

// Interface principale pour le modèle Driver
export interface Driver {
  id: string; // L'UID de Firebase Auth, qui est aussi l'ID du document
  driverID: string; // L'ID personnalisé/lisible du chauffeur (ex: T001)
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string; // Optionnel

  // --- Statut et Performance ---
  status: 'pending_approval' | 'approved' | 'suspended' | 'offline' | 'online' | 'in_ride';
  isOnline: boolean;
  rating: number;
  totalRides: number;
  totalEarnings: number;

  // --- Localisation ---
  currentLocation?: GeoPoint;
  currentBearing?: number;
  locationTimestamp?: Timestamp;

  // --- Détails du Véhicule ---
  vehicleDetails: VehicleDetails;

  // --- Documents (liens vers Cloud Storage) ---
  documents?: {
    license?: string;
    vehicleRegistration?: string;
    insurance?: string;
  };
  
  // --- Timestamps ---
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Fonction Factory pour convertir un DocumentSnapshot de Firestore en un objet Driver typé.
 * @param doc Le DocumentSnapshot provenant de Firestore.
 * @returns Un objet Driver typé.
 */
export function createDriverFromFirestore(
  doc: FirebaseFirestore.DocumentSnapshot
): Driver {
  const data = doc.data();

  if (!data) {
    throw new Error(`Le document du chauffeur avec l'ID ${doc.id} est vide.`);
  }

  // Création de l'objet avec des valeurs par défaut pour la robustesse
  return {
    id: doc.id,
    driverID: data.driverID ?? 'N/A',
    fullName: data.fullName ?? 'Nom non défini',
    email: data.email ?? 'Email non défini',
    phoneNumber: data.phoneNumber ?? 'Téléphone non défini',
    profilePictureUrl: data.profilePictureUrl,

    status: data.status ?? 'pending_approval',
    isOnline: data.isOnline ?? false,
    rating: (data.rating ?? 0).valueOf(),
    totalRides: (data.totalRides ?? 0).valueOf(),
    totalEarnings: (data.totalEarnings ?? 0).valueOf(),

    currentLocation: data.currentLocation,
    currentBearing: (data.currentBearing ?? 0).valueOf(),
    locationTimestamp: data.locationTimestamp,

    vehicleDetails: {
        mark: data.vehicleDetails?.mark ?? 'Marque non définie',
        model: data.vehicleDetails?.model ?? 'Modèle non défini',
        color: data.vehicleDetails?.color ?? 'Couleur non définie',
        licensePlate: data.vehicleDetails?.licensePlate ?? 'Plaque non définie',
        year: data.vehicleDetails?.year,
    },

    documents: data.documents,
    
    createdAt: data.createdAt ?? Timestamp.now(),
    updatedAt: data.updatedAt,
  };
}

export interface SerializableDriver {
  id: string;
  driverID: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;

  status: 'pending_approval' | 'approved' | 'suspended' | 'offline' | 'online' | 'in_ride';
  isOnline: boolean;
  rating: number;
  totalRides: number;
  totalEarnings: number;

  // GeoPoint devient un objet simple
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  currentBearing?: number;
  // Timestamp devient une chaîne de caractères (ISO 8601)
  locationTimestamp?: string;

  vehicleDetails: VehicleDetails;

  documents?: {
    license?: string;
    vehicleRegistration?: string;
    insurance?: string;
  };

  // Timestamp devient une chaîne de caractères
  createdAt: string;
  updatedAt?: string;
}