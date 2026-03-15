import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();

vi.stubGlobal("Audio", vi.fn().mockImplementation(() => ({
  play: mockPlay,
  pause: mockPause,
  volume: 1,
  currentTime: 0,
  loop: false,
})));

const store: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; }
});

import { playBgm, stopBgm, isBgmEnabled, setBgmEnabled } from "./bgm";

describe("bgm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete store["bgm-enabled"];
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("playBgm creates audio and plays", () => {
    playBgm("hub-theme");
    expect(mockPlay).toHaveBeenCalled();
  });

  it("playBgm does nothing when disabled", () => {
    setBgmEnabled(false);
    playBgm("hub-theme");
    expect(mockPlay).not.toHaveBeenCalled();
  });

  it("stopBgm fades out and pauses", () => {
    playBgm("hub-theme");
    stopBgm();
    vi.advanceTimersByTime(600);
    expect(mockPause).toHaveBeenCalled();
  });

  it("isBgmEnabled returns true by default", () => {
    expect(isBgmEnabled()).toBe(true);
  });

  it("setBgmEnabled persists to localStorage", () => {
    setBgmEnabled(false);
    expect(isBgmEnabled()).toBe(false);
    expect(store["bgm-enabled"]).toBe("false");
  });

  it("playBgm with same id does not restart", () => {
    playBgm("hub-theme");
    playBgm("hub-theme");
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });
});
