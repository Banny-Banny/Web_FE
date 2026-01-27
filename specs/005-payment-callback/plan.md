# 결제 승인 및 콜백 처리 기술 구현 계획

**Branch**: `feat/payment-callback` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: 결제 승인 및 콜백 처리 기능 명세서 (`specs/005-payment-callback/spec.md`)

## Summary

토스페이먼츠 결제 완료 후 콜백을 처리하고, 결제 승인을 완료한 후 타임캡슐 대기실을 생성하여 사용자를 대기실 페이지로 이동시키는 기능을 구현합니다. 결제 성공/실패 콜백 페이지를 통해 사용자에게 결제 결과를 명확하게 표시하고, 결제 승인 API와 대기실 생성 API를 순차적으로 호출하여 완전한 결제 플로우를 완성합니다.

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: 
- `@tanstack/react-query` (v5.90.20) - 서버 상태 관리
- `axios` (v1.13.2) - HTTP 클라이언트
- `next` (v16.1.4) - 프레임워크
- `react` (v19.2.3) - UI 라이브러리

**Storage**: 서버 상태는 React Query 캐시에 저장, 클라이언트 상태는 React State  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 모바일 웹 (375px 고정 레이아웃)  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: 
- 결제 성공 콜백 페이지 로드 시간 2초 이하
- 결제 승인 처리 응답 시간 2초 이하
- 타임캡슐 대기실 생성 응답 시간 2초 이하
- 결제 실패 콜백 페이지 로드 시간 2초 이하

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 모든 API 요청에 인증 토큰 포함 (`Authorization: Bearer {token}`)
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- 토스페이먼츠에서 콜백 URL로 결제 정보 전달 (URL 쿼리 파라미터)

**Scale/Scope**: 
- 결제 성공 콜백 페이지 (`/payment/success`)
- 결제 실패 콜백 페이지 (`/payment/fail`)
- 결제 승인 API 호출
- 타임캡슐 대기실 생성 API 호출
- 대기실 페이지로 자동 이동

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/PaymentCallback/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query (서버 상태) + React State (클라이언트 상태)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부  
✅ **성능**: 페이지 로드 최적화, API 호출 최적화

---

## Project Structure

### Documentation (this feature)

```text
specs/005-payment-callback/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── payment/
│           ├── success/
│           │   └── page.tsx              # 결제 성공 콜백 라우팅
│           └── fail/
│               └── page.tsx               # 결제 실패 콜백 라우팅
├── components/
│   └── PaymentCallback/                   # 결제 콜백 페이지 컴포넌트
│       ├── Success/                       # 결제 성공 페이지
│       │   ├── index.tsx                  # 메인 컨테이너 컴포넌트
│       │   ├── types.ts                  # 타입 정의
│       │   ├── styles.module.css         # 스타일 (CSS Module)
│       │   └── hooks/                     # 페이지별 비즈니스 로직
│       │       └── usePaymentSuccess.ts  # 결제 성공 처리 훅
│       └── Fail/                          # 결제 실패 페이지
│           ├── index.tsx                  # 메인 컨테이너 컴포넌트
│           ├── types.ts                  # 타입 정의
│           ├── styles.module.css         # 스타일 (CSS Module)
│           └── hooks/                     # 페이지별 비즈니스 로직
│               └── usePaymentFail.ts     # 결제 실패 처리 훅
└── commons/
    ├── apis/
    │   ├── payments/
    │   │   ├── index.ts                  # 결제 API 함수 (기존 확장)
    │   │   ├── types.ts                  # 결제 타입 정의 (기존 확장)
    │   │   └── hooks/                    # React Query 훅 (신규 추가)
    │   │       ├── useConfirmPayment.ts  # 결제 승인 훅
    │   │       └── usePaymentStatus.ts   # 결제 상태 조회 훅
    │   └── capsules/
    │       ├── index.ts                  # 캡슐 API 함수 (신규 추가)
    │       ├── types.ts                  # 캡슐 타입 정의 (신규 추가)
    │       └── hooks/                    # React Query 훅 (신규 추가)
    │           └── useCreateWaitingRoom.ts # 대기실 생성 훅
    └── utils/
        └── payment.ts                    # 결제 관련 유틸리티 함수 (신규 추가)
```

