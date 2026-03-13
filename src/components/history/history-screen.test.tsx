import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HistoryScreen } from "./history-screen";

describe("HistoryScreen", () => {
  it("shows recent day records first", () => {
    render(
      <HistoryScreen
        childId="다온"
        childName="다온"
        entries={[
          { dayId: "day-005", title: "Day 05 Test", date: "2026.03.12", score: 17, total: 20, wrongWordCount: 3, wrongWords: ["adult", "camera", "magic"] },
          { dayId: "day-004", title: "Day 04", date: "2026.03.11", score: 18, total: 20, wrongWordCount: 2, wrongWords: ["milk", "juice"] }
        ]}
      />
    );

    expect(screen.getByText("Day 05 Test")).toBeInTheDocument();
    expect(screen.getByText("2026.03.12")).toBeInTheDocument();
    expect(screen.getByText(/틀린 단어 3개/i)).toBeInTheDocument();
    expect(screen.getByText(/최근 보관된 Day 기록 2권/i)).toBeInTheDocument();
    expect(screen.getByText(/adult, camera, magic/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /기록 펼치기/i })[0]).toHaveAttribute(
      "href",
      "/history/day-005?child=%EB%8B%A4%EC%98%A8"
    );
  });

  it("shows an archive empty state when there is no day history", () => {
    render(<HistoryScreen childId="다온" childName="다온" entries={[]} />);

    expect(screen.getByText(/아직 보관된 day 기록이 없습니다/i)).toBeInTheDocument();
  });
});
