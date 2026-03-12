import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
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
