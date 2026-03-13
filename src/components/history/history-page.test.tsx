import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HistoryScreen } from "./history-screen";

describe("History child binding view", () => {
  it("can render another child dashboard state", () => {
    render(
      <HistoryScreen
        childId="지온"
        childName="지온"
        entries={[
          {
            dayId: "day-002",
            title: "Day 02",
            date: "2026.03.12",
            score: 15,
            total: 20,
            wrongWordCount: 5,
            wrongWords: ["math", "history"]
          }
        ]}
      />
    );

    expect(screen.getByText(/지온의 Day 기록 보관실/i)).toBeInTheDocument();
  });
});
