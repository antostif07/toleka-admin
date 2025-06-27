// functions/src/index.ts
import { https } from "firebase-functions";
import next from "next";

const isDev = process.env.NODE_ENV !== "production";

// On indique au serveur Next où se trouve notre projet principal
const server = next({
  dev: isDev,
  // Le chemin est relatif au dossier 'functions' où ce code s'exécute
  conf: { distDir: ".next" },
});

const nextjsHandle = server.getRequestHandler();

export const nextServer = https.onRequest((req, res) => {
  // On prépare le serveur Next.js et on lui passe la requête
  return server.prepare().then(() => nextjsHandle(req, res));
});