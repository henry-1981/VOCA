import { doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import type {
  ChildProfile,
  DeviceBinding,
  Family,
  FamilyId
} from "@/lib/types/domain";
import { getFirebaseDb } from "./client";
import { paths } from "./firestore";

type ProvisionFamilyInput = {
  familyName: string;
  children: [string, string];
  deviceId: string;
  ownerUid?: string;
  selectedChildIndex?: 0 | 1;
  familyId?: FamilyId;
};

type ProvisionFamilyPayload = {
  family: Family;
  children: [ChildProfile, ChildProfile];
  deviceBinding: DeviceBinding;
};

function runtimeId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `runtime-${Math.random().toString(36).slice(2, 10)}`
  );
}

function toChildId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "") || runtimeId();
}

export function createFamilyProvisionPayload({
  familyName,
  children,
  deviceId,
  ownerUid = "pending-owner",
  selectedChildIndex = 0,
  familyId = runtimeId()
}: ProvisionFamilyInput): ProvisionFamilyPayload {
  const now = new Date().toISOString();
  const childProfiles: [ChildProfile, ChildProfile] = [
    {
      id: toChildId(children[0]),
      familyId,
      name: children[0],
      avatarRef: "avatar-1",
      themeKey: "violet-gold",
      currentDayId: null,
      createdAt: now
    },
    {
      id: toChildId(children[1]),
      familyId,
      name: children[1],
      avatarRef: "avatar-2",
      themeKey: "navy-starlight",
      currentDayId: null,
      createdAt: now
    }
  ];
  const selectedChild = childProfiles[selectedChildIndex];

  return {
    family: {
      id: familyId,
      name: familyName.trim(),
      ownerUid,
      childIds: childProfiles.map((child) => child.id),
      createdAt: now
    },
    children: childProfiles,
    deviceBinding: {
      deviceId,
      familyId,
      childId: selectedChild.id,
      boundAt: now,
      lastValidatedAt: now
    }
  };
}

export async function provisionFamily(input: ProvisionFamilyInput) {
  const payload = createFamilyProvisionPayload(input);
  const db = getFirebaseDb();

  await setDoc(doc(db, paths.family(payload.family.id)), {
    ...payload.family,
    updatedAt: serverTimestamp()
  });

  const batch = writeBatch(db);

  payload.children.forEach((child) => {
    batch.set(doc(db, paths.child(payload.family.id, child.id)), {
      ...child,
      updatedAt: serverTimestamp()
    });
  });

  batch.set(doc(db, paths.device(payload.family.id, payload.deviceBinding.deviceId)), {
    ...payload.deviceBinding,
    updatedAt: serverTimestamp()
  });

  await batch.commit();

  return payload;
}
