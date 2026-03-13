"use client";

import Link from "next/link";
import { useState } from "react";
import { playWordAudio } from "@/lib/audio/play-word-audio";
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
  const [playedExample, setPlayedExample] = useState(false);
  const isLastWord = currentIndex >= total;
  const remainingCount = Math.max(total - currentIndex, 0);
  const progressLabel = isLastWord
    ? "마지막 발견 카드"
    : `${remainingCount}개의 단어가 더 기다리고 있어요`;

  function play() {
    setPlayed(true);
    playWordAudio({
      text: word.english,
      audioMode: word.audioMode,
      audioUrl: word.audioUrl
    });
  }

  function playExample() {
    if (!word.exampleSentence) {
      return;
    }

    setPlayedExample(true);
    playWordAudio({
      text: word.exampleSentence,
      audioMode: word.exampleAudioMode ?? word.audioMode,
      audioUrl: word.exampleAudioUrl
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#efe7ff,_#fff9ef_40%,_#e8f3ff)] px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-white/96 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Learn</p>
            <p className="mt-2 text-sm font-medium text-slate-600">{progressLabel}</p>
          </div>
          <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-900">
            Day · {currentIndex} / {total}
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,_rgba(242,232,255,0.95),_rgba(238,246,255,0.95))] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)]" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {topic ?? "단어 학습"}
                </p>
                <p className="mt-2 text-sm text-slate-600">오늘의 연습실에서 새 단어를 발견하는 카드입니다.</p>
              </div>
              <div className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-700 shadow-[0_10px_25px_rgba(168,85,247,0.08)]">
                Discovery
              </div>
            </div>
            <div className="mt-5 flex min-h-52 items-end justify-center rounded-[1.6rem] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(244,240,255,0.84))] px-6 pb-6 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <div className="w-full rounded-[1.4rem] border border-dashed border-violet-200/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(237,233,254,0.5)_58%,_rgba(255,255,255,0.2))] px-5 py-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">
                  {word.illustrationMode === "optional" ? "Magic scene ready" : "Scene"}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {word.illustrationMode === "optional"
                    ? "일러스트가 없어도 이 카드가 비어 보이지 않도록, 단어를 발견하는 무대처럼 보여줍니다."
                    : "이 단어를 위한 장면이 여기에 들어갑니다."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(30,27,75,0.98))] px-6 py-8 text-white shadow-[0_28px_70px_rgba(15,23,42,0.25)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(255,214,111,0.16),_transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-5 text-center">
            <div className="inline-flex rounded-full border border-violet-200/15 bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">
              collectible word card
            </div>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">{word.english}</h1>
            {word.pronunciation ? (
              <p className="text-base font-semibold text-slate-300">/{word.pronunciation}/</p>
            ) : null}
            <p className="text-2xl font-bold text-slate-100">{word.meaning}</p>

            <div className="mt-1 flex flex-col items-center gap-3">
              <button
                aria-label="play pronunciation"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,_rgba(255,222,133,1),_rgba(228,179,62,1))] px-6 text-base font-black text-slate-950 shadow-[0_20px_40px_rgba(255,193,7,0.25)]"
                onClick={play}
                type="button"
              >
                <span className="text-xl">▶</span>
                단어 듣기
              </button>
              {word.exampleSentence ? (
                <button
                  aria-label="play example audio"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 text-sm font-semibold text-slate-100"
                  onClick={playExample}
                  type="button"
                >
                  예문 듣기
                </button>
              ) : null}
            </div>

            {word.exampleSentence ? (
              <div className="mt-2 w-full rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.1),_rgba(255,255,255,0.04))] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                  Scene Card
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-white">
                  {word.exampleSentence}
                </p>
                {word.exampleKo ? (
                  <p className="mt-3 text-sm leading-6 text-slate-300">{word.exampleKo}</p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                {played || playedExample
                  ? "다시 들을 수 있어요."
                  : "예문은 나중에 추가할 수 있습니다."}
              </p>
            )}
          </div>
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
              이제 테스트 시작 · 보너스 받기
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
              다음 단어 · {remainingCount}개 남음
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
        <p className="text-center text-sm font-medium text-slate-500">
          {isLastWord
            ? "마지막 카드를 끝내면 테스트로 넘어가 별빛 보너스를 받을 수 있습니다."
            : "한 장씩 모을수록 오늘의 연습실 진행도가 올라갑니다."}
        </p>
      </div>
    </main>
  );
}
