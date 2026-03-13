"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import { loadDeviceBinding, saveDeviceBinding } from "@/lib/device/device-binding";
import { ProfileSwitcher } from "./profile-switcher";

// --- Profile theme per child ---
type ProfileTheme = {
  avatarSrc: string;
  backgroundSrc: string;
  todayBorder: string;
  todayGlow: string;
  todayBg: string;
  streakBorder: string;
  streakBg: string;
  streakText: string;
  accentLabel: string;
};

const PROFILE_THEMES: Record<string, ProfileTheme> = {
  "다온": {
    avatarSrc: "/avatars/daon-nobg.png",
    backgroundSrc: "/backgrounds/academy-gate-landscape.png",
    todayBorder: "border-amber-300/45",
    todayGlow: "rgba(255,200,80,0.25)",
    todayBg: "from-amber-400/30 via-amber-500/20 to-amber-600/12",
    streakBorder: "border-amber-300/20",
    streakBg: "bg-amber-300/10",
    streakText: "text-amber-50",
    accentLabel: "text-amber-200/70",
  },
  "지온": {
    avatarSrc: "/avatars/jion-nobg.png",
    backgroundSrc: "/backgrounds/academy-hanok-landscape.png",
    todayBorder: "border-sky-300/45",
    todayGlow: "rgba(56,189,248,0.25)",
    todayBg: "from-sky-400/30 via-sky-500/20 to-sky-600/12",
    streakBorder: "border-sky-300/20",
    streakBg: "bg-sky-300/10",
    streakText: "text-sky-50",
    accentLabel: "text-sky-200/70",
  },
};

const DEFAULT_THEME = PROFILE_THEMES["다온"];

function getProfileTheme(childId: string): ProfileTheme {
  return PROFILE_THEMES[childId] ?? DEFAULT_THEME;
}

// --- Time-of-day ---
type TimeTheme = {
  overlay: string;
  showStars: boolean;
};

function getTimeTheme(): TimeTheme {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return { overlay: "rgba(255,220,160,0.15)", showStars: false };
  if (hour >= 12 && hour < 17) return { overlay: "rgba(180,200,255,0.08)", showStars: false };
  if (hour >= 17 && hour < 20) return { overlay: "rgba(255,160,80,0.20)", showStars: true };
  return { overlay: "rgba(10,8,40,0.45)", showStars: true };
}

type MainHubProps = {
  childId: string;
  currentDayId: string;
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
  dayStage?: "not_started" | "learn_completed" | "test_completed" | "completed";
};

