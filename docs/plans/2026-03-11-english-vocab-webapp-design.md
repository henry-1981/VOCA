# BrideVOCA v0.1 Design

**Date:** 2026-03-11

**Product Goal:** Build a personal web app for a 10-year-old child to learn English words and take short voice-friendly quizzes on an iPad.

## Product Summary

BrideVOCA v0.1 is a child-first web app for a single family. It is not a commercial product and does not need user accounts, cloud sync, or multi-device coordination in the first version.

The first version focuses on one simple daily loop:

- Open `Today`
- Learn a few new words
- Take a short test
- Save progress locally
- Earn simple character progress

This version does **not** attempt to build a full spaced-repetition platform. It only needs to be usable, repeatable, and pleasant enough for a child to come back to it.

## Clarified v0.1 Scope

### Included

- Child-first `Today` home screen
- Built-in starter word books
- Parent can add custom words
- Learn-new-words flow
- Test flow
- Quiz types:
  - multiple choice
  - listening
  - speaking
- Speech-to-text answer checking
- Similarity-based spoken answer acceptance
- Local-only persistence
- Character level plus expression/state change

### Deferred

- Full review UX
- Parent editing/deleting words
- Manual mastery adjustment
- Cloud sync
- Login
- Rich analytics
- Avatar collection system
- Cross-browser parity

## Target Environment

- Primary device: iPad
- Primary browser: Safari

This is important because speech support is a core product assumption in v0.1.

## Users

### Child

- Around 10 years old
- Should be able to start a session without adult help
- More comfortable with tapping and speaking than typing

### Parent

- Adds words when needed
- Chooses or enables built-in vocabulary sets
- Does not need a full admin system in v0.1

## Core Flow

### 1. Today Screen

The app opens on a simple `Today` dashboard.

Main information:

- Today goal completion
- Number of new words
- Number of test questions

Main actions:

- `Learn`
- `Test`
- `Character`

The screen should feel like a single-task launcher, not a dashboard full of options.

### 2. Learn Flow

- Show a small batch of words
- Each card includes:
  - English word
  - meaning
  - optional audio playback
- Keep it short and swipe/tap friendly

### 3. Test Flow

- One short session, about 5-10 minutes
- Questions use three modes:
  - choose the meaning
  - listen and identify
  - speak the answer

The goal is not perfect assessment depth. The goal is a child-friendly test that feels active and varied.

### 4. Reward Flow

- Completing learning and testing grants XP
- Character level increases over time
- Character expression or state changes to reflect progress

## Quiz Design

### Question Types

#### Multiple Choice

- English -> choose meaning
- Fast and low-friction
- Useful for confidence and pacing

#### Listening

- Hear a word
- Choose the matching answer
- Uses browser audio/TTS

#### Speaking

- Child says the target word
- App converts speech to text
- App compares transcript with expected answer
- Exact match is not required; near matches count as correct

## Speech Rules

Speech is a core v0.1 feature, not an optional enhancement.

### Input Handling

- Use browser speech recognition where available
- Optimize for iPad Safari first
- Keep the interaction simple:
  - tap mic
  - speak
  - see recognized text
  - receive result

### Answer Judgment

- Do not require exact string equality
- Accept small recognition errors through similarity matching
- If recognition fails badly, allow one quick retry

### Risk Note

Speech is still the biggest technical uncertainty in v0.1, but it remains in scope by decision.

## Data Model

### Word

- id
- english
- meaning
- source
- audio_enabled

### Word Progress

- word_id
- learned_count
- correct_count
- wrong_count
- last_tested_at

This version intentionally avoids a full mastery-state engine.

### Session Summary

- date
- questions_total
- questions_correct
- learned_words_count

### Character Progress

- xp
- level
- mood

## Persistence

- Local only
- No account
- No sync
- No export/import in v0.1

Recommended storage choice for v0.1:

- `localStorage`

Reason:

- Simpler than IndexedDB
- Good enough for first-version local data size
- Faster to ship and debug

## Parent Scope

Parent features are intentionally narrow in v0.1:

- add custom words

Not included yet:

- edit words
- delete words
- force status changes

## UX Principles

- Large tap targets
- Minimal text per screen
- Positive feedback
- No shame-oriented failure messaging
- Very short action loops
- Child should always know the next thing to do

## Success Criteria

- Child can use the app alone on an iPad
- A session fits into 5-10 minutes
- Speaking questions feel usable, not frustrating
- Parent can add words without setup overhead
- Character progress gives enough reward for repeat use

## Recommended v0.1 Tech Spec

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- State: React local state
- Persistence: localStorage
- Speech output: browser audio/TTS
- Speech input: browser speech recognition
- Hosting: Vercel

## Known Limits

- Data is lost if browser storage is cleared
- iPad Safari speech behavior may still vary by OS version
- Review is only recorded, not fully productized
- Speaking accuracy may require tuning after first real use
