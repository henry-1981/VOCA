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
    expect(screen.getAllByText(/연속 학습 12일/i)).toHaveLength(2);
    expect(screen.getByText(/Day 05 Test/i)).toBeInTheDocument();
  });

  it("shows avatar image and level title", () => {
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

    const avatar = screen.getByAltText("다온 avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");

    // Level 7 = "Apprentice Mage"
    expect(screen.getByText("Apprentice Mage")).toBeInTheDocument();
  });

  it("shows Student Mage for low levels", () => {
    render(
      <CharacterScreen
        childName="지온"
        level={3}
        xp={100}
        xpGoal={500}
        streak={2}
        currentDayTitle="Day 03"
      />
    );

    expect(screen.getByText("Student Mage")).toBeInTheDocument();
    expect(screen.getByAltText("지온 avatar")).toBeInTheDocument();
  });
});
