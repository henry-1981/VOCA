"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { DayKind } from "@/lib/types/domain";
import { DaySelectorModal } from "./day-selector-modal";
import type { DayInfo } from "./day-selector-modal";

type TodayTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  labelText: string;
};

const TODAY_THEMES: Record<string, TodayTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/today-practice-warm.png",
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/35",
    labelText: "text-amber-200/70",
  },
  "지온": {
    backgroundSrc: "/backgrounds/today-practice-cool.png",
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/35",
    labelText: "text-sky-200/70",
  },
};
const DEFAULT_THEME = TODAY_THEMES["다온"];

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

  const theme = (childId && TODAY_THEMES[childId]) || DEFAULT_THEME;
  const isCheckpoint = dayKind === "checkpoint_test";
  const learnPrimary = !isCheckpoint && stage === "not_started";
  const testPrimary = !isCheckpoint && stage === "learn_completed";
  const dayComplete = stage === "test_completed" || stage === "completed";
  const statusMessage =
    dayComplete
      ? "오늘의 학습이 완료되었습니다."
      : isCheckpoint
        ? "지금 바로 종합 테스트를 시작하세요."
        : "오늘 단어를 익히고 테스트합니다.";
  const stageLabel =
    stage === "not_started"
      ? "아직 시작 전"
      : stage === "learn_completed"
        ? "Learn 완료"
        : dayComplete
          ? "Day 완료"
          : "진행 중";
  const progressLabels = isCheckpoint
    ? ["준비", "Checkpoint Test", "완료"]
    : ["시작 전", "Learn", "Test", "완료"];

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        src={theme.backgroundSrc}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(15,12,35,0.65)]" />
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {/* Header */}
            <header
              className={`relative overflow-hidden rounded-[2.2rem] border p-6 backdrop-blur-sm ${
                isCheckpoint
                  ? "border-indigo-300/20 bg-indigo-500/10"
                  : "border-white/15 bg-white/8"
              }`}
            >
              {/* Header decorations */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
                  isCheckpoint
                    ? "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_70%)]"
                    : "bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_70%)]"
                }`}
              />
              <div
                className={`pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full blur-2xl ${
                  isCheckpoint ? "bg-indigo-300/20" : "bg-violet-300/20"
                }`}
              />

              <div className="relative space-y-4">
                {/* Top row: label + 홈으로 button */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
                      {isCheckpoint ? "Checkpoint Today" : "Today"}
                    </p>
                    <h1 className="text-4xl font-black text-white sm:text-5xl">{dayTitle}</h1>
                    <p className="text-sm font-semibold text-white/70">{stageLabel}</p>
                    <p className="max-w-2xl text-sm leading-6 text-white/60">
                      {isCheckpoint
                        ? "오늘은 복습 카드가 아니라 종합 점검실에 들어가는 날입니다."
                        : "연습실 문이 열린 상태입니다. 단어를 먼저 만나고, 그 다음 테스트 문을 여는 흐름입니다."}
                    </p>
                  </div>
                  <Link
                    className="inline-flex shrink-0 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-sm"
                    href={buildChildHref({ pathname: "/", childId })}
                  >
                    홈으로
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {allDays && allDays.length > 0 && (
                    <button
                      type="button"
                      className="rounded-full border border-violet-300/30 bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-300 transition hover:bg-violet-500/25"
                      onClick={() => setShowDaySelector(true)}
                    >
                      다른 Day 선택
                    </button>
                  )}
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
                        className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${
                          active
                            ? isCheckpoint
                              ? "bg-indigo-600 text-white"
                              : "bg-violet-600 text-white"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </header>

            {/* Dark info section */}
            <section
              className={`relative overflow-hidden rounded-[2.2rem] border p-6 text-white backdrop-blur-sm ${
                isCheckpoint
                  ? "border-indigo-400/20 bg-indigo-900/40"
                  : "border-white/10 bg-white/8"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
                  isCheckpoint
                    ? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_72%)]"
                    : "bg-[radial-gradient(circle_at_top,_rgba(255,214,111,0.10),_transparent_72%)]"
                }`}
              />
              <div className="academy-float pointer-events-none absolute right-10 top-10 h-12 w-12 rounded-full bg-white/10 blur-xl" />
              <div className="pointer-events-none absolute inset-x-10 bottom-6 h-14 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_transparent_70%)] blur-xl" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  {isCheckpoint ? "종합 점검 Day" : "개인 연습실"}
                </p>
                <p className="mt-3 text-3xl font-black sm:text-4xl">{dayTitle}</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  {statusMessage}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                  <span className="rounded-full bg-white/10 px-3 py-2">Practice Room</span>
                  <span className="rounded-full bg-white/10 px-3 py-2">
                    {isCheckpoint ? "Test Door Only" : "Learn First"}
                  </span>
                </div>
              </div>
            </section>

            {/* Learn→Test transition message */}
            {showTransitionMessage && stage === "learn_completed" ? (
              <div
                className="animate-scale-bounce rounded-[1.5rem] border border-amber-300/30 bg-amber-500/20 px-5 py-4 text-center text-lg font-bold text-amber-100 shadow-[0_12px_30px_rgba(251,191,36,0.15)] backdrop-blur-sm"
                data-testid="transition-message"
                onClick={() => setShowTransitionMessage(false)}
              >
                학습 완료! 이제 테스트에 도전하세요 ✨
              </div>
            ) : null}

            {/* Learn / Test cards */}
            {!isCheckpoint ? (
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.92fr]">
                {/* Learn card */}
                <Link
                  className={`relative overflow-hidden rounded-[2rem] border px-6 py-7 text-left transition ${
                    learnPrimary
                      ? "border-violet-400/30 bg-violet-600/80 text-white backdrop-blur-sm"
                      : "border-white/15 bg-white/8 text-white backdrop-blur-sm"
                  }`}
                  href={buildChildHref({
                    pathname: "/today/learn",
                    childId,
                    params: { day: dayId }
                  })}
                >
                  <div className="pointer-events-none absolute inset-x-8 bottom-5 h-14 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.10),_transparent_68%)] blur-lg" />
                  <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${learnPrimary ? "text-violet-200" : "text-white/50"}`}>
                    Learn
                  </p>
                  <p className="mt-3 text-2xl font-black sm:text-3xl">오늘 단어 익히기 시작</p>
                  <p className={`mt-3 text-sm leading-6 ${learnPrimary ? "text-violet-100/90" : "text-white/60"}`}>
                    단어, 뜻, 발음, 예문을 한 장씩 보며 오늘 연습실의 첫 문을 엽니다.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold">
                      {learnPrimary ? "지금 해야 할 첫 행동" : "완료됨 · 다시 보기 가능"}
                    </div>
                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                        learnPrimary ? "bg-white/8 text-violet-100/90" : "bg-white/10 text-white/60"
                      }`}
                    >
                      단어 20개를 차례대로 수집
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col gap-4">
                  {/* Test card */}
                  <Link
                    className={`relative overflow-hidden rounded-[2rem] border px-6 py-6 text-left transition ${
                      testPrimary || dayComplete
                        ? "border-slate-700 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))] text-white"
                        : "border-white/10 bg-white/5 text-white/50"
                    } ${testPrimary ? "animate-glow-pulse" : ""}`}
                    data-testid="test-card"
                    href={buildChildHref({
                      pathname: "/test",
                      childId,
                      params: { day: dayId }
                    })}
                  >
                    <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 rounded-full bg-white/6 blur-md" />
                    <p
                      className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                        testPrimary || dayComplete ? "text-slate-300" : "text-white/40"
                      }`}
                    >
                      Test
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {testPrimary
                        ? "이제 테스트 시작"
                        : dayComplete
                          ? "오늘 테스트 완료"
                          : "Learn 완료 후 시작"}
                    </p>
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        testPrimary || dayComplete ? "text-slate-300" : "text-white/40"
                      }`}
                    >
                      {testPrimary
                        ? "연습실 다음 문이 열렸습니다. 이제 문제를 풀어 오늘 Day를 마무리합니다."
                        : dayComplete
                          ? "오늘 테스트는 이미 끝났습니다. 필요하면 다시 들어가 확인할 수 있습니다."
                          : "Learn에서 단어 20개를 모두 만난 뒤에만 이 문이 열립니다."}
                    </p>
                    <div
                      className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                        testPrimary || dayComplete ? "bg-white/10" : "bg-white/5 text-white/40"
                      }`}
                    >
                      {testPrimary
                        ? "문이 열렸습니다"
                        : dayComplete
                          ? "완료됨"
                          : "아직 잠겨 있음"}
                    </div>
                  </Link>

                  {/* Room Status */}
                  <div className="rounded-[1.7rem] border border-white/15 bg-white/8 px-5 py-5 text-white backdrop-blur-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Room Status</p>
                    <p className="mt-3 text-base font-bold text-white">
                      {learnPrimary
                        ? "연습실 첫 문이 열려 있습니다."
                        : testPrimary
                          ? "테스트 문이 반짝이며 열려 있습니다."
                          : dayComplete
                            ? "오늘 방은 정리됐고 다음 보상만 남았습니다."
                            : "오늘 방 안을 탐험하는 중입니다."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Checkpoint test card */
              <Link
                className="relative overflow-hidden rounded-[2.2rem] border border-indigo-500/40 bg-[linear-gradient(180deg,_rgba(55,48,163,0.90),_rgba(15,23,42,0.90))] px-6 py-8 text-left text-white backdrop-blur-sm transition hover:-translate-y-0.5"
                href={buildChildHref({
                  pathname: "/test",
                  childId,
                  params: { day: dayId }
                })}
              >
                <div className="pointer-events-none absolute inset-x-10 bottom-5 h-16 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.12),_transparent_70%)] blur-xl" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  Checkpoint Test
                </p>
                <p className="mt-3 text-3xl font-black sm:text-4xl">종합 테스트 시작</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/90">
                  점검실 안에서는 카드 공부를 하지 않습니다. 오늘은 바로 종합 테스트로 들어가 네 Day 동안
                  익힌 단어를 꺼내는 날입니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white">
                    지금 바로 종합 테스트 시작
                  </div>
                  <div className="inline-flex rounded-full bg-indigo-300/12 px-4 py-2 text-sm font-bold text-indigo-100">
                    Learn 없음 · Test only
                  </div>
                </div>
              </Link>
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
