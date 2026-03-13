import { execFileSync } from "node:child_process";
import path from "node:path";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  process.cwd(),
  "scripts/content/import_bridge_voca_days.py"
);

describe("import_bridge_voca_days.py", () => {
  it("exists for Firestore day seeding", () => {
    expect(existsSync(scriptPath)).toBe(true);
  });

  it("prints CLI help", () => {
    const output = execFileSync("python3", [scriptPath, "--help"], {
      encoding: "utf-8"
    });

    expect(output).toContain("usage:");
    expect(output).toContain("--day");
  });
});
