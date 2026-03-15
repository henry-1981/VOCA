import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type User
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

export async function ensureAnonymousAuth(): Promise<User> {
  const auth = getFirebaseAuth();

  // Wait for Firebase Auth to restore session from persistence
  const existingUser = await new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (existingUser) return existingUser;

  const credential = await signInAnonymously(auth);
  return credential.user;
}

export function watchFirebaseUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function signOutFirebaseUser() {
  return signOut(getFirebaseAuth());
}
