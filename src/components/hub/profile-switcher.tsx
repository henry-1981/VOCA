"use client";

import { useState } from "react";

type ProfileSwitcherProps = {
  currentChildName: string;
  onSwitch: () => void;
};

export function ProfileSwitcher({
  currentChildName,
  onSwitch
}: ProfileSwitcherProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div data-testid="profile-switcher" className="flex items-center gap-2">
      <span className="text-sm font-semibold text-amber-100/90">
        {currentChildName}
      </span>
      <button
        type="button"
        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-amber-200/90 transition hover:bg-white/18"
        onClick={() => setShowDialog(true)}
      >
        전환
      </button>

      {showDialog && (
        <div
          data-testid="switch-confirm-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-white/15 bg-[linear-gradient(180deg,_rgba(30,25,60,0.98),_rgba(15,12,35,0.98))] p-6 text-center shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-bold text-white">
              다른 아이로 전환할까요?
            </p>
            <p className="mt-2 text-sm text-white/60">
              현재 기기에 다른 아이의 프로필을 연결합니다.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold text-white/80 transition hover:bg-white/18"
                onClick={() => setShowDialog(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="rounded-full border border-amber-300/30 bg-amber-400/90 px-5 py-2 text-sm font-bold text-slate-900 shadow-[0_4px_14px_rgba(251,191,36,0.3)] transition hover:bg-amber-300"
                onClick={() => {
                  setShowDialog(false);
                  onSwitch();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
