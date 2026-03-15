# BGM 배경음악 시스템 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Hub/Character 화면에 마법 아카데미 테마 BGM을 추가하고, Learn/Test 진입 시 자동 페이드아웃

**Architecture:** `src/lib/audio/bgm.ts` 코어 모듈이 `public/audio/bgm/hub-theme.mp3` 에셋을 HTMLAudio `loop`로 재생. 화면 전환 시 `playBgm()`/`stopBgm()` 호출로 페이드 전환. SFX와 독립된 localStorage 키로 음소거 관리.

**Tech Stack:** HTMLAudioElement, localStorage, MP3

**Design Doc:** `docs/plans/2026-03-15-bgm-system-design.md`

---

### Task 1: BGM 에셋 다운로드 및 배치

**Files:**
- Create: `public/audio/bgm/hub-theme.mp3`

**Step 1: 디렉토리 생성**

```bash
mkdir -p public/audio/bgm
```

**Step 2: 에셋 다운로드**

CC0 소스에서 마법/판타지 테마 루프 BGM 다운로드.
검색 키워드: "fantasy loop", "magic academy", "rpg town", "whimsical orchestral loop"
조건: 루프 가능, 30-60초, 200-500KB MP3

소스 우선순위:
1. Kenney.nl (게임용 BGM 팩)
2. OpenGameArt.org ("fantasy" 태그 BGM)
3. Pixabay Music (CC0 필터)

**Step 3: ffmpeg로 정규화 (필요 시)**

```bash
# 볼륨 정규화 + 루프 최적화
ffmpeg -i raw.mp3 -af "loudnorm=I=-16:TP=-1.5" -ar 44100 -ab 128k public/audio/bgm/hub-theme.mp3
```

**Step 4: 파일 크기 확인**

```bash
ls -lh public/audio/bgm/
# 200-500KB 범위 확인
```

**Step 5: Commit**

```bash
git add public/audio/bgm/
git commit -m "asset: BGM hub-theme 에셋 추가 (CC0)"
```

---

### Task 2: BGM 코어 모듈 — 테스트 작성

**Files:**
- Create: `src/lib/audio/bgm.test.ts`

**Step 1: 테스트 작성**

```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";

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
    // Advance through fade interval
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
    // Audio constructor called only once
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/lib/audio/bgm.test.ts
# Expected: FAIL — module ./bgm not found
```

---

### Task 3: BGM 코어 모듈 — 구현

**Files:**
- Create: `src/lib/audio/bgm.ts`

**Step 1: 구현**

```typescript
export const BGM_IDS = ["hub-theme"] as const;
export type BgmId = (typeof BGM_IDS)[number];

const STORAGE_KEY = "bgm-enabled";
const BGM_VOLUME = 0.3;
const FADE_STEP_MS = 50;
const FADE_DURATION_MS = 500;

let currentAudio: HTMLAudioElement | null = null;
let currentId: BgmId | null = null;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

export function playBgm(id: BgmId) {
  if (typeof window === "undefined") return;
  if (!isBgmEnabled()) return;
  if (currentId === id && currentAudio) return;

  stopBgmImmediate();

  const audio = new Audio(`/audio/bgm/${id}.mp3`);
  audio.loop = true;
  audio.volume = BGM_VOLUME;
  currentAudio = audio;
  currentId = id;
  void audio.play().catch(() => {});
}

export function stopBgm() {
  if (!currentAudio) return;

  const audio = currentAudio;
  const stepCount = FADE_DURATION_MS / FADE_STEP_MS;
  const volumeStep = audio.volume / stepCount;

  if (fadeInterval) clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - volumeStep);
    if (audio.volume <= 0.01) {
      audio.pause();
      audio.currentTime = 0;
      if (fadeInterval) clearInterval(fadeInterval);
      fadeInterval = null;
      currentAudio = null;
      currentId = null;
    }
  }, FADE_STEP_MS);
}

function stopBgmImmediate() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentId = null;
  }
}

export function isBgmEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setBgmEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
  if (!enabled) stopBgmImmediate();
}
```

