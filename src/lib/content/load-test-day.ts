import day005 from "@/content/books/bridge-voca-basic/day-005-test.json";
import type { CheckpointDayContent } from "@/lib/types/domain";
import { parseCheckpointDayContent } from "./test-day-schema";

const bridgeVocaBasicTestDays = [day005].map((day) =>
  parseCheckpointDayContent(day as CheckpointDayContent)
);

export function getBridgeVocaBasicTestDays() {
  return bridgeVocaBasicTestDays;
}

export function getBridgeVocaBasicTestDay(dayId: string) {
  return bridgeVocaBasicTestDays.find((day) => day.id === dayId) ?? null;
}
