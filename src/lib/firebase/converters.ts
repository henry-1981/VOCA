import type {
  ChildProgress,
  ChildProfile,
  DayContent,
  DayHistoryEntry,
  DayProgress,
  DeviceBinding,
  Family,
  ReviewQueueItem
} from "@/lib/types/domain";
import type {
  ChildProfileDoc,
  ChildProgressDoc,
  DayContentDoc,
  DayHistoryDoc,
  DayProgressDoc,
  DeviceBindingDoc,
  FamilyDoc,
  ReviewQueueDoc
} from "@/lib/types/firestore";

export function toFamilyDoc(family: Family): FamilyDoc {
  return { ...family };
}

export function toChildProfileDoc(child: ChildProfile): ChildProfileDoc {
  return { ...child };
}

export function toChildProgressDoc(progress: ChildProgress): ChildProgressDoc {
  return { ...progress };
}

export function toDayProgressDoc(progress: DayProgress): DayProgressDoc {
  return { ...progress };
}

export function toDayHistoryDoc(entry: DayHistoryEntry): DayHistoryDoc {
  return { ...entry };
}

export function toReviewQueueDoc(item: ReviewQueueItem): ReviewQueueDoc {
  return { ...item };
}

export function toDeviceBindingDoc(binding: DeviceBinding): DeviceBindingDoc {
  return { ...binding };
}

export function toDayContentDoc(day: DayContent): DayContentDoc {
  return { ...day };
}