**Step 2: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/lib/audio/bgm.test.ts
# Expected: PASS
```

**Step 3: Commit**

```bash
git add src/lib/audio/bgm.ts src/lib/audio/bgm.test.ts
git commit -m "feat(audio): BGM 코어 모듈 + 테스트"
```

---

### Task 4: Hub — BGM 재생 + 토글

**Files:**
- Modify: `src/components/hub/main-hub.tsx`

**Step 1: import 추가**

```typescript
import { playBgm, stopBgm, isBgmEnabled, setBgmEnabled } from "@/lib/audio/bgm";
```

**Step 2: useEffect에서 BGM 재생**

컴포넌트 내부, 기존 streak useEffect 위에 추가:

```typescript
useEffect(() => {
  playBgm("hub-theme");
  return () => stopBgm();
}, []);
```

**Step 3: BGM 음소거 토글 state + 버튼**

기존 `sfxOn` state 아래에 추가:

```typescript
const [bgmOn, setBgmOn] = useState(() =>
  typeof window !== "undefined" ? isBgmEnabled() : true
);
```

기존 SFX 토글 버튼 옆에 BGM 토글 추가:

```typescript
<button
  type="button"
  className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold text-white/70 backdrop-blur-sm transition hover:bg-white/18"
  onClick={() => {
    const next = !bgmOn;
    setBgmOn(next);
    setBgmEnabled(next);
    if (next) playBgm("hub-theme");
  }}
  aria-label={bgmOn ? "배경음 끄기" : "배경음 켜기"}
>
  {bgmOn ? "🎵" : "🎵✕"}
</button>
```

**Step 4: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/components/hub/main-hub.tsx
git commit -m "feat(audio): Hub BGM 재생 + 토글"
```

---

### Task 5: Character — BGM 유지

**Files:**
- Create: `src/components/character/bgm-trigger.tsx`
- Modify: `src/components/character/character-screen.tsx`

CharacterScreen은 서버 컴포넌트이므로, 클라이언트 래퍼로 BGM을 트리거한다.

**Step 1: bgm-trigger.tsx 생성**

```typescript
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
```

**Step 2: character-screen.tsx에 BgmTrigger 추가**

import 추가:

```typescript
import { BgmTrigger } from "./bgm-trigger";
```

JSX 최상단 (return 내부 첫 요소)에 추가:

```typescript
<BgmTrigger trackId="hub-theme" />
```

**Step 3: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/character/bgm-trigger.tsx src/components/character/character-screen.tsx
git commit -m "feat(audio): Character 화면 BGM 유지"
```

---

### Task 6: Learn/Test — BGM 페이드아웃

**Files:**
- Modify: `src/components/learn/learn-card.tsx`
- Modify: `src/components/test/learning-test-screen.tsx`

**Step 1: learn-card.tsx — import + useEffect 추가**

import 추가:

```typescript
import { stopBgm } from "@/lib/audio/bgm";
```

기존 `useState` 선언 아래에 useEffect 추가:

```typescript
useEffect(() => {
  stopBgm();
}, []);
```

**Step 2: learning-test-screen.tsx — import + useEffect 추가**

import 추가:

```typescript
import { stopBgm } from "@/lib/audio/bgm";
```

기존 cleanup useEffect (effectTimerRef 등) 위에 추가:

```typescript
useEffect(() => {
  stopBgm();
}, []);
```

**Step 3: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/learn/learn-card.tsx src/components/test/learning-test-screen.tsx
git commit -m "feat(audio): Learn/Test 진입 시 BGM 페이드아웃"
```

---

### Task 7: Lab 패널 — BGM 토글

**Files:**
- Modify: `src/components/lab/test-lab-panel.tsx`

**Step 1: import 추가**

```typescript
import { isBgmEnabled, setBgmEnabled } from "@/lib/audio/bgm";
```

**Step 2: SFX 토글 버튼 옆에 BGM 토글 추가**

기존 SFX 토글 버튼 바로 아래에:

```typescript
<button
  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
  onClick={() => {
    const next = !isBgmEnabled();
    setBgmEnabled(next);
    window.dispatchEvent(new Event("lab-binding-change"));
  }}
  type="button"
>
  BGM {isBgmEnabled() ? "ON" : "OFF"}
</button>
```

**Step 3: 빌드 + 전체 테스트**

```bash
npx tsc --noEmit && npx vitest run
```

**Step 4: Commit**

```bash
git add src/components/lab/test-lab-panel.tsx
git commit -m "feat(audio): Lab BGM 토글"
```

---

### Task 8: 최종 검증 + 배포

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

1. Hub 진입 → BGM 재생 확인
2. Today → Learn 진입 → BGM 페이드아웃 확인
3. Test 진입 → BGM 없음 확인
4. Hub 복귀 → BGM 재개 확인
5. Character 진입 → BGM 유지 확인
6. Hub BGM 토글 → 음소거/해제 확인
7. 앱 재시작 → 음소거 설정 유지 확인
8. SFX와 BGM 독립 토글 동작 확인
