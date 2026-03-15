import { describe, expect, it, vi, beforeEach } from "vitest";

const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockCloneNode = vi.fn();

vi.stubGlobal("Audio", vi.fn().mockImplementation(() => ({
  play: mockPlay,
  cloneNode: mockCloneNode.mockReturnValue({ play: mockPlay, volume: 1 }),
  volume: 1,
  currentTime: 0
})));

const store: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; }
});

import { playSfx, setSfxEnabled, isSfxEnabled, preloadSfx, SFX_IDS } from "./sfx";

describe("sfx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete store["sfx-enabled"];
  });

  it("SFX_IDS contains all 8 sound effect IDs", () => {
    expect(SFX_IDS).toHaveLength(8);
    expect(SFX_IDS).toContain("correct");
    expect(SFX_IDS).toContain("wrong");
  });

  it("playSfx clones and plays audio", () => {
    preloadSfx();
    playSfx("correct");
    expect(mockCloneNode).toHaveBeenCalled();
    expect(mockPlay).toHaveBeenCalled();
  });

  it("playSfx does nothing when disabled", () => {
    preloadSfx();
    setSfxEnabled(false);
    playSfx("correct");
    expect(mockCloneNode).not.toHaveBeenCalled();
  });

  it("isSfxEnabled returns true by default", () => {
    expect(isSfxEnabled()).toBe(true);
  });

  it("setSfxEnabled persists to localStorage", () => {
    setSfxEnabled(false);
    expect(isSfxEnabled()).toBe(false);
    expect(store["sfx-enabled"]).toBe("false");
  });

  it("playSfx ignores unknown IDs silently", () => {
    preloadSfx();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playSfx("nonexistent" as any);
    expect(mockCloneNode).not.toHaveBeenCalled();
  });
});
