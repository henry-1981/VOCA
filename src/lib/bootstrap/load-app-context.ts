import { getDoc } from "firebase/firestore";
import { getRegisteredDeviceBinding, registerDeviceBinding } from "@/lib/firebase/device-registry";
import { getFirebaseDb, hasFirebaseEnv } from "@/lib/firebase/client";
import { resolveFirebaseUserAfterRedirect } from "@/lib/firebase/auth";
import { loadDeviceBinding } from "@/lib/device/device-binding";
import { childDocRef } from "@/lib/firebase/firestore";

export type AppBootstrapState =
  | {
      status: "loading";
      binding: null;
    }
  | {
      status: "needs_provision";
      binding: null;
    }
  | {
      status: "unavailable";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>> | null;
      reason: string;
    }
  | {
      status: "preview_ready";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>>;
      reason: string;
    }
  | {
      status: "stale_binding";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>>;
      reason: string;
    }
  | {
      status: "ready";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>>;
      registryChecked: boolean;
    };

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
  ]);
}

export async function loadAppContext(): Promise<AppBootstrapState> {
  const binding = loadDeviceBinding();

  if (!binding) {
    return {
      status: "needs_provision",
      binding: null
    };
  }

  if (!hasFirebaseEnv()) {
    return {
      status: "preview_ready",
      binding,
      reason: "Firebase environment is missing. Preview mode uses local mock state."
    };
  }

  // Binding exists + Firebase env ready → try online validation,
  // but NEVER block the user if validation fails.
  // The hub uses local mock data regardless, so auth/Firestore checks
  // are a nice-to-have, not a gate.
  try {
    const user = await withTimeout(resolveFirebaseUserAfterRedirect(), 2000);

    if (!user) {
      // Auth not available (iPad Safari PWA, session expired, etc.)
      // → proceed with binding as-is
      return {
        status: "ready",
        binding,
        registryChecked: false
      };
    }

    const registered = await withTimeout(
      getRegisteredDeviceBinding(binding.familyId, binding.deviceId),
      2000
    );

    if (!registered) {
      // Device not in Firestore registry — could be deleted or never synced.
      // Still proceed; the binding in localStorage is authoritative for UX.
      return {
        status: "ready",
        binding,
        registryChecked: false
      };
    }

    // Same family, different child = local profile switch — sync Firestore
    if (registered.childId !== binding.childId) {
      await registerDeviceBinding({ ...binding });
    }

    const childSnapshot = await withTimeout(
      getDoc(childDocRef(getFirebaseDb(), binding.familyId, binding.childId)),
      2000
    );

    if (!childSnapshot || !childSnapshot.exists()) {
      // Child doc missing — still proceed with local binding
      return {
        status: "ready",
        binding,
        registryChecked: false
      };
    }

    return {
      status: "ready",
      binding,
      registryChecked: true
    };
  } catch {
    // Any error during validation → proceed anyway
    return {
      status: "ready",
      binding,
      registryChecked: false
    };
  }
}
