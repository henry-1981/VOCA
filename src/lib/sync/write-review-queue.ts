import type { QuestionDirection, ReviewQueueItem } from "@/lib/types/domain";

type CreateReviewQueueInput = {
  childId: string;
  dayId: string;
  wrongWordIds: string[];
  direction: QuestionDirection;
  createdAt?: string;
};

export function createReviewQueueWrites({
  childId,
  dayId,
  wrongWordIds,
  direction,
  createdAt = new Date().toISOString()
}: CreateReviewQueueInput): ReviewQueueItem[] {
  return wrongWordIds.map((wordId, index) => ({
    id: `${dayId}-${wordId}-${index}`,
    childId,
    wordId,
    sourceDayId: dayId,
    direction,
    attempts: 0,
    lastSeenAt: null,
    createdAt
  }));
}
