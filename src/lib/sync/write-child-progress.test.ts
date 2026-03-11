import { describe, expect, it } from "vitest";
import { createProgressWrite } from "./write-child-progress";

describe("progress sync", () => {
  it("creates an immediate write payload after learn completion", () => {
    const payload = createProgressWrite({
      childId: "daon",
      currentDayId: "day-003",
      learnCompleted: true
    });

    expect(payload.dayProgressDoc.learnCompleted).toBe(true);
  });
});
