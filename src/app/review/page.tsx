import { ReviewScreen } from "@/components/review/review-screen";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";

export default function ReviewPage() {
  const dashboard = getMockChildDashboard("다온");

  return (
    <ReviewScreen
      childName={dashboard.childName}
      batchSize={dashboard.reviewBatchSize}
      title="오늘의 복습"
    />
  );
}
