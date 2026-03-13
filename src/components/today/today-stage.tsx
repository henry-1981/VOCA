"use client";

import Link from "next/link";
import { useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
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
    <main
      className={`min-h-screen px-6 py-8 ${
        isCheckpoint
          ? "bg-[radial-gradient(circle_at_top,_#dfe3ff,_#f7f8ff_44%,_#eef0ff)]"
          : "bg-[radial-gradient(circle_at_top,_#f2e8ff,_#fff9ef_42%,_#edf4ff)]"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <header
          className={`relative overflow-hidden rounded-[2.2rem] border p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${
            isCheckpoint
              ? "border-indigo-200/60 bg-[linear-gradient(160deg,_rgba(255,255,255,0.96),_rgba(230,235,255,0.92))]"
              : "border-white/80 bg-[linear-gradient(160deg,_rgba(255,255,255,0.97),_rgba(251,245,255,0.94))]"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
              isCheckpoint
                ? "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_70%)]"
                : "bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_70%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full blur-2xl ${
              isCheckpoint ? "bg-indigo-300/30" : "bg-violet-300/28"
            }`}
          />
          <div className="pointer-events-none absolute left-[10%] top-24 h-2.5 w-2.5 animate-pulse rounded-full bg-amber-100/80 shadow-[0_0_18px_rgba(255,245,200,0.9)]" />
          <div className="pointer-events-none absolute right-[20%] top-20 h-2 w-2 animate-pulse rounded-full bg-violet-200/80 shadow-[0_0_16px_rgba(221,214,254,0.8)]" />
          <div className="relative space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isCheckpoint ? "Checkpoint Today" : "Today"}
              </p>
              <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">{dayTitle}</h1>
              <p className="text-sm font-semibold text-slate-700">{stageLabel}</p>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                {isCheckpoint
                  ? "오늘은 복습 카드가 아니라 종합 점검실에 들어가는 날입니다."
                  : "연습실 문이 열린 상태입니다. 단어를 먼저 만나고, 그 다음 테스트 문을 여는 흐름입니다."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {allDays && allDays.length > 0 && (
                <button
                  type="button"
                  className="rounded-full border border-violet-300/30 bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-500/25"
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
                          : "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </header>

        <section
          className={`relative overflow-hidden rounded-[2.2rem] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] ${
            isCheckpoint
              ? "bg-[linear-gradient(180deg,_rgba(79,70,229,0.96),_rgba(30,41,59,0.96))]"
              : "bg-[linear-gradient(180deg,_rgba(28,25,41,0.96),_rgba(15,23,42,0.98))]"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${
              isCheckpoint
                ? "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_72%)]"
                : "bg-[radial-gradient(circle_at_top,_rgba(255,214,111,0.16),_transparent_72%)]"
            }`}
          />
          <div className="academy-float pointer-events-none absolute right-10 top-10 h-12 w-12 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute inset-x-10 bottom-6 h-14 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.14),_transparent_70%)] blur-xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
              {isCheckpoint ? "종합 점검 Day" : "개인 연습실"}
            </p>
            <p className="mt-3 text-3xl font-black sm:text-4xl">{dayTitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/90">
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

        {!isCheckpoint ? (
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.92fr]">
            <Link
              className={`relative overflow-hidden rounded-[2rem] border px-6 py-7 text-left shadow-[0_18px_40px_rgba(109,40,217,0.12)] transition ${
                learnPrimary
                  ? "border-violet-500 bg-[linear-gradient(180deg,_rgba(124,58,237,0.96),_rgba(91,33,182,0.96))] text-white"
                  : "border-violet-200 bg-[linear-gradient(180deg,_rgba(245,243,255,0.98),_rgba(237,233,254,0.92))] text-violet-950"
              }`}
              href={buildChildHref({
                pathname: "/today/learn",
                childId,
                params: { day: dayId }
              })}
            >
              <div className="pointer-events-none absolute inset-x-8 bottom-5 h-14 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.18),_transparent_68%)] blur-lg" />
              <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${learnPrimary ? "text-violet-100" : "text-violet-700"}`}>
                Learn
              </p>
              <p className="mt-3 text-2xl font-black sm:text-3xl">오늘 단어 익히기 시작</p>
              <p className={`mt-3 text-sm leading-6 ${learnPrimary ? "text-violet-100/90" : "text-violet-900/70"}`}>
                단어, 뜻, 발음, 예문을 한 장씩 보며 오늘 연습실의 첫 문을 엽니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold">
                  {learnPrimary ? "지금 해야 할 첫 행동" : "완료됨 · 다시 보기 가능"}
                </div>
                <div
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                    learnPrimary ? "bg-white/8 text-violet-100/90" : "bg-violet-100 text-violet-700"
                  }`}
                >
                  단어 20개를 차례대로 수집
                </div>
              </div>
            </Link>
            <div className="flex flex-col gap-4">
              <Link
                className={`relative overflow-hidden rounded-[2rem] border px-6 py-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition ${
                  testPrimary || dayComplete
                    ? "border-slate-900 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))] text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
                href={buildChildHref({
                  pathname: "/test",
                  childId,
                  params: { day: dayId }
                })}
              >
                <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 rounded-full bg-white/6 blur-md" />
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                    testPrimary || dayComplete ? "text-slate-300" : "text-slate-400"
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
                    testPrimary || dayComplete ? "text-slate-300" : "text-slate-500"
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
                    testPrimary || dayComplete ? "bg-white/10" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {testPrimary
                    ? "문이 열렸습니다"
                    : dayComplete
                      ? "완료됨"
                      : "아직 잠겨 있음"}
                </div>
              </Link>

              <div className="rounded-[1.7rem] border border-white/70 bg-white/75 px-5 py-5 text-slate-700 shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Room Status</p>
                <p className="mt-3 text-base font-bold text-slate-900">
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
          <Link
            className="relative overflow-hidden rounded-[2.2rem] border border-indigo-500 bg-[linear-gradient(180deg,_rgba(55,48,163,0.98),_rgba(15,23,42,0.98))] px-6 py-8 text-left text-white shadow-[0_22px_55px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5"
            href={buildChildHref({
              pathname: "/test",
              childId,
              params: { day: dayId }
            })}
          >
            <div className="pointer-events-none absolute inset-x-10 bottom-5 h-16 rounded-[100%] bg-[radial-gradient(circle,_rgba(255,255,255,0.18),_transparent_70%)] blur-xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">
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
