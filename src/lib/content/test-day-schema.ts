import type {
  CheckpointDayContent,
  CheckpointQuestion
} from "@/lib/types/domain";

function normalizeQuestion(question: CheckpointQuestion): CheckpointQuestion {
  return {
    ...question,
    section: question.section.trim(),
    prompt: question.prompt.trim(),
    answer: question.answer.trim(),
    choices: question.choices.map((choice) => choice.trim()).filter(Boolean)
  };
}

export function parseCheckpointDayContent(
  input: CheckpointDayContent
): CheckpointDayContent {
  if (input.kind !== "checkpoint_test") {
    throw new Error("Checkpoint day must use checkpoint_test kind");
  }

  if (!input.id?.trim()) {
    throw new Error("Checkpoint day is missing id");
  }

  if (!input.bookId?.trim()) {
    throw new Error("Checkpoint day is missing bookId");
  }

  if (!input.title?.trim()) {
    throw new Error("Checkpoint day is missing title");
  }

  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    throw new Error("Checkpoint day must contain questions");
  }

  const normalizedQuestions = input.questions.map(normalizeQuestion);

  normalizedQuestions.forEach((question, index) => {
    if (!question.section) {
      throw new Error(`Question ${index + 1} is missing section`);
    }

    if (!question.prompt) {
      throw new Error(`Question ${index + 1} is missing prompt`);
    }

    if (!question.answer) {
      throw new Error(`Question ${index + 1} is missing answer`);
    }
  });

  return {
    ...input,
    id: input.id.trim(),
    title: input.title.trim(),
    topic: input.topic.trim(),
    bookId: input.bookId.trim(),
    sections: [...input.sections],
    questions: normalizedQuestions
  };
}
