# 토스 결제 페이지 작업 목록

## 📋 개요

이 문서는 토스 결제 페이지 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**총 작업 수**: 51개  
**우선순위**: P1 (필수) → P2 (중요) → P3 (선택)

---

## 🎯 Phase 0: 프로젝트 설정 및 의존성 설치

### T001: 토스페이먼츠 SDK 설치
**목표**: 토스 결제 위젯 연동을 위한 SDK 설치
**소요시간**: 5분
**의존성**: 없음

**작업 내용**:
1. `package.json` 확인
2. `@tosspayments/payment-widget-sdk` 설치:
   ```bash
   npm install @tosspayments/payment-widget-sdk
   ```

**확인할 파일**:
- `package.json`

**완료 기준**:
- [x] @tosspayments/payment-widget-sdk가 설치됨
- [x] package.json에 의존성이 추가됨

---

### T002: 환경 변수 설정 확인
**목표**: 개발 환경 변수 확인 및 설정
**소요시간**: 10분
**의존성**: 없음

**작업 내용**:
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 확인
3. 토스페이먼츠 클라이언트 키 설정 (필요시 `NEXT_PUBLIC_TOSS_CLIENT_KEY`)
4. API 베이스 URL 확인 (`NEXT_PUBLIC_API_BASE_URL`)

**확인할 파일**:
- `.env.local`

**완료 기준**:
- [x] NEXT_PUBLIC_DEV_TOKEN이 설정됨
- [x] 필요한 환경 변수가 모두 설정됨

---

### T003: API 엔드포인트 추가
**목표**: 주문 및 토스 결제 관련 API 엔드포인트 정의
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `src/commons/apis/endpoints.ts` 파일 확인
2. `ORDER_ENDPOINTS` 상수 추가:
   - `CREATE: '/api/orders'` - 주문 생성
   - `DETAIL: (id: string) => '/api/orders/${id}'` - 주문 조회
3. `PAYMENT_ENDPOINTS` 상수 추가:
   - `CONFIRM: '/api/payments/toss/confirm'` - 토스 결제 최종 승인
4. `ENDPOINTS` 객체에 `ORDER: ORDER_ENDPOINTS`, `PAYMENT: PAYMENT_ENDPOINTS` 추가

**수정할 파일**:
- `src/commons/apis/endpoints.ts`

**완료 기준**:
- [x] ORDER_ENDPOINTS가 정의됨
- [x] PAYMENT_ENDPOINTS가 정의됨
- [x] ENDPOINTS 객체에 ORDER와 PAYMENT가 추가됨
- [x] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 1: 프로젝트 구조 및 타입 정의

### T004: 프로젝트 디렉토리 구조 생성
**목표**: 결제 페이지를 위한 디렉토리 구조 생성
**소요시간**: 10분
**의존성**: 없음

**작업 내용**:
1. `src/components/PaymentPage/` 디렉토리 생성
2. 하위 디렉토리 생성:
   - `hooks/`
   - `components/`
   - `utils/`
3. `src/commons/apis/orders/` 디렉토리 생성
4. `src/commons/apis/payments/` 디렉토리 생성

**생성할 디렉토리**:
- `src/components/PaymentPage/`
- `src/components/PaymentPage/hooks/`
- `src/components/PaymentPage/components/`
- `src/components/PaymentPage/utils/`
- `src/commons/apis/orders/`
- `src/commons/apis/payments/`

**완료 기준**:
- [x] 모든 디렉토리가 생성됨
- [x] 디렉토리 구조가 plan.md와 일치함

---

### T005: 주문 관련 타입 정의
**목표**: 주문 관련 타입 정의
**소요시간**: 30분
**의존성**: T004

**작업 내용**:
1. `src/commons/apis/orders/types.ts` 파일 생성
2. 주문 관련 타입 정의:
   - `OrderStatus` enum (생성됨, 결제 대기, 결제 완료, 취소됨)
   - `CreateOrderRequest` 인터페이스
   - `CreateOrderResponse` 인터페이스
   - `GetOrderResponse` 인터페이스
   - `Order` 인터페이스

**생성할 파일**:
- `src/commons/apis/orders/types.ts`

**완료 기준**:
- [x] 모든 주문 관련 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

### T005-1: 토스 결제 관련 타입 정의
**목표**: 토스 결제 승인 관련 타입 정의
**소요시간**: 20분
**의존성**: T004

**작업 내용**:
1. `src/commons/apis/payments/types.ts` 파일 생성
2. 토스 결제 관련 타입 정의:
   - `ConfirmPaymentRequest` 인터페이스 (paymentKey, orderId, amount)
   - `ConfirmPaymentResponse` 인터페이스 (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url)
   - 에러 응답 타입

**생성할 파일**:
- `src/commons/apis/payments/types.ts`

**완료 기준**:
- [x] 모든 토스 결제 관련 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

### T006: 결제 페이지 컴포넌트 타입 정의
**목표**: 결제 페이지 컴포넌트 및 관련 타입 정의
**소요시간**: 30분
**의존성**: T004, T005

**작업 내용**:
1. `src/components/PaymentPage/types.ts` 파일 생성
2. 타입 정의:
   - `TimecapsuleInfo` 인터페이스 (캡슐명, 참여 인원 수, 가격)
   - `PaymentInfo` 인터페이스
   - `PaymentStatus` enum (대기, 진행 중, 완료, 실패)
   - `TossPaymentWidgetConfig` 인터페이스
   - 각 컴포넌트 Props 타입

**생성할 파일**:
- `src/components/PaymentPage/types.ts`

**완료 기준**:
- [x] 모든 컴포넌트 관련 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 2: API 연동 레이어 구축