---

## 데이터 모델링

### API 타입 (기존 타입 확장 및 신규 추가)

```typescript
// src/commons/apis/payments/types.ts (기존 확장)
export interface ConfirmPaymentRequest {
  /** 결제 키 (토스페이먼츠에서 발급, 1~200자 문자열) */
  paymentKey: string;
  /** 주문 ID (6~200자 문자열) */
  orderId: string;
  /** 결제 금액 (숫자) */
  amount: number;
}

export interface ConfirmPaymentResponse {
  /** 주문 ID */
  order_id: string;
  /** 결제 키 */
  payment_key: string;
  /** 결제 상태 */
  status: 'PAID' | 'FAILED';
  /** 결제 금액 */
  amount: number;
  /** 결제 승인 일시 (ISO 8601 형식) */
  approved_at: string;
  /** 생성된 캡슐 ID (결제 승인 시 자동 생성됨) */
  capsule_id: string;
  /** 영수증 URL */
  receipt_url: string;
}

// 토스페이먼츠 콜백 파라미터 타입
export interface TossPaymentCallbackParams {
  /** 결제 키 */
  paymentKey?: string;
  /** 주문 ID */
  orderId?: string;
  /** 결제 금액 */
  amount?: string;
  /** 에러 코드 (실패 시) */
  code?: string;
  /** 에러 메시지 (실패 시) */
  message?: string;
}
```

```typescript
// src/commons/apis/capsules/types.ts (신규 추가)
export interface CreateWaitingRoomRequest {
  /** 주문 ID */
  orderId: string;
}

export interface CreateWaitingRoomResponse {
  /** 대기실 ID */
  waitingRoomId: string;
  /** 주문 ID */
  orderId: string;
  /** 캡슐명 */
  capsuleName: string;
  /** 참여 인원수 */
  headcount: number;
  /** 초대 코드 */
  inviteCode: string;
  /** 생성 일시 */
  createdAt: string;
}
```

### 결제 콜백 페이지 컴포넌트 타입

```typescript
// src/components/PaymentCallback/Success/types.ts
export interface PaymentSuccessPageProps {
  // URL 쿼리 파라미터에서 결제 정보 추출
}

export interface PaymentSuccessState {
  status: 'idle' | 'confirming' | 'creating' | 'success' | 'failed';
  error?: string;
  orderId?: string;
  waitingRoomId?: string;
}

// src/components/PaymentCallback/Fail/types.ts
export interface PaymentFailPageProps {
  // URL 쿼리 파라미터에서 실패 정보 추출
}

export interface PaymentFailState {
  errorCode?: string;
  errorMessage?: string;
  orderId?: string;
}
```

---

## API 설계

### 기존 API 활용

**결제 완료 처리** (`POST /api/payment/complete`)
- **엔드포인트**: `PAYMENT_ENDPOINTS.COMPLETE` (이미 존재)
- **함수**: `completePayment(data: CompletePaymentRequest)` (이미 구현됨)
- **응답**: `CompletePaymentResponse`
- **용도**: 결제 승인 처리 (기존 API 활용 또는 확장)

### 신규 API 추가

**결제 승인 처리** (`POST /api/payments/toss/confirm`)
- **엔드포인트**: `PAYMENT_ENDPOINTS.CONFIRM` (신규 추가)
- **함수**: `confirmPayment(data: ConfirmPaymentRequest)` (신규 추가)
- **응답**: `ConfirmPaymentResponse` (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url 포함)
- **용도**: 토스페이먼츠 결제 최종 승인 처리
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 주문 존재 여부 및 소유자 확인
  - 이미 결제 완료(PAID) 상태가 아닌지 확인
  - 상품이 TIME_CAPSULE인지 확인
  - 결제 금액이 주문 금액과 일치하는지 확인
