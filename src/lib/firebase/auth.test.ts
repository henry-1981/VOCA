import { describe, expect, it, vi, beforeEach } from "vitest";

const mockSignInAnonymously = vi.fn();
const mockAuth = { currentUser: null as { uid: string } | null };

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInAnonymously: (...args: unknown[]) => mockSignInAnonymously(...args),
  signOut: vi.fn()
}));

vi.mock("./client", () => ({
  getFirebaseAuth: () => mockAuth
}));

import { ensureAnonymousAuth } from "./auth";

describe("ensureAnonymousAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.currentUser = null;
  });

  it("returns currentUser immediately when already signed in", async () => {
    const fakeUser = { uid: "existing-user-123" };
    mockAuth.currentUser = fakeUser;

    const user = await ensureAnonymousAuth();
    expect(user).toBe(fakeUser);
    expect(mockSignInAnonymously).not.toHaveBeenCalled();
  });

  it("calls signInAnonymously when no currentUser", async () => {
    const fakeUser = { uid: "anon-user-456" };
    mockSignInAnonymously.mockResolvedValue({ user: fakeUser });

    const user = await ensureAnonymousAuth();
    expect(user).toBe(fakeUser);
    expect(mockSignInAnonymously).toHaveBeenCalledOnce();
  });

  it("propagates errors from signInAnonymously", async () => {
    mockSignInAnonymously.mockRejectedValue(new Error("auth/network-error"));

    await expect(ensureAnonymousAuth()).rejects.toThrow("auth/network-error");
  });
});
