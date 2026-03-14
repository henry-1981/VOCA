# BrideVOCA - CLAUDE.md

## Project Overview

2명의 아이(다온, 지온)가 각자의 iPad에서 사용하는 가족 영어 단어 학습 앱.
마법 아카데미 테마의 Day 기반 학습 루프: Learn → Test → Review → Character 성장.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Testing**: Vitest + Testing Library + Playwright
- **Deploy**: PWA (iPad 홈 화면 설치)

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint (--max-warnings=0)
npm run typecheck    # tsc --noEmit
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
```

## Architecture

### App Routes (`src/app/`)

| Route | Purpose |
|---|---|
| `/` | Bootstrap → 디바이스 바인딩 확인 → Hub |
| `/today` | 오늘의 Day (Learn → Test 스테이지) |
| `/today/learn` | 단어 학습 (20 cards) |
| `/test` | 테스트 (4지선다, EN↔KO 혼합) |
| `/review` | 복습 landing |
| `/review/session` | 복습 세션 (누적 오답 기반) |
| `/history` | Day 기록 목록 |
| `/history/[dayId]` | Day 상세 (틀린 단어 등) |
| `/character` | 캐릭터 성장 (XP/Level/Streak) |
| `/provision` | 가족 프로비저닝 (1회성 설정) |
| `/lab` | 개발용 도구 |
| `/design-preview/hub` | 디자인 프리뷰 |

### Library Modules (`src/lib/`)

| Module | Responsibility |
|---|---|
| `types/` | Domain types, Firestore types |
| `firebase/` | Auth, provisioning, Firestore converters |
| `device/` | 디바이스 바인딩 (iPad↔Child) |
| `bootstrap/` | 앱 컨텍스트 로딩 |
| `content/` | Day schema, content loading |
| `sync/` | Firestore writeback |
| `data/` | Repositories, mappers |
| `test/` | 테스트 문제 생성 |
| `review/` | 복습 배치 선택 |
| `character/` | XP/Level 보상 계산 |
| `audio/` | TTS 발음 재생 |
| `navigation/` | childId 기반 라우팅 유틸 |

### Content (`src/content/books/bridge-voca-basic/`)

- Day 1-20 (JSON seed files)
- Learning Days: 1-4, 6-9, 11-14, 16-19 (각 20단어)
- Checkpoint Test Days: 5, 10, 15, 20

### Firestore Schema

```
families/{familyId}
  devices/{deviceId}        — iPad-to-child binding
  children/{childId}
    progress/current        — XP, Level, Streak snapshot
    history/{sessionId}     — 완료된 세션 기록
    reviewQueue/{itemId}    — 누적 오답
    dayProgress/{dayId}     — Day별 진행 상태

content/books/{bookId}
  days/{dayId}              — 공유 콘텐츠
```

## Design System

- **Theme**: 마법 아카데미 (mysterious fantasy school)
- **Base palette**: navy + purple
- **Accent palette**: gold + starlight
- **UI style**: rounded, soft, storybook-like
- **iPad landscape only** (PWA standalone mode)

### Screen Worlds

| Screen | Location | Tone | Background Images |
|---|---|---|---|
| Hub | 아카데미 외부 (정문+탑) | 게임 로비 | `hub-academy-*.png` |
| Today | 개인 연습실 | 학습 집중 | `today-practice-*.png` |
| Learn | 연습실 내부 | 차분한 학습 | Today와 동일 이미지 재사용 |
| Test | 연습실 내부 | 도전적 | 배경 이미지 없음 (다크 그라데이션) |
| Review | 달빛 복습실 | 차분한 회복 (moonlit/silver) | `review-moonlit-*.png` |
| History | 도서관/기록 보관실 | 조용한 종이/책 느낌 | `history-library-*.png` |
| Character | 비밀 마법 연구실 | 성취감/보상 | `character-lab-*.png` |

- 공통 다크 디자인 언어: `<Image fill>` 배경 + 다크 오버레이 + glassmorphism 카드 (`backdrop-blur-sm`)
- 프로필별 테마: 다온(amber/warm), 지온(sky/cool) — 각 컴포넌트 내 `*_THEMES` 맵
- 배경 이미지 경로: `public/backgrounds/` (Vertex AI Imagen 3 생성)

## Key Design Documents (SSOT)

- `docs/plans/2026-03-13-v0.2-stabilize-deploy-spec.md` — v0.2 Spec (40개 항목)
- `docs/plans/2026-03-13-v0.2-stabilize-deploy-design.md` — v0.2 Design
- `docs/plans/2026-03-13-v0.2-stabilize-deploy-plan.md` — v0.2 Plan (작성 예정)
- `docs/plans/2026-03-14-sub-screens-dark-redesign-design.md` — 서브 화면 다크 리디자인 Design
- `docs/plans/2026-03-14-today-dark-redesign-plan.md` — Today 다크 리디자인 Plan
- `docs/plans/archive/` — v0.1 시절 문서 (레거시 참조용)

## Current Status

- **Branch**: `main`
- **Phase**: v0.2 폴리시 + 다크 리디자인
- 전체 화면 다크 디자인 통일 완료 (Hub, Today, Learn, Test, Review, History, Character)
- 프로필별(다온/지온) 배경 이미지 10장 생성 완료
- Days 1-20 콘텐츠 + 오디오 에셋 완료
- 배포: Vercel (https://bridevoca.vercel.app)
- **남은 작업**: Day History Detail, Provision 화면 다크 테마 미적용

## Development Rules

- Firestore = source of truth (local storage는 캐시/바인딩 용도)
- Day 완료 = Learn + Test 완료 (점수 threshold 없음)
- Checkpoint test Day (5, 10, 15, 20)는 Learn 스킵 → 바로 Test
- 모든 영단어에 TTS 발음 재생 지원
- Test: 4지선다, EN→KO / KO→EN 혼합
- Review: 누적 오답 기반, ~10문항 배치
- Hub 상단 프로필 전환: 다온↔지온 (v0.2 추가)
- UI 변경 시 해당 테스트도 같은 커밋에서 갱신
- 게이미피케이션 이펙트 300-700ms, Review는 최소 이펙트
- UI/UX 이미지: Gemini (GCloud)로 생성

## Git Conventions

- origin: `https://github.com/henry-1981/VOCA`
- main 직접 push 금지 → PR 기반 머지
- 기능별 브랜치: `feat/`, `fix/`, `chore/`
- 원자적 커밋: 한 커밋 = 한 논리적 변경
- 워크트리: `.worktrees/`에서 독립 작업 병렬 수행

## Legacy Notes

- `.codex/`, `.agents/`, `.omx/`, `AGENTS.md` — Codex CLI용 설정 (Claude Code에서는 사용하지 않음)
- 이전 설계 문서: `docs/plans/archive/`
