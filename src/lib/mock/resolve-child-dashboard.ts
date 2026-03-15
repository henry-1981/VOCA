import { loadDeviceBinding } from "@/lib/device/device-binding";
import {
  getChildDashboardRepository,
  type ChildSelector
} from "@/lib/data/child-dashboard-repository";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";

function createMockSelector(childId: string): ChildSelector {
  return {
    familyId: "mock-family",
    childId
  };
}

export function resolveChildSelector(
  childIdFromQuery?: string | null
): ChildSelector {
  const explicitChildId = childIdFromQuery?.trim();
  const binding = loadDeviceBinding();

  if (explicitChildId) {
    return {
      familyId: binding?.familyId ?? "mock-family",
      childId: explicitChildId
    };
  }

  if (binding?.childId) {
    return {
      familyId: binding.familyId,
      childId: binding.childId
    };
  }

  return createMockSelector("다온");
}

export async function resolveChildDashboard(
  childIdFromQuery?: string | null
) {
  const repository = getChildDashboardRepository();
  const explicitChildId = childIdFromQuery?.trim();

  try {
    if (explicitChildId) {
      const binding = loadDeviceBinding();

      if (binding?.familyId) {
        return await repository.getDashboard({
          familyId: binding.familyId,
          childId: explicitChildId
        });
      }

      return await repository.getDashboard(createMockSelector(explicitChildId));
    }

    const binding = loadDeviceBinding();

    if (binding?.childId) {
      return await repository.getDashboard({
        familyId: binding.familyId,
        childId: binding.childId
      });
    }

    return await repository.getDashboard(createMockSelector("다온"));
  } catch {
    // Firestore may fail on server-side (no auth session) or network errors
    return getMockChildDashboard(explicitChildId ?? "다온");
  }
}
