import { TodayStage } from "@/components/today/today-stage";
import { resolveDay } from "@/lib/content/resolve-day";

type TodayPageProps = {
  searchParams?: Promise<{
    day?: string;
    stage?: string;
  }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = (await searchParams) ?? {};
  const resolved = resolveDay(params.day);
  const stage =
    params.stage === "learn_completed" ||
    params.stage === "test_completed" ||
    params.stage === "completed"
      ? params.stage
      : "not_started";

  return (
    <TodayStage
      dayId={resolved.day.id}
      dayKind={resolved.kind}
      dayTitle={resolved.day.title}
      stage={stage}
    />
  );
}
