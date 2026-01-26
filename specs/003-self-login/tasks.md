# TimeEgg 자체 로그인 기능 작업 목록

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 자체 로그인 기능 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**TimeEgg 워크플로우**: API 연결 → E2E 테스트 → UI 구현 (Mock) → 데이터 바인딩 → UI 테스트

---

## 🎯 Phase 1: API 연결 레이어

### P1-1: API 타입 정의

- [x] T001 src/commons/apis/auth/types.ts 파일 생성 및 LocalLoginRequest, LocalLoginResponse, LoginErrorResponse 타입 정의

- [x] T002 src/commons/types/auth.ts에 LoginRequest 타입 업데이트 (phoneNumber, email 선택 필드 추가)

### P1-2: API 함수 구현

- [x] T003 src/commons/apis/auth/login.ts 파일 생성 및 localLogin 함수 구현 (apiClient 사용)

- [x] T004 src/commons/apis/endpoints.ts에 AUTH_ENDPOINTS.LOCAL_LOGIN 추가 (`/api/auth/local/login`)

### P1-3: 토큰 저장 유틸리티

- [x] T005 src/commons/utils/auth.ts 파일 생성 및 saveTokens, getTokens, clearTokens 함수 구현 (기존 api-client.ts 로직 활용)

---

## 🎯 Phase 2: E2E 테스트 작성 (Playwright)

### P2-1: 테스트 환경 설정

- [x] T006 tests/e2e/login/ 디렉토리 생성

- [x] T007 tests/e2e/login/fixtures/mockData.ts 파일 생성 및 테스트용 Mock 데이터 정의

### P2-2: E2E 테스트 시나리오 작성

- [x] T008 [US1] tests/e2e/login/login.e2e.spec.ts에 전화번호 로그인 성공 시나리오 테스트 작성

- [x] T009 [US2] tests/e2e/login/login.e2e.spec.ts에 이메일 로그인 성공 시나리오 테스트 작성

- [x] T010 [US3] tests/e2e/login/login.e2e.spec.ts에 잘못된 자격 증명으로 로그인 실패 시나리오 테스트 작성

- [x] T011 [US4] tests/e2e/login/login.e2e.spec.ts에 비활성화된 계정 또는 SNS 계정으로 로그인 시도 시나리오 테스트 작성

- [x] T012 [US5] tests/e2e/login/login.e2e.spec.ts에 회원가입 페이지 이동 시나리오 테스트 작성

---

## 🎯 Phase 3: UI 구현 (Mock 데이터 기반)

### P3-1: 컴포넌트 타입 정의

- [x] T013 [US1] src/components/Login/types.ts 파일 생성 및 LoginFormData, LoginFormErrors, LoginFormProps 타입 정의

### P3-2: Mock 데이터 생성

- [x] T014 [US1] src/components/Login/mocks/data.ts 파일 생성 및 Mock 로그인 응답 데이터 정의

### P3-3: 유효성 검증 유틸리티

- [x] T015 [US1] src/components/Login/utils/validation.ts 파일 생성 및 validateLoginForm, isValidPhoneNumber, isValidEmail 함수 구현

### P3-4: 로그인 폼 컴포넌트 구현

- [x] T016 [P] [US1] src/components/Login/LoginForm.tsx 파일 생성 및 전화번호/이메일/비밀번호 입력 필드 구현

- [x] T017 [P] [US1] src/components/Login/LoginForm.tsx에 클라이언트 사이드 유효성 검증 로직 추가

- [x] T018 [P] [US1] src/components/Login/styles.module.css 파일 생성 및 Figma 디자인 기반 스타일 작성 (375px 기준)

- [x] T019 [P] [US1] src/components/Login/LoginForm.tsx에 오류 메시지 표시 UI 구현

- [x] T020 [P] [US1] src/components/Login/LoginForm.tsx에 회원가입 링크 추가

### P3-5: 로그인 컨테이너 구현 (Mock 데이터)

- [x] T021 [US1] src/components/Login/index.tsx 파일 생성 및 LoginContainer 컴포넌트 구현 (Mock 데이터 사용)

- [x] T022 [US1] src/components/Login/index.tsx에 Mock 로그인 성공 처리 로직 추가 (토큰 저장, 리다이렉트 시뮬레이션)

- [x] T023 [US1] src/components/Login/index.tsx에 Mock 로그인 실패 처리 로직 추가 (오류 메시지 표시)

