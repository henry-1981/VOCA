"use client";

import { useState } from "react";
import Link from "next/link";
import { DayCompleteCelebration } from "@/components/effects/day-complete-celebration";
import { LevelUpOverlay } from "@/components/effects/level-up-overlay";

export default function EffectsPreviewPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/design-preview"
          className="text-xs font-bold text-slate-400 hover:text-white"
        >
          &larr; Back to previews
        </Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight">Effects Preview</h1>
        <p className="mt-2 text-sm text-slate-400">
          게이미피케이션 이펙트를 개별 트리거합니다.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowCelebration(true)}
            className="rounded-xl bg-amber-600 px-6 py-3 font-bold text-white transition hover:bg-amber-500"
          >
            Day Complete Celebration
          </button>
          <button
            onClick={() => setShowLevelUp(true)}
            className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500"
          >
            Level Up Overlay
          </button>
        </div>
      </div>

      {showCelebration && (
        <DayCompleteCelebration
          dayTitle="Day 03"
          totalXp={150}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {showLevelUp && (
        <LevelUpOverlay
          newLevel={8}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </main>
  );
}
