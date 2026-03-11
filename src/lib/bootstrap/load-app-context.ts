import { getDoc } from "firebase/firestore";
import { getRegisteredDeviceBinding } from "@/lib/firebase/device-registry";
import { getFirebaseDb, hasFirebaseEnv } from "@/lib/firebase/client";
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
      status: "stale_binding";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>>;
      reason: string;
    }
  | {
      status: "ready";
      binding: NonNullable<ReturnType<typeof loadDeviceBinding>>;
      registryChecked: boolean;
    };

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
      status: "unavailable",
      binding,
      reason: "Firebase environment is missing"
    };
  }

  try {
    const registered = await getRegisteredDeviceBinding(binding.familyId, binding.deviceId);

    if (!registered || registered.childId !== binding.childId) {
      return {
        status: "stale_binding",
        binding,
        reason: "Device registry does not match the local binding"
      };
    }

    const childSnapshot = await getDoc(
      childDocRef(getFirebaseDb(), binding.familyId, binding.childId)
    );

    if (!childSnapshot.exists()) {
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
