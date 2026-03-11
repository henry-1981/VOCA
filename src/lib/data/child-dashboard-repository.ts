import { hasFirebaseEnv } from "@/lib/firebase/client";
import type { ChildId } from "@/lib/types/domain";
import {
  getMockChildDashboard,
  type ChildDashboardState,
  type HistoryEntry
} from "@/lib/mock/child-dashboard";

export interface ChildDashboardRepository {
  getDashboard(childId: ChildId): Promise<ChildDashboardState>;
  getHistoryEntry(childId: ChildId, dayId: string): Promise<HistoryEntry | null>;
  getReviewWords(childId: ChildId, limit: number): Promise<string[]>;
}

class MockChildDashboardRepository implements ChildDashboardRepository {
  async getDashboard(childId: ChildId) {
    return getMockChildDashboard(childId);
  }

  async getHistoryEntry(childId: ChildId, dayId: string) {
    const dashboard = getMockChildDashboard(childId);
    return dashboard.historyEntries.find((entry) => entry.dayId === dayId) ?? null;
  }

  async getReviewWords(childId: ChildId, limit: number) {
    const dashboard = getMockChildDashboard(childId);
    return dashboard.reviewWords.slice(0, limit);
  }
}

class FirestoreChildDashboardRepository implements ChildDashboardRepository {
  async getDashboard(childId: ChildId): Promise<ChildDashboardState> {
    throw new Error(
      `FirestoreChildDashboardRepository.getDashboard is not implemented yet for child ${childId}`
    );
  }

  async getHistoryEntry(
    childId: ChildId,
    dayId: string
  ): Promise<HistoryEntry | null> {
    throw new Error(
      `FirestoreChildDashboardRepository.getHistoryEntry is not implemented yet for ${childId}/${dayId}`
    );
  }

  async getReviewWords(childId: ChildId, limit: number): Promise<string[]> {
    throw new Error(
      `FirestoreChildDashboardRepository.getReviewWords is not implemented yet for ${childId} with limit ${limit}`
    );
  }
}

export function getChildDashboardRepository(): ChildDashboardRepository {
  if (hasFirebaseEnv()) {
    return new FirestoreChildDashboardRepository();
  }

  return new MockChildDashboardRepository();
}
