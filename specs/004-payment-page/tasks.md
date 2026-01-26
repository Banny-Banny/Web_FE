# Tasks: 결제 페이지

**Input**: Design documents from `/specs/004-payment-page/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: E2E 테스트와 UI 테스트 포함 (Playwright)

**Organization**: TimeEgg 워크플로우 기반 - API 연결 → E2E 테스트 → UI 구현 → 데이터 바인딩 → UI 테스트

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 처리 가능 (다른 파일, 의존성 없음)
- **[Story]**: 사용자 스토리 라벨 (US1, US2, US3)
- 모든 작업에 정확한 파일 경로 포함

---

## Phase 1: 프로젝트 설정

**목적**: 결제 페이지 구현을 위한 기본 설정 및 의존성 설치

- [x] T001 토스페이먼츠 SDK 패키지 설치 (`npm install @tosspayments/payment-widget-sdk`)
- [x] T002 환경 변수 설정 (`.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 추가, `.env.example` 업데이트 완료)
- [x] T003 [P] 결제 페이지 디렉토리 구조 생성 (`src/components/Payment/`, `src/app/(main)/payment/`)

**Checkpoint**: 프로젝트 설정 완료 - API 연결 단계로 진행 가능

---

## Phase 2: API 연결 레이어

**목적**: 주문 정보 조회 API와 React Query 훅 구현

**⚠️ CRITICAL**: 이 단계가 완료되어야 UI 구현 및 데이터 바인딩이 가능합니다

- [ ] T004 `src/commons/apis/orders/hooks/useOrder.ts` 생성 - 주문 정보 조회 React Query 훅 (`getOrder` API 래핑)
- [ ] T005 `src/commons/apis/orders/hooks/useOrderStatus.ts` 생성 - 주문 상태 조회 React Query 훅 (`getOrderStatus` API 래핑, 폴링 로직 포함)
- [ ] T006 [P] `src/commons/utils/payment.ts` 생성 - 결제 관련 유틸리티 함수 (결제 ID 생성 등)

**Checkpoint**: API 연결 레이어 완료 - E2E 테스트 및 UI 구현 시작 가능

---

## Phase 3: E2E 테스트 작성 (Playwright)

**목적**: 전체 결제 플로우 검증을 위한 E2E 테스트 작성

- [ ] T007 `tests/e2e/payment/payment.spec.ts` 생성 - 결제 페이지 E2E 테스트 (주문 정보 조회, 결제 플로우, 에러 처리)
- [ ] T008 [P] `tests/e2e/payment/fixtures/mockData.ts` 생성 - 테스트용 Mock 데이터 (주문 정보, 결제 응답 등)

**Checkpoint**: E2E 테스트 작성 완료 - UI 구현 시작 가능

---

## Phase 4: UI 구현 (Mock 데이터 기반)

**목적**: 375px 고정 레이아웃 기준 Mock 데이터 기반 UI 컴포넌트 구현

### Phase 4.1: US1 - 주문 정보 확인 및 결제 완료 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 주문 정보를 확인하고 토스 결제를 완료할 수 있는 기능

**Independent Test**: 주문 ID로 결제 페이지 접근 → 주문 정보 표시 확인 → 결제 금액 확인 → 결제 진행 (모킹) → 결제 완료 처리 확인

#### 타입 및 Mock 데이터

- [ ] T009 [US1] `src/components/Payment/types.ts` 생성 - 결제 페이지 컴포넌트 타입 정의 (`PaymentPageProps`, `OrderSummaryData`, `PaymentState` 등)
- [ ] T010 [P] [US1] `src/components/Payment/mocks/data.ts` 생성 - Mock 주문 데이터 및 결제 상태 데이터

#### UI 컴포넌트 구현

