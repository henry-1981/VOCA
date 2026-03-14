# Sub-Screens Dark Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** History, Review, Character 화면을 Hub와 동일한 다크 디자인 언어(배경 이미지 + 글래스모피즘)로 통일

**Architecture:** 각 화면에 프로필별 배경 이미지(Imagen 3 생성) + 다크 오버레이 + glassmorphism 카드 적용. Hub의 `<Image> + overlay + backdrop-blur` 패턴을 재사용. `h-[100dvh]` 고정 뷰포트, 콘텐츠 내부 스크롤.

**Tech Stack:** Next.js Image, Tailwind CSS 4, Vertex AI Imagen 3 (gcloud)

**Design Doc:** `docs/plans/2026-03-14-sub-screens-dark-redesign-design.md`

---

### Task 1: 배경 이미지 생성 (6장)

**Files:**
- Create: `public/backgrounds/history-library-warm.png`
- Create: `public/backgrounds/history-library-cool.png`
- Create: `public/backgrounds/review-moonlit-warm.png`
- Create: `public/backgrounds/review-moonlit-cool.png`
- Create: `public/backgrounds/character-lab-warm.png`
- Create: `public/backgrounds/character-lab-cool.png`

**Step 1: Imagen 3 API로 6장 생성**

각 이미지마다 gcloud REST API 호출:

```bash
# Pattern for each image:
curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0385514829/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict" \
  -d '{
    "instances": [{"prompt": "<PROMPT>"}],
    "parameters": {"sampleCount": 1, "aspectRatio": "16:9", "sampleImageSize": 1024}
  }' | python3 -c "import sys,json,base64; d=json.load(sys.stdin); open('<OUTPUT_FILE>','wb').write(base64.b64decode(d['predictions'][0]['bytesBase64Encoded']))"
```

Prompts (from design doc):
1. `history-library-warm.png`: "Interior of a warm magical fantasy library with tall dark wooden bookshelves, golden candlelight, ancient scrolls and leather-bound books, cozy amber lighting, digital art, game background, landscape 1180x820"
2. `history-library-cool.png`: "Interior of a cool-toned magical fantasy library with tall oak bookshelves, soft blue-tinted lantern light, ancient scrolls and crystal bookends, serene atmosphere, digital art, game background, landscape 1180x820"
3. `review-moonlit-warm.png`: "Moonlit quiet study room in a magic academy, warm golden moonlight through arched windows, candles on desk, calm serene atmosphere, amber-gold tones, digital art, game background, landscape 1180x820"
4. `review-moonlit-cool.png`: "Moonlit quiet study room in a magic academy, cool silver moonlight streaming through arched windows, crystal orbs softly glowing, calm serene blue-silver atmosphere, digital art, game background, landscape 1180x820"
5. `character-lab-warm.png`: "Secret magical laboratory in fantasy academy, warm amber arcane circles glowing on floor, golden potions and crystals, mysterious warm purple-gold ambient lighting, digital art, game background, landscape 1180x820"
6. `character-lab-cool.png`: "Secret magical laboratory in fantasy academy, cool blue-violet arcane circles glowing on floor, ice-blue crystals and silver potions, mysterious cool blue-purple ambient lighting, digital art, game background, landscape 1180x820"

**Step 2: 이미지 파일 확인**

```bash
ls -la public/backgrounds/*.png
```

Expected: 8 files (기존 2 + 새 6), 각 ~1MB

**Step 3: Commit**

```bash
git add public/backgrounds/history-*.png public/backgrounds/review-*.png public/backgrounds/character-*.png
git commit -m "feat: 서브 화면 배경 이미지 6장 생성 — Imagen 3 (History/Review/Character × 다온/지온)"
```

---

### Task 2: History 화면 다크 리디자인

**Files:**
- Modify: `src/components/history/history-screen.tsx`
- Test: `src/components/history/history-screen.test.tsx` (기존 테스트 유지 확인)

**Step 1: 기존 테스트 통과 확인**

```bash
npm test -- --run src/components/history/history-screen.test.tsx
```

Expected: 2 tests PASS

**Step 2: history-screen.tsx 리디자인**

핵심 변경:
- `"use client"` 추가 (Image component 사용)
- `import Image from "next/image"` 추가
- 프로필 테마 맵 추가 (다온: amber/warm, 지온: sky/cool)
- `min-h-screen` light background → `h-[100dvh]` + Image background + dark overlays
- 크림/세피아 카드 → glassmorphism 카드 (backdrop-blur + 반투명)
- 다크 텍스트 → 흰색/반투명 텍스트
- 엔트리 영역: 내부 스크롤 (overflow-y-auto)
- 모든 기존 텍스트, Link, data-testid 보존

프로필 테마:
```typescript
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
```

