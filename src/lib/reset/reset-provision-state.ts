import { clearDeviceBinding } from "@/lib/device/device-binding";
import { clearProvisioningDraft } from "@/lib/firebase/provisioning-draft";

export function resetProvisionState() {
  clearDeviceBinding();
  clearProvisioningDraft();
}
