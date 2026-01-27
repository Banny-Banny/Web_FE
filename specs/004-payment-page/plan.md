# 결제 페이지 기술 구현 계획

**Branch**: `feat/payment-page` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)  
**Input**: 결제 페이지 기능 명세서 (`specs/004-payment-page/spec.md`)

## Summary

타임캡슐 주문 정보를 확인하고 토스 결제를 완료할 수 있는 결제 페이지를 구현합니다. 주문 ID를 URL 쿼리 파라미터로 받아 주문 정보를 조회하고, 토스페이먼츠 SDK를 사용하여 토스 결제 위젯을 연동합니다. React Query를 활용한 서버 상태 관리와 Axios 기반 API 통신을 통해 안정적인 결제 플로우를 제공합니다.

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: 
- `@tanstack/react-query` (v5.90.20) - 서버 상태 관리
- `axios` (v1.13.2) - HTTP 클라이언트
- `@tosspayments/payment-widget-sdk` - 토스페이먼츠 결제 위젯 SDK (추가 설치 필요)
- `next` (v16.1.4) - 프레임워크

**Storage**: 서버 상태는 React Query 캐시에 저장, 클라이언트 상태는 React State  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 모바일 웹 (375px 고정 레이아웃)  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: 
- 페이지 로드 시간 2초 이하
- 주문 정보 조회 응답 시간 1초 이하
- 토스 결제 위젯 로드 시간 3초 이하

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 모든 API 요청에 인증 토큰 포함 (`Authorization: Bearer {token}`)
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용

**Scale/Scope**: 
- 단일 결제 페이지 구현
- 주문 정보 조회 및 표시
- 토스 결제 위젯 연동
- 결제 완료/실패 처리

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/Payment/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query (서버 상태) + React State (클라이언트 상태)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부  
✅ **성능**: 페이지 로드 최적화, 결제 위젯 로드 최적화

---

## Project Structure

### Documentation (this feature)

```text
specs/004-payment-page/
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
│           └── page.tsx              # 라우팅 전용 (컴포넌트 import만)
├── components/
│   └── Payment/                      # 결제 페이지 컴포넌트
│       ├── index.tsx                 # 메인 컨테이너 컴포넌트
│       ├── types.ts                  # 타입 정의
│       ├── styles.module.css         # 스타일 (CSS Module)
│       ├── hooks/                    # 페이지별 비즈니스 로직
│       │   ├── usePayment.ts         # 결제 플로우 관리 훅
│       │   └── useOrderInfo.ts       # 주문 정보 조회 훅
│       └── components/               # UI 컴포넌트
│           ├── OrderSummary/         # 주문 정보 요약
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── PaymentAmount/        # 결제 금액 표시
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── TossPaymentWidget/   # 토스 결제 위젯 래퍼
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           └── PaymentStatus/       # 결제 상태 표시
│               ├── index.tsx
│               ├── types.ts
│               └── styles.module.css
└── commons/
    ├── apis/
    │   └── orders/
    │       ├── index.ts              # 주문 API 함수 (이미 존재)
    │       ├── types.ts              # 주문 타입 정의 (이미 존재)
    │       └── hooks/                 # React Query 훅 (신규 추가)
    │           ├── useOrder.ts      # 주문 정보 조회 훅
    │           └── useOrderStatus.ts # 주문 상태 조회 훅
    ├── hooks/
    │   └── usePayment.ts             # 결제 관련 전역 훅 (필요시)
    └── utils/
        └── payment.ts                # 결제 관련 유틸리티 함수
```

---

## 데이터 모델링

### API 타입 (기존 타입 활용)

```typescript
// src/commons/apis/orders/types.ts (이미 존재)
interface GetOrderResponse {
  order: OrderDetail;
  product: ProductInfo;
}

interface OrderDetail {
  order_id: string;
  time_option: TimeOption;
  custom_open_at: string | null;
  headcount: number;
  photo_count: number;
  add_music: boolean;
  add_video: boolean;
  status: OrderStatus;
  total_amount: number;
  capsule_id: string | null;
  invite_code: string | null;
  created_at: string;
  updated_at: string;
}
```

