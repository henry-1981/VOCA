import { describe, expect, it } from "vitest";
import { paths } from "./firestore";

describe("firebase content paths", () => {
  it("uses a valid document path for shared day content", () => {
    expect(paths.contentDay("bridge-voca-basic", "day-011")).toBe(
      "contentBooks/bridge-voca-basic/days/day-011"
    );
  });
});
