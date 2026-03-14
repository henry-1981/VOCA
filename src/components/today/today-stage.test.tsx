import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodayStage } from "./today-stage";

describe("TodayStage", () => {
  it("shows Learn as primary for a learning day before learn completion", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-001"
        dayKind="learning"
        dayTitle="Day 01"
        stage="not_started"
      />
    );

    expect(screen.getAllByText("Learn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Test").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/단어 익히기/i)).toBeInTheDocument();
  });

  it("shows Test as primary immediately for a checkpoint day", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-005"
        dayKind="checkpoint_test"
        dayTitle="Day 05 Test"
        stage="not_started"
      />
    );

    expect(screen.getAllByText(/종합 테스트 시작/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/단어 익히기/i)).not.toBeInTheDocument();
  });

  it("shows a completion-oriented state after test completion", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-001"
        dayKind="learning"
        dayTitle="Day 01"
        stage="test_completed"
      />
    );

    expect(screen.getByText(/테스트 완료/i)).toBeInTheDocument();
  });

  it("shows transition message when stage is learn_completed", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-001"
        dayKind="learning"
        dayTitle="Day 01"
        stage="learn_completed"
      />
    );

    const message = screen.getByTestId("transition-message");
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent(/학습 완료/);
  });

  it("test card has glow when stage is learn_completed", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-001"
        dayKind="learning"
        dayTitle="Day 01"
        stage="learn_completed"
      />
    );

    const testCard = screen.getByTestId("test-card");
    expect(testCard).toHaveClass("animate-glow-pulse");
  });

  it("test card does not glow when stage is not_started", () => {
    render(
      <TodayStage
        childId="다온"
        dayId="day-001"
        dayKind="learning"
        dayTitle="Day 01"
        stage="not_started"
      />
    );

    const testCard = screen.getByTestId("test-card");
    expect(testCard).not.toHaveClass("animate-glow-pulse");
  });
});
