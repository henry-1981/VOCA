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

  try {
    // Wait for Firebase Auth to restore session (with 5s timeout for iPad Safari)
    const user = await withTimeout(resolveFirebaseUserAfterRedirect(), 5000);

    if (!user) {
      return {
        status: "stale_binding",
        binding,
        reason: "Firebase auth session not available. Please re-provision."
      };
    }

    const registered = await withTimeout(
      getRegisteredDeviceBinding(binding.familyId, binding.deviceId),
      5000
    );

    if (!registered) {
      return {
        status: "stale_binding",
        binding,
        reason: "Device registry does not match the local binding"
      };
    }

    // Same family, different child = local profile switch — not stale
    if (registered.childId !== binding.childId) {
      await registerDeviceBinding({ ...binding });
    }

    const childSnapshot = await withTimeout(
      getDoc(childDocRef(getFirebaseDb(), binding.familyId, binding.childId)),
      5000
    );

    if (!childSnapshot || !childSnapshot.exists()) {
      return {
        status: "stale_binding",
        binding,
        reason: "Child profile no longer exists in Firestore"
      };
    }

    return {
      status: "ready",
      binding,
      registryChecked: true
    };
  } catch (error) {
    return {
      status: "unavailable",
      binding,
      reason:
        error instanceof Error ? error.message : "Failed to validate device binding"
    };
  }
}
