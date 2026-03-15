"use client";

import { useEffect } from "react";
import { playBgm, stopBgm } from "@/lib/audio/bgm";
import type { BgmId } from "@/lib/audio/bgm";

export function BgmTrigger({ trackId }: { trackId: BgmId }) {
  useEffect(() => {
    playBgm(trackId);
    return () => stopBgm();
  }, [trackId]);

  return null;
}
