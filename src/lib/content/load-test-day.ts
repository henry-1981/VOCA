import day005 from "@/content/books/bridge-voca-basic/day-005-test.json";
import day010 from "@/content/books/bridge-voca-basic/day-010-test.json";
import type { CheckpointDayContent } from "@/lib/types/domain";
import { parseCheckpointDayContent } from "./test-day-schema";

const bridgeVocaBasicTestDays = [day005, day010].map((day) =>
  parseCheckpointDayContent(day as CheckpointDayContent)
);

export function getBridgeVocaBasicTestDays() {
  return bridgeVocaBasicTestDays;
}

export function getBridgeVocaBasicTestDay(dayId: string) {
  return bridgeVocaBasicTestDays.find((day) => day.id === dayId) ?? null;
}
