import { selectEnglishVoiceName } from "./select-english-voice";

type PlayWordAudioInput = {
  text: string;
  audioMode: "tts" | "mp3";
  audioUrl?: string;
};

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

  const mode = chooseAudioPlaybackMode({ text, audioMode, audioUrl });

  if (mode === "mp3" && audioUrl) {
    const audio = new Audio(audioUrl);
    void audio.play();
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
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
