import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/device/device-binding", () => ({
  clearDeviceBinding: vi.fn()
}));

vi.mock("@/lib/firebase/provisioning-draft", () => ({
  clearProvisioningDraft: vi.fn()
}));

import { clearProvisioningDraft } from "@/lib/firebase/provisioning-draft";
import { clearDeviceBinding } from "@/lib/device/device-binding";
import { resetProvisionState } from "./reset-provision-state";

describe("resetProvisionState", () => {
  it("clears device binding and provisioning draft", () => {
    resetProvisionState();

    expect(clearDeviceBinding).toHaveBeenCalled();
    expect(clearProvisioningDraft).toHaveBeenCalled();
  });
});
