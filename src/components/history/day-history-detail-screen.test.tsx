import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DayHistoryDetailScreen } from "./day-history-detail-screen";

describe("DayHistoryDetailScreen", () => {
  it("shows wrong words for a selected day record", () => {
    render(
      <DayHistoryDetailScreen
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
    expect(screen.getByText("adult")).toBeInTheDocument();
    expect(screen.getByText("camera")).toBeInTheDocument();
    expect(screen.getByText("magic")).toBeInTheDocument();
  });
});
