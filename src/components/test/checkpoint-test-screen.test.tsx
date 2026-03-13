import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckpointTestScreen } from "./checkpoint-test-screen";

describe("CheckpointTestScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders choice buttons when choices are provided", () => {
    render(
      <CheckpointTestScreen
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "D",
            questionId: 1,
            type: "choice",
            prompt: "How much (tea / candy) do you need?",
            choices: ["tea", "candy"],
            answer: "tea"
          }
        ]}
      />
    );

    expect(screen.getByRole("button", { name: /tea/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /candy/i })).toBeInTheDocument();
  });

  it("renders an input when choices are not provided", () => {
    render(
      <CheckpointTestScreen
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "A",
            questionId: 1,
            type: "word_search",
            prompt: "음악",
            choices: [],
            answer: "music"
          }
        ]}
      />
    );

    expect(screen.getByText(/영어 단어를 직접 입력하세요/i)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "music" } });
    expect(screen.getByDisplayValue("music")).toBeInTheDocument();
  });

  it("shows type-specific helper text for translation questions", () => {
    render(
      <CheckpointTestScreen
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "E",
            questionId: 1,
            type: "translation",
            prompt: "history → ?",
            choices: [],
            answer: "역사"
          }
        ]}
      />
    );

    expect(screen.getByText(/뜻을 번역해서 입력하세요/i)).toBeInTheDocument();
  });

  it("submits typed answers on Enter for input questions", () => {
    render(
      <CheckpointTestScreen
        childId="다온"
        dayId="day-005"
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "A",
            questionId: 1,
            type: "word_search",
            prompt: "음악",
            choices: [],
            answer: "music"
          }
        ]}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "music" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Advance through the 250ms delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole("link", { name: /today로 돌아가기/i })).toBeInTheDocument();
  });

  it("shows a return CTA after checkpoint completion", () => {
    render(
      <CheckpointTestScreen
        childId="다온"
        dayId="day-005"
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "D",
            questionId: 1,
            type: "choice",
            prompt: "How much (tea / candy) do you need?",
            choices: ["tea", "candy"],
            answer: "tea"
          }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /tea/i }));

    // Advance through the 250ms delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole("link", { name: /today로 돌아가기/i })).toHaveAttribute(
      "href",
      "/today?child=%EB%8B%A4%EC%98%A8&day=day-005&stage=test_completed"
    );
  });

  it("shows progress pips matching LearningTestScreen style", () => {
    render(
      <CheckpointTestScreen
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "D",
            questionId: 1,
            type: "choice",
            prompt: "Q1",
            choices: ["a", "b"],
            answer: "a"
          },
          {
            section: "D",
            questionId: 2,
            type: "choice",
            prompt: "Q2",
            choices: ["c", "d"],
            answer: "c"
          }
        ]}
      />
    );

    const progressBar = screen.getByLabelText("test progress");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.children).toHaveLength(2);
  });

  it("shows sparkle effect on correct choice answer", () => {
    render(
      <CheckpointTestScreen
        dayTitle="Day 05 Test"
        questions={[
          {
            section: "D",
            questionId: 1,
            type: "choice",
            prompt: "Q1",
            choices: ["correct", "wrong"],
            answer: "correct"
          },
          {
            section: "D",
            questionId: 2,
            type: "choice",
            prompt: "Q2",
            choices: ["a", "b"],
            answer: "a"
          }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /correct/i }));
    expect(screen.getByTestId("correct-effect")).toBeInTheDocument();
  });
});
