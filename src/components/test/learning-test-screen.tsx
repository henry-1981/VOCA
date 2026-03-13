"use client";

import Link from "next/link";
import { useState } from "react";
import { playWordAudio } from "@/lib/audio/play-word-audio";
import { setMockDayStage } from "@/lib/mock/day-stage";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { LearningTestQuestion } from "@/lib/test/generate-learning-test";

type LearningTestScreenProps = {
  childId?: string;
  dayId?: string;
  dayTitle: string;
  questions: LearningTestQuestion[];
};

export function LearningTestScreen({
  childId,
  dayId,
  dayTitle,
  questions
}: LearningTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const question = questions[currentIndex];
  const answered = selectedChoice !== null;
  const correctChoice = question.answer;
  const progressPips = questions.map((entry, index) => ({
    id: entry.id,
    active: index === currentIndex,
    passed: index < currentIndex
  }));

  function playAudio() {
    playWordAudio({
      text: question.audioText,
      audioMode: question.audioMode,
      audioUrl: question.audioUrl
    });
  }

  function choose(choice: string) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice(choice);

    if (choice === question.answer) {
      setScore((value) => value + 1);
    }

    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        if (childId && dayId) {
          setMockDayStage(childId, dayId, "test_completed");
        }
        setCompleted(true);
        return;
      }

      setCurrentIndex((value) => value + 1);
      setSelectedChoice(null);
    }, 250);
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e9f3ff,_#fff_50%,_#fff3dc)] px-6 py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(255,245,210,0.96),_rgba(255,234,167,0.88))] px-6 py-7 text-slate-950 shadow-[0_20px_50px_rgba(255,193,7,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Test Complete
            </p>
            <h1 className="mt-3 text-4xl font-black">{score} / {questions.length}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              오늘의 테스트를 마쳤습니다. 연습실의 별빛 배지가 더 밝아졌습니다.
            </p>
          </div>
          <Link
            className="big-button bg-slate-950 text-white"
            href={buildChildHref({
              pathname: "/today",
              childId,
              params: {
                day: dayId,
                stage: "test_completed"
              }
            })}
          >
            Today로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e9f3ff,_#fff_50%,_#fff3dc)] px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
            <span>{dayTitle}</span>
            <span>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="test progress">
            {progressPips.map((pip) => (
              <span
                key={pip.id}
                className={`h-2.5 rounded-full transition-all ${
                  pip.active
                    ? "w-8 bg-violet-600"
                    : pip.passed
                      ? "w-4 bg-violet-200"
                      : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(49,46,129,0.92))] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(255,226,148,0.18),_transparent_72%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Round {currentIndex + 1}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100/80">
              {question.direction === "en_to_ko" ? "영어를 뜻으로 바꾸기" : "뜻을 영어로 찾기"}
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-300">
            {question.direction === "en_to_ko" ? "영어 → 뜻" : "뜻 → 영어"}
            </p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">{question.prompt}</h1>
            <div className="mt-5 flex items-center gap-3">
              <button
                aria-label="play audio"
                className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-white/10 px-4 text-xl font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                onClick={playAudio}
                type="button"
              >
                ▶
              </button>
              <p className="text-sm text-slate-300">힌트 음성으로 다시 확인할 수 있습니다.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const isCorrect = answered && choice === correctChoice;
            const isWrong = isSelected && choice !== correctChoice;

            return (
              <button
                key={choice}
                className={`rounded-[1.6rem] border-2 px-5 py-5 text-left text-xl font-black shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                    : isWrong
                      ? "border-rose-400 bg-rose-50 text-rose-950"
                      : isSelected
                        ? "border-violet-400 bg-violet-50 text-violet-950"
                        : "border-slate-200 bg-white text-slate-900 hover:border-violet-200 hover:bg-violet-50/40"
                } ${answered ? "cursor-default" : "active:scale-[0.98]"}`}
                onClick={() => choose(choice)}
                type="button"
              >
                <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Magical Tile
                </span>
                <span className="mt-3 block">{choice}</span>
              </button>
            );
          })}
        </section>

        {selectedChoice ? (
          <div
            className={`rounded-[1.5rem] px-5 py-4 text-center text-sm font-semibold shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${
              selectedChoice === question.answer
                ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                : "bg-rose-50 text-rose-900 ring-1 ring-rose-200"
            }`}
          >
            {selectedChoice === question.answer
              ? "정답입니다. 다음 라운드로 바로 넘어갑니다."
              : `아쉽지만 정답은 ${question.answer} 입니다.`}
          </div>
        ) : null}
      </div>
    </main>
  );
}
