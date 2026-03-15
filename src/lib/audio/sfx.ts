export const SFX_IDS = [
  "correct",
  "wrong",
  "day-complete",
  "level-up",
  "card-flip",
  "tap",
  "streak",
  "profile-switch"
] as const;

export type SfxId = (typeof SFX_IDS)[number];

const STORAGE_KEY = "sfx-enabled";
const audioCache = new Map<SfxId, HTMLAudioElement>();

export function preloadSfx() {
  if (typeof window === "undefined") return;

  for (const id of SFX_IDS) {
    if (!audioCache.has(id)) {
      audioCache.set(id, new Audio(`/audio/sfx/${id}.mp3`));
    }
  }
}

export function playSfx(id: SfxId) {
  if (!isSfxEnabled()) return;

  const source = audioCache.get(id);
  if (!source) return;

  const clone = source.cloneNode() as HTMLAudioElement;
  clone.volume = 1;
  void clone.play().catch(() => {});
}

export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setSfxEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

// iOS Safari requires user gesture to unlock audio.
export function unlockAudioContext() {
  const silent = new Audio();
  void silent.play().catch(() => {});
}
