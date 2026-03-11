import type { DayHistoryEntry, QuestionDirection } from "@/lib/types/domain";

type CreateDayHistoryInput = {
  childId: string;
  dayId: string;
  score: number;
  totalQuestions: number;
  wrongWordIds: string[];
  completedAt?: string;
};

export function createDayHistoryWrite({
  childId,
  dayId,
  score,
  totalQuestions,
  wrongWordIds,
  completedAt = new Date().toISOString()
}: CreateDayHistoryInput): DayHistoryEntry {
  return {
    id: `${dayId}-${completedAt}`,
    childId,
    dayId,
    score,
    totalQuestions,
    wrongWordIds,
    completedAt
  };
}

export function normalizeWrongAnswerDirection(direction: QuestionDirection) {
  return direction;
}