### T007: 주문 생성 API 함수 구현
**목표**: 주문 생성 API 호출 함수 구현
**소요시간**: 30분
**의존성**: T003, T005

**작업 내용**:
1. `src/commons/apis/orders/index.ts` 파일 생성
2. `createOrder` 함수 구현:
   - 요청: `CreateOrderRequest` (캡슐명, 인원수, 가격)
   - 응답: `CreateOrderResponse` (주문 ID, 상태, 금액, 생성 일시)
   - Axios를 통한 POST 요청
   - 에러 핸들링
   - 타입 안전성 보장

**생성할 파일**:
- `src/commons/apis/orders/index.ts`

**완료 기준**:
- [x] createOrder 함수가 구현됨
- [x] 타입 안전성이 보장됨
- [x] 에러 핸들링이 구현됨

---

### T008: 주문 조회 API 함수 구현
**목표**: 주문 조회 API 호출 함수 구현
**소요시간**: 30분
**의존성**: T003, T005, T007

**작업 내용**:
1. `src/commons/apis/orders/index.ts`에 `getOrder` 함수 추가
2. `getOrder` 함수 구현:
   - 요청: 주문 ID (string)
   - 응답: `GetOrderResponse` (주문 상세 정보)
   - Axios를 통한 GET 요청
   - 에러 핸들링
   - 타입 안전성 보장

**수정할 파일**:
- `src/commons/apis/orders/index.ts`

**완료 기준**:
- [x] getOrder 함수가 구현됨
- [x] 타입 안전성이 보장됨
- [x] 에러 핸들링이 구현됨

---

### T009: Axios 인터셉터 확인
**목표**: 인증 토큰 자동 첨부 확인
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `src/commons/provider/api-provider/api-client.ts` 파일 확인
2. 요청 인터셉터에서 인증 토큰 자동 첨부 확인
3. `NEXT_PUBLIC_DEV_TOKEN` 사용 방식 확인
4. 토큰 갱신 로직 확인

**확인할 파일**:
- `src/commons/provider/api-provider/api-client.ts`

**완료 기준**:
- [x] 인증 토큰이 자동으로 첨부됨
- [x] NEXT_PUBLIC_DEV_TOKEN 사용 방식 확인됨

---

### T010: React Query 훅 구현 - 주문 생성
**목표**: 주문 생성을 위한 React Query 뮤테이션 훅 구현
**소요시간**: 30분
**의존성**: T007, T008

**작업 내용**:
1. `src/components/PaymentPage/hooks/useOrder.ts` 파일 생성
2. `useCreateOrder` 뮤테이션 구현:
   - `useMutation` 사용
   - `createOrder` API 함수 호출
   - 로딩 상태, 에러 상태 관리
   - 성공 시 주문 ID 저장

**생성할 파일**:
- `src/components/PaymentPage/hooks/useOrder.ts`

**완료 기준**:
- [x] useCreateOrder 훅이 구현됨
- [x] 로딩 및 에러 상태가 관리됨

---

### T011: React Query 훅 구현 - 주문 조회
**목표**: 주문 조회를 위한 React Query 쿼리 훅 구현
**소요시간**: 30분
**의존성**: T007, T008, T010

**작업 내용**:
1. `src/components/PaymentPage/hooks/useOrder.ts`에 `useGetOrder` 쿼리 추가
2. `useGetOrder` 쿼리 구현:
   - `useQuery` 사용
   - `getOrder` API 함수 호출
   - 주문 ID를 쿼리 키로 사용
   - 로딩 상태, 에러 상태 관리
   - 캐싱 전략 설정

**수정할 파일**:
- `src/components/PaymentPage/hooks/useOrder.ts`

**완료 기준**:
- [x] useGetOrder 훅이 구현됨
- [x] 로딩 및 에러 상태가 관리됨
- [x] 캐싱 전략이 설정됨

---

### T011-1: 토스 결제 승인 API 함수 구현
**목표**: 토스 결제 최종 승인 API 호출 함수 구현
**소요시간**: 30분
**의존성**: T003, T005-1

**작업 내용**:
1. `src/commons/apis/payments/index.ts` 파일 생성
2. `confirmPayment` 함수 구현:
   - 요청: `ConfirmPaymentRequest` (paymentKey, orderId, amount)
   - 응답: `ConfirmPaymentResponse` (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url)
   - Axios를 통한 POST 요청
   - 에러 핸들링 (400, 401, 404 에러 코드 처리)
   - 타입 안전성 보장

**생성할 파일**:
- `src/commons/apis/payments/index.ts`

**완료 기준**:
- [x] confirmPayment 함수가 구현됨
- [x] 타입 안전성이 보장됨
- [x] 에러 핸들링이 구현됨
- [x] 모든 에러 케이스가 처리됨

---

### T011-2: React Query 훅 구현 - 토스 결제 승인
**목표**: 토스 결제 최종 승인을 위한 React Query 뮤테이션 훅 구현
**소요시간**: 30분
**의존성**: T011-1

**작업 내용**:
1. `src/components/PaymentPage/hooks/usePayment.ts` 파일 생성 (또는 기존 파일에 추가)
2. `useConfirmPayment` 뮤테이션 구현:
   - `useMutation` 사용
   - `confirmPayment` API 함수 호출
   - 로딩 상태, 에러 상태 관리
   - 성공 시 결제 정보 및 캡슐 ID 저장
   - 에러 코드별 처리 (AMOUNT_MISMATCH, ORDER_ALREADY_PAID, ORDER_NOT_OWNED 등)

**생성할 파일**:
- `src/components/PaymentPage/hooks/usePayment.ts` (또는 기존 파일 수정)

