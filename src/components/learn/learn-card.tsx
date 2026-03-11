"use client";

import { useState } from "react";
import type { WordEntry } from "@/lib/types/domain";

type LearnCardProps = {
  currentIndex: number;
  total: number;
  topic?: string;
  word: WordEntry;
};

export function LearnCard({ currentIndex, total, topic, word }: LearnCardProps) {
  const [played, setPlayed] = useState(false);

  function play() {
    setPlayed(true);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(word.english);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#efe7ff,_#fff_45%,_#e8f3ff)] px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <span>Learn</span>
          <span>
            {currentIndex} / {total}
          </span>
        </header>

        <section className="rounded-[1.75rem] bg-[linear-gradient(180deg,_#f2e8ff,_#eef6ff)] p-6">
          <p className="text-sm font-semibold text-slate-500">{topic ?? "단어 학습"}</p>
          <div className="mt-4 min-h-48 rounded-[1.5rem] bg-white/70" />
        </section>

        <section className="flex flex-col items-center gap-4 rounded-[1.75rem] bg-slate-950 px-6 py-10 text-center text-white">
          <h1 className="text-5xl font-black tracking-tight">{word.english}</h1>
          <p className="text-2xl font-bold text-slate-100">{word.meaning}</p>
          <button
            aria-label="play pronunciation"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl"
            onClick={play}
            type="button"
          >
            ▶
          </button>
          <p className="text-sm text-slate-300">
            {played ? "다시 들을 수 있어요." : word.exampleSentence ?? "예문은 나중에 추가할 수 있습니다."}
          </p>
        </section>
      </div>
    </main>
  );
}
