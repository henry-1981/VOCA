import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
  type Firestore
} from "firebase/firestore";
import type {
  ChildId,
  DayId,
  DeviceId,
  FamilyId
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

export const paths = {
  family: (familyId: FamilyId) => `families/${familyId}`,
  device: (familyId: FamilyId, deviceId: DeviceId) =>
    `families/${familyId}/devices/${deviceId}`,
  child: (familyId: FamilyId, childId: ChildId) =>
    `families/${familyId}/children/${childId}`,
  childProgress: (familyId: FamilyId, childId: ChildId) =>
    `families/${familyId}/children/${childId}/progress/current`,
  childDayProgress: (familyId: FamilyId, childId: ChildId, dayId: DayId) =>
    `families/${familyId}/children/${childId}/dayProgress/${dayId}`,
  childHistoryCollection: (familyId: FamilyId, childId: ChildId) =>
    `families/${familyId}/children/${childId}/history`,
  childReviewQueueCollection: (familyId: FamilyId, childId: ChildId) =>
    `families/${familyId}/children/${childId}/reviewQueue`,
  contentDay: (bookId: string, dayId: DayId) => `content/books/${bookId}/days/${dayId}`
} as const;

export function familyDocRef(db: Firestore, familyId: FamilyId): DocumentReference<FamilyDoc> {
  return doc(db, paths.family(familyId)) as DocumentReference<FamilyDoc>;
}

export function deviceDocRef(
  db: Firestore,
  familyId: FamilyId,
  deviceId: DeviceId
): DocumentReference<DeviceBindingDoc> {
  return doc(db, paths.device(familyId, deviceId)) as DocumentReference<DeviceBindingDoc>;
}

export function childDocRef(
  db: Firestore,
  familyId: FamilyId,
  childId: ChildId
): DocumentReference<ChildProfileDoc> {
  return doc(db, paths.child(familyId, childId)) as DocumentReference<ChildProfileDoc>;
}

export function childProgressDocRef(
  db: Firestore,
  familyId: FamilyId,
  childId: ChildId
): DocumentReference<ChildProgressDoc> {
  return doc(db, paths.childProgress(familyId, childId)) as DocumentReference<ChildProgressDoc>;
}

export function childDayProgressDocRef(
  db: Firestore,
  familyId: FamilyId,
  childId: ChildId,
  dayId: DayId
): DocumentReference<DayProgressDoc> {
  return doc(
    db,
    paths.childDayProgress(familyId, childId, dayId)
  ) as DocumentReference<DayProgressDoc>;
}

export function childHistoryCollectionRef(
  db: Firestore,
  familyId: FamilyId,
  childId: ChildId
): CollectionReference<DayHistoryDoc> {
  return collection(
    db,
    paths.childHistoryCollection(familyId, childId)
  ) as CollectionReference<DayHistoryDoc>;
}

export function childReviewQueueCollectionRef(
  db: Firestore,
  familyId: FamilyId,
  childId: ChildId
): CollectionReference<ReviewQueueDoc> {
  return collection(
    db,
    paths.childReviewQueueCollection(familyId, childId)
  ) as CollectionReference<ReviewQueueDoc>;
}

export function contentDayDocRef(
  db: Firestore,
  bookId: string,
  dayId: DayId
): DocumentReference<DayContentDoc> {
  return doc(db, paths.contentDay(bookId, dayId)) as DocumentReference<DayContentDoc>;
}
