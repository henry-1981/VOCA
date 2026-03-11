import type { CheckpointDayContent, DayContent, DayKind } from "@/lib/types/domain";
import { getBridgeVocaBasicDay, getBridgeVocaBasicDays } from "./load-day";
import { getBridgeVocaBasicTestDay, getBridgeVocaBasicTestDays } from "./load-test-day";

export type ResolvedDay =
  | {
      kind: "learning";
      day: DayContent;
    }
  | {
      kind: "checkpoint_test";
      day: CheckpointDayContent;
    };

export function getDefaultResolvedDay(): ResolvedDay {
  return {
    kind: "learning",
    day: getBridgeVocaBasicDays()[0]
  };
}

export function resolveDay(dayId?: string | null): ResolvedDay {
  if (!dayId) {
    return getDefaultResolvedDay();
  }

  const learningDay = getBridgeVocaBasicDay(dayId);

  if (learningDay) {
    return {
      kind: "learning",
      day: learningDay
    };
  }

  const checkpointDay = getBridgeVocaBasicTestDay(dayId);

  if (checkpointDay) {
    return {
      kind: "checkpoint_test",
      day: checkpointDay
    };
  }

  return getDefaultResolvedDay();
}

export function getDayKind(dayId?: string | null): DayKind {
  return resolveDay(dayId).kind;
}

export function listAllDayIds() {
  return [
    ...getBridgeVocaBasicDays().map((day) => day.id),
    ...getBridgeVocaBasicTestDays().map((day) => day.id)
  ];
}
