import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  type User
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

const provider = new GoogleAuthProvider();

export function signInWithGoogleRedirect() {
  return signInWithRedirect(getFirebaseAuth(), provider);
}

export function watchFirebaseUser(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function signOutFirebaseUser() {
  return signOut(getFirebaseAuth());
}
