# BrideVOCA v0.1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a child-friendly iPad-first vocabulary web app with a simple learn-and-test loop, local-only persistence, and speech-based quiz support.

**Architecture:** Implement a frontend-only Next.js app deployed on Vercel. Keep the first version local-only with `localStorage`, built-in JSON word books, and a narrow parent surface that only adds custom words. Prioritize the `Today -> Learn -> Test -> Character` loop and keep review as recorded state only.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, localStorage, browser TTS/audio, browser speech recognition, Vitest, Testing Library, Vercel

---

## Assumptions

- Work happens inside the `BrideVOCA` project root.
- v0.1 targets iPad Safari first.
- Speech stays in scope even if it becomes the highest-risk area.
- This plan optimizes for shipping a usable first version, not a complete learning platform.

### Task 1: Initialize the project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `README.md`

**Step 1: Scaffold the app**

Create a new Next.js TypeScript app with Tailwind CSS.

**Step 2: Run the app**

Run: `npm run dev`
Expected: local dev server starts

**Step 3: Replace starter page**

Render a minimal BrideVOCA shell with a placeholder `Today` screen.

**Step 4: Verify**

Run: `npm run dev`
Expected: app opens with a clean child-first landing page

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize BrideVOCA app shell"
```

### Task 2: Add vocabulary seed data and app types

**Files:**
- Create: `src/data/wordbooks/animals.json`
- Create: `src/data/wordbooks/home.json`
- Create: `src/lib/types.ts`
- Create: `src/lib/wordbooks.ts`
- Test: `src/lib/wordbooks.test.ts`

**Step 1: Write the failing test**

```ts
import { getBuiltInWordbooks } from "./wordbooks";