**완료 기준**:
- [x] useConfirmPayment 훅이 구현됨
- [x] 로딩 및 에러 상태가 관리됨
- [x] 에러 코드별 처리가 구현됨

---

## 🎯 Phase 3: E2E 테스트 인프라

### T012: E2E 테스트 파일 생성
**목표**: 결제 페이지 E2E 테스트 파일 생성
**소요시간**: 20분
**의존성**: 없음

**작업 내용**:
1. `tests/e2e/payment-page/` 디렉토리 생성
2. `tests/e2e/payment-page/payment-page.e2e.spec.ts` 파일 생성
3. 기본 테스트 구조 작성
4. `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN`을 사용하여 인증 상태 설정

**생성할 파일**:
- `tests/e2e/payment-page/payment-page.e2e.spec.ts`

**완료 기준**:
- [x] E2E 테스트 파일이 생성됨
- [x] 기본 테스트 구조가 작성됨

---

### T013: E2E 테스트 - 주문 생성 API 호출 테스트
**목표**: 주문 생성 API 호출 테스트 작성
**소요시간**: 30분
**의존성**: T012, T007

**작업 내용**:
1. `tests/e2e/payment-page/payment-page.e2e.spec.ts`에 주문 생성 테스트 추가
2. 인증 토큰을 사용한 API 호출 테스트
3. 주문 생성 성공 시나리오 테스트
4. 주문 생성 실패 시나리오 테스트 (에러 처리)

**수정할 파일**:
- `tests/e2e/payment-page/payment-page.e2e.spec.ts`

**완료 기준**:
- [x] 주문 생성 API 호출 테스트가 작성됨
- [x] 인증 토큰이 올바르게 사용됨
- [x] 성공 및 실패 시나리오가 테스트됨

---

### T014: E2E 테스트 - 주문 정보 조회 테스트
**목표**: 주문 정보 조회 API 호출 테스트 작성
**소요시간**: 30분
**의존성**: T012, T008

**작업 내용**:
1. `tests/e2e/payment-page/payment-page.e2e.spec.ts`에 주문 조회 테스트 추가
2. 인증 토큰을 사용한 API 호출 테스트
3. 주문 조회 성공 시나리오 테스트
4. 주문 조회 실패 시나리오 테스트 (404, 500 등)

**수정할 파일**:
- `tests/e2e/payment-page/payment-page.e2e.spec.ts`

**완료 기준**:
- [x] 주문 조회 API 호출 테스트가 작성됨
- [x] 인증 토큰이 올바르게 사용됨
- [x] 성공 및 실패 시나리오가 테스트됨

---

### T014-1: E2E 테스트 - 토스 결제 승인 API 호출 테스트
**목표**: 토스 결제 최종 승인 API 호출 테스트 작성
**소요시간**: 30분
**의존성**: T012, T011-1

**작업 내용**:
1. `tests/e2e/payment-page/payment-page.e2e.spec.ts`에 토스 결제 승인 테스트 추가
2. 인증 토큰을 사용한 API 호출 테스트
3. 결제 승인 성공 시나리오 테스트
4. 결제 승인 실패 시나리오 테스트:
   - AMOUNT_MISMATCH (400)
   - ORDER_ALREADY_PAID (400)
   - ORDER_NOT_OWNED (401)
   - ORDER_NOT_FOUND (404)
   - TOSS_CONFIRM_FAILED (400)

**수정할 파일**:
- `tests/e2e/payment-page/payment-page.e2e.spec.ts`

**완료 기준**:
- [x] 토스 결제 승인 API 호출 테스트가 작성됨
- [x] 인증 토큰이 올바르게 사용됨
- [x] 성공 및 모든 에러 케이스가 테스트됨

---

## 🎯 Phase 4: UI 컴포넌트 구현 (Mock 데이터 기반)

### T015: Figma 디자인 스펙 추출
**목표**: 결제 페이지 전체 및 각 컴포넌트의 정확한 디자인 스펙 확인
**소요시간**: 1시간
**의존성**: 없음

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=111-91&t=GSF9XflGaRp0IBGw-4

**작업 내용**:
1. Figma MCP 서버를 통해 결제 페이지 디자인 파일 접근
2. 각 컴포넌트의 Figma 프레임 선택 및 디자인 스펙 추출:
   - 결제 페이지 전체 레이아웃
   - 타임캡슐 정보 표시 영역
   - 주문 정보 요약 영역
   - 결제 금액 표시 영역
   - 토스 결제 위젯 영역
   - 결제 상태 표시 영역
3. 디자인 토큰 추출 (색상, 간격, 타이포그래피, 반경)
4. 컴포넌트 크기 및 레이아웃 스펙 확인 (375px 기준)
5. 소수점 값 반올림 처리
6. `src/commons/styles`에 정의된 디자인 토큰과 매핑

**결과물**:
- 컴포넌트별 디자인 스펙 문서
- 디자인 토큰 매핑 테이블
- CSS Module에서 사용할 CSS 변수 목록

**완료 기준**:
- [x] 결제 페이지 전체 디자인 스펙 추출 완료
- [x] 모든 컴포넌트의 Figma 디자인 스펙 추출 완료
- [x] 디자인 토큰 매핑 완료

---

### [US1] [US2] TimecapsuleInfo 컴포넌트

#### T016 [P] [US1] [US2]: TimecapsuleInfo 타입 정의
**목표**: TimecapsuleInfo 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T006

**작업 내용**:
1. `src/components/PaymentPage/components/TimecapsuleInfo/types.ts` 파일 생성
2. `TimecapsuleInfoProps` 인터페이스 정의:
   - `capsuleName: string`
   - `participantCount: number`
   - `price: number`

**생성할 파일**:
- `src/components/PaymentPage/components/TimecapsuleInfo/types.ts`

