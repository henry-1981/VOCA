import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearnCard } from "./learn-card";

describe("LearnCard", () => {
  it("shows the english word in the center with a replay button", () => {
    render(
      <LearnCard
        currentIndex={2}
        total={20}
        topic="사람"
        word={{
          id: "adult",
          english: "adult",
          meaning: "어른 성인",
          audioMode: "tts",
          illustrationMode: "optional"
        }}
      />
    );

    expect(screen.getByText("adult")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play pronunciation/i })).toBeInTheDocument();
  });
});
