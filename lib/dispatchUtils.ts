import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebase/admin';
import * as geofire from 'geofire-common';

const db = adminDb;
// ============================================================================
// FONCTION UTILITAIRE DE RECHERCHE DE CHAUFFEURS
// ============================================================================
/**
 * Recherche les chauffeurs disponibles à proximité d'un point donné.
 * @param center Les coordonnées [latitude, longitude] du point de recherche.
 * @param excludedDriverIds Une liste d'IDs de chauffeurs à ignorer dans la recherche (ceux déjà contactés).
 * @returns Une promesse qui se résout avec une liste triée d'IDs de chauffeurs.
 */
export async function findAvailableDrivers(center: [number, number], excludedDriverIds: string[] = []): Promise<string[]> {
    console.log(`Recherche de chauffeurs autour de [${center.join(',')}] en excluant ${excludedDriverIds.length} chauffeur(s).`);
    
    const radiusInM = 10 * 1000; // Rayon de 10 km
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises: Promise<admin.firestore.QuerySnapshot>[] = [];

    for (const b of bounds) {
      const q = db.collection("drivers")
        .where("isApproved", "==", true)
        .where("presence.status", "==", "ONLINE")
        .where("dispatchStatus", "==", "AVAILABLE")
        .orderBy("location.geohash")
        .startAt(b[0])
        .endAt(b[1]);
      promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const potentialDrivers: { id: string; distanceInKm: number }[] = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
          // On s'assure de ne pas rajouter un chauffeur qu'on a déjà contacté.
          if (excludedDriverIds.includes(doc.id)) {
              continue;
          }

          const driverData = doc.data();
          // Vérification de sécurité pour éviter les crashs si les données sont mal formées
          if (!driverData.location?.geoPoint) continue;

          const driverLocation = driverData.location.geoPoint as admin.firestore.GeoPoint;
          const distanceInKm = geofire.distanceBetween([driverLocation.latitude, driverLocation.longitude], center);

          if (distanceInKm <= radiusInM / 1000) {
              potentialDrivers.push({ id: doc.id, distanceInKm });
          }
      }
    }
    
    potentialDrivers.sort((a, b) => a.distanceInKm - b.distanceInKm);
    console.log(`${potentialDrivers.length} chauffeurs potentiels trouvés dans la recherche.`);
    return potentialDrivers.map(d => d.id);
}