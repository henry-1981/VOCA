# Hub Landscape Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** main-hub.tsx를 iPad landscape 배경 이미지 기반으로 리라이트하고, 중복 scene 컴포넌트를 삭제한다.

**Architecture:** 단일 컴포넌트(MainHub)에서 배경 이미지 + 시간대별 오버레이 + 프로필별 테마를 처리. childId로 아바타/악센트 컬러 자동 선택. 기존 기능(ProfileSwitcher, dayStage, streak toast) 모두 유지.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS 4, next/image, Vitest + Testing Library

---

### Task 1: main-hub.tsx 리라이트 — 배경 + 시간대별 오버레이

**Files:**
- Modify: `src/components/hub/main-hub.tsx` (전면 리라이트)

**Step 1: 프로필 테마 + 시간대 유틸 작성**

파일 상단에 추가:

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buildChildHref } from "@/lib/navigation/child-href";
import { ProfileSwitcher } from "./profile-switcher";

// --- Profile theme per child ---
type ProfileTheme = {
  avatarSrc: string;
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
```

**Step 2: MainHub 컴포넌트 본문 리라이트**

Props 타입은 동일 유지. 컴포넌트 본문을 landscape 레이아웃으로 교체:

```tsx
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
  const [timeTheme, setTimeTheme] = useState<TimeTheme>({ overlay: "rgba(180,200,255,0.08)", showStars: false });
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
    <main className="relative h-full w-full overflow-hidden select-none">
      {/* [1] Background image */}
      <Image
        src="/backgrounds/academy-gate-landscape.png"
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
        style={{ background: "linear-gradient(180deg, rgba(8,6,20,0.6) 0%, transparent 100%)" }}
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
        style={{ background: "radial-gradient(ellipse 95% 90% at 50% 40%, transparent 40%, rgba(8,6,20,0.35) 100%)" }}
      />

      {/* Night stars (only when showStars) */}
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
      <div className="relative z-10 flex h-full flex-col justify-between">

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
                if (typeof window !== "undefined") {
                  window.location.href = "/provision";
                }
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
              href={buildChildHref({ pathname: "/today", childId, params: { day: currentDayId } })}
              className="group relative"
              aria-label="Today"
            >
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl transition-all group-hover:opacity-100 opacity-70"
                style={{ backgroundColor: theme.todayGlow }}
              />
              <div className={`relative overflow-hidden rounded-[1.4rem] border-2 ${theme.todayBorder} bg-gradient-to-b ${theme.todayBg} px-12 py-4 text-center shadow-[0_0_40px_${theme.todayGlow},inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all duration-300 group-hover:scale-105 md:px-16 md:py-5`}>
                <p className={`text-sm font-bold uppercase tracking-[0.35em] ${theme.accentLabel} md:text-base`}>
                  Today
                </p>
                <p
                  className="mt-1 text-2xl font-semibold text-white md:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {currentDayTitle}
                </p>
                <p className={`mt-1.5 text-base font-bold ${theme.accentLabel} md:text-lg`}>
                  오늘의 Day 시작 →
                </p>
                {/* Day progress badges */}
                <div className="mt-2 flex items-center justify-center gap-2" data-testid="day-progress-badges">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      dayStage === "learn_completed" || dayStage === "test_completed" || dayStage === "completed"
                        ? "bg-emerald-600/90 text-white"
                        : "bg-white/15 text-white/60"
                    }`}
                    data-testid="learn-badge"
                  >
                    {dayStage === "learn_completed" || dayStage === "test_completed" || dayStage === "completed"
                      ? "Learn ✓" : "Learn"}
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
                      ? "Test ✓" : "Test"}
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
                <p className="text-xs font-bold uppercase tracking-wider text-sky-300/70 md:text-sm">Review</p>
                <p className="mt-1 text-lg font-black text-sky-50 md:text-xl">복습실</p>
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
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300/70 md:text-sm">History</p>
                <p className="mt-1 text-lg font-black text-amber-50 md:text-xl">기록실</p>
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
              <p className="text-base font-bold text-white md:text-lg">{childName}의 성장</p>
              <p className="text-xs text-violet-200/50 md:text-sm">XP · Level · 배지</p>
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
```

