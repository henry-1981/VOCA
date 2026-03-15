"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { stopBgm } from "@/lib/audio/bgm";
import { playWordAudio } from "@/lib/audio/play-word-audio";
import { playSfx } from "@/lib/audio/sfx";
import { setMockDayStage } from "@/lib/mock/day-stage";
import { buildChildHref } from "@/lib/navigation/child-href";
import { syncLearnCompletion } from "@/lib/sync/sync-day-completion";
import { getScreenBackground } from "@/lib/theme/profile-themes";
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
  useEffect(() => {
    stopBgm();
  }, []);

  const [played, setPlayed] = useState(false);
  const [playedExample, setPlayedExample] = useState(false);
  const isLastWord = currentIndex >= total;
  const remainingCount = Math.max(total - currentIndex, 0);
  const progressLabel = isLastWord
    ? "마지막 발견 카드"
    : `${remainingCount}개의 단어가 더 기다리고 있어요`;
  const backgroundSrc = getScreenBackground("learn", childId ?? "다온");

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
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        src={backgroundSrc}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(15,12,35,0.65)]" />
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-[100dvh] flex-col overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 p-6">
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Learn</p>
              <p className="mt-2 text-sm font-medium text-white/70">{progressLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="inline-flex rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-sm"
                href={buildChildHref({ pathname: "/", childId })}
              >
                홈으로
              </Link>
              <div className="rounded-full border border-violet-300/20 bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-100">
                Day · {currentIndex} / {total}
              </div>
            </div>
          </header>

          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(30,27,75,0.98))] px-6 py-8 text-white shadow-[0_28px_70px_rgba(15,23,42,0.25)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(255,214,111,0.16),_transparent_70%)]" />
            <div className="relative flex flex-col items-center gap-5 text-center">
              <div className="inline-flex rounded-full border border-violet-200/15 bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-100">
                {topic ?? "단어 학습"}
              </div>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">{word.english}</h1>
              {word.pronunciation ? (
                <p className="text-base font-semibold text-slate-300">/{word.pronunciation}/</p>
              ) : null}
              <p className="text-2xl font-bold text-slate-100">{word.meaning}</p>

              <button
                aria-label="play pronunciation"
                className="mt-1 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,_rgba(255,222,133,1),_rgba(228,179,62,1))] px-6 text-base font-black text-slate-950 shadow-[0_20px_40px_rgba(255,193,7,0.25)]"
                onClick={play}
                type="button"
              >
                <span className="text-xl">▶</span>
                단어 듣기
              </button>

              {word.exampleSentence ? (
                <div className="mt-4 w-full rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.1),_rgba(255,255,255,0.04))] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                      Scene Card
                    </p>
                    <button
                      aria-label="play example audio"
                      className="inline-flex min-w-[44px] min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-white/18"
                      onClick={playExample}
                      type="button"
                    >
                      <span className="text-sm">▶</span>
                      예문 듣기
                    </button>
                  </div>
                  <p className="mt-3 text-base font-semibold leading-7 text-white">
                    {word.exampleSentence}
                  </p>
                  {word.exampleKo ? (
                    <p className="mt-3 text-sm leading-6 text-slate-300">{word.exampleKo}</p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-300">
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
                    void syncLearnCompletion({ childId, dayId });
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
                onClick={() => playSfx("card-flip")}
              >
                다음 단어 · {remainingCount}개 남음
              </Link>
            )}
            <Link
              className="big-button border border-white/15 bg-white/10 text-white"
              href={buildChildHref({
                pathname: "/today",
                childId,
                params: { day: dayId }
              })}
            >
              Today로 돌아가기
            </Link>
          </footer>
          <p className="text-center text-sm font-medium text-white/50">
            {isLastWord
              ? "마지막 카드를 끝내면 테스트로 넘어가 별빛 보너스를 받을 수 있습니다."
              : "한 장씩 모을수록 오늘의 연습실 진행도가 올라갑니다."}
          </p>
        </div>
      </div>
    </main>
  );
}