- [ ] T011 [P] [US1] `src/components/Payment/components/OrderSummary/index.tsx` 생성 - 주문 정보 요약 컴포넌트 (Mock 데이터 사용)
- [ ] T012 [P] [US1] `src/components/Payment/components/OrderSummary/types.ts` 생성 - OrderSummary 컴포넌트 타입 정의
- [ ] T013 [P] [US1] `src/components/Payment/components/OrderSummary/styles.module.css` 생성 - OrderSummary 스타일 (375px 고정, Figma 디자인 준수)
- [ ] T014 [P] [US1] `src/components/Payment/components/PaymentAmount/index.tsx` 생성 - 결제 금액 표시 컴포넌트 (Mock 데이터 사용)
- [ ] T015 [P] [US1] `src/components/Payment/components/PaymentAmount/types.ts` 생성 - PaymentAmount 컴포넌트 타입 정의
- [ ] T016 [P] [US1] `src/components/Payment/components/PaymentAmount/styles.module.css` 생성 - PaymentAmount 스타일 (375px 고정, Figma 디자인 준수)
- [ ] T017 [P] [US1] `src/components/Payment/components/TossPaymentWidget/index.tsx` 생성 - 토스 결제 위젯 래퍼 컴포넌트 (초기에는 플레이스홀더, Mock 데이터 사용)
- [ ] T018 [P] [US1] `src/components/Payment/components/TossPaymentWidget/types.ts` 생성 - TossPaymentWidget 컴포넌트 타입 정의
- [ ] T019 [P] [US1] `src/components/Payment/components/TossPaymentWidget/styles.module.css` 생성 - TossPaymentWidget 스타일 (375px 고정, Figma 디자인 준수)
- [ ] T020 [P] [US1] `src/components/Payment/components/PaymentStatus/index.tsx` 생성 - 결제 상태 표시 컴포넌트 (Mock 데이터 사용)
- [ ] T021 [P] [US1] `src/components/Payment/components/PaymentStatus/types.ts` 생성 - PaymentStatus 컴포넌트 타입 정의
- [ ] T022 [P] [US1] `src/components/Payment/components/PaymentStatus/styles.module.css` 생성 - PaymentStatus 스타일 (375px 고정, Figma 디자인 준수)

#### 메인 컨테이너 및 라우팅

- [ ] T023 [US1] `src/components/Payment/index.tsx` 생성 - Payment 메인 컨테이너 컴포넌트 (Mock 데이터 사용, 모든 하위 컴포넌트 통합)
- [ ] T024 [US1] `src/components/Payment/styles.module.css` 생성 - Payment 컨테이너 스타일 (375px 고정)
- [ ] T025 [US1] `src/app/(main)/payment/page.tsx` 생성 - 결제 페이지 라우팅 (Payment 컴포넌트 import 및 렌더링)

**Checkpoint**: US1 UI 구현 완료 - Mock 데이터 기반으로 독립적으로 테스트 가능

---

### Phase 4.2: US2 - 주문 정보 수정 필요 시 처리 (Priority: P2)

**Goal**: 사용자가 주문 정보를 확인하고 수정이 필요한 경우 이전 페이지로 돌아갈 수 있는 기능

**Independent Test**: 결제 페이지에서 주문 정보 확인 → 이전 페이지로 이동 버튼 클릭 → 타임캡슐 생성 페이지로 이동 확인

#### UI 컴포넌트 구현

- [ ] T026 [P] [US2] `src/components/Payment/components/BackButton/index.tsx` 생성 - 이전 페이지로 이동 버튼 컴포넌트
- [ ] T027 [P] [US2] `src/components/Payment/components/BackButton/types.ts` 생성 - BackButton 컴포넌트 타입 정의
- [ ] T028 [P] [US2] `src/components/Payment/components/BackButton/styles.module.css` 생성 - BackButton 스타일 (375px 고정, Figma 디자인 준수)

#### 통합

- [ ] T029 [US2] `src/components/Payment/index.tsx` 수정 - BackButton 컴포넌트 통합

**Checkpoint**: US2 UI 구현 완료 - Mock 데이터 기반으로 독립적으로 테스트 가능

---

### Phase 4.3: US3 - 결제 과정 오류 처리 (Priority: P1)

**Goal**: 결제 과정에서 발생하는 오류를 적절하게 처리하고 사용자에게 안내하는 기능

**Independent Test**: 네트워크 오류 발생 → 오류 메시지 표시 확인 → 재시도 옵션 제공 확인

#### UI 컴포넌트 구현

- [ ] T030 [P] [US3] `src/components/Payment/components/ErrorDisplay/index.tsx` 생성 - 오류 메시지 표시 컴포넌트 (Mock 데이터 사용)
- [ ] T031 [P] [US3] `src/components/Payment/components/ErrorDisplay/types.ts` 생성 - ErrorDisplay 컴포넌트 타입 정의
- [ ] T032 [P] [US3] `src/components/Payment/components/ErrorDisplay/styles.module.css` 생성 - ErrorDisplay 스타일 (375px 고정, Figma 디자인 준수)
- [ ] T033 [P] [US3] `src/components/Payment/components/RetryButton/index.tsx` 생성 - 재시도 버튼 컴포넌트
- [ ] T034 [P] [US3] `src/components/Payment/components/RetryButton/types.ts` 생성 - RetryButton 컴포넌트 타입 정의
- [ ] T035 [P] [US3] `src/components/Payment/components/RetryButton/styles.module.css` 생성 - RetryButton 스타일 (375px 고정, Figma 디자인 준수)

#### 통합

