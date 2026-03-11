import { TodayStageContainer } from "@/components/today/today-stage-container";
import { resolveDay } from "@/lib/content/resolve-day";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";
import type { MockDayStage } from "@/lib/mock/day-stage";

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

  return (
    <TodayStageContainer
      childId={dashboard.childId}
      dayId={resolved.day.id}
      dayKind={resolved.kind}
      dayTitle={resolved.day.title}
      initialStage={stage}
    />
  );
}
