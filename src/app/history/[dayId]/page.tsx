import { notFound } from "next/navigation";
import { DayHistoryDetailScreen } from "@/components/history/day-history-detail-screen";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";

type HistoryDetailPageProps = {
  params: Promise<{
    dayId: string;
  }>;
};

export default async function HistoryDetailPage({
  params
}: HistoryDetailPageProps) {
  const { dayId } = await params;
  const dashboard = getMockChildDashboard("다온");
  const entry = dashboard.historyEntries.find((item) => item.dayId === dayId);

  if (!entry) {
    notFound();
  }

  return <DayHistoryDetailScreen childName={dashboard.childName} entry={entry} />;
}
