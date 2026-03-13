"use client";

import Link from "next/link";
import { LearningTestScreen } from "@/components/test/learning-test-screen";
import type { LearningTestQuestion } from "@/lib/test/generate-learning-test";

const mockQuestions: LearningTestQuestion[] = [
  {
    id: "q1",
    direction: "en_to_ko",
    prompt: "apple",
    answer: "사과",
    audioText: "apple",
    audioMode: "tts",
    choices: ["사과", "바나나", "포도", "오렌지"],
  },
  {
    id: "q2",
    direction: "ko_to_en",
    prompt: "바나나",
    answer: "banana",
    audioText: "banana",
    audioMode: "tts",
    choices: ["banana", "grape", "melon", "cherry"],
  },
  {
    id: "q3",
    direction: "en_to_ko",
    prompt: "school",
    answer: "학교",
    audioText: "school",
    audioMode: "tts",
    choices: ["병원", "학교", "도서관", "공원"],
  },
  {
    id: "q4",
    direction: "ko_to_en",
    prompt: "고양이",
    answer: "cat",
    audioText: "cat",
    audioMode: "tts",
    choices: ["dog", "cat", "bird", "fish"],
  },
];

export default function TestPreviewPage() {
  return (
    <div className="relative">
      <LearningTestScreen
        childId="daon"
        dayId="day-003"
        dayTitle="Day 03"
        questions={mockQuestions}
        mode="test"
      />
      <Link
        href="/design-preview"
        className="fixed bottom-3 left-3 z-50 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/80"
      >
        &larr; Back to previews
      </Link>
    </div>
  );
}
