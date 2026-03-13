# Hub Landscape Redesign Design

## Goal

main-hub.tsx의 portrait 레이아웃을 iPad landscape(1180x820) 배경 이미지 기반으로 리디자인.
CSS 건물 실루엣 → AI 생성 배경 이미지 교체, 프로필별 시각 차별화, 시간대별 오버레이 추가.

## Target Files

| Action | File |
|---|---|
| **Rewrite** | `src/components/hub/main-hub.tsx` |
| **Delete** | `src/components/hub/main-hub-scene.tsx` |
| **Delete** | `src/components/hub/main-hub-scene-bg.tsx` |
| **Update** | `src/app/design-preview/hub/page.tsx` (scene 참조 제거) |
| **Update** | `src/components/hub/main-hub.test.tsx` (props 변경 반영) |

## Background Layer Stack

```
[1] <Image> academy-gate-landscape.png (fill, object-cover, priority)
[2] Time-of-day color overlay (mix-blend-mode: multiply)
[3] Top gradient (HUD readability)
[4] Bottom gradient (button readability)
[5] Side vignette (radial-gradient)
```

## Time-of-Day Overlay

| Period | Hours | Color | Stars |
|---|---|---|---|
| Morning | 6-12 | `rgba(255,220,160,0.15)` warm | hidden |
| Afternoon | 12-17 | `rgba(180,200,255,0.08)` neutral | hidden |
| Evening | 17-20 | `rgba(255,160,80,0.20)` orange | dim |
| Night | 20-6 | `rgba(10,8,40,0.45)` deep navy | visible, animate-pulse |

Client component with `useState` + `useEffect` for current hour.

## Layout (Landscape, Vertical Stack)

```
+---------------------------------------------+
| [Magic Academy / childName]   [Lv] [Streak] [Switch] |  HUD
|                                             |
|            +----------------+               |
|            | Today  Day 03  |               |  Today card
|            | [Learn] [Test] |               |  + dayStage badges
|            +----------------+               |
|                                             |
|  +------+    +----------+    +------+       |
|  |Review|    |  Avatar  |    |History|      |  Center row
|  +------+    +----------+    +------+       |
|                                             |
|          +---- Growth ----+                 |  Bottom
|          +-----------------+                |
+---------------------------------------------+
```

## Profile Theme (per childId)

```typescript
const PROFILE_THEMES: Record<string, ProfileTheme> = {
  "다온": {
    accent: "amber",
    avatarSrc: "/avatars/daon-nobg.png",
    todayBorder: "border-amber-300/45",
    todayGlow: "rgba(255,200,80,0.25)",
    todayBg: "from-amber-400/30 via-amber-500/20 to-amber-600/12",
    streakBadgeBorder: "border-amber-300/20",
    streakBadgeBg: "bg-amber-300/10",
    streakBadgeText: "text-amber-50",
  },
  "지온": {
    accent: "sky",
    avatarSrc: "/avatars/jion-nobg.png",
    todayBorder: "border-sky-300/45",
    todayGlow: "rgba(56,189,248,0.25)",
    todayBg: "from-sky-400/30 via-sky-500/20 to-sky-600/12",
    streakBadgeBorder: "border-sky-300/20",
    streakBadgeBg: "bg-sky-300/10",
    streakBadgeText: "text-sky-50",
  },
};
```

Fallback to 다온 theme for unknown childId.

## Avatar Rendering

- Use `*-nobg.png` (transparent background) images
- `drop-shadow` for grounding on background
- Ground shadow ellipse below avatar
- No vignette/mask needed (already transparent)
- Width: `w-[28vw] max-w-[260px]` for landscape fit

## Preserved Features

- ProfileSwitcher component (unchanged)
- Streak toast (fade after 800ms)
- dayStage badges (Learn/Test checkmarks)
- buildChildHref routing
- previewMode flag
- Level/Streak HUD badges
- All Link destinations (/today, /review, /history, /character)

## Deleted Features

- CSS sky gradient, stars, buildings, gate, ground, cobblestone, bushes, windows
- Portrait-specific layout (min-h-screen, vertical card stack)
- Duplicate scene components (main-hub-scene, main-hub-scene-bg)

## Props Change

```typescript
// Before
type MainHubProps = {
  childId: string;
  currentDayId: string;
  childName: string;
  level: number;
  streak: number;
  currentDayTitle: string;
  previewMode: boolean;
  dayStage?: "not_started" | "learn_completed" | "test_completed" | "completed";
};

// After — same, no new props needed
// avatarSrc derived from childId internally
```
