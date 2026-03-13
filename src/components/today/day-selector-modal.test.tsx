import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DaySelectorModal } from "./day-selector-modal";
import type { DayInfo } from "./day-selector-modal";

function makeDays(count: number): DayInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `day-${String(i + 1).padStart(3, "0")}`,
    title: `Day ${String(i + 1).padStart(2, "0")}`,
    completed: i < 3,
    isCheckpoint: (i + 1) % 5 === 0
  }));
}

const days20 = makeDays(20);

describe("DaySelectorModal", () => {
  it("renders all 20 days", () => {
    render(
      <DaySelectorModal
        days={days20}
        currentDayId="day-001"
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId("day-selector-modal")).toBeInTheDocument();
    for (const day of days20) {
      expect(screen.getByTestId(`day-item-${day.id}`)).toBeInTheDocument();
    }
  });

  it("shows completed status on completed days", () => {
    render(
      <DaySelectorModal
        days={days20}
        currentDayId="day-004"
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    // First 3 days are completed
    const day1 = screen.getByTestId("day-item-day-001");
    expect(day1.textContent).toContain("\u2713");

    const day4 = screen.getByTestId("day-item-day-004");
    expect(day4.textContent).not.toContain("\u2713");
  });

  it("highlights current day", () => {
    render(
      <DaySelectorModal
        days={days20}
        currentDayId="day-004"
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const currentItem = screen.getByTestId("day-item-day-004");
    expect(currentItem).toHaveAttribute("aria-current", "true");
  });

  it("calls onSelect when a day is clicked", () => {
    const onSelect = vi.fn();

    render(
      <DaySelectorModal
        days={days20}
        currentDayId="day-001"
        onSelect={onSelect}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("day-item-day-007"));
    expect(onSelect).toHaveBeenCalledWith("day-007");
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();

    render(
      <DaySelectorModal
        days={days20}
        currentDayId="day-001"
        onSelect={vi.fn()}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /닫기/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
