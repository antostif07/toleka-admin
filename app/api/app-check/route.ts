// app/api/app-check/route.ts
import { adminAppCheck } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { appId, appProof } = await req.json();

    const secretKey = process.env.RECAPTCHA_V3_SECRET_KEY;
    // 1. Valider la "preuve" envoyée par l'application Flutter

    // C'est votre logique personnalisée pour s'assurer que la requête vient de votre application légitime.

    if (!appId || !appProof) {
        console.log('Missing appId or appProof' );
        
      return NextResponse.json({ error: 'Missing appId or appProof' }, { status: 400 });

    }


    if (appProof !== secretKey) {

      // Si la preuve ne correspond pas, c'est une tentative non autorisée

      console.warn('App Check: Invalid appProof received for appId:', appId);

      return NextResponse.json({ error: 'Unauthorized app proof' }, { status: 403 });

    }


    // 2. Générer le token App Check

    try {

      // L'appId doit correspondre à l'ID du bundle (Android) ou du package (iOS)

      // que vous avez enregistré dans la console Firebase pour votre app Flutter.

      // Par exemple : "com.tshiakani.toleka_client" ou "com.tshiakani.toleka_driver"

      const tokenResult = await adminAppCheck.createToken(appId, {

        ttlMillis: 60 * 60 * 1000, // Le token sera valide pendant 1 heure (en millisecondes)

      });


      return NextResponse.json({

        token: tokenResult.token,

        ttlMillis: tokenResult.ttlMillis,

      }, { status: 200 });


    } catch (error) {

      console.error('Error generating App Check token:', error);

      return NextResponse.json({ error: 'Failed to generate App Check token' }, {status: 500});
    }

}
// export async function POST(request: Request) {
//   try {
//     const { recaptchaToken } = await request.json();
//     if (!recaptchaToken) {
//       return NextResponse.json({ error: 'Token reCAPTCHA manquant' }, { status: 400 });
//     }

//     // --- 1. Vérifier le token reCAPTCHA v3 auprès de Google ---
//     const secretKey = process.env.RECAPTCHA_V3_SECRET_KEY;

//     // On prépare les données pour la requête POST
//     const formData = new URLSearchParams();
//     formData.append('secret', secretKey!);
//     formData.append('response', recaptchaToken);

//     const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: formData,
//     });
    
//     const googleResponseData = await googleResponse.json();
//     const { success, score, action } = googleResponseData;

//     // On vérifie que la vérification a réussi, que l'action est celle attendue, et que le score est suffisant
//     if (!success || action !== 'mobile_auth' || score < 0.5) {
//       console.warn("Vérification reCAPTCHA échouée :", googleResponseData);
//       return NextResponse.json({ error: 'Vérification reCAPTCHA échouée' }, { status: 403 });
//     }
    
//     console.log("✅ Vérification reCAPTCHA réussie avec un score de", score);

//     // --- 2. Si OK, créer un token App Check ---
//     const appId = process.env.FIREBASE_FLUTTER_APP_ID;
//     if (!appId) throw new Error("FIREBASE_FLUTTER_APP_ID n'est pas défini.");
    
//     // On utilise notre service App Check importé
//     const { token, ttlMillis } = await adminAppCheck.createToken(appId, {
//       ttlMillis: 3600 * 1000, // 1 heure
//     });

//     console.log("✅ Token App Check créé avec succès.");

//     // 3. On retourne le token au client Flutter
//     return NextResponse.json({ appCheckToken: token, ttl: ttlMillis });

//   } catch (error: unknown) {
//     const message = 'Erreur interne du serveur';

//     if (
//       typeof error === 'object' &&
//       error !== null &&
//       'message' in error &&
//       typeof (error as { message?: string }).message === 'string'
//     ) {
//       console.error("❌ Erreur API App Check:", (error as { message: string }).message);
//     } else {
//       console.error("❌ Erreur API App Check:", error);
//     }
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }