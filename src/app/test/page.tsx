import { TestSession } from "@/components/test/test-session";
import { todayWords } from "@/data/today-words";
import { createQuiz } from "@/lib/quiz";

export default function TestPage() {
  const initialQuestions = createQuiz(todayWords);

  return <TestSession initialQuestions={initialQuestions} words={todayWords} />;
}
