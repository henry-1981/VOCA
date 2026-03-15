import { selectEnglishVoiceName } from "./select-english-voice";

type PlayWordAudioInput = {
  text: string;
  audioMode: "tts" | "mp3";
  audioUrl?: string;
};

let currentMp3: HTMLAudioElement | null = null;
let playing = false;

export function isWordAudioPlaying(): boolean {
  return playing;
}

export function chooseAudioPlaybackMode({
  audioMode,
  audioUrl
}: Omit<PlayWordAudioInput, "text"> & { text?: string }) {
  if (audioMode === "mp3" && audioUrl) {
    return "mp3";
  }

  return "tts";
}

export function playWordAudio({ text, audioMode, audioUrl }: PlayWordAudioInput) {
  if (typeof window === "undefined") {
    return;
  }
  if (playing) return;

  const mode = chooseAudioPlaybackMode({ text, audioMode, audioUrl });

  if (mode === "mp3" && audioUrl) {
    if (currentMp3) {
      currentMp3.pause();
      currentMp3 = null;
    }
    const audio = new Audio(audioUrl);
    currentMp3 = audio;
    playing = true;
    audio.onended = () => { playing = false; currentMp3 = null; };
    audio.onerror = () => { playing = false; currentMp3 = null; };
    void audio.play().catch(() => { playing = false; currentMp3 = null; });
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const selectedName = selectEnglishVoiceName(voices);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  if (selectedName) {
    const selectedVoice = voices.find((voice) => voice.name === selectedName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }
  playing = true;
  utterance.onend = () => { playing = false; };
  utterance.onerror = () => { playing = false; };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
