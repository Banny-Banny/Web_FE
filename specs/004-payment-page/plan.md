# 토스 결제 페이지 기술 계획서

**Branch**: `feat/payment-page` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-payment-page/spec.md`

## Summary

토스 결제 페이지를 구현하여 사용자가 타임캡슐 주문 정보를 확인하고 안전하게 결제를 완료할 수 있도록 합니다.

**주요 목표**:
- 이전 페이지에서 전달받은 타임캡슐 정보 표시 (캡슐명, 인원수, 가격)
- 주문 정보 요약 및 결제 금액 표시
- 토스 결제 위젯 연동 및 결제 프로세스 처리
- 결제 전 주문 생성 API 호출 및 주문 정보 조회
- Figma 디자인과 pixel-perfect 수준으로 일치하는 UI 구현

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Query를 활용한 서버 상태 관리 (주문 생성, 주문 조회)
- Axios 인터셉터를 통한 인증 토큰 자동 첨부
- 토스페이먼츠 SDK를 활용한 결제 위젯 연동
- CSS Module 기반 스타일링 (375px 모바일 고정 레이아웃)
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- Next.js App Router를 활용한 라우팅 및 데이터 전달

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, @tanstack/react-query, Axios, @tosspayments/payment-widget-sdk, Tailwind CSS v4  
**Storage**: N/A (주문 정보는 API를 통해 관리)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 페이지 로드 시간 2초 이하, 주문 생성 시간 2초 이하, 주문 조회 시간 1초 이하  
**Constraints**: 
- 375px 모바일 고정 레이아웃
- 반응형 디자인 미지원
- 디자인 토큰은 `src/commons/styles`에서 import (중복 선언 금지)
- Figma 디자인과 정확히 일치해야 함
- 모든 API 요청에 인증 토큰 필수 (NEXT_PUBLIC_DEV_TOKEN 사용)
- 토스 결제 위젯 연동 필수
**Scale/Scope**: 결제 페이지 1개 + 주문 정보 표시 컴포넌트 + 결제 위젯 컴포넌트 + API 연동

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/PaymentPage/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query를 활용한 서버 상태 관리  
✅ **API 통신**: Axios 인터셉터를 통한 인증 토큰 자동 첨부  
✅ **결제 연동**: 토스페이먼츠 SDK를 활용한 결제 위젯 연동  
✅ **성능**: 페이지 로드 성능 및 API 응답 시간 고려

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
│   └── PaymentPage/                  # 결제 페이지 컴포넌트
│       ├── index.tsx                # 메인 컨테이너 컴포넌트
│       ├── types.ts                 # 타입 정의
│       ├── styles.module.css        # 스타일 (CSS Module)
│       ├── hooks/                   # 페이지별 비즈니스 로직
│       │   ├── useOrder.ts          # 주문 생성 및 조회 훅
│       │   ├── usePayment.ts        # 결제 프로세스 관리 훅
│       │   └── useTimecapsuleInfo.ts # 타임캡슐 정보 관리 훅
│       ├── components/              # UI 컴포넌트
│       │   ├── TimecapsuleInfo/     # 타임캡슐 정보 표시
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── OrderSummary/        # 주문 정보 요약
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── PaymentAmount/       # 결제 금액 표시
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── TossPaymentWidget/   # 토스 결제 위젯
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   └── PaymentStatus/       # 결제 상태 표시
│       │       ├── index.tsx
│       │       ├── types.ts
│       │       └── styles.module.css
│       └── utils/                    # 유틸리티 함수
│           └── formatCurrency.ts    # 금액 포맷팅
└── commons/
    ├── apis/                         # API 함수
    │   └── orders/                   # 주문 관련 API
    │       ├── index.ts              # API 함수 및 타입 정의
    │       └── types.ts              # 주문 관련 타입
    ├── components/                   # 공용 컴포넌트 (재사용)
    │   ├── button/                   # Button 컴포넌트
    │   ├── loading/                  # Loading 컴포넌트
    │   └── error-message/           # ErrorMessage 컴포넌트
    ├── hooks/                        # 공통 로직 (전역 사용)
    │   └── useAuth.ts                # 인증 관련 훅 (토큰 관리)
    └── styles/                       # 디자인 토큰
        ├── color.ts
        ├── spacing.ts
        ├── fonts.ts
        └── typography.ts
```

