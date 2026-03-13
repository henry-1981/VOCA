import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DayCompleteCelebration } from "./day-complete-celebration";

describe("DayCompleteCelebration", () => {
  it("renders day title and confetti container", () => {
    render(
      <DayCompleteCelebration dayTitle="Day 01" totalXp={100} onClose={vi.fn()} />
    );

    expect(screen.getByText(/Day 01 완료!/)).toBeInTheDocument();
    expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
  });

  it("shows total XP", () => {
    render(
      <DayCompleteCelebration dayTitle="Day 01" totalXp={85} onClose={vi.fn()} />
    );

    expect(screen.getByText(/\+85 XP/)).toBeInTheDocument();
  });

  it("calls onClose when button clicked", () => {
    const onClose = vi.fn();
    render(
      <DayCompleteCelebration dayTitle="Day 01" totalXp={100} onClose={onClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /계속하기/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("auto-closes after 3s", () => {
    vi.useFakeTimers();

    try {
      const onClose = vi.fn();
      render(
        <DayCompleteCelebration dayTitle="Day 01" totalXp={100} onClose={onClose} />
      );

      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
