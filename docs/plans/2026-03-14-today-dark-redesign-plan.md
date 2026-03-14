# Today 화면 다크 리디자인 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Today(개인 연습실) 화면을 Hub/History/Review/Character와 동일한 다크 디자인 언어로 통일 + "홈으로" 복귀 버튼 추가

**Architecture:** Today는 상태별 UI 분기가 많은 복잡한 화면. 배경 이미지 + 다크 오버레이 기조로 전환하되, Learn/Test 카드의 상태별 시각 구분(primary/secondary/complete)은 다크 팔레트 내에서 유지. 프로필별(다온/지온) 테마 적용.

**Tech Stack:** Next.js Image, Tailwind CSS 4, Vertex AI Imagen 3

---

## 대상 파일

| File | Screen World | 변경 규모 |
|---|---|---|
| `src/components/today/today-stage.tsx` | 개인 연습실 (Today landing) | **대** — 다크 전환 + 홈 버튼 추가 |
| `src/components/learn/learn-card.tsx` | 연습실 내부 (Learn) | **중** — 다크 전환 + 홈 버튼 추가 |
| `src/components/test/learning-test-screen.tsx` | 연습실 내부 (Test) | **소** — 이미 다크 섹션 있음, 외부 배경만 전환 |

## 배경 이미지 (2장 — 개인 연습실)

| Profile | File | Imagen Prompt |
|---|---|---|
| 다온 | `today-practice-warm.png` | "Interior of a magical practice room in fantasy academy, warm amber torchlight, wooden training dummies, spell books on desk, cozy focused atmosphere, digital art, game background, landscape 1180x820" |
| 지온 | `today-practice-cool.png` | "Interior of a magical practice room in fantasy academy, cool blue crystal lighting, elegant training equipment, floating spell scrolls, focused serene atmosphere, digital art, game background, landscape 1180x820" |

## 프로필 테마

```typescript
type TodayTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  labelText: string;
  primaryBg: string;        // Learn primary state
  primaryBorder: string;
};

const TODAY_THEMES: Record<string, TodayTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/today-practice-warm.png",
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/35",
    labelText: "text-amber-200/70",
    primaryBg: "bg-violet-600/90",
    primaryBorder: "border-violet-400/40",
  },
  "지온": {
    backgroundSrc: "/backgrounds/today-practice-cool.png",
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/35",
    labelText: "text-sky-200/70",
    primaryBg: "bg-indigo-600/90",
    primaryBorder: "border-indigo-400/40",
  },
};
```

---

### Task 1: 배경 이미지 생성 (2장)

**Files:**
- Create: `public/backgrounds/today-practice-warm.png`
- Create: `public/backgrounds/today-practice-cool.png`

**Step 1:** Imagen 3 API로 2장 순차 생성 (quota 주의)

**Step 2:** 파일 확인

**Step 3:** Commit
```bash
git add public/backgrounds/today-practice-*.png
git commit -m "feat: Today 연습실 배경 이미지 2장 생성 — Imagen 3 (다온/지온)"
```

---

### Task 2: today-stage.tsx 다크 리디자인

**Files:**
- Modify: `src/components/today/today-stage.tsx`
- Test: `src/components/today/today-stage.test.tsx` (6 tests, 변경 없이 통과해야 함)

**핵심 변경:**

1. `import Image from "next/image"` 추가
2. 프로필 테마 맵 추가 (위 TodayTheme)
3. `min-h-screen` 밝은 배경 → `h-[100dvh] overflow-hidden` + `<Image>` 배경 + 다크 오버레이
4. header 카드: 밝은 흰색 → glassmorphism (`backdrop-blur-sm + bg-white/8 + border-white/15`)
5. Learn/Test 카드: 밝은 배경 → glassmorphism + 상태별 구분 유지
   - Learn primary: violet/indigo glow (기존 톤 유지, 다크 내에서)
   - Test primary: 기존 다크 스타일 유지 (이미 어두움)
   - Test locked: `bg-white/5 border-white/10` 으로 변경
   - Day complete: muted glassmorphism
6. Room Status 카드: 밝은 흰색 → glassmorphism
7. transition message: 밝은 amber → glassmorphism amber glow
8. progress labels: 밝은 bg → `bg-white/10` (inactive), `bg-violet-600` (active)
9. **"홈으로" 버튼 추가** — header 우측, Hub 복귀 Link
10. 내부 스크롤 처리 (콘텐츠 넘칠 경우)

**레이아웃:**
```
<main h-[100dvh] w-full overflow-hidden relative>
  <Image> background
  <div> dark overlay
  <div> top/bottom gradients
  <div z-10 flex flex-col h-[100dvh] overflow-y-auto>
    <header> Today label + dayTitle + stage + "홈으로" 버튼
    <section> Learn/Test cards
  </div>
</main>
```

**Step 1:** 기존 테스트 통과 확인 (6 tests)
**Step 2:** 리디자인 구현
**Step 3:** 테스트 통과 확인
**Step 4:** Playwright 스크린샷 확인
**Step 5:** Commit

---

### Task 3: learn-card.tsx 다크 리디자인

**Files:**
- Modify: `src/components/learn/learn-card.tsx`
- Test: `src/components/learn/learn-card.test.tsx`

**핵심 변경:**

1. `import Image from "next/image"` 추가
2. 프로필 테마 (childId 기반)
3. `min-h-screen` 밝은 배경 → `h-[100dvh]` + `<Image>` 배경 (Today와 동일 이미지 재사용) + 다크 오버레이
4. 단어 카드 영역: 밝은 → glassmorphism
5. 하단 정보 섹션: 이미 다크 — 유지
6. **"홈으로" 버튼 추가** — 상단 헤더에

**Step 1:** 기존 테스트 통과 확인
**Step 2:** 리디자인 구현
**Step 3:** 테스트 통과 확인
**Step 4:** Commit

---

### Task 4: learning-test-screen.tsx 다크 배경 통일

**Files:**
- Modify: `src/components/test/learning-test-screen.tsx`
- Test: `src/components/test/learning-test-screen.test.tsx`

**핵심 변경:**

1. outer background 변수 `outerBackgroundClass` → 다크 그라데이션으로 변경 (Review 모드/일반 모드 구분 유지)
2. `min-h-screen` → `h-[100dvh] overflow-hidden`
3. "홈으로" 버튼은 이미 있음 (`test-session.tsx`에서) — 확인만

**주의:** test/review session은 진행 중인 시험이라 배경 이미지 없이 다크 그라데이션만 적용 (집중 모드)

**Step 1:** 기존 테스트 통과 확인
**Step 2:** 배경 변경
**Step 3:** 테스트 통과 확인
**Step 4:** Commit

---

### Task 5: 전체 검증

**Step 1:** 전체 테스트 `npm test`
**Step 2:** `npm run typecheck`
**Step 3:** `npm run build`
**Step 4:** Playwright 스크린샷 — Today(4 상태) + Learn + Test 확인
**Step 5:** 커밋 + 푸시
