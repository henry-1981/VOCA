import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewScreen } from "./review-screen";

describe("ReviewScreen", () => {
  it("shows a calm review screen with the current batch size", () => {
    render(
      <ReviewScreen
        childId="다온"
        childName="다온"
        batchSize={10}
        title="오늘의 복습"
      />
    );

    expect(screen.getByText("오늘의 복습")).toBeInTheDocument();
    expect(screen.getByText(/10문제/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /복습 시작/i })).toHaveAttribute(
      "href",
      "/review/session?child=%EB%8B%A4%EC%98%A8"
    );
  });
});
