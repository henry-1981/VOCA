import { CharacterScreen } from "@/components/character/character-screen";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";

type CharacterPageProps = {
  searchParams?: Promise<{
    child?: string;
  }>;
};

export default async function CharacterPage({
  searchParams
}: CharacterPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await resolveChildDashboard(params.child);

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
