"use client";

import Link from "next/link";
import { useState } from "react";
import { setMockDayStage } from "@/lib/mock/day-stage";
import { buildChildHref } from "@/lib/navigation/child-href";
import type { WordEntry } from "@/lib/types/domain";

type LearnCardProps = {
  childId?: string;
  dayId?: string;
  currentIndex: number;
  total: number;
  topic?: string;
  word: WordEntry;
};

export function LearnCard({
  childId,
  dayId,
  currentIndex,
  total,
  topic,
  word
}: LearnCardProps) {
  const [played, setPlayed] = useState(false);
  const isLastWord = currentIndex >= total;

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

        <footer className="grid gap-3 md:grid-cols-2">
          {isLastWord ? (
            <button
              className="big-button bg-slate-950 text-white"
              onClick={() => {
                if (childId && dayId) {
                  setMockDayStage(childId, dayId, "learn_completed");
                }

                window.location.href = buildChildHref({
                  pathname: "/test",
                  childId,
                  params: { day: dayId }
                });
              }}
              type="button"
            >
              이제 테스트 시작
            </button>
          ) : (
            <Link
              className="big-button bg-slate-950 text-white"
              href={buildChildHref({
                pathname: "/today/learn",
                childId,
                params: {
                  day: dayId,
                  index: currentIndex
                }
              })}
            >
              다음 단어
            </Link>
          )}
          <Link
            className="big-button bg-white text-slate-950 ring-1 ring-slate-200"
            href={buildChildHref({
              pathname: "/today",
              childId,
              params: { day: dayId }
            })}
          >
            Today로 돌아가기
          </Link>
        </footer>
      </div>
    </main>
  );
}
