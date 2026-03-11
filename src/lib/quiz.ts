import type { WordItem } from "@/data/today-words";

export type QuizQuestion = {
  index: number;
  word: WordItem;
  choices: string[];
};

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function createQuiz(words: WordItem[]): QuizQuestion[] {
  return shuffle(words).map((word, index) => {
    const distractors = shuffle(
      words
        .filter((candidate) => candidate.id !== word.id)
        .map((candidate) => candidate.meaning)
    ).slice(0, 3);

    return {
      index,
      word,
      choices: shuffle([word.meaning, ...distractors])
    };
  });
}