**Structure Decision**: 
- 페이지 컴포넌트는 `src/components/PaymentPage/`에 배치
- 라우팅은 `src/app/(main)/payment/page.tsx`에서 컴포넌트 import만 수행
- API 관련 로직은 `src/commons/apis/orders/`에 배치
- React Query 훅은 `hooks/` 디렉토리에 분리
- UI 컴포넌트는 `components/` 디렉토리에 개별 컴포넌트로 구성
- 토스 결제 위젯은 별도 컴포넌트로 분리

---

## Implementation Strategy

### Phase 0: 프로젝트 설정 및 의존성 설치

**목적**: 필요한 라이브러리 설치 및 환경 설정

**작업**:
1. **토스페이먼츠 SDK 설치**
   ```bash
   npm install @tosspayments/payment-widget-sdk
   ```
   - 토스 결제 위젯 연동을 위한 SDK 설치
   - TypeScript 타입 정의 포함

2. **환경 변수 설정 확인**
   - `.env.local`에 `NEXT_PUBLIC_DEV_TOKEN` 확인
   - 토스페이먼츠 클라이언트 키 설정 (필요시)
   - API 베이스 URL 확인

3. **API 엔드포인트 추가**
   - `src/commons/apis/endpoints.ts`에 주문 및 토스 결제 관련 엔드포인트 추가
     - `POST /api/orders` - 주문 생성
     - `GET /api/orders/{id}` - 주문 조회
     - `POST /api/payments/toss/confirm` - 토스 결제 최종 승인

**결과물**:
- 토스페이먼츠 SDK 설치 완료
- 환경 변수 설정 완료
- API 엔드포인트 정의 완료

---

### Phase 1: 프로젝트 구조 및 타입 정의

**목적**: 기본 구조 설정 및 타입 정의

**작업**:
1. **디렉토리 구조 생성**
   - `src/components/PaymentPage/` 디렉토리 생성
   - 하위 디렉토리 구조 생성 (hooks, components, utils)
   - `src/commons/apis/orders/` 디렉토리 생성
   - `src/commons/apis/payments/` 디렉토리 생성

2. **타입 정의 (`types.ts`)**
   - 주문 데이터 타입 (`Order`, `OrderStatus`)
   - 타임캡슐 정보 타입 (`TimecapsuleInfo`)
   - 결제 정보 타입 (`PaymentInfo`, `PaymentStatus`)
   - API 요청/응답 타입 (`CreateOrderRequest`, `CreateOrderResponse`, `GetOrderResponse`, `ConfirmPaymentRequest`, `ConfirmPaymentResponse`)
   - 결제 위젯 설정 타입 (`TossPaymentWidgetConfig`)

3. **API 타입 정의**
   - `src/commons/apis/orders/types.ts`: 주문 생성/조회 관련 타입
   - `src/commons/apis/payments/types.ts`: 토스 결제 승인 관련 타입
     - 결제 최종 승인 요청 타입 (`ConfirmPaymentRequest`)
     - 결제 최종 승인 응답 타입 (`ConfirmPaymentResponse`)
     - 에러 응답 타입

**결과물**:
- 완전한 디렉토리 구조
- TypeScript 타입 정의
- API 타입 정의

---

### Phase 2: API 연동 레이어 구축

**목적**: 백엔드와의 통신 인터페이스 확립

