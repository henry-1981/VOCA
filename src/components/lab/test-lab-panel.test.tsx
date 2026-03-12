import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/client", () => ({
  hasFirebaseEnv: () => false,
  getMissingFirebaseEnvKeys: () => ["NEXT_PUBLIC_FIREBASE_API_KEY"]
}));

vi.mock("@/lib/firebase/auth", () => ({
  signInWithGoogleRedirect: vi.fn(),
  signOutFirebaseUser: vi.fn(),
  watchFirebaseUser: (callback: (user: null) => void) => {
    callback(null);
    return () => {};
  }
}));

vi.mock("@/lib/device/device-binding", () => ({
  getOrCreateDeviceId: () => "device-a",
  loadDeviceBinding: () => null,
  clearDeviceBinding: vi.fn(),
  saveDeviceBinding: vi.fn()
}));

import { TestLabPanel } from "./test-lab-panel";

describe("TestLabPanel", () => {
  it("shows firebase readiness and local device status", () => {
    render(<TestLabPanel />);

    expect(screen.getByText(/Firebase 테스트 환경/i)).toBeInTheDocument();
    expect(screen.getByText(/device-a/i)).toBeInTheDocument();
    expect(screen.getByText(/NEXT_PUBLIC_FIREBASE_API_KEY/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다온 바인딩/i })).toBeInTheDocument();
  });
});
