import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentSingleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function getMissingFirebaseEnvKeys() {
  return Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function hasFirebaseEnv() {
  return getMissingFirebaseEnvKeys().length === 0;
}

function assertFirebaseEnv() {
  const missing = getMissingFirebaseEnvKeys();

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missing.join(", ")}`);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  assertFirebaseEnv();

  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

let dbInitialized = false;

export function getFirebaseDb() {
  const app = getFirebaseApp();

  if (!dbInitialized) {
    try {
      // iOS Safari PWA standalone mode has IndexedDB reliability issues
      // that cause persistentLocalCache to hang on initialization,
      // blocking all Firestore queries indefinitely. Use memoryLocalCache
      // as a workaround — each app launch hits Firestore cold but avoids hangs.
      const isPwaStandalone =
        typeof window !== "undefined" &&
        window.matchMedia("(display-mode: standalone)").matches;

      initializeFirestore(app, {
        localCache: isPwaStandalone
          ? memoryLocalCache()
          : persistentLocalCache({
              tabManager: persistentSingleTabManager({ forceOwnership: true })
            })
      });
    } catch {
      // Already initialized — fall through to getFirestore()
    }
    dbInitialized = true;
  }

  return getFirestore(app);
}