**작업**:
1. **API 함수 구현**
   - `src/commons/apis/orders/index.ts`:
     - `createOrder`: 주문 생성 API 호출
       - 요청: 타임캡슐 정보 (캡슐명, 인원수, 가격)
       - 응답: 주문 ID 및 주문 정보
     - `getOrder`: 주문 조회 API 호출
       - 요청: 주문 ID
       - 응답: 주문 상세 정보
   - `src/commons/apis/payments/index.ts`:
     - `confirmPayment`: 토스 결제 최종 승인 API 호출
       - 요청: paymentKey, orderId, amount
       - 응답: 결제 승인 결과 (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url)
     - 에러 핸들링 및 타입 안전성 보장

2. **Axios 인터셉터 확인**
   - `src/commons/provider/api-provider/api-client.ts` 확인
   - 인증 토큰 자동 첨부 확인
   - `NEXT_PUBLIC_DEV_TOKEN` 사용 확인
   - 에러 처리 로직 확인

3. **React Query 훅 구현**
   - `src/components/PaymentPage/hooks/useOrder.ts`:
     - `useCreateOrder`: 주문 생성 뮤테이션
     - `useGetOrder`: 주문 조회 쿼리
   - `src/components/PaymentPage/hooks/usePayment.ts`:
     - `useConfirmPayment`: 결제 최종 승인 뮤테이션
   - 로딩 상태, 에러 상태 관리
   - 낙관적 업데이트 (필요시)

**결과물**:
- 완전히 작동하는 API 통신 레이어
- React Query 훅 구현 완료
- 타입 안전한 API 호출

---

### Phase 3: Figma 디자인 분석 및 디자인 토큰 확인

**목적**: Figma 디자인 스펙 확인 및 디자인 토큰 매핑

**작업**:
1. **Figma MCP 서버를 통해 디자인 스펙 추출**
   - 결제 페이지 전체 레이아웃
   - 타임캡슐 정보 표시 영역
   - 주문 정보 요약 영역
   - 결제 금액 표시 영역
   - 토스 결제 위젯 영역
   - 결제 상태 표시 영역

2. **`src/commons/styles`에 정의된 디자인 토큰 확인**
   - 색상: `Colors`
   - 간격: `Spacing`
   - 타이포그래피: `Typography`
   - 반경: `BorderRadius`

3. **디자인 토큰 매핑**
   - Figma에서 추출한 값과 프로젝트 디자인 토큰 매핑
   - CSS 변수로 사용할 토큰 식별

**결과물**:
- 디자인 스펙 문서
- 디자인 토큰 매핑 테이블
- CSS Module에서 사용할 CSS 변수 목록

---

### Phase 4: 기본 UI 컴포넌트 구현 (Priority: P1)

**목적**: 각 정보 표시 컴포넌트 구현

**작업 순서**:
1. **TimecapsuleInfo 컴포넌트**
   - 이전 페이지에서 전달받은 타임캡슐 정보 표시
   - 캡슐명, 참여 인원 수, 가격 표시
   - CSS Module로 스타일 구현
   - 정보가 없는 경우 처리

2. **OrderSummary 컴포넌트**
   - 주문 정보 요약 표시
   - 주문 항목 명확하게 표시
   - CSS Module로 스타일 구현
   - 로딩 상태 표시

3. **PaymentAmount 컴포넌트**
   - 총 결제 금액 표시
   - 금액 포맷팅 (천 단위 구분)
   - CSS Module로 스타일 구현
   - 금액 강조 표시

4. **PaymentStatus 컴포넌트**
   - 결제 상태 표시 (대기, 진행 중, 완료, 실패)
   - 결제 완료/실패 메시지 표시
   - CSS Module로 스타일 구현

**결과물**:
- 4개 정보 표시 컴포넌트 구현 완료
- TypeScript 타입 정의 완료
- CSS Module 스타일 구현 완료

---

### Phase 5: 토스 결제 위젯 연동 (Priority: P1)

**목적**: 토스페이먼츠 SDK를 활용한 결제 위젯 구현