- [ ] T036 [US3] `src/components/Payment/index.tsx` 수정 - ErrorDisplay 및 RetryButton 컴포넌트 통합

**Checkpoint**: US3 UI 구현 완료 - Mock 데이터 기반으로 독립적으로 테스트 가능

---

## Phase 5: 데이터 바인딩

**목적**: Mock 데이터를 실제 API 호출로 교체하고 토스 결제 위젯 실제 연동

### Phase 5.1: US1 - 주문 정보 확인 및 결제 완료 데이터 바인딩

#### 비즈니스 로직 훅 구현

- [ ] T037 [US1] `src/components/Payment/hooks/useOrderInfo.ts` 생성 - 주문 정보 조회 및 상태 관리 훅 (React Query 훅 활용)
- [ ] T038 [US1] `src/components/Payment/hooks/usePayment.ts` 생성 - 결제 플로우 관리 훅 (토스페이먼츠 SDK 연동, 결제 요청/완료 처리)

#### 컴포넌트 데이터 바인딩

- [ ] T039 [US1] `src/components/Payment/index.tsx` 수정 - Mock 데이터를 실제 API 호출로 교체 (`useOrderInfo`, `usePayment` 훅 사용)
- [ ] T040 [US1] `src/components/Payment/components/OrderSummary/index.tsx` 수정 - 실제 주문 데이터 바인딩 및 로딩/에러 상태 처리
- [ ] T041 [US1] `src/components/Payment/components/PaymentAmount/index.tsx` 수정 - 실제 결제 금액 데이터 바인딩
- [ ] T042 [US1] `src/components/Payment/components/TossPaymentWidget/index.tsx` 수정 - 토스페이먼츠 SDK 실제 연동 (동적 임포트, 결제 요청/완료 처리)
- [ ] T043 [US1] `src/components/Payment/components/PaymentStatus/index.tsx` 수정 - 실제 결제 상태 데이터 바인딩

#### 결제 완료 API 연동

- [ ] T044 [US1] `src/commons/apis/payment/index.ts` 생성 - 결제 완료 API 함수 (`POST /api/payment/complete`)
- [ ] T045 [US1] `src/commons/apis/payment/types.ts` 생성 - 결제 API 타입 정의
- [ ] T046 [US1] `src/components/Payment/hooks/usePayment.ts` 수정 - 결제 완료 API 호출 로직 추가

**Checkpoint**: US1 데이터 바인딩 완료 - 실제 API와 결제 위젯 연동 완료

---

### Phase 5.2: US2 - 주문 정보 수정 필요 시 처리 데이터 바인딩

#### 통합

- [ ] T047 [US2] `src/components/Payment/components/BackButton/index.tsx` 수정 - 실제 라우팅 로직 구현 (타임캡슐 생성 페이지로 이동)

**Checkpoint**: US2 데이터 바인딩 완료 - 실제 라우팅 연동 완료

---

### Phase 5.3: US3 - 결제 과정 오류 처리 데이터 바인딩

#### 오류 처리 로직 구현

- [ ] T048 [US3] `src/components/Payment/hooks/usePayment.ts` 수정 - 네트워크 오류, 결제 실패 등 오류 처리 로직 추가
- [ ] T049 [US3] `src/components/Payment/components/ErrorDisplay/index.tsx` 수정 - 실제 오류 상태 데이터 바인딩
- [ ] T050 [US3] `src/components/Payment/components/RetryButton/index.tsx` 수정 - 재시도 로직 구현

**Checkpoint**: US3 데이터 바인딩 완료 - 실제 오류 처리 연동 완료

---

## Phase 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

- [ ] T051 [P] `tests/e2e/payment/payment-ui.spec.ts` 생성 - 결제 페이지 UI 테스트 (컴포넌트 렌더링, 사용자 상호작용, 시각적 검증)
- [ ] T052 [P] `tests/e2e/payment/payment-ui.spec.ts` 수정 - 주문 정보 표시 테스트 추가
- [ ] T053 [P] `tests/e2e/payment/payment-ui.spec.ts` 수정 - 결제 금액 표시 테스트 추가
- [ ] T054 [P] `tests/e2e/payment/payment-ui.spec.ts` 수정 - 결제 위젯 연동 테스트 추가
- [ ] T055 [P] `tests/e2e/payment/payment-ui.spec.ts` 수정 - 결제 상태 표시 테스트 추가
- [ ] T056 [P] `tests/e2e/payment/payment-ui.spec.ts` 수정 - 오류 처리 테스트 추가

