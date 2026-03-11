import { describe, expect, it } from "vitest";
import {
  clearMockDayStage,
  getMockDayStage,
  setMockDayStage
} from "./day-stage";

describe("mock day stage", () => {
  it("stores and retrieves a child/day stage", () => {
    setMockDayStage("다온", "day-001", "learn_completed");
    expect(getMockDayStage("다온", "day-001")).toBe("learn_completed");
    clearMockDayStage("다온", "day-001");
  });
});
