import { TodayStage } from "@/components/today/today-stage";
import { resolveDay } from "@/lib/content/resolve-day";
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
  const stage =
    params.stage === "learn_completed" ||
    params.stage === "test_completed" ||
    params.stage === "completed"
      ? params.stage
      : "not_started";

  return (
    <TodayStage
      childId={dashboard.childId}
      dayId={resolved.day.id}
      dayKind={resolved.kind}
      dayTitle={resolved.day.title}
      stage={stage}
    />
  );
}
