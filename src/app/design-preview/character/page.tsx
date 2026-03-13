import Link from "next/link";
import { CharacterScreen } from "@/components/character/character-screen";

export default function CharacterPreviewPage() {
  return (
    <div className="relative">
      <CharacterScreen
        childName="다온"
        level={7}
        xp={340}
        xpGoal={500}
        streak={12}
        currentDayTitle="Day 05 Test"
      />
      <Link
        href="/design-preview"
        className="fixed bottom-3 left-3 z-50 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-black/80"
      >
        &larr; Back to previews
      </Link>
    </div>
  );
}
