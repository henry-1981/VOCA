# BrideVOCA Family App Spec

**Date:** 2026-03-11

## Purpose

This document defines the product spec for the family version of BrideVOCA.

BrideVOCA is a family learning app for two children using two separate iPads. Each child has a dedicated device, a dedicated profile, and an independent learning journey inside a shared family data model.

This is not a commercial account-switching product. The app should behave like a personal family learning world, not like a multi-tenant service.

## Product Definition

- Product type: family learning app
- Primary devices: two iPads
- Primary usage mode: one child per device
- Product goal: help each child move through Day-based English vocabulary learning with a repeatable loop of learning, testing, reviewing, and character growth

## Core Principles

- Child-first interaction
- One child profile is effectively fixed to one iPad
- Shared family cloud data, separated child progress
- Day-based progression, not algorithm-first progression
- Character-centered motivation
- Review is part of the growth loop, not an optional afterthought
- Commercial account-switching patterns are out of scope

## Users

### Child A

- Uses iPad A
- Has a dedicated child profile
- Has independent Day progress, test history, review pool, XP, level, and streak

### Child B

- Uses iPad B
- Has a dedicated child profile
- Has independent Day progress, test history, review pool, XP, level, and streak

### Parent

- Parent exists as the operator/developer
- Parent-facing in-app management UI is out of scope
- Content setup and advanced adjustments can be handled outside the normal in-app child flow

## Device and Profile Model

- There are two iPads
- Each iPad is connected to one default child profile during initial setup
- On app launch, the app goes directly into the connected child’s world
- Normal user-facing profile switching is not implemented
- Deep/exception-only profile reassignment can exist as a later option or developer operation

### Initial Provisioning

- A one-time provisioning/setup step is allowed
- This setup step exists only to connect a family, two child profiles, and each iPad
- It is not treated as a general parent-facing management UI
- After provisioning, normal child use should not require repeated parent interaction

## Data Model Principles

- Family data is shared in the cloud
- Child progress is separated by child profile
- Device is not the source of truth
- Cloud is the source of truth
- Data should be saved immediately when meaningful activity completes

### Source of Truth Split

- Firestore is the source of truth for live app content and child progress
- Local JSON seed files are an import/staging format only
- Local device storage is only for device binding, cache, and resilience

## Required Cloud Data

For each child, the app should store:

- current Day progress
- completed Day records
- Learn completion state
- Test results
- Review results
- wrong-answer pool
- history of completed sessions
- character XP
- character level
- streak / consecutive learning count

## Learning Structure

### Day Sets

- Learning is organized into fixed `Day` sets such as `Day01`, `Day02`, `Day03`
- The app does not need to generate dynamic daily content as the primary model
- A Day is a meaningful learning unit

### Day Types

- Not every Day has the same role
- There are at least two Day types:
  - `learning`
  - `checkpoint_test`
- Current observed cadence is:
  - 4 learning Days
  - then 1 checkpoint test Day
- Confirmed examples:
  - `Day 05`
  - `Day 10`
  should be treated as checkpoint test Days

### Default Day Flow

- By default, the next recommended Day is the next uncompleted Day
- In normal use, a child should be able to continue naturally into the next Day

### Flexible Day Access

- A child can also enter a deeper option and choose a different Day
- The child may revisit a previous Day
- The child may open and complete a future Day early
- Completing a future Day still counts as a real completion

## Core Navigation

The main child hub contains four primary destinations:

- `Today`
- `Character`
- `History`
- `Review`

All four are major destinations, but `Today` is the clearest primary action.

## Main Screen Behavior

- The app opens on the child’s main screen
- The main screen centers on the child’s avatar/character
- The screen shows cumulative achievement
- The screen provides direct access to:
  - `Today`
  - `Character`
  - `History`
  - `Review`

## Today Flow

### Purpose

`Today` is the daily learning loop.

### Sequence

- `learning Day`: `Learn -> Test`
- `checkpoint test Day`: direct `Test`

### Day Completion Rule

A Day is complete when:

- for a `learning` Day:
  - Learn is completed
  - Test is completed
- for a `checkpoint test` Day:
  - Test is completed

Completion is not blocked by score thresholds.

### Stage Visibility

`Today` should clearly show stage state:

- not started
- Learn completed
- Test completed
- Day completed

### Dynamic Emphasis

