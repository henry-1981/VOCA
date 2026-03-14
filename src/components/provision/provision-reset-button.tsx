"use client";

import { useState } from "react";
import { signOutFirebaseUser } from "@/lib/firebase/auth";
import { resetProvisionState } from "@/lib/reset/reset-provision-state";

export function ProvisionResetButton() {
  const [status, setStatus] = useState<"idle" | "confirming" | "done">("idle");

  if (status === "done") {
    return (
      <section className="rounded-2xl border border-emerald-300/20 bg-emerald-950/30 px-4 py-4 text-center text-sm text-emerald-100 backdrop-blur-sm">
        초기화 완료. 페이지를 새로고침합니다...
      </section>
    );
  }

  if (status === "confirming") {
    return (
      <section className="rounded-2xl border border-red-400/20 bg-red-950/30 px-4 py-4 backdrop-blur-sm">
        <p className="text-sm font-semibold text-red-200">
          정말 초기화하시겠습니까?
        </p>
        <p className="mt-1 text-xs text-red-200/60">
          로컬 바인딩, mock 학습 데이터, Firebase 인증이 모두 삭제됩니다.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
            onClick={async () => {
              try {
                await signOutFirebaseUser();
              } catch {
                // ignore
              }
              resetProvisionState();
              // Clear all mock day stage data
              const keysToRemove: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("mock-day-stage:")) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach((key) => localStorage.removeItem(key));
              setStatus("done");
              window.setTimeout(() => {
                window.location.reload();
              }, 600);
            }}
          >
            초기화 실행
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70"
            onClick={() => setStatus("idle")}
          >
            취소
          </button>
        </div>
      </section>
    );
  }

  return (
    <button
      type="button"
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50 backdrop-blur-sm transition hover:bg-white/10 hover:text-white/70"
      onClick={() => setStatus("confirming")}
    >
      기기 데이터 초기화
    </button>
  );
}