export function MainHub({
  childId,
  currentDayId,
  childName,
  level,
  streak,
  currentDayTitle,
  previewMode,
  dayStage = "not_started",
}: MainHubProps) {
  const theme = getProfileTheme(childId);
  const [timeTheme, setTimeTheme] = useState<TimeTheme>({
    overlay: "rgba(180,200,255,0.08)",
    showStars: false,
  });
  const [showStreakToast, setShowStreakToast] = useState(streak > 0);

  useEffect(() => {
    setTimeTheme(getTimeTheme());
  }, []);

  useEffect(() => {
    if (!showStreakToast) return;
    const timer = setTimeout(() => setShowStreakToast(false), 800);
    return () => clearTimeout(timer);
  }, [showStreakToast]);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden select-none">
      {/* [1] Background image */}
      <Image
        src={theme.backgroundSrc}
        alt="Magic Academy"
        fill
        className="object-cover object-center"
        priority
      />

      {/* [2] Time-of-day overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-1000"
        style={{ backgroundColor: timeTheme.overlay, mixBlendMode: "multiply" }}
      />

      {/* [3] Top gradient for HUD */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,20,0.6) 0%, transparent 100%)",
        }}
      />

      {/* [4] Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(8,6,20,0.2) 15%,
            rgba(8,6,20,0.55) 35%,
            rgba(8,6,20,0.82) 55%,
            rgba(8,6,20,0.95) 80%,
            rgba(8,6,20,0.98) 100%)`,
        }}
      />

      {/* [5] Side vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 40%, transparent 40%, rgba(8,6,20,0.35) 100%)",
        }}
      />

      {/* Night stars */}
      {timeTheme.showStars && (
        <div className="pointer-events-none absolute inset-0">
          {[
            { x: "12%", y: "8%", s: 2.5, d: 0 },
            { x: "30%", y: "5%", s: 2, d: 0.6 },
            { x: "55%", y: "7%", s: 2, d: 1.1 },
            { x: "75%", y: "4%", s: 2.5, d: 0.3 },
            { x: "88%", y: "9%", s: 1.5, d: 0.9 },
          ].map((star, i) => (
            <div
              key={i}
              className="absolute animate-pulse rounded-full bg-white"
              style={{
                left: star.x,
                top: star.y,
                width: star.s,
                height: star.s,
                animationDelay: `${star.d}s`,
                boxShadow: `0 0 ${star.s * 4}px rgba(255,255,255,0.9)`,
              }}
            />
          ))}
        </div>
      )}

      {/* ═══ LAYOUT ═══ */}
      <div className="relative z-10 flex h-[100dvh] flex-col justify-between">
        {/* ── HUD ── */}
        <header className="flex w-full shrink-0 items-center justify-between px-8 pt-3 md:px-12 md:pt-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300/50 md:text-base">
              {previewMode ? "Preview" : "Magic Academy"}
            </p>
            <h1
              className="text-2xl font-semibold text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {childName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-sm md:text-base">
              Lv.{level}
            </span>
            <span
              className={`rounded-full ${theme.streakBorder} ${theme.streakBg} px-4 py-2 text-sm font-bold ${theme.streakText} backdrop-blur-sm md:text-base ${streak > 0 ? "animate-glow-pulse" : ""}`}
              data-testid="streak-badge"
            >
              {streak}일 연속
            </span>
            <ProfileSwitcher
              currentChildName={childName}
              onSwitch={() => {
                const binding = loadDeviceBinding();
                if (!binding) return;
                const nextChildId = binding.childId === "다온" ? "지온" : "다온";
                saveDeviceBinding({ ...binding, childId: nextChildId });
                window.location.href = "/";
              }}
            />
          </div>
        </header>

        {/* Streak toast */}
        {showStreakToast && (
          <div
            className="pointer-events-none fixed left-1/2 top-8 z-50 -translate-x-1/2 animate-float-up rounded-full bg-amber-400 px-5 py-2 text-lg font-bold text-slate-900 shadow-[0_10px_30px_rgba(251,191,36,0.4)]"
            data-testid="streak-toast"
          >
            +{streak}일 연속!
          </div>
        )}

        {/* ── CENTER ── */}
        <div className="flex flex-1 flex-col items-center justify-end min-h-0">
          {/* TODAY card */}
          <div className="relative z-30 flex shrink-0 justify-center px-6">
            <Link
              href={buildChildHref({
                pathname: "/today",
                childId,
                params: { day: currentDayId },
              })}
              className="group relative"
              aria-label="Today"
            >
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl transition-all group-hover:opacity-100 opacity-70"
                style={{ backgroundColor: theme.todayGlow }}
              />
              <div
                className={`relative overflow-hidden rounded-[1.4rem] border-2 ${theme.todayBorder} bg-gradient-to-b ${theme.todayBg} px-12 py-4 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:px-16 md:py-5`}
                style={{
                  boxShadow: `0 0 40px ${theme.todayGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
              >
                <p
                  className={`text-sm font-bold uppercase tracking-[0.35em] ${theme.accentLabel} md:text-base`}
                >
                  Today
                </p>
                <p
                  className="mt-1 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {currentDayTitle}
                </p>
                <p
                  className={`mt-1.5 text-base font-bold ${theme.accentLabel} md:text-lg`}
                >
                  오늘의 Day 시작 →
                </p>
                {/* Day progress badges */}
                <div
                  className="mt-2 flex items-center justify-center gap-2"
                  data-testid="day-progress-badges"
                >
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      dayStage === "learn_completed" ||
                      dayStage === "test_completed" ||
                      dayStage === "completed"
                        ? "bg-emerald-600/90 text-white"
                        : "bg-white/15 text-white/60"
                    }`}
                    data-testid="learn-badge"
                  >
                    {dayStage === "learn_completed" ||
                    dayStage === "test_completed" ||
                    dayStage === "completed"
                      ? "Learn \u2713"
                      : "Learn"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      dayStage === "test_completed" || dayStage === "completed"
                        ? "bg-emerald-600/90 text-white"
                        : "bg-white/15 text-white/60"
                    }`}
                    data-testid="test-badge"
                  >
                    {dayStage === "test_completed" || dayStage === "completed"
                      ? "Test \u2713"
                      : "Test"}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* CENTER ROW: Review / Avatar / History */}
          <div className="flex w-full items-end justify-center gap-6 px-6 md:gap-10 md:px-12">
            {/* Review */}
            <div className="flex flex-col items-center pb-2">
              <Link
                href={buildChildHref({ pathname: "/review", childId })}
                className="group flex h-[90px] w-[90px] flex-col items-center justify-center rounded-[1.2rem] border-2 border-sky-300/25 bg-sky-950/45 shadow-[0_6px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-110 hover:border-sky-300/50 hover:bg-sky-800/40 md:h-[110px] md:w-[110px] md:rounded-[1.4rem]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sky-300/70 md:text-sm">
                  Review
                </p>
                <p className="mt-1 text-lg font-black text-sky-50 md:text-xl">
                  복습실
                </p>
              </Link>
            </div>

            {/* Avatar */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="absolute -bottom-2 h-6 w-[70%] rounded-[100%] bg-black/50 blur-2xl" />
              <div className="relative w-[28vw] max-w-[260px] md:w-[24vw] md:max-w-[300px]">
                <Image
                  src={theme.avatarSrc}
                  alt={childName}
                  width={600}
                  height={720}
                  className="h-auto w-full drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                  priority
                />
                <div className="pointer-events-none absolute inset-x-[10%] -bottom-1 h-10 rounded-[100%] bg-amber-300/15 blur-2xl" />
              </div>
            </div>

            {/* History */}
            <div className="flex flex-col items-center pb-2">
              <Link
                href={buildChildHref({ pathname: "/history", childId })}
                className="group flex h-[90px] w-[90px] flex-col items-center justify-center rounded-[1.2rem] border-2 border-amber-300/25 bg-amber-950/40 shadow-[0_6px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-110 hover:border-amber-300/50 hover:bg-amber-800/35 md:h-[110px] md:w-[110px] md:rounded-[1.4rem]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300/70 md:text-sm">
                  History
                </p>
                <p className="mt-1 text-lg font-black text-amber-50 md:text-xl">
                  기록실
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* ── CHARACTER (bottom) ── */}
        <div className="relative z-30 flex shrink-0 justify-center px-8 pb-3 pt-1 md:pb-4">
          <Link
            href={buildChildHref({ pathname: "/character", childId })}
            className="group flex items-center gap-3 rounded-[1.2rem] border-2 border-violet-300/20 bg-gradient-to-r from-violet-950/50 via-indigo-950/40 to-violet-950/50 px-6 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-105 hover:border-violet-300/40 hover:bg-violet-900/40 md:px-8 md:py-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/25 bg-violet-800/35 text-base text-amber-200/70 md:h-12 md:w-12 md:text-lg">
              ✦
            </div>
            <div>
              <p className="text-base font-bold text-white md:text-lg">
                {childName}의 성장
              </p>
              <p className="text-xs text-violet-200/50 md:text-sm">
                XP · Level · 배지
              </p>
            </div>
            <span
              className="rounded-full border border-amber-200/30 bg-amber-300/15 px-3 py-1 text-sm font-bold text-amber-100"
              data-testid="level-badge"
            >
              Lv.{level}
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
