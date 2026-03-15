export const BGM_IDS = ["hub-theme"] as const;
export type BgmId = (typeof BGM_IDS)[number];

const STORAGE_KEY = "bgm-enabled";
const BGM_VOLUME = 0.3;
const FADE_STEP_MS = 50;
const FADE_DURATION_MS = 500;

let currentAudio: HTMLAudioElement | null = null;
let currentId: BgmId | null = null;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

export function playBgm(id: BgmId) {
  if (typeof window === "undefined") return;
  if (!isBgmEnabled()) return;
  if (currentId === id && currentAudio) return;

  stopBgmImmediate();

  const audio = new Audio(`/audio/bgm/${id}.mp3`);
  audio.loop = true;
  audio.volume = BGM_VOLUME;
  currentAudio = audio;
  currentId = id;
  void audio.play()?.catch(() => {});
}

export function stopBgm() {
  if (!currentAudio) return;

  const audio = currentAudio;
  const stepCount = FADE_DURATION_MS / FADE_STEP_MS;
  const volumeStep = audio.volume / stepCount;

  if (fadeInterval) clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - volumeStep);
    if (audio.volume <= 0.01) {
      audio.pause();
      audio.currentTime = 0;
      if (fadeInterval) clearInterval(fadeInterval);
      fadeInterval = null;
      currentAudio = null;
      currentId = null;
    }
  }, FADE_STEP_MS);
}

function stopBgmImmediate() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentId = null;
  }
}

export function isBgmEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setBgmEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
  if (!enabled) stopBgmImmediate();
}
