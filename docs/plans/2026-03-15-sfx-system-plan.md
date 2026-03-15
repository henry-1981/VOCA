# SFX 효과음 시스템 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 8종 효과음을 마법 아카데미 테마에 맞게 추가하여 학습 인터랙션 피드백 강화

**Architecture:** `src/lib/audio/sfx.ts` 코어 모듈이 `public/audio/sfx/*.mp3` 에셋을 HTMLAudio로 재생. 각 컴포넌트에서 `playSfx(id)` 한 줄 호출로 연동. iOS Safari unlock 처리 포함.

**Tech Stack:** HTMLAudioElement, localStorage, MP3

**Design Doc:** `docs/plans/2026-03-15-sfx-system-design.md`

---

### Task 1: SFX 에셋 다운로드 및 배치

**Files:**
- Create: `public/audio/sfx/correct.mp3`
- Create: `public/audio/sfx/wrong.mp3`
- Create: `public/audio/sfx/day-complete.mp3`
- Create: `public/audio/sfx/level-up.mp3`
- Create: `public/audio/sfx/card-flip.mp3`
- Create: `public/audio/sfx/tap.mp3`
- Create: `public/audio/sfx/streak.mp3`
- Create: `public/audio/sfx/profile-switch.mp3`

**Step 1: 디렉토리 생성**

```bash
mkdir -p public/audio/sfx
```

**Step 2: 에셋 다운로드**

freesound.org / Pixabay에서 CC0/로열티프리 효과음을 다운로드.
검색 키워드 가이드:

| ID | 검색 키워드 | 조건 |
|---|------------|------|
| `correct` | "magic chime", "correct answer chime" | 0.3-0.5초, 밝은 톤 |
| `wrong` | "soft error", "gentle wrong buzz" | 0.3-0.5초, 부드러운 톤 |
| `day-complete` | "achievement fanfare", "level complete" | 1-2초, 축하 느낌 |
| `level-up` | "magic level up", "sparkle fanfare" | 1-2초, 마법+성취 |
| `card-flip` | "page turn", "card flip" | 0.2초, 가벼운 |
| `tap` | "ui click", "soft tap" | 0.1초, 미니멀 |
| `streak` | "reward chime", "coin collect" | 0.5초, 보상 느낌 |
| `profile-switch` | "whoosh", "swoosh transition" | 0.3초, 전환 느낌 |

**Step 3: ffmpeg로 정규화 (필요 시)**

```bash
# 볼륨 정규화 + 트림 예시
ffmpeg -i raw.mp3 -af "loudnorm=I=-16:TP=-1.5,atrim=0:0.5,afade=out:st=0.3:d=0.2" -ar 44100 -ab 128k public/audio/sfx/correct.mp3
```

**Step 4: 파일 크기 확인**

```bash
ls -lh public/audio/sfx/
# 각 파일 10-50KB 범위 확인
```

**Step 5: Commit**

```bash
git add public/audio/sfx/
git commit -m "asset: SFX 효과음 8종 추가 (CC0)"
```

---

### Task 2: SFX 코어 모듈 — 테스트 작성

**Files:**
- Create: `src/lib/audio/sfx.test.ts`

**Step 1: 테스트 작성**

```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock HTMLAudioElement
const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockCloneNode = vi.fn();

vi.stubGlobal("Audio", vi.fn().mockImplementation(() => ({
  play: mockPlay,
  cloneNode: mockCloneNode.mockReturnThis(),
  volume: 1,
  currentTime: 0
})));

// Mock localStorage
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
    expect(mockPlay).not.toHaveBeenCalled();
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
    playSfx("nonexistent" as any);
    expect(mockPlay).not.toHaveBeenCalled();
  });
});
```

**Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/lib/audio/sfx.test.ts
# Expected: FAIL — module ./sfx not found
```

---

### Task 3: SFX 코어 모듈 — 구현

**Files:**
- Create: `src/lib/audio/sfx.ts`

**Step 1: 구현**

```typescript
export const SFX_IDS = [
  "correct",
  "wrong",
  "day-complete",
  "level-up",
  "card-flip",
  "tap",
  "streak",
  "profile-switch"
] as const;

export type SfxId = (typeof SFX_IDS)[number];

const STORAGE_KEY = "sfx-enabled";
const audioCache = new Map<SfxId, HTMLAudioElement>();