**작업**:
1. **TossPaymentWidget 컴포넌트 구현**
   - 토스페이먼츠 SDK 초기화
   - 결제 위젯 렌더링
   - 결제 수단 선택 지원
   - 결제 정보 입력 지원
   - CSS Module로 스타일 구현

2. **usePayment 훅 구현**
   - 결제 위젯 초기화 로직
   - 결제 프로세스 관리
   - 결제 완료/실패 처리
   - 에러 처리

3. **결제 위젯 설정**
   - 클라이언트 키 설정
   - 고객 정보 설정
   - 결제 금액 설정
   - 결제 성공/실패 콜백 설정

**결과물**:
- 토스 결제 위젯 컴포넌트 구현 완료
- 결제 프로세스 관리 훅 구현 완료
- 결제 위젯 정상 작동 확인

---

### Phase 6: 주문 생성 및 조회 로직 구현 (Priority: P1)

**목적**: 결제 전 주문 생성 및 주문 정보 조회

**작업**:
1. **useOrder 훅 확장**
   - 페이지 로드 시 자동 주문 생성
   - 주문 생성 실패 시 재시도 로직
   - 주문 정보 조회 로직
   - 주문 상태 관리

2. **useTimecapsuleInfo 훅 구현**
   - 이전 페이지에서 전달받은 타임캡슐 정보 관리
   - URL 쿼리 파라미터 또는 상태 관리 라이브러리를 통한 데이터 수신
   - 정보가 없는 경우 처리 (타임캡슐 생성 페이지로 리다이렉트)

3. **주문 생성 플로우**
   - 타임캡슐 정보를 기반으로 주문 생성
   - 주문 생성 성공 시 주문 ID 저장
   - 주문 생성 실패 시 에러 메시지 표시 및 재시도 옵션 제공

**결과물**:
- 주문 생성 및 조회 로직 구현 완료
- 타임캡슐 정보 관리 로직 구현 완료
- 에러 처리 로직 구현 완료

---

### Phase 7: 메인 페이지 컴포넌트 구현 (Priority: P1)

**목적**: 모든 컴포넌트를 통합한 메인 페이지 구현

**작업**:
1. **PaymentPage 메인 컴포넌트**
   - TimeCapsuleHeader 컴포넌트 사용 (필요시)
   - TimecapsuleInfo 컴포넌트 통합
   - OrderSummary 컴포넌트 통합
   - PaymentAmount 컴포넌트 통합
   - TossPaymentWidget 컴포넌트 통합
   - PaymentStatus 컴포넌트 통합
   - 로딩 상태 표시
   - 에러 상태 표시
   - CSS Module로 레이아웃 스타일 구현

2. **라우팅 페이지 구현**
   - `src/app/(main)/payment/page.tsx` 생성
   - PaymentPage 컴포넌트 import 및 렌더링
   - 라우팅 전용 규칙 준수

3. **데이터 플로우**
   - 이전 페이지에서 타임캡슐 정보 수신
   - 주문 생성 API 호출
   - 주문 정보 조회
   - 결제 위젯에 정보 전달
   - 결제 완료 후 처리

**결과물**:
- 완전한 결제 페이지
- 라우팅 설정 완료
- 데이터 플로우 구현 완료

---

### Phase 8: 스타일링 및 디자인 적용 (Priority: P1)

**목적**: Figma 디자인과 정확히 일치하도록 스타일 적용

**작업**:
1. **CSS Module로 컴포넌트별 스타일 구현**
   - 각 컴포넌트의 `styles.module.css` 파일에 스타일 작성
   - CSS 변수를 사용하여 디자인 토큰 참조
     - 색상: `var(--color-*)` (예: `var(--color-black-500)`)
     - 간격: `var(--spacing-*)` (예: `var(--spacing-xl)`)
     - 반경: `var(--radius-*)` (예: `var(--radius-xl)`)
     - 폰트: `var(--font-*)`, `var(--font-size-*)`, `var(--font-weight-*)` 등
   - 디자인 토큰은 `src/commons/styles/`에 TypeScript 객체로 정의되어 있으며, `src/app/layout.tsx`에서 CSS 변수로 변환되어 `:root`에 주입됨
   - Figma에서 추출한 수치 값 반올림 적용
   - 375px 기준 고정 레이아웃
   - 하드코딩된 색상값(hex/rgb/hsl) 사용 금지
   - 인라인 스타일(`style={...}`) 사용 금지

