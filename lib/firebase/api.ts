import 'server-only';
import { adminDb } from './admin';
// import { RideModel } from '@/lib/models/ride_model';
import { Calendar, Car, Users, DollarSign } from 'lucide-react';
import { createDriverFromFirestore, SerializableDriver } from '../models/driver.model';
import { Timestamp } from 'firebase-admin/firestore';
import { GetUsersParams, SerializableUser } from '../models/rider.model';

interface GetDriversParams {
  search?: string;
  status?: string;
  // Pour la pagination, on pourrait ajouter:
  // page?: number;
  // limit?: number;
}

// --- FONCTION POUR LES STATS PRINCIPALES ---
export async function getDashboardStats() {
  // TODO: Implémenter la logique de calcul. Pour l'instant, on retourne les données mock.
  // Exemple de logique :
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // const bookingsTodaySnapshot = await adminDb.collection('rides').where('createdAt', '>=', today).get();
  // const activeDriversSnapshot = await adminDb.collection('drivers').where('isOnline', '==', true).get();

  return [
  {
    title: 'Réservations Aujourd\'hui',
    value: '127',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-500',
  },
  {
    title: 'Chauffeurs Actifs',
    value: '34',
    change: '+2',
    trend: 'up',
    icon: Car,
    color: 'text-green-500',
  },
  {
    title: 'Nouveaux Clients',
    value: '18',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'text-purple-500',
  },
  {
    title: 'Revenus du Jour',
    value: '€2,847',
    change: '-3%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-yellow-500',
  },
];
}

