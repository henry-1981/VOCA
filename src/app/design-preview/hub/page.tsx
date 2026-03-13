"use client";

import { useState } from "react";
import { MainHubScene } from "@/components/hub/main-hub-scene";
import { MainHubSceneBg } from "@/components/hub/main-hub-scene-bg";

const commonProps = {
  childId: "daon",
  currentDayId: "day-005",
  childName: "다온",
  level: 7,
  streak: 12,
  currentDayTitle: "Day 05 Test",
  previewMode: true,
  avatarSrc: "/avatars/daon.png",
} as const;

export default function HubPreviewPage() {
  const [variant, setVariant] = useState<"css" | "bg">("css");

  return (
    <div className="relative">
      {variant === "css" ? (
        <MainHubScene {...commonProps} />
      ) : (
        <MainHubSceneBg
          {...commonProps}
          backgroundSrc="/backgrounds/academy-gate.png"
        />
      )}

      {/* Toggle button (dev only) */}
      <div className="fixed bottom-3 right-3 z-50 flex gap-1 rounded-lg border border-white/20 bg-black/60 p-1 text-[10px] font-bold text-white backdrop-blur-sm">
        <button
          className={`rounded px-2 py-1 transition ${variant === "css" ? "bg-white/20" : "opacity-50"}`}
          onClick={() => setVariant("css")}
        >
          CSS
        </button>
        <button
          className={`rounded px-2 py-1 transition ${variant === "bg" ? "bg-white/20" : "opacity-50"}`}
          onClick={() => setVariant("bg")}
        >
          BG Image
        </button>
      </div>
    </div>
  );
}