2. **레이아웃 스타일링**
   - 375px 기준 고정 레이아웃
   - 컴포넌트 간 간격
   - 결제 위젯 영역 스타일
   - 결제 상태 표시 영역 스타일

3. **로딩 및 에러 상태 스타일링**
   - 로딩 상태 표시 스타일
   - 에러 메시지 스타일
   - 재시도 버튼 스타일

**결과물**:
- Figma 디자인과 정확히 일치하는 스타일
- CSS Module 기반 컴포넌트별 스타일 격리
- CSS 변수를 통한 디자인 토큰 기반 일관된 스타일링

---

### Phase 9: 접근성 및 사용자 경험 개선 (Priority: P2)

**목적**: 접근성 요구사항 충족 및 사용자 경험 최적화

**작업**:
1. **접근성 개선**
   - 모든 정보 표시 영역에 적절한 라벨 (`<label>` 또는 `aria-label`)
   - 결제 위젯이 스크린 리더를 통해 접근 가능하도록 설정
   - 키보드 네비게이션 지원
   - 최소 터치 타겟 크기 44px × 44px 보장
   - 색상 대비 WCAG AA 기준 준수

2. **사용자 경험 개선**
   - 주문 정보가 명확하고 이해하기 쉬운 형태로 표시
   - 결제 프로세스 진행 상황 표시
   - 에러 메시지 명확성 향상
   - 로딩 상태 표시 개선

3. **성능 최적화**
   - 페이지 로드 최적화
   - API 응답 시간 최적화
   - 불필요한 리렌더링 방지
   - 컴포넌트 메모이제이션 (필요시)

**결과물**:
- 접근성 요구사항 충족
- 사용자 경험 최적화 완료
- 성능 최적화 완료

---

### Phase 10: E2E 테스트 작성 (Priority: P1)

**목적**: 사용자 시나리오 기반 E2E 테스트 작성

**작업**:
1. **Playwright 테스트 파일 생성**
   - `tests/payment-page.spec.ts` 생성
   - `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN`을 사용하여 인증 상태 설정

2. **주요 테스트 시나리오**
   - 결제 페이지 접근 테스트
   - 타임캡슐 정보 표시 테스트
   - 주문 생성 API 호출 테스트 (인증 토큰 필수)
   - 주문 정보 표시 테스트
   - 결제 금액 표시 테스트
   - 토스 결제 위젯 표시 테스트
   - 결제 프로세스 테스트 (Mock)
   - 결제 완료 후 처리 테스트

3. **에러 처리 테스트**
   - 주문 생성 실패 시 에러 메시지 표시 테스트
   - 주문 정보 조회 실패 시 에러 메시지 표시 테스트
   - 결제 위젯 로드 실패 시 에러 메시지 표시 테스트
   - 네트워크 오류 처리 테스트

4. **접근성 테스트**
   - 키보드 네비게이션 테스트
   - 스크린 리더 지원 테스트

**결과물**:
- 완전한 E2E 테스트 스위트
- 자동화된 테스트 실행 가능
- 인증 토큰을 사용한 테스트 구현

---

## Component-Specific Implementation Details

### PaymentPage Main Component

**구조**:
```typescript
interface PaymentPageProps {
  // props 없음 (자체적으로 모든 상태 관리)
}
```

**기능**:
- 이전 페이지에서 타임캡슐 정보 수신
- 주문 생성 API 호출 (React Query)
- 주문 정보 조회 (React Query)
- 모든 정보 표시 컴포넌트 통합
- 토스 결제 위젯 통합
- 결제 완료/실패 처리

