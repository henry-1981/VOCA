import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearningTestScreen } from "./learning-test-screen";

describe("LearningTestScreen", () => {
  it("shows round hierarchy and progress pips", () => {
    render(
      <LearningTestScreen
        childId="다온"
        dayId="day-001"
        dayTitle="Day 01"
        questions={[
          {
            id: "adult-en_to_ko",
            direction: "en_to_ko",
            prompt: "adult",
            answer: "어른 성인",
            audioText: "adult",
            audioMode: "tts",
            choices: ["어른 성인", "소년", "사람", "아기"]
          },
          {
            id: "baby-ko_to_en",
            direction: "ko_to_en",
            prompt: "아기",
            answer: "baby",
            audioText: "baby",
            audioMode: "tts",
            choices: ["baby", "child", "kid", "boy"]
          }
        ]}
      />
    );

    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getByLabelText("test progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play audio/i })).toBeInTheDocument();
    expect(screen.getAllByText("Magical Tile")).toHaveLength(4);
  });
});
