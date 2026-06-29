import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMt9Iv4M24XowEg7O7X32J0EKl4uMCLjo",
  authDomain: "contextbridge-6dc57.firebaseapp.com",
  projectId: "contextbridge-6dc57",
  storageBucket: "contextbridge-6dc57.firebasestorage.app",
  messagingSenderId: "718721570110",
  appId: "1:718721570110:web:1ac187913f68e3a2e9486f",
  measurementId: "G-SRZXDFEH4N",
};

// Prevent duplicate initialization across hot-reloads and React Strict Mode
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const storage = getStorage(app);

type LongPollingFirestoreSettings = Parameters<typeof initializeFirestore>[1] & {
  experimentalForceLongPolling: boolean;
  useFetchStreams: boolean;
};

// Safe Firestore initialization to prevent duplicate initialization during hot-reloads
// Also forces long-polling and disables fetch streams to bypass corporate proxies/WS blocks
let firestoreDb;
try {
  const firestoreSettings: LongPollingFirestoreSettings = {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  };

  if (typeof window !== "undefined") {
    firestoreSettings.localCache = persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    });
  }

  firestoreDb = initializeFirestore(app, firestoreSettings);
} catch {
  // If already initialized (e.g. during Next.js Hot Reload), fallback to existing instance
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
export default app;