---

### TimecapsuleInfo Component

**구조**:
```typescript
interface TimecapsuleInfoProps {
  capsuleName: string;
  participantCount: number;
  price: number;
}
```

**기능**:
- 캡슐명 표시
- 참여 인원 수 표시
- 가격 표시
- 정보가 없는 경우 처리

---

### OrderSummary Component

**구조**:
```typescript
interface OrderSummaryProps {
  order: Order | null;
  isLoading: boolean;
  error: Error | null;
}
```

**기능**:
- 주문 정보 요약 표시
- 주문 항목 명확하게 표시
- 로딩 상태 표시
- 에러 상태 표시

---

### PaymentAmount Component

**구조**:
```typescript
interface PaymentAmountProps {
  amount: number;
}
```

**기능**:
- 총 결제 금액 표시
- 금액 포맷팅 (천 단위 구분)
- 금액 강조 표시

---

### TossPaymentWidget Component

**구조**:
```typescript
interface TossPaymentWidgetProps {
  amount: number;
  orderId: string;
  customerKey: string;
  onSuccess: (paymentResult: PaymentResult) => void;
  onFail: (error: PaymentError) => void;
}
```

**기능**:
- 토스페이먼츠 SDK 초기화
- 결제 위젯 렌더링
- 결제 수단 선택 지원
- 결제 정보 입력 지원
- 결제 완료/실패 콜백 처리

---

### PaymentStatus Component

**구조**:
```typescript
interface PaymentStatusProps {
  status: PaymentStatus;
  message?: string;
}
```

**기능**:
- 결제 상태 표시 (대기, 진행 중, 완료, 실패)
- 결제 완료/실패 메시지 표시
- 상태별 시각적 구분

---

## API Integration Details

### 주문 생성 API

**엔드포인트**: `POST /api/orders`

**요청**:
```typescript
interface CreateOrderRequest {
  capsuleName: string;
  participantCount: number;
  price: number;
}
```

**응답**:
```typescript
interface CreateOrderResponse {
  orderId: string;
  status: OrderStatus;
  amount: number;
  createdAt: string;
}
```

**에러 처리**:
- 401: 인증 실패 → 토큰 갱신 또는 로그인 페이지로 리다이렉트
- 400: 잘못된 요청 → 에러 메시지 표시
- 500: 서버 오류 → 에러 메시지 표시 및 재시도 옵션 제공

---

### 주문 조회 API

**엔드포인트**: `GET /api/orders/{id}`

**요청**: 주문 ID (URL 파라미터)

**응답**:
```typescript
interface GetOrderResponse {
  orderId: string;
  capsuleName: string;
  participantCount: number;
  price: number;
  status: OrderStatus;
  amount: number;
  createdAt: string;
  paidAt?: string;
}
```

**에러 처리**:
- 401: 인증 실패 → 토큰 갱신 또는 로그인 페이지로 리다이렉트
- 404: 주문을 찾을 수 없음 → 에러 메시지 표시 및 주문 재생성 안내
- 500: 서버 오류 → 에러 메시지 표시 및 재시도 옵션 제공

---

### 토스 결제 최종 승인 API

**엔드포인트**: `POST /api/payments/toss/confirm`

**설명**: 토스 결제 위젯에서 결제가 완료된 후 백엔드에 최종 승인을 요청합니다. 프론트엔드에서 successUrl로 리다이렉트된 성공 페이지에서 호출합니다.

**요청**:
```typescript
interface ConfirmPaymentRequest {
  paymentKey: string;  // 토스에서 전달받은 paymentKey (1~200자)
  orderId: string;     // 주문 ID (6~200자)
  amount: number;     // 결제 금액
}
```

**응답** (201 Created):
```typescript
interface ConfirmPaymentResponse {
  order_id: string;
  payment_key: string;
  status: 'PAID';
  amount: number;
  approved_at: string;  // ISO 8601 형식
  capsule_id: string;   // 생성된 캡슐 UUID
  receipt_url: string;  // 영수증 URL
}
```

