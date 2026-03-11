import { loadDeviceBinding } from "@/lib/device/device-binding";
import { getChildDashboardRepository } from "@/lib/data/child-dashboard-repository";

export async function resolveChildDashboard(
  childIdFromQuery?: string | null
) {
  const repository = getChildDashboardRepository();
  const explicitChildId = childIdFromQuery?.trim();

  if (explicitChildId) {
    return repository.getDashboard(explicitChildId);
  }

  const binding = loadDeviceBinding();

  if (binding?.childId) {
    return repository.getDashboard(binding.childId);
  }

  return repository.getDashboard("다온");
}