- **에러 케이스**:
  - 400: AMOUNT_MISMATCH, ORDER_ALREADY_PAID, TOSS_SECRET_KEY_REQUIRED, TOSS_CONFIRM_FAILED
  - 401: ORDER_NOT_OWNED, JWT 누락/만료
  - 404: ORDER_NOT_FOUND, PRODUCT_NOT_FOUND_OR_INVALID
- **특이사항**: 
  - 결제 승인 성공 시 자동으로 캡슐이 생성되어 `capsule_id`가 응답에 포함됨
  - 리다이렉트 URL은 프론트엔드에서 Toss Payments SDK 호출 시 successUrl/failUrl로 설정해야 함
  - 백엔드는 리다이렉트 URL을 반환하지 않음

**타임캡슐 대기실 생성** (`POST /api/capsules/step-rooms/create`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.CREATE_WAITING_ROOM` (신규 추가, 필요 시)
- **함수**: `createWaitingRoom(data: CreateWaitingRoomRequest)` (신규 추가, 필요 시)
- **응답**: `CreateWaitingRoomResponse`
- **용도**: 결제 승인 성공 후 타임캡슐 대기실 생성 (필요 시)
- **참고**: 결제 승인 API 응답에 `capsule_id`가 포함되어 있어 별도 대기실 생성이 필요 없을 수 있음. 백엔드 구현 확인 필요.

**주문 상태 조회** (`GET /api/orders/{id}/status`)
- **엔드포인트**: `ORDER_ENDPOINTS.STATUS(orderId)` (이미 존재)
- **함수**: `getOrderStatus(orderId: string)` (이미 구현됨)
- **응답**: `GetOrderStatusResponse`
- **용도**: 결제 상태 확인 및 중복 처리 방지

### API 엔드포인트 추가

```typescript
// src/commons/apis/endpoints.ts에 추가
export const PAYMENT_ENDPOINTS = {
  // 기존
  COMPLETE: `${BASE_PATHS.API}/payment/complete`,
  // 신규 추가
  CONFIRM: `${BASE_PATHS.API}/payments/toss/confirm`,
} as const;

export const CAPSULE_ENDPOINTS = {
  // 신규 추가
  CREATE_WAITING_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
} as const;
```

---

## 컴포넌트 설계

### 1. PaymentSuccess (결제 성공 콜백 페이지)

**역할**: 결제 성공 후 결제 승인 처리 및 대기실 생성, 대기실 페이지로 이동

**책임**:
- URL 쿼리 파라미터에서 결제 정보 추출 (paymentKey, orderId, amount)
- 결제 승인 API 호출
- 결제 승인 성공 시 타임캡슐 대기실 생성
- 대기실 생성 성공 시 대기실 페이지로 이동
- 처리 중 로딩 상태 표시
- 오류 처리 및 사용자 안내

**구조**:
```tsx
<PaymentSuccess>
  {status === 'confirming' && <LoadingState message="결제 승인 중..." />}
  {status === 'creating' && <LoadingState message="대기실 생성 중..." />}
  {status === 'success' && <SuccessMessage />}
  {status === 'failed' && <ErrorMessage error={error} />}
</PaymentSuccess>
```

### 2. PaymentFail (결제 실패 콜백 페이지)

**역할**: 결제 실패 후 실패 원인 표시 및 재시도 안내

**책임**:
- URL 쿼리 파라미터에서 실패 정보 추출 (code, message, orderId)
- 결제 실패 원인을 사용자 친화적인 메시지로 변환
- 재시도 옵션 제공
- 이전 페이지로 돌아갈 수 있는 옵션 제공

**구조**:
```tsx
<PaymentFail>
  <FailIcon />
  <FailMessage message={userFriendlyMessage} />
  <RetryButton onClick={handleRetry} />
  <BackButton onClick={handleBack} />
</PaymentFail>
```

---

## 상태 관리 전략

### 서버 상태 (React Query)

**결제 승인 처리**:
```typescript
// src/commons/apis/payments/hooks/useConfirmPayment.ts
export function useConfirmPayment() {
  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: (data) => {
      // 결제 승인 성공 처리
    },
    onError: (error) => {
      // 결제 승인 실패 처리
    },
  });
}
```

**타임캡슐 대기실 생성**:
```typescript
// src/commons/apis/capsules/hooks/useCreateWaitingRoom.ts
export function useCreateWaitingRoom() {
  return useMutation({
    mutationFn: createWaitingRoom,
    onSuccess: (data) => {
      // 대기실 생성 성공 처리
    },
    onError: (error) => {
      // 대기실 생성 실패 처리
    },
  });
}
```

**주문 상태 조회** (중복 처리 방지):
```typescript
// src/commons/apis/orders/hooks/useOrderStatus.ts (이미 존재)
export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ['orderStatus', orderId],
    queryFn: () => getOrderStatus(orderId),
    enabled: !!orderId,
  });
}
```

### 클라이언트 상태 (React State)

**결제 성공 처리 상태 관리**:
```typescript
// src/components/PaymentCallback/Success/hooks/usePaymentSuccess.ts
export function usePaymentSuccess() {
  const [state, setState] = useState<PaymentSuccessState>({
    status: 'idle',
  });

  const confirmPaymentMutation = useConfirmPayment();
  const createWaitingRoomMutation = useCreateWaitingRoom();

  const handlePaymentSuccess = async (
    paymentKey: string,
    orderId: string,
    amount: number
  ) => {
    // 1. 결제 승인 처리
    setState({ status: 'confirming' });
    const confirmResult = await confirmPaymentMutation.mutateAsync({
      paymentKey,
      orderId,
      amount,
    });

    if (confirmResult.status !== 'PAID') {
      setState({ status: 'failed', error: '결제 승인에 실패했습니다.' });
      return;
    }

    // 2. 대기실 생성 (필요 시 - capsule_id가 응답에 포함되어 있으면 생략 가능)
    // 백엔드 구현에 따라 대기실 생성이 별도로 필요한지 확인 필요
    // 만약 capsule_id로 바로 대기실 페이지로 이동 가능하다면 이 단계 생략
    if (needsWaitingRoomCreation) {
      setState({ status: 'creating' });
      const waitingRoomResult = await createWaitingRoomMutation.mutateAsync({
        orderId,
      });
      router.push(`/waiting-room/${waitingRoomResult.waitingRoomId}`);
    } else {
      // capsule_id를 사용하여 대기실 페이지로 이동
      router.push(`/waiting-room/${confirmResult.capsule_id}`);
    }

    setState({ status: 'success', waitingRoomId: confirmResult.capsule_id });
  };

  return {
    state,
    handlePaymentSuccess,
  };
}
```

---

## 개발 워크플로우

### Step 1: API 연결

**목적**: 결제 승인 API와 대기실 생성 API 구현

**작업**:
1. `src/commons/apis/endpoints.ts`에 신규 엔드포인트 추가
   - `PAYMENT_ENDPOINTS.CONFIRM`
   - `CAPSULE_ENDPOINTS.CREATE_WAITING_ROOM`
2. `src/commons/apis/payments/types.ts`에 타입 추가
   - `ConfirmPaymentRequest`
   - `ConfirmPaymentResponse`
   - `TossPaymentCallbackParams`
3. `src/commons/apis/payments/index.ts`에 함수 추가
   - `confirmPayment(data: ConfirmPaymentRequest)`
4. `src/commons/apis/capsules/types.ts` 생성
   - `CreateWaitingRoomRequest`
   - `CreateWaitingRoomResponse`
5. `src/commons/apis/capsules/index.ts` 생성
   - `createWaitingRoom(data: CreateWaitingRoomRequest)`
6. `src/commons/apis/payments/hooks/useConfirmPayment.ts` 생성
   - React Query mutation 훅 구현
7. `src/commons/apis/capsules/hooks/useCreateWaitingRoom.ts` 생성
   - React Query mutation 훅 구현
8. API 호출 단위 테스트 작성

**결과물**: 완전히 작동하는 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 결제 승인 및 콜백 처리 플로우 검증

**작업**:
1. 결제 성공 콜백 플로우 테스트
   - 결제 정보 파라미터 추출 테스트
   - 결제 승인 API 호출 테스트
   - 대기실 생성 API 호출 테스트
   - 대기실 페이지 이동 테스트
2. 결제 실패 콜백 플로우 테스트
   - 실패 정보 파라미터 추출 테스트
   - 실패 메시지 표시 테스트
   - 재시도 옵션 테스트
3. 오류 처리 테스트
   - 결제 승인 실패 처리 테스트
   - 대기실 생성 실패 처리 테스트
   - 네트워크 오류 처리 테스트
   - 중복 처리 방지 테스트

**도구**: Playwright  
**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. Figma MCP를 사용하여 디자인 시안 확인
   - 결제 성공 페이지 디자인
   - 결제 실패 페이지 디자인
2. Mock 데이터 기반 UI 컴포넌트 구현
   - `PaymentSuccess` 컴포넌트
     - 로딩 상태 표시
     - 성공 메시지 표시
     - 에러 메시지 표시
   - `PaymentFail` 컴포넌트
     - 실패 아이콘 및 메시지 표시
     - 재시도 버튼
     - 이전 페이지로 돌아가기 버튼
3. 375px 고정 레이아웃으로 스타일링
4. 디자인 토큰 활용 (Figma에서 추출)

**결과물**: 375px 모바일 프레임 전용 완전한 UI/UX

### Step 4: 사용자 승인 단계

**목적**: UI/UX 최종 검증 및 피드백 수집

**작업**:
1. 스테이징 환경 배포 (375px 모바일 프레임)
2. 사용자 테스트 및 피드백 수집
3. UI/UX 개선사항 반영

**결과물**: 사용자 승인된 최종 UI

### Step 5: 데이터 바인딩

**목적**: 실제 API와 UI 연결, 결제 승인 및 대기실 생성 플로우 완성

**작업**:
1. `usePaymentSuccess` 훅 구현
   - URL 쿼리 파라미터에서 결제 정보 추출
   - 결제 승인 API 호출
   - 대기실 생성 API 호출
   - 대기실 페이지로 이동
   - 오류 처리 및 재시도 로직
2. `usePaymentFail` 훅 구현
   - URL 쿼리 파라미터에서 실패 정보 추출
   - 실패 원인을 사용자 친화적인 메시지로 변환
   - 재시도 및 뒤로가기 처리
3. Mock 데이터를 실제 API 호출로 교체
4. React Query 훅과 UI 컴포넌트 연결
5. 로딩/에러 상태 처리
6. 중복 처리 방지 로직 구현

**결과물**: 완전히 작동하는 결제 승인 및 콜백 처리 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
   - 결제 성공 페이지 렌더링 테스트
   - 결제 실패 페이지 렌더링 테스트
   - 로딩 상태 표시 테스트
   - 에러 메시지 표시 테스트
   - 버튼 상호작용 테스트
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 에러 처리 전략

### 결제 정보 파라미터 누락

**시나리오**: URL 쿼리 파라미터에 결제 정보가 없음

**처리**:
- 명확한 에러 메시지 표시
- 결제 페이지로 이동할 수 있는 안내 제공

### 결제 승인 처리 실패

**시나리오**: 결제 승인 API 호출이 실패

**에러 코드별 처리**:
- **400 AMOUNT_MISMATCH**: 결제 금액이 주문 금액과 일치하지 않음 → "결제 금액이 주문 금액과 일치하지 않습니다." 메시지 표시
- **400 ORDER_ALREADY_PAID**: 이미 결제 완료된 주문 → "이미 결제가 완료된 주문입니다." 메시지 표시, 주문 상태 확인 후 적절한 페이지로 이동
- **400 TOSS_SECRET_KEY_REQUIRED**: 토스 비밀키 설정 오류 → "결제 서비스 설정 오류가 발생했습니다." 메시지 표시, 고객 지원 안내
- **400 TOSS_CONFIRM_FAILED**: 토스 승인 실패 → "결제 승인 처리 중 오류가 발생했습니다." 메시지 표시, 재시도 옵션 제공
- **401 ORDER_NOT_OWNED**: 본인의 주문이 아님 → "본인의 주문이 아닙니다." 메시지 표시
- **404 ORDER_NOT_FOUND**: 주문을 찾을 수 없음 → "주문을 찾을 수 없습니다." 메시지 표시, 결제 페이지로 이동 안내
- **404 PRODUCT_NOT_FOUND_OR_INVALID**: 유효하지 않은 상품 → "유효하지 않은 상품입니다." 메시지 표시

**일반 처리**:
- 명확한 에러 메시지를 표시 (에러 코드를 사용자 친화적인 메시지로 변환)
- 재시도 옵션 제공 (일시적 오류의 경우)
- 주문 상태를 확인할 수 있는 방법 제공

### 대기실 생성 실패

**시나리오**: 결제 승인은 성공했지만 대기실 생성이 실패

**처리**:
- 명확한 에러 메시지를 표시
- 대기실 생성을 재시도할 수 있는 옵션 제공
- 결제는 완료되었음을 명확히 표시
- 고객 지원 안내 제공

### 중복 결제 승인 요청

**시나리오**: 사용자가 결제 승인 페이지를 새로고침하거나 중복 접근

**처리**:
- 주문 상태를 확인하여 이미 처리된 결제인지 확인
- 이미 처리된 경우 적절한 안내 제공
- 중복 처리 방지

### 네트워크 오류

**시나리오**: API 호출 중 네트워크 연결 끊김

**처리**:
- 네트워크 오류 메시지를 표시
- 자동 재시도 로직 실행 (일시적 오류의 경우)
- 재시도 옵션 제공

---

## 성능 최적화

### 페이지 로드 최적화

- 결제 승인 및 대기실 생성은 순차적으로 처리 (병렬 처리 불필요)
- React Query 캐싱 활용
- 불필요한 리렌더링 방지 (React.memo 활용)

### API 호출 최적화

- 결제 승인과 대기실 생성을 순차적으로 호출하여 의존성 관리
- 중복 요청 방지 (이미 처리된 결제인지 확인)
- 에러 발생 시 적절한 재시도 로직

### 상태 업데이트 최적화

- 로딩 상태를 명확하게 구분하여 사용자 경험 개선
- 불필요한 상태 업데이트 방지

---

## 테스트 전략

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 결제 성공 콜백 플로우
   - 결제 정보 파라미터 추출
   - 결제 승인 API 호출
   - 대기실 생성 API 호출
   - 대기실 페이지 이동
2. 결제 실패 콜백 플로우
   - 실패 정보 파라미터 추출
   - 실패 메시지 표시
   - 재시도 옵션
3. 오류 처리
   - 결제 승인 실패 처리
   - 대기실 생성 실패 처리
   - 네트워크 오류 처리
   - 중복 처리 방지

**파일 위치**: `tests/e2e/payment/payment-callback.spec.ts`

### UI 테스트 (Playwright)

**테스트 항목**:
- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- 시각적 검증 (스크린샷 비교)
- 로딩 상태 표시 테스트
- 에러 메시지 표시 테스트

**파일 위치**: `tests/e2e/payment/payment-callback-ui.spec.ts`

---

## 디자인 시스템 준수

### Figma 디자인 토큰

- **색상**: `src/commons/styles/color.ts`에서 정의된 변수 사용
- **간격**: `src/commons/styles/spacing.ts`에서 정의된 변수 사용
- **타이포그래피**: `src/commons/styles/fonts.ts`에서 정의된 변수 사용

### 375px 고정 레이아웃

- 모든 컴포넌트는 375px 기준으로 설계
- 반응형 CSS 미사용
- 고정 단위(px) 사용

### 디자인 정확도

- Figma 디자인과 pixel-perfect 수준으로 일치
- 모든 컴포넌트의 크기, 간격, 색상, 스타일 정확히 반영

---

## 보안 고려사항

### 인증 토큰 관리

- 모든 API 요청에 `Authorization: Bearer {token}` 헤더 자동 포함
- Axios 인터셉터를 통한 토큰 자동 첨부
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용

### 결제 정보 검증

- 토스페이먼츠에서 전달된 결제 정보의 유효성 검증
- 결제 승인 요청이 무단으로 접근되지 않도록 보호
- 결제 정보가 안전하게 전송되도록 보장
- 백엔드에서 수행하는 검증:
  - 주문 존재 여부 및 소유자 확인 (401 ORDER_NOT_OWNED, 404 ORDER_NOT_FOUND)
  - 이미 결제 완료 상태가 아닌지 확인 (400 ORDER_ALREADY_PAID)
  - 상품이 TIME_CAPSULE인지 확인 (404 PRODUCT_NOT_FOUND_OR_INVALID)
  - 결제 금액이 주문 금액과 일치하는지 확인 (400 AMOUNT_MISMATCH)

### 중복 처리 방지

- 주문 상태를 확인하여 이미 처리된 결제인지 검증
- 중복 결제 승인 요청 방지

---

## 의존성 관리

### 신규 패키지 설치

없음 (기존 패키지 활용)

### 기존 패키지 활용

- `@tanstack/react-query`: 서버 상태 관리
- `axios`: HTTP 클라이언트
- `next`: 프레임워크
- `react`: UI 라이브러리

---

## 유틸리티 함수

### 결제 관련 유틸리티

```typescript
// src/commons/utils/payment.ts (신규 추가)
/**
 * 토스페이먼츠 콜백 URL에서 결제 정보 추출
 * 
 * @param searchParams - URL 쿼리 파라미터
 * @returns 결제 정보 또는 null (파라미터 누락 시)
 */
