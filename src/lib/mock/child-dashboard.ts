import type { ChildId } from "@/lib/types/domain";

export type HistoryEntry = {
  dayId: string;
  title: string;
  date: string;
  score: number;
  total: number;
  wrongWordCount: number;
  wrongWords: string[];
};

export type ChildDashboardState = {
  childId: ChildId;
  childName: string;
  currentDayId: string;
  currentDayTitle: string;
  level: number;
  xp: number;
  xpGoal: number;
  streak: number;
  historyEntries: HistoryEntry[];
  reviewBatchSize: number;
  reviewWords: string[];
  reviewBonusXp: number;
};

const dashboards: Record<string, ChildDashboardState> = {
  "다온": {
    childId: "다온",
    childName: "다온",
    currentDayId: "day-005",
    currentDayTitle: "Day 05 Test",
    level: 7,
    xp: 1280,
    xpGoal: 1500,
    streak: 12,
    historyEntries: [
      { dayId: "day-005", title: "Day 05 Test", date: "2026.03.12", score: 17, total: 20, wrongWordCount: 3, wrongWords: ["adult", "camera", "magic"] },
      { dayId: "day-004", title: "Day 04", date: "2026.03.11", score: 18, total: 20, wrongWordCount: 2, wrongWords: ["milk", "juice"] },
      { dayId: "day-003", title: "Day 03", date: "2026.03.10", score: 16, total: 20, wrongWordCount: 4, wrongWords: ["camera", "magic", "surf", "relax"] }
    ],
    reviewBatchSize: 10,
    reviewWords: ["adult", "camera", "magic", "history", "art", "milk", "juice", "surf", "relax", "generation"],
    reviewBonusXp: 50
  },
  "지온": {
    childId: "지온",
    childName: "지온",
    currentDayId: "day-003",
    currentDayTitle: "Day 03",
    level: 4,
    xp: 620,
    xpGoal: 900,
    streak: 5,
    historyEntries: [
      { dayId: "day-002", title: "Day 02", date: "2026.03.12", score: 15, total: 20, wrongWordCount: 5, wrongWords: ["math", "history", "ruler", "music", "science"] },
      { dayId: "day-001", title: "Day 01", date: "2026.03.11", score: 18, total: 20, wrongWordCount: 2, wrongWords: ["hero", "person"] }
    ],
    reviewBatchSize: 10,
    reviewWords: ["math", "history", "ruler", "music", "science", "hero", "person"],
    reviewBonusXp: 40
  }
};

export function getMockChildDashboard(childId: string): ChildDashboardState {
  return dashboards[childId] ?? {
    childId,
    childName: childId,
    currentDayId: "day-001",
    currentDayTitle: "Day 01",
    level: 1,
    xp: 0,
    xpGoal: 300,
    streak: 1,
    historyEntries: [],
    reviewBatchSize: 10,
    reviewWords: [],
    reviewBonusXp: 30
  };
}
