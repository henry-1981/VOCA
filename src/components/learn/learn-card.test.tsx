import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearnCard } from "./learn-card";

describe("LearnCard", () => {
  it("shows the english word in the center with a replay button", () => {
    render(
      <LearnCard
        childId="다온"
        dayId="day-001"
        currentIndex={2}
        total={20}
        topic="사람"
        word={{
          id: "adult",
          english: "adult",
          pronunciation: "ədʌlt",
          meaning: "어른 성인",
          exampleSentence: "The animation is also funny for adults.",
          exampleKo: "그 애니메이션은 어른들에게도 재미있다.",
          audioMode: "tts",
          illustrationMode: "optional"
        }}
      />
    );

    expect(screen.getByText("adult")).toBeInTheDocument();
    expect(screen.getByText("/ədʌlt/")).toBeInTheDocument();
    expect(screen.getByText("The animation is also funny for adults.")).toBeInTheDocument();
    expect(screen.getByText("그 애니메이션은 어른들에게도 재미있다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play pronunciation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play example audio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /다음 단어/i })).toHaveAttribute(
      "href",
      "/today/learn?child=%EB%8B%A4%EC%98%A8&day=day-001&index=2"
    );
  });

  it("shows a test start CTA on the last word", () => {
    render(
      <LearnCard
        childId="다온"
        dayId="day-001"
        currentIndex={20}
        total={20}
        topic="사람"
        word={{
          id: "woman",
          english: "woman",
          meaning: "성인 여자",
          audioMode: "tts",
          illustrationMode: "optional"
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: /이제 테스트 시작/i })
    ).toBeInTheDocument();
  });
});
