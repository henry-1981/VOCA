import { describe, expect, it } from "vitest";
import { toChildProgressDoc } from "./converters";

describe("child progress converter", () => {
  it("serializes streak and xp fields", () => {
    const doc = toChildProgressDoc({
      childId: "daon",
      currentDayId: "day-003",
      xp: 120,
      level: 2,
      streak: 4,
      updatedAt: "2026-03-11T00:00:00.000Z"
    });

    expect(doc.streak).toBe(4);
    expect(doc.level).toBe(2);
  });
});
