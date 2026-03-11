import { ReviewScreen } from "@/components/review/review-screen";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

type ReviewPageProps = {
  searchParams?: Promise<{
    child?: string;
  }>;
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);

  return (
    <ReviewScreen
      childName={dashboard.childName}
      batchSize={dashboard.reviewBatchSize}
      title="오늘의 복습"
    />
  );
}