### P3-6: 페이지 통합

- [x] T024 [US1] src/app/(auth)/login/page.tsx에 LoginContainer 컴포넌트 통합

---

## 🎯 Phase 4: 데이터 바인딩

### P4-1: 폼 상태 관리 훅

- [x] T025 [US1] src/components/Login/hooks/useLoginForm.ts 파일 생성 및 폼 상태 관리 로직 구현

- [x] T026 [US1] src/components/Login/hooks/useLoginForm.ts에 입력 필드 유효성 검증 로직 통합

### P4-2: 로그인 API 훅 (React Query)

- [x] T027 [US1] src/components/Login/hooks/useLoginMutation.ts 파일 생성 및 useMutation을 사용한 로그인 API 호출 훅 구현

- [x] T028 [US1] src/components/Login/hooks/useLoginMutation.ts에 성공 시 토큰 저장 및 리다이렉트 로직 추가

- [x] T029 [US1] src/components/Login/hooks/useLoginMutation.ts에 에러 처리 및 메시지 매핑 로직 추가

### P4-3: 인증 상태 관리 업데이트

- [x] T030 [US1] src/commons/hooks/useAuth.ts에 실제 인증 로직 구현 (토큰 기반 인증 상태 확인)

- [x] T031 [US1] src/commons/hooks/useAuth.ts에 login 함수 구현 (localLogin API 호출)

- [x] T032 [US1] src/commons/provider/auth-provider/auth-provider.tsx 파일 생성 및 AuthContext Provider 구현 (필요시) - Context Provider는 현재 필요하지 않아 구현하지 않음

### P4-4: 컨테이너 데이터 바인딩

- [x] T033 [US1] src/components/Login/index.tsx에서 Mock 데이터를 실제 API 호출로 교체 (useLoginMutation 사용)

- [x] T034 [US1] src/components/Login/index.tsx에 로딩 상태 처리 추가

- [x] T035 [US1] src/components/Login/index.tsx에 에러 상태 처리 개선

### P4-5: 리다이렉트 처리

- [x] T036 [US1] src/app/(auth)/login/page.tsx에 이미 인증된 사용자 리다이렉트 로직 추가 (선택적)

- [x] T037 [US1] src/components/Login/hooks/useLoginMutation.ts에 로그인 성공 시 홈 페이지로 리다이렉트 로직 확인

---

## 🎯 Phase 5: UI 테스트 (Playwright)

### P5-1: UI 테스트 환경 설정

- [x] T038 tests/ui/login/ 디렉토리 생성

### P5-2: UI 테스트 작성

- [x] T039 [P] [US1] tests/ui/login/login.ui.spec.ts에 로그인 폼 렌더링 테스트 작성

- [x] T040 [P] [US1] tests/ui/login/login.ui.spec.ts에 입력 필드 상호작용 테스트 작성

- [x] T041 [P] [US1] tests/ui/login/login.ui.spec.ts에 유효성 검증 동작 테스트 작성

- [x] T042 [P] [US1] tests/ui/login/login.ui.spec.ts에 오류 메시지 표시 테스트 작성

- [x] T043 [P] [US1] tests/ui/login/login.ui.spec.ts에 로그인 버튼 상태 테스트 작성

- [x] T044 [P] [US1] tests/ui/login/login.ui.spec.ts에 회원가입 링크 클릭 테스트 작성

- [x] T045 [P] [US1] tests/ui/login/login.ui.spec.ts에 375px 모바일 프레임 기준 레이아웃 테스트 작성

---

## 📊 작업 통계

### 총 작업 수
- **총 45개 작업**

### 단계별 작업 수
- **Phase 1 (API 연결)**: 5개 작업
- **Phase 2 (E2E 테스트)**: 7개 작업
- **Phase 3 (UI 구현)**: 12개 작업
- **Phase 4 (데이터 바인딩)**: 13개 작업
- **Phase 5 (UI 테스트)**: 8개 작업

### 사용자 스토리별 작업 수
- **US1 (전화번호 로그인)**: 25개 작업
- **US2 (이메일 로그인)**: 1개 작업 (E2E 테스트)
- **US3 (로그인 실패)**: 1개 작업 (E2E 테스트)
- **US4 (계정 상태 오류)**: 1개 작업 (E2E 테스트)
- **US5 (회원가입 이동)**: 1개 작업 (E2E 테스트)

