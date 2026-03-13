import Link from "next/link";
import Image from "next/image";
import { buildChildHref } from "@/lib/navigation/child-href";

type MainHubSceneBgProps = {
  childId: string;
  currentDayId: string;
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
  avatarSrc: string;
  backgroundSrc: string;
};

/**
 * Main Hub variant that uses a generated background image (e.g. Gemini)
 * instead of CSS-only buildings. Same interactive layout as MainHubScene.
 */
export function MainHubSceneBg({
  childId,
  currentDayId,
  childName,
  level,
  streak,
  currentDayTitle,
  previewMode,
  avatarSrc,
  backgroundSrc,
}: MainHubSceneBgProps) {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* ═══ BACKGROUND IMAGE ═══ */}
      <Image
        src={backgroundSrc}
        alt="Magic Academy"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Darken top for HUD readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[25%]"
        style={{
          background: "linear-gradient(180deg, rgba(6,4,18,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Darken bottom for avatar/character area */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(10,8,22,0.4) 20%,
            rgba(10,8,22,0.7) 45%,
            rgba(10,8,22,0.9) 70%,
            rgba(10,8,22,0.95) 100%
          )`,
        }}
      />

      {/* Subtle vignette on edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 45%, transparent 50%, rgba(6,4,18,0.5) 100%)",
        }}
      />

      {/* ═══ INTERACTIVE LAYER (identical layout to CSS version) ═══ */}
      <div className="relative z-10 flex h-[100dvh] flex-col">
        {/* ── HUD ── */}
        <header className="flex items-start justify-between px-4 pt-4 sm:px-6 sm:pt-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/50">
              {previewMode ? "Preview · BG" : "Magic Academy"}
            </p>
            <h1
              className="text-2xl font-semibold text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {childName}
            </h1>
          </div>
          <div className="flex gap-1.5 text-[10px] font-semibold">
            <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-white/60 backdrop-blur-sm">
              Lv.{level}
            </span>
            <span className="rounded-full border border-amber-300/15 bg-amber-950/40 px-2.5 py-1 text-amber-200/70 backdrop-blur-sm">
              {streak}일 연속
            </span>
          </div>
        </header>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── TODAY portal ── */}
        <div className="relative z-20 flex justify-center">
          <Link
            href={buildChildHref({
              pathname: "/today",
              childId,
              params: { day: currentDayId },
            })}
            className="group relative flex flex-col items-center text-center"
          >
            <div className="absolute -inset-6 rounded-full bg-amber-400/10 blur-3xl transition-all duration-500 group-hover:bg-amber-400/18" />

            <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-b from-amber-300/25 via-amber-400/15 to-amber-600/10 shadow-[0_0_24px_rgba(255,200,80,0.3),inset_0_0_16px_rgba(255,200,80,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-amber-200/60 group-hover:shadow-[0_0_40px_rgba(255,200,80,0.45),inset_0_0_20px_rgba(255,200,80,0.2)] sm:h-28 sm:w-28">
              <div className="pointer-events-none absolute inset-1.5 rounded-full border border-amber-200/15 animate-[pulse_3s_ease-in-out_infinite]" />
              <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-amber-200/65">
                Today
              </p>
              <p
                className="text-base font-semibold leading-tight text-amber-50 sm:text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {currentDayTitle}
              </p>
            </div>

            <span className="mt-1.5 text-[10px] font-semibold text-amber-200/55 transition group-hover:text-amber-200/85">
              오늘의 Day 시작 →
            </span>
          </Link>
        </div>

        {/* ── REVIEW & HISTORY ── */}
        <div className="mt-2 flex items-start justify-between px-2 sm:px-4">
          <Link
            href={buildChildHref({ pathname: "/review", childId })}
            className="group flex w-[80px] flex-col items-center rounded-lg border border-sky-300/12 bg-sky-950/30 px-2 py-2 text-center backdrop-blur-sm transition-all hover:border-sky-300/25 hover:bg-sky-900/30 sm:w-[100px]"
          >
            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-sky-300/50">
              Review
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-sky-50">복습실</p>
            <p className="text-[8px] text-sky-200/40">누적 오답</p>
          </Link>

          <Link
            href={buildChildHref({ pathname: "/history", childId })}
            className="group flex w-[80px] flex-col items-center rounded-lg border border-amber-300/12 bg-amber-950/25 px-2 py-2 text-center backdrop-blur-sm transition-all hover:border-amber-300/25 hover:bg-amber-900/25 sm:w-[100px]"
          >
            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-amber-300/50">
              History
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-amber-50">기록실</p>
            <p className="text-[8px] text-amber-200/40">Day 기록</p>
          </Link>
        </div>

        {/* ── AVATAR ── */}
        <div className="relative z-20 flex flex-1 items-end justify-center">
          <div className="absolute bottom-1 h-5 w-44 rounded-[100%] bg-black/50 blur-xl" />

          <div className="relative w-[72vw] max-w-[330px]">
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background: `radial-gradient(ellipse 70% 75% at 50% 50%,
                  transparent 30%,
                  rgba(10,8,22,0.5) 55%,
                  rgba(10,8,22,0.85) 70%,
                  rgba(10,8,22,1) 85%
                )`,
              }}
            />
            <div
              style={{
                maskImage:
                  "radial-gradient(ellipse 80% 85% at 50% 52%, black 35%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 85% at 50% 52%, black 35%, transparent 72%)",
              }}
            >
              <Image
                src={avatarSrc}
                alt={childName}
                width={500}
                height={600}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          {[
            { x: "14%", y: "40%", s: 2, d: 0 },
            { x: "82%", y: "35%", s: 1.5, d: 0.6 },
            { x: "20%", y: "55%", s: 1.5, d: 1.2 },
            { x: "78%", y: "50%", s: 2, d: 0.3 },
          ].map((sp, i) => (
            <div
              key={i}
              className="pointer-events-none absolute animate-pulse rounded-full bg-amber-200/50"
              style={{
                left: sp.x,
                bottom: sp.y,
                width: sp.s,
                height: sp.s,
                animationDelay: `${sp.d}s`,
                boxShadow: `0 0 ${sp.s * 6}px rgba(255,220,150,0.6)`,
              }}
            />
          ))}
        </div>

        {/* ── CHARACTER ── */}
        <div className="relative z-30 -mt-6 flex justify-center px-6 pb-5">
          <Link
            href={buildChildHref({ pathname: "/character", childId })}
            className="group flex items-center gap-2.5 rounded-xl border border-violet-300/12 bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-violet-950/40 px-4 py-2.5 backdrop-blur-sm transition-all hover:border-violet-300/25 hover:bg-violet-900/25"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-300/15 bg-violet-800/25 text-xs text-amber-200/60">
              ✦
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/90">{childName}의 성장</p>
              <p className="text-[9px] text-violet-200/40">XP · Level · 배지</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
