import { CheckpointTestScreen } from "@/components/test/checkpoint-test-screen";
import { LearningTestScreen } from "@/components/test/learning-test-screen";
import { resolveDay } from "@/lib/content/resolve-day";
import { generateLearningTestQuestions } from "@/lib/test/generate-learning-test";

type TestPageProps = {
  searchParams?: Promise<{
    day?: string;
  }>;
};

export default async function TestPage({ searchParams }: TestPageProps) {
  const params = (await searchParams) ?? {};
  const resolved = resolveDay(params.day);

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