**완료 기준**:
- [x] `TimecapsuleInfoProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T017 [P] [US1] [US2]: TimecapsuleInfo CSS Module 스타일 작성
**목표**: TimecapsuleInfo 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015, T016

**작업 내용**:
1. Figma MCP를 통해 TimecapsuleInfo 컴포넌트의 디자인 스펙 추출
2. `src/components/PaymentPage/components/TimecapsuleInfo/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성
4. CSS 변수를 사용한 디자인 토큰 적용
5. 375px 기준 고정 레이아웃
6. 하드코딩된 색상값 사용 금지

**생성할 파일**:
- `src/components/PaymentPage/components/TimecapsuleInfo/styles.module.css`

**완료 기준**:
- [x] 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T018 [US1] [US2]: TimecapsuleInfo 컴포넌트 구현
**목표**: 타임캡슐 정보 표시 컴포넌트 구현
**소요시간**: 30분
**의존성**: T016, T017

**작업 내용**:
1. `src/components/PaymentPage/components/TimecapsuleInfo/index.tsx` 파일 생성
2. 캡슐명, 참여 인원 수, 가격 표시
3. CSS Module 스타일 적용
4. 정보가 없는 경우 처리
5. 접근성 속성 추가

**생성할 파일**:
- `src/components/PaymentPage/components/TimecapsuleInfo/index.tsx`

**완료 기준**:
- [x] TimecapsuleInfo 컴포넌트가 정상적으로 렌더링됨
- [x] 모든 정보가 표시됨
- [x] 접근성 속성이 적용됨

---

### [US1] [US2] OrderSummary 컴포넌트

#### T019 [P] [US1] [US2]: OrderSummary 타입 정의
**목표**: OrderSummary 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T005, T006

**작업 내용**:
1. `src/components/PaymentPage/components/OrderSummary/types.ts` 파일 생성
2. `OrderSummaryProps` 인터페이스 정의:
   - `order: Order | null`
   - `isLoading: boolean`
   - `error: Error | null`

**생성할 파일**:
- `src/components/PaymentPage/components/OrderSummary/types.ts`

**완료 기준**:
- [x] `OrderSummaryProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T020 [P] [US1] [US2]: OrderSummary CSS Module 스타일 작성
**목표**: OrderSummary 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015, T019

**작업 내용**:
1. Figma MCP를 통해 OrderSummary 컴포넌트의 디자인 스펙 추출
2. `src/components/PaymentPage/components/OrderSummary/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성
4. CSS 변수를 사용한 디자인 토큰 적용
5. 로딩 상태 스타일
6. 에러 상태 스타일

**생성할 파일**:
- `src/components/PaymentPage/components/OrderSummary/styles.module.css`

**완료 기준**:
- [x] 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T021 [US1] [US2]: OrderSummary 컴포넌트 구현
**목표**: 주문 정보 요약 표시 컴포넌트 구현
**소요시간**: 40분
**의존성**: T019, T020

**작업 내용**:
1. `src/components/PaymentPage/components/OrderSummary/index.tsx` 파일 생성
2. 주문 정보 요약 표시
3. 로딩 상태 표시
4. 에러 상태 표시
5. CSS Module 스타일 적용
6. 접근성 속성 추가

**생성할 파일**:
- `src/components/PaymentPage/components/OrderSummary/index.tsx`

**완료 기준**:
- [x] OrderSummary 컴포넌트가 정상적으로 렌더링됨
- [x] 주문 정보가 표시됨
- [x] 로딩 및 에러 상태가 처리됨

---

### [US1] PaymentAmount 컴포넌트

#### T022 [P] [US1]: PaymentAmount 타입 정의
**목표**: PaymentAmount 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T006

**작업 내용**:
1. `src/components/PaymentPage/components/PaymentAmount/types.ts` 파일 생성
2. `PaymentAmountProps` 인터페이스 정의:
   - `amount: number`

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentAmount/types.ts`

**완료 기준**:
- [x] `PaymentAmountProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T023 [P] [US1]: PaymentAmount CSS Module 스타일 작성
**목표**: PaymentAmount 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015, T022

**작업 내용**:
1. Figma MCP를 통해 PaymentAmount 컴포넌트의 디자인 스펙 추출
2. `src/components/PaymentPage/components/PaymentAmount/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성
4. 금액 강조 스타일
5. CSS 변수를 사용한 디자인 토큰 적용

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentAmount/styles.module.css`

**완료 기준**:
- [x] 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T024 [US1]: 금액 포맷팅 유틸리티 함수 구현
**목표**: 금액을 천 단위 구분하여 포맷팅하는 함수 구현
**소요시간**: 20분
**의존성**: T004

**작업 내용**:
1. `src/components/PaymentPage/utils/formatCurrency.ts` 파일 생성
2. `formatCurrency` 함수 구현:
   - 숫자를 천 단위 구분하여 포맷팅 (예: 10000 → "10,000")
   - 원화 기호 추가 (선택적)

**생성할 파일**:
- `src/components/PaymentPage/utils/formatCurrency.ts`

**완료 기준**:
- [x] formatCurrency 함수가 구현됨
- [x] 금액이 올바르게 포맷팅됨

---

#### T025 [US1]: PaymentAmount 컴포넌트 구현
**목표**: 결제 금액 표시 컴포넌트 구현
**소요시간**: 30분
**의존성**: T022, T023, T024

