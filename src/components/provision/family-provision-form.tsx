"use client";

import { useState } from "react";
import { signInWithGoogleRedirect } from "@/lib/firebase/auth";

type FamilyProvisionFormProps = {
  defaultDeviceId?: string;
};

export function FamilyProvisionForm({
  defaultDeviceId = "ipad-a"
}: FamilyProvisionFormProps) {
  const [familyName, setFamilyName] = useState("BrideVOCA Family");
  const [childAName, setChildAName] = useState("다온");
  const [childBName, setChildBName] = useState("지온");

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

      <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        현재 기기 기본 ID: {defaultDeviceId}
      </p>

      <button
        className="big-button border-0 bg-slate-950 text-white"
        onClick={() => void signInWithGoogleRedirect()}
        type="button"
      >
        Google로 시작
      </button>
    </section>
  );
}
