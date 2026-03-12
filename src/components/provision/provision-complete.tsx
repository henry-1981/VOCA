"use client";

import { useEffect, useState } from "react";
import { getOrCreateDeviceId, saveDeviceBinding } from "@/lib/device/device-binding";
import { watchFirebaseUser } from "@/lib/firebase/auth";
import {
  clearProvisioningDraft,
  loadProvisioningDraft
} from "@/lib/firebase/provisioning-draft";
import { provisionFamily } from "@/lib/firebase/provision-family";

type ProvisionStatus =
  | "idle"
  | "waiting_for_auth"
  | "provisioning"
  | "done"
  | "error";

export function ProvisionComplete() {
  const [status, setStatus] = useState<ProvisionStatus>("waiting_for_auth");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = watchFirebaseUser((user) => {
      const draft = loadProvisioningDraft();

      if (!user || !draft) {
        return;
      }

      setStatus("provisioning");
      setMessage("가족과 기기 연결을 만드는 중입니다.");

      void provisionFamily({
        familyName: draft.familyName,
        children: draft.children,
        selectedChildIndex: draft.selectedChildIndex,
        deviceId: draft.deviceId || getOrCreateDeviceId(),
        ownerUid: user.uid
      })
        .then((payload) => {
          saveDeviceBinding({
            deviceId: payload.deviceBinding.deviceId,
            familyId: payload.deviceBinding.familyId,
            childId: payload.deviceBinding.childId,
            boundAt: payload.deviceBinding.boundAt,
            lastValidatedAt: payload.deviceBinding.lastValidatedAt
          });
          clearProvisioningDraft();
          setStatus("done");
          setMessage("가족 연결이 완료되었습니다. 홈으로 이동합니다.");
          window.setTimeout(() => {
            window.location.href = "/";
          }, 1200);
        })
        .catch((error) => {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Provisioning failed");
        });
    });

    return () => unsubscribe();
  }, []);

  if (status === "idle" || status === "waiting_for_auth") {
    return null;
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-950">
      <p className="font-semibold">Provision status</p>
      <p className="mt-2">{message}</p>
    </section>
  );
}