**작업 내용**:
1. `src/components/PaymentPage/components/PaymentAmount/index.tsx` 파일 생성
2. 총 결제 금액 표시
3. formatCurrency 함수를 사용한 금액 포맷팅
4. CSS Module 스타일 적용
5. 금액 강조 표시
6. 접근성 속성 추가

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentAmount/index.tsx`

**완료 기준**:
- [x] PaymentAmount 컴포넌트가 정상적으로 렌더링됨
- [x] 금액이 올바르게 포맷팅되어 표시됨

---

### [US1] PaymentStatus 컴포넌트

#### T026 [P] [US1]: PaymentStatus 타입 정의
**목표**: PaymentStatus 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T006

**작업 내용**:
1. `src/components/PaymentPage/components/PaymentStatus/types.ts` 파일 생성
2. `PaymentStatusProps` 인터페이스 정의:
   - `status: PaymentStatus`
   - `message?: string`

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentStatus/types.ts`

**완료 기준**:
- [x] `PaymentStatusProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T027 [P] [US1]: PaymentStatus CSS Module 스타일 작성
**목표**: PaymentStatus 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015, T026

**작업 내용**:
1. Figma MCP를 통해 PaymentStatus 컴포넌트의 디자인 스펙 추출
2. `src/components/PaymentPage/components/PaymentStatus/styles.module.css` 파일 생성
3. 상태별 스타일 정의 (대기, 진행 중, 완료, 실패)
4. CSS 변수를 사용한 디자인 토큰 적용

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentStatus/styles.module.css`

**완료 기준**:
- [x] 스타일이 정의됨
- [x] 상태별 스타일이 구분됨

---

#### T028 [US1]: PaymentStatus 컴포넌트 구현
**목표**: 결제 상태 표시 컴포넌트 구현
**소요시간**: 30분
**의존성**: T026, T027

**작업 내용**:
1. `src/components/PaymentPage/components/PaymentStatus/index.tsx` 파일 생성
2. 결제 상태 표시 (대기, 진행 중, 완료, 실패)
3. 결제 완료/실패 메시지 표시
4. 상태별 시각적 구분
5. CSS Module 스타일 적용
6. 접근성 속성 추가

**생성할 파일**:
- `src/components/PaymentPage/components/PaymentStatus/index.tsx`

**완료 기준**:
- [x] PaymentStatus 컴포넌트가 정상적으로 렌더링됨
- [x] 상태별로 올바르게 표시됨

---

### [US1] TossPaymentWidget 컴포넌트

#### T029 [P] [US1]: TossPaymentWidget 타입 정의
**목표**: TossPaymentWidget 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T006

**작업 내용**:
1. `src/components/PaymentPage/components/TossPaymentWidget/types.ts` 파일 생성
2. `TossPaymentWidgetProps` 인터페이스 정의:
   - `amount: number`
   - `orderId: string`
   - `customerKey: string`
   - `onSuccess: (paymentResult: PaymentResult) => void`
   - `onFail: (error: PaymentError) => void`

**생성할 파일**:
- `src/components/PaymentPage/components/TossPaymentWidget/types.ts`

