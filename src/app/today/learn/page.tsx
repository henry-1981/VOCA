import { LearnCard } from "@/components/learn/learn-card";
import { resolveDay } from "@/lib/content/resolve-day";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

type LearnPageProps = {
  searchParams?: Promise<{
    child?: string;
    day?: string;
    index?: string;
  }>;
};

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);
  const resolved = resolveDay(params.day ?? dashboard.currentDayId);

  if (resolved.kind !== "learning") {
    return null;
  }

  const index = Math.max(0, Number(params.index ?? "0"));
  const word = resolved.day.words[Math.min(index, resolved.day.words.length - 1)];

  return (
    <LearnCard
      childId={dashboard.childId}
      dayId={resolved.day.id}
      currentIndex={index + 1}
      total={resolved.day.words.length}
      topic={resolved.day.topic}
      word={word}
    />
  );
}
