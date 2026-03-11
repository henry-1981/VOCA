import { describe, expect, it } from "vitest";
import { parseDayContent } from "./day-schema";

describe("day schema", () => {
  it("requires exactly 20 words for one Day", () => {
    const day = parseDayContent({
      id: "day-001",
      dayNumber: 1,
      title: "Day 01",
      topic: "사람",
      bookId: "bridge-voca-basic",
      words: Array.from({ length: 20 }, (_, index) => ({
        id: `word-${index + 1}`,
        order: index + 1,
        english: `word-${index + 1}`,
        meaning: `뜻-${index + 1}`,
        audioMode: "tts",
        illustrationMode: "optional"
      }))
    });

    expect(day.words).toHaveLength(20);
  });
});