it("loads built-in word books", () => {
  const books = getBuiltInWordbooks();
  expect(books.length).toBeGreaterThan(0);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/wordbooks.test.ts`
Expected: FAIL

**Step 3: Implement**

Add typed local word book loading from JSON files.

**Step 4: Verify**

Run: `npm test -- src/lib/wordbooks.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data src/lib
git commit -m "feat: add built-in vocabulary seed data"
```

### Task 3: Add local app persistence

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/default-state.ts`
- Test: `src/lib/storage.test.ts`

**Step 1: Write the failing test**

```ts
import { loadState, saveState } from "./storage";

it("saves and loads app state with localStorage", () => {
  saveState({ customWords: [] });
  expect(loadState().customWords).toEqual([]);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/storage.test.ts`
Expected: FAIL

**Step 3: Implement**

Add localStorage helpers and a safe default state fallback.

**Step 4: Verify**

Run: `npm test -- src/lib/storage.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: add local-only persistence"
```

### Task 4: Build the Today screen

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/today/today-screen.tsx`
- Create: `src/components/today/today-card.tsx`
- Test: `src/components/today/today-screen.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { TodayScreen } from "./today-screen";

it("shows goal completion, learn, test, and character entry points", () => {
  render(<TodayScreen />);
  expect(screen.getByText(/today/i)).toBeInTheDocument();
  expect(screen.getByText(/learn/i)).toBeInTheDocument();
  expect(screen.getByText(/test/i)).toBeInTheDocument();
  expect(screen.getByText(/character/i)).toBeInTheDocument();
});
```

**Step 2: Run it**

Run: `npm test -- src/components/today/today-screen.test.tsx`
Expected: FAIL

**Step 3: Implement**

Render:
- main completion progress
- supporting counts for new words and test questions
- three main actions

**Step 4: Verify**

Run: `npm test -- src/components/today/today-screen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app src/components/today
git commit -m "feat: add Today home screen"
```

### Task 5: Build the learn flow

**Files:**
- Create: `src/app/learn/page.tsx`
- Create: `src/components/learn/word-card.tsx`
- Create: `src/lib/learn.ts`
- Test: `src/lib/learn.test.ts`

**Step 1: Write the failing test**

```ts
import { getLearnBatch } from "./learn";

it("returns a short learn batch for today", () => {
  expect(getLearnBatch(mockWords, 5)).toHaveLength(5);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/learn.test.ts`
Expected: FAIL

**Step 3: Implement**

Select a short word batch and render child-friendly learning cards.

**Step 4: Verify**

Run: `npm test -- src/lib/learn.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/learn src/components/learn src/lib/learn.*
git commit -m "feat: add learn-new-words flow"
```

### Task 6: Build quiz question generation for v0.1

**Files:**
- Create: `src/lib/question-types.ts`
- Create: `src/lib/quiz.ts`
- Test: `src/lib/quiz.test.ts`

**Step 1: Write the failing test**

```ts
import { generateQuiz } from "./quiz";

it("generates a quiz with multiple choice, listening, and speaking items", () => {
  const quiz = generateQuiz(mockWords, 9);
  expect(quiz.questions.some((q) => q.type === "multiple_choice")).toBe(true);
  expect(quiz.questions.some((q) => q.type === "listening")).toBe(true);
  expect(quiz.questions.some((q) => q.type === "speaking")).toBe(true);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/quiz.test.ts`
Expected: FAIL

**Step 3: Implement**

Generate a short quiz with all three v0.1 question modes.

**Step 4: Verify**

Run: `npm test -- src/lib/quiz.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/question-types.ts src/lib/quiz.*
git commit -m "feat: add v0.1 quiz generation"
```

### Task 7: Add listening support

**Files:**
- Create: `src/lib/audio.ts`
- Test: `src/lib/audio.test.ts`

**Step 1: Write the failing test**

```ts
import { canUseSpeechOutput } from "./audio";

it("detects audio output support safely", () => {
  expect(typeof canUseSpeechOutput()).toBe("boolean");
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/audio.test.ts`
Expected: FAIL

**Step 3: Implement**

Add a browser-safe TTS/audio helper for listening questions.

**Step 4: Verify**

Run: `npm test -- src/lib/audio.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/audio.*
git commit -m "feat: add listening audio support"
```

### Task 8: Add speaking support with similarity scoring

**Files:**
- Create: `src/lib/speech.ts`
- Create: `src/lib/string-similarity.ts`
- Test: `src/lib/speech.test.ts`
- Test: `src/lib/string-similarity.test.ts`

**Step 1: Write the failing tests**

```ts
import { isSpokenAnswerCorrect } from "./speech";

it("accepts near-match speech transcripts", () => {
  expect(isSpokenAnswerCorrect("aple", "apple")).toBe(true);
});
```

**Step 2: Run them**

Run: `npm test -- src/lib/speech.test.ts src/lib/string-similarity.test.ts`
Expected: FAIL

**Step 3: Implement**

Add:
- speech recognition wrapper
- transcript normalization
- similarity-based correctness check
- one-retry handling support

**Step 4: Verify**

Run: `npm test -- src/lib/speech.test.ts src/lib/string-similarity.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/speech.* src/lib/string-similarity.*
git commit -m "feat: add speaking answer evaluation"
```

### Task 9: Build the test session UI

**Files:**
- Create: `src/app/test/page.tsx`
- Create: `src/components/test/test-session.tsx`
- Create: `src/components/test/question-view.tsx`
- Test: `src/components/test/question-view.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { QuestionView } from "./question-view";

it("renders question UI for quiz items", () => {
  render(<QuestionView question={mockQuestion} onAnswer={() => {}} />);
  expect(screen.getByText(mockQuestion.prompt)).toBeInTheDocument();
});
```

**Step 2: Run it**

Run: `npm test -- src/components/test/question-view.test.tsx`
Expected: FAIL

**Step 3: Implement**

Render all v0.1 question modes:
- tap choice
- play audio and choose
- tap mic and speak

**Step 4: Verify**

Run: `npm test -- src/components/test/question-view.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/test src/components/test
git commit -m "feat: add quiz session UI"
```

### Task 10: Save quiz results and lightweight mistake records

**Files:**
- Create: `src/lib/results.ts`
- Test: `src/lib/results.test.ts`

**Step 1: Write the failing test**

```ts
import { applyResults } from "./results";

it("records wrong answers without full review flow", () => {
  const result = applyResults(mockState, [mockWrongAnswer]);
  expect(result.mistakes.length).toBeGreaterThan(0);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/results.test.ts`
Expected: FAIL

**Step 3: Implement**

Persist:
- test history
- mistake records
- progress counts

Do not build a standalone review screen yet.

**Step 4: Verify**

Run: `npm test -- src/lib/results.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/results.*
git commit -m "feat: record quiz results and mistakes"
```

### Task 11: Add parent word entry screen

**Files:**
- Create: `src/app/settings/page.tsx`
- Create: `src/components/settings/add-word-form.tsx`
- Test: `src/components/settings/add-word-form.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { AddWordForm } from "./add-word-form";

it("collects a new custom word and meaning", () => {
  render(<AddWordForm onSubmit={() => {}} />);
  expect(screen.getByLabelText(/english/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/meaning/i)).toBeInTheDocument();
});
```

**Step 2: Run it**

Run: `npm test -- src/components/settings/add-word-form.test.tsx`
Expected: FAIL

**Step 3: Implement**

Allow parent to add custom words only.

**Step 4: Verify**

Run: `npm test -- src/components/settings/add-word-form.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/settings src/components/settings
git commit -m "feat: add parent custom word entry"
```

### Task 12: Add character progress

**Files:**
- Create: `src/lib/character.ts`
- Create: `src/app/character/page.tsx`
- Create: `src/components/character/character-panel.tsx`
- Test: `src/lib/character.test.ts`

**Step 1: Write the failing test**

```ts
import { grantXp } from "./character";

it("increases level progress after completed sessions", () => {
  const next = grantXp({ xp: 0, level: 1, mood: "neutral" }, 10);
  expect(next.xp).toBeGreaterThan(0);
});
```

**Step 2: Run it**

Run: `npm test -- src/lib/character.test.ts`
Expected: FAIL

**Step 3: Implement**

Add:
- xp
- level
- simple mood/expression state

**Step 4: Verify**

Run: `npm test -- src/lib/character.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/character.* src/app/character src/components/character
git commit -m "feat: add simple character progression"
```

### Task 13: Verify Safari-first speech loop

**Files:**
- Modify: `README.md`
- Create: `docs/plans/qa-notes-v0.1.md`

**Step 1: Run automated tests**

Run: `npm test`
Expected: PASS

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS

**Step 3: Manual device verification**

Run: `npm run dev`
Expected:
- Today screen works on iPad layout
- listening plays
- speaking capture opens and returns transcript
- near-match speech can pass

**Step 4: Document observed speech behavior**

Write down:
- what worked
- what failed
- whether iPad Safari needs fallback UX

**Step 5: Commit**

```bash
git add README.md docs/plans/qa-notes-v0.1.md
git commit -m "docs: capture v0.1 verification notes"
```
