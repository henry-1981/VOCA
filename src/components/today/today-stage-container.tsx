"use client";

import { useEffect, useState } from "react";
import {
  getMockDayStage,
  type MockDayStage
} from "@/lib/mock/day-stage";
import type { DayKind } from "@/lib/types/domain";
import { TodayStage } from "./today-stage";

type TodayStageContainerProps = {
  childId: string;
  dayId: string;
  dayKind: DayKind;
  dayTitle: string;
  initialStage: MockDayStage;
};

export function TodayStageContainer({
  childId,
  dayId,
  dayKind,
  dayTitle,
  initialStage
}: TodayStageContainerProps) {
  const [stage, setStage] = useState<MockDayStage>(initialStage);

  useEffect(() => {
    setStage(getMockDayStage(childId, dayId));
  }, [childId, dayId]);

  return (
    <TodayStage
      childId={childId}
      dayId={dayId}
      dayKind={dayKind}
      dayTitle={dayTitle}
      stage={stage}
    />
  );
}
