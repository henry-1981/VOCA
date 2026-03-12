"use client";

import { useEffect, useState } from "react";
import { signOutFirebaseUser } from "@/lib/firebase/auth";
import { resetProvisionState } from "@/lib/reset/reset-provision-state";

export function ResetAuthState() {
  const [message, setMessage] = useState("테스트 상태를 초기화하는 중입니다.");

  useEffect(() => {
    let active = true;

    void signOutFirebaseUser()
      .catch(() => {
        // ignore sign-out errors so local reset still proceeds
      })
      .finally(() => {
        resetProvisionState();

        if (!active) {
          return;
        }

        setMessage("초기화가 완료되었습니다. Provision 화면으로 이동합니다.");

        window.setTimeout(() => {
          window.location.href = "/provision";
        }, 800);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef3ff,_#fff_50%,_#f7fbff)] px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold text-slate-500">Reset</p>
        <h1 className="mt-2 text-3xl font-black">인증/바인딩 상태 초기화</h1>
        <p className="mt-4 text-slate-700">{message}</p>
      </div>
    </main>
  );
}
