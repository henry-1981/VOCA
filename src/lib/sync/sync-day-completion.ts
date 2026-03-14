import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb, hasFirebaseEnv } from "@/lib/firebase/client";
import { loadDeviceBinding } from "@/lib/device/device-binding";
import {
  childDayProgressDocRef,
  childHistoryCollectionRef,
  childProgressDocRef,
  childReviewQueueCollectionRef
} from "@/lib/firebase/firestore";
import { getNextDayId } from "@/lib/content/next-day";
import type { ChildProgressDoc, DayProgressDoc } from "@/lib/types/firestore";

function getBinding() {
  const binding = loadDeviceBinding();

  if (!binding?.familyId) {
    return null;
  }

  return binding;
}

export async function syncLearnCompletion({
  childId,
  dayId
}: {
  childId: string;
  dayId: string;
}) {
  if (!hasFirebaseEnv()) {
    return;
  }

  const binding = getBinding();

  if (!binding) {
    return;
  }

  const db = getFirebaseDb();
  const dayProgressRef = childDayProgressDocRef(db, binding.familyId, childId, dayId);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(dayProgressRef);

    if (snap.exists()) {
      await updateDoc(dayProgressRef, {
        learnCompleted: true,
        updatedAt: now
      });
    } else {
      const newDoc: DayProgressDoc = {
        dayId,
        childId,
        learnCompleted: true,
        testCompleted: false,
        completed: false,
        completedAt: null,
        latestScore: null,
        wrongWordIds: [],
        updatedAt: now
      };

      await setDoc(dayProgressRef, newDoc);
    }
  } catch (error) {
    console.error("[syncLearnCompletion] failed:", error);
  }
}

export async function syncTestCompletion({
  childId,
  dayId,
  score,
  totalQuestions,
  wrongWordIds
}: {
  childId: string;
  dayId: string;
  score: number;
  totalQuestions: number;
  wrongWordIds: string[];
}) {
  if (!hasFirebaseEnv()) {
    return;
  }

  const binding = getBinding();

  if (!binding) {
    return;
  }

  const db = getFirebaseDb();
  const now = new Date().toISOString();
  const nextDayId = getNextDayId(dayId);

  try {
    // 1. Update dayProgress
    const dayProgressRef = childDayProgressDocRef(db, binding.familyId, childId, dayId);
    const dayProgressSnap = await getDoc(dayProgressRef);
    const learnCompleted = dayProgressSnap.exists()
      ? (dayProgressSnap.data() as DayProgressDoc).learnCompleted
      : true;

    const dayProgressDoc: DayProgressDoc = {
      dayId,
      childId,
      learnCompleted,
      testCompleted: true,
      completed: true,
      completedAt: now,
      latestScore: score,
      wrongWordIds,
      updatedAt: now
    };

    await setDoc(dayProgressRef, dayProgressDoc);

    // 2. Update progress/current (currentDayId → nextDayId, XP)
    const progressRef = childProgressDocRef(db, binding.familyId, childId);
    const progressSnap = await getDoc(progressRef);
    const xpGain = score * 5;

    if (progressSnap.exists()) {
      const current = progressSnap.data() as ChildProgressDoc;

      await updateDoc(progressRef, {
        currentDayId: nextDayId ?? current.currentDayId,
        xp: current.xp + xpGain,
        streak: current.streak + 1,
        updatedAt: now
      });
    } else {
      const newProgress: ChildProgressDoc = {
        childId,
        currentDayId: nextDayId ?? dayId,
        xp: xpGain,
        level: 1,
        streak: 1,
        updatedAt: now
      };

      await setDoc(progressRef, newProgress);
    }

    // 3. Write history entry
    const historyRef = doc(
      childHistoryCollectionRef(db, binding.familyId, childId),
      `${dayId}-${now}`
    );

    await setDoc(historyRef, {
      id: `${dayId}-${now}`,
      childId,
      dayId,
      score,
      totalQuestions,
      wrongWordIds,
      completedAt: now
    });

    // 4. Add wrong words to reviewQueue
    if (wrongWordIds.length > 0) {
      const reviewCollectionRef = childReviewQueueCollectionRef(db, binding.familyId, childId);

      await Promise.all(
        wrongWordIds.map((wordId) => {
          const reviewRef = doc(reviewCollectionRef, `${dayId}-${wordId}`);

          return setDoc(reviewRef, {
            id: `${dayId}-${wordId}`,
            childId,
            wordId,
            sourceDayId: dayId,
            direction: "en_to_ko",
            attempts: 0,
            lastSeenAt: null,
            createdAt: now
          });
        })
      );
    }
  } catch (error) {
    console.error("[syncTestCompletion] failed:", error);
  }
}
