"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { playBgm, stopBgm, isBgmEnabled, setBgmEnabled } from "@/lib/audio/bgm";
import { isSfxEnabled, setSfxEnabled, playSfx } from "@/lib/audio/sfx";
import { buildChildHref } from "@/lib/navigation/child-href";
import { loadDeviceBinding, saveDeviceBinding } from "@/lib/device/device-binding";
import { getScreenBackground, getProfileAccent, PROFILE_AVATARS } from "@/lib/theme/profile-themes";
import { ProfileSwitcher } from "./profile-switcher";

// Hub-specific theme extensions per profile
const HUB_EXTRAS: Record<string, {
  todayBorder: string;
  todayGlow: string;
  todayBg: string;
  streakBorder: string;
  streakBg: string;
  streakText: string;
}> = {
  "다온": {
    todayBorder: "border-amber-300/45",
    todayGlow: "rgba(255,200,80,0.25)",
    todayBg: "from-amber-400/30 via-amber-500/20 to-amber-600/12",
    streakBorder: "border-amber-300/20",
    streakBg: "bg-amber-300/10",
    streakText: "text-amber-50",
  },
  "지온": {
    todayBorder: "border-sky-300/45",
    todayGlow: "rgba(56,189,248,0.25)",
    todayBg: "from-sky-400/30 via-sky-500/20 to-sky-600/12",
    streakBorder: "border-sky-300/20",
    streakBg: "bg-sky-300/10",
    streakText: "text-sky-50",
  },
};
const DEFAULT_HUB_EXTRAS = HUB_EXTRAS["다온"];

function getProfileTheme(childId: string) {
  const accent = getProfileAccent(childId);
  const extras = HUB_EXTRAS[childId] ?? DEFAULT_HUB_EXTRAS;
  return {
    avatarSrc: PROFILE_AVATARS[childId as keyof typeof PROFILE_AVATARS] ?? PROFILE_AVATARS["다온"],
    backgroundSrc: getScreenBackground("hub", childId),
    accentLabel: accent.labelText,
    ...extras,
  };
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
  const [timeTheme] = useState<TimeTheme>(getTimeTheme);
  const [showStreakToast, setShowStreakToast] = useState(streak > 0);
  const [sfxOn, setSfxOn] = useState(() =>
    typeof window !== "undefined" ? isSfxEnabled() : true
  );
  const [bgmOn, setBgmOn] = useState(() =>
    typeof window !== "undefined" ? isBgmEnabled() : true
  );

  useEffect(() => {
    playBgm("hub-theme");
    return () => stopBgm();
  }, []);

  useEffect(() => {
    if (!showStreakToast) return;
    playSfx("streak");
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
        suppressHydrationWarning
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
                playSfx("profile-switch");
                const binding = loadDeviceBinding();
                if (!binding) return;
                const nextChildId = binding.childId === "다온" ? "지온" : "다온";
                saveDeviceBinding({ ...binding, childId: nextChildId });
                window.location.href = "/";
              }}
            />
            <button
              type="button"
              className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold text-white/70 backdrop-blur-sm transition hover:bg-white/18"
              onClick={() => {
                const next = !sfxOn;
                setSfxOn(next);
                setSfxEnabled(next);
                if (next) playSfx("tap");
              }}
              aria-label={sfxOn ? "효과음 끄기" : "효과음 켜기"}
            >
              {sfxOn ? "\uD83D\uDD0A" : "\uD83D\uDD07"}
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold text-white/70 backdrop-blur-sm transition hover:bg-white/18"
              onClick={() => {
                const next = !bgmOn;
                setBgmOn(next);
                setBgmEnabled(next);
                if (next) playBgm("hub-theme");
              }}
              aria-label={bgmOn ? "배경음 끄기" : "배경음 켜기"}
            >
              {bgmOn ? "\uD83C\uDFB5" : "\uD83C\uDFB5\u2715"}
            </button>
            <Link
              href="/provision"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/50 backdrop-blur-sm transition hover:text-white/80 md:h-11 md:w-11"
              aria-label="설정"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
            </Link>
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
        <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-0 px-6 md:px-12">
          {/* TODAY card */}
          <div className="relative z-30 flex shrink-0 justify-center">
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
                className={`relative overflow-hidden rounded-[1.4rem] border-2 ${theme.todayBorder} bg-gradient-to-b ${theme.todayBg} px-16 py-5 text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:px-20 md:py-6`}
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
                  className="mt-1.5 text-3xl font-semibold text-white md:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {currentDayTitle}
                </p>
                <p
                  className={`mt-2 text-lg font-bold ${theme.accentLabel} md:text-xl`}
                >
                  오늘의 Day 시작 →
                </p>
                {/* Day progress badges */}
                <div
                  className="mt-3 flex items-center justify-center gap-2"
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
          <div className="flex w-full items-end justify-center gap-8 md:gap-12">
            {/* Review */}
            <div className="flex flex-col items-center pb-2">
              <Link
                href={buildChildHref({ pathname: "/review", childId })}
                className="group flex h-[110px] w-[110px] flex-col items-center justify-center rounded-[1.4rem] border-2 border-sky-300/25 bg-sky-950/45 shadow-[0_6px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-110 hover:border-sky-300/50 hover:bg-sky-800/40 md:h-[130px] md:w-[130px] md:rounded-[1.6rem]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sky-300/70 md:text-sm">
                  Review
                </p>
                <p className="mt-1 text-xl font-black text-sky-50 md:text-2xl">
                  복습실
                </p>
              </Link>
            </div>

            {/* Avatar */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="absolute -bottom-2 h-6 w-[70%] rounded-[100%] bg-black/50 blur-2xl" />
              <div className="relative w-[30vw] max-w-[300px] md:w-[26vw] md:max-w-[340px]">
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
                className="group flex h-[110px] w-[110px] flex-col items-center justify-center rounded-[1.4rem] border-2 border-amber-300/25 bg-amber-950/40 shadow-[0_6px_28px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-110 hover:border-amber-300/50 hover:bg-amber-800/35 md:h-[130px] md:w-[130px] md:rounded-[1.6rem]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300/70 md:text-sm">
                  History
                </p>
                <p className="mt-1 text-xl font-black text-amber-50 md:text-2xl">
                  기록실
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* ── CHARACTER (bottom) ── */}
        <div className="relative z-30 flex shrink-0 justify-center px-8 pb-4 pt-2 md:pb-5">
          <Link
            href={buildChildHref({ pathname: "/character", childId })}
            className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-violet-300/20 bg-gradient-to-r from-violet-950/50 via-indigo-950/40 to-violet-950/50 px-8 py-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all hover:scale-105 hover:border-violet-300/40 hover:bg-violet-900/40 md:px-10 md:py-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-300/25 bg-violet-800/35 text-lg text-amber-200/70 md:h-14 md:w-14 md:text-xl">
              ✦
            </div>
            <div>
              <p className="text-lg font-bold text-white md:text-xl">
                {childName}의 성장
              </p>
              <p className="text-sm text-violet-200/50 md:text-base">
                XP · Level · 배지
              </p>
            </div>
            <span
              className="rounded-full border border-amber-200/30 bg-amber-300/15 px-4 py-1.5 text-base font-bold text-amber-100"
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
