import { describe, expect, it } from "vitest";
import { getRewardPreview } from "./reward-preview";

describe("getRewardPreview", () => {
  it("includes streak 유지 and review bonus for the current day", () => {
    const preview = getRewardPreview({
      currentDayTitle: "Day 05 Test",
      streak: 12,
      reviewBonusXp: 50
    });

    expect(preview.streakMessage).toMatch(/12일/);
    expect(preview.rewardMessage).toMatch(/50 XP/);
  });
});
