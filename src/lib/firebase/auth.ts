import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
  type User
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

const provider = new GoogleAuthProvider();

export function signInWithGoogleRedirect() {
  return signInWithRedirect(getFirebaseAuth(), provider);
}

export function signInWithGooglePopup() {
  return signInWithPopup(getFirebaseAuth(), provider);
}

export function resolveGoogleRedirectResult() {
  return getRedirectResult(getFirebaseAuth());
}

export function watchFirebaseUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function signOutFirebaseUser() {
  return signOut(getFirebaseAuth());
}

function waitForFirstAuthEvent(auth: Auth) {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function resolveFirebaseUserAfterRedirect() {
  const auth = getFirebaseAuth();

  if (typeof auth.authStateReady === "function") {
    await auth.authStateReady();
    return auth.currentUser;
  }

  return waitForFirstAuthEvent(auth);
}
