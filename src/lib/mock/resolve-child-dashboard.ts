import { loadDeviceBinding } from "@/lib/device/device-binding";
import { getMockChildDashboard } from "./child-dashboard";

export async function resolveChildDashboard(
  childIdFromQuery?: string | null
) {
  const explicitChildId = childIdFromQuery?.trim();

  if (explicitChildId) {
    return getMockChildDashboard(explicitChildId);
  }

  const binding = loadDeviceBinding();

  if (binding?.childId) {
    return getMockChildDashboard(binding.childId);
  }

  return getMockChildDashboard("다온");
}
