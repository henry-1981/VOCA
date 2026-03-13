"use client";

import Link from "next/link";
import { MainHub } from "@/components/hub/main-hub";

export default function HubPreviewPage() {
  return (
    <div className="relative h-[100dvh] w-[100dvw]">
      <MainHub
        childId="다온"
        currentDayId="day-005"
        childName="다온"
        level={7}
        streak={12}
        currentDayTitle="Day 05 Test"
        previewMode
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
