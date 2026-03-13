import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileSwitcher } from "./profile-switcher";

describe("ProfileSwitcher", () => {
  it("renders current child name", () => {
    render(<ProfileSwitcher currentChildName="다온" onSwitch={vi.fn()} />);

    expect(screen.getByTestId("profile-switcher")).toBeInTheDocument();
    expect(screen.getByText("다온")).toBeInTheDocument();
  });

  it("shows confirmation dialog on button click", () => {
    render(<ProfileSwitcher currentChildName="다온" onSwitch={vi.fn()} />);

    expect(screen.queryByTestId("switch-confirm-dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /전환/i }));

    expect(screen.getByTestId("switch-confirm-dialog")).toBeInTheDocument();
    expect(screen.getByText(/다른 아이로 전환할까요/i)).toBeInTheDocument();
  });

  it("calls onSwitch when confirmed", () => {
    const onSwitch = vi.fn();
    render(<ProfileSwitcher currentChildName="지온" onSwitch={onSwitch} />);

    fireEvent.click(screen.getByRole("button", { name: /전환/i }));
    fireEvent.click(screen.getByRole("button", { name: /확인/i }));

    expect(onSwitch).toHaveBeenCalledTimes(1);
  });

  it("hides dialog when cancelled", () => {
    render(<ProfileSwitcher currentChildName="다온" onSwitch={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /전환/i }));
    expect(screen.getByTestId("switch-confirm-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /취소/i }));
    expect(screen.queryByTestId("switch-confirm-dialog")).not.toBeInTheDocument();
  });
});