**검증 규칙**:
- 주문이 존재하는지 확인
- 요청 사용자가 주문자와 일치하는지 확인
- 이미 결제 완료(PAID) 상태가 아닌지 확인
- 상품이 TIME_CAPSULE인지 확인
- 결제 금액이 주문 금액과 일치하는지 확인

**에러 처리**:
- 400: 
  - `AMOUNT_MISMATCH`: 결제 금액이 주문 금액과 불일치
  - `ORDER_ALREADY_PAID`: 이미 결제 완료된 주문
  - `TOSS_SECRET_KEY_REQUIRED`: 토스 비밀키가 없음
  - `TOSS_CONFIRM_FAILED: <토스 응답>`: 토스 승인 호출 실패
- 401: 
  - `ORDER_NOT_OWNED`: 주문 소유자 불일치
  - JWT 누락/만료
- 404: 
  - `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
  - `PRODUCT_NOT_FOUND_OR_INVALID`: 상품 타입이 TIME_CAPSULE이 아님

**동작 방식**:
1. 사용자가 토스 결제 완료 후 `paymentKey`, `orderId`, `amount`를 JWT와 함께 전송
2. 서버는 주문 존재, 주문자 일치, PAID 상태 아님, 상품 타입 TIME_CAPSULE, 금액 일치 검증
3. 실연동(`TOSS_PAY_ENABLE=true`)이면 `TOSS_SECRET_KEY`를 Basic 인증 헤더로 사용해 토스 `v1/payments/confirm` 호출, 그 외에는 모킹 응답 생성
4. 토스 응답을 Payment 엔티티에 매핑해 상태를 PAID로 저장하고, 주문 상태도 PAID로 갱신
5. 결제 완료된 주문으로 캡슐을 생성한 뒤 결과 반환

**참고사항**:
- 백엔드는 리다이렉트 URL을 만들거나 반환하지 않음
- 프론트엔드에서 Toss Payments SDK 호출 시 successUrl/failUrl을 프론트엔드 도메인으로 설정
- 성공 페이지(예: `/pay/toss/success`)에서 URL 쿼리 파라미터로 paymentKey, orderId, amount를 받아 백엔드에 승인 요청

---

## Authentication & Token Management

### 인증 토큰 사용

**개발 환경**:
- `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- 모든 API 요청 헤더에 `Authorization: Bearer {token}` 형식으로 포함

**Axios 인터셉터**:
- `src/commons/provider/api-provider/api-client.ts`의 요청 인터셉터에서 자동으로 토큰 첨부
- 토큰은 로컬 스토리지 또는 환경 변수에서 가져옴

**테스트 환경**:
- Playwright 테스트 시 `NEXT_PUBLIC_DEV_TOKEN`을 사용하여 인증된 상태로 테스트
- 테스트에서 토큰을 설정하여 API 요청 시 자동으로 포함되도록 함

---

## Toss Payment Widget Integration

### SDK 초기화

```typescript
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

const paymentWidget = await loadPaymentWidget(
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '',
  'customer-key'
);
```

### 결제 위젯 렌더링

```typescript
paymentWidget.renderPaymentMethods('#payment-widget', amount);
```

### 결제 요청

```typescript
await paymentWidget.requestPayment({
  orderId: orderId,
  orderName: capsuleName,
  successUrl: `${window.location.origin}/pay/toss/success`,
  failUrl: `${window.location.origin}/pay/toss/fail`,
});
```

### 결제 완료/실패 처리

- 결제 성공: successUrl로 리다이렉트 (프론트엔드 도메인의 성공 페이지)
- 결제 실패: failUrl로 리다이렉트 (프론트엔드 도메인의 실패 페이지)
- 성공 페이지에서 URL 쿼리 파라미터로 paymentKey, orderId, amount를 받음
- 성공 페이지에서 백엔드 `POST /api/payments/toss/confirm` API를 호출하여 최종 승인 처리
- 결제 위젯은 리다이렉트만 처리하고, 실제 승인은 프론트엔드에서 백엔드 API 호출

