"use client";

import Link from "next/link";
import { useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { CheckpointQuestion } from "@/lib/types/domain";

type CheckpointTestScreenProps = {
  childId?: string;
  dayId?: string;
  dayTitle: string;
  questions: CheckpointQuestion[];
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export function CheckpointTestScreen({
  childId,
  dayId,
  dayTitle,
  questions
}: CheckpointTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const question = questions[currentIndex];

  function advance(correct: boolean) {
    if (correct) {
      setScore((value) => value + 1);
    }

    if (currentIndex === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setTypedAnswer("");
    setSelectedChoice(null);
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e7ebff,_#fff_50%,_#f5f8ff)] px-6 py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <p className="text-sm font-semibold text-slate-500">{dayTitle}</p>
          <h1 className="text-4xl font-black text-slate-950">
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e7ebff,_#fff_50%,_#f5f8ff)] px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <span>{dayTitle}</span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </header>

        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-slate-300">{question.section}</p>
          <h1 className="mt-3 text-3xl font-black">{question.prompt}</h1>
        </section>

        {question.choices.length > 0 ? (
          <section className="grid gap-3">
            {question.choices.map((choice) => (
              <button
                key={choice}
                className="rounded-[1.5rem] border-2 border-slate-200 px-5 py-4 text-left text-xl font-bold text-slate-900"
                onClick={() => {
                  setSelectedChoice(choice);
                  advance(normalizeAnswer(choice) === normalizeAnswer(question.answer));
                }}
                type="button"
              >
                {choice}
              </button>
            ))}
          </section>
        ) : (
          <section className="grid gap-3">
            <input
              className="rounded-[1.5rem] border border-slate-200 px-5 py-4 text-xl font-bold"
              onChange={(event) => setTypedAnswer(event.target.value)}
              value={typedAnswer}
            />
            <button
              className="big-button border-0 bg-slate-950 text-white"
              onClick={() => advance(normalizeAnswer(typedAnswer) === normalizeAnswer(question.answer))}
              type="button"
            >
              제출
            </button>
          </section>
        )}

        {selectedChoice ? (
          <p className="text-sm text-slate-500">선택: {selectedChoice}</p>
        ) : null}
      </div>
    </main>
  );
}
