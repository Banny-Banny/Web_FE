# TimeEgg 온보딩 기능 작업 목록

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 온보딩 기능 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**TimeEgg 워크플로우**: API 연결 → E2E 테스트 → UI 구현 (Mock) → 데이터 바인딩 → UI 테스트

---

## 🎯 Phase 1: API 연결 레이어

### P1-1: API 타입 정의

- [x] T001 src/commons/apis/onboarding/types.ts 파일 생성 및 OnboardingCompleteRequest, OnboardingCompleteResponse, OnboardingErrorResponse 타입 정의

### P1-2: API 함수 구현

- [x] T002 src/commons/apis/onboarding/complete.ts 파일 생성 및 completeOnboarding 함수 구현 (apiClient 사용)

- [x] T003 src/commons/apis/endpoints.ts에 ONBOARDING_ENDPOINTS 추가 및 COMPLETE 엔드포인트 정의 (`/api/onboarding/complete`)

---

## 🎯 Phase 2: E2E 테스트 작성 (Playwright)

### P2-1: 테스트 환경 설정

- [ ] T004 tests/e2e/onboarding/ 디렉토리 생성

- [ ] T005 tests/e2e/onboarding/fixtures/mockData.ts 파일 생성 및 테스트용 Mock 데이터 정의

### P2-2: E2E 테스트 시나리오 작성

- [ ] T006 [US1] tests/e2e/onboarding/onboarding.e2e.spec.ts에 친구 연동 허용 동의 완료 시나리오 테스트 작성

- [ ] T007 [US2] tests/e2e/onboarding/onboarding.e2e.spec.ts에 위치 권한 허용 동의 완료 시나리오 테스트 작성

- [ ] T008 [US3] tests/e2e/onboarding/onboarding.e2e.spec.ts에 온보딩 완료 및 메인 페이지 이동 시나리오 테스트 작성

- [ ] T009 [US4] tests/e2e/onboarding/onboarding.e2e.spec.ts에 온보딩 완료 실패 처리 시나리오 테스트 작성

- [ ] T010 [US5] tests/e2e/onboarding/onboarding.e2e.spec.ts에 동의 거부 후 온보딩 완료 시나리오 테스트 작성

---

## 🎯 Phase 3: UI 구현 (Mock 데이터 기반)

### P3-1: 컴포넌트 타입 정의

- [x] T011 [US1] src/components/Onboarding/types.ts 파일 생성 및 OnboardingState, OnboardingStep, ConsentStepProps, FriendConsentStepProps, LocationConsentStepProps 타입 정의

### P3-2: Mock 데이터 생성

- [x] T012 [US1] src/components/Onboarding/mocks/data.ts 파일 생성 및 Mock 온보딩 완료 응답 데이터 정의

### P3-3: 플로우 상태 관리 훅 (Mock 버전)

- [x] T013 [US1] src/components/Onboarding/hooks/useOnboardingFlow.ts 파일 생성 및 플로우 상태 관리 로직 구현 (Mock 데이터 기반)

### P3-4: 친구 연동 허용 단계 컴포넌트 구현

- [x] T014 [P] [US1] src/components/Onboarding/FriendConsentStep.tsx 파일 생성 및 친구 연동 허용 설명 UI 구현

- [x] T015 [P] [US1] src/components/Onboarding/FriendConsentStep.tsx에 동의/거부 선택 UI 구현

- [x] T016 [P] [US1] src/components/Onboarding/FriendConsentStep.tsx에 다음 단계 버튼 구현

- [x] T017 [P] [US1] src/components/Onboarding/styles.module.css 파일 생성 및 FriendConsentStep Figma 디자인 기반 스타일 작성 (375px 기준)

### P3-5: 위치 권한 허용 단계 컴포넌트 구현

- [x] T018 [P] [US2] src/components/Onboarding/LocationConsentStep.tsx 파일 생성 및 위치 권한 허용 설명 UI 구현

- [x] T019 [P] [US2] src/components/Onboarding/LocationConsentStep.tsx에 동의/거부 선택 UI 구현

- [x] T020 [P] [US2] src/components/Onboarding/LocationConsentStep.tsx에 온보딩 완료 버튼 구현

- [x] T021 [P] [US2] src/components/Onboarding/styles.module.css에 LocationConsentStep Figma 디자인 기반 스타일 추가 (375px 기준)

### P3-6: 온보딩 컨테이너 구현 (Mock 데이터)

