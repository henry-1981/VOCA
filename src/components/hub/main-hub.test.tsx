import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MainHub } from "./main-hub";

const defaultProps = {
  childId: "다온",
  currentDayId: "day-005",
  childName: "다온",
  level: 7,
  streak: 12,
  currentDayTitle: "Day 05 Test",
  previewMode: false
};

describe("MainHub", () => {
  it("shows Today as the primary action with character/history/review entries", () => {
    render(<MainHub {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "다온" })).toBeInTheDocument();
    expect(screen.getByText(/today/i)).toBeInTheDocument();
    expect(screen.getByText(/character/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
    expect(screen.getByText(/review/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Day 05 Test/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /today/i })).toHaveAttribute(
      "href",
      "/today?child=%EB%8B%A4%EC%98%A8&day=day-005"
    );
  });

  it("streak badge has glow-pulse animation when streak > 0", () => {
    render(<MainHub {...defaultProps} streak={5} />);

    const badge = screen.getByTestId("streak-badge");
    expect(badge).toHaveClass("animate-glow-pulse");
  });

  it("no glow when streak === 0", () => {
    render(<MainHub {...defaultProps} streak={0} />);

    const badge = screen.getByTestId("streak-badge");
    expect(badge).not.toHaveClass("animate-glow-pulse");
  });

  it("shows streak toast on mount when streak > 0", () => {
    render(<MainHub {...defaultProps} streak={3} />);

    const toast = screen.getByTestId("streak-toast");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent("+3일 연속!");
  });
});
