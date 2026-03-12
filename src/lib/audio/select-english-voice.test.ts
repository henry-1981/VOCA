import { describe, expect, it } from "vitest";
import { selectEnglishVoiceName } from "./select-english-voice";

describe("selectEnglishVoiceName", () => {
  it("prefers an English educational/natural voice when available", () => {
    const voiceName = selectEnglishVoiceName([
      { lang: "ko-KR", name: "Korean Voice" },
      { lang: "en-US", name: "Samantha" },
      { lang: "en-US", name: "Google US English" }
    ]);

    expect(voiceName).toBe("Google US English");
  });
});