- [x] T022 [US1] src/components/Onboarding/index.tsx 파일 생성 및 OnboardingContainer 컴포넌트 구현 (Mock 데이터 사용)

- [x] T023 [US1] src/components/Onboarding/index.tsx에 단계별 네비게이션 로직 구현 (friend → location)

- [x] T024 [US1] src/components/Onboarding/index.tsx에 Mock 온보딩 완료 처리 로직 추가 (리다이렉트 시뮬레이션)

- [x] T025 [US1] src/components/Onboarding/index.tsx에 Mock 오류 처리 로직 추가 (오류 메시지 표시)

### P3-7: 페이지 통합 및 인증 확인

- [x] T026 [US1] src/app/(auth)/onboarding/page.tsx에 OnboardingContainer 컴포넌트 통합

- [x] T027 [US1] src/app/(auth)/onboarding/page.tsx에 인증되지 않은 사용자 리다이렉트 처리 추가

---

## 🎯 Phase 4: 데이터 바인딩

### P4-1: 온보딩 완료 API 훅

- [x] T028 [US3] src/components/Onboarding/hooks/useOnboardingMutation.ts 파일 생성 및 React Query 기반 온보딩 완료 mutation 구현

- [x] T029 [US3] src/components/Onboarding/hooks/useOnboardingMutation.ts에 성공 시 메인 페이지 리다이렉트 로직 추가

- [x] T030 [US4] src/components/Onboarding/hooks/useOnboardingMutation.ts에 에러 메시지 변환 함수 구현

### P4-2: 플로우 상태 관리 훅 업데이트

- [x] T031 [US1] src/components/Onboarding/hooks/useOnboardingFlow.ts에 실제 동의 상태 관리 로직 업데이트

- [x] T032 [US1] src/components/Onboarding/hooks/useOnboardingFlow.ts에 온보딩 완료 요청 데이터 준비 함수 추가

### P4-3: 컨테이너 컴포넌트 업데이트

- [x] T033 [US3] src/components/Onboarding/index.tsx에 useOnboardingMutation 훅 연결

- [x] T034 [US3] src/components/Onboarding/index.tsx에 Mock 데이터를 실제 API 호출로 교체

- [x] T035 [US3] src/components/Onboarding/index.tsx에 로딩 상태 처리 추가

- [x] T036 [US4] src/components/Onboarding/index.tsx에 에러 상태 처리 추가

- [x] T037 [US3] src/components/Onboarding/index.tsx에 중복 요청 방지 로직 추가

### P4-4: 단계별 컴포넌트 업데이트

- [x] T038 [US1] src/components/Onboarding/FriendConsentStep.tsx에 로딩 상태 props 추가

- [x] T039 [US2] src/components/Onboarding/LocationConsentStep.tsx에 로딩 상태 props 추가

- [x] T040 [US2] src/components/Onboarding/LocationConsentStep.tsx에 에러 메시지 표시 UI 추가

### P4-5: 페이지 인증 확인 강화

- [x] T041 [US1] src/app/(auth)/onboarding/page.tsx에 이미 온보딩 완료한 사용자 리다이렉트 처리 추가 (선택적)

---

## 🎯 Phase 5: UI 테스트 (Playwright)

### P5-1: UI 테스트 작성

- [ ] T042 [P] [US1] tests/ui/onboarding/onboarding.ui.spec.ts에 친구 연동 허용 단계 렌더링 테스트 작성

- [ ] T043 [P] [US1] tests/ui/onboarding/onboarding.ui.spec.ts에 친구 연동 허용 동의 선택 상호작용 테스트 작성

- [ ] T044 [P] [US2] tests/ui/onboarding/onboarding.ui.spec.ts에 위치 권한 허용 단계 렌더링 테스트 작성

- [ ] T045 [P] [US2] tests/ui/onboarding/onboarding.ui.spec.ts에 위치 권한 허용 동의 선택 상호작용 테스트 작성

- [ ] T046 [P] [US3] tests/ui/onboarding/onboarding.ui.spec.ts에 온보딩 완료 버튼 클릭 테스트 작성

- [ ] T047 [P] [US4] tests/ui/onboarding/onboarding.ui.spec.ts에 에러 메시지 표시 테스트 작성

- [ ] T048 [P] [US1] tests/ui/onboarding/onboarding.ui.spec.ts에 단계별 네비게이션 테스트 작성

- [ ] T049 [P] [US1] tests/ui/onboarding/onboarding.ui.spec.ts에 Figma 디자인 시각적 검증 테스트 작성 (375px 기준)

