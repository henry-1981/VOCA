import { loadCache, saveCache } from "@/lib/storage";

const PROVISION_DRAFT_KEY = "provision-draft";

export type ProvisioningDraft = {
  familyName: string;
  children: [string, string];
  selectedChildIndex: 0 | 1;
  deviceId: string;
};

export function saveProvisioningDraft(draft: ProvisioningDraft) {
  saveCache(PROVISION_DRAFT_KEY, draft);
}

export function loadProvisioningDraft() {
  return loadCache<ProvisioningDraft>(PROVISION_DRAFT_KEY);
}

export function clearProvisioningDraft() {
  saveCache<ProvisioningDraft | null>(PROVISION_DRAFT_KEY, null);
}
