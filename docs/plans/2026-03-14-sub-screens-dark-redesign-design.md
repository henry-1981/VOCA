# Sub-Screens Dark Redesign Design

## Goal

History, Review, Character 서브 화면을 Hub와 동일한 다크 디자인 언어로 통일.
프로필별(다온/지온) 배경 이미지 적용, 글래스모피즘 카드, iPad landscape 최적화.

## Target Files

| Action | File |
|---|---|
| **Rewrite** | `src/components/history/history-screen.tsx` |
| **Rewrite** | `src/components/review/review-screen.tsx` |
| **Rewrite** | `src/components/character/character-screen.tsx` |
| **Generate** | 6× background images (3 screens × 2 profiles) |

## Common Design Language (from Hub)

```
[1] <Image> background (fill, object-cover, priority)
[2] Dark gradient overlay (screen-specific tone)
[3] Top/bottom readability gradients
[4] Glassmorphism cards (backdrop-blur + border-{color}/XX + bg-{color}/XX)
[5] h-[100dvh] fixed viewport, overflow-hidden
[6] White/translucent text hierarchy
```

## Background Images (6 total)

### History — 마법 도서관 (Library / Record Archive)

| Profile | File | Imagen Prompt |
|---|---|---|
| 다온 | `history-library-warm.png` | "Interior of a warm magical fantasy library with tall dark wooden bookshelves, golden candlelight, ancient scrolls and leather-bound books, cozy amber lighting, digital art, game background, landscape 1180x820" |
| 지온 | `history-library-cool.png` | "Interior of a cool-toned magical fantasy library with tall oak bookshelves, soft blue-tinted lantern light, ancient scrolls and crystal bookends, serene atmosphere, digital art, game background, landscape 1180x820" |

### Review — 달빛 복습실 (Moonlit Review Room)

| Profile | File | Imagen Prompt |
|---|---|---|
| 다온 | `review-moonlit-warm.png` | "Moonlit quiet study room in a magic academy, warm golden moonlight through arched windows, candles on desk, calm serene atmosphere, amber-gold tones, digital art, game background, landscape 1180x820" |
| 지온 | `review-moonlit-cool.png` | "Moonlit quiet study room in a magic academy, cool silver moonlight streaming through arched windows, crystal orbs softly glowing, calm serene blue-silver atmosphere, digital art, game background, landscape 1180x820" |

### Character — 비밀 마법 연구실 (Secret Magic Lab)

| Profile | File | Imagen Prompt |
|---|---|---|
| 다온 | `character-lab-warm.png` | "Secret magical laboratory in fantasy academy, warm amber arcane circles glowing on floor, golden potions and crystals, mysterious warm purple-gold ambient lighting, digital art, game background, landscape 1180x820" |
| 지온 | `character-lab-cool.png` | "Secret magical laboratory in fantasy academy, cool blue-violet arcane circles glowing on floor, ice-blue crystals and silver potions, mysterious cool blue-purple ambient lighting, digital art, game background, landscape 1180x820" |

## Profile Theme Extension

```typescript
// Extend existing ProfileTheme pattern from main-hub.tsx
// Each screen component defines its own theme map

// History
const HISTORY_THEMES: Record<string, { backgroundSrc: string; accent colors... }> = {
  "다온": { backgroundSrc: "/backgrounds/history-library-warm.png", /* amber accents */ },
  "지온": { backgroundSrc: "/backgrounds/history-library-cool.png", /* sky accents */ },
};

// Review
const REVIEW_THEMES: Record<string, { backgroundSrc: string; accent colors... }> = {
  "다온": { backgroundSrc: "/backgrounds/review-moonlit-warm.png", /* amber-silver */ },
  "지온": { backgroundSrc: "/backgrounds/review-moonlit-cool.png", /* sky-silver */ },
};

// Character
const CHARACTER_THEMES: Record<string, { backgroundSrc: string; accent colors... }> = {
  "다온": { backgroundSrc: "/backgrounds/character-lab-warm.png", /* amber-violet */ },
  "지온": { backgroundSrc: "/backgrounds/character-lab-cool.png", /* sky-violet */ },
};
```

## Screen-Specific Overlay & Cards

### History (도서관/기록 보관실)
- **Overlay**: warm sepia `rgba(40,28,12,0.65)`
- **Cards**: `border-amber-300/20 bg-amber-950/40 backdrop-blur-sm`
- **Text**: `text-amber-50` (titles), `text-amber-200/70` (labels)
- **Entry cards**: scrollable inner area if entries overflow
- **Tone**: 조용한 종이/책 느낌, 이펙트 없음

### Review (달빛 복습실)
- **Overlay**: cool silver `rgba(15,20,40,0.60)`
- **Cards**: `border-slate-300/20 bg-slate-800/40 backdrop-blur-sm`
- **Text**: `text-slate-50` (titles), `text-slate-300/70` (labels)
- **CTA button**: dark blue gradient with silver glow
- **Tone**: 차분한 회복, 최소 이펙트

### Character (비밀 마법 연구실)
- **Overlay**: deep violet `rgba(20,15,46,0.55)`
- **Cards**: `border-violet-300/20 bg-violet-950/40 backdrop-blur-sm`
- **Text**: `text-white` (titles), `text-violet-200/70` (labels)
- **Keep**: floating sparkle particles, magic aura, glow-pulse animations
- **Tone**: 성취감/보상, 약-중간 이펙트

## Layout Changes (All Screens)

- `min-h-screen` → `h-[100dvh] overflow-hidden`
- Light backgrounds → `<Image>` + overlay stack
- Light cards → glassmorphism cards
- Dark text → white/translucent text
- Scrollable content → inner scroll area with gradient masks

## Props Changes

### history-screen.tsx
- Add `childId` prop (already exists) — used for theme selection

### review-screen.tsx
- Add `childId` prop (already exists) — used for theme selection

### character-screen.tsx
- Already has `childName` — used for theme selection (matches Hub pattern)

## Preserved Features
- All `data-testid` attributes
- All Link destinations and navigation
- All functional logic (reward-preview, XP calc, etc.)
- buildChildHref routing
- Existing test compatibility
