"use client";

import { useEffect, useRef } from "react";
import { playSfx } from "@/lib/audio/sfx";

type LevelUpOverlayProps = {
  newLevel: number;
  onClose: () => void;
};

export function LevelUpOverlay({ newLevel, onClose }: LevelUpOverlayProps) {
  const closedRef = useRef(false);

  useEffect(() => {
    playSfx("level-up");
    const timer = setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  function handleClose() {
    if (!closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      data-testid="level-up-overlay"
      onClick={handleClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClose();
      }}
    >
      {/* Gold expanding circle */}
      <div className="pointer-events-none absolute h-64 w-64 rounded-full border-4 border-amber-400/60 animate-level-up" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <p
          className="text-3xl font-black text-amber-300 animate-scale-bounce sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Level Up!
        </p>
        <p
          className="text-8xl font-black text-amber-100"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: "0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)"
          }}
        >
          {newLevel}
        </p>
      </div>
    </div>
  );
}
