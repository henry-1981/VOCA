# BrideVOCA Family App Design

**Date:** 2026-03-11

## Purpose

This document captures the validated design direction for the family version of BrideVOCA.

The product is a two-child family learning app used on two separate iPads. Each iPad is connected to one child profile and opens directly into that child's world.

This is not a commercial account-switching app. The design should feel like a personal animated learning adventure with a strong game-like presentation.

## Design Direction

### Core Mood

- Game-like overall feel
- Animated and lively presentation
- Learning-comic energy
- Mysterious fantasy academy tone
- Child-friendly, but not babyish

### World

- Shared world: magical academy
- Emotional tone: mysterious, slightly secretive fantasy school
- Visual framing: the children are protagonists inside one common world
- Daon and Jion use the same world, but their character expression and visual emphasis can differ

### Visual Language

- Base palette: navy and purple
- Accent palette: gold and starlight tones
- Text/buttons: rounded, soft, storybook-like UI
- Motion style: lively and game-like, not calm-only
- Ambient magic effects should stay restrained:
  - small sparkles
  - soft glow
  - light floating elements

## Screen Worlds

### Main Hub

- Location: academy exterior
- Composition: front-facing academy gate and central tower
- Background changes with current time of day
- Main role: entry hub

### Today

- Location: personal practice room
- Main role: today's learning loop
- Tone shifts slightly between Learn and Test while keeping the same room

### Character

- Location: small secret magic study/lab
- Main role: character growth and achievement

### History

- Location: library / record archive room
- Main role: recent Day history and detail lookup
- Tone: quiet, paper-and-book feeling

### Review

- Location: calm review room
- Main role: retry accumulated mistakes in small batches
- Tone: calm recovery, not stressful exam energy
- Color feeling: moonlight / silver

## Main Hub Structure

### Layout Principles

- Avatar sits at the lower center
- `Today` is the largest and most central card
- `Review` and `History` sit above and around the avatar as smaller support cards
- `Character` sits below the avatar and feels closest to the child protagonist
- `Today` must be the clearest primary action

### Hub Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ [시간대 변화 배경: 마법학교 정문 + 중앙탑]           │
│                                                      │
│                ┌────────────────────┐                │
│                │       TODAY        │                │
│                │   오늘의 Day 시작   │                │
│                │  가장 크고 중심 카드 │                │
│                └────────────────────┘                │
│                                                      │
│      ┌──────────────┐        ┌──────────────┐        │
│      │    Review    │        │   History    │        │
│      │  누적 오답   │        │  최근 Day 기록 │        │
│      └──────────────┘        └──────────────┘        │
│                                                      │
│                     ✦   ✦                           │
│                    [ Avatar ]                       │
│                (중앙 하단 주인공 캐릭터)             │
│                     ✦   ✦                           │
│                                                      │
│                ┌────────────────────┐                │
│                │     Character      │                │
│                │   XP / Level / 성장 │                │
│                └────────────────────┘                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Today Flow Design

### Core Rule

- `Today` is a staged screen
- First focus: `Learn`
- After Learn is completed, the same screen shifts focus to `Test`

### Today First State

```text
┌──────────────────────────────────────────────────────┐
│ Today                                                │
│ Day 03 · 아직 시작 전                               │
│ [ 시작 전 ] → [ Learn ] → [ Test ] → [ 완료 ]       │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                오늘의 Day 카드               │   │
│   │ Day 03                                       │   │
│   │ 오늘 배울 단어 수 / 짧은 안내                │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                  LEARN                       │   │
│   │           오늘 단어 익히기 시작              │   │
│   │         가장 큰 1차 액션 카드                │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                   TEST                       │   │
│   │            Learn 완료 후 시작                │   │
│   │              보조 카드                       │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Today After Learn

```text
┌──────────────────────────────────────────────────────┐
│ Today                                                │
│ Day 03 · Learn 완료                                  │
│ [ 시작 전 ] → [ Learn 완료 ] → [ Test ] → [ 완료 ]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                오늘의 Day 카드               │   │
│   │ Day 03                                       │   │
│   │ Learn 완료                                   │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                   TEST                       │   │
│   │               이제 테스트 시작               │   │
│   │          가장 크고 중심이 되는 카드          │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
│   ┌──────────────────────────────────────────────┐   │
│   │                  LEARN                       │   │
│   │             완료됨 / 다시 보기               │   │
│   │                보조 카드                     │   │
│   └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Learn Design

