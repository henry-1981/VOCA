import day001 from "@/content/books/bridge-voca-basic/day-001.json";
import day002 from "@/content/books/bridge-voca-basic/day-002.json";
import day003 from "@/content/books/bridge-voca-basic/day-003.json";
import type { DayContent } from "@/lib/types/domain";
import { parseDayContent } from "./day-schema";

const bridgeVocaBasicDays = [day001, day002, day003].map((day) =>
  parseDayContent(day as DayContent)
);

export function getBridgeVocaBasicDays() {
  return bridgeVocaBasicDays;
}

export function getBridgeVocaBasicDay(dayId: string) {
  return bridgeVocaBasicDays.find((day) => day.id === dayId) ?? null;
}
