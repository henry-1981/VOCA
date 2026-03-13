# Review / History Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish BrideVOCA Review and History screens so Review feels like a calm recovery room and History feels like a Day archive room, without touching Main Hub or changing product structure.

**Architecture:** Reuse the current routing and data flow. Push most of the polish into screen components and shared visual utilities, and extend the existing test screen with a mode switch so Review can diverge emotionally without forking behavior.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock the current screen contracts

**Files:**
- Modify: `src/components/review/review-screen.test.tsx`
- Modify: `src/components/test/learning-test-screen.test.tsx`
- Modify: `src/components/history/history-screen.test.tsx`
- Modify: `src/components/history/day-history-detail-screen.test.tsx`

**Step 1:** Extend tests to assert the new Review/History room copy and Day-centered affordances.

**Step 2:** Run targeted component tests and confirm failures before UI edits if expectations change.

**Step 3:** Keep assertions focused on visible user-facing structure, not decorative class names.

### Task 2: Polish Review entry and session

**Files:**
- Modify: `src/components/review/review-screen.tsx`
- Modify: `src/components/test/learning-test-screen.tsx`
- Modify: `src/app/review/session/page.tsx`
- Modify: `src/app/globals.css`

**Step 1:** Rebuild the Review landing as a moonlit review room with stronger scene framing.

**Step 2:** Add a Review display mode to `LearningTestScreen`.

**Step 3:** Update Review session copy, palette, and completion messaging while keeping quiz logic intact.

**Step 4:** Run targeted Review-related tests.

### Task 3: Polish History list and detail

**Files:**
- Modify: `src/components/history/history-screen.tsx`
- Modify: `src/components/history/day-history-detail-screen.tsx`
- Modify: `src/app/history/page.tsx`
- Modify: `src/app/history/[dayId]/page.tsx`
- Modify: `src/app/globals.css`

**Step 1:** Turn the History list into a Day archive room with richer card hierarchy.

**Step 2:** Rebuild the detail page as a readable Day record sheet with indexed wrong-word entries.

**Step 3:** Preserve current data only; add empty-state handling where needed.

**Step 4:** Run targeted History-related tests.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `docs/plans/2026-03-13-review-history-polish-design.md`
- Modify: `docs/plans/2026-03-13-review-history-polish-plan.md`

**Step 1:** Run `npm run test -- src/components/review/review-screen.test.tsx src/components/test/learning-test-screen.test.tsx src/components/history/history-screen.test.tsx src/components/history/day-history-detail-screen.test.tsx`

**Step 2:** Run `npm run lint`

**Step 3:** Run `npm run typecheck`

**Step 4:** Run `npm run build`

**Step 5:** Create a checkpoint commit with the verified polish changes
