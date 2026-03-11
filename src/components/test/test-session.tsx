"use client";

import Link from "next/link";
import { useState } from "react";
import type { WordItem } from "@/data/today-words";
import { createQuiz, type QuizQuestion } from "@/lib/quiz";
import { loadLastResult, saveLastResult } from "@/lib/storage";

type TestSessionProps = {
  initialQuestions: QuizQuestion[];
  words: WordItem[];
};

export function TestSession({ initialQuestions, words }: TestSessionProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState<ReturnType<typeof loadLastResult>>(null);
  const currentQuestion = questions[currentIndex];
  const finished = currentIndex >= questions.length;

  function handleChoice(choice: string) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice(choice);

    if (choice === currentQuestion.word.meaning) {
      setScore((current) => current + 1);
    }
  }

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      const result = {
        score,
        total: questions.length,
        finishedAt: new Date().toISOString()
      };

      saveLastResult(result);
      setLastResult(result);
    }

    setSelectedChoice(null);
    setCurrentIndex((current) => current + 1);
  }

  function handleRestart() {
    setQuestions(createQuiz(words));
    setCurrentIndex(0);
    setSelectedChoice(null);
    setScore(0);
    setLastResult(loadLastResult());
  }

  function speakWord(word: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#dff7ff,_#fff8e7_60%,_#fff)] px-5 py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-700">
            Test Complete
          </p>
          <h1 className="text-4xl font-black text-slate-950">
            {score} / {questions.length}
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            잘했어요. 다시 풀면서 점수를 더 올려볼 수 있습니다.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              className="big-button border-0 bg-slate-950 text-white"
              onClick={handleRestart}
              type="button"
            >
              다시 풀기
            </button>
            <Link
              className="big-button bg-sky-100 text-sky-950"
              href="/"
            >
              처음 화면
            </Link>
          </div>
          {lastResult ? (
            <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              최근 기록: {lastResult.score} / {lastResult.total}
            </p>
          ) : null}
        </div>
      </main>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isCorrect = selectedChoice === currentQuestion.word.meaning;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fef3c7,_#fff_40%,_#dbeafe)] px-4 py-5">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-[2rem] bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur md:p-8">
        <header className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Link className="text-sm font-semibold text-slate-500" href="/">
              홈으로
            </Link>
            <p className="text-sm font-bold text-slate-500">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <section className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-slate-300">English word</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <h1 className="text-5xl font-black tracking-tight">
              {currentQuestion.word.english}
            </h1>
            <button
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl"
              onClick={() => speakWord(currentQuestion.word.english)}
              type="button"
            >
              🔊
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            뜻을 골라보세요.
          </p>
        </section>

        <section className="grid gap-3">
          {currentQuestion.choices.map((choice) => {
            const active = selectedChoice === choice;
            const correct = selectedChoice && choice === currentQuestion.word.meaning;
            const wrong = active && !isCorrect;

            return (
              <button
                key={choice}
                className={[
                  "min-h-20 rounded-[1.5rem] border-2 px-5 py-4 text-left text-2xl font-bold transition",
                  correct
                    ? "border-emerald-500 bg-emerald-100 text-emerald-950"
                    : wrong
                      ? "border-rose-500 bg-rose-100 text-rose-950"
                      : "border-slate-200 bg-white text-slate-900",
                  selectedChoice ? "opacity-90" : "hover:border-sky-400 hover:bg-sky-50"
                ].join(" ")}
                disabled={Boolean(selectedChoice)}
                onClick={() => handleChoice(choice)}
                type="button"
              >
                {choice}
              </button>
            );
          })}
        </section>

        <footer className="space-y-3">
          {selectedChoice ? (
            <div
              className={[
                "rounded-[1.5rem] px-5 py-4 text-lg font-bold",
                isCorrect
                  ? "bg-emerald-100 text-emerald-950"
                  : "bg-rose-100 text-rose-950"
              ].join(" ")}
            >
              {isCorrect
                ? "정답입니다."
                : `정답은 ${currentQuestion.word.meaning} 입니다.`}
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-slate-100 px-5 py-4 text-base text-slate-600">
              답을 하나 누르면 바로 채점합니다.
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500">
              현재 점수: {score}
            </p>
            <button
              className="big-button border-0 bg-slate-950 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!selectedChoice}
              onClick={handleNext}
              type="button"
            >
              다음 문제
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
