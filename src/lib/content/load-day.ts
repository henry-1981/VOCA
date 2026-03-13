import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { DayContent } from "@/lib/types/domain";
import { parseDayContent } from "./day-schema";

const CONTENT_ROOT = path.resolve(process.cwd(), "src/content/books/bridge-voca-basic");

function loadBridgeVocaBasicDays() {
  return readdirSync(CONTENT_ROOT)
    .filter((name) => /^day-\d{3}\.json$/.test(name))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => {
      const day = JSON.parse(
        readFileSync(path.join(CONTENT_ROOT, name), "utf-8")
      ) as DayContent;

      return parseDayContent(day);
    });
}

const bridgeVocaBasicDays = loadBridgeVocaBasicDays();

export function getBridgeVocaBasicDays() {
  return bridgeVocaBasicDays;
}

export function getBridgeVocaBasicDay(dayId: string) {
  return bridgeVocaBasicDays.find((day) => day.id === dayId) ?? null;
}
