// Ce script utilise la syntaxe CommonJS (require) pour être exécuté directement avec Node.js
const admin = require('firebase-admin');

// IMPORTANT : Ce script s'attend à ce que vos identifiants soient dans un fichier.
// Il ne lira pas le .env.local.
const serviceAccount = require('./firebase-service-account.json');

// Initialiser le SDK Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// --- À MODIFIER ---
const uid = 'axHCvAobxjR7SdTtVkwZN5mlpqq2';
// -----------------

// Définir le custom claim { admin: true } pour cet utilisateur
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`\n✅ Succès ! Le Custom Claim { admin: true } a été ajouté à l'utilisateur ${uid}.`);
    console.log("Vous pouvez maintenant vous connecter au panneau d'administration avec cet utilisateur.");
    process.exit(0); // Quitter le script avec succès
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de la définition du Custom Claim:', error);
    process.exit(1); // Quitter le script avec une erreur
  });