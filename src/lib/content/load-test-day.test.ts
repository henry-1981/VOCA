import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getBridgeVocaBasicTestDays } from "./load-test-day";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, "../../content/books/bridge-voca-basic");

describe("getBridgeVocaBasicTestDays", () => {
  it("loads every checkpoint test json in the content directory", () => {
    const expectedTestDayIds = readdirSync(contentDir)
      .filter((name) => /^day-\d{3}-test\.json$/.test(name))
      .map((name) => name.replace("-test.json", ""))
      .sort();

    const actualDayIds = getBridgeVocaBasicTestDays()
      .map((day) => day.id)
      .sort();

    expect(actualDayIds).toEqual(expectedTestDayIds);
  });
});
