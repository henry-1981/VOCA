import type { DayContent, WordEntry } from "@/lib/types/domain";

function normalizeWordId(word: string) {
  return word
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function assertWordEntry(entry: WordEntry, index: number) {
  if (!entry.english?.trim()) {
    throw new Error(`Word ${index + 1} is missing english`);
  }

  if (!entry.meaning?.trim()) {
    throw new Error(`Word ${index + 1} is missing meaning`);
  }

  if (!entry.id?.trim()) {
    throw new Error(`Word ${index + 1} is missing id`);
  }
}

export function parseDayContent(input: DayContent): DayContent {
  if (!input.id?.trim()) {
    throw new Error("Day is missing id");
  }

  if (!input.title?.trim()) {
    throw new Error("Day is missing title");
  }

  if (!input.bookId?.trim()) {
    throw new Error("Day is missing bookId");
  }

  if (!Array.isArray(input.words)) {
    throw new Error("Day words must be an array");
  }

  if (input.words.length !== 20) {
    throw new Error(`Day ${input.id} must contain exactly 20 words`);
  }

  const normalizedWords = input.words.map((entry, index) => {
    const normalized: WordEntry = {
      ...entry,
      id: entry.id?.trim() || normalizeWordId(entry.english),
      english: entry.english.trim(),
      meaning: entry.meaning.trim(),
      partOfSpeech: entry.partOfSpeech?.trim(),
      pronunciation: entry.pronunciation?.trim(),
      exampleSentence: entry.exampleSentence?.trim(),
      exampleKo: entry.exampleKo?.trim(),
      order: entry.order ?? index + 1,
      audioMode: entry.audioMode ?? "tts",
      exampleAudioMode: entry.exampleAudioMode ?? "tts",
      illustrationMode: entry.illustrationMode ?? "optional"
    };

    assertWordEntry(normalized, index);

    return normalized;
  });

  return {
    ...input,
    id: input.id.trim(),
    title: input.title.trim(),
    topic: input.topic?.trim(),
    bookId: input.bookId.trim(),
    words: normalizedWords
  };
}
