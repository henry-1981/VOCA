import { CheckpointTestScreen } from "@/components/test/checkpoint-test-screen";
import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { resolveDay } from "@/lib/content/resolve-day";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";
import { generateLearningTestQuestions } from "@/lib/test/generate-learning-test";

type TestPageProps = {
  searchParams?: Promise<{
    child?: string;
    day?: string;
  }>;
};

export default async function TestPage({ searchParams }: TestPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);
  const resolved = resolveDay(params.day ?? dashboard.currentDayId);

  if (resolved.kind === "checkpoint_test") {
    return (
      <CheckpointTestScreen
        dayTitle={resolved.day.title}
        questions={resolved.day.questions}
      />
    );
  }

  return (
      <LearningTestScreen
        dayTitle={resolved.day.title}
        questions={generateLearningTestQuestions(resolved.day.words)}
      />
    );
}
