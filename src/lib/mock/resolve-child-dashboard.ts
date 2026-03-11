import { loadDeviceBinding } from "@/lib/device/device-binding";
import {
  getChildDashboardRepository,
  type ChildSelector
} from "@/lib/data/child-dashboard-repository";

function createMockSelector(childId: string): ChildSelector {
  return {
    familyId: "mock-family",
    childId
  };
}

export async function resolveChildDashboard(
  childIdFromQuery?: string | null
) {
  const repository = getChildDashboardRepository();
  const explicitChildId = childIdFromQuery?.trim();

  if (explicitChildId) {
    const binding = loadDeviceBinding();

    if (binding?.familyId) {
      return repository.getDashboard({
        familyId: binding.familyId,
        childId: explicitChildId
      });
    }

    return repository.getDashboard(createMockSelector(explicitChildId));
  }

  const binding = loadDeviceBinding();

  if (binding?.childId) {
    return repository.getDashboard({
      familyId: binding.familyId,
      childId: binding.childId
    });
  }

  return repository.getDashboard(createMockSelector("다온"));
}
