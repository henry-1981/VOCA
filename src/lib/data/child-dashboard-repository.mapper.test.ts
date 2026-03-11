import { describe, expect, it } from "vitest";
import { toDashboardState, toHistoryEntry } from "./child-dashboard-repository";

describe("child dashboard repository mappers", () => {
  it("maps a DayHistoryDoc into a Day-centered history entry", () => {
    const entry = toHistoryEntry({
      id: "day-005-1",
      childId: "daon",
      dayId: "day-005",
      score: 17,
      totalQuestions: 20,
      wrongWordIds: ["adult", "camera", "magic"],
      completedAt: "2026-03-12T10:00:00.000Z"
    });

    expect(entry.title).toBe("Day 005");
    expect(entry.wrongWordCount).toBe(3);
    expect(entry.date).toBe("2026.03.12");
  });

  it("maps Firestore child docs into dashboard state", () => {
    const dashboard = toDashboardState(
      {
        id: "daon",
        familyId: "family-1",
        name: "다온",
        avatarRef: "avatar-1",
        themeKey: "violet-gold",
        currentDayId: "day-005",
        createdAt: "2026-03-12T00:00:00.000Z"
      },
      {
        childId: "daon",
        currentDayId: "day-005",
        xp: 1280,
        level: 7,
        streak: 12,
        updatedAt: "2026-03-12T00:00:00.000Z"
      },
      [
        {
          id: "day-005-1",
          childId: "daon",
          dayId: "day-005",
          score: 17,
          totalQuestions: 20,
          wrongWordIds: ["adult", "camera", "magic"],
          completedAt: "2026-03-12T10:00:00.000Z"
        }
      ],
      [
        {
          id: "rq-1",
          childId: "daon",
          wordId: "adult",
          sourceDayId: "day-005",
          direction: "en_to_ko",
          attempts: 0,
          lastSeenAt: null,
          createdAt: "2026-03-12T10:00:00.000Z"
        }
      ]
    );

    expect(dashboard.childName).toBe("다온");
    expect(dashboard.currentDayTitle).toBe("Day 005");
    expect(dashboard.reviewWords).toEqual(["adult"]);
  });
});
