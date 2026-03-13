import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DayHistoryDetailScreen } from "./day-history-detail-screen";

describe("DayHistoryDetailScreen", () => {
  it("shows wrong words for a selected day record", () => {
    render(
      <DayHistoryDetailScreen
        childId="다온"
        childName="다온"
        entry={{
          dayId: "day-005",
          title: "Day 05 Test",
          date: "2026.03.12",
          score: 17,
          total: 20,
          wrongWordCount: 3,
          wrongWords: ["adult", "camera", "magic"]
        }}
      />
    );

    expect(screen.getByText("Day 05 Test")).toBeInTheDocument();
    expect(screen.getByText(/day 기록 열람실/i)).toBeInTheDocument();
    expect(screen.getByText("adult")).toBeInTheDocument();
    expect(screen.getByText("camera")).toBeInTheDocument();
    expect(screen.getByText("magic")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /기록 보관실로 돌아가기/i })).toHaveAttribute(
      "href",
      "/history?child=%EB%8B%A4%EC%98%A8"
    );
  });

  it("shows a clean record state when there are no wrong words", () => {
    render(
      <DayHistoryDetailScreen
        childId="다온"
        childName="다온"
        entry={{
          dayId: "day-004",
          title: "Day 04",
          date: "2026.03.11",
          score: 20,
          total: 20,
          wrongWordCount: 0,
          wrongWords: []
        }}
      />
    );

    expect(screen.getByText(/이 day는 다시 펼쳐볼 오답이 없습니다/i)).toBeInTheDocument();
  });
});
