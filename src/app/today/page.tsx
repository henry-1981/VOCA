import type { DayInfo } from "@/components/today/day-selector-modal";
import { TodayStageContainer } from "@/components/today/today-stage-container";
import { getBridgeVocaBasicDays } from "@/lib/content/load-day";
import { getBridgeVocaBasicTestDays } from "@/lib/content/load-test-day";
import { resolveDay } from "@/lib/content/resolve-day";
import type { MockDayStage } from "@/lib/mock/day-stage";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

type TodayPageProps = {
  searchParams?: Promise<{
    child?: string;
    day?: string;
    stage?: string;
  }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);
  const resolved = resolveDay(params.day ?? dashboard.currentDayId);
  const stage: MockDayStage =
    params.stage === "learn_completed" ||
    params.stage === "test_completed" ||
    params.stage === "completed"
      ? params.stage
      : "not_started";

  const allDays: DayInfo[] = [
    ...getBridgeVocaBasicDays().map((d) => ({
      id: d.id,
      title: d.title,
      completed: false,
      isCheckpoint: false,
    })),
    ...getBridgeVocaBasicTestDays().map((d) => ({
      id: d.id,
      title: d.title,
      completed: false,
      isCheckpoint: true,
    })),
  ].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <TodayStageContainer
      childId={dashboard.childId}
      dayId={resolved.day.id}
      dayKind={resolved.kind}
      dayTitle={resolved.day.title}
      initialStage={stage}
      allDays={allDays}
    />
  );
}