- On a `learning` Day:
  - `Learn` is the main action first
  - after Learn is completed, `Test` becomes the main action
- On a `checkpoint test` Day:
  - `Test` is the main action immediately

## Learn Experience

### Learn Rules

- One word per card
- English word is visually central
- Korean meaning is clearly shown
- Audio pronunciation is always available
- Replay is available with a small play button
- Learn is considered complete when the child has moved through all 20 cards in the Day at least once

### Visual Support

- A word may include an image or illustration
- Images are used only when semantic accuracy is strong
- If a visual may mislead the child, the app should prefer text and audio support over illustration
- Visual support is secondary to the word itself

## Test Experience

### Test Rules

- One question per card
- Prompt remains large and central
- Audio replay remains available
- Core test interaction is multiple choice
- Default choice count is 4

### Variation Strategy

To reduce boredom without increasing complexity:

- mix `EN -> KO`
- mix `KO -> EN`

The app should not rely on too many radically different interaction patterns for the base test loop.

### Feedback Strategy

- Answer feedback should be short
- Feedback should not significantly interrupt pacing
- The child should be able to continue with rhythm

## Audio Rules

- Every English vocabulary item should support pronunciation playback
- Audio should be accessible in Learn and Test
- Initial playback behavior can be guided by screen context
- Replay must always remain available via a compact play button
- Initial implementation uses browser / OS TTS as the default playback source
- Existing Bridge VOCA MP3 assets may be used later as an optional enhancement or fallback, but they are not required for the first implementation

## Speaking

- Speaking remains part of the long-term product vision
- Speaking is not part of the initial core implementation scope

## Review

### Purpose

`Review` exists to replay accumulated mistakes in a focused recovery loop.

### Source

- Review is built from the accumulated wrong-answer pool across multiple tests

### Batch Size

- One Review session should use a short batch
- Target size: around 10 questions

### Interaction

- Review uses the same basic interaction model as Test
- The difference is content source and screen tone, not a new control system

### Reward Role

- Review is a distinct destination
- Review also contributes to the day’s achievement loop

## History

### Purpose

`History` is Day-centered.

### First-Level Structure

The first screen should show recent Day records in reverse chronological order.

Each Day record should show:

- Day label
- date
- completion status
- score
- number of wrong words

### Detail Model

- Entering a Day record should reveal more detail
- Detail can include which words were missed in that Day

The first view of History is not a word-stat dashboard. It is a recent Day record log.

## Character and Motivation

### Character Role

- The child avatar is a major motivational center
- The character should feel like the child’s protagonist inside the world

### Main Character Metrics

- XP
- Level
- Streak

### Motivation Loop

- Large reward is granted for completing `Today`
- Additional reward depends on Test performance
- Additional reward also depends on whether Review was completed

### Streak

- Streak is a major achievement mechanic
- It should encourage returning consistently
- It should be visible in the Character experience

## Scope Boundaries

### In Scope

- family app for two children
- two dedicated iPads
- fixed child-per-device model
- shared cloud data
- separate child progress
- Main Hub
- Today
- Learn
- Test
- Character
- History
- Review
- Day-based progression
- flexible Day selection in a deeper option
- XP / Level / Streak
- audio playback for all English words

### Out of Scope

- parent-facing in-app admin UI
- commercial-style account switching
- complex multi-user switching flows
- speaking in the initial core implementation
- service/business features beyond the family use case

## Acceptance Criteria

- The app supports two children with separate progress
- Each iPad opens directly to its connected child profile
- `Today` clearly leads the child through `Learn -> Test`
- Completing Learn causes Test to become the main next action
- Every English word can be listened to with replay available
- Test uses 4-choice questions and mixes EN->KO and KO->EN directions
- Review uses accumulated wrong answers and runs in short batches
- History shows recent Day records first
- Character screen clearly shows XP, Level, and Streak
- Day completion is based on Learn + Test completion, not score threshold
- A child may complete future Days early and have those completions counted

## Relationship to Existing Documents

- `2026-03-11-family-app-design.md` is the current design-direction document
- `2026-03-11-english-vocab-webapp-design.md` becomes legacy reference material after spec + plan are complete
- `2026-03-11-english-vocab-webapp.md` becomes legacy reference material after the new family-app plan is created

## Next Step

After this spec is approved, create a new family-app implementation plan aligned to:

- this spec
- the family-app design document
- the archive status of the earlier personal-app documents