### Principles

- One word per card
- English word must stay visually central
- Meaning must always be clear
- Audio is always available
- Replay must be a small icon-only button
- Illustration is supporting information, not the center of attention
- Use illustration only when semantic accuracy is strong

### Learn Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ Learn                                                │
│ Day 03 · 2 / 20                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │        상단 이미지 / 일러스트 / 배경 영역      │  │
│  │     (정확한 경우에만 표시, 또는 배경 연출)      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│                     APPLE                            │
│                                                      │
│                      사과                            │
│                                                      │
│                        [▶]                           │
│                                                      │
│          짧은 의미 보조 또는 예시 문장              │
│                                                      │
│   ┌────────────────────┐    ┌────────────────────┐   │
│   │      이전 단어      │    │      다음 단어      │   │
│   └────────────────────┘    └────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Test Design

### Principles

- One question per card
- English or Korean prompt sits large in the center
- Audio replay stays available
- Question variety comes from direction changes, not interaction complexity
- Mix `EN -> KO` and `KO -> EN`
- Use `4 choices`
- Feedback should be short and should not interrupt flow
- Choices use a compact `2x2` grid to preserve large prompt space

### Test Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ Test                                                 │
│ Day 03 · 4 / 20                                      │
│ 진행률 바                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    APPLE                             │
│                                                      │
│                        [▶]                           │
│                                                      │
│            알맞은 뜻을 골라보세요                    │
│                                                      │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │ 1. 사과          │  │ 2. 포도          │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                      │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │ 3. 바나나        │  │ 4. 복숭아        │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Review Design

### Principles

- Same interaction model as Test
- Different tone and room identity
- Calm review energy, not stressful assessment energy

### Review Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ Review                                               │
│ 오늘의 복습 3 / 10                                   │
│ 진행률 바                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    APPLE                             │
│                                                      │
│                        [▶]                           │
│                                                      │
│           다시 한 번 뜻을 골라보세요                 │
│                                                      │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │ 1. 사과          │  │ 2. 포도          │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                      │
│    ┌──────────────────┐  ┌──────────────────┐        │
│    │ 3. 바나나        │  │ 4. 복숭아        │        │
│    └──────────────────┘  └──────────────────┘        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## History Design

### Principles

- History should be Day-centered, not word-stat-centered
- The first view should show recent Day records in reverse chronological order
- Each Day card should summarize completion, score, and mistake count
- Day detail can lead into wrong-word detail

### History Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ History                                              │
│ 최근 Day 기록                                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Day 03                                         │  │
│  │ 2026.03.11                                     │  │
│  │ 완료 · 점수 16 / 20                            │  │
│  │ 틀린 단어 4개                                  │  │
│  │ 상세 보기 >                                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Day 02                                         │  │
│  │ 2026.03.10                                     │  │
│  │ 완료 · 점수 18 / 20                            │  │
│  │ 틀린 단어 2개                                  │  │
│  │ 상세 보기 >                                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Day 01                                         │  │
│  │ 2026.03.09                                     │  │
│  │ 완료 · 점수 14 / 20                            │  │
│  │ 틀린 단어 6개                                  │  │
│  │ 상세 보기 >                                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Character Design

### Principles

- Character must feel large and central
- This screen should create achievement, not just report status
- `Streak` is a primary motivational mechanic
- XP and Level appear in floating magic UI panels

### Character Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ Character                                            │
│ 다온의 연구실                                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    ✦     ✦                          │
│                                                      │
│                 [ LARGE CHARACTER ]                  │
│                                                      │
│                                                      │
│                    ✦     ✦                          │
│                                                      │
│   ┌──────────────────┐   ┌──────────────────────┐    │
│   │ Level 07         │   │ 연속 학습 12일       │    │
│   │ XP 1280 / 1500   │   │ 오늘 이어가기 가능   │    │
│   └──────────────────┘   └──────────────────────┘    │
│                                                      │
│          ┌────────────────────────────────┐          │
│          │ 오늘 완료하면 streak 유지      │          │
│          │ Day 완료 + Review 시 보너스    │          │
│          └────────────────────────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Approval Notes

Validated in conversation:

- Shared magical academy world
- Character-centric hub
- Today-first action hierarchy
- Day-centered history
- Review as calm replay flow
- Learn with optional accurate illustrations only
- Test using compact 2x2 four-choice layout
- Character screen emphasizing streak and achievement
