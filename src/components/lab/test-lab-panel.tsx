"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  clearDeviceBinding,
  getOrCreateDeviceId,
  loadDeviceBinding,
  saveDeviceBinding
} from "@/lib/device/device-binding";
import {
  getMissingFirebaseEnvKeys,
  hasFirebaseEnv
} from "@/lib/firebase/client";
import {
  signInWithGoogleRedirect,
  signOutFirebaseUser,
  watchFirebaseUser
} from "@/lib/firebase/auth";
import { buildChildHref } from "@/lib/navigation/child-href";

type AuthSummary = {
  uid?: string;
  email?: string | null;
};

export function TestLabPanel() {
  const [authSummary, setAuthSummary] = useState<AuthSummary | null>(null);
  const firebaseReady = hasFirebaseEnv();
  const missingKeys = getMissingFirebaseEnvKeys();
  const subscribe = (callback: () => void) => {
    window.addEventListener("lab-binding-change", callback);
    return () => window.removeEventListener("lab-binding-change", callback);
  };
  const deviceId = useSyncExternalStore(subscribe, () => getOrCreateDeviceId(), () => "");
  const binding = useSyncExternalStore(
    subscribe,
    () => loadDeviceBinding(),
    () => null
  );

  useEffect(() => {
    const unsubscribe = watchFirebaseUser((user) => {
      setAuthSummary(
        user
          ? {
              uid: user.uid,
              email: user.email
            }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  function bindChild(childId: "다온" | "지온") {
    saveDeviceBinding({
      familyId: "mock-family",
      childId,
      deviceId: getOrCreateDeviceId()
    });
    window.dispatchEvent(new Event("lab-binding-change"));
  }

  function clearBinding() {
    clearDeviceBinding();
    window.dispatchEvent(new Event("lab-binding-change"));
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f2f5ff,_#fff_45%,_#f8fbff)] px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">Lab</p>
          <h1 className="text-4xl font-black">Firebase 테스트 환경</h1>
          <p className="text-sm text-slate-600">
            실사용 검증 전에 env, auth, binding, child 진입 상태를 한 화면에서 확인합니다.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Firebase env</p>
            <p className="mt-2 text-xl font-black">
              {firebaseReady ? "READY" : "MISSING"}
            </p>
            {!firebaseReady ? (
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                {missingKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            ) : null}
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Current auth</p>
            <p className="mt-2 text-sm text-slate-700">
              {authSummary ? `${authSummary.email ?? "email 없음"} / ${authSummary.uid}` : "로그인 안 됨"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                disabled={!firebaseReady}
                onClick={() => void signInWithGoogleRedirect()}
                type="button"
              >
                Google 로그인
              </button>
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200"
                disabled={!authSummary}
                onClick={() => void signOutFirebaseUser()}
                type="button"
              >
                로그아웃
              </button>
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Device</p>
            <p className="mt-2 text-sm text-slate-700">{deviceId || "생성 중..."}</p>
            <p className="mt-4 text-sm font-semibold text-slate-500">Local binding</p>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200">
              {binding ? JSON.stringify(binding, null, 2) : "없음"}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => bindChild("다온")}
                type="button"
              >
                다온 바인딩
              </button>
              <button
                className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => bindChild("지온")}
                type="button"
              >
                지온 바인딩
              </button>
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200"
                onClick={clearBinding}
                type="button"
              >
                바인딩 초기화
              </button>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Quick links</p>
            <div className="mt-4 grid gap-3">
              <Link className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200" href="/">
                허브 열기
              </Link>
              <Link
                className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
                href={buildChildHref({ pathname: "/today", childId: binding?.childId, params: { day: binding?.childId === "지온" ? "day-003" : "day-005" } })}
              >
                Today 열기
              </Link>
              <Link
                className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
                href={buildChildHref({ pathname: "/history", childId: binding?.childId })}
              >
                History 열기
              </Link>
              <Link
                className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
                href={buildChildHref({ pathname: "/review", childId: binding?.childId })}
              >
                Review 열기
              </Link>
              <Link
                className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
                href={buildChildHref({ pathname: "/character", childId: binding?.childId })}
              >
                Character 열기
              </Link>
              <Link className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200" href="/provision">
                Provision 열기
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
