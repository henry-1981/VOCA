# SFX (효과음) 시스템 설계

## Context

마법 아카데미 테마의 아이 학습 앱에 효과음을 추가하여 학습 동기 부여와 인터랙션 피드백을 강화한다. 배경음(BGM)은 후속 작업으로 분리.

## 에셋

| ID | 순간 | 화면 | 파일명 | 특성 |
|---|------|------|--------|------|
| `correct` | 정답 | Test, Review | `correct.mp3` | 밝은 차임, 0.3-0.5초 |
| `wrong` | 오답 | Test, Review | `wrong.mp3` | 부드러운 실패음, 0.3-0.5초 |
| `day-complete` | Day 완료 | Test 완료 후 | `day-complete.mp3` | 팡파레, 1-2초 |
| `level-up` | 레벨업 | Character | `level-up.mp3` | 마법 + 팡파레, 1-2초 |
| `card-flip` | 카드 넘김 | Learn | `card-flip.mp3` | 페이지 넘김, 0.2초 |
| `tap` | 버튼 탭 | 공통 | `tap.mp3` | 가벼운 클릭, 0.1초 |
| `streak` | 스트릭 토스트 | Hub | `streak.mp3` | 보상 차임, 0.5초 |
| `profile-switch` | 프로필 전환 | Hub | `profile-switch.mp3` | 전환 효과음, 0.3초 |

- 경로: `public/audio/sfx/`
- 포맷: MP3 (iPad Safari 호환, 파일당 10-50KB 목표)
- 소스: freesound.org / Pixabay (CC0 / 로열티프리)

## 아키텍처

### 코어 모듈: `src/lib/audio/sfx.ts`

```typescript
preloadSfx()        // 앱 시작 시 Audio 객체 미리 생성
playSfx(id)         // ID로 재생 (중복 재생 허용, clone 방식)
setSfxEnabled(bool)  // 음소거 토글 (localStorage 저장)
isSfxEnabled()       // 현재 상태 조회
```

### 기술 결정

- **HTMLAudio 풀링**: 같은 효과음 빠르게 연속 재생 시 `cloneNode()` + `play()`
- **iOS Safari 제약**: 첫 사용자 인터랙션 후에만 재생 가능 → 첫 탭 시 silent play로 unlock
- **음소거 설정**: localStorage `sfx-enabled` 키에 저장

### 컴포넌트 연동

각 화면에서 기존 이벤트 핸들러에 `playSfx()` 호출 1줄 추가:

```typescript
playSfx("correct");    // Test 정답
playSfx("card-flip");  // Learn 카드 넘김
```

### 음소거 토글 UI

- Hub 상단에 스피커 아이콘 버튼
- `/lab` 패널에도 토글 추가 (디버깅용)

## 변경 파일 예상

| Action | File |
|--------|------|
| Create | `public/audio/sfx/*.mp3` (8개) |
| Create | `src/lib/audio/sfx.ts` |
| Create | `src/lib/audio/sfx.test.ts` |
| Modify | `src/components/test/learning-test-screen.tsx` (correct/wrong) |
| Modify | `src/components/learn/learn-card.tsx` (card-flip) |
| Modify | `src/components/effects/day-complete-celebration.tsx` (day-complete) |
| Modify | `src/components/effects/level-up-overlay.tsx` (level-up) |
| Modify | `src/components/hub/main-hub.tsx` (streak, profile-switch, tap) |
| Modify | `src/components/lab/test-lab-panel.tsx` (sfx toggle) |

## 제약 조건

- iPad landscape PWA 전용
- 게이미피케이션 이펙트 300-700ms (CLAUDE.md 규칙)
- Review 화면은 최소 이펙트
