'use server'; // Marqueur pour une Server Action

import { redirect } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { createSession, deleteSession } from './session';

export interface ActionState {
  error?: string;
}

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    if (!email || !password) {
        return { error: 'Email et mot de passe requis.' };
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        await createSession(idToken);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "code" in e) {
        if (e.code === 'auth/invalid-credential') {
        return { error: 'Email ou mot de passe incorrect.' };
      }
    }
        console.error("Login Error:", e);
        return { error: 'Une erreur inattendue est survenue.' };
    }
    
    // Si la connexion réussit, on redirige côté serveur
    redirect('/admin');
}

export async function deconnect() {
  try {
    await auth.signOut();
    await deleteSession();
    redirect('/login');
  } catch (error) {
    console.error("Logout Error:", error);
  }
}