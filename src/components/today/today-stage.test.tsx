import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TodayStage } from "./today-stage";

describe("TodayStage", () => {
  it("shows Learn as primary for a learning day before learn completion", () => {
    render(
      <TodayStage
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
        dayId="day-005"
        dayKind="checkpoint_test"
        dayTitle="Day 05 Test"
        stage="not_started"
      />
    );

    expect(screen.getByText(/종합 테스트 시작/i)).toBeInTheDocument();
    expect(screen.queryByText(/오늘 단어 익히기 시작/i)).not.toBeInTheDocument();
  });
});
