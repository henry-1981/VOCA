import { getDoc, setDoc } from "firebase/firestore";
import type { DeviceBinding, DeviceId, FamilyId } from "@/lib/types/domain";
import { getFirebaseDb } from "./client";
import { deviceDocRef } from "./firestore";

export async function registerDeviceBinding(binding: DeviceBinding) {
  const ref = deviceDocRef(getFirebaseDb(), binding.familyId, binding.deviceId);

  await setDoc(ref, binding);
}

export async function getRegisteredDeviceBinding(
  familyId: FamilyId,
  deviceId: DeviceId
) {
  const ref = deviceDocRef(getFirebaseDb(), familyId, deviceId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}
