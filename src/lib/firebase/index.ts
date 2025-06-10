// src/lib/firebase/index.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Comentado pois não usaremos Firebase Auth

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializa o Firestore com cache ilimitado (ou outra configuração desejada)
// Mantido para o caso de Genkit ou outras funcionalidades ainda precisarem do Firestore
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// const auth = getAuth(app); // Comentado pois não usaremos Firebase Auth

// Exportar apenas o 'db' por enquanto, se 'auth' não for mais necessário em nenhum lugar.
// Se 'auth' for necessário para o Genkit ou outra parte, ele deve ser mantido.
// Por ora, como o foco é remover a autenticação de usuário, vou comentar.
export { db /* , auth */ };