export function extractPaymentInfoFromUrl(
  searchParams: URLSearchParams
): TossPaymentCallbackParams | null {
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  if (!paymentKey || !orderId || !amount) {
    return null;
  }
  
  return {
    paymentKey,
    orderId,
    amount,
  };
}

/**
 * 결제 실패 원인을 사용자 친화적인 메시지로 변환
 * 
 * @param errorCode - 에러 코드 (예: AMOUNT_MISMATCH, ORDER_ALREADY_PAID 등)
 * @param errorMessage - 에러 메시지
 * @returns 사용자 친화적인 메시지
 */
export function convertErrorCodeToMessage(
  errorCode?: string,
  errorMessage?: string
): string {
  const errorMessages: Record<string, string> = {
    AMOUNT_MISMATCH: '결제 금액이 주문 금액과 일치하지 않습니다.',
    ORDER_ALREADY_PAID: '이미 결제가 완료된 주문입니다.',
    ORDER_NOT_FOUND: '주문을 찾을 수 없습니다.',
    ORDER_NOT_OWNED: '본인의 주문이 아닙니다.',
    PRODUCT_NOT_FOUND_OR_INVALID: '유효하지 않은 상품입니다.',
    TOSS_SECRET_KEY_REQUIRED: '결제 서비스 설정 오류가 발생했습니다.',
    TOSS_CONFIRM_FAILED: '결제 승인 처리 중 오류가 발생했습니다.',
  };
  
  return errorMessages[errorCode || ''] || errorMessage || '결제 처리 중 오류가 발생했습니다.';
}
```

---

## 다음 단계

1. `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록 생성
2. 작업 목록에 따라 순차적으로 구현 진행
3. 각 단계별 테스트 작성 및 통과 확인
