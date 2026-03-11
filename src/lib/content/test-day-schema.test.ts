import { describe, expect, it } from "vitest";
import { parseCheckpointDayContent } from "./test-day-schema";

describe("checkpoint day schema", () => {
  it("parses checkpoint test day questions", () => {
    const day = parseCheckpointDayContent({
      id: "day-005",
      kind: "checkpoint_test",
      dayNumber: 5,
      title: "Day 05 Test",
      topic: "Day 01-04 Review",
      bookId: "bridge-voca-basic",
      sections: ["A"],
      questions: [
        {
          section: "A",
          questionId: 1,
          type: "word_search",
          prompt: "음악",
          choices: [],
          answer: "music"
        }
      ]
    });

    expect(day.questions[0].answer).toBe("music");
  });
});
