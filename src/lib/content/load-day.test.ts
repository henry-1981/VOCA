import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getBridgeVocaBasicDays } from "./load-day";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, "../../content/books/bridge-voca-basic");

describe("getBridgeVocaBasicDays", () => {
  it("loads every learning day json in the content directory", () => {
    const expectedLearningDayIds = readdirSync(contentDir)
      .filter((name) => /^day-\d{3}\.json$/.test(name))
      .map((name) => name.replace(".json", ""))
      .sort();

    const actualDayIds = getBridgeVocaBasicDays()
      .map((day) => day.id)
      .sort();

    expect(actualDayIds).toEqual(expectedLearningDayIds);
  });
});
