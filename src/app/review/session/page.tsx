import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { getBridgeVocaBasicDays } from "@/lib/content/load-day";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";
import { buildReviewBatch } from "@/lib/review/build-review-batch";
import { generateLearningTestQuestions } from "@/lib/test/generate-learning-test";

export default function ReviewSessionPage() {
  const dashboard = getMockChildDashboard("다온");
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
