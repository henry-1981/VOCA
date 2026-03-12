"use client";

import { useEffect, useRef, useState } from "react";
import { getOrCreateDeviceId, saveDeviceBinding } from "@/lib/device/device-binding";
import {
  resolveGoogleRedirectResult,
  watchFirebaseUser
} from "@/lib/firebase/auth";
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
  const [message, setMessage] = useState("Google 로그인 완료를 기다리는 중입니다.");
  const hasProvisionedRef = useRef(false);

  async function runProvision(userId: string) {
    const draft = loadProvisioningDraft();

    if (!draft) {
      setStatus("error");
      setMessage("Provisioning draft를 찾지 못했습니다. 다시 /provision에서 시작해 주세요.");
      return;
    }

    if (hasProvisionedRef.current) {
      return;
    }

    hasProvisionedRef.current = true;
    setStatus("provisioning");
    setMessage("가족과 기기 연결을 만드는 중입니다.");

    try {
      const payload = await provisionFamily({
        familyName: draft.familyName,
        children: draft.children,
        selectedChildIndex: draft.selectedChildIndex,
        deviceId: draft.deviceId || getOrCreateDeviceId(),
        ownerUid: userId
      });

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
    } catch (error) {
      hasProvisionedRef.current = false;
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Provisioning failed");
    }
  }

  useEffect(() => {
    void resolveGoogleRedirectResult()
      .then((result) => {
        if (result?.user) {
          void runProvision(result.user.uid);
          return;
        }

        if (loadProvisioningDraft()) {
          setMessage("로그인은 되었지만 결과를 아직 감지하지 못했습니다. 필요하면 팝업 테스트를 시도해 주세요.");
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Google redirect result failed");
      });

    const unsubscribe = watchFirebaseUser((user) => {
      if (!user) {
        return;
      }

      void runProvision(user.uid);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-950">
      <p className="font-semibold">Provision status</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sky-700">{status}</p>
      <p className="mt-2">{message}</p>
    </section>
  );
}
