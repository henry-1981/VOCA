import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LevelUpOverlay } from "./level-up-overlay";

describe("LevelUpOverlay", () => {
  it("shows Level Up! and new level number", () => {
    render(<LevelUpOverlay newLevel={5} onClose={vi.fn()} />);

    expect(screen.getByText("Level Up!")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByTestId("level-up-overlay")).toBeInTheDocument();
  });

  it("calls onClose on click", () => {
    const onClose = vi.fn();
    render(<LevelUpOverlay newLevel={3} onClose={onClose} />);

    fireEvent.click(screen.getByTestId("level-up-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("auto-closes after 3s", () => {
    vi.useFakeTimers();

    try {
      const onClose = vi.fn();
      render(<LevelUpOverlay newLevel={7} onClose={onClose} />);

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