**Step 3: 빌드 확인**

Run: `npm run typecheck`
Expected: PASS

**Step 4: 커밋**

```bash
git add src/components/hub/main-hub.tsx
git commit -m "feat(hub): landscape 배경 이미지 + 시간대별 오버레이 + 프로필 테마 리디자인"
```

---

### Task 2: 테스트 업데이트

**Files:**
- Modify: `src/components/hub/main-hub.test.tsx`

기존 테스트가 portrait 레이아웃 기준이므로, 변경된 DOM 구조에 맞게 업데이트.
주요 변경: data-testid는 모두 유지되므로, 기존 테스트 대부분 통과 예상.
추가 테스트: 프로필 테마 전환 검증.

**Step 1: 기존 테스트 실행하여 실패 항목 확인**

Run: `npm test -- src/components/hub/main-hub.test.tsx`

**Step 2: 실패 테스트 수정 + 프로필 테마 테스트 추가**

```typescript
it("지온 profile shows sky-themed streak badge", () => {
  render(<MainHub {...defaultProps} childId="지온" childName="지온" streak={5} />);
  const badge = screen.getByTestId("streak-badge");
  expect(badge).toHaveClass("bg-sky-300/10");
});
```

**Step 3: 테스트 통과 확인**

Run: `npm test -- src/components/hub/main-hub.test.tsx`
Expected: ALL PASS

**Step 4: 커밋**

```bash
git add src/components/hub/main-hub.test.tsx
git commit -m "test(hub): landscape 리디자인에 맞게 테스트 업데이트 + 프로필 테마 검증"
```

---

### Task 3: 중복 scene 컴포넌트 삭제

**Files:**
- Delete: `src/components/hub/main-hub-scene.tsx`
- Delete: `src/components/hub/main-hub-scene-bg.tsx`
- Modify: `src/app/design-preview/hub/page.tsx`

**Step 1: design-preview 페이지를 MainHub로 전환**

```tsx
"use client";

import Link from "next/link";
import { MainHub } from "@/components/hub/main-hub";

export default function HubPreviewPage() {
  return (
    <div className="relative h-[100dvh] w-[100dvw]">
      <MainHub
        childId="다온"
        currentDayId="day-005"
        childName="다온"
        level={7}
        streak={12}
        currentDayTitle="Day 05 Test"
        previewMode
      />
      <Link
        href="/design-preview"
        className="fixed bottom-3 left-3 z-50 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/80"
      >
        &larr; Back to previews
      </Link>
    </div>
  );
}
```

**Step 2: scene 파일 삭제**

```bash
rm src/components/hub/main-hub-scene.tsx
rm src/components/hub/main-hub-scene-bg.tsx
```

**Step 3: 빌드 + 테스트 확인**

Run: `npm run typecheck && npm test`
Expected: PASS (no remaining imports of deleted files)

**Step 4: 커밋**

```bash
git add -u
git add src/app/design-preview/hub/page.tsx
git commit -m "chore(hub): 중복 scene 컴포넌트 삭제, design-preview를 MainHub로 통합"
```

---

### Task 4: Playwright 스크린샷 검증

**Files:** none (visual verification only)

**Step 1: dev 서버 실행**

Run: `npm run dev` (if not running)

**Step 2: Playwright 스크린샷 — 다온 프로필**

```bash
npx playwright screenshot --viewport-size="1180,820" http://localhost:3000/design-preview/hub /tmp/hub-daon.png
```

**Step 3: Playwright 스크린샷 — 지온 프로필**

design-preview 페이지에서 childId를 "지온"으로 변경하여 확인하거나, 별도 URL 파라미터 지원 추가.

**Step 4: 스크린샷 확인 후 시각적 이슈가 있으면 Task 1로 돌아가 조정**
