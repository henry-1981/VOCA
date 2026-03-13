# BrideVOCA Family App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the two-child family version of BrideVOCA for two iPads, with fixed child-per-device entry, shared cloud data, Day-based learning, and the `Today / Character / History / Review` loop.

**Architecture:** Keep the current Next.js app and evolve it into a Firebase-backed family app. Use Firestore as the source of truth, local device binding for “which child belongs to this iPad,” and Day-based content seeded from manually entered or GPT-refined textbook data. Preserve the validated magical-academy design and implement the child flow first; keep parent/admin UI out of scope.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Firebase Auth, Cloud Firestore, localStorage (device binding + cache), Vitest, Testing Library

---

## Assumptions

- Work happens in the current `BrideVOCA` worktree.
- The current lightweight MVP code is a disposable starter, not the final architecture.
- Each iPad is bound to one child profile during setup and normally opens that child directly.
- The parent/operator can manually prepare Day data outside the child UI.
- `1 Day = 20 words`.
- current content cadence indicates:
  - 4 learning Days
  - then 1 checkpoint test Day
- Day data input is fixed to two practical methods for now:
  - manual Day DB generation with assistant help
  - GPT-refined OCR text from phone photos, then assistant conversion into app seed data

## Critical Implementation Decisions

- Auth uses Firebase and a one-time family provisioning flow.
- The parent signs in once during provisioning, creates or links one family record, creates two child profiles, and binds each iPad to one child.
- This setup flow is not treated as the normal in-app parent management surface.
- Parent Google login is the intended provisioning identity.
- Child Google accounts are not part of the required product flow.
- Initial word playback uses browser / OS TTS.
- Existing Bridge VOCA MP3 assets can be explored later as an enhancement or fallback, but they are not required to ship the first family version.
- Learn completion means the child has seen all 20 words in the Day at least once.
- Day content must support at least two kinds:
  - `learning`
  - `checkpoint_test`
- Firestore is the source of truth for live app content and progress.
- Local JSON files exist only as an import/staging format for Day seeds.
- Local/desktop verification may use popup-based Google login to verify Firebase plumbing.
- Redirect-based Google login remains the target real-world path and should be verified again on the deployed domain, especially for iPad/PWA use.

## Revised Critical Execution Order

Execute in this order even if later task numbers remain grouped by feature area:

1. test + Firebase scaffolding
2. family domain types and Firestore converters
3. family provisioning and Firebase Auth
4. immediate Firestore sync / writeback foundation
5. device binding and app bootstrap
6. textbook Day ingestion pipeline
7. academy hub
8. Today flow with Day-kind branching
9. Learn
10. Test + checkpoint test mode
11. Review
12. History
13. Character
14. PWA shell
15. final verification and archive note

## Firestore Data Direction

Use one family root document and child-specific subcollections.

```text
families/{familyId}
families/{familyId}/devices/{deviceId}
families/{familyId}/children/{childId}
families/{familyId}/children/{childId}/progress/current
families/{familyId}/children/{childId}/history/{sessionId}
families/{familyId}/children/{childId}/reviewQueue/{itemId}
families/{familyId}/children/{childId}/dayProgress/{dayId}
content/books/{bookId}/days/{dayId}
```

The data model should support:

- separate child Day progress
- separate XP / Level / Streak
- immediate writes after meaningful activity
- recent Day history
- accumulated wrong-answer review queue
- content import by Day

Use the paths with these meanings:

- `content/books/.../days/...` = shared source content
- `children/.../dayProgress/...` = child-specific state for that Day
- `children/.../progress/current` = current summary snapshot only
- `families/.../devices/...` = device-to-child binding registry for recovery

## Legacy Document Handling

These remain in place during implementation, but become archive references after the new family plan is active:

- `docs/plans/2026-03-11-english-vocab-webapp-design.md`
- `docs/plans/2026-03-11-english-vocab-webapp.md`

The active documents become:

- `docs/plans/2026-03-11-family-app-spec.md`
- `docs/plans/2026-03-11-family-app-design.md`
- this plan

