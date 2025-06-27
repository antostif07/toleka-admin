'use server';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Timestamp } from 'firebase-admin/firestore';

// 1. Définir un schéma de validation avec Zod (très recommandé pour la sécurité)
const driverSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  email: z.string().email("L'adresse email est invalide."),
  phone: z.string().min(9, "Le numéro de téléphone est requis."),
  
  // Véhicule
  vehicleModel: z.string().min(2, "Le modèle du véhicule est requis."),
  vehiclePlate: z.string().min(2, "La plaque d'immatriculation est requise."),
  vehicleColor: z.string().min(2, "La couleur est requise."),

  // On ajoutera les autres champs au fur et à mesure
});

// Type pour l'état de retour de l'action
export interface ActionState {
  errors?: z.ZodError['formErrors']['fieldErrors'];
  message?: string;
}

export async function createDriverAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState|undefined> {

  // 2. Transformer FormData en objet simple
  const rawData = Object.fromEntries(formData.entries());

  // 3. Valider les données avec Zod
  const validatedFields = driverSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("Validation échouée:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erreur de validation. Veuillez vérifier les champs.',
    };
  }
  
  const data = validatedFields.data;

  try {
    // 4. Créer l'utilisateur dans Firebase Authentication
    // On génère un mot de passe temporaire. L'admin devra le communiquer au chauffeur.
    const tempPassword = Math.random().toString(36).slice(-8);

    const newUserRecord = await adminAuth.createUser({
      email: data.email,
      emailVerified: true,
      phoneNumber: data.phone,
      password: tempPassword,
      displayName: `${data.firstName} ${data.lastName}`,
      disabled: false,
    });
    
    console.log("Utilisateur créé dans Auth:", newUserRecord.uid);
    console.log("Mot de passe temporaire:", tempPassword); // A AFFICHER DANS L'UI POST-CRÉATION

    // 5. Préparer les données pour Firestore
    const driverDataForFirestore = {
      driverID: `T${Math.floor(1000 + Math.random() * 9000)}`, // Générer un ID simple
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNumber: data.phone,
      profilePictureUrl: '', // À gérer avec l'upload de fichier
      
      status: 'pending_approval', // Le statut par défaut est "en attente"
      isOnline: false,
      rating: 5.0, // Note de départ
      totalRides: 0,
      totalEarnings: 0,
      
      vehicleDetails: {
        model: data.vehicleModel,
        licensePlate: data.vehiclePlate,
        color: data.vehicleColor,
      },

      createdAt: Timestamp.now(),
    };

    // 6. Créer le document dans Firestore avec l'UID de l'utilisateur comme ID de document
    await adminDb.collection('drivers').doc(newUserRecord.uid).set(driverDataForFirestore);
    
    console.log("Document chauffeur créé dans Firestore pour:", newUserRecord.uid);

  } catch (error: unknown) {
    console.error("Erreur lors de la création du chauffeur:", error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/email-already-exists') {
      return { message: 'Cette adresse e-mail est déjà utilisée.' };
    }
    return { message: "Une erreur serveur est survenue. Veuillez réessayer." };
  }

  // 7. Si tout réussit, on invalide le cache de la page des chauffeurs et on redirige
  revalidatePath('/dashboard/drivers');
  redirect('/dashboard/drivers');
}