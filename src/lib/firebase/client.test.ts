import { describe, expect, it } from "vitest";
import { getMissingFirebaseEnvKeys } from "./client";

describe("firebase client env readiness", () => {
  it("returns missing Firebase env keys when local env is not configured", () => {
    const missing = getMissingFirebaseEnvKeys();

    expect(Array.isArray(missing)).toBe(true);
    expect(missing.length).toBeGreaterThan(0);
  });
});
