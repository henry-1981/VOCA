import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LearningTestScreen } from "./learning-test-screen";

const singleQuestion = [
  {
    id: "adult-en_to_ko",
    direction: "en_to_ko" as const,
    prompt: "adult",
    answer: "어른 성인",
    audioText: "adult",
    audioMode: "tts" as const,
    choices: ["어른 성인", "소년", "사람", "아기"]
  }
];

const twoQuestions = [
  {
    id: "adult-en_to_ko",
    direction: "en_to_ko" as const,
    prompt: "adult",
    answer: "어른 성인",
    audioText: "adult",
    audioMode: "tts" as const,
    choices: ["어른 성인", "소년", "사람", "아기"]
  },
  {
    id: "baby-ko_to_en",
    direction: "ko_to_en" as const,
    prompt: "아기",
    answer: "baby",
    audioText: "baby",
    audioMode: "tts" as const,
    choices: ["baby", "child", "kid", "boy"]
  }
];

function makeManyQuestions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `word-${i}`,
    direction: "en_to_ko" as const,
    prompt: `word${i}`,
    answer: `뜻${i}`,
    audioText: `word${i}`,
    audioMode: "tts" as const,
    choices: [`뜻${i}`, `오답A${i}`, `오답B${i}`, `오답C${i}`]
  }));
}

describe("LearningTestScreen", () => {
  it("shows round hierarchy and progress pips", () => {
    render(
      <LearningTestScreen
        childId="다온"
        dayId="day-001"
        dayTitle="Day 01"
        questions={twoQuestions}
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
          questions={singleQuestion}
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

  it("shows sparkle effect on correct answer", () => {
    vi.useFakeTimers();

    try {
      render(
        <LearningTestScreen
          childId="다온"
          dayId="day-001"
          dayTitle="Day 01"
          questions={twoQuestions}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /Magical Tile 어른 성인/i })
      );

      expect(screen.getByTestId("correct-effect")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId("correct-effect")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows shake effect on wrong answer", () => {
    vi.useFakeTimers();

    try {
      render(
        <LearningTestScreen
          childId="다온"
          dayId="day-001"
          dayTitle="Day 01"
          questions={twoQuestions}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /Magical Tile 소년/i })
      );

      expect(screen.getByTestId("wrong-effect")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(screen.queryByTestId("wrong-effect")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows combo counter after 3 consecutive correct answers", () => {
    vi.useFakeTimers();

    try {
      const questions = makeManyQuestions(5);

      render(
        <LearningTestScreen
          childId="다온"
          dayId="day-001"
          dayTitle="Day 01"
          questions={questions}
        />
      );

      // Answer 3 questions correctly
      for (let i = 0; i < 3; i++) {
        fireEvent.click(
          screen.getByRole("button", { name: new RegExp(`Magical Tile 뜻${i}`) })
        );

        if (i < 2) {
          // Combo counter should NOT be visible yet for first 2 correct answers
          expect(screen.queryByTestId("combo-counter")).not.toBeInTheDocument();
        }

        act(() => {
          vi.advanceTimersByTime(300);
        });
      }

      // After 3rd correct answer, combo counter should show x3
      expect(screen.getByTestId("combo-counter")).toBeInTheDocument();
      expect(screen.getByText("x3")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("resets combo silently on wrong answer", () => {
    vi.useFakeTimers();

    try {
      const questions = makeManyQuestions(5);

      render(
        <LearningTestScreen
          childId="다온"
          dayId="day-001"
          dayTitle="Day 01"
          questions={questions}
        />
      );

      // Get 3 correct to build combo
      for (let i = 0; i < 3; i++) {
        fireEvent.click(
          screen.getByRole("button", { name: new RegExp(`Magical Tile 뜻${i}`) })
        );
        act(() => {
          vi.advanceTimersByTime(300);
        });
      }

      expect(screen.getByTestId("combo-counter")).toBeInTheDocument();

      // Now answer wrong
      fireEvent.click(
        screen.getByRole("button", { name: new RegExp(`Magical Tile 오답A3`) })
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Combo should be gone
      expect(screen.queryByTestId("combo-counter")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows floating XP text on correct answer", () => {
    vi.useFakeTimers();

    try {
      render(
        <LearningTestScreen
          childId="다온"
          dayId="day-001"
          dayTitle="Day 01"
          questions={twoQuestions}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /Magical Tile 어른 성인/i })
      );

      const xpFloat = screen.getByTestId("xp-float");
      expect(xpFloat).toBeInTheDocument();
      expect(xpFloat).toHaveTextContent("+5 XP");

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(screen.queryByTestId("xp-float")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not show sparkle effect in review mode", () => {
    vi.useFakeTimers();

    try {
      render(
        <LearningTestScreen
          childId="다온"
          dayTitle="Review Session"
          mode="review"
          questions={twoQuestions}
        />
      );

      fireEvent.click(
        screen.getByRole("button", { name: /Review Tile 어른 성인/i })
      );

      expect(screen.queryByTestId("correct-effect")).not.toBeInTheDocument();

      // But XP float should still appear (muted silver style)
      expect(screen.getByTestId("xp-float")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not show combo in review mode", () => {
    vi.useFakeTimers();

    try {
      const questions = makeManyQuestions(4);

      render(
        <LearningTestScreen
          childId="다온"
          dayTitle="Review"
          mode="review"
          questions={questions}
        />
      );

      // Answer 3 correct in review mode
      for (let i = 0; i < 3; i++) {
        fireEvent.click(
          screen.getByRole("button", { name: new RegExp(`Review Tile 뜻${i}`) })
        );
        act(() => {
          vi.advanceTimersByTime(300);
        });
      }

      // Combo counter should NOT appear in review mode
      expect(screen.queryByTestId("combo-counter")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
