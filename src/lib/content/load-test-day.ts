import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { CheckpointDayContent } from "@/lib/types/domain";
import { parseCheckpointDayContent } from "./test-day-schema";

const CONTENT_ROOT = path.resolve(process.cwd(), "src/content/books/bridge-voca-basic");

function loadBridgeVocaBasicTestDays() {
  return readdirSync(CONTENT_ROOT)
    .filter((name) => /^day-\d{3}-test\.json$/.test(name))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => {
      const day = JSON.parse(
        readFileSync(path.join(CONTENT_ROOT, name), "utf-8")
      ) as CheckpointDayContent;

      return parseCheckpointDayContent(day);
    });
}

const bridgeVocaBasicTestDays = loadBridgeVocaBasicTestDays();

export function getBridgeVocaBasicTestDays() {
  return bridgeVocaBasicTestDays;
}

export function getBridgeVocaBasicTestDay(dayId: string) {
  return bridgeVocaBasicTestDays.find((day) => day.id === dayId) ?? null;
}
