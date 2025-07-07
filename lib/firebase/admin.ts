// lib/firebase/admin.ts
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!serviceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set or invalid.");
}

if (!getApps().length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("Firebase Admin SDK initialized.");
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "stack" in error) {
      console.error('Firebase admin initialization error', (error as { stack?: string }).stack);
    } else {
      console.error('Firebase admin initialization error', error);
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminAppCheck = admin.appCheck();
// export const adminStorage = admin.storage();