export function preloadSfx() {
  if (typeof window === "undefined") return;

  for (const id of SFX_IDS) {
    if (!audioCache.has(id)) {
      audioCache.set(id, new Audio(`/audio/sfx/${id}.mp3`));
    }
  }
}

export function playSfx(id: SfxId) {
  if (!isSfxEnabled()) return;

  const source = audioCache.get(id);
  if (!source) return;

  const clone = source.cloneNode() as HTMLAudioElement;
  clone.volume = 1;
  void clone.play().catch(() => {});
}

export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setSfxEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

// iOS Safari requires user gesture to unlock audio.
// Call this on first user interaction.
export function unlockAudioContext() {
  const silent = new Audio();
  void silent.play().catch(() => {});
}
```

**Step 2: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/lib/audio/sfx.test.ts
# Expected: PASS
```

**Step 3: Commit**

```bash
git add src/lib/audio/sfx.ts src/lib/audio/sfx.test.ts
git commit -m "feat(audio): SFX 코어 모듈 + 테스트"
```

---

### Task 4: iOS Audio Unlock + 앱 시작 시 Preload

**Files:**
- Modify: `src/components/bootstrap/bootstrap-landing.tsx`

**Step 1: preload + unlock 연동**

bootstrap-landing.tsx 상단에 import 추가:

```typescript
import { preloadSfx, unlockAudioContext } from "@/lib/audio/sfx";
```

BootstrapLanding 컴포넌트의 useEffect (앱 시작) 내부에 추가:

```typescript
useEffect(() => {
  preloadSfx();

  const handleFirstInteraction = () => {
    unlockAudioContext();
    window.removeEventListener("touchstart", handleFirstInteraction);
    window.removeEventListener("click", handleFirstInteraction);
  };
  window.addEventListener("touchstart", handleFirstInteraction, { once: true });
  window.addEventListener("click", handleFirstInteraction, { once: true });

  // ... 기존 bootstrap 로직
}, []);
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/bootstrap/bootstrap-landing.tsx
git commit -m "feat(audio): 앱 시작 시 SFX preload + iOS unlock"
```

---

### Task 5: Test 화면 — 정답/오답 효과음

**Files:**
- Modify: `src/components/test/learning-test-screen.tsx:126`

**Step 1: import 추가**

```typescript
import { playSfx } from "@/lib/audio/sfx";
```

**Step 2: choose() 함수 내 연동**

line 126 `const isCorrect = ...` 바로 아래:

```typescript
playSfx(isCorrect ? "correct" : "wrong");
```

**Step 3: 빌드 + 기존 테스트 확인**

```bash
npx tsc --noEmit && npx vitest run src/components/test/
```

**Step 4: Commit**

```bash
git add src/components/test/learning-test-screen.tsx
git commit -m "feat(audio): Test 정답/오답 효과음"
```

---

### Task 6: Learn 화면 — 카드 넘김 효과음

**Files:**
- Modify: `src/components/learn/learn-card.tsx:176-188`

**Step 1: import 추가**

```typescript
import { playSfx } from "@/lib/audio/sfx";
```

**Step 2: "다음 단어" Link에 onClick 추가**

Link 컴포넌트에 onClick 핸들러 추가:

```typescript
<Link
  className="big-button bg-slate-950 text-white"
  href={buildChildHref({ ... })}
  onClick={() => playSfx("card-flip")}
>
  다음 단어 · {remainingCount}개 남음
</Link>
```