### 결제 페이지 컴포넌트 타입

```typescript
// src/components/Payment/types.ts
interface PaymentPageProps {
  // URL 쿼리 파라미터에서 주문 ID 추출
}

interface OrderSummaryData {
  orderId: string;
  capsuleName?: string; // 주문 정보에 포함되지 않을 수 있음
  headcount: number;
  timeOption: TimeOption;
  customOpenAt: string | null;
  photoCount: number;
  addMusic: boolean;
  addVideo: boolean;
  totalAmount: number;
}

interface PaymentState {
  status: 'idle' | 'loading' | 'pending' | 'success' | 'failed';
  error?: string;
  paymentId?: string;
}
```

### 토스페이먼츠 결제 요청 타입

```typescript
// 토스페이먼츠 SDK 타입 (라이브러리에서 제공)
interface TossPaymentRequest {
  orderId: string;
  orderName: string;
  amount: {
    currency: string;
    value: number;
  };
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
}
```

---

## API 설계

### 기존 API 활용

**주문 상세 조회** (`GET /api/orders/{id}`)
- **엔드포인트**: `ORDER_ENDPOINTS.DETAIL(orderId)`
- **함수**: `getOrder(orderId: string)` (이미 구현됨)
- **응답**: `GetOrderResponse`
- **용도**: 결제 페이지 로드 시 주문 정보 조회

**주문 상태 조회** (`GET /api/orders/{id}/status`)
- **엔드포인트**: `ORDER_ENDPOINTS.STATUS(orderId)`
- **함수**: `getOrderStatus(orderId: string)` (이미 구현됨)
- **응답**: `GetOrderStatusResponse`
- **용도**: 결제 완료 후 주문 상태 확인

### 결제 완료 API (백엔드 구현 필요, 프론트엔드에서는 호출만)

**결제 완료 처리** (`POST /api/payment/complete`)
- **요청**: `{ paymentId: string, orderId: string }`
- **응답**: `{ status: 'PAID' | 'FAILED', message?: string }`
- **용도**: 토스페이먼츠 결제 성공 후 서버에 결제 완료 알림

---

## 컴포넌트 설계

### 1. Payment (메인 컨테이너)

**역할**: 결제 페이지의 최상위 컨테이너, 전체 결제 플로우 관리

**책임**:
- URL 쿼리 파라미터에서 주문 ID 추출
- 주문 정보 조회 및 상태 관리
- 결제 플로우 오케스트레이션
- 에러 처리 및 사용자 안내

**구조**:
```tsx
<Payment>
  <OrderSummary data={orderData} />
  <PaymentAmount amount={totalAmount} />
  <TossPaymentWidget 
    orderId={orderId}
    amount={totalAmount}
    onSuccess={handlePaymentSuccess}
    onError={handlePaymentError}
  />
  <PaymentStatus status={paymentStatus} />
</Payment>
```

### 2. OrderSummary (주문 정보 요약)

**역할**: 주문 정보를 사용자에게 명확하게 표시

**표시 항목**:
- 캡슐명 (주문 정보에 포함된 경우)
- 참여 인원수
- 타임 옵션 (오픈 예정일)
- 추가 옵션 (사진 개수, 음악, 비디오)

**디자인**: Figma 디자인 시안 준수

### 3. PaymentAmount (결제 금액)

**역할**: 총 결제 금액을 명확하게 표시

**표시 형식**: 숫자 형식 (예: 10,000원)

**디자인**: 중요한 정보이므로 시각적으로 강조

### 4. TossPaymentWidget (토스 결제 위젯)

**역할**: 토스페이먼츠 SDK를 사용하여 토스 결제 위젯 연동

**기능**:
- 토스페이먼츠 SDK 초기화
- 결제 요청 생성 및 전송
- 결제 진행 상태 관리
- 결제 완료/실패 처리

**구현**:
```tsx
// 토스페이먼츠 SDK 사용 예시
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

const paymentWidget = await loadPaymentWidget(
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!,
  'customer-key-xxx'
);

await paymentWidget.requestPayment({
  orderId: generateOrderId(),
  orderName: orderName,
  successUrl: `${window.location.origin}/payment/success`,
  failUrl: `${window.location.origin}/payment/fail`,
  amount: {
    currency: 'KRW',
    value: totalAmount,
  },
});
```

### 5. PaymentStatus (결제 상태)

**역할**: 결제 진행 상태 및 결과 표시

**상태**:
- `idle`: 결제 대기
- `loading`: 주문 정보 로딩
- `pending`: 결제 진행 중
- `success`: 결제 완료
- `failed`: 결제 실패

---

## 상태 관리 전략

### 서버 상태 (React Query)

**주문 정보 조회**:
```typescript
// src/commons/apis/orders/hooks/useOrder.ts
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
```

**주문 상태 조회**:
```typescript
// src/commons/apis/orders/hooks/useOrderStatus.ts
export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ['orderStatus', orderId],
    queryFn: () => getOrderStatus(orderId),
    enabled: !!orderId,
    refetchInterval: (query) => {
      // 결제 진행 중일 때만 폴링
      return query.state.data?.order_status === 'PENDING_PAYMENT' 
        ? 3000 
        : false;
    },
  });
}
```

### 클라이언트 상태 (React State)

**결제 상태 관리**:
```typescript
// src/components/Payment/hooks/usePayment.ts
interface PaymentState {
  status: 'idle' | 'loading' | 'pending' | 'success' | 'failed';
  error?: string;
  paymentId?: string;
}

export function usePayment(orderId: string, totalAmount: number) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'idle',
  });

  const handlePaymentRequest = async () => {
    // 토스페이먼츠 결제 요청
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    // 결제 완료 처리
  };

  return {
    paymentState,
    handlePaymentRequest,
    handlePaymentSuccess,
  };
}
```

---

## 개발 워크플로우

### Step 1: API 연결

**목적**: 주문 정보 조회 API와 React Query 훅 구현

**작업**:
1. `src/commons/apis/orders/hooks/useOrder.ts` 생성
   - `getOrder` API를 React Query로 래핑
   - 에러 처리 및 로딩 상태 관리
2. `src/commons/apis/orders/hooks/useOrderStatus.ts` 생성
   - `getOrderStatus` API를 React Query로 래핑
   - 결제 진행 중 폴링 로직 구현
3. API 호출 단위 테스트 작성

**결과물**: 완전히 작동하는 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 결제 플로우 검증

**작업**:
1. 주문 정보 조회 테스트
2. 결제 페이지 로드 테스트
3. 결제 진행 플로우 테스트 (모킹)
4. 결제 실패 처리 테스트

**도구**: Playwright  
**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. Figma MCP를 사용하여 디자인 시안 확인
2. Mock 데이터 기반 UI 컴포넌트 구현
   - `OrderSummary` 컴포넌트
   - `PaymentAmount` 컴포넌트
   - `TossPaymentWidget` 컴포넌트 (초기에는 플레이스홀더)
   - `PaymentStatus` 컴포넌트
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

**목적**: 실제 API와 UI 연결, 토스 결제 위젯 연동

**작업**:
1. `usePayment` 훅 구현
   - 토스페이먼츠 SDK 초기화
   - 결제 요청 생성 및 전송
   - 결제 완료/실패 처리
2. Mock 데이터를 실제 API 호출로 교체
3. React Query 훅과 UI 컴포넌트 연결
4. 로딩/에러 상태 처리
5. 토스 결제 위젯 실제 연동

**결과물**: 완전히 작동하는 결제 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
   - 주문 정보 표시 테스트
   - 결제 금액 표시 테스트
   - 결제 위젯 연동 테스트
   - 결제 상태 표시 테스트
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 토스페이먼츠 SDK 연동

### 패키지 설치

```bash
npm install @tosspayments/payment-widget-sdk
```

### 환경 변수 설정

`.env.local`:
```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
```

### SDK 초기화 및 사용

```typescript
// src/components/Payment/components/TossPaymentWidget/index.tsx
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';

// 결제 위젯 초기화
const paymentWidget = await loadPaymentWidget(
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!,
  'customer-key-xxx' // 고객 키 (UUID 등)
);

// 결제 요청
await paymentWidget.requestPayment({
  orderId: generateOrderId(),
  orderName: orderName,
  successUrl: `${window.location.origin}/payment/success`,
  failUrl: `${window.location.origin}/payment/fail`,
  customerEmail: 'customer@example.com',
  customerName: '홍길동',
  amount: {
    currency: 'KRW',
    value: totalAmount,
  },
});

// 또는 결제창 방식 사용
import { TossPayments } from '@tosspayments/payment-sdk';

const tossPayments = TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
await tossPayments.requestPayment('카드', {
  amount: totalAmount,
  orderId: generateOrderId(),
  orderName: orderName,
  successUrl: `${window.location.origin}/payment/success`,
  failUrl: `${window.location.origin}/payment/fail`,
});
```

---

## 에러 처리 전략

### 주문 정보 조회 실패

**시나리오**: 주문 ID가 없거나 주문이 존재하지 않음

**처리**:
- 명확한 에러 메시지 표시
- 타임캡슐 생성 페이지로 이동할 수 있는 안내 제공

### 결제 진행 중 네트워크 오류

**시나리오**: 결제 진행 중 네트워크 연결 끊김

**처리**:
- 네트워크 오류 메시지 표시
- 재시도 옵션 제공
- 주문 상태 확인 및 복구

### 결제 실패

**시나리오**: 카드 한도 초과, 결제 정보 오류 등

**처리**:
- 결제 실패 원인 명확하게 안내
- 재시도 옵션 제공
- 주문 상태 적절하게 업데이트

---

## 성능 최적화

### 페이지 로드 최적화

- 주문 정보 조회는 React Query 캐싱 활용
- 결제 위젯은 동적 임포트로 지연 로딩
- 이미지 최적화 (Next.js Image 컴포넌트)

### 결제 위젯 로드 최적화

- 토스페이먼츠 SDK는 동적 임포트로 지연 로딩
- 결제 버튼 클릭 시에만 SDK 로드

### 상태 업데이트 최적화

- 결제 진행 중 폴링 간격 최적화 (3초)
- 불필요한 리렌더링 방지 (React.memo 활용)

---

## 테스트 전략

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 주문 ID로 결제 페이지 접근
2. 주문 정보 표시 확인
3. 결제 금액 확인
4. 결제 진행 (모킹)
5. 결제 완료 처리 확인

**파일 위치**: `tests/e2e/payment/payment.spec.ts`

### UI 테스트 (Playwright)

**테스트 항목**:
- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- 시각적 검증 (스크린샷 비교)

**파일 위치**: `tests/e2e/payment/payment-ui.spec.ts`

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

### 결제 정보 보안

- 토스페이먼츠 SDK를 통한 안전한 결제 처리
- 결제 정보는 서버로 직접 전송되지 않음
- 결제 완료 후 서버에 결제 ID만 전달

---

## 의존성 관리

### 신규 패키지 설치

```bash
npm install @tosspayments/payment-widget-sdk
```

### 기존 패키지 활용

- `@tanstack/react-query`: 서버 상태 관리
- `axios`: HTTP 클라이언트
- `next`: 프레임워크
- `react`: UI 라이브러리

---

## 다음 단계

1. `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록 생성
2. 작업 목록에 따라 순차적으로 구현 진행
3. 각 단계별 테스트 작성 및 통과 확인
