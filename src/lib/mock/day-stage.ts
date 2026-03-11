import { loadCache, saveCache } from "@/lib/storage";

export type MockDayStage =
  | "not_started"
  | "learn_completed"
  | "test_completed"
  | "completed";

function getStageKey(childId: string, dayId: string) {
  return `mock-day-stage:${childId}:${dayId}`;
}

export function getMockDayStage(childId: string, dayId: string): MockDayStage {
  return loadCache<MockDayStage>(getStageKey(childId, dayId)) ?? "not_started";
}

export function setMockDayStage(
  childId: string,
  dayId: string,
  stage: MockDayStage
) {
  saveCache(getStageKey(childId, dayId), stage);
}

export function clearMockDayStage(childId: string, dayId: string) {
  saveCache<MockDayStage>(getStageKey(childId, dayId), "not_started");
}
