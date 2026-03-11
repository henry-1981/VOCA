import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HistoryScreen } from "./history-screen";

describe("HistoryScreen", () => {
  it("shows recent day records first", () => {
    render(
      <HistoryScreen
        childName="다온"
        entries={[
          { dayId: "day-005", title: "Day 05 Test", date: "2026.03.12", score: 17, total: 20, wrongWordCount: 3 },
          { dayId: "day-004", title: "Day 04", date: "2026.03.11", score: 18, total: 20, wrongWordCount: 2 }
        ]}
      />
    );

    expect(screen.getByText("Day 05 Test")).toBeInTheDocument();
    expect(screen.getByText("2026.03.12")).toBeInTheDocument();
    expect(screen.getByText(/틀린 단어 3개/i)).toBeInTheDocument();
  });
});
