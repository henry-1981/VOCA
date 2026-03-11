"use client";

import Link from "next/link";
import { useState } from "react";
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

  function playAudio() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
          <p className="text-sm font-semibold text-slate-500">{dayTitle}</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">
            {score} / {questions.length}
          </h1>
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
        <header className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <span>{dayTitle}</span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </header>

        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-slate-300">
            {question.direction === "en_to_ko" ? "영어 → 뜻" : "뜻 → 영어"}
          </p>
          <h1 className="mt-4 text-5xl font-black">{question.prompt}</h1>
          <button
            aria-label="play audio"
            className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl"
            onClick={playAudio}
            type="button"
          >
            ▶
          </button>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => (
            <button
              key={choice}
              className="rounded-[1.5rem] border-2 border-slate-200 px-5 py-4 text-left text-xl font-bold text-slate-900"
              onClick={() => choose(choice)}
              type="button"
            >
              {choice}
            </button>
          ))}
        </section>

        {selectedChoice ? (
          <p className="text-center text-sm font-semibold text-slate-500">
            {selectedChoice === question.answer ? "정답" : `정답: ${question.answer}`}
          </p>
        ) : null}
      </div>
    </main>
  );
}