---

## 📊 작업 요약

### 총 작업 수
- **총 49개 작업**

### Phase별 작업 수
- **Phase 1 (API 연결)**: 3개 작업
- **Phase 2 (E2E 테스트)**: 7개 작업
- **Phase 3 (UI 구현)**: 17개 작업
- **Phase 4 (데이터 바인딩)**: 14개 작업
- **Phase 5 (UI 테스트)**: 8개 작업

### 사용자 스토리별 작업 수
- **US1 (친구 연동 허용)**: 12개 작업
- **US2 (위치 권한 허용)**: 8개 작업
- **US3 (온보딩 완료)**: 6개 작업
- **US4 (실패 처리)**: 4개 작업
- **US5 (동의 거부)**: 1개 작업 (E2E 테스트)

### 병렬 처리 가능 작업
- **Phase 3**: T014-T021 (컴포넌트 구현 작업들)
- **Phase 5**: T042-T049 (UI 테스트 작업들)

---

## 🔄 의존성 및 실행 순서

### 필수 순서
1. **Phase 1 완료** → Phase 2 시작 가능
2. **Phase 2 완료** → Phase 3 시작 가능
3. **Phase 3 완료** → Phase 4 시작 가능
4. **Phase 4 완료** → Phase 5 시작 가능

### 사용자 스토리 의존성
- **US1** (친구 연동 허용) → **US2** (위치 권한 허용) → **US3** (온보딩 완료)
- **US3** → **US4** (실패 처리)
- **US3** → **US5** (동의 거부)

### 병렬 실행 가능
- Phase 3의 컴포넌트 구현 작업들 (T014-T021)은 서로 독립적이므로 병렬 실행 가능
- Phase 5의 UI 테스트 작업들 (T042-T049)은 서로 독립적이므로 병렬 실행 가능

---

## 🎯 MVP 범위

**최소 기능 제품 (MVP)**은 다음 사용자 스토리를 포함합니다:
- **US1**: 친구 연동 허용 동의 완료
- **US2**: 위치 권한 허용 동의 완료
- **US3**: 온보딩 완료 및 메인 페이지 이동

**MVP 작업**: T001-T037 (총 37개 작업)

**추가 기능**:
- **US4**: 온보딩 완료 실패 처리 (T038-T040)
- **US5**: 동의 거부 후 온보딩 완료 (E2E 테스트 포함)

---

## ✅ 독립적 테스트 기준

각 사용자 스토리는 다음 기준으로 독립적으로 테스트 가능합니다:

### US1: 친구 연동 허용 동의 완료
- [ ] 친구 연동 허용 화면이 표시됨
- [ ] 동의/거부 선택 UI가 동작함
- [ ] 다음 단계로 이동 가능함

### US2: 위치 권한 허용 동의 완료
- [ ] 위치 권한 허용 화면이 표시됨
- [ ] 동의/거부 선택 UI가 동작함
- [ ] 온보딩 완료 버튼이 표시됨

### US3: 온보딩 완료 및 메인 페이지 이동
- [ ] 두 동의 상태가 서버로 전송됨
- [ ] 온보딩 완료 성공 시 메인 페이지로 이동함
- [ ] 로딩 상태가 표시됨

### US4: 온보딩 완료 실패 처리
- [ ] 서버 오류 시 오류 메시지가 표시됨
- [ ] 다시 시도 가능함
- [ ] 선택한 동의 상태가 유지됨

### US5: 동의 거부 후 온보딩 완료
- [ ] 거부 상태도 정상적으로 서버로 전송됨
- [ ] 온보딩 완료 성공 시 메인 페이지로 이동함

---

## 📝 구현 전략

### 점진적 전달
1. **Phase 1-2**: API 레이어 및 E2E 테스트 인프라 구축
2. **Phase 3**: Mock 데이터 기반 UI 완성 (사용자 승인 대기)
3. **Phase 4**: 실제 API 연결 및 데이터 바인딩
4. **Phase 5**: 최종 UI 테스트 및 검증

### 우선순위
- **P1 (최우선)**: US1, US2, US3 (핵심 온보딩 플로우)
- **P2 (중요)**: US4 (에러 처리)
- **P3 (선택)**: US5 (동의 거부 시나리오 - E2E 테스트)

---

**다음 단계**: `/speckit.implement`를 실행하여 단계별 구현을 시작합니다.
