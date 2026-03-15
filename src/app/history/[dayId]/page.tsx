import { notFound } from "next/navigation";
import { DayHistoryDetailScreen } from "@/components/history/day-history-detail-screen";
import { getChildDashboardRepository } from "@/lib/data/child-dashboard-repository";
import { resolveChildDashboard, resolveChildSelector } from "@/lib/mock/resolve-child-dashboard";

type HistoryDetailPageProps = {
  params: Promise<{
    dayId: string;
  }>;
  searchParams?: Promise<{
    child?: string;
  }>;
};

export default async function HistoryDetailPage({
  params,
  searchParams
}: HistoryDetailPageProps) {
  const { dayId } = await params;
  const query = (await searchParams) ?? {};
  const selector = resolveChildSelector(query.child);
  const dashboard = await resolveChildDashboard(query.child);
  const entry = await getChildDashboardRepository().getHistoryEntry(
    selector,
    dayId
  );

  if (!entry) {
    notFound();
  }

  return (
    <DayHistoryDetailScreen
      childId={dashboard.childId}
      childName={dashboard.childName}
      entry={entry}
    />
  );
}
