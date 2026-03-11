import { describe, expect, it } from "vitest";
import { buildChildHref } from "./child-href";

describe("buildChildHref", () => {
  it("includes child and custom params in the href", () => {
    expect(
      buildChildHref({
        pathname: "/today",
        childId: "다온",
        params: { day: "day-005" }
      })
    ).toBe("/today?child=%EB%8B%A4%EC%98%A8&day=day-005");
  });
});
