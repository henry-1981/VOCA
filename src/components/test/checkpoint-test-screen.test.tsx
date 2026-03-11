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

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "music" } });
    expect(screen.getByDisplayValue("music")).toBeInTheDocument();
  });
});
