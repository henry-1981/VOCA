import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MainHub } from "./main-hub";

describe("MainHub", () => {
  it("shows Today as the primary action with character/history/review entries", () => {
    render(
      <MainHub
        childId="다온"
        currentDayId="day-005"
        childName="다온"
        level={7}
        streak={12}
        currentDayTitle="Day 05 Test"
        previewMode={false}
      />
    );

    expect(screen.getByRole("heading", { name: "다온" })).toBeInTheDocument();
    expect(screen.getByText(/today/i)).toBeInTheDocument();
    expect(screen.getByText(/character/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
    expect(screen.getByText(/review/i)).toBeInTheDocument();
    expect(screen.getByText(/Day 05 Test/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /today/i })).toHaveAttribute(
      "href",
      "/today?child=%EB%8B%A4%EC%98%A8&day=day-005"
    );
  });
});
