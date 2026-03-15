# BGM (배경음악) 시스템 설계

## Context

마법 아카데미 테마의 아이 학습 앱에 배경음악을 추가하여 몰입감을 강화한다. SFX(효과음) 시스템 위에 독립 모듈로 구현. Learn/Test 화면에서는 TTS 단어 발음이 재생되므로 BGM을 페이드아웃하여 충돌 방지.

## 에셋

| ID | 화면 | 파일명 | 특성 |
|---|------|--------|------|
| `hub-theme` | Hub, Character | `hub-theme.mp3` | 마법 아카데미 로비, 밝고 판타지적, 루프 가능, 30-60초 |

- 경로: `public/audio/bgm/`
- 포맷: MP3 (iPad Safari 호환, 200-500KB 목표)
- 소스: Kenney.nl / OpenGameArt / Pixabay (CC0 / 로열티프리)

## 아키텍처

### 코어 모듈: `src/lib/audio/bgm.ts`

```typescript
playBgm(id)          // 재생 (이미 같은 트랙이면 무시)
stopBgm()            // 페이드아웃 후 정지
isBgmEnabled()       // localStorage 조회
setBgmEnabled(bool)  // 음소거 토글
```

### 기술 결정

- **HTMLAudioElement 재사용**: 1개 인스턴스, `loop = true` 반복 재생 (SFX와 달리 clone 불필요)
- **볼륨**: 0.3 (효과음보다 낮게, TTS와 충돌 방지)
- **페이드아웃**: 500ms `setInterval`로 볼륨 점진 감소 → 0 도달 시 `pause()` + `currentTime = 0`
- **localStorage**: `bgm-enabled` 키 (SFX와 독립)
- **iOS unlock**: SFX에서 이미 처리됨 (bootstrap-landing.tsx의 unlockAudioContext 공유)

### 화면별 동작

| 화면 | BGM 동작 |
|------|----------|
| Hub | `playBgm("hub-theme")` |
| Character | `playBgm("hub-theme")` (동일 트랙 유지) |
| Learn, Test, Today | `stopBgm()` → 페이드아웃 |
| Review, History | `stopBgm()` → 페이드아웃 |
| Provision, Lab | 무음 |

### 음소거 토글 UI

- Hub 상단에 BGM 토글 버튼 (기존 SFX 토글 옆)
- `/lab` 패널에도 BGM 토글 추가 (디버깅용)

## 변경 파일 예상

| Action | File |
|--------|------|
| Create | `public/audio/bgm/hub-theme.mp3` |
| Create | `src/lib/audio/bgm.ts` |
| Create | `src/lib/audio/bgm.test.ts` |
| Modify | `src/components/hub/main-hub.tsx` (playBgm + 토글) |
| Modify | `src/components/character/character-screen.tsx` (playBgm) |
| Modify | `src/components/test/learning-test-screen.tsx` (stopBgm) |
| Modify | `src/components/learn/learn-card.tsx` (stopBgm) |
| Modify | `src/components/lab/test-lab-panel.tsx` (토글) |

## 제약 조건

- iPad landscape PWA 전용
- Review 화면은 최소 이펙트 (BGM 없음)
- Learn/Test에서 TTS와 BGM 충돌 방지 (페이드아웃)
