import 'server-only';
import { cookies } from 'next/headers'; // Assurez-vous que l'import vient bien de 'next/headers'
import { SignJWT, jwtVerify } from 'jose';
import { adminAuth } from '@/lib/firebase/admin';

const secretKey = process.env.SESSION_SECRET_KEY;
if (!secretKey) {
  throw new Error("SESSION_SECRET_KEY is not set in .env.local");
}
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: { uid: string, email?: string, expires: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    console.error('Erreur lors de la décryption de la session:', error);
    // Si la décryption échoue, on retourne null
    // Cela peut être dû à un token expiré ou invalide
    return null;
  }
}

// --- Fonction de création de session (pas de changement majeur) ---
export async function createSession(idToken: string) {  
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  
  if (decodedToken.admin !== true) {
    // Si l'utilisateur n'a pas le claim { admin: true }, on lève une erreur.
    throw new Error('Accès non autorisé : droits administrateur requis.');
  }
  
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionData = { uid: decodedToken.uid, email: decodedToken.email, expires };
  
  // Chiffrer la session
  const session = await encrypt(sessionData);

  // --- CORRECTION ET CLARIFICATION ---
  // On récupère l'instance des cookies
  const cookieStore = cookies();
  
  // On utilise la méthode .set() sur l'instance
  (await
        // On utilise la méthode .set() sur l'instance
        cookieStore).set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/', // Bonne pratique : définir le chemin du cookie
  });
}

// --- Fonctions pour récupérer et supprimer la session ---
export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  return await decrypt(sessionCookie);
}

export async function deleteSession() {
  (await cookies()).set('session', '', { expires: new Date(0) });
}