import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("renders a calmer review mode and returns to review after completion", async () => {
    vi.useFakeTimers();

    try {
      render(
        <LearningTestScreen
          childId="다온"
          dayTitle="Review Session"
          mode="review"
          completionHref="/review?child=%EB%8B%A4%EC%98%A8"
          completionLabel="복습실로 돌아가기"
          questions={[
            {
              id: "adult-en_to_ko",
              direction: "en_to_ko",
              prompt: "adult",
              answer: "어른 성인",
              audioText: "adult",
              audioMode: "tts",
              choices: ["어른 성인", "소년", "사람", "아기"]
            }
          ]}
        />
      );

      expect(screen.getByText("Review Session")).toBeInTheDocument();
      expect(screen.getByText("Quiet Review Round")).toBeInTheDocument();
      expect(screen.getAllByText("Review Tile")).toHaveLength(4);

      fireEvent.click(
        screen.getByRole("button", { name: /Review Tile 어른 성인/i })
      );

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText(/복습 기록 정리를 마쳤습니다/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /복습실로 돌아가기/i })).toHaveAttribute(
        "href",
        "/review?child=%EB%8B%A4%EC%98%A8"
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
