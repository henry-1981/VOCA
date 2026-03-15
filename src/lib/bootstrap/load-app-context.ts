import { getRegisteredDeviceBinding, registerDeviceBinding } from "@/lib/firebase/device-registry";
import { hasFirebaseEnv } from "@/lib/firebase/client";
import { ensureAnonymousAuth } from "@/lib/firebase/auth";
import { loadDeviceBinding } from "@/lib/device/device-binding";

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

// Background validation: sync device registry if needed.
// Never blocks boot — failures are silently ignored.
async function validateRegistryInBackground(
  binding: NonNullable<ReturnType<typeof loadDeviceBinding>>
) {
  try {
    const registered = await withTimeout(
      getRegisteredDeviceBinding(binding.familyId, binding.deviceId),
      2000
    );

    if (registered && registered.childId !== binding.childId) {
      await registerDeviceBinding({ ...binding });
    }
  } catch {
    // Silently ignore — registry sync is best-effort
  }
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

  // Auth is the only gate — get a user, then return ready immediately.
  // Registry/child validation runs in the background (never blocks boot).
  try {
    const user = await withTimeout(ensureAnonymousAuth(), 3000);

    if (user) {
      void validateRegistryInBackground(binding);
    }

    return {
      status: "ready",
      binding,
      registryChecked: false
    };
  } catch {
    return {
      status: "ready",
      binding,
      registryChecked: false
    };
  }
}
