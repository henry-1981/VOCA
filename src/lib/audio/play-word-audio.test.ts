import { describe, expect, it } from "vitest";
import { chooseAudioPlaybackMode } from "./play-word-audio";

describe("chooseAudioPlaybackMode", () => {
  it("prefers mp3 when audioUrl exists", () => {
    expect(
      chooseAudioPlaybackMode({
        text: "adult",
        audioMode: "mp3",
        audioUrl: "/audio/generated/bridge-voca-basic/day-001/Day01_01_01.mp3"
      })
    ).toBe("mp3");
  });

  it("falls back to tts when audioUrl is absent", () => {
    expect(
      chooseAudioPlaybackMode({
        text: "adult",
        audioMode: "tts"
      })
    ).toBe("tts");
  });
});
