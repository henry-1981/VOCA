"use client";

import Link from "next/link";
import Image from "next/image";
import { buildChildHref } from "@/lib/navigation/child-href";

// --- Review theme per child (moonlit/silver tone) ---
type ReviewTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  labelText: string;
  ctaGlow: string;
};

const REVIEW_THEMES: Record<string, ReviewTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/review-moonlit-warm.png",
    cardBorder: "border-amber-200/20",
    cardBg: "bg-amber-950/35",
    labelText: "text-amber-200/60",
    ctaGlow: "shadow-[0_18px_40px_rgba(255,200,80,0.2)]",
  },
  "지온": {
    backgroundSrc: "/backgrounds/review-moonlit-cool.png",
    cardBorder: "border-slate-300/20",
    cardBg: "bg-slate-800/40",
    labelText: "text-slate-300/60",
    ctaGlow: "shadow-[0_18px_40px_rgba(148,163,184,0.2)]",
  },
};
const DEFAULT_THEME = REVIEW_THEMES["다온"];

function getReviewTheme(childId: string): ReviewTheme {
  return REVIEW_THEMES[childId] ?? DEFAULT_THEME;
}

type ReviewScreenProps = {
  childId: string;
  childName: string;
  batchSize: number;
  title: string;
};

export function ReviewScreen({
  childId,
  childName,
  batchSize,
  title,
}: ReviewScreenProps) {
  const theme = getReviewTheme(childId);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* [1] Background image */}
      <Image
        src={theme.backgroundSrc}
        alt="Moonlit Review Room"
        fill
        className="object-cover object-center"
        priority
      />

      {/* [2] Dark overlay for cool moonlit feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "rgba(15,20,40,0.60)" }}
      />

      {/* [3] Top gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,20,0.6) 0%, transparent 100%)",
        }}
      />

      {/* [4] Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(8,6,20,0.5) 50%, rgba(8,6,20,0.8) 100%)",
        }}
      />

      {/* ═══ LAYOUT ═══ */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        {/* ── HEADER ── */}
        <header className="flex shrink-0 items-start justify-between px-8 pt-4 md:px-12 md:pt-5">
          <div className="max-w-2xl">
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme.labelText}`}>
              Calm Review Room
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
              {childName}의 복습실에서 오늘 쌓인 단어를 차분하게 다시 정리합니다.
            </p>
          </div>
          <Link
            className="inline-flex rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm"
            href={buildChildHref({ pathname: "/", childId })}
          >
            홈으로
          </Link>
        </header>

        {/* ── MAIN CONTENT ── */}
        <section className="flex-1 overflow-auto px-8 pb-6 pt-4 md:px-12">
          <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
            {/* Main panel */}
            <article
              className={`rounded-[2rem] border ${theme.cardBorder} ${theme.cardBg} p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-7`}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/50">
                <span className={`rounded-full border ${theme.cardBorder} bg-white/5 px-3 py-1`}>
                  복습실
                </span>
                <span>오늘 배치 {batchSize}문제</span>
              </div>
              <p className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-[2.5rem]">
                차분하게 다시 정리하고
                <br />
                틀렸던 단어를 부드럽게 회복해요.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                테스트처럼 빠르게 밀어붙이지 않고, 한 문제씩 다시 떠올리며 기억을 고르게
                다듬는 시간입니다. 정답보다 복귀의 감각이 먼저 보이도록 화면의 속도와
                대비를 낮췄습니다.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className={`rounded-[1.4rem] border ${theme.cardBorder} bg-white/5 px-4 py-4 backdrop-blur-sm`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.labelText}`}>
                    Today
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{batchSize} words</p>
                  <p className="mt-1 text-sm leading-6 text-white/50">오늘 다시 펼칠 누적 오답</p>
                </div>
                <div className={`rounded-[1.4rem] border ${theme.cardBorder} bg-white/5 px-4 py-4 backdrop-blur-sm`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.labelText}`}>
                    Pace
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Slow Recall</p>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    서두르지 않고 음성과 선택지를 다시 확인
                  </p>
                </div>
                <div className={`rounded-[1.4rem] border ${theme.cardBorder} bg-white/5 px-4 py-4 backdrop-blur-sm`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.labelText}`}>
                    Mood
                  </p>
                  <p className="mt-2 text-lg font-black text-white">Moonlight</p>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    은빛 조용함 속에서 기억을 다시 정렬
                  </p>
                </div>
              </div>
              <Link
                className={`big-button mt-7 bg-[linear-gradient(180deg,_#18253f,_#243457)] text-white ${theme.ctaGlow} shadow-[0_0_15px_rgba(203,213,225,0.2)]`}
                href={buildChildHref({ pathname: "/review/session", childId })}
              >
                복습 시작
              </Link>
            </article>

            {/* Aside panel */}
            <aside
              className={`rounded-[2rem] border ${theme.cardBorder} ${theme.cardBg} p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-sm`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.labelText}`}>
                Recovery Notes
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-white/55">
                <p>
                  오답은 실패 기록이 아니라, 다시 만날 단어를 모아 둔 작은 서랍입니다.
                </p>
                <p>
                  이번 세션은 시험을 반복하는 시간이 아니라 기억의 모서리를 둥글게
                  만드는 복습실입니다.
                </p>
              </div>
              <div className={`mt-6 rounded-[1.5rem] border ${theme.cardBorder} bg-white/5 px-5 py-5 backdrop-blur-sm`}>
                <p className="text-sm font-semibold text-white/60">이번 복습 흐름</p>
                <ol className="mt-3 space-y-3 text-sm text-white/70">
                  <li>1. 문제를 다시 보고</li>
                  <li>2. 음성을 천천히 확인하고</li>
                  <li>3. 오늘 배치를 조용히 정리합니다</li>
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
