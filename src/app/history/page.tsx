import { HistoryScreen } from "@/components/history/history-screen";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

type HistoryPageProps = {
  searchParams?: Promise<{
    child?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);

  return (
    <HistoryScreen
      childId={dashboard.childId}
      childName={dashboard.childName}
      entries={dashboard.historyEntries}
    />
  );
}
