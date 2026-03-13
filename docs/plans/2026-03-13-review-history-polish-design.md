# BrideVOCA Review / History Polish Design

**Date:** 2026-03-13

## Scope

- Review landing polish
- Review session polish
- History list polish
- History detail polish
- Do not modify Main Hub
- Do not modify Today
- Do not change content structure, auth, or Firestore scope

## Confirmed Direction

### Review

- Place feeling: calm review room
- Emotional tone: recovery, reset, moonlight, silver
- Interaction rule: keep the same quiz structure as Test, but remove exam energy
- Visual goal: a child should feel invited back into practice, not judged

### History

- Place feeling: library / record archive room
- Emotional tone: quiet, paper, shelves, record lookup
- Information rule: Day-centered browsing and detail reading
- Visual goal: the screen should feel like opening stored Day records, not browsing generic stat cards

## Design Decisions

### Review Landing

- Keep a single primary CTA and current batch size
- Add room-setting layers: soft moonlit backdrop, silver glow, gentle panel framing
- Add supporting copy that frames review as calm recovery
- Make the screen feel like entering a dedicated room, not a plain form card

### Review Session

- Keep the `LearningTestScreen` data shape and answer loop
- Add a display mode for review so the component can render a different emotional tone without duplicating quiz logic
- Change copy, labels, palette, and completion messaging for review mode
- Keep pace readable and gentle: softer feedback colors, calmer top copy, less competitive language

### History List

- Reframe the page as a recent Day archive
- Promote Day title and recorded date
- Turn each Day card into an archive sheet with score summary, mistake count, and a short wrong-word preview
- Add ambient library styling: paper surfaces, shelf-like section framing, warm ink colors

### History Detail

- Keep current record data only
- Add a reading-room summary header for the selected Day
- Present wrong words as indexed record chips/cards instead of plain flat blocks
- If there are no wrong words, preserve a quiet “clean record” state instead of empty space

## Non-Goals

- No Main Hub edits
- No Today screen edits
- No navigation architecture changes
- No new dependencies
- No backend/data model expansion

## Verification Plan

- Update existing component tests to lock new visible copy and key affordances
- Run targeted tests during each screen pass
- Finish with `npm run lint`, `npm run typecheck`, and `npm run build`
- Create checkpoint commit after the UI polish is verified
