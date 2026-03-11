import { describe, expect, it } from "vitest";
import { buildReviewBatch } from "./build-review-batch";

describe("buildReviewBatch", () => {
  it("returns a capped batch from accumulated wrong words", () => {
    const batch = buildReviewBatch(
      ["adult", "camera", "magic", "history", "art", "milk"],
      4
    );

    expect(batch).toHaveLength(4);
    expect(batch[0]).toBe("adult");
  });
});
