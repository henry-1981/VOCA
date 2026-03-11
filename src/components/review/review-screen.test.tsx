import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewScreen } from "./review-screen";

describe("ReviewScreen", () => {
  it("shows a calm review screen with the current batch size", () => {
    render(
      <ReviewScreen
        childName="다온"
        batchSize={10}
        title="오늘의 복습"
      />
    );

    expect(screen.getByText("오늘의 복습")).toBeInTheDocument();
    expect(screen.getByText(/10문제/i)).toBeInTheDocument();
  });
});
