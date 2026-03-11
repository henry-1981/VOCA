import { CharacterScreen } from "@/components/character/character-screen";
import { getMockChildDashboard } from "@/lib/mock/child-dashboard";

export default function CharacterPage() {
  const dashboard = getMockChildDashboard("다온");

  return (
    <CharacterScreen
      childName={dashboard.childName}
      level={dashboard.level}
      xp={dashboard.xp}
      xpGoal={dashboard.xpGoal}
      streak={dashboard.streak}
      currentDayTitle={dashboard.currentDayTitle}
    />
  );
}
