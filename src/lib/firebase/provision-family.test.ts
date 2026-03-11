import { describe, expect, it } from "vitest";
import { createFamilyProvisionPayload } from "./provision-family";

describe("family provisioning", () => {
  it("creates a family payload with two child profiles and one device binding", () => {
    const payload = createFamilyProvisionPayload({
      familyName: "BrideVOCA Family",
      children: ["다온", "지온"],
      deviceId: "ipad-a",
      ownerUid: "owner-uid"
    });

    expect(payload.children).toHaveLength(2);
    expect(payload.deviceBinding.deviceId).toBe("ipad-a");
    expect(payload.family.ownerUid).toBe("owner-uid");
  });
});
