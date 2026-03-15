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

function freshDashboard(childId: string, childName: string): ChildDashboardState {
  return {
    childId,
    childName,
    currentDayId: "day-001",
    currentDayTitle: "Day 01",
    level: 1,
    xp: 0,
    xpGoal: 300,
    streak: 0,
    historyEntries: [],
    reviewBatchSize: 10,
    reviewWords: [],
    reviewBonusXp: 30
  };
}

const dashboards: Record<string, ChildDashboardState> = {
  "다온": freshDashboard("다온", "다온"),
  "지온": freshDashboard("지온", "지온")
};

export function getMockChildDashboard(childId: string): ChildDashboardState {
  return dashboards[childId] ?? freshDashboard(childId, childId);
}
