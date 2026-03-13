"use client";

import Link from "next/link";
import { TodayStage } from "@/components/today/today-stage";

export default function TodayPreviewPage() {
  return (
    <div className="relative">
      <TodayStage
        childId="daon"
        dayId="day-003"
        dayKind="learning"
        dayTitle="Day 03"
        stage="not_started"
        allDays={[
          { id: "day-001", title: "Day 01", completed: true, isCheckpoint: false },
          { id: "day-002", title: "Day 02", completed: true, isCheckpoint: false },
          { id: "day-003", title: "Day 03", completed: false, isCheckpoint: false },
          { id: "day-004", title: "Day 04", completed: false, isCheckpoint: false },
          { id: "day-005", title: "Day 05 Test", completed: false, isCheckpoint: true },
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
