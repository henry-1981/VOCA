import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { getBridgeVocaBasicDays } from "@/lib/content/load-day";
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
  const days = getBridgeVocaBasicDays();
  const allWords = days.flatMap((day) => day.words);
  const reviewIds = buildReviewBatch(dashboard.reviewWords, dashboard.reviewBatchSize);
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
