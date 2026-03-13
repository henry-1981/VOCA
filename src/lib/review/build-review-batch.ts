import type { ReviewQueueItem } from "@/lib/types/domain";

/** Legacy: simple FIFO slice for string word lists */
export function buildReviewBatch(words: string[], limit: number) {
  return words.slice(0, limit);
}

/**
 * Weighted review batch selection.
 * Priority: (1) most attempts first, (2) oldest createdAt first for ties.
 * Returns up to `limit` items (default 10).
 */
export function buildWeightedReviewBatch(
  items: ReviewQueueItem[],
  limit: number = 10
): ReviewQueueItem[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => {
    // Higher attempts = higher priority (descending)
    if (b.attempts !== a.attempts) return b.attempts - a.attempts;
    // Older items first (ascending)
    return a.createdAt.localeCompare(b.createdAt);
  });

  return sorted.slice(0, limit);
}
