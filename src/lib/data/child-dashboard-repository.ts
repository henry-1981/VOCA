import { getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
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
import type {
  ChildProfileDoc,
  ChildProgressDoc,
  DayHistoryDoc,
  ReviewQueueDoc
} from "@/lib/types/firestore";

export type ChildSelector = {
  familyId: FamilyId;
  childId: ChildId;
};

export interface ChildDashboardRepository {
  getDashboard(selector: ChildSelector): Promise<ChildDashboardState>;
  getHistoryEntry(selector: ChildSelector, dayId: string): Promise<HistoryEntry | null>;
  getReviewWords(selector: ChildSelector, limit: number): Promise<string[]>;
}

function formatDayTitle(dayId: string | null | undefined) {
  if (!dayId) {
    return "Day 01";
  }

  const match = dayId.match(/^day-(\d+)$/i);

  if (!match) {
    return dayId;
  }

  return `Day ${match[1]}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) {
    return "0000.00.00";
  }

  return iso.slice(0, 10).replaceAll("-", ".");
}

export function toHistoryEntry(doc: DayHistoryDoc): HistoryEntry {
  return {
    dayId: doc.dayId,
    title: formatDayTitle(doc.dayId),
    date: formatDate(doc.completedAt),
    score: doc.score,
    total: doc.totalQuestions,
    wrongWordCount: doc.wrongWordIds.length,
    wrongWords: doc.wrongWordIds
  };
}

export function toDashboardState(
  child: ChildProfileDoc,
  progress: ChildProgressDoc,
  historyDocs: DayHistoryDoc[],
  reviewDocs: ReviewQueueDoc[]
): ChildDashboardState {
  const historyEntries = historyDocs.map(toHistoryEntry);

  return {
    childId: child.id,
    childName: child.name,
    currentDayId: child.currentDayId ?? progress.currentDayId ?? "day-001",
    currentDayTitle: formatDayTitle(child.currentDayId ?? progress.currentDayId),
    level: progress.level,
    xp: progress.xp,
    xpGoal: Math.max(progress.xp + 200, 300),
    streak: progress.streak,
    historyEntries,
    reviewBatchSize: 10,
    reviewWords: reviewDocs.map((doc) => doc.wordId),
    reviewBonusXp: 50
  };
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

    const historyDocs = historySnapshot.docs.map((doc) => doc.data());
    const reviewDocs = reviewSnapshot.docs.map((doc) => doc.data());

    return toDashboardState(childData, progressData, historyDocs, reviewDocs);
  }

  async getHistoryEntry(
    { familyId, childId }: ChildSelector,
    dayId: string
  ): Promise<HistoryEntry | null> {
    const db = getFirebaseDb();
    const snapshot = await getDocs(
      query(
        childHistoryCollectionRef(db, familyId, childId),
        where("dayId", "==", dayId),
        orderBy("completedAt", "desc"),
        limit(1)
      )
    );

    if (snapshot.empty) return null;
    return toHistoryEntry(snapshot.docs[0].data());
  }

  async getReviewWords(
    { familyId, childId }: ChildSelector,
    limitCount: number
  ): Promise<string[]> {
    const db = getFirebaseDb();
    const snapshot = await getDocs(
      query(
        childReviewQueueCollectionRef(db, familyId, childId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
    );

    return snapshot.docs.map((doc) => doc.data().wordId);
  }
}

export function getChildDashboardRepository(): ChildDashboardRepository {
  if (hasFirebaseEnv()) {
    return new FirestoreChildDashboardRepository();
  }

  return new MockChildDashboardRepository();
}