### Task 1: Add test and Firebase project scaffolding

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `.env.example`
- Create: `firebase.json`
- Create: `firestore.rules`
- Create: `firestore.indexes.json`
- Modify: `README.md`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";

describe("test scaffold", () => {
  it("runs vitest in jsdom", () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run`
Expected: FAIL because test tooling is not installed/configured yet

**Step 3: Add minimal test + Firebase config**

- add `test`, `test:watch`, and `typecheck` scripts to `package.json`
- add dev dependencies for `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- add Firebase env placeholders to `.env.example`
- add Firestore config files

**Step 4: Run it to verify it passes**

Run: `npm test -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add package.json vitest.config.ts src/test/setup.ts .env.example firebase.json firestore.rules firestore.indexes.json README.md
git commit -m "chore: add test and firebase scaffolding"
```

### Task 2: Define family-app domain types and Firestore converters

**Files:**
- Create: `src/lib/types/domain.ts`
- Create: `src/lib/types/firestore.ts`
- Create: `src/lib/firebase/client.ts`
- Create: `src/lib/firebase/firestore.ts`
- Create: `src/lib/firebase/converters.ts`
- Test: `src/lib/firebase/converters.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { toChildProgressDoc } from "./converters";

describe("child progress converter", () => {
  it("serializes streak and xp fields", () => {
    const doc = toChildProgressDoc({
      childId: "daon",
      currentDayId: "day-003",
      xp: 120,
      level: 2,
      streak: 4
    });

    expect(doc.streak).toBe(4);
    expect(doc.level).toBe(2);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/firebase/converters.test.ts`
Expected: FAIL because the converter and types do not exist

**Step 3: Implement the family data model**

Include exact types for:

- `Family`
- `ChildProfile`
- `DayContent`
- `ChildProgress`
- `DayHistoryEntry`
- `ReviewQueueItem`
- `DeviceBinding`

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/firebase/converters.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/types/domain.ts src/lib/types/firestore.ts src/lib/firebase/client.ts src/lib/firebase/firestore.ts src/lib/firebase/converters.ts src/lib/firebase/converters.test.ts
git commit -m "feat: define family app domain model"
```

### Task 2.5: Implement Firebase Auth and family provisioning

**Files:**
- Create: `src/app/provision/page.tsx`
- Create: `src/components/provision/family-provision-form.tsx`
- Create: `src/lib/firebase/auth.ts`
- Create: `src/lib/firebase/provision-family.ts`
- Create: `src/lib/firebase/device-registry.ts`
- Test: `src/lib/firebase/provision-family.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createFamilyProvisionPayload } from "./provision-family";

describe("family provisioning", () => {
  it("creates a family payload with two child profiles and one device binding", () => {
    const payload = createFamilyProvisionPayload({
      familyName: "BrideVOCA Family",
      children: ["다온", "지온"],
      deviceId: "ipad-a"
    });

    expect(payload.children).toHaveLength(2);
    expect(payload.deviceBinding.deviceId).toBe("ipad-a");
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/firebase/provision-family.test.ts`
Expected: FAIL because provisioning helpers do not exist

**Step 3: Implement the one-time provisioning flow**

- sign in with Firebase Auth
- create one family record
- create two child profiles
- register one device binding
- return `familyId`, `childId`, and `deviceId` for local persistence

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/firebase/provision-family.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/provision/page.tsx src/components/provision/family-provision-form.tsx src/lib/firebase/auth.ts src/lib/firebase/provision-family.ts src/lib/firebase/device-registry.ts src/lib/firebase/provision-family.test.ts
git commit -m "feat: add family provisioning flow"
```

### Task 2.6: Add immediate Firestore writeback foundation

**Files:**
- Create: `src/lib/sync/write-child-progress.ts`
- Create: `src/lib/sync/write-day-history.ts`
- Create: `src/lib/sync/write-review-queue.ts`
- Modify: `src/lib/storage.ts`
- Test: `src/lib/sync/write-child-progress.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createProgressWrite } from "./write-child-progress";

describe("progress sync", () => {
  it("creates an immediate write payload after learn completion", () => {
    const payload = createProgressWrite({
      childId: "daon",
      currentDayId: "day-003",
      learnCompleted: true
    });

    expect(payload.learnCompleted).toBe(true);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/sync/write-child-progress.test.ts`
Expected: FAIL

**Step 3: Implement the sync foundation**

- write after Learn completion
- write after Test completion
- write after Review completion
- keep a local cache for resilience, but treat Firestore as source of truth

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/sync/write-child-progress.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/sync src/lib/storage.ts
git commit -m "feat: add cloud sync foundation"
```

### Task 3: Implement device binding and app bootstrap

**Files:**
- Create: `src/lib/device/device-binding.ts`
- Create: `src/lib/bootstrap/load-app-context.ts`
- Modify: `src/app/page.tsx`
- Test: `src/lib/device/device-binding.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { saveDeviceBinding, loadDeviceBinding } from "./device-binding";

describe("device binding", () => {
  it("loads the saved child binding for this iPad", () => {
    saveDeviceBinding({ familyId: "family-1", childId: "daon" });
    expect(loadDeviceBinding()?.childId).toBe("daon");
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/device/device-binding.test.ts`
Expected: FAIL because binding helpers do not exist

**Step 3: Implement bootstrap flow**

- use local binding to decide the default child profile
- recover or confirm the binding with `families/{familyId}/devices/{deviceId}`
- load child app context from Firestore using the stored `familyId` + `childId`
- if no binding exists, render a temporary setup gate instead of the child hub

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/device/device-binding.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/device/device-binding.ts src/lib/bootstrap/load-app-context.ts src/app/page.tsx src/lib/device/device-binding.test.ts
git commit -m "feat: add child-per-device bootstrap flow"
```

### Task 4: Build the textbook Day ingestion pipeline

**Files:**
- Create: `src/content/books/bridge-voca-basic/day-001.json`
- Create: `src/lib/content/day-schema.ts`
- Create: `src/lib/content/load-day.ts`
- Create: `scripts/import-bridge-day.ts`
- Create: `docs/plans/2026-03-11-book-ingestion-notes.md`
- Test: `src/lib/content/day-schema.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { parseDayContent } from "./day-schema";

describe("day schema", () => {
  it("requires exactly 20 words for one Day", () => {
    const day = parseDayContent({
      id: "day-001",
      title: "Day 01",
      words: Array.from({ length: 20 }, (_, index) => ({
        id: `word-${index}`,
        english: `word-${index}`,
        meaning: `뜻-${index}`
      }))
    });

    expect(day.words).toHaveLength(20);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/content/day-schema.test.ts`
Expected: FAIL because the parser does not exist

**Step 3: Implement the fixed ingestion workflow**

Support two accepted input paths:

- manual Day text provided directly for assistant-led DB creation
- GPT-refined OCR text from phone photos

The normalized output should become a Day JSON seed like:

```json
{
  "id": "day-001",
  "title": "Day 01",
  "bookId": "bridge-voca-basic",
  "words": [
    {
      "id": "adult",
      "english": "adult",
      "meaning": "어른, 성인",
      "partOfSpeech": "noun",
      "exampleSentence": "The adult is kind.",
      "audioMode": "tts",
      "illustrationMode": "optional"
    }
  ]
}
```

Also support checkpoint test Days with a separate structured seed format, for example:

```json
{
  "id": "day-005",
  "kind": "checkpoint_test",
  "dayNumber": 5,
  "title": "Day 05 Test",
  "topic": "Day 01-04 Review",
  "bookId": "bridge-voca-basic",
  "sections": ["A", "B", "D", "E", "F", "G"],
  "questions": []
}
```

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/content/day-schema.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/content/books/bridge-voca-basic/day-001.json src/lib/content/day-schema.ts src/lib/content/load-day.ts scripts/import-bridge-day.ts docs/plans/2026-03-11-book-ingestion-notes.md src/lib/content/day-schema.test.ts
git commit -m "feat: add day ingestion pipeline"
```

### Task 5: Build the main magical-academy hub

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/hub/main-hub.tsx`
- Create: `src/components/hub/hub-card.tsx`
- Create: `src/components/hub/avatar-stage.tsx`
- Modify: `src/app/globals.css`
- Test: `src/components/hub/main-hub.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MainHub } from "./main-hub";

it("shows Today as the largest primary entry", () => {
  render(<MainHub childName="다온" level={7} streak={12} />);
  expect(screen.getByText(/today/i)).toBeInTheDocument();
  expect(screen.getByText(/character/i)).toBeInTheDocument();
  expect(screen.getByText(/history/i)).toBeInTheDocument();
  expect(screen.getByText(/review/i)).toBeInTheDocument();
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/components/hub/main-hub.test.tsx`
Expected: FAIL

**Step 3: Implement the hub from the validated design**

- academy exterior background
- lower-center avatar stage
- large centered `Today` card
- smaller `Review`, `History`, and `Character` cards
- verify visual hierarchy, not only text presence

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/components/hub/main-hub.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/hub src/app/globals.css
git commit -m "feat: add academy hub screen"
```

### Task 6: Build the staged Today screen

**Files:**
- Create: `src/app/today/page.tsx`
- Create: `src/components/today/today-stage.tsx`
- Create: `src/components/today/day-card.tsx`
- Create: `src/components/today/stage-progress.tsx`
- Test: `src/components/today/today-stage.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { TodayStage } from "./today-stage";

it("shows Learn as primary before learn completion", () => {
  render(<TodayStage state="not_started" dayTitle="Day 03" />);
  expect(screen.getByText(/learn/i)).toBeInTheDocument();
  expect(screen.getByText(/test/i)).toBeInTheDocument();
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/components/today/today-stage.test.tsx`
Expected: FAIL

**Step 3: Implement the staged Today logic**

- show day status pipeline
- if the Day kind is `learning`, emphasize `Learn` before completion and then shift to `Test`
- if the Day kind is `checkpoint_test`, skip Learn and emphasize `Test` immediately

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/components/today/today-stage.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/today/page.tsx src/components/today
git commit -m "feat: add staged today flow"
```

### Task 7: Implement Learn with safe illustration support

**Files:**
- Create: `src/app/today/learn/page.tsx`
- Create: `src/components/learn/learn-card.tsx`
- Create: `src/components/learn/illustration-panel.tsx`
- Create: `src/lib/audio/pronunciation.ts`
- Test: `src/components/learn/learn-card.test.tsx`
- Test: `src/lib/audio/pronunciation.test.ts`

**Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import { LearnCard } from "./learn-card";

it("shows a central English word with a replay button", () => {
  render(<LearnCard english="adult" meaning="어른, 성인" />);
  expect(screen.getByText("adult")).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

**Step 2: Run them to verify they fail**

Run: `npm test -- --run src/components/learn/learn-card.test.tsx src/lib/audio/pronunciation.test.ts`
Expected: FAIL

**Step 3: Implement Learn**

- one-word-per-card layout
- audio replay button only
- image panel at top/background only when trusted illustration is available
- safe fallback to text-only support

**Step 4: Run them to verify they pass**

Run: `npm test -- --run src/components/learn/learn-card.test.tsx src/lib/audio/pronunciation.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/today/learn/page.tsx src/components/learn src/lib/audio
git commit -m "feat: add learn flow with safe illustration support"
```

### Task 8: Implement Test with mixed EN/KO prompt directions

**Files:**
- Modify: `src/app/test/page.tsx`
- Create: `src/components/test/test-screen.tsx`
- Modify: `src/components/test/test-session.tsx`
- Create: `src/lib/test/generate-test.ts`
- Test: `src/lib/test/generate-test.test.ts`
- Test: `src/components/test/test-screen.test.tsx`

**Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { generateTestQuestions } from "./generate-test";

describe("test generation", () => {
  it("mixes EN->KO and KO->EN prompts", () => {
    const questions = generateTestQuestions(mockWords, 20);
    expect(questions.some((q) => q.direction === "en_to_ko")).toBe(true);
    expect(questions.some((q) => q.direction === "ko_to_en")).toBe(true);
  });
});
```

**Step 2: Run them to verify they fail**

Run: `npm test -- --run src/lib/test/generate-test.test.ts src/components/test/test-screen.test.tsx`
Expected: FAIL

**Step 3: Implement Test**

- large prompt area
- compact 2x2 four-choice grid
- audio replay
- short answer feedback only
- generate distractors from same-Day vocabulary first
- for `KO -> EN`, prevent near-duplicate or trivially identical wrong choices
- add a separate checkpoint-test rendering path for stored section/question data

**Step 4: Run them to verify they pass**

Run: `npm test -- --run src/lib/test/generate-test.test.ts src/components/test/test-screen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/test/page.tsx src/components/test src/lib/test
git commit -m "feat: add family test flow"
```

### Task 9: Build Review from accumulated wrong-answer queue

**Files:**
- Create: `src/app/review/page.tsx`
- Create: `src/components/review/review-screen.tsx`
- Create: `src/lib/review/select-review-batch.ts`
- Create: `src/lib/review/apply-review-result.ts`
- Test: `src/lib/review/select-review-batch.test.ts`
- Test: `src/components/review/review-screen.test.tsx`

**Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { selectReviewBatch } from "./select-review-batch";

describe("review batch", () => {
  it("returns about 10 items from the accumulated wrong-answer pool", () => {
    const batch = selectReviewBatch(mockQueue, 10);
    expect(batch.length).toBeLessThanOrEqual(10);
    expect(batch.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run them to verify they fail**

Run: `npm test -- --run src/lib/review/select-review-batch.test.ts src/components/review/review-screen.test.tsx`
Expected: FAIL

**Step 3: Implement Review**

- load accumulated wrong-answer items
- pick a short batch
- keep Test-like interaction
- use calmer copy and calmer styling

**Step 4: Run them to verify they pass**

Run: `npm test -- --run src/lib/review/select-review-batch.test.ts src/components/review/review-screen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/review/page.tsx src/components/review src/lib/review
git commit -m "feat: add review flow"
```

### Task 10: Build Day-centered History

**Files:**
- Create: `src/app/history/page.tsx`
- Create: `src/components/history/history-screen.tsx`
- Create: `src/components/history/day-history-card.tsx`
- Create: `src/lib/history/group-history-by-day.ts`
- Test: `src/lib/history/group-history-by-day.test.ts`
- Test: `src/components/history/history-screen.test.tsx`

**Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { groupHistoryByDay } from "./group-history-by-day";

describe("day history", () => {
  it("returns recent Day records in reverse chronological order", () => {
    const grouped = groupHistoryByDay(mockSessions);
    expect(grouped[0].date >= grouped[1].date).toBe(true);
  });
});
```

**Step 2: Run them to verify they fail**

Run: `npm test -- --run src/lib/history/group-history-by-day.test.ts src/components/history/history-screen.test.tsx`
Expected: FAIL

**Step 3: Implement History**

- show Day cards first
- include date, score, completion, and wrong-word count
- allow drill-in to Day detail

**Step 4: Run them to verify they pass**

Run: `npm test -- --run src/lib/history/group-history-by-day.test.ts src/components/history/history-screen.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/history/page.tsx src/components/history src/lib/history
git commit -m "feat: add day-centered history"
```

### Task 11: Build Character with XP, Level, and Streak

**Files:**
- Create: `src/app/character/page.tsx`
- Create: `src/components/character/character-screen.tsx`
- Create: `src/components/character/metric-panel.tsx`
- Create: `src/lib/character/calculate-rewards.ts`
- Create: `src/lib/character/update-streak.ts`
- Test: `src/lib/character/calculate-rewards.test.ts`
- Test: `src/lib/character/update-streak.test.ts`

**Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { calculateRewards } from "./calculate-rewards";

describe("character rewards", () => {
  it("grants a larger reward when Today is completed and Review is also completed", () => {
    const result = calculateRewards({
      testScore: 18,
      todayCompleted: true,
      reviewCompleted: true
    });

    expect(result.xp).toBeGreaterThan(0);
  });
});
```

**Step 2: Run them to verify they fail**

Run: `npm test -- --run src/lib/character/calculate-rewards.test.ts src/lib/character/update-streak.test.ts`
Expected: FAIL

**Step 3: Implement Character**

- large character stage
- floating metric panels for XP/Level/Streak
- streak-preserving reward logic

**Step 4: Run them to verify they pass**

Run: `npm test -- --run src/lib/character/calculate-rewards.test.ts src/lib/character/update-streak.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/character/page.tsx src/components/character src/lib/character
git commit -m "feat: add character growth screen"
```

### Task 12: Harden immediate Firestore writeback and offline-safe local cache

**Files:**
- Create: `src/lib/sync/write-child-progress.ts`
- Create: `src/lib/sync/write-day-history.ts`
- Create: `src/lib/sync/write-review-queue.ts`
- Modify: `src/lib/storage.ts`
- Test: `src/lib/sync/write-child-progress.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createProgressWrite } from "./write-child-progress";

describe("progress sync", () => {
  it("creates an immediate write payload after learn completion", () => {
    const payload = createProgressWrite({
      childId: "daon",
      currentDayId: "day-003",
      learnCompleted: true
    });

    expect(payload.learnCompleted).toBe(true);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/lib/sync/write-child-progress.test.ts`
Expected: FAIL

**Step 3: Harden writeback**

- enable Firestore offline persistence where appropriate
- handle duplicate writes / retries
- improve local cache recovery behavior after stale local binding or stale snapshots

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/lib/sync/write-child-progress.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/sync src/lib/storage.ts
git commit -m "feat: add immediate cloud writeback"
```

### Task 13: Add PWA shell for iPad home-screen use

**Files:**
- Create: `src/app/manifest.ts`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Modify: `src/app/layout.tsx`
- Test: `src/app/manifest.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  it("declares standalone display mode", () => {
    expect(manifest.display).toBe("standalone");
  });
});
```

**Step 2: Run it to verify it fails**

Run: `npm test -- --run src/app/manifest.test.ts`
Expected: FAIL

**Step 3: Implement the PWA shell**

- add title, icons, display mode, theme colors
- optimize layout metadata for iPad home-screen use

**Step 4: Run it to verify it passes**

Run: `npm test -- --run src/app/manifest.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/manifest.ts public/icons src/app/layout.tsx src/app/manifest.test.ts
git commit -m "feat: add ipad pwa shell"
```

### Task 14: Final verification and legacy doc archive note

**Files:**
- Modify: `README.md`
- Create: `docs/plans/2026-03-11-family-app-qa.md`
- Modify: `docs/plans/2026-03-11-english-vocab-webapp-design.md`
- Modify: `docs/plans/2026-03-11-english-vocab-webapp.md`

**Step 1: Run the full test suite**

Run: `npm test -- --run`
Expected: PASS

**Step 2: Run static verification**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: PASS

**Step 3: Manual iPad-family verification**

Run: `npm run dev`
Expected:

- each iPad opens into its bound child profile
- Today begins with Learn and shifts to Test after Learn completion
- History shows recent Day cards first
- Review uses accumulated wrong answers
- Character shows XP, Level, and Streak
- PWA can be added to the home screen

**Step 4: Record QA results and archive note**

Document:

- what passed
- what was deferred
- that the earlier personal-app docs are now archive references

**Step 5: Commit**

```bash
git add README.md docs/plans/2026-03-11-family-app-qa.md docs/plans/2026-03-11-english-vocab-webapp-design.md docs/plans/2026-03-11-english-vocab-webapp.md
git commit -m "docs: finalize family app implementation notes"
```
