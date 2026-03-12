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

    expect(screen.getByText("LEARN")).toBeInTheDocument();
    expect(screen.getByText("TEST")).toBeInTheDocument();
    expect(screen.getByText(/오늘 단어 익히기 시작/i)).toBeInTheDocument();
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

    expect(screen.getByText(/종합 테스트 시작/i)).toBeInTheDocument();
    expect(screen.queryByText(/오늘 단어 익히기 시작/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/지금 바로 종합 테스트를 시작하세요/i)).toHaveLength(2);
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

    expect(screen.getByText(/Test 완료/i)).toBeInTheDocument();
    expect(screen.getByText(/오늘의 학습이 완료되었습니다/i)).toBeInTheDocument();
  });
});
