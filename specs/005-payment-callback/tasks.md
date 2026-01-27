# Tasks: 결제 승인 및 콜백 처리

**Input**: Design documents from `/specs/005-payment-callback/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: E2E 테스트와 UI 테스트 포함 (Playwright)

**Organization**: TimeEgg 워크플로우 기반 - API 연결 → E2E 테스트 → UI 구현 → 데이터 바인딩 → UI 테스트

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 처리 가능 (다른 파일, 의존성 없음)
- **[Story]**: 사용자 스토리 라벨 (US1, US2, US3)
- 모든 작업에 정확한 파일 경로 포함

---

## Phase 1: 프로젝트 설정

**목적**: 결제 승인 및 콜백 처리 기능 구현을 위한 기본 설정

- [x] T001 [P] 결제 콜백 페이지 디렉토리 구조 생성 (`src/components/PaymentCallback/`, `src/app/(main)/payment/success/`, `src/app/(main)/payment/fail/`)

**Checkpoint**: 프로젝트 설정 완료 - API 연결 단계로 진행 가능

---

## Phase 2: API 연결 레이어

**목적**: 결제 승인 API와 대기실 생성 API 구현

**⚠️ CRITICAL**: 이 단계가 완료되어야 UI 구현 및 데이터 바인딩이 가능합니다

### API 엔드포인트 및 타입 정의

- [x] T002 `src/commons/apis/endpoints.ts` 수정 - `PAYMENT_ENDPOINTS.CONFIRM` 엔드포인트 추가 (`/api/payments/toss/confirm`)
- [x] T003 `src/commons/apis/endpoints.ts` 수정 - `CAPSULE_ENDPOINTS.CREATE_WAITING_ROOM` 엔드포인트 추가 (`/api/capsules/step-rooms/create`)
- [x] T004 `src/commons/apis/payment/types.ts` 수정 - `ConfirmPaymentRequest` (paymentKey, orderId, amount), `ConfirmPaymentResponse` (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url), `TossPaymentCallbackParams` 타입 추가
- [x] T005 `src/commons/apis/capsules/types.ts` 생성 - `CreateWaitingRoomRequest`, `CreateWaitingRoomResponse` 타입 정의

### API 함수 구현

- [x] T006 `src/commons/apis/payment/index.ts` 수정 - `confirmPayment` 함수 추가 (결제 승인 API 호출, JWT Bearer 토큰 포함, 에러 처리: 400 AMOUNT_MISMATCH/ORDER_ALREADY_PAID, 401 ORDER_NOT_OWNED, 404 ORDER_NOT_FOUND/PRODUCT_NOT_FOUND_OR_INVALID)
- [x] T007 `src/commons/apis/capsules/index.ts` 생성 - `createWaitingRoom` 함수 구현 (대기실 생성 API 호출)
- [x] T008 `src/commons/apis/capsules/hooks/index.ts` 생성 - hooks export 파일 생성

### React Query 훅 구현

- [x] T009 `src/commons/apis/payment/hooks/useConfirmPayment.ts` 생성 - 결제 승인 React Query mutation 훅 구현
- [x] T010 `src/commons/apis/capsules/hooks/useCreateWaitingRoom.ts` 생성 - 대기실 생성 React Query mutation 훅 구현
- [x] T011 `src/commons/apis/payment/hooks/index.ts` 생성 - `useConfirmPayment` export 추가

### 유틸리티 함수

- [x] T012 [P] `src/commons/utils/payment.ts` 생성 - 결제 관련 유틸리티 함수 (`extractPaymentInfoFromUrl` - URL 쿼리 파라미터에서 paymentKey, orderId, amount 추출, `convertErrorCodeToMessage` - 에러 코드를 사용자 친화적인 메시지로 변환: AMOUNT_MISMATCH, ORDER_ALREADY_PAID, ORDER_NOT_FOUND, ORDER_NOT_OWNED, PRODUCT_NOT_FOUND_OR_INVALID, TOSS_SECRET_KEY_REQUIRED, TOSS_CONFIRM_FAILED)

**Checkpoint**: API 연결 레이어 완료 - E2E 테스트 및 UI 구현 시작 가능

---

## Phase 3: E2E 테스트 작성 (Playwright)

**목적**: 전체 결제 승인 및 콜백 처리 플로우 검증을 위한 E2E 테스트 작성

- [x] T013 `tests/e2e/payment/payment-callback.spec.ts` 생성 - 결제 승인 및 콜백 처리 E2E 테스트 (결제 성공 플로우, 결제 실패 플로우, 오류 처리, 중복 처리 방지)
- [x] T014 [P] `tests/e2e/payment/fixtures/mockData.ts` 수정 - 결제 승인 및 콜백 처리 테스트용 Mock 데이터 추가 (결제 승인 응답, 대기실 생성 응답, 실패 응답 등)

**Checkpoint**: E2E 테스트 작성 완료 - UI 구현 시작 가능

---

## Phase 4: UI 구현 (Mock 데이터 기반)

**목적**: 375px 고정 레이아웃 기준 Mock 데이터 기반 UI 컴포넌트 구현

**⚠️ Figma MCP 연결 필수**: 모든 UI 컴포넌트 구현 전에 Figma 디자인 정보를 MCP를 통해 가져와야 함

### Phase 4.0: Figma 디자인 정보 수집

**목적**: Figma MCP를 통해 결제 성공/실패 페이지 디자인 정보를 가져와 구현 가이드 확보

- [ ] T015 Figma MCP 연결 및 결제 성공 페이지 디자인 정보 확인 - 결제 성공 페이지 디자인 노드 정보 수집
- [ ] T016 Figma MCP 연결 및 결제 실패 페이지 디자인 정보 확인 - 결제 실패 페이지 디자인 노드 정보 수집
- [ ] T017 디자인 토큰 추출 (색상, 간격, 타이포그래피 등) - 결제 콜백 페이지 관련 디자인 토큰 확인
- [ ] T018 `tailwind.config.js` 디자인 토큰 변수 확인 및 필요 시 업데이트 - 결제 콜백 페이지 디자인 토큰 확인

**Checkpoint**: Figma 디자인 정보 수집 완료 - UI 컴포넌트 구현 시작 가능

---

### Phase 4.1: US1 - 결제 성공 콜백 처리 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 결제를 완료하고 성공 결과를 확인하며 대기실로 이동하는 기능

**Independent Test**: 결제 성공 콜백 페이지 접근 → 결제 정보 파라미터 추출 확인 → 결제 승인 처리 확인 → 대기실 생성 확인 → 대기실 페이지 이동 확인

#### 타입 및 Mock 데이터

- [ ] T019 [US1] `src/components/PaymentCallback/Success/types.ts` 생성 - 결제 성공 페이지 컴포넌트 타입 정의 (`PaymentSuccessPageProps`, `PaymentSuccessState` 등)
- [ ] T020 [P] [US1] `src/components/PaymentCallback/Success/mocks/data.ts` 생성 - Mock 결제 승인 데이터 및 대기실 생성 데이터

#### UI 컴포넌트 구현

**⚠️ Figma 디자인 참조 필수**: 각 컴포넌트 구현 시 Phase 4.0에서 수집한 Figma 디자인 정보를 참조하여 pixel-perfect 수준으로 구현

- [ ] T021 [P] [US1] `src/components/PaymentCallback/Success/components/LoadingState/index.tsx` 생성 - 로딩 상태 표시 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T022 [P] [US1] `src/components/PaymentCallback/Success/components/LoadingState/types.ts` 생성 - LoadingState 컴포넌트 타입 정의
- [ ] T023 [P] [US1] `src/components/PaymentCallback/Success/components/LoadingState/styles.module.css` 생성 - LoadingState 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T024 [P] [US1] `src/components/PaymentCallback/Success/components/SuccessMessage/index.tsx` 생성 - 성공 메시지 표시 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T025 [P] [US1] `src/components/PaymentCallback/Success/components/SuccessMessage/types.ts` 생성 - SuccessMessage 컴포넌트 타입 정의
- [ ] T026 [P] [US1] `src/components/PaymentCallback/Success/components/SuccessMessage/styles.module.css` 생성 - SuccessMessage 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T027 [P] [US1] `src/components/PaymentCallback/Success/components/ErrorMessage/index.tsx` 생성 - 에러 메시지 표시 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T028 [P] [US1] `src/components/PaymentCallback/Success/components/ErrorMessage/types.ts` 생성 - ErrorMessage 컴포넌트 타입 정의
- [ ] T029 [P] [US1] `src/components/PaymentCallback/Success/components/ErrorMessage/styles.module.css` 생성 - ErrorMessage 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T030 [US1] `src/components/PaymentCallback/Success/index.tsx` 생성 - 결제 성공 페이지 메인 컨테이너 컴포넌트 (Mock 데이터 사용, 상태별 컴포넌트 렌더링)
- [ ] T031 [US1] `src/components/PaymentCallback/Success/styles.module.css` 생성 - PaymentSuccess 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)

#### 라우팅 통합

- [ ] T032 [US1] `src/app/(main)/payment/success/page.tsx` 생성 - 결제 성공 콜백 라우팅 (PaymentSuccess 컴포넌트 import 및 렌더링)

**Checkpoint**: US1 UI 구현 완료 - 독립적으로 테스트 가능, MVP 배포 가능

---

### Phase 4.2: US2 - 결제 실패 콜백 처리 (Priority: P1)

**Goal**: 사용자가 결제 실패 결과를 확인하고 재시도할 수 있는 기능

**Independent Test**: 결제 실패 콜백 페이지 접근 → 실패 정보 파라미터 추출 확인 → 실패 메시지 표시 확인 → 재시도 옵션 확인 → 이전 페이지 이동 확인

#### 타입 및 Mock 데이터

- [ ] T033 [US2] `src/components/PaymentCallback/Fail/types.ts` 생성 - 결제 실패 페이지 컴포넌트 타입 정의 (`PaymentFailPageProps`, `PaymentFailState` 등)
- [ ] T034 [P] [US2] `src/components/PaymentCallback/Fail/mocks/data.ts` 생성 - Mock 결제 실패 데이터

#### UI 컴포넌트 구현

**⚠️ Figma 디자인 참조 필수**: 각 컴포넌트 구현 시 Phase 4.0에서 수집한 Figma 디자인 정보를 참조하여 pixel-perfect 수준으로 구현

- [ ] T035 [P] [US2] `src/components/PaymentCallback/Fail/components/FailIcon/index.tsx` 생성 - 실패 아이콘 컴포넌트 (Figma 디자인 기반)
- [ ] T036 [P] [US2] `src/components/PaymentCallback/Fail/components/FailIcon/types.ts` 생성 - FailIcon 컴포넌트 타입 정의
- [ ] T037 [P] [US2] `src/components/PaymentCallback/Fail/components/FailIcon/styles.module.css` 생성 - FailIcon 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T038 [P] [US2] `src/components/PaymentCallback/Fail/components/FailMessage/index.tsx` 생성 - 실패 메시지 표시 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T039 [P] [US2] `src/components/PaymentCallback/Fail/components/FailMessage/types.ts` 생성 - FailMessage 컴포넌트 타입 정의
- [ ] T040 [P] [US2] `src/components/PaymentCallback/Fail/components/FailMessage/styles.module.css` 생성 - FailMessage 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T041 [P] [US2] `src/components/PaymentCallback/Fail/components/RetryButton/index.tsx` 생성 - 재시도 버튼 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T042 [P] [US2] `src/components/PaymentCallback/Fail/components/RetryButton/types.ts` 생성 - RetryButton 컴포넌트 타입 정의
- [ ] T043 [P] [US2] `src/components/PaymentCallback/Fail/components/RetryButton/styles.module.css` 생성 - RetryButton 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T044 [P] [US2] `src/components/PaymentCallback/Fail/components/BackButton/index.tsx` 생성 - 이전 페이지로 돌아가기 버튼 컴포넌트 (Mock 데이터 사용, Figma 디자인 기반)
- [ ] T045 [P] [US2] `src/components/PaymentCallback/Fail/components/BackButton/types.ts` 생성 - BackButton 컴포넌트 타입 정의
- [ ] T046 [P] [US2] `src/components/PaymentCallback/Fail/components/BackButton/styles.module.css` 생성 - BackButton 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)
- [ ] T047 [US2] `src/components/PaymentCallback/Fail/index.tsx` 생성 - 결제 실패 페이지 메인 컨테이너 컴포넌트 (Mock 데이터 사용)
- [ ] T048 [US2] `src/components/PaymentCallback/Fail/styles.module.css` 생성 - PaymentFail 스타일 (375px 고정, Figma MCP 디자인 정보 기반, tailwind.config.js 토큰 사용)

#### 라우팅 통합

- [ ] T049 [US2] `src/app/(main)/payment/fail/page.tsx` 생성 - 결제 실패 콜백 라우팅 (PaymentFail 컴포넌트 import 및 렌더링)

**Checkpoint**: US2 UI 구현 완료 - 독립적으로 테스트 가능

---

### Phase 4.3: US3 - 결제 승인 처리 중 오류 처리 (Priority: P2)

**Goal**: 결제 승인 처리 중 발생하는 오류를 적절하게 처리하고 사용자에게 안내하는 기능

**Independent Test**: 결제 승인 처리 중 네트워크 오류 발생 → 오류 메시지 표시 확인 → 재시도 옵션 확인 → 주문 상태 조회 확인

#### 오류 처리 컴포넌트 확장

- [ ] T050 [US3] `src/components/PaymentCallback/Success/components/ErrorMessage/index.tsx` 수정 - 재시도 옵션 및 주문 상태 조회 기능 추가
- [ ] T051 [US3] `src/components/PaymentCallback/Success/components/ErrorMessage/types.ts` 수정 - 재시도 핸들러 및 주문 상태 조회 핸들러 타입 추가

**Checkpoint**: US3 UI 구현 완료 - 독립적으로 테스트 가능

---

## Phase 5: 데이터 바인딩

**목적**: 실제 API와 UI 연결, 결제 승인 및 대기실 생성 플로우 완성

### US1 데이터 바인딩

- [ ] T052 [US1] `src/components/PaymentCallback/Success/hooks/usePaymentSuccess.ts` 생성 - 결제 성공 처리 훅 구현 (URL 파라미터 추출, 결제 승인 API 호출, 응답의 capsule_id로 대기실 페이지 이동, 대기실 생성 API 호출은 백엔드 구현 확인 후 필요 시 추가, 오류 처리 및 에러 코드 변환, 중복 처리 방지)
- [ ] T053 [US1] `src/components/PaymentCallback/Success/index.tsx` 수정 - Mock 데이터를 실제 API 호출로 교체, `usePaymentSuccess` 훅 연결
- [ ] T054 [US1] `src/components/PaymentCallback/Success/components/LoadingState/index.tsx` 수정 - 실제 로딩 상태에 따른 메시지 표시 (결제 승인 중, 대기실 생성 중은 백엔드 구현 확인 후 필요 시 추가)
- [ ] T055 [US1] `src/components/PaymentCallback/Success/components/ErrorMessage/index.tsx` 수정 - 실제 에러 상태에 따른 에러 메시지 표시 및 재시도 로직 연결

### US2 데이터 바인딩

- [ ] T056 [US2] `src/components/PaymentCallback/Fail/hooks/usePaymentFail.ts` 생성 - 결제 실패 처리 훅 구현 (URL 파라미터 추출, 실패 원인을 사용자 친화적인 메시지로 변환, 재시도 및 뒤로가기 처리)
- [ ] T057 [US2] `src/components/PaymentCallback/Fail/index.tsx` 수정 - Mock 데이터를 실제 URL 파라미터로 교체, `usePaymentFail` 훅 연결
- [ ] T058 [US2] `src/components/PaymentCallback/Fail/components/FailMessage/index.tsx` 수정 - 실제 실패 원인에 따른 메시지 표시
- [ ] T059 [US2] `src/components/PaymentCallback/Fail/components/RetryButton/index.tsx` 수정 - 실제 재시도 로직 연결 (결제 페이지로 이동)
- [ ] T060 [US2] `src/components/PaymentCallback/Fail/components/BackButton/index.tsx` 수정 - 실제 뒤로가기 로직 연결

### US3 데이터 바인딩

- [ ] T061 [US3] `src/components/PaymentCallback/Success/hooks/usePaymentSuccess.ts` 수정 - 네트워크 오류 자동 재시도 로직 추가, 주문 상태 조회 기능 추가
- [ ] T062 [US3] `src/components/PaymentCallback/Success/components/ErrorMessage/index.tsx` 수정 - 주문 상태 조회 버튼 및 기능 연결

**Checkpoint**: 데이터 바인딩 완료 - 완전히 작동하는 결제 승인 및 콜백 처리 기능

---

## Phase 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

- [ ] T063 [P] `tests/e2e/payment/payment-callback-ui.spec.ts` 생성 - 결제 콜백 페이지 UI 테스트 (결제 성공 페이지 렌더링, 결제 실패 페이지 렌더링, 로딩 상태 표시, 에러 메시지 표시, 버튼 상호작용, 375px 모바일 프레임 기준 테스트)

**Checkpoint**: UI 테스트 완료 - 프로덕션 준비 완료

---

## 작업 통계

- **총 작업 수**: 63개
- **Phase 1 (프로젝트 설정)**: 1개
- **Phase 2 (API 연결)**: 11개
- **Phase 3 (E2E 테스트)**: 2개
- **Phase 4 (UI 구현)**: 36개
  - Phase 4.0 (Figma 디자인 수집): 4개
  - US1: 14개
  - US2: 17개
  - US3: 2개
- **Phase 5 (데이터 바인딩)**: 11개
  - US1: 4개
  - US2: 5개
  - US3: 2개
- **Phase 6 (UI 테스트)**: 1개

---

## 의존성 및 순서

### 스토리 완료 순서

1. **US1 (MVP)**: 결제 성공 콜백 처리
   - 독립적으로 완료 가능
   - Phase 4.1 → Phase 5 (US1) → Phase 6

2. **US2**: 결제 실패 콜백 처리
   - US1과 독립적
   - Phase 4.2 → Phase 5 (US2) → Phase 6

3. **US3**: 결제 승인 처리 중 오류 처리
   - US1에 의존 (오류 처리 확장)
   - Phase 4.3 → Phase 5 (US3) → Phase 6

### 병렬 처리 가능 작업

**Phase 2 (API 연결)**:
- T004, T005, T012는 병렬 처리 가능 (다른 파일)

**Phase 4 (UI 구현)**:
- US1의 모든 서브 컴포넌트는 병렬 처리 가능 (T021-T029)
- US2의 모든 서브 컴포넌트는 병렬 처리 가능 (T035-T046)

**Phase 6 (UI 테스트)**:
- T063은 다른 작업과 독립적으로 병렬 처리 가능

---

## Incremental Delivery

1. Setup + API 연결 → 기반 준비 완료
2. Figma 디자인 수집 → 디자인 가이드 확보
3. US1 추가 → 독립적으로 테스트 → 배포/데모 (MVP!)
4. US2 추가 → 독립적으로 테스트 → 배포/데모
5. US3 추가 → 독립적으로 테스트 → 배포/데모
6. 각 스토리는 이전 스토리를 깨뜨리지 않고 독립적으로 작동

### Parallel Team Strategy

여러 개발자가 있을 경우:

1. 팀이 Setup + API 연결을 함께 완료
2. 팀이 Figma 디자인 수집을 함께 완료 (Phase 4.0)
3. API 연결 및 디자인 수집 완료 후:
   - 개발자 A: US1 UI 구현
   - 개발자 B: US2 UI 구현
   - 개발자 C: US3 UI 구현
4. UI 구현 완료 후:
   - 개발자 A: US1 데이터 바인딩
   - 개발자 B: US2 데이터 바인딩
   - 개발자 C: US3 데이터 바인딩
5. 스토리별로 독립적으로 완료 및 통합

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
- **Figma MCP 필수**: Phase 4.0에서 Figma MCP를 통해 디자인 정보를 먼저 수집한 후 UI 컴포넌트 구현 시작
- Figma 디자인 시안 pixel-perfect 수준으로 구현
- 디자인 토큰 활용 (하드코딩된 색상 값 사용 금지, `tailwind.config.js`의 토큰 변수 사용)
- 대기실 페이지 경로는 `/waiting-room/{waitingRoomId}` 또는 `/waiting-room/{capsule_id}` 형식으로 가정 (실제 경로는 프로젝트 구조에 따라 조정 필요)
- **중요**: 결제 승인 API 응답에 `capsule_id`가 포함되어 있어 별도 대기실 생성 API 호출이 필요 없을 수 있음. 백엔드 구현 확인 후 대기실 생성 단계는 필요 시에만 추가
- 리다이렉트 URL(successUrl/failUrl)은 프론트엔드에서 Toss Payments SDK 호출 시 설정해야 하며, 백엔드는 리다이렉트 URL을 반환하지 않음
