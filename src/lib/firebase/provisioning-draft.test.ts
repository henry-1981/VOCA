import { describe, expect, it } from "vitest";
import {
  loadProvisioningDraft,
  saveProvisioningDraft
} from "./provisioning-draft";

describe("provisioning draft", () => {
  it("stores family provisioning form data before redirect", () => {
    saveProvisioningDraft({
      familyName: "BrideVOCA Family",
      children: ["다온", "지온"],
      selectedChildIndex: 1,
      deviceId: "ipad-b"
    });

    expect(loadProvisioningDraft()?.selectedChildIndex).toBe(1);
  });
});
