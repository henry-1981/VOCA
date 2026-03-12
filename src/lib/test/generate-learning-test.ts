import type { WordEntry } from "@/lib/types/domain";

export type LearningTestQuestion = {
  id: string;
  direction: "en_to_ko" | "ko_to_en";
  prompt: string;
  answer: string;
  audioText: string;
  audioMode: "tts" | "mp3";
  audioUrl?: string;
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

export function generateLearningTestQuestions(
  words: WordEntry[],
  limit = words.length
): LearningTestQuestion[] {
  return shuffle(words).slice(0, limit).map((word, index) => {
    const direction = index % 2 === 0 ? "en_to_ko" : "ko_to_en";
    const pool =
      direction === "en_to_ko"
        ? words.filter((candidate) => candidate.id !== word.id).map((candidate) => candidate.meaning)
        : words.filter((candidate) => candidate.id !== word.id).map((candidate) => candidate.english);

    const correct = direction === "en_to_ko" ? word.meaning : word.english;
    const prompt = direction === "en_to_ko" ? word.english : word.meaning;

    return {
      id: `${word.id}-${direction}`,
      direction,
      prompt,
      answer: correct,
      audioText: word.english,
      audioMode: word.audioMode,
      audioUrl: word.audioUrl,
      choices: shuffle([correct, ...shuffle(pool).slice(0, 3)])
    };
  });
}