**Step 3: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/learn/learn-card.tsx
git commit -m "feat(audio): Learn 카드 넘김 효과음"
```

---

### Task 7: Day 완료 + 레벨업 효과음

**Files:**
- Modify: `src/components/effects/day-complete-celebration.tsx:20`
- Modify: `src/components/effects/level-up-overlay.tsx:13`

**Step 1: 두 파일 모두 import 추가**

```typescript
import { playSfx } from "@/lib/audio/sfx";
```

**Step 2: day-complete-celebration.tsx — useEffect 내부에 추가**

기존 useEffect 시작 부분 (line 20) 바로 아래:

```typescript
useEffect(() => {
  playSfx("day-complete");  // ← 추가
  const timer = setTimeout(() => { ... }, 3000);
  ...
}, [onClose]);
```

**Step 3: level-up-overlay.tsx — useEffect 내부에 추가**

기존 useEffect 시작 부분 (line 13) 바로 아래:

```typescript
useEffect(() => {
  playSfx("level-up");  // ← 추가
  const timer = setTimeout(() => { ... }, 3000);
  ...
}, [onClose]);
```

**Step 4: 빌드 + 테스트 확인**

```bash
npx tsc --noEmit && npx vitest run src/components/effects/
```

**Step 5: Commit**

```bash
git add src/components/effects/
git commit -m "feat(audio): Day 완료 + 레벨업 효과음"
```

---

### Task 8: Hub — 스트릭/프로필 전환 효과음

**Files:**
- Modify: `src/components/hub/main-hub.tsx:196-226`

**Step 1: import 추가**

```typescript
import { playSfx } from "@/lib/audio/sfx";
```

**Step 2: 스트릭 토스트 — useEffect에서 재생**

기존 streak toast useEffect 내부에 추가:

```typescript
useEffect(() => {
  if (streak > 0) {
    setShowStreakToast(true);
    playSfx("streak");  // ← 추가
    const timer = setTimeout(() => setShowStreakToast(false), 2500);
    return () => clearTimeout(timer);
  }
}, [streak]);
```

**Step 3: 프로필 전환 — onSwitch 핸들러에 추가**

ProfileSwitcher의 onSwitch 콜백 (line 197) 내부에 추가:

```typescript
onSwitch={() => {
  playSfx("profile-switch");  // ← 추가
  const binding = loadDeviceBinding();
  if (!binding) return;
  ...
}}
```

**Step 4: 빌드 + 테스트 확인**

```bash
npx tsc --noEmit && npx vitest run src/components/hub/
```

**Step 5: Commit**

```bash
git add src/components/hub/main-hub.tsx
git commit -m "feat(audio): Hub 스트릭/프로필 전환 효과음"
```

---

### Task 9: 음소거 토글 — Hub + Lab

**Files:**
- Modify: `src/components/hub/main-hub.tsx`
- Modify: `src/components/lab/test-lab-panel.tsx`

**Step 1: Hub에 음소거 버튼 추가**

main-hub.tsx 상단 import에 추가:

```typescript
import { isSfxEnabled, setSfxEnabled, playSfx } from "@/lib/audio/sfx";
```

컴포넌트 내부에 state 추가:

```typescript
const [sfxOn, setSfxOn] = useState(() =>
  typeof window !== "undefined" ? isSfxEnabled() : true
);
```

Hub 상단 영역 (프로필 근처)에 아이콘 버튼 추가:

```typescript
<button
  type="button"
  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/70 transition hover:bg-white/18"
  onClick={() => {
    const next = !sfxOn;
    setSfxOn(next);
    setSfxEnabled(next);
    if (next) playSfx("tap");
  }}
>
  {sfxOn ? "🔊" : "🔇"}
</button>
```

**Step 2: Lab 패널에 토글 추가**

test-lab-panel.tsx import에 추가:

```typescript
import { isSfxEnabled, setSfxEnabled } from "@/lib/audio/sfx";
```

Current auth 섹션 근처에 SFX 토글 추가:

```typescript
<button
  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
  onClick={() => {
    const next = !isSfxEnabled();
    setSfxEnabled(next);
  }}
  type="button"
>
  SFX {isSfxEnabled() ? "ON" : "OFF"}
</button>
```

**Step 3: 빌드 + 전체 테스트**

```bash
npx tsc --noEmit && npx vitest run
```

**Step 4: Commit**

```bash
git add src/components/hub/main-hub.tsx src/components/lab/test-lab-panel.tsx
git commit -m "feat(audio): 음소거 토글 (Hub + Lab)"
```

---

### Task 10: 최종 검증 + 배포

**Step 1: 전체 CI 검증**

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

**Step 2: Commit (필요 시)**

**Step 3: Push + Deploy**

```bash
git push origin main
vercel --prod
```

**Step 4: iPad PWA 수동 검증**

1. Hub 진입 → 스트릭 효과음 재생
2. Today → Learn → 카드 넘김 소리
3. Test → 정답/오답 소리
4. Day 완료 → 팡파레
5. 레벨업 시 → 마법 효과음
6. 프로필 전환 → 전환 소리
7. 음소거 토글 → 모든 소리 OFF 확인
8. 앱 종료 후 재시작 → 음소거 설정 유지 확인
