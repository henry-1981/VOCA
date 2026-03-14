"use client";

import Image from "next/image";
import Link from "next/link";
import type { HistoryEntry } from "@/lib/mock/child-dashboard";
import { buildChildHref } from "@/lib/navigation/child-href";

type HistoryTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  labelText: string;
  accentText: string;
};

const HISTORY_THEMES: Record<string, HistoryTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/history-library-warm.png",
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/40",
    labelText: "text-amber-200/70",
    accentText: "text-amber-100",
  },
  "지온": {
    backgroundSrc: "/backgrounds/history-library-cool.png",
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/40",
    labelText: "text-sky-200/70",
    accentText: "text-sky-100",
  },
};
const DEFAULT_THEME = HISTORY_THEMES["다온"];

type HistoryScreenProps = {
  childId: string;
  childName: string;
  entries: HistoryEntry[];
};

export function HistoryScreen({ childId, childName, entries }: HistoryScreenProps) {
  const theme = HISTORY_THEMES[childName] ?? DEFAULT_THEME;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={theme.backgroundSrc}
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay for warm library feel */}
      <div className="absolute inset-0 bg-[rgba(40,28,12,0.65)]" />

      {/* Top gradient for readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Bottom gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content layer */}
      <div className="relative z-10 flex h-[100dvh] flex-col px-4 sm:px-6">
        {/* Header — fixed, no scroll */}
        <header className="shrink-0 pb-4 pt-6 sm:pt-8">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme.labelText}`}>
                Record Archive Room
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
                {childName}의 Day 기록 보관실
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
                최근 보관된 Day 기록을 날짜 순서대로 펼쳐 보고, 각 Day에서 다시 확인해야
                하는 단어를 조용한 기록실 분위기 안에서 살펴봅니다.
              </p>
            </div>
            <Link
              className={`inline-flex rounded-full border ${theme.cardBorder} backdrop-blur-sm ${theme.cardBg} px-4 py-2 text-sm font-semibold text-white/90 shadow-lg`}
              href={buildChildHref({ pathname: "/", childId })}
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* Scrollable content area */}
        <section className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto pb-6">
          {/* Summary cards row */}
          <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-6 backdrop-blur-sm`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                Recent Archive
              </p>
              <p className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">
                최근 보관된 Day 기록 {entries.length}권
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
                점수 자체보다 어떤 Day를 거쳐 왔는지, 어떤 단어를 다시 펼쳐봐야 하는지가
                먼저 읽히도록 Day 중심의 기록 흐름을 유지합니다.
              </p>
            </div>

            <aside className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-6 backdrop-blur-sm`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                Shelf Note
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
                <p>기록은 단어 통계표가 아니라 Day별 학습 여정의 책장입니다.</p>
                <p>각 카드에는 날짜, 점수, 다시 펼칠 단어 흔적을 함께 남깁니다.</p>
              </div>
            </aside>
          </div>

          {/* Entry cards */}
          <div className="grid gap-4">
            {entries.length ? (
              entries.map((entry) => {
                const wrongWordPreview = entry.wrongWords.length
                  ? entry.wrongWords.slice(0, 3).join(", ")
                  : "깨끗하게 통과한 Day 기록";

                return (
                  <article
                    key={`${entry.dayId}-${entry.date}`}
                    className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} px-6 py-6 backdrop-blur-sm`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className={`flex flex-wrap items-center gap-3 text-sm font-semibold ${theme.labelText}`}>
                          <span>{entry.date}</span>
                          <span className="h-1 w-1 rounded-full bg-white/30" />
                          <span>{entry.dayId.toUpperCase()}</span>
                        </div>
                        <h2 className={`mt-3 text-3xl font-black tracking-[-0.03em] ${theme.accentText}`}>
                          {entry.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-white/60">
                          틀린 단어 {entry.wrongWordCount}개
                        </p>
                        <p className="mt-2 text-sm leading-7 text-white/60">
                          다시 펼쳐볼 단어: {wrongWordPreview}
                        </p>
                      </div>
                      <div className={`rounded-xl border ${theme.cardBorder} ${theme.cardBg} px-5 py-4 text-right backdrop-blur-sm`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.labelText}`}>
                          Score
                        </p>
                        <p className="mt-2 text-2xl font-black text-white">
                          {entry.score} / {entry.total}
                        </p>
                      </div>
                    </div>
                    <Link
                      className={`mt-5 inline-flex rounded-full border ${theme.cardBorder} ${theme.cardBg} px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm`}
                      href={buildChildHref({
                        pathname: `/history/${entry.dayId}`,
                        childId
                      })}
                    >
                      기록 펼치기
                    </Link>
                  </article>
                );
              })
            ) : (
              <article className={`rounded-2xl border border-dashed ${theme.cardBorder} ${theme.cardBg} px-6 py-10 text-center backdrop-blur-sm`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                  Empty Shelf
                </p>
                <p className="mt-4 text-2xl font-black text-white">
                  아직 보관된 Day 기록이 없습니다.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  첫 Day를 마치면 이 기록실 책장에 날짜와 결과가 차분히 쌓이기 시작합니다.
                </p>
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
