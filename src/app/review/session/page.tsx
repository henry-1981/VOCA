import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { getBridgeVocaBasicDays } from "@/lib/content/load-day";
import { getChildDashboardRepository } from "@/lib/data/child-dashboard-repository";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";
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
  const dashboard = await resolveChildDashboard(params.child);
  const reviewWordsFromRepository = await getChildDashboardRepository().getReviewWords(
    {
      familyId: "mock-family",
      childId: dashboard.childId
    },
    dashboard.reviewBatchSize
  );
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
      questions={generateLearningTestQuestions(reviewWords, reviewWords.length)}
    />
  );
}
