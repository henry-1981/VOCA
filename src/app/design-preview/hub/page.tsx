"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainHub } from "@/components/hub/main-hub";

const PROFILES = {
  "다온": { childId: "다온", childName: "다온", level: 7, streak: 12, currentDayId: "day-005", currentDayTitle: "Day 05 Test" },
  "지온": { childId: "지온", childName: "지온", level: 4, streak: 5, currentDayId: "day-003", currentDayTitle: "Day 03" },
} as const;

function HubPreviewContent() {
  const params = useSearchParams();
  const profileKey = params.get("child") === "지온" ? "지온" : "다온";
  const profile = PROFILES[profileKey];

  return (
    <div className="relative h-[100dvh] w-[100dvw]">
      <MainHub
        childId={profile.childId}
        currentDayId={profile.currentDayId}
        childName={profile.childName}
        level={profile.level}
        streak={profile.streak}
        currentDayTitle={profile.currentDayTitle}
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

export default function HubPreviewPage() {
  return (
    <Suspense>
      <HubPreviewContent />
    </Suspense>
  );
}
