# TimeEgg 카카오 소셜 로그인 기능 작업 목록

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 카카오 소셜 로그인 기능 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**구현 방식**: 앱과 동일한 OAuth 리다이렉트 방식
- 백엔드 OAuth URL로 리다이렉트 (`GET /api/auth/kakao?redirect_uri=...`)
- 카카오 인증 후 백엔드가 콜백 URL로 리다이렉트 (`/auth/callback?token=...`)
- 콜백 페이지에서 토큰 처리 및 로그인 완료

**TimeEgg 워크플로우**: API 연결 → E2E 테스트 → UI 구현 (Mock) → 데이터 바인딩 → UI 테스트

---

## 🎯 Phase 1: API 연결 레이어

### P1-1: 카카오 로그인 훅 구현

- [x] T001 src/components/Login/hooks/useKakaoLogin.ts 파일 생성 및 useKakaoLogin 훅 구현 (OAuth 로그인 처리)

- [x] T002 src/components/Login/hooks/useKakaoLogin.ts에 loginWithKakao 함수 구현 (window.location.href로 백엔드 OAuth URL로 리다이렉트, redirect_uri 파라미터 포함)

- [x] T003 src/components/Login/hooks/useKakaoLogin.ts에 redirect_uri 생성 로직 추가 (웹: http://localhost:3000/auth/callback)

- [x] T004 src/components/Login/hooks/useKakaoLogin.ts에 에러 처리 로직 추가

### P1-2: 콜백 페이지 구현

- [x] T005 src/app/(auth)/auth/callback/page.tsx 파일 생성 및 웹 콜백 처리 컴포넌트 구현

- [x] T006 src/app/(auth)/auth/callback/page.tsx에 URL에서 token 파라미터 추출 로직 추가

- [x] T007 src/app/(auth)/auth/callback/page.tsx에 토큰으로 사용자 정보 추출 로직 추가 (AuthProvider의 login() 호출 또는 직접 토큰 저장)

- [x] T008 src/app/(auth)/auth/callback/page.tsx에 온보딩 상태 확인 및 리다이렉트 로직 추가 (온보딩 미완료: /onboarding, 완료: /)

- [x] T009 src/app/(auth)/auth/callback/page.tsx에 에러 처리 로직 추가 (토큰 없음, 인증 실패 등)

### P1-3: 임시 백엔드 콜백 처리 (백엔드 수정 전까지)

- [x] T010 src/app/api/auth/kakao/callback/route.ts 파일 생성 및 임시 백엔드 콜백 처리 구현

- [x] T011 src/app/api/auth/kakao/callback/route.ts에 프론트엔드 콜백 라우트(/auth/callback)로 재리다이렉트 로직 추가

---

## 🎯 Phase 2: E2E 테스트 작성 (Playwright)

### P2-1: 테스트 환경 설정

- [ ] T012 tests/e2e/kakao-login/ 디렉토리 생성

- [ ] T013 tests/e2e/kakao-login/fixtures/mockData.ts 파일 생성 및 테스트용 Mock 데이터 정의

### P2-2: E2E 테스트 시나리오 작성

- [ ] T014 [US1] tests/e2e/kakao-login/kakao-login.e2e.spec.ts에 카카오 로그인 성공 시나리오 테스트 작성 (신규 사용자, 온보딩 페이지로 리다이렉트)

- [ ] T015 [US2] tests/e2e/kakao-login/kakao-login.e2e.spec.ts에 카카오 로그인 성공 시나리오 테스트 작성 (기존 사용자, 홈 페이지로 리다이렉트)

- [ ] T016 [US3] tests/e2e/kakao-login/kakao-login.e2e.spec.ts에 카카오 로그인 취소 시나리오 테스트 작성 (오류 메시지 표시 안 함)

- [ ] T017 [US4] tests/e2e/kakao-login/kakao-login.e2e.spec.ts에 카카오 로그인 실패 시나리오 테스트 작성 (인증 오류, 오류 메시지 표시)

- [ ] T018 [US5] tests/e2e/kakao-login/kakao-login.e2e.spec.ts에 네트워크 오류로 인한 로그인 실패 시나리오 테스트 작성

---

## 🎯 Phase 3: UI 구현 (Mock 데이터 기반)

### P3-1: Mock 데이터 생성

- [x] T019 [US1] src/components/Login/mocks/kakaoLoginData.ts 파일 생성 및 Mock 카카오 로그인 응답 데이터 정의

### P3-2: LoginContainer에 카카오 로그인 연결

- [x] T020 [US1] src/components/Login/index.tsx의 handleSelectKakao 함수 구현 (useKakaoLogin.loginWithKakao() 호출)

- [x] T021 [US1] src/components/Login/index.tsx에 로딩 상태 관리 추가 (리다이렉트는 즉시 실행되므로 별도 로딩 상태 불필요)

- [x] T022 [US1] src/components/Login/index.tsx에 에러 처리 및 사용자 피드백 추가

---

## 🎯 Phase 4: 데이터 바인딩

### P4-1: useKakaoLogin 실제 리다이렉트 연결

- [x] T023 [US1] src/components/Login/hooks/useKakaoLogin.ts에서 실제 window.location.href 리다이렉트 구현 완료

- [x] T024 [US1] src/components/Login/hooks/useKakaoLogin.ts에 실제 백엔드 OAuth URL 생성 로직 추가 (GET /api/auth/kakao?redirect_uri=...)

- [x] T025 [US1] src/components/Login/hooks/useKakaoLogin.ts에 redirect_uri 인코딩 처리 추가

### P4-2: 콜백 페이지 실제 데이터 바인딩

- [x] T026 [US1] src/app/(auth)/auth/callback/page.tsx에서 실제 URL 파라미터에서 토큰 추출 구현 완료

- [x] T027 [US1] src/app/(auth)/auth/callback/page.tsx에 실제 토큰 저장 로직 추가 (saveTokens 함수 사용)

- [x] T028 [US1] src/app/(auth)/auth/callback/page.tsx에 실제 사용자 정보 업데이트 로직 추가 (queryClient.setQueryData 사용)

- [x] T029 [US1] src/app/(auth)/auth/callback/page.tsx에 실제 온보딩 상태 확인 및 리다이렉트 로직 추가

- [x] T030 [US1] src/app/(auth)/auth/callback/page.tsx에 실제 에러 상태 처리 구현 완료

### P4-3: LoginContainer 실제 데이터 바인딩

- [x] T031 [US1] src/components/Login/index.tsx에서 실제 useKakaoLogin 훅 연결 완료

- [x] T032 [US1] src/components/Login/index.tsx에 실제 로딩 상태 처리 추가 (리다이렉트는 즉시 실행되므로 별도 로딩 상태 불필요)

- [x] T033 [US1] src/components/Login/index.tsx에 실제 에러 상태 처리 구현 완료

---

## 🎯 Phase 5: UI 테스트 (Playwright)

### P5-1: UI 테스트 환경 설정

- [ ] T034 tests/ui/kakao-login/ 디렉토리 생성

### P5-2: UI 테스트 작성

- [ ] T035 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 카카오 로그인 버튼 렌더링 테스트 작성

- [ ] T036 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 카카오 로그인 버튼 클릭 테스트 작성 (리다이렉트 확인)

- [ ] T037 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 콜백 페이지 렌더링 테스트 작성

- [ ] T038 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 콜백 페이지 토큰 처리 테스트 작성

- [ ] T039 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 콜백 페이지 리다이렉트 테스트 작성

- [ ] T040 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 에러 처리 테스트 작성 (토큰 없음, 인증 실패)

- [ ] T041 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 375px 모바일 프레임 기준 레이아웃 테스트 작성

- [ ] T042 [P] [US1] tests/ui/kakao-login/kakao-login.ui.spec.ts에 카카오 브랜드 가이드 준수 테스트 작성

---

## 📊 작업 통계

### 총 작업 수
- **총 42개 작업**

### 단계별 작업 수
- **Phase 1 (API 연결)**: 11개 작업
- **Phase 2 (E2E 테스트)**: 7개 작업
- **Phase 3 (UI 구현)**: 4개 작업
- **Phase 4 (데이터 바인딩)**: 13개 작업
- **Phase 5 (UI 테스트)**: 8개 작업

### 사용자 스토리별 작업 수
- **US1 (카카오 로그인 성공 - 신규 사용자)**: 20개 작업
- **US2 (카카오 로그인 성공 - 기존 사용자)**: 1개 작업 (E2E 테스트)
- **US3 (카카오 로그인 취소)**: 1개 작업 (E2E 테스트)
- **US4 (카카오 로그인 실패)**: 1개 작업 (E2E 테스트)
- **US5 (네트워크 오류)**: 1개 작업 (E2E 테스트)

### 병렬 처리 가능 작업
- **Phase 5**: T035~T042 (UI 테스트 작업)

---

## 🔄 의존성 및 실행 순서

### 필수 순서
1. **Phase 1 완료** → Phase 2, Phase 3 시작 가능
2. **Phase 2 완료** → Phase 4 시작 가능
3. **Phase 3 완료** → Phase 4 시작 가능
4. **Phase 4 완료** → Phase 5 시작 가능

### 병렬 실행 가능
- Phase 2와 Phase 3는 독립적으로 진행 가능 (Mock 데이터 기반)
- Phase 5 내부의 모든 작업은 병렬 처리 가능 (`[P]` 마커)

---

## 🎯 MVP 범위

**최소 기능 제품 (MVP)**: US1 (카카오 로그인 성공 - 신규 사용자)만 구현

**MVP 작업 목록**:
- Phase 1: T001~T011 (API 연결)
- Phase 2: T014 (US1 E2E 테스트)
- Phase 3: T019~T022 (US1 UI 구현)
- Phase 4: T023~T033 (US1 데이터 바인딩)
- Phase 5: T035~T042 (US1 UI 테스트)

**MVP 완료 후 확장**:
- US2 (기존 사용자 로그인) 추가
- US3 (로그인 취소) 개선
- US4, US5 (에러 처리) 개선

---

## ✅ 검증 기준

### Phase 1 완료 기준
- [ ] useKakaoLogin 훅이 정상적으로 백엔드 OAuth URL로 리다이렉트함
- [ ] 콜백 페이지가 토큰을 정상적으로 처리함
- [ ] 임시 백엔드 콜백이 정상적으로 동작함 (백엔드 수정 전까지)

### Phase 2 완료 기준
- [ ] 모든 E2E 테스트가 작성되고 실행 가능
- [ ] 테스트 시나리오가 명세서의 사용자 스토리와 일치
- [ ] 카카오 로그인 성공/실패/취소 시나리오가 모두 테스트됨

### Phase 3 완료 기준
- [ ] 카카오 로그인 버튼이 LoginMethodSelector에 표시됨
- [ ] Mock 데이터로 카카오 로그인 리다이렉트 플로우가 동작함
- [ ] 로딩 상태가 적절히 표시됨

### Phase 4 완료 기준
- [ ] 실제 백엔드 OAuth URL로 리다이렉트됨
- [ ] 카카오 로그인 성공 시 콜백 페이지에서 토큰이 저장되고 적절한 페이지로 리다이렉트됨
- [ ] 카카오 로그인 실패 시 적절한 오류 메시지가 표시됨
- [ ] 콜백 페이지에서 에러 처리가 정상 동작함

### Phase 5 완료 기준
- [ ] 모든 UI 테스트가 통과함
- [ ] 375px 모바일 프레임 기준 레이아웃이 정상 표시됨
- [ ] 카카오 브랜드 가이드가 준수됨
- [ ] 접근성 요구사항이 충족됨

---

## 📝 참고사항

### 파일 구조
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx (기존)
│   │   └── auth/
│   │       └── callback/
│   │           └── page.tsx (신규 - 웹 콜백 처리)
│   └── api/
│       └── auth/
│           └── kakao/
│               └── callback/
│                   └── route.ts (신규 - 임시 백엔드 콜백)
├── components/Login/
│   ├── index.tsx (수정)
│   ├── LoginMethodSelector/ (기존)
│   ├── hooks/
│   │   ├── useLoginMutation.ts (기존 - 참고용)
│   │   └── useKakaoLogin.ts (신규)
│   └── mocks/
│       └── kakaoLoginData.ts (신규)
tests/
├── e2e/kakao-login/
│   ├── kakao-login.e2e.spec.ts
│   └── fixtures/mockData.ts
└── ui/kakao-login/
    └── kakao-login.ui.spec.ts
```

### 주요 의존성
- 기존 API 클라이언트: `src/commons/provider/api-provider/api-client.ts`
- 기존 엔드포인트: `src/commons/apis/endpoints.ts` (EXTERNAL_ENDPOINTS.KAKAO_LOGIN)
- 기존 인증 타입: `src/commons/types/auth.ts`
- 기존 인증 유틸리티: `src/commons/utils/auth.ts` (saveTokens)
- 기존 인증 훅: `src/commons/hooks/useAuth.ts` (참고용)
- 기존 로그인 훅: `src/components/Login/hooks/useLoginMutation.ts` (참고용)

### 백엔드 API 스펙
- **OAuth 시작**: `GET /api/auth/kakao?redirect_uri=http://localhost:3000/auth/callback`
- **콜백**: 백엔드가 `/auth/callback?token=...`로 리다이렉트
- **임시 백엔드 콜백**: 백엔드가 `/api/auth/kakao/callback`로 리다이렉트하는 경우 처리 (백엔드 수정 후 제거 예정)

### OAuth 플로우
1. 사용자가 "카카오로 시작하기" 버튼 클릭
2. `useKakaoLogin.loginWithKakao()` 실행
3. 백엔드 OAuth URL 생성: `GET /api/auth/kakao?redirect_uri=http://localhost:3000/auth/callback`
4. `window.location.href`로 카카오 인증 페이지로 리다이렉트
5. 카카오 인증 완료 후 백엔드가 `redirect_uri`로 리다이렉트 (`/auth/callback?token=...`)
6. 콜백 페이지에서 토큰으로 사용자 정보 추출 및 로그인 처리
7. 온보딩 상태 확인 후 적절한 페이지로 리다이렉트

### 디자인 참고
- LoginMethodSelector는 이미 구현되어 있음
- 카카오 로그인 버튼은 기존 디자인 사용
- 카카오 브랜드 가이드 준수 필요

---

**다음 단계**: `/speckit.implement`를 실행하여 단계별 구현을 시작합니다.
