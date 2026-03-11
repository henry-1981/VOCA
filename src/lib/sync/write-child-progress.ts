import type { ChildProgress, DayProgress } from "@/lib/types/domain";

type CreateProgressWriteInput = {
  childId: string;
  currentDayId: string | null;
  learnCompleted?: boolean;
  testCompleted?: boolean;
  latestScore?: number | null;
  wrongWordIds?: string[];
  xp?: number;
  level?: number;
  streak?: number;
  updatedAt?: string;
};

type ProgressWrite = {
  progressDoc: ChildProgress;
  dayProgressDoc: DayProgress;
};

export function createProgressWrite({
  childId,
  currentDayId,
  learnCompleted = false,
  testCompleted = false,
  latestScore = null,
  wrongWordIds = [],
  xp = 0,
  level = 1,
  streak = 0,
  updatedAt = new Date().toISOString()
}: CreateProgressWriteInput): ProgressWrite {
  const completed = learnCompleted && testCompleted;

  return {
    progressDoc: {
      childId,
      currentDayId,
      xp,
      level,
      streak,
      updatedAt
    },
    dayProgressDoc: {
      dayId: currentDayId ?? "unassigned-day",
      childId,
      learnCompleted,
      testCompleted,
      completed,
      completedAt: completed ? updatedAt : null,
      latestScore,
      wrongWordIds,
      updatedAt
    }
  };
}

export function createReviewBonusProgressWrite(
  current: ChildProgress,
  bonusXp: number,
  updatedAt = new Date().toISOString()
) {
  return {
    ...current,
    xp: current.xp + bonusXp,
    updatedAt
  };
}
