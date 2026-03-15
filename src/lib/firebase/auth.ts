import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type Auth,
  type User
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

export async function ensureAnonymousAuth(): Promise<User> {
  const auth = getFirebaseAuth();
  const current = auth.currentUser;
  if (current) return current;

  const credential = await signInAnonymously(auth);
  return credential.user;
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
