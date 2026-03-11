import type { DeviceBinding } from "@/lib/types/domain";
import { loadCache, saveCache } from "@/lib/storage";

const DEVICE_ID_KEY = "device-id";
const DEVICE_BINDING_KEY = "device-binding";

export function getOrCreateDeviceId() {
  const existing = loadCache<string>(DEVICE_ID_KEY);

  if (existing) {
    return existing;
  }

  const created =
    globalThis.crypto?.randomUUID?.() ??
    `device-${Math.random().toString(36).slice(2, 10)}`;
  saveCache(DEVICE_ID_KEY, created);
  return created;
}

export function saveDeviceBinding(
  binding: Omit<DeviceBinding, "deviceId" | "boundAt" | "lastValidatedAt"> & {
    deviceId?: string;
    boundAt?: string;
    lastValidatedAt?: string;
  }
) {
  const now = new Date().toISOString();
  const normalized: DeviceBinding = {
    deviceId: binding.deviceId ?? getOrCreateDeviceId(),
    familyId: binding.familyId,
    childId: binding.childId,
    boundAt: binding.boundAt ?? now,
    lastValidatedAt: binding.lastValidatedAt ?? now
  };

  saveCache(DEVICE_BINDING_KEY, normalized);

  return normalized;
}

export function loadDeviceBinding() {
  return loadCache<DeviceBinding>(DEVICE_BINDING_KEY);
}

export function clearDeviceBinding() {
  saveCache<DeviceBinding | null>(DEVICE_BINDING_KEY, null);
}
