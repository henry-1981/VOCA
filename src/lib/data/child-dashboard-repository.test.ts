import { describe, expect, it } from "vitest";
import { getChildDashboardRepository } from "./child-dashboard-repository";

describe("child dashboard repository", () => {
  it("returns a mock dashboard when Firebase env is unavailable", async () => {
    const repository = getChildDashboardRepository();
    const dashboard = await repository.getDashboard({
      familyId: "mock-family",
      childId: "다온"
    });

    expect(dashboard.childName).toBe("다온");
    expect(dashboard.currentDayTitle).toBe("Day 01");
  });
});
