import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharacterScreen } from "./character-screen";

describe("CharacterScreen", () => {
  it("shows level, xp and streak next to a large character stage", () => {
    render(
      <CharacterScreen
        childName="다온"
        level={7}
        xp={1280}
        xpGoal={1500}
        streak={12}
        currentDayTitle="Day 05 Test"
      />
    );

    expect(screen.getAllByText(/Level 07/i)).toHaveLength(2);
    expect(screen.getByText(/연속 학습 12일/i)).toBeInTheDocument();
    expect(screen.getByText(/Day 05 Test/i)).toBeInTheDocument();
  });
});