---

## Error Handling Strategy

### 주문 생성 실패

**처리 방법**:
- 사용자에게 명확한 에러 메시지 표시
- 재시도 버튼 제공
- 문제가 지속되면 고객 지원 안내

### 주문 정보 조회 실패

**처리 방법**:
- 사용자에게 명확한 에러 메시지 표시
- 재시도 버튼 제공
- 주문 정보가 없는 경우 주문 재생성 안내

### 결제 위젯 로드 실패

**처리 방법**:
- 사용자에게 명확한 에러 메시지 표시
- 페이지 새로고침 안내
- 문제가 지속되면 고객 지원 안내

### 토스 결제 승인 실패

**처리 방법**:
- 에러 코드에 따라 명확한 에러 메시지 표시
  - `AMOUNT_MISMATCH`: 결제 금액 불일치 안내
  - `ORDER_ALREADY_PAID`: 이미 결제 완료된 주문 안내
  - `ORDER_NOT_OWNED`: 주문 소유자 불일치 안내
  - `ORDER_NOT_FOUND`: 주문을 찾을 수 없음 안내
  - `TOSS_CONFIRM_FAILED`: 토스 승인 실패 안내
- 재시도 버튼 제공 (가능한 경우)
- 문제가 지속되면 고객 지원 안내

### 네트워크 오류

**처리 방법**:
- 사용자에게 네트워크 오류 메시지 표시
- 결제 상태 확인 안내
- 재시도 옵션 제공

### 인증 토큰 만료

**처리 방법**:
- 자동으로 토큰 갱신 시도
- 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
- 사용자에게 적절한 안내 메시지 표시

---

## Testing Strategy

### E2E 테스트 (Playwright)

**테스트 범위**:
- 결제 페이지 접근
- 타임캡슐 정보 표시
- 주문 생성 API 호출 (인증 토큰 필수)
- 주문 정보 표시
- 결제 금액 표시
- 토스 결제 위젯 표시
- 결제 프로세스 (Mock)
- 결제 완료 후 처리

**인증 설정**:
- `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN` 사용
- 테스트에서 토큰을 설정하여 인증된 상태로 테스트

### UI 테스트 (Playwright)

**테스트 범위**:
- 컴포넌트 렌더링
- 사용자 상호작용
- 시각적 검증

---

## Performance Considerations

### 페이지 로드 최적화

- 코드 분할: 페이지별 동적 임포트
- 이미지 최적화: Next.js Image 컴포넌트 (375px 기준)
- 번들 최적화: 불필요한 라이브러리 제거

### API 응답 시간 최적화

- React Query 캐싱 전략
- 낙관적 업데이트 (필요시)
- 재시도 전략 최적화

### 렌더링 최적화

- 컴포넌트 메모이제이션 (필요시)
- 불필요한 리렌더링 방지
- 로딩 상태 최적화

---

## Security Considerations

### 인증 토큰 보안

- 환경 변수를 통한 토큰 관리
- Axios 인터셉터를 통한 자동 토큰 첨부
- 토큰 만료 시 자동 갱신

### 결제 정보 보안

- 토스페이먼츠 SDK를 통한 안전한 결제 처리
- 결제 정보는 서버로 직접 전송하지 않음
- 결제 위젯 내부에서 모든 결제 정보 처리

---

## Future Enhancements

### 향후 개선 사항

- 결제 수단 선택 옵션 확대
- 결제 내역 조회 기능
- 결제 취소 및 환불 기능
- 결제 알림 기능
- 결제 프로세스 개선

### 확장 가능한 기능

- 여러 타임캡슐 일괄 결제
- 할인 쿠폰 적용
- 포인트 적립 및 사용
- 정기 결제 옵션
- 결제 방법 저장

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
