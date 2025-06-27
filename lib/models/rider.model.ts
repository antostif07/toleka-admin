export interface GetUsersParams {
  search?: string;
  // On pourrait ajouter d'autres filtres ici plus tard (status, etc.)
}

// Interface pour la version "plate" et sérialisable des données client
export interface SerializableUser {
  id: string; // L'UID de Firebase Auth, qui est aussi l'ID du document
  fullName : string;
  email?: string; // L'email peut être optionnel
  phoneNumber: string;
  photoUrl?: string;

  status: 'active' | 'suspended'; // Statuts possibles pour un client
  totalTrips: number;
  totalSpent: number;
  
  // Note moyenne que le client a donnée (calculé) ou sa propre note (si les chauffeurs le notent)
  averageRating: number; 

  createdAt: string; // Date d'inscription en format string ISO
  lastTripDate?: string; // Date de la dernière course en format string ISO
}