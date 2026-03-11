import { describe, expect, it } from "vitest";
import type { WordEntry } from "@/lib/types/domain";
import { generateLearningTestQuestions } from "./generate-learning-test";

const mockWords: WordEntry[] = [
  { id: "adult", english: "adult", meaning: "어른 성인", audioMode: "tts", illustrationMode: "optional" },
  { id: "baby", english: "baby", meaning: "아기", audioMode: "tts", illustrationMode: "optional" },
  { id: "boy", english: "boy", meaning: "소년", audioMode: "tts", illustrationMode: "optional" },
  { id: "girl", english: "girl", meaning: "소녀", audioMode: "tts", illustrationMode: "optional" },
  { id: "hero", english: "hero", meaning: "영웅", audioMode: "tts", illustrationMode: "optional" }
];

describe("generateLearningTestQuestions", () => {
  it("mixes EN->KO and KO->EN questions with four choices", () => {
    const questions = generateLearningTestQuestions(mockWords, 5);

    expect(questions.some((question) => question.direction === "en_to_ko")).toBe(true);
    expect(questions.some((question) => question.direction === "ko_to_en")).toBe(true);
    expect(questions.every((question) => question.choices.length === 4)).toBe(true);
  });
});
