import Link from "next/link";
import { HistoryScreen } from "@/components/history/history-screen";

export default function HistoryPreviewPage() {
  return (
    <div className="relative">
      <HistoryScreen
        childId="daon"
        childName="다온"
        entries={[
          { dayId: "day-001", title: "Day 01", date: "2026-03-10", score: 18, total: 20, wrongWordCount: 2, wrongWords: ["brave", "giant"] },
          { dayId: "day-002", title: "Day 02", date: "2026-03-11", score: 16, total: 20, wrongWordCount: 4, wrongWords: ["eager", "calm", "tiny", "proud"] },
          { dayId: "day-003", title: "Day 03", date: "2026-03-12", score: 20, total: 20, wrongWordCount: 0, wrongWords: [] },
          { dayId: "day-004", title: "Day 04", date: "2026-03-13", score: 14, total: 20, wrongWordCount: 6, wrongWords: ["gentle", "swift", "bright", "clever", "humble", "fierce"] },
          { dayId: "day-005", title: "Day 05 Test", date: "2026-03-13", score: 72, total: 80, wrongWordCount: 8, wrongWords: ["brave", "giant", "eager", "calm", "tiny", "proud", "gentle", "swift"] },
        ]}
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
