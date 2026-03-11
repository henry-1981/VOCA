import { describe, expect, it } from "vitest";
import { loadDeviceBinding, saveDeviceBinding } from "./device-binding";

describe("device binding", () => {
  it("loads the saved child binding for this iPad", () => {
    saveDeviceBinding({ familyId: "family-1", childId: "daon" });
    expect(loadDeviceBinding()?.childId).toBe("daon");
  });
});
