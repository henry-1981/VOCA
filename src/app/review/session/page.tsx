import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { getBridgeVocaBasicDays } from "@/lib/content/load-day";
import { getChildDashboardRepository } from "@/lib/data/child-dashboard-repository";
import { resolveChildDashboard, resolveChildSelector } from "@/lib/mock/resolve-child-dashboard";
import { buildReviewBatch } from "@/lib/review/build-review-batch";
import { generateLearningTestQuestions } from "@/lib/test/generate-learning-test";

type ReviewSessionPageProps = {
  searchParams?: Promise<{
    child?: string;
  }>;
};

export default async function ReviewSessionPage({
  searchParams
}: ReviewSessionPageProps) {
  const params = (await searchParams) ?? {};
  const selector = resolveChildSelector(params.child);
  const dashboard = await resolveChildDashboard(params.child);

  let reviewWordsFromRepository: string[] = [];
  try {
    reviewWordsFromRepository = await getChildDashboardRepository().getReviewWords(
      selector,
      dashboard.reviewBatchSize
    );
  } catch {
    // Firestore may fail on server-side (no auth session)
  }
  const days = getBridgeVocaBasicDays();
  const allWords = days.flatMap((day) => day.words);
  const reviewIds = buildReviewBatch(
    reviewWordsFromRepository,
    dashboard.reviewBatchSize
  );
  const reviewWords = reviewIds
    .map((id) => allWords.find((word) => word.id === id))
    .filter((word): word is NonNullable<typeof word> => Boolean(word));

  return (
    <LearningTestScreen
      dayTitle="Review Session"
      mode="review"
      completionHref={`/review?child=${encodeURIComponent(dashboard.childId)}`}
      completionLabel="복습실로 돌아가기"
      questions={generateLearningTestQuestions(reviewWords, reviewWords.length)}
    />
  );
}