### 병렬 처리 가능 작업
- **Phase 3**: T016, T017, T018, T019, T020 (로그인 폼 컴포넌트 관련 작업)
- **Phase 5**: T039~T045 (UI 테스트 작업)

---

## 🔄 의존성 및 실행 순서

### 필수 순서
1. **Phase 1 완료** → Phase 2, Phase 3 시작 가능
2. **Phase 2 완료** → Phase 4 시작 가능
3. **Phase 3 완료** → Phase 4 시작 가능
4. **Phase 4 완료** → Phase 5 시작 가능

### 병렬 실행 가능
- Phase 2와 Phase 3는 독립적으로 진행 가능 (Mock 데이터 기반)
- Phase 3 내부의 일부 작업은 병렬 처리 가능 (`[P]` 마커)

---

## 🎯 MVP 범위

**최소 기능 제품 (MVP)**: US1 (전화번호 로그인 성공)만 구현

**MVP 작업 목록**:
- Phase 1: T001~T005 (API 연결)
- Phase 2: T008 (US1 E2E 테스트)
- Phase 3: T013~T024 (US1 UI 구현)
- Phase 4: T025~T037 (US1 데이터 바인딩)
- Phase 5: T039~T045 (US1 UI 테스트)

**MVP 완료 후 확장**:
- US2 (이메일 로그인) 추가
- US3, US4 (에러 처리) 개선
- US5 (회원가입 링크) 추가

---

## ✅ 검증 기준

### Phase 1 완료 기준
- [ ] API 타입이 정의되고 TypeScript 컴파일 에러 없음
- [ ] localLogin 함수가 정상적으로 API 호출 가능
- [ ] 토큰 저장/조회 함수가 정상 동작

### Phase 2 완료 기준
- [ ] 모든 E2E 테스트가 작성되고 실행 가능
- [ ] 테스트 시나리오가 명세서의 사용자 스토리와 일치

### Phase 3 완료 기준
- [ ] 로그인 폼이 Figma 디자인과 일치하게 렌더링됨
- [ ] Mock 데이터로 로그인 성공/실패 플로우가 동작함
- [ ] 입력 필드 유효성 검증이 정상 동작함
- [ ] 오류 메시지가 적절히 표시됨

### Phase 4 완료 기준
- [ ] 실제 API와 연결되어 로그인 기능이 정상 동작함
- [ ] 로그인 성공 시 토큰이 저장되고 홈 페이지로 리다이렉트됨
- [ ] 로그인 실패 시 적절한 오류 메시지가 표시됨
- [ ] 로딩 상태가 적절히 표시됨

### Phase 5 완료 기준
- [ ] 모든 UI 테스트가 통과함
- [ ] 375px 모바일 프레임 기준 레이아웃이 정상 표시됨
- [ ] 접근성 요구사항이 충족됨

---

## 📝 참고사항

### 파일 구조
```
src/
├── app/(auth)/login/
│   └── page.tsx
├── components/Login/
│   ├── index.tsx
│   ├── LoginForm.tsx
│   ├── types.ts
│   ├── styles.module.css
│   ├── hooks/
│   │   ├── useLoginForm.ts
│   │   └── useLoginMutation.ts
│   ├── utils/
│   │   └── validation.ts
│   └── mocks/
│       └── data.ts
├── commons/
│   ├── apis/auth/
│   │   ├── login.ts
│   │   └── types.ts
│   ├── types/auth.ts (업데이트)
│   ├── hooks/useAuth.ts (업데이트)
│   └── utils/auth.ts
tests/
├── e2e/login/
│   ├── login.e2e.spec.ts
│   └── fixtures/mockData.ts
└── ui/login/
    └── login.ui.spec.ts
```

### 주요 의존성
- 기존 API 클라이언트: `src/commons/provider/api-provider/api-client.ts`
- 기존 엔드포인트: `src/commons/apis/endpoints.ts`
- 기존 인증 타입: `src/commons/types/auth.ts`
- 기존 인증 훅: `src/commons/hooks/useAuth.ts`

### 디자인 참고
- Figma 로그인 페이지: https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1665&t=GV7N56w43IzWbaVI-4

---

**다음 단계**: `/speckit.implement`를 실행하여 단계별 구현을 시작합니다.