**완료 기준**:
- [x] `TossPaymentWidgetProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T030 [P] [US1]: TossPaymentWidget CSS Module 스타일 작성
**목표**: TossPaymentWidget 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015, T029

**작업 내용**:
1. Figma MCP를 통해 TossPaymentWidget 컴포넌트의 디자인 스펙 추출
2. `src/components/PaymentPage/components/TossPaymentWidget/styles.module.css` 파일 생성
3. 결제 위젯 컨테이너 스타일
4. CSS 변수를 사용한 디자인 토큰 적용

**생성할 파일**:
- `src/components/PaymentPage/components/TossPaymentWidget/styles.module.css`

**완료 기준**:
- [x] 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T031 [US1]: usePayment 훅 구현 - 토스 결제 위젯 관리
**목표**: 토스 결제 위젯 초기화 및 결제 프로세스 관리 훅 구현
**소요시간**: 1시간
**의존성**: T001, T029, T011-2

**작업 내용**:
1. `src/components/PaymentPage/hooks/usePayment.ts` 파일에 토스 결제 위젯 관련 로직 추가
2. 토스페이먼츠 SDK 초기화 로직
3. 결제 위젯 초기화
4. 결제 프로세스 관리
5. 결제 요청 시 successUrl/failUrl을 프론트엔드 도메인으로 설정
   - successUrl: `${window.location.origin}/pay/toss/success`
   - failUrl: `${window.location.origin}/pay/toss/fail`
6. 결제 완료/실패 처리
7. 에러 처리

**수정할 파일**:
- `src/components/PaymentPage/hooks/usePayment.ts`

**완료 기준**:
- [x] 토스 결제 위젯 초기화 로직이 구현됨
- [x] 결제 위젯이 초기화됨
- [x] 결제 프로세스가 관리됨
- [x] successUrl/failUrl이 프론트엔드 도메인으로 설정됨

---

#### T032 [US1]: TossPaymentWidget 컴포넌트 구현
**목표**: 토스 결제 위젯 컴포넌트 구현
**소요시간**: 1시간
**의존성**: T029, T030, T031

**작업 내용**:
1. `src/components/PaymentPage/components/TossPaymentWidget/index.tsx` 파일 생성
2. 토스페이먼츠 SDK import
3. usePayment 훅 사용
4. 결제 위젯 렌더링
5. 결제 수단 선택 지원
6. 결제 정보 입력 지원
7. 결제 요청 시 successUrl/failUrl 설정 (프론트엔드 도메인)
8. CSS Module 스타일 적용
9. 접근성 속성 추가

**생성할 파일**:
- `src/components/PaymentPage/components/TossPaymentWidget/index.tsx`

**완료 기준**:
- [x] TossPaymentWidget 컴포넌트가 정상적으로 렌더링됨
- [x] 결제 위젯이 표시됨
- [x] 결제 프로세스가 작동함
- [x] successUrl/failUrl이 올바르게 설정됨

---

### [US2] useTimecapsuleInfo 훅 구현

#### T033 [US2]: useTimecapsuleInfo 훅 구현
**목표**: 타임캡슐 정보 관리 훅 구현
**소요시간**: 30분
**의존성**: T006

**작업 내용**:
1. `src/components/PaymentPage/hooks/useTimecapsuleInfo.ts` 파일 생성
2. 이전 페이지에서 전달받은 타임캡슐 정보 관리
3. URL 쿼리 파라미터 또는 상태 관리 라이브러리를 통한 데이터 수신
4. 정보가 없는 경우 처리 (타임캡슐 생성 페이지로 리다이렉트)

**생성할 파일**:
- `src/components/PaymentPage/hooks/useTimecapsuleInfo.ts`

**완료 기준**:
- [x] useTimecapsuleInfo 훅이 구현됨
- [x] 타임캡슐 정보가 관리됨
- [x] 정보가 없는 경우 처리가 구현됨

---

### [US1] [US2] PaymentPage 메인 컴포넌트

#### T034 [US1] [US2]: PaymentPage Mock 데이터 생성
**목표**: PaymentPage 컴포넌트 테스트를 위한 Mock 데이터 생성
**소요시간**: 20분
**의존성**: T005, T006

**작업 내용**:
1. `src/components/PaymentPage/mocks/data.ts` 파일 생성
2. Mock 타임캡슐 정보 생성
3. Mock 주문 정보 생성
4. Mock 결제 정보 생성

**생성할 파일**:
- `src/components/PaymentPage/mocks/data.ts`

**완료 기준**:
- [x] Mock 데이터가 생성됨
- [x] 모든 필요한 데이터 타입이 포함됨

---

#### T035 [US1] [US2]: PaymentPage CSS Module 스타일 작성
**목표**: PaymentPage 메인 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T015

**작업 내용**:
1. `src/components/PaymentPage/styles.module.css` 파일 생성
2. Figma 디자인과 pixel-perfect 수준으로 일치하도록 레이아웃 스타일 작성
3. 컴포넌트 간 간격
4. 로딩 및 에러 상태 스타일
5. CSS 변수를 사용한 디자인 토큰 적용
6. 375px 기준 고정 레이아웃

**생성할 파일**:
- `src/components/PaymentPage/styles.module.css`

**완료 기준**:
- [x] 레이아웃 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T036 [US1] [US2]: PaymentPage 메인 컴포넌트 구현 (Mock 데이터)
**목표**: 모든 컴포넌트를 통합한 메인 페이지 구현 (Mock 데이터 사용)
**소요시간**: 1시간
**의존성**: T018, T021, T025, T028, T032, T033, T034, T035

**작업 내용**:
1. `src/components/PaymentPage/index.tsx` 파일 생성
2. Mock 데이터 사용
3. TimecapsuleInfo 컴포넌트 통합
4. OrderSummary 컴포넌트 통합 (Mock 데이터)
5. PaymentAmount 컴포넌트 통합
6. TossPaymentWidget 컴포넌트 통합
7. PaymentStatus 컴포넌트 통합
8. 로딩 상태 표시
9. 에러 상태 표시
10. CSS Module 스타일 적용

**생성할 파일**:
- `src/components/PaymentPage/index.tsx`

**완료 기준**:
- [x] PaymentPage 컴포넌트가 정상적으로 렌더링됨
- [x] 모든 하위 컴포넌트가 통합됨
- [x] Mock 데이터가 사용됨

---

#### T037 [US1] [US2]: 라우팅 페이지 구현
**목표**: 결제 페이지 라우팅 설정
**소요시간**: 15분
**의존성**: T036

**작업 내용**:
1. `src/app/(main)/payment/page.tsx` 파일 생성
2. PaymentPage 컴포넌트 import 및 렌더링
3. 라우팅 전용 규칙 준수 (컴포넌트 import만)

**생성할 파일**:
- `src/app/(main)/payment/page.tsx`

**완료 기준**:
- [x] 라우팅 페이지가 생성됨
- [x] PaymentPage 컴포넌트가 렌더링됨
- [x] 라우팅이 정상 작동함

---

## 🎯 Phase 5: 데이터 바인딩

### [US1] [US2] 실제 API 연결

#### T038 [US1] [US2]: useOrder 훅 확장 - 자동 주문 생성
**목표**: 페이지 로드 시 자동 주문 생성 로직 추가
**소요시간**: 30분
**의존성**: T010, T011, T033

**작업 내용**:
1. `src/components/PaymentPage/hooks/useOrder.ts` 수정
2. 페이지 로드 시 자동 주문 생성 로직 추가
3. 타임캡슐 정보를 기반으로 주문 생성
4. 주문 생성 실패 시 재시도 로직
5. 주문 ID 저장

**수정할 파일**:
- `src/components/PaymentPage/hooks/useOrder.ts`

**완료 기준**:
- [x] 자동 주문 생성 로직이 구현됨
- [x] 주문 생성 실패 시 재시도 로직이 구현됨

---

#### T039 [US1] [US2]: PaymentPage 컴포넌트 - 실제 API 연결
**목표**: Mock 데이터를 실제 API 호출로 교체
**소요시간**: 1시간
**의존성**: T036, T038

**작업 내용**:
1. `src/components/PaymentPage/index.tsx` 수정
2. useTimecapsuleInfo 훅 사용
3. useOrder 훅 사용 (주문 생성 및 조회)
4. Mock 데이터를 실제 API 호출로 교체
5. 로딩 상태 처리
6. 에러 상태 처리
7. 주문 정보를 하위 컴포넌트에 전달

**수정할 파일**:
- `src/components/PaymentPage/index.tsx`

**완료 기준**:
- [x] 실제 API가 연결됨
- [x] 로딩 및 에러 상태가 처리됨
- [x] 주문 정보가 올바르게 표시됨

---

### [US1] 결제 위젯 연동

#### T040 [US1]: TossPaymentWidget - 실제 주문 정보 연동
**목표**: 결제 위젯에 실제 주문 정보 전달
**소요시간**: 30분
**의존성**: T032, T039

**작업 내용**:
1. `src/components/PaymentPage/components/TossPaymentWidget/index.tsx` 수정
2. 실제 주문 ID 사용
3. 실제 결제 금액 사용
4. 주문 정보를 결제 위젯에 전달
5. successUrl/failUrl을 프론트엔드 도메인으로 설정
   - successUrl: `${window.location.origin}/pay/toss/success`
   - failUrl: `${window.location.origin}/pay/toss/fail`

**수정할 파일**:
- `src/components/PaymentPage/components/TossPaymentWidget/index.tsx`

**완료 기준**:
- [x] 실제 주문 정보가 결제 위젯에 전달됨
- [x] 결제 위젯이 정상 작동함
- [x] successUrl/failUrl이 프론트엔드 도메인으로 설정됨

---

### [US1] [US7] 토스 결제 승인 페이지

#### T040-1 [US1] [US7]: 결제 성공 페이지 구현
**목표**: 토스 결제 성공 후 최종 승인을 처리하는 페이지 구현
**소요시간**: 1시간
**의존성**: T011-2

**작업 내용**:
1. `src/app/(main)/pay/toss/success/page.tsx` 파일 생성
2. URL 쿼리 파라미터에서 paymentKey, orderId, amount 추출
3. useConfirmPayment 훅 사용하여 백엔드에 결제 승인 요청
4. 로딩 상태 표시
5. 승인 성공 시 결제 정보 및 캡슐 ID 표시
6. 승인 실패 시 에러 메시지 표시 및 재시도 옵션 제공
7. 에러 코드별 처리 (AMOUNT_MISMATCH, ORDER_ALREADY_PAID 등)

**생성할 파일**:
- `src/app/(main)/pay/toss/success/page.tsx`

**완료 기준**:
- [x] 결제 성공 페이지가 생성됨
- [x] URL 쿼리 파라미터를 올바르게 추출함
- [x] 백엔드 결제 승인 API가 호출됨
- [x] 승인 성공 시 결제 정보가 표시됨
- [x] 승인 실패 시 에러 메시지가 표시됨

---

#### T040-2 [US1] [US7]: 결제 실패 페이지 구현
**목표**: 토스 결제 실패 시 표시하는 페이지 구현
**소요시간**: 30분
**의존성**: 없음

**작업 내용**:
1. `src/app/(main)/pay/toss/fail/page.tsx` 파일 생성
2. URL 쿼리 파라미터에서 에러 정보 추출 (선택적)
3. 결제 실패 메시지 표시
4. 재시도 버튼 제공 (결제 페이지로 이동)
5. 고객 지원 안내

**생성할 파일**:
- `src/app/(main)/pay/toss/fail/page.tsx`

**완료 기준**:
- [x] 결제 실패 페이지가 생성됨
- [x] 결제 실패 메시지가 표시됨
- [x] 재시도 기능이 제공됨

---

### [US3] 에러 처리

#### T041 [US3]: 에러 처리 컴포넌트 구현
**목표**: 주문 생성/조회 및 결제 승인 실패 시 에러 메시지 표시
**소요시간**: 30분
**의존성**: T039, T040-1

**작업 내용**:
1. `src/components/PaymentPage/index.tsx`에 에러 처리 로직 추가
2. 주문 생성 실패 시 에러 메시지 표시
3. 주문 조회 실패 시 에러 메시지 표시
4. 재시도 버튼 제공
5. 결제 위젯 로드 실패 시 에러 메시지 표시
6. `src/app/(main)/pay/toss/success/page.tsx`에 결제 승인 에러 처리 추가:
   - AMOUNT_MISMATCH: 결제 금액 불일치 안내
   - ORDER_ALREADY_PAID: 이미 결제 완료 안내
   - ORDER_NOT_OWNED: 주문 소유자 불일치 안내
   - ORDER_NOT_FOUND: 주문을 찾을 수 없음 안내
   - TOSS_CONFIRM_FAILED: 토스 승인 실패 안내

**수정할 파일**:
- `src/components/PaymentPage/index.tsx`
- `src/app/(main)/pay/toss/success/page.tsx`

**완료 기준**:
- [x] 에러 메시지가 표시됨
- [x] 재시도 기능이 구현됨
- [x] 결제 승인 에러 코드별 처리가 구현됨

---

## 🎯 Phase 6: UI 테스트 및 최적화

### T042: UI 테스트 파일 생성
**목표**: 결제 페이지 UI 테스트 파일 생성
**소요시간**: 20분
**의존성**: 없음

**작업 내용**:
1. `tests/ui/payment-page/` 디렉토리 생성
2. `tests/ui/payment-page/payment-page.ui.spec.ts` 파일 생성
3. 기본 테스트 구조 작성

**생성할 파일**:
- `tests/ui/payment-page/payment-page.ui.spec.ts`

**완료 기준**:
- [x] UI 테스트 파일이 생성됨
- [x] 기본 테스트 구조가 작성됨

---

### T043 [P]: UI 테스트 - 컴포넌트 렌더링 테스트
**목표**: 각 컴포넌트의 렌더링 테스트 작성
**소요시간**: 1시간
**의존성**: T042

**작업 내용**:
1. `tests/ui/payment-page/payment-page.ui.spec.ts`에 렌더링 테스트 추가
2. TimecapsuleInfo 컴포넌트 렌더링 테스트
3. OrderSummary 컴포넌트 렌더링 테스트
4. PaymentAmount 컴포넌트 렌더링 테스트
5. PaymentStatus 컴포넌트 렌더링 테스트
6. TossPaymentWidget 컴포넌트 렌더링 테스트

**수정할 파일**:
- `tests/ui/payment-page/payment-page.ui.spec.ts`

**완료 기준**:
- [x] 모든 컴포넌트의 렌더링 테스트가 작성됨
- [x] 테스트가 통과함

---

### T044 [P]: UI 테스트 - 사용자 상호작용 테스트
**목표**: 사용자 상호작용 테스트 작성
**소요시간**: 1시간
**의존성**: T042

**작업 내용**:
1. `tests/ui/payment-page/payment-page.ui.spec.ts`에 상호작용 테스트 추가
2. 결제 위젯 상호작용 테스트
3. 에러 상태에서 재시도 버튼 클릭 테스트
4. 로딩 상태 표시 테스트

**수정할 파일**:
- `tests/ui/payment-page/payment-page.ui.spec.ts`

**완료 기준**:
- [x] 사용자 상호작용 테스트가 작성됨
- [x] 테스트가 통과함

---

### T045: 접근성 및 성능 최적화
**목표**: 접근성 요구사항 충족 및 성능 최적화
**소요시간**: 1시간
**의존성**: T039

**작업 내용**:
1. 모든 컴포넌트에 접근성 속성 추가 (aria-label, role 등)
2. 키보드 네비게이션 지원 확인
3. 최소 터치 타겟 크기 44px × 44px 보장
4. 색상 대비 WCAG AA 기준 준수
5. 불필요한 리렌더링 방지 (메모이제이션)
6. 페이지 로드 성능 최적화

**수정할 파일**:
- `src/components/PaymentPage/index.tsx`
- 각 하위 컴포넌트 파일

**완료 기준**:
- [x] 접근성 요구사항이 충족됨
- [x] 성능이 최적화됨

---

## 📊 작업 요약

### 작업 통계
- **총 작업 수**: 51개
- **Phase 0 (설정)**: 3개
- **Phase 1 (구조/타입)**: 4개 (T005-1 추가)
- **Phase 2 (API)**: 7개 (T011-1, T011-2 추가)
- **Phase 3 (E2E 테스트)**: 4개 (T014-1 추가)
- **Phase 4 (UI 컴포넌트)**: 23개
- **Phase 5 (데이터 바인딩)**: 6개 (T040-1, T040-2 추가)
- **Phase 6 (UI 테스트/최적화)**: 4개

### 사용자 스토리별 작업 수
- **US1 (주문 정보 확인 및 결제 진행)**: 24개 (토스 결제 승인 관련 작업 추가)
- **US2 (주문 정보 생성 및 확인)**: 8개
- **US3 (결제 오류 처리)**: 1개
- **US7 (토스 결제 승인)**: 2개 (T040-1, T040-2)
- **공통 작업**: 16개

### 병렬 처리 가능한 작업
- T005, T005-1 (타입 정의)
- T016, T019, T022, T026, T029 (컴포넌트 타입 정의)
- T017, T020, T023, T027, T030 (CSS Module 스타일 작성)
- T007, T008, T011-1 (API 함수 구현)
- T010, T011, T011-2 (React Query 훅 구현)
- T043, T044 (UI 테스트)

---

## 🎯 구현 전략

### MVP 범위
**Phase 0-4 완료**: 기본 UI 및 Mock 데이터 기반 동작
- 프로젝트 설정 완료
- API 연동 레이어 구축
- E2E 테스트 인프라 구축
- UI 컴포넌트 구현 (Mock 데이터)

**Phase 5 완료**: 실제 API 연결
- 실제 주문 생성 및 조회
- 실제 결제 위젯 연동

**Phase 6 완료**: 최종 검증 및 최적화
- UI 테스트
- 접근성 및 성능 최적화

### 우선순위
1. **P1 (필수)**: US1, US2 관련 작업 (Phase 0-5)
2. **P2 (중요)**: US3 관련 작업 및 최적화 (Phase 6)

### 의존성 순서
1. Phase 0 → Phase 1 → Phase 2 → Phase 3
2. Phase 4 (컴포넌트별로 병렬 처리 가능)
3. Phase 5 (실제 API 연결)
4. Phase 6 (최종 검증)

---

## ✅ 완료 기준

각 Phase가 완료되면 다음을 확인해야 합니다:

### Phase 0-1 완료 기준
- [x] 모든 의존성이 설치됨
- [x] 디렉토리 구조가 생성됨
- [x] 모든 타입이 정의됨

### Phase 2 완료 기준
- [x] API 함수가 구현됨
- [x] React Query 훅이 구현됨
- [x] 인증 토큰이 자동으로 첨부됨

### Phase 3 완료 기준
- [x] E2E 테스트 파일이 생성됨
- [x] 주문 생성/조회 API 호출 테스트가 작성됨
- [x] 인증 토큰을 사용한 테스트가 통과함

### Phase 4 완료 기준
- [x] 모든 UI 컴포넌트가 구현됨
- [x] Mock 데이터 기반으로 동작함
- [x] Figma 디자인과 일치함

### Phase 5 완료 기준
- [x] 실제 API가 연결됨
- [x] 주문 생성 및 조회가 작동함
- [x] 결제 위젯이 실제 데이터와 연동됨

### Phase 6 완료 기준
- [x] UI 테스트가 통과함
- [x] 접근성 요구사항이 충족됨
- [x] 성능이 최적화됨

---

**다음 단계**: `/speckit.implement`를 실행하여 단계별 구현을 시작합니다.
