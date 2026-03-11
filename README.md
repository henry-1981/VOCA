# BrideVOCA

오늘 바로 iPad에서 40개 단어 테스트를 돌리기 위한 초소형 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## Family App Foundation

현재 저장소는 가족앱 foundation wave로 확장 중입니다.

- Firebase / Firestore scaffold 추가
- 가족 단위 child-per-device 구조로 전환
- Firestore를 live source of truth로 사용

## Real Firebase Verification

실제 Firebase round-trip 검증을 하려면 `.env.local`에 아래 키가 필요합니다.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

현재 이 값이 없으면:

- UI는 preview/mock mode로 동작
- 실제 Google 로그인은 비활성화
- 실제 Firestore read/write round-trip은 검증 불가

## 오늘 구현 범위

- 홈 화면
- 40단어 객관식 테스트
- 문제 진행률 표시
- 듣기 버튼
- 최근 결과 로컬 저장
