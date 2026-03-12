export type DeviceId = string;
export type FamilyId = string;
export type ChildId = string;
export type DayId = string;
export type WordId = string;
export type DayKind = "learning" | "checkpoint_test";

export type QuestionDirection = "en_to_ko" | "ko_to_en";

export type Family = {
  id: FamilyId;
  name: string;
  ownerUid: string;
  childIds: ChildId[];
  createdAt: string;
};

export type ChildProfile = {
  id: ChildId;
  familyId: FamilyId;
  name: string;
  avatarRef: string;
  themeKey: string;
  currentDayId: DayId | null;
  createdAt: string;
};

export type WordEntry = {
  id: WordId;
  order?: number;
  english: string;
  pronunciation?: string;
  meaning: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleKo?: string;
  audioMode: "tts" | "mp3";
  audioUrl?: string;
  exampleAudioMode?: "tts" | "mp3";
  exampleAudioUrl?: string;
  illustrationMode: "none" | "optional" | "required";
  illustrationUrl?: string;
};

export type DayContent = {
  id: DayId;
  kind?: DayKind;
  dayNumber?: number;
  title: string;
  topic?: string;
  bookId: string;
  words: WordEntry[];
};

export type CheckpointQuestionType =
  | "word_search"
  | "fill_blank"
  | "choice"
  | "translation";

export type CheckpointQuestion = {
  section: string;
  questionId: number;
  type: CheckpointQuestionType;
  prompt: string;
  choices: string[];
  answer: string;
};

export type CheckpointDayContent = {
  id: DayId;
  kind: "checkpoint_test";
  dayNumber: number;
  title: string;
  topic: string;
  bookId: string;
  sections: string[];
  questions: CheckpointQuestion[];
};

export type ChildProgress = {
  childId: ChildId;
  currentDayId: DayId | null;
  xp: number;
  level: number;
  streak: number;
  updatedAt: string;
};

export type DayProgress = {
  dayId: DayId;
  childId: ChildId;
  learnCompleted: boolean;
  testCompleted: boolean;
  completed: boolean;
  completedAt: string | null;
  latestScore: number | null;
  wrongWordIds: WordId[];
  updatedAt: string;
};

export type DayHistoryEntry = {
  id: string;
  childId: ChildId;
  dayId: DayId;
  score: number;
  totalQuestions: number;
  wrongWordIds: WordId[];
  completedAt: string;
};

export type ReviewQueueItem = {
  id: string;
  childId: ChildId;
  wordId: WordId;
  sourceDayId: DayId;
  direction: QuestionDirection;
  attempts: number;
  lastSeenAt: string | null;
  createdAt: string;
};

export type DeviceBinding = {
  deviceId: DeviceId;
  familyId: FamilyId;
  childId: ChildId;
  boundAt: string;
  lastValidatedAt: string;
};
