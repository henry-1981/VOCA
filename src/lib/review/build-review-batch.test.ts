import { describe, expect, it } from "vitest";
import { buildReviewBatch, buildWeightedReviewBatch } from "./build-review-batch";
import type { ReviewQueueItem } from "@/lib/types/domain";

function makeItem(overrides: Partial<ReviewQueueItem> & { wordId: string }): ReviewQueueItem {
  const { wordId, ...rest } = overrides;
  return {
    id: wordId,
    childId: "다온",
    wordId,
    sourceDayId: "day-001",
    direction: "en_to_ko",
    attempts: 1,
    lastSeenAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    ...rest
  };
}

describe("buildReviewBatch (legacy string[])", () => {
  it("returns a capped batch from accumulated wrong words", () => {
    const batch = buildReviewBatch(
      ["adult", "camera", "magic", "history", "art", "milk"],
      4
    );

    expect(batch).toHaveLength(4);
    expect(batch[0]).toBe("adult");
  });
});

describe("buildWeightedReviewBatch", () => {
  it("returns items sorted by attempts (most mistakes first)", () => {
    const items = [
      makeItem({ wordId: "low", attempts: 1 }),
      makeItem({ wordId: "high", attempts: 5 }),
      makeItem({ wordId: "mid", attempts: 3 })
    ];

    const batch = buildWeightedReviewBatch(items, 10);

    expect(batch[0].wordId).toBe("high");
    expect(batch[1].wordId).toBe("mid");
    expect(batch[2].wordId).toBe("low");
  });

  it("breaks ties by createdAt (oldest first)", () => {
    const items = [
      makeItem({ wordId: "newer", attempts: 3, createdAt: "2026-03-10T00:00:00Z" }),
      makeItem({ wordId: "oldest", attempts: 3, createdAt: "2026-01-01T00:00:00Z" }),
      makeItem({ wordId: "middle", attempts: 3, createdAt: "2026-02-15T00:00:00Z" })
    ];

    const batch = buildWeightedReviewBatch(items, 10);

    expect(batch[0].wordId).toBe("oldest");
    expect(batch[1].wordId).toBe("middle");
    expect(batch[2].wordId).toBe("newer");
  });

  it("respects limit parameter", () => {
    const items = [
      makeItem({ wordId: "a", attempts: 5 }),
      makeItem({ wordId: "b", attempts: 4 }),
      makeItem({ wordId: "c", attempts: 3 }),
      makeItem({ wordId: "d", attempts: 2 }),
      makeItem({ wordId: "e", attempts: 1 })
    ];

    const batch = buildWeightedReviewBatch(items, 3);

    expect(batch).toHaveLength(3);
    expect(batch[0].wordId).toBe("a");
    expect(batch[2].wordId).toBe("c");
  });

  it("returns empty array for empty input", () => {
    const batch = buildWeightedReviewBatch([], 10);
    expect(batch).toEqual([]);
  });

  it("returns all items if fewer than limit", () => {
    const items = [
      makeItem({ wordId: "a", attempts: 2 }),
      makeItem({ wordId: "b", attempts: 1 })
    ];

    const batch = buildWeightedReviewBatch(items, 10);

    expect(batch).toHaveLength(2);
  });
});