레이아웃 구조:
```
<main h-[100dvh] overflow-hidden>
  <Image> background
  <div> dark overlay
  <div> top gradient
  <div> bottom gradient
  <div z-10 flex flex-col h-[100dvh]>
    <header> title + back link
    <section overflow-y-auto> entry cards (scrollable)
  </div>
</main>
```

**Step 3: 테스트 통과 확인**

```bash
npm test -- --run src/components/history/history-screen.test.tsx
```

Expected: 2 tests PASS (텍스트/링크 동일하므로)

**Step 4: Playwright 스크린샷으로 시각 확인**

```bash
npx playwright test --headed -g "history" 2>/dev/null || echo "Manual check needed"
```

또는 dev 서버에서 직접 스크린샷 확인

**Step 5: Commit**

```bash
git add src/components/history/history-screen.tsx
git commit -m "feat(history): 다크 디자인 리디자인 — 배경 이미지 + 글래스모피즘 카드"
```

---

### Task 3: Review 화면 다크 리디자인

**Files:**
- Modify: `src/components/review/review-screen.tsx`
- Test: `src/components/review/review-screen.test.tsx` (기존 테스트 유지 확인)

**Step 1: 기존 테스트 통과 확인**

```bash
npm test -- --run src/components/review/review-screen.test.tsx
```

Expected: 1 test PASS

**Step 2: review-screen.tsx 리디자인**

핵심 변경:
- `"use client"` 추가
- `import Image from "next/image"` 추가
- 프로필 테마 맵 추가 (다온: amber-silver, 지온: sky-silver)
- 밝은 블루/화이트 → 다크 배경 이미지 + cool silver overlay
- 카드 → glassmorphism
- CTA 버튼 → dark gradient + silver glow
- 모든 텍스트, Link, 기능 보존

프로필 테마:
```typescript
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
```

**Step 3: 테스트 통과 확인**

```bash
npm test -- --run src/components/review/review-screen.test.tsx
```

Expected: 1 test PASS

**Step 4: 스크린샷 확인**

**Step 5: Commit**

```bash
git add src/components/review/review-screen.tsx
git commit -m "feat(review): 다크 디자인 리디자인 — 달빛 배경 + 글래스모피즘 카드"
```

---

### Task 4: Character 화면 다크 리디자인

**Files:**
- Modify: `src/components/character/character-screen.tsx`
- Test: `src/components/character/character-screen.test.tsx` (기존 테스트 유지 확인)

**Step 1: 기존 테스트 통과 확인**

```bash
npm test -- --run src/components/character/character-screen.test.tsx
```

Expected: 3 tests PASS

**Step 2: character-screen.tsx 리디자인**

핵심 변경 (이미 다크이므로 변경 최소):
- `import Image from "next/image"` 추가
- 프로필 테마 맵 추가 (다온: warm violet, 지온: cool violet)
- CSS gradient background → Image background + violet overlay
- `min-h-screen` → `h-[100dvh] overflow-hidden`
- 기존 sparkle particles, magic aura, glow-pulse 유지
- 모든 data-testid, 기능 보존

프로필 테마:
```typescript
type CharacterTheme = {
  backgroundSrc: string;
  cardBorder: string;
  cardBg: string;
  auraColor: string;
};

const CHARACTER_THEMES: Record<string, CharacterTheme> = {
  "다온": {
    backgroundSrc: "/backgrounds/character-lab-warm.png",
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/30",
    auraColor: "rgba(255,200,80,0.15)",
  },
  "지온": {
    backgroundSrc: "/backgrounds/character-lab-cool.png",
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/30",
    auraColor: "rgba(56,189,248,0.15)",
  },
};
```

**Step 3: 테스트 통과 확인**

```bash
npm test -- --run src/components/character/character-screen.test.tsx
```

Expected: 3 tests PASS

**Step 4: 스크린샷 확인**

**Step 5: Commit**

```bash
git add src/components/character/character-screen.tsx
git commit -m "feat(character): 배경 이미지 + Hub 통일 디자인 적용"
```

---

### Task 5: 전체 테스트 + 빌드 검증

**Step 1: 전체 테스트 실행**

```bash
npm test -- --run
```

Expected: 91+ tests PASS (기존 테스트 모두 통과)

**Step 2: TypeScript 타입 체크**

```bash
npm run typecheck
```

Expected: 에러 없음

**Step 3: Lint**

```bash
npm run lint
```

Expected: 경고/에러 없음

**Step 4: 빌드**

```bash
npm run build
```

Expected: 성공

**Step 5: dev 서버에서 Playwright 스크린샷으로 3개 화면 모두 확인**

다온/지온 프로필 각각 History, Review, Character 화면 스크린샷 촬영하여 시각적 통일감 검증.

---

### Task 6: 최종 커밋 (필요 시)

수정사항이 있으면 추가 커밋. 없으면 스킵.
