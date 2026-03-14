"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import { getScreenBackground, getProfileAccent } from "@/lib/theme/profile-themes";
import type { DayKind } from "@/lib/types/domain";
import { DaySelectorModal } from "./day-selector-modal";
import type { DayInfo } from "./day-selector-modal";

type TodayStageProps = {
  childId?: string;
  dayId: string;
  dayKind: DayKind;
  dayTitle: string;
  stage: "not_started" | "learn_completed" | "test_completed" | "completed";
  allDays?: DayInfo[];
};

export function TodayStage({
  childId,
  dayId,
  dayKind,
  dayTitle,
  stage,
  allDays
}: TodayStageProps) {
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showTransitionMessage, setShowTransitionMessage] = useState(stage === "learn_completed");

  useEffect(() => {
    if (!showTransitionMessage) return;
    const timer = setTimeout(() => {
      setShowTransitionMessage(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showTransitionMessage]);

  const accent = getProfileAccent(childId ?? "다온");
  const theme = {
    backgroundSrc: getScreenBackground("today", childId ?? "다온"),
    cardBorder: accent.cardBorder,
    cardBg: accent.cardBg,
    labelText: accent.labelText,
  };
  const isCheckpoint = dayKind === "checkpoint_test";
  const learnPrimary = !isCheckpoint && stage === "not_started";
  const testPrimary = !isCheckpoint && stage === "learn_completed";
  const dayComplete = stage === "test_completed" || stage === "completed";
  const progressLabels = isCheckpoint
    ? ["준비", "Checkpoint Test", "완료"]
    : ["시작 전", "Learn", "Test", "완료"];

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background image */}
      <Image alt="" className="object-cover" fill priority src={theme.backgroundSrc} />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(15,12,35,0.65)]" />
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        {/* ── HEADER BAR (compact, non-interactive status) ── */}
        <header className="shrink-0 px-8 pt-5 pb-2 md:px-12">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-white sm:text-3xl">{dayTitle}</h1>
              <div className="flex items-center gap-1.5">
                {progressLabels.map((label, index) => {
                  const active =
                    isCheckpoint
                      ? (stage === "not_started" && index === 0) ||
                        (!dayComplete && stage !== "not_started" && index === 1) ||
                        (dayComplete && index === 2)
                      : (stage === "not_started" && index === 0) ||
                        (stage === "learn_completed" && index === 2) ||
                        (dayComplete && index === 3) ||
                        (stage !== "not_started" && !testPrimary && index === 1);

                  return (
                    <span
                      key={label}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                        active
                          ? isCheckpoint
                            ? "bg-indigo-600 text-white"
                            : "bg-violet-600 text-white"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
            <Link
              className="inline-flex shrink-0 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-sm"
              href={buildChildHref({ pathname: "/", childId })}
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* ── MAIN AREA (centered action cards) ── */}
        <div className="flex flex-1 items-center justify-center px-8 pb-6 md:px-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">

            {/* Learn→Test transition message */}
            {showTransitionMessage && stage === "learn_completed" ? (
              <div
                className="animate-scale-bounce rounded-[1.5rem] border border-amber-300/30 bg-amber-500/20 px-5 py-4 text-center text-lg font-bold text-amber-100 shadow-[0_12px_30px_rgba(251,191,36,0.15)] backdrop-blur-sm"
                data-testid="transition-message"
                onClick={() => setShowTransitionMessage(false)}
              >
                학습 완료! 이제 테스트에 도전하세요
              </div>
            ) : null}

            {/* ── ACTION CARDS ── */}
            {!isCheckpoint ? (
              <div className="grid gap-5 md:grid-cols-2">
                {/* Learn action card */}
                <Link
                  className={`group relative overflow-hidden rounded-[2rem] border px-8 py-8 text-left transition active:scale-[0.98] ${
                    learnPrimary
                      ? "border-violet-400/40 bg-violet-600/80 shadow-[0_16px_40px_rgba(139,92,246,0.25)]"
                      : dayComplete
                        ? "border-white/10 bg-white/5 opacity-60"
                        : "border-white/15 bg-white/8"
                  } text-white backdrop-blur-sm`}
                  href={buildChildHref({
                    pathname: "/today/learn",
                    childId,
                    params: { day: dayId }
                  })}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${learnPrimary ? "text-violet-200" : "text-white/40"}`}>
                      Learn
                    </p>
                    {learnPrimary && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                        지금 시작
                      </span>
                    )}
                    {!learnPrimary && !dayComplete && (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                        완료
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-black sm:text-3xl">
                    {learnPrimary ? "단어 익히기" : "단어 학습 완료"}
                  </p>
                  <p className={`mt-3 text-base leading-7 ${learnPrimary ? "text-violet-100/80" : "text-white/50"}`}>
                    {learnPrimary
                      ? "단어 20개를 한 장씩 보며 발음과 뜻을 익힙니다."
                      : "다시 보기가 가능합니다."}
                  </p>
                  {/* Touch affordance: arrow */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-lg transition group-hover:translate-x-1 ${learnPrimary ? "text-violet-200" : "text-white/30"}`}>→</span>
                    <span className={`text-sm font-semibold ${learnPrimary ? "text-violet-200" : "text-white/30"}`}>
                      {learnPrimary ? "탭하여 입장" : "탭하여 다시 보기"}
                    </span>
                  </div>
                </Link>

                {/* Test action card */}
                <Link
                  className={`group relative overflow-hidden rounded-[2rem] border px-8 py-8 text-left transition active:scale-[0.98] ${
                    testPrimary
                      ? "border-slate-600 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))] shadow-[0_16px_40px_rgba(15,23,42,0.4)] animate-glow-pulse"
                      : dayComplete
                        ? "border-emerald-500/20 bg-emerald-950/30"
                        : "border-white/8 bg-white/4 opacity-50"
                  } text-white backdrop-blur-sm`}
                  data-testid="test-card"
                  href={buildChildHref({
                    pathname: "/test",
                    childId,
                    params: { day: dayId }
                  })}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${
                      testPrimary ? "text-slate-300" : dayComplete ? "text-emerald-300/70" : "text-white/30"
                    }`}>
                      Test
                    </p>
                    {testPrimary && (
                      <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                        문이 열림
                      </span>
                    )}
                    {dayComplete && (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                        완료
                      </span>
                    )}
                    {!testPrimary && !dayComplete && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/30">
                        잠김
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-black sm:text-3xl">
                    {testPrimary
                      ? "테스트 시작"
                      : dayComplete
                        ? "테스트 완료"
                        : "Learn 완료 후 열림"}
                  </p>
                  <p className={`mt-3 text-base leading-7 ${
                    testPrimary ? "text-slate-300" : dayComplete ? "text-emerald-200/60" : "text-white/30"
                  }`}>
                    {testPrimary
                      ? "4지선다 문제로 오늘 배운 단어를 테스트합니다."
                      : dayComplete
                        ? "결과를 다시 확인할 수 있습니다."
                        : "Learn에서 단어 20개를 모두 본 뒤 열립니다."}
                  </p>
                  {/* Touch affordance: arrow */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-lg transition group-hover:translate-x-1 ${
                      testPrimary ? "text-slate-300" : dayComplete ? "text-emerald-300/50" : "text-white/20"
                    }`}>→</span>
                    <span className={`text-sm font-semibold ${
                      testPrimary ? "text-slate-300" : dayComplete ? "text-emerald-300/50" : "text-white/20"
                    }`}>
                      {testPrimary ? "탭하여 입장" : dayComplete ? "탭하여 다시 보기" : "아직 잠겨 있음"}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              /* Checkpoint test — single action card */
              <Link
                className="group relative overflow-hidden rounded-[2rem] border border-indigo-500/40 bg-[linear-gradient(180deg,_rgba(55,48,163,0.90),_rgba(15,23,42,0.90))] px-8 py-10 text-left text-white backdrop-blur-sm transition active:scale-[0.98]"
                href={buildChildHref({
                  pathname: "/test",
                  childId,
                  params: { day: dayId }
                })}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
                    Checkpoint Test
                  </p>
                  <span className="rounded-full bg-indigo-400/20 px-3 py-1 text-xs font-bold text-indigo-200">
                    {dayComplete ? "완료" : "Learn 없이 바로 시작"}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black sm:text-3xl">
                  {dayComplete ? "종합 테스트 완료" : "종합 테스트 시작"}
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-100/80">
                  {dayComplete
                    ? "결과를 다시 확인할 수 있습니다."
                    : "네 Day 동안 익힌 단어를 종합 점검합니다."}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-lg text-indigo-200 transition group-hover:translate-x-1">→</span>
                  <span className="text-sm font-semibold text-indigo-200">
                    탭하여 입장
                  </span>
                </div>
              </Link>
            )}

            {/* ── DAY SELECTOR (separate navigation action) ── */}
            {allDays && allDays.length > 0 && (
              <button
                type="button"
                className={`w-full rounded-[1.5rem] border px-8 py-5 text-left transition active:scale-[0.98] ${
                  isCheckpoint
                    ? "border-indigo-300/20 bg-indigo-500/10 hover:bg-indigo-500/20"
                    : "border-violet-300/20 bg-violet-500/10 hover:bg-violet-500/20"
                } backdrop-blur-sm`}
                onClick={() => setShowDaySelector(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      isCheckpoint ? "text-indigo-300/70" : "text-violet-300/70"
                    }`}>
                      Day Navigation
                    </p>
                    <p className={`mt-1 text-lg font-bold ${
                      isCheckpoint ? "text-indigo-100" : "text-violet-100"
                    }`}>
                      다른 Day 선택하기
                    </p>
                  </div>
                  <span className={`text-2xl ${
                    isCheckpoint ? "text-indigo-300/50" : "text-violet-300/50"
                  }`}>→</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {showDaySelector && allDays && (
        <DaySelectorModal
          days={allDays}
          currentDayId={dayId}
          onSelect={(selectedDayId) => {
            setShowDaySelector(false);
            const href = buildChildHref({
              pathname: "/today",
              childId,
              params: { day: selectedDayId }
            });
            window.location.href = href;
          }}
          onClose={() => setShowDaySelector(false)}
        />
      )}
    </main>
  );
}