**Checkpoint**: UI 테스트 완료 - 프로덕션 준비 완료

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (프로젝트 설정)**: 의존성 없음 - 즉시 시작 가능
- **Phase 2 (API 연결)**: Phase 1 완료 후 시작 - 모든 UI 및 데이터 바인딩 단계의 전제 조건
- **Phase 3 (E2E 테스트)**: Phase 2 완료 후 시작 가능
- **Phase 4 (UI 구현)**: Phase 2 완료 후 시작 가능 - Mock 데이터 기반으로 독립적 구현 가능
- **Phase 5 (데이터 바인딩)**: Phase 2 및 Phase 4 완료 후 시작 - 실제 API와 UI 연결
- **Phase 6 (UI 테스트)**: Phase 5 완료 후 시작 - 통합된 기능 검증

### User Story Dependencies

- **US1 (P1)**: Phase 2 완료 후 시작 가능 - 다른 스토리와 독립적
- **US2 (P2)**: Phase 2 완료 후 시작 가능 - US1과 독립적이지만 UI 통합 필요
- **US3 (P1)**: Phase 2 완료 후 시작 가능 - US1과 독립적이지만 UI 통합 필요

### Within Each User Story

- 타입 정의 → Mock 데이터 → UI 컴포넌트 → 컨테이너 → 라우팅 순서
- 데이터 바인딩: 훅 구현 → 컴포넌트 수정 순서
- 병렬 처리 가능한 작업은 [P] 마커로 표시

### Parallel Opportunities

- Phase 1의 모든 작업은 병렬 처리 가능
- Phase 2의 T006는 T004, T005와 병렬 처리 가능
- Phase 4의 UI 컴포넌트 작업들은 모두 병렬 처리 가능 ([P] 마커)
- Phase 5의 일부 작업은 병렬 처리 가능
- Phase 6의 UI 테스트 작업들은 모두 병렬 처리 가능 ([P] 마커)

---

## Implementation Strategy

### MVP First (US1 Only)

1. Phase 1: 프로젝트 설정 완료
2. Phase 2: API 연결 레이어 완료
3. Phase 3: E2E 테스트 작성 완료
4. Phase 4.1: US1 UI 구현 완료 (Mock 데이터)
5. Phase 5.1: US1 데이터 바인딩 완료
6. Phase 6: UI 테스트 완료
7. **STOP and VALIDATE**: US1 독립적으로 테스트 및 검증

### Incremental Delivery

1. Setup + API 연결 → 기반 준비 완료
2. US1 추가 → 독립적으로 테스트 → 배포/데모 (MVP!)
3. US2 추가 → 독립적으로 테스트 → 배포/데모
4. US3 추가 → 독립적으로 테스트 → 배포/데모
5. 각 스토리는 이전 스토리를 깨뜨리지 않고 독립적으로 작동

### Parallel Team Strategy

여러 개발자가 있을 경우:

1. 팀이 Setup + API 연결을 함께 완료
2. API 연결 완료 후:
   - 개발자 A: US1 UI 구현
   - 개발자 B: US2 UI 구현
   - 개발자 C: US3 UI 구현
3. UI 구현 완료 후:
   - 개발자 A: US1 데이터 바인딩
   - 개발자 B: US2 데이터 바인딩
   - 개발자 C: US3 데이터 바인딩
4. 스토리별로 독립적으로 완료 및 통합

---

## Notes

- [P] 작업 = 다른 파일, 의존성 없음
- [Story] 라벨 = 특정 사용자 스토리와의 추적 가능성
- 각 사용자 스토리는 독립적으로 완료 및 테스트 가능해야 함
- E2E 테스트는 구현 전에 작성하여 실패 확인
- 각 작업 또는 논리적 그룹 후 커밋
- 모든 체크포인트에서 스토리를 독립적으로 검증 가능
- 피해야 할 것: 모호한 작업, 같은 파일 충돌, 독립성을 깨뜨리는 스토리 간 의존성
- 375px 고정 레이아웃 준수
- Figma 디자인 시안 pixel-perfect 수준으로 구현
- 디자인 토큰 활용 (하드코딩된 색상 값 사용 금지)

---

## 작업 통계

- **총 작업 수**: 56개
- **Phase 1 (프로젝트 설정)**: 3개
- **Phase 2 (API 연결)**: 3개
- **Phase 3 (E2E 테스트)**: 2개
- **Phase 4 (UI 구현)**: 27개
  - US1: 17개
  - US2: 4개
  - US3: 6개
- **Phase 5 (데이터 바인딩)**: 14개
  - US1: 10개
  - US2: 1개
  - US3: 3개
- **Phase 6 (UI 테스트)**: 6개

- **병렬 처리 가능 작업**: 30개 이상
- **MVP 범위 (US1만)**: Phase 1-3, Phase 4.1, Phase 5.1, Phase 6 (약 35개 작업)