// --- FONCTION POUR LES RÉSERVATIONS RÉCENTES ---
export async function getRecentBookings() {
  const bookingsSnapshot = await adminDb
    .collection('rides')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();
    
  if (bookingsSnapshot.empty) {
    return [];
  }
  
  // On doit enrichir les données (obtenir les noms du client et du chauffeur)
  const bookings = await Promise.all(
    bookingsSnapshot.docs.map(async (doc) => {
      const rideData = doc.data();
      
      // Obtenir le nom du client
      let clientName = 'Client inconnu';
      if (rideData.riderId) {
        const clientDoc = await adminDb.collection('riders').doc(rideData.riderId).get();
        clientName = clientDoc.data()?.fullName ?? 'Client inconnu';
      }
      
      // Obtenir le nom du chauffeur
      let driverName = 'Non assigné';
      if (rideData.driverId) {
        const driverDoc = await adminDb.collection('drivers').doc(rideData.driverId).get();
        driverName = driverDoc.data()?.fullName ?? 'Chauffeur inconnu';
      }
      
      return {
        id: doc.id,
        client: clientName,
        driver: driverName,
        pickup: rideData.pickupAddress,
        destination: rideData.destinationAddress,
        status: rideData.status,
        time: (rideData.createdAt.toDate() as Date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        amount: `${rideData.estimatedPrice.toFixed(0)} CDF`,
      };
    })
  );

  return bookings;
}

// --- FONCTION POUR LES TOP CHAUFFEURS ---
export async function getTopDrivers() {
  // La logique ici peut être complexe (ex: agréger les courses par chauffeur).
  // Pour commencer, on retourne les chauffeurs avec le plus haut rating.
  const driversSnapshot = await adminDb
    .collection('drivers')
    // .orderBy('rating', 'desc')
    .limit(3)
    .get();
    
  if (driversSnapshot.empty) {
    return [];
  }
  
  return driversSnapshot.docs.map(doc => {
    const driverData = doc.data();
    return {
      name: driverData.fullName,
      trips: driverData.totalRides ?? 0,
      rating: driverData.rating ?? 0,
      earnings: `${(driverData.totalEarnings ?? 0).toFixed(0)} CDF`,
    };
  });
}

export async function getDrivers({ search, status }: GetDriversParams): Promise<SerializableDriver[]> {
  const query: FirebaseFirestore.Query = adminDb.collection('drivers');
  console.log(search, status);
  
//   if (status && status !== 'all') {
//     query = query.where('status', '==', status);
//   }

  // NOTE SUR LA RECHERCHE: Firestore ne permet pas de recherche "texte partiel" (comme SQL LIKE).
  // La recherche sur le nom, l'email, etc. est complexe.
  // Pour une vraie application, on utiliserait un service tiers comme Algolia ou Typesense,
  // synchronisé avec Firestore via des Cloud Functions.
  // Pour commencer, nous allons ignorer la recherche côté serveur et la faire côté client sur les données chargées.

  // Exécuter la requête
  const snapshot = await query.get();
    // Vérifier si des documents ont été trouvés
  if (snapshot.empty) {
    return [];
  }

  const drivers: SerializableDriver[] = snapshot.docs.map(doc => {
    const driver = createDriverFromFirestore(doc);

    return {
      id: driver.id,
      driverID: driver.driverID,
      fullName: driver.fullName,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      profilePictureUrl: driver.profilePictureUrl,
      status: driver.status,
      isOnline: driver.isOnline,
      rating: driver.rating,
      totalRides: driver.totalRides,
      totalEarnings: driver.totalEarnings,
      
      // Conversion de GeoPoint
      currentLocation: driver.currentLocation
        ? { latitude: driver.currentLocation.latitude, longitude: driver.currentLocation.longitude }
        : undefined,
        
      currentBearing: driver.currentBearing,
      
      // Conversion de Timestamp en string (format ISO)
      locationTimestamp: driver.locationTimestamp?.toDate().toISOString(),
      
      vehicleDetails: driver.vehicleDetails, // C'est déjà un objet simple
      documents: driver.documents, // C'est déjà un objet simple
      
      // Conversion de Timestamp en string
      createdAt: driver.createdAt.toDate().toISOString(),
      updatedAt: driver.updatedAt?.toDate().toISOString(),
    };
});

  return drivers;
}

// type Period = 'day' | 'week' | 'month';

export async function getAnalyticsData(
  // period: Period
) {
  // let startDate: Date;
  const endDate = new Date();

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  // switch (period) {
  //   case 'day':
  //     startDate = new Date();
  //     startDate.setHours(0, 0, 0, 0);
  //     break;
  //   case 'week':
  //     startDate = new Date();
  //     startDate.setDate(endDate.getDate() - 7);
  //     break;
  //   case 'month':
  //     startDate = new Date();
  //     startDate.setDate(endDate.getDate() - 30);
  //     break;
  // }
  
  // Requête pour obtenir toutes les courses terminées dans la période
  const ridesSnapshot = await adminDb.collection('rides')
    .where('status', '==', 'completed')
    .where('createdAt', '>=', Timestamp.fromDate(startDate))
    .where('createdAt', '<=', Timestamp.fromDate(endDate))
    .get();
    
  const rides = ridesSnapshot.docs.map(doc => doc.data());
  
  // --- Calculs d'agrégation ---
  
  // 1. Total des revenus et nombre de courses
  const totalRevenue = rides.reduce((sum, ride) => sum + (ride.estimatedPrice || 0), 0);
  const totalRides = rides.length;

  // 2. Données pour le graphique des revenus par jour
  const revenueByDay = rides.reduce((acc, ride) => {
    const date = ride.createdAt.toDate().toISOString().split('T')[0]; // Format YYYY-MM-DD
    acc[date] = (acc[date] || 0) + ride.estimatedPrice;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(revenueByDay)
    .map(([date, revenue]) => ({ name: date, Revenus: revenue }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  // 3. Distance totale et durée totale
  const totalDistanceKm = rides.reduce((sum, ride) => sum + (ride.distance || 0), 0) / 1000;
  // const totalDurationHours = rides.reduce((sum, ride) => sum + (ride.duration || 0), 0) / 3600;

  // 4. Note moyenne des courses (si vous stockez la note sur la course)
  const averageRating = 4.8; // Mock pour l'instant

  return {
    totalRevenue,
    totalRides,
    totalDistanceKm,
    averageRating,
    chartData,
  };
}

export async function getUsersPageData({ search }: GetUsersParams) {
  const usersRef = adminDb.collection('users');
  const snapshot = await usersRef.orderBy('createdAt', 'desc').get();

  let users: SerializableUser[] = [];
  if (!snapshot.empty) {
    users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fullName: data.displayName ?? 'Nom inconnu',
        email: data.email,
        phoneNumber: data.phoneNumber ?? 'N/A',
        photoUrl: data.photoUrl,
        status: data.status ?? 'active',
        totalTrips: data.totalTrips ?? 0, // Ces champs devront être agrégés
        totalSpent: data.totalSpent ?? 0, // ou stockés dans le document utilisateur
        averageRating: data.averageRating ?? 0,
        createdAt: (data.createdAt?.toDate() as Date)?.toISOString() ?? new Date().toISOString(),
        lastTripDate: (data.lastTripDate?.toDate() as Date)?.toISOString(),
      };
    });
  }
  
  // La recherche se fait côté serveur pour ne pas charger toutes les données
  if (search) {
    const searchTerm = search.toLowerCase();
    users = users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.phoneNumber.includes(searchTerm)
    );
  }

  // Calcul des statistiques globales
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);
  const totalTrips = users.reduce((sum, user) => sum + user.totalTrips, 0);

  return {
    stats: {
      totalUsers,
      activeUsers,
      totalRevenue,
      totalTrips,
    },
    users,
  };
}