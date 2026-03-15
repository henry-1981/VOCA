"use client";

import { useState } from "react";
import { getOrCreateDeviceId } from "@/lib/device/device-binding";
import { saveDeviceBinding } from "@/lib/device/device-binding";
import { getMissingFirebaseEnvKeys, hasFirebaseEnv } from "@/lib/firebase/client";
import { ensureAnonymousAuth } from "@/lib/firebase/auth";
import { provisionFamily } from "@/lib/firebase/provision-family";
import { clearProvisioningDraft } from "@/lib/firebase/provisioning-draft";

type FamilyProvisionFormProps = {
  defaultDeviceId?: string;
};

type LogEntry = { time: string; msg: string };

function ts() {
  return new Date().toLocaleTimeString("ko-KR", { hour12: false });
}

export function FamilyProvisionForm({
  defaultDeviceId = "ipad-a"
}: FamilyProvisionFormProps) {
  const [familyName, setFamilyName] = useState("BrideVOCA Family");
  const [childAName, setChildAName] = useState("다온");
  const [childBName, setChildBName] = useState("지온");
  const [selectedChildIndex, setSelectedChildIndex] = useState<0 | 1>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const firebaseReady = hasFirebaseEnv();
  const missingKeys = getMissingFirebaseEnvKeys();

  function log(msg: string) {
    setLogs((prev) => [...prev, { time: ts(), msg }]);
  }

  async function completeProvision(uid: string, deviceId: string) {
    log(`[provision] uid=${uid.slice(0, 8)}…`);
    const payload = await provisionFamily({
      familyName,
      children: [childAName, childBName],
      selectedChildIndex,
      deviceId,
      ownerUid: uid
    });
    log(`[provision] familyId=${payload.family.id.slice(0, 8)}…`);

    saveDeviceBinding({
      deviceId: payload.deviceBinding.deviceId,
      familyId: payload.deviceBinding.familyId,
      childId: payload.deviceBinding.childId,
      boundAt: payload.deviceBinding.boundAt,
      lastValidatedAt: payload.deviceBinding.lastValidatedAt
    });
    clearProvisioningDraft();
    log("[done] binding saved → redirecting home");

    window.setTimeout(() => {
      window.location.href = "/";
    }, 800);
  }

  async function handleStart() {
    if (!firebaseReady || busy) return;
    setBusy(true);
    setLogs([]);
    const deviceId = getOrCreateDeviceId() || defaultDeviceId;
    try {
      log("[auth] 익명 인증 시도...");
      const user = await ensureAnonymousAuth();
      log(`[auth] 성공: uid=${user.uid.slice(0, 8)}…`);
      await completeProvision(user.uid, deviceId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      log(`[auth] 실패: ${msg}`);
    } finally {
      setBusy(false);
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
          <ul className="mt-3 list-disc pl-5 text-amber-200/70">
            {missingKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        className="big-button border-0 bg-violet-600 text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
        disabled={!firebaseReady || busy}
        onClick={() => void handleStart()}
        type="button"
      >
        설정 시작
      </button>

      {/* Diagnostic log */}
      {logs.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-white/40">진단 로그</p>
          <div className="flex flex-col gap-1 font-mono text-xs text-white/70">
            {logs.map((entry, i) => (
              <p key={i}>
                <span className="text-white/30">{entry.time}</span>{" "}
                {entry.msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
