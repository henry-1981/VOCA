import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckpointTestScreen } from "./checkpoint-test-screen";

describe("CheckpointTestScreen", () => {
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

    expect(screen.getByRole("button", { name: "tea" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "candy" })).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: "tea" }));

    expect(screen.getByRole("link", { name: /today로 돌아가기/i })).toHaveAttribute(
      "href",
      "/today?child=%EB%8B%A4%EC%98%A8&day=day-005&stage=test_completed"
    );
  });
});
