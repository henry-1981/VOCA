import { getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { getFirebaseDb, hasFirebaseEnv } from "@/lib/firebase/client";
import {
  childDocRef,
  childHistoryCollectionRef,
  childProgressDocRef,
  childReviewQueueCollectionRef
} from "@/lib/firebase/firestore";
import type { ChildId, FamilyId } from "@/lib/types/domain";
import {
  getMockChildDashboard,
  type ChildDashboardState,
  type HistoryEntry
} from "@/lib/mock/child-dashboard";

export type ChildSelector = {
  familyId: FamilyId;
  childId: ChildId;
};

export interface ChildDashboardRepository {
  getDashboard(selector: ChildSelector): Promise<ChildDashboardState>;
  getHistoryEntry(selector: ChildSelector, dayId: string): Promise<HistoryEntry | null>;
  getReviewWords(selector: ChildSelector, limit: number): Promise<string[]>;
}

class MockChildDashboardRepository implements ChildDashboardRepository {
  async getDashboard({ childId }: ChildSelector) {
    return getMockChildDashboard(childId);
  }

  async getHistoryEntry({ childId }: ChildSelector, dayId: string) {
    const dashboard = getMockChildDashboard(childId);
    return dashboard.historyEntries.find((entry) => entry.dayId === dayId) ?? null;
  }

  async getReviewWords({ childId }: ChildSelector, limit: number) {
    const dashboard = getMockChildDashboard(childId);
    return dashboard.reviewWords.slice(0, limit);
  }
}

class FirestoreChildDashboardRepository implements ChildDashboardRepository {
  async getDashboard({
    familyId,
    childId
  }: ChildSelector): Promise<ChildDashboardState> {
    const db = getFirebaseDb();
    const [childSnapshot, progressSnapshot, historySnapshot, reviewSnapshot] =
      await Promise.all([
        getDoc(childDocRef(db, familyId, childId)),
        getDoc(childProgressDocRef(db, familyId, childId)),
        getDocs(
          query(
            childHistoryCollectionRef(db, familyId, childId),
            orderBy("completedAt", "desc"),
            limit(10)
          )
        ),
        getDocs(
          query(
            childReviewQueueCollectionRef(db, familyId, childId),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        )
      ]);

    const childData = childSnapshot.exists() ? childSnapshot.data() : null;
    const progressData = progressSnapshot.exists() ? progressSnapshot.data() : null;

    if (!childData || !progressData) {
      return getMockChildDashboard(childId);
    }

    const historyEntries = historySnapshot.docs.map((doc) => {
      const entry = doc.data();
      return {
        dayId: entry.dayId,
        title: entry.dayId.replace("day-", "Day "),
        date: entry.completedAt.slice(0, 10).replaceAll("-", "."),
        score: entry.score,
        total: entry.totalQuestions,
        wrongWordCount: entry.wrongWordIds.length,
        wrongWords: entry.wrongWordIds
      } satisfies HistoryEntry;
    });

    const reviewWords = reviewSnapshot.docs.map((doc) => doc.data().wordId);

    return {
      childId,
      childName: childData.name,
      currentDayId: childData.currentDayId ?? progressData.currentDayId ?? "day-001",
      currentDayTitle:
        childData.currentDayId?.replace("day-", "Day ") ??
        progressData.currentDayId?.replace("day-", "Day ") ??
        "Day 01",
      level: progressData.level,
      xp: progressData.xp,
      xpGoal: Math.max(progressData.xp + 200, 300),
      streak: progressData.streak,
      historyEntries,
      reviewBatchSize: 10,
      reviewWords,
      reviewBonusXp: 50
    };
  }

  async getHistoryEntry(
    selector: ChildSelector,
    dayId: string
  ): Promise<HistoryEntry | null> {
    const dashboard = await this.getDashboard(selector);
    return dashboard.historyEntries.find((entry) => entry.dayId === dayId) ?? null;
  }

  async getReviewWords(
    selector: ChildSelector,
    limitCount: number
  ): Promise<string[]> {
    const dashboard = await this.getDashboard(selector);
    return dashboard.reviewWords.slice(0, limitCount);
  }
}

export function getChildDashboardRepository(): ChildDashboardRepository {
  if (hasFirebaseEnv()) {
    return new FirestoreChildDashboardRepository();
  }

  return new MockChildDashboardRepository();
}
