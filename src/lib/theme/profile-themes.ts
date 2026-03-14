// Centralized profile theme definitions
// Each screen imports its backgrounds and base accents from here

export const PROFILE_IDS = ["다온", "지온"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];
export const DEFAULT_PROFILE: ProfileId = "다온";

// --- Screen background images ---
export const SCREEN_BACKGROUNDS = {
  hub: {
    "다온": "/backgrounds/academy-gate-landscape.webp",
    "지온": "/backgrounds/academy-hanok-landscape.webp",
  },
  today: {
    "다온": "/backgrounds/today-practice-warm.webp",
    "지온": "/backgrounds/today-practice-cool.webp",
  },
  learn: {
    "다온": "/backgrounds/today-practice-warm.webp",
    "지온": "/backgrounds/today-practice-cool.webp",
  },
  review: {
    "다온": "/backgrounds/review-moonlit-warm.webp",
    "지온": "/backgrounds/review-moonlit-cool.webp",
  },
  history: {
    "다온": "/backgrounds/history-library-warm.webp",
    "지온": "/backgrounds/history-library-cool.webp",
  },
  character: {
    "다온": "/backgrounds/character-lab-warm.webp",
    "지온": "/backgrounds/character-lab-cool.webp",
  },
} as const;

// --- Base accent palettes per profile ---
export const PROFILE_ACCENTS = {
  "다온": {
    cardBorder: "border-amber-300/20",
    cardBg: "bg-amber-950/40",
    labelText: "text-amber-200/70",
    accentText: "text-amber-100",
  },
  "지온": {
    cardBorder: "border-sky-300/20",
    cardBg: "bg-sky-950/40",
    labelText: "text-sky-200/70",
    accentText: "text-sky-100",
  },
} as const;

// --- Avatars ---
export const PROFILE_AVATARS = {
  "다온": "/avatars/daon-nobg.webp",
  "지온": "/avatars/jion-nobg.webp",
} as const;

// Helper to get background for a screen + profile
export function getScreenBackground(
  screen: keyof typeof SCREEN_BACKGROUNDS,
  profileId: string,
): string {
  const map = SCREEN_BACKGROUNDS[screen];
  return map[profileId as ProfileId] ?? map[DEFAULT_PROFILE];
}

// Helper to get base accent palette
export function getProfileAccent(profileId: string) {
  return PROFILE_ACCENTS[profileId as ProfileId] ?? PROFILE_ACCENTS[DEFAULT_PROFILE];
}
