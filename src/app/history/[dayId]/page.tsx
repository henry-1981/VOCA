import { notFound } from "next/navigation";
import { DayHistoryDetailScreen } from "@/components/history/day-history-detail-screen";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

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
  const dashboard = await resolveChildDashboard(query.child);
  const entry = dashboard.historyEntries.find((item) => item.dayId === dayId);

  if (!entry) {
    notFound();
  }

  return <DayHistoryDetailScreen childName={dashboard.childName} entry={entry} />;
}
