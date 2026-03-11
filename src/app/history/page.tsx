import { HistoryScreen } from "@/components/history/history-screen";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";

export default function HistoryPage() {
  const dashboard = getMockChildDashboard("다온");

  return (
    <HistoryScreen childName={dashboard.childName} entries={dashboard.historyEntries} />
  );
}
