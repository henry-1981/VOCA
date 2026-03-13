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

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <div>
        <p className="text-sm font-semibold text-slate-500">Provisioning</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          가족 프로필과 기기 연결
        </h1>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">가족 이름</span>
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3"
          onChange={(event) => setFamilyName(event.target.value)}
          value={familyName}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">아이 1</span>
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            onChange={(event) => setChildAName(event.target.value)}
            value={childAName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">아이 2</span>
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            onChange={(event) => setChildBName(event.target.value)}
            value={childBName}
          />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold text-slate-700">
          이 iPad는 누구의 기기인가요?
        </legend>
        <label className="flex items-center gap-3">
          <input
            checked={selectedChildIndex === 0}
            name="selected-child"
            onChange={() => setSelectedChildIndex(0)}
            type="radio"
          />
          <span>{childAName}</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            checked={selectedChildIndex === 1}
            name="selected-child"
            onChange={() => setSelectedChildIndex(1)}
            type="radio"
          />
          <span>{childBName}</span>
        </label>
      </fieldset>

      <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        현재 기기 기본 ID: {defaultDeviceId}
      </p>

      {!firebaseReady ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
          <p className="font-semibold">Firebase env가 아직 없습니다</p>
          <p className="mt-2">실제 Google 로그인과 Firestore round-trip 검증은 아직 진행할 수 없습니다.</p>
          <ul className="mt-3 list-disc pl-5">
            {missingKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        className="big-button border-0 bg-slate-950 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={!firebaseReady}
        onClick={async () => {
          if (!firebaseReady) {
            return;
          }

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
            setPopupMessage(
              error instanceof Error ? error.message : "Google 로그인에 실패했습니다."
            );
          }
        }}
        type="button"
      >
        Google 로그인으로 시작
      </button>

      <button
        className="big-button border-0 bg-white text-slate-950 ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        disabled={!firebaseReady}
        onClick={() => {
          if (!firebaseReady) {
            return;
          }

          saveProvisioningDraft({
            familyName,
            children: [childAName, childBName],
            selectedChildIndex,
            deviceId: getOrCreateDeviceId() || defaultDeviceId
          });
          void signInWithGoogleRedirect();
        }}
        type="button"
      >
        리디렉트 방식으로 시도 (팝업 차단 시)
      </button>

      {popupMessage ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          {popupMessage}
        </div>
      ) : null}
    </section>
  );
}
