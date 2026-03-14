"use client";

import { useState } from "react";
import { getOrCreateDeviceId } from "@/lib/device/device-binding";
import { saveDeviceBinding } from "@/lib/device/device-binding";
import { getMissingFirebaseEnvKeys, hasFirebaseEnv } from "@/lib/firebase/client";
import {
  signInWithGooglePopup,
  signInWithGoogleRedirect
} from "@/lib/firebase/auth";
import { provisionFamily } from "@/lib/firebase/provision-family";
import { saveProvisioningDraft } from "@/lib/firebase/provisioning-draft";

type FamilyProvisionFormProps = {
  defaultDeviceId?: string;
};

function isStandalonePwa() {
  if (typeof window === "undefined") return false;
  return (
    ("standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function FamilyProvisionForm({
  defaultDeviceId = "ipad-a"
}: FamilyProvisionFormProps) {
  const [familyName, setFamilyName] = useState("BrideVOCA Family");
  const [childAName, setChildAName] = useState("다온");
  const [childBName, setChildBName] = useState("지온");
  const [selectedChildIndex, setSelectedChildIndex] = useState<0 | 1>(0);
  const [popupMessage, setPopupMessage] = useState("");
  const firebaseReady = hasFirebaseEnv();
  const missingKeys = getMissingFirebaseEnvKeys();
  const isPwa = isStandalonePwa();

  function saveDraftAndRedirect() {
    const deviceId = getOrCreateDeviceId() || defaultDeviceId;
    saveProvisioningDraft({
      familyName,
      children: [childAName, childBName],
      selectedChildIndex,
      deviceId
    });
    void signInWithGoogleRedirect();
  }

  async function tryPopupLogin() {
    try {
      setPopupMessage("Google 로그인 중입니다...");
      const deviceId = getOrCreateDeviceId() || defaultDeviceId;
      const result = await signInWithGooglePopup();
      const payload = await provisionFamily({
        familyName,
        children: [childAName, childBName],
        selectedChildIndex,
        deviceId,
        ownerUid: result.user.uid
      });

      saveDeviceBinding({
        deviceId: payload.deviceBinding.deviceId,
        familyId: payload.deviceBinding.familyId,
        childId: payload.deviceBinding.childId,
        boundAt: payload.deviceBinding.boundAt,
        lastValidatedAt: payload.deviceBinding.lastValidatedAt
      });

      setPopupMessage("가족 연결 완료! 홈으로 이동합니다.");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      // Popup blocked or closed → fall back to redirect
      if (msg.includes("popup") || msg.includes("closed") || msg.includes("cancelled")) {
        setPopupMessage("팝업이 차단되어 리디렉트 방식으로 전환합니다...");
        window.setTimeout(() => saveDraftAndRedirect(), 500);
      } else {
        setPopupMessage(msg || "Google 로그인에 실패했습니다.");
      }
    }
  }

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div>
        <p className="text-sm font-semibold text-violet-300/70">Provisioning</p>
        <h1 className="mt-2 text-3xl font-black text-white">
          가족 프로필과 기기 연결
        </h1>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-white/70">가족 이름</span>
        <input
          className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/30 backdrop-blur-sm"
          onChange={(event) => setFamilyName(event.target.value)}
          value={familyName}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/70">아이 1</span>
          <input
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/30 backdrop-blur-sm"
            onChange={(event) => setChildAName(event.target.value)}
            value={childAName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/70">아이 2</span>
          <input
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/30 backdrop-blur-sm"
            onChange={(event) => setChildBName(event.target.value)}
            value={childBName}
          />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold text-white/70">
          이 iPad는 누구의 기기인가요?
        </legend>
        <label className="flex items-center gap-3 text-white/80">
          <input
            checked={selectedChildIndex === 0}
            name="selected-child"
            onChange={() => setSelectedChildIndex(0)}
            type="radio"
          />
          <span>{childAName}</span>
        </label>
        <label className="flex items-center gap-3 text-white/80">
          <input
            checked={selectedChildIndex === 1}
            name="selected-child"
            onChange={() => setSelectedChildIndex(1)}
            type="radio"
          />
          <span>{childBName}</span>
        </label>
      </fieldset>

      {!firebaseReady ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/30 px-4 py-4 text-sm text-amber-200">
          <p className="font-semibold">Firebase env가 아직 없습니다</p>
          <p className="mt-2 text-amber-200/70">실제 Google 로그인과 Firestore round-trip 검증은 아직 진행할 수 없습니다.</p>
          <ul className="mt-3 list-disc pl-5 text-amber-200/70">
            {missingKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        className="big-button border-0 bg-violet-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
        disabled={!firebaseReady}
        onClick={() => {
          if (!firebaseReady) return;
          if (isPwa) {
            // PWA standalone → popup doesn't work, use redirect directly
            saveDraftAndRedirect();
          } else {
            void tryPopupLogin();
          }
        }}
        type="button"
      >
        Google 로그인으로 시작
      </button>

      {popupMessage ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70">
          {popupMessage}
        </div>
      ) : null}
    </section>
  );
}
