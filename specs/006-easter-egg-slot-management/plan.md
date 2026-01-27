# 이스터에그 슬롯 관리 기능 기술 계획서

**Branch**: `feat/easter-egg-slot-management` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-easter-egg-slot-management/spec.md`

## Summary

이스터에그 슬롯 조회 및 초기화 기능을 구현합니다. 사용자는 홈 화면의 egg-slot 컴포넌트에서 현재 사용 가능한 슬롯 개수를 확인하고, 슬롯 상세 모달에서 전체 슬롯 정보를 조회하며, 필요시 모든 이스터에그를 초기화하여 슬롯을 복구할 수 있습니다.

**주요 목표**:
- 슬롯 조회 API 연동 (GET /api/capsules/slots)
- 슬롯 초기화 API 연동 (POST /api/capsules/slots/reset)
- egg-slot 컴포넌트에 슬롯 조회 기능 통합
- 슬롯 상세 모달 (egg-slot-modal) 신규 생성
- 실시간 슬롯 상태 반영 로직 구현
- 초기화 확인 경고 다이얼로그 구현

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 및 훅 구현
- React Query를 활용한 서버 상태 관리 및 캐시 무효화
- 기존 easter-egg API 구조 확장
- api-client.ts를 통한 API 통신
- 슬롯 상태 전역 공유를 위한 React Query 캐시 활용

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, Axios, React Query (@tanstack/react-query)  
**Storage**: N/A (서버 상태는 React Query 캐시로 관리)  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- 슬롯 조회 응답 시간: 1초 이내
- 초기화 작업 완료 시간: 3초 이내
- UI 업데이트 반영: 2초 이내

**Constraints**: 
- API 엔드포인트:
  - GET /api/capsules/slots (슬롯 조회)
  - POST /api/capsules/slots/reset (슬롯 초기화)
- 슬롯 기본값: 3개
- 초기화는 되돌릴 수 없는 작업
- 인증된 사용자만 접근 가능

**Scale/Scope**: API 함수 + 훅 + 모달 컴포넌트 + 기존 컴포넌트 수정

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, API 함수는 `src/commons/apis/`에 배치  
✅ **디렉토리 구조**: API 함수는 `src/commons/apis/easter-egg/`, 모달은 `src/components/home/components/`  
✅ **타입 안전성**: TypeScript로 모든 API 요청/응답 타입 정의  
✅ **API 통신**: api-client.ts를 통한 일관된 API 통신  
✅ **에러 핸들링**: 표준화된 에러 처리 및 사용자 피드백  
✅ **상태 관리**: React Query를 활용한 서버 상태 관리 및 캐시 무효화  
✅ **UI 일관성**: 기존 UI 패턴 및 스타일 가이드 준수

---

## Project Structure

### Documentation (this feature)

```text
specs/006-easter-egg-slot-management/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   └── apis/
│       └── easter-egg/                      # 이스터에그 관련 API (확장)
│           ├── index.ts                   # API 함수 (슬롯 조회/초기화 추가)
│           └── types.ts                   # 타입 정의 (슬롯 타입 추가)
├── components/
│   └── home/
│       ├── hooks/                          # 홈 페이지 관련 훅
│       │   └── useSlotManagement.ts      # 슬롯 관리 훅 (신규)
│       └── components/
│           ├── egg-slot/
│           │   ├── index.tsx             # egg-slot 컴포넌트 (수정)
│           │   ├── types.ts              # 타입 정의 (확장)
│           │   └── styles.module.css     # 스타일
│           └── egg-slot-modal/            # 슬롯 상세 모달 (신규)
│               ├── index.tsx             # 모달 컴포넌트
│               ├── types.ts              # 타입 정의
│               ├── styles.module.css     # 스타일
│               └── components/
│                   └── reset-confirm-dialog/  # 초기화 확인 다이얼로그 (신규)
│                       ├── index.tsx
│                       ├── types.ts
│                       └── styles.module.css
└── app/
    └── (main)/
        └── page.tsx                       # 홈 페이지 (슬롯 모달 통합)
```

---

## Data Model

### API Request/Response Types

```typescript
// src/commons/apis/easter-egg/types.ts

/**
 * 슬롯 정보 응답
 */
export interface SlotInfoResponse {
  /** 전체 슬롯 개수 */
  totalSlots: number;
  /** 사용 중인 슬롯 개수 */
  usedSlots: number;
  /** 남은 슬롯 개수 */
  remainingSlots: number;
}

/**
 * 슬롯 초기화 응답
 */
export interface SlotResetResponse {
  /** 초기화된 슬롯 개수 */
  egg_slots: number;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
}
```

### Component Types

```typescript
// src/components/home/components/egg-slot/types.ts

/**
 * EggSlot 컴포넌트 Props
 */
export interface EggSlotProps {
  /** 남은 슬롯 개수 */
  count: number;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 로딩 상태 */
  isLoading?: boolean;
}

// src/components/home/components/egg-slot-modal/types.ts

/**
 * EggSlotModal 컴포넌트 Props
 */
export interface EggSlotModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}

/**
 * 슬롯 정보
 */
export interface SlotInfo {
  /** 전체 슬롯 개수 */
  totalSlots: number;
  /** 사용 중인 슬롯 개수 */
  usedSlots: number;
  /** 남은 슬롯 개수 */
  remainingSlots: number;
}

// src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/types.ts

/**
 * ResetConfirmDialog 컴포넌트 Props
 */
export interface ResetConfirmDialogProps {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean;
  /** 다이얼로그 닫기 핸들러 */
  onClose: () => void;
  /** 초기화 확인 핸들러 */
  onConfirm: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}
```

---

## Phase 0: Research & Context Gathering

### Existing Code Analysis

#### 1. API 클라이언트 구조

**파일**: `src/commons/provider/api-provider/api-client.ts`

- Axios 기반 API 클라이언트
- 토큰 자동 주입 (액세스 토큰, 리프레시 토큰)
- 401 에러 시 자동 토큰 갱신 및 재시도
- 인증 실패 시 로그인 페이지 리다이렉트

**슬롯 API 연동 시 고려사항**:
- GET 요청은 인증 헤더 자동 포함
- POST 요청도 동일하게 인증 헤더 자동 포함
- 401 에러 시 자동 처리되므로 별도 로직 불필요
- 네트워크 에러는 catch 블록에서 처리

#### 2. API 엔드포인트 관리

**파일**: `src/commons/apis/endpoints.ts`

- 모든 API 엔드포인트를 중앙에서 관리
- `TIMEEGG_ENDPOINTS`에 캡슐 관련 엔드포인트 정의
- 슬롯 관련 엔드포인트 추가 필요:
  - `GET_SLOTS`: `/api/capsules/slots`
  - `RESET_SLOTS`: `/api/capsules/slots/reset`

#### 3. 기존 이스터에그 API 구조

**파일**: `src/commons/apis/easter-egg/index.ts`, `types.ts`

- `createEasterEgg` 함수 구현됨
- multipart/form-data 전송 지원
- 타입 정의가 `types.ts`에 분리되어 있음

**확장 계획**:
- `getSlotInfo` 함수 추가
- `resetSlots` 함수 추가
- 관련 타입을 `types.ts`에 추가

#### 4. egg-slot 컴포넌트 현황

**파일**: `src/components/home/components/egg-slot/index.tsx`

- 현재 하드코딩된 `totalSlots = 3`
- `count` prop으로 남은 슬롯 개수를 받음
- `onClick` prop으로 클릭 이벤트 처리
- 시각적으로 채워진 알 / 빈 알 구분

**수정 계획**:
- `isLoading` prop 추가
- 로딩 중 스켈레톤 또는 로딩 인디케이터 표시
- 클릭 시 egg-slot-modal 열기

#### 5. React Query 사용 패턴

**확인 사항**:
- `@tanstack/react-query` 설치됨 (v5.90.20)
- 기존 프로젝트에서 React Query 사용 중

**슬롯 관리 훅 설계**:
- `useQuery`로 슬롯 조회
- `useMutation`으로 슬롯 초기화
- 초기화 성공 시 쿼리 캐시 무효화

### Research Questions & Answers

**Q1: 슬롯 조회는 언제 수행되어야 하는가?**
- A: 홈 페이지 마운트 시 자동 조회
- 이스터에그 생성 성공 후 자동 재조회
- 슬롯 초기화 성공 후 자동 재조회

**Q2: 슬롯 모달은 어떻게 열리는가?**
- A: egg-slot 컴포넌트 클릭 시 모달 열림
- 홈 페이지 컴포넌트에서 모달 상태 관리

**Q3: 초기화 확인 다이얼로그는 어떻게 구현하는가?**
- A: 슬롯 모달 내부에 별도 다이얼로그 컴포넌트로 분리
- "초기화" 버튼 클릭 시 다이얼로그 열림
- 다이얼로그에서 "확인" 클릭 시 초기화 API 호출

**Q4: 에러 처리는 어떻게 하는가?**
- A: React Query의 `error` 상태 활용
- 모달 내부에 에러 메시지 표시
- 401 에러는 api-client가 자동 처리
- 네트워크 에러는 재시도 버튼 제공

**Q5: 슬롯 상태는 전역으로 관리해야 하는가?**
- A: React Query 캐시가 전역 상태 역할
- 여러 컴포넌트에서 동일한 쿼리 키로 접근 가능
- 별도 전역 상태 관리 불필요

---

## Phase 1: Solution Design

### Architecture Decisions

#### 1. API Layer Design

**API 함수 구조**:

```typescript
// src/commons/apis/easter-egg/index.ts

/**
 * 슬롯 정보 조회 API
 */
export async function getSlotInfo(): Promise<SlotInfoResponse> {
  const response = await apiClient.get<SlotInfoResponse>(
    TIMEEGG_ENDPOINTS.GET_SLOTS
  );
  return response.data;
}

/**
 * 슬롯 초기화 API
 */
export async function resetSlots(): Promise<SlotResetResponse> {
  const response = await apiClient.post<SlotResetResponse>(
    TIMEEGG_ENDPOINTS.RESET_SLOTS
  );
  return response.data;
}
```

**엔드포인트 추가**:

```typescript
// src/commons/apis/endpoints.ts

export const TIMEEGG_ENDPOINTS = {
  // ... 기존 엔드포인트
  
  // 슬롯 관리
  GET_SLOTS: `${BASE_PATHS.API}/capsules/slots`,
  RESET_SLOTS: `${BASE_PATHS.API}/capsules/slots/reset`,
} as const;
```

#### 2. React Query Integration

**쿼리 키 설계**:

```typescript
// src/components/home/hooks/useSlotManagement.ts

export const SLOT_QUERY_KEYS = {
  slots: ['slots'] as const,
  slotInfo: () => [...SLOT_QUERY_KEYS.slots, 'info'] as const,
};
```

**슬롯 관리 훅 구조**:

```typescript
export function useSlotManagement() {
  // 슬롯 조회
  const {
    data: slotInfo,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SLOT_QUERY_KEYS.slotInfo(),
    queryFn: getSlotInfo,
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });

  // 슬롯 초기화
  const resetMutation = useMutation({
    mutationFn: resetSlots,
    onSuccess: () => {
      // 슬롯 정보 쿼리 무효화 및 재조회
      queryClient.invalidateQueries({
        queryKey: SLOT_QUERY_KEYS.slotInfo(),
      });
    },
  });

  return {
    slotInfo,
    isLoading,
    error,
    refetch,
    resetSlots: resetMutation.mutate,
    isResetting: resetMutation.isPending,
    resetError: resetMutation.error,
  };
}
```

#### 3. Component Structure

**컴포넌트 계층 구조**:

```
HomePage
├── EggSlot (슬롯 표시)
│   └── onClick → openModal
└── EggSlotModal (슬롯 상세)
    ├── SlotInfoDisplay (슬롯 정보 표시)
    └── ResetConfirmDialog (초기화 확인)
        ├── ConfirmButton
        └── CancelButton
```

**상태 관리 흐름**:

1. **슬롯 조회**:
   - HomePage 마운트 → useSlotManagement 훅 실행 → 슬롯 조회
   - 조회 결과 → EggSlot 컴포넌트에 전달
   - EggSlot: 남은 슬롯 개수 시각화

2. **슬롯 모달 열기**:
   - EggSlot 클릭 → HomePage의 `isModalOpen` 상태 변경
   - EggSlotModal 열림 → 슬롯 정보 표시

3. **슬롯 초기화**:
   - "초기화" 버튼 클릭 → ResetConfirmDialog 열림
   - "확인" 클릭 → resetSlots 호출
   - 성공 → 쿼리 무효화 → 슬롯 정보 자동 재조회
   - 모달 자동 닫힘

#### 4. Real-time State Sync

**슬롯 상태 동기화 전략**:

1. **이스터에그 생성 후**:
   ```typescript
   // useEasterEggSubmit.ts
   const createMutation = useMutation({
     mutationFn: createEasterEgg,
     onSuccess: () => {
       // 슬롯 정보 무효화
       queryClient.invalidateQueries({
         queryKey: SLOT_QUERY_KEYS.slotInfo(),
       });
     },
   });
   ```

2. **슬롯 초기화 후**:
   ```typescript
   // useSlotManagement.ts
   const resetMutation = useMutation({
     mutationFn: resetSlots,
     onSuccess: () => {
       queryClient.invalidateQueries({
         queryKey: SLOT_QUERY_KEYS.slotInfo(),
       });
     },
   });
   ```

3. **페이지 재진입 시**:
   - React Query가 자동으로 stale 상태 확인
   - 필요시 백그라운드에서 자동 재조회

### UI/UX Design Patterns

#### 1. EggSlot 컴포넌트 개선

**로딩 상태**:
- 슬롯 조회 중: 스켈레톤 표시 또는 반투명 처리
- 알 아이콘 영역에 로딩 인디케이터 추가

**에러 상태**:
- 조회 실패 시: 빈 알 3개 표시 (기본값)
- 툴팁으로 "슬롯 정보를 불러올 수 없습니다" 표시

#### 2. EggSlotModal 레이아웃

**모달 구조**:

```
┌─────────────────────────────────┐
│  이스터에그 슬롯 정보           │ (헤더)
├─────────────────────────────────┤
│  [알 아이콘 × 3]               │ (시각적 슬롯 표시)
│                                 │
│  전체 슬롯: 3개                │
│  사용 중: 1개                  │
│  남은 슬롯: 2개                │ (텍스트 정보)
│                                 │
│  ┌─────────────────────────┐  │
│  │ [🔄] 슬롯 초기화        │  │ (초기화 버튼)
│  └─────────────────────────┘  │
│                                 │
│  [닫기]                        │ (닫기 버튼)
└─────────────────────────────────┘
```

**초기화 버튼 스타일**:
- 위험 작업을 나타내는 색상 사용 (빨강 계열)
- 아이콘으로 초기화 의미 강조

#### 3. ResetConfirmDialog 레이아웃

**다이얼로그 구조**:

```
┌─────────────────────────────────┐
│  ⚠️ 슬롯 초기화 확인            │ (헤더)
├─────────────────────────────────┤
│                                 │
│  다음 작업이 수행됩니다:        │
│  • 모든 이스터에그가 삭제됩니다 │
│  • 관련 데이터가 함께 삭제됩니다│
│  • 슬롯이 3개로 초기화됩니다    │
│  • 이 작업은 되돌릴 수 없습니다 │
│                                 │
│  정말 초기화하시겠습니까?        │
│                                 │
│  [취소]  [확인]                 │ (버튼)
└─────────────────────────────────┘
```

**버튼 배치**:
- 취소 (왼쪽, 보조 버튼 스타일)
- 확인 (오른쪽, 위험 버튼 스타일)

### Error Handling Strategy

#### 1. API 에러 처리

**슬롯 조회 실패**:
- 401 (인증 실패): api-client가 자동 처리 → 로그인 페이지 리다이렉트
- 404 (사용자 없음): "사용자 정보를 찾을 수 없습니다" 메시지
- 500 (서버 오류): "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
- 네트워크 오류: "네트워크 연결을 확인해주세요."

**슬롯 초기화 실패**:
- 401 (인증 실패): api-client가 자동 처리
- 404 (사용자 없음): "사용자 정보를 찾을 수 없습니다"
- 500 (서버 오류): "초기화 중 오류가 발생했습니다."
- 네트워크 오류: "네트워크 연결을 확인해주세요."

#### 2. 에러 메시지 표시

**위치**:
- 슬롯 조회 에러: EggSlot 컴포넌트 툴팁
- 초기화 에러: ResetConfirmDialog 내부 에러 메시지

**재시도 옵션**:
- 조회 실패: egg-slot 클릭 → 모달에서 "다시 시도" 버튼
- 초기화 실패: 다이얼로그에서 "다시 시도" 버튼

---

## Phase 2: Implementation Breakdown

### File-Level Implementation Plan

#### Step 1: API 엔드포인트 및 타입 정의

**파일**: `src/commons/apis/endpoints.ts`

**작업**:
1. `TIMEEGG_ENDPOINTS`에 슬롯 관련 엔드포인트 추가
   - `GET_SLOTS`: `/api/capsules/slots`
   - `RESET_SLOTS`: `/api/capsules/slots/reset`

**예상 코드**:
```typescript
export const TIMEEGG_ENDPOINTS = {
  // ... 기존 엔드포인트
  
  // 슬롯 관리
  GET_SLOTS: `${BASE_PATHS.API}/capsules/slots`,
  RESET_SLOTS: `${BASE_PATHS.API}/capsules/slots/reset`,
} as const;
```

---

**파일**: `src/commons/apis/easter-egg/types.ts`

**작업**:
1. 슬롯 정보 응답 타입 추가
2. 슬롯 초기화 응답 타입 추가

**예상 코드**:
```typescript
/**
 * 슬롯 정보 응답
 */
export interface SlotInfoResponse {
  totalSlots: number;
  usedSlots: number;
  remainingSlots: number;
}

/**
 * 슬롯 초기화 응답
 */
export interface SlotResetResponse {
  egg_slots: number;
}
```

---

#### Step 2: API 함수 구현

**파일**: `src/commons/apis/easter-egg/index.ts`

**작업**:
1. `getSlotInfo` 함수 구현
2. `resetSlots` 함수 구현
3. JSDoc 주석 추가

**예상 코드**:
```typescript
/**
 * 슬롯 정보 조회 API
 * 
 * @returns 슬롯 정보 (전체/사용 중/남은 슬롯 개수)
 */
export async function getSlotInfo(): Promise<SlotInfoResponse> {
  const response = await apiClient.get<SlotInfoResponse>(
    TIMEEGG_ENDPOINTS.GET_SLOTS
  );
  return response.data;
}

/**
 * 슬롯 초기화 API
 * 모든 이스터에그를 삭제하고 슬롯을 기본값(3개)으로 초기화합니다.
 * 
 * @returns 초기화된 슬롯 개수
 */
export async function resetSlots(): Promise<SlotResetResponse> {
  const response = await apiClient.post<SlotResetResponse>(
    TIMEEGG_ENDPOINTS.RESET_SLOTS
  );
  return response.data;
}
```

---

#### Step 3: 슬롯 관리 훅 구현

**파일**: `src/components/home/hooks/useSlotManagement.ts`

**작업**:
1. 쿼리 키 정의
2. 슬롯 조회 쿼리 구현 (useQuery)
3. 슬롯 초기화 뮤테이션 구현 (useMutation)
4. 캐시 무효화 로직 구현
5. 에러 핸들링 구현

**예상 코드**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSlotInfo, resetSlots } from '@/commons/apis/easter-egg';
import type { SlotInfoResponse } from '@/commons/apis/easter-egg/types';

/**
 * 슬롯 쿼리 키
 */
export const SLOT_QUERY_KEYS = {
  slots: ['slots'] as const,
  slotInfo: () => [...SLOT_QUERY_KEYS.slots, 'info'] as const,
};

/**
 * 슬롯 관리 훅
 * 슬롯 조회 및 초기화 기능을 제공합니다.
 */
export function useSlotManagement() {
  const queryClient = useQueryClient();

  // 슬롯 조회
  const {
    data: slotInfo,
    isLoading,
    error,
    refetch,
  } = useQuery<SlotInfoResponse>({
    queryKey: SLOT_QUERY_KEYS.slotInfo(),
    queryFn: getSlotInfo,
    staleTime: 1000 * 60, // 1분간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
  });

  // 슬롯 초기화
  const resetMutation = useMutation({
    mutationFn: resetSlots,
    onSuccess: () => {
      // 슬롯 정보 쿼리 무효화 및 재조회
      queryClient.invalidateQueries({
        queryKey: SLOT_QUERY_KEYS.slotInfo(),
      });
    },
  });

  return {
    // 조회
    slotInfo,
    isLoading,
    error,
    refetch,
    
    // 초기화
    resetSlots: resetMutation.mutate,
    isResetting: resetMutation.isPending,
    resetError: resetMutation.error,
    resetSuccess: resetMutation.isSuccess,
  };
}
```

---

#### Step 4: EggSlot 컴포넌트 수정

**파일**: `src/components/home/components/egg-slot/types.ts`

**작업**:
1. `EggSlotProps`에 `isLoading` prop 추가

**예상 코드**:
```typescript
export interface EggSlotProps {
  count: number;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean; // 추가
}
```

---

**파일**: `src/components/home/components/egg-slot/index.tsx`

**작업**:
1. `isLoading` prop 처리
2. 로딩 중 시각적 피드백 추가

**예상 변경**:
- 로딩 중: 알 아이콘 반투명 처리
- 로딩 인디케이터 표시 (선택 사항)

---

#### Step 5: ResetConfirmDialog 컴포넌트 구현

**파일**: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/types.ts`

**작업**:
1. `ResetConfirmDialogProps` 타입 정의

**예상 코드**:
```typescript
export interface ResetConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
```

---

**파일**: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/index.tsx`

**작업**:
1. 다이얼로그 컴포넌트 구현
2. 경고 메시지 표시
3. 확인/취소 버튼 구현
4. 로딩 중 버튼 비활성화

**예상 구조**:
```typescript
export function ResetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ResetConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3>⚠️ 슬롯 초기화 확인</h3>
        <div className={styles.content}>
          <p>다음 작업이 수행됩니다:</p>
          <ul>
            <li>모든 이스터에그가 삭제됩니다</li>
            <li>관련 데이터가 함께 삭제됩니다</li>
            <li>슬롯이 3개로 초기화됩니다</li>
            <li>이 작업은 되돌릴 수 없습니다</li>
          </ul>
          <p className={styles.question}>정말 초기화하시겠습니까?</p>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={styles.confirmButton}
          >
            {isLoading ? '초기화 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

**파일**: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/styles.module.css`

**작업**:
1. 다이얼로그 레이아웃 스타일
2. 오버레이 스타일
3. 버튼 스타일 (확인 버튼은 위험 색상)

---

#### Step 6: EggSlotModal 컴포넌트 구현

**파일**: `src/components/home/components/egg-slot-modal/types.ts`

**작업**:
1. `EggSlotModalProps` 타입 정의
2. `SlotInfo` 타입 정의

**예상 코드**:
```typescript
export interface EggSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SlotInfo {
  totalSlots: number;
  usedSlots: number;
  remainingSlots: number;
}
```

---

**파일**: `src/components/home/components/egg-slot-modal/index.tsx`

**작업**:
1. 모달 컴포넌트 구현
2. `useSlotManagement` 훅 사용
3. 슬롯 정보 표시
4. 초기화 버튼 구현
5. ResetConfirmDialog 통합
6. 에러 처리 및 재시도 기능

**예상 구조**:
```typescript
export function EggSlotModal({ isOpen, onClose }: EggSlotModalProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const {
    slotInfo,
    isLoading,
    error,
    refetch,
    resetSlots,
    isResetting,
    resetError,
    resetSuccess,
  } = useSlotManagement();

  // 초기화 성공 시 모달 닫기
  useEffect(() => {
    if (resetSuccess) {
      onClose();
    }
  }, [resetSuccess, onClose]);

  if (!isOpen) return null;

  const handleResetClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmReset = () => {
    resetSlots();
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>이스터에그 슬롯 정보</h2>
        
        {/* 로딩 상태 */}
        {isLoading && <div>로딩 중...</div>}
        
        {/* 에러 상태 */}
        {error && (
          <div className={styles.error}>
            <p>슬롯 정보를 불러올 수 없습니다.</p>
            <button onClick={() => refetch()}>다시 시도</button>
          </div>
        )}
        
        {/* 슬롯 정보 */}
        {slotInfo && (
          <>
            <div className={styles.slotDisplay}>
              {/* EggSlot 컴포넌트 재사용 */}
              <EggSlot count={slotInfo.remainingSlots} />
            </div>
            
            <div className={styles.slotInfo}>
              <p>전체 슬롯: {slotInfo.totalSlots}개</p>
              <p>사용 중: {slotInfo.usedSlots}개</p>
              <p>남은 슬롯: {slotInfo.remainingSlots}개</p>
            </div>
            
            <button
              onClick={handleResetClick}
              className={styles.resetButton}
              disabled={isResetting}
            >
              🔄 슬롯 초기화
            </button>
            
            {resetError && (
              <p className={styles.error}>
                초기화 중 오류가 발생했습니다.
              </p>
            )}
          </>
        )}
        
        <button onClick={onClose} className={styles.closeButton}>
          닫기
        </button>
      </div>
      
      {/* 초기화 확인 다이얼로그 */}
      <ResetConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmReset}
        isLoading={isResetting}
      />
    </div>
  );
}
```

---

**파일**: `src/components/home/components/egg-slot-modal/styles.module.css`

**작업**:
1. 모달 레이아웃 스타일
2. 슬롯 정보 표시 스타일
3. 초기화 버튼 스타일 (위험 색상)

---

#### Step 7: 홈 페이지 통합

**파일**: `src/app/(main)/page.tsx`

**작업**:
1. `useSlotManagement` 훅 사용
2. EggSlot 컴포넌트에 슬롯 정보 전달
3. EggSlotModal 상태 관리
4. 모달 열기/닫기 로직 구현

**예상 변경**:
```typescript
export default function HomePage() {
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const { slotInfo, isLoading } = useSlotManagement();

  return (
    <>
      {/* 기존 컴포넌트들 */}
      
      {/* EggSlot 컴포넌트 */}
      <EggSlot
        count={slotInfo?.remainingSlots ?? 3}
        onClick={() => setIsSlotModalOpen(true)}
        isLoading={isLoading}
      />
      
      {/* EggSlotModal */}
      <EggSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
      />
    </>
  );
}
```

---

#### Step 8: 이스터에그 제출 훅 수정

**파일**: `src/components/home/hooks/useEasterEggSubmit.ts`

**작업**:
1. 이스터에그 생성 성공 후 슬롯 정보 무효화
2. `SLOT_QUERY_KEYS` import

**예상 변경**:
```typescript
import { SLOT_QUERY_KEYS } from './useSlotManagement';

export function useEasterEggSubmit() {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: createEasterEgg,
    onSuccess: () => {
      // 슬롯 정보 무효화 (추가)
      queryClient.invalidateQueries({
        queryKey: SLOT_QUERY_KEYS.slotInfo(),
      });
      
      // 기존 로직...
    },
  });
  
  // ...
}
```

---

### Testing Strategy

#### Unit Tests (Optional)

**테스트 대상**:
- API 함수: `getSlotInfo`, `resetSlots`
- 훅: `useSlotManagement`

**테스트 케이스**:
1. 슬롯 조회 성공
2. 슬롯 조회 실패 (401, 404, 500)
3. 슬롯 초기화 성공
4. 슬롯 초기화 실패
5. 캐시 무효화 동작

#### E2E Tests

**파일**: `tests/e2e/slot-management/slot-management.e2e.spec.ts`

**테스트 시나리오**:

1. **슬롯 조회 테스트**
   - 홈 페이지 접속
   - egg-slot 컴포넌트에 슬롯 개수 표시 확인
   - API 호출 확인

2. **슬롯 모달 열기 테스트**
   - egg-slot 클릭
   - 모달 열림 확인
   - 슬롯 정보 표시 확인

3. **슬롯 초기화 테스트**
   - 모달에서 "초기화" 버튼 클릭
   - 확인 다이얼로그 열림 확인
   - "확인" 버튼 클릭
   - 초기화 API 호출 확인
   - 슬롯 개수 3개로 복구 확인

4. **초기화 취소 테스트**
   - 모달에서 "초기화" 버튼 클릭
   - 확인 다이얼로그에서 "취소" 클릭
   - 다이얼로그 닫힘 확인
   - 슬롯 상태 변경 없음 확인

5. **에러 처리 테스트**
   - 네트워크 오류 시뮬레이션
   - 에러 메시지 표시 확인
   - 재시도 버튼 동작 확인

**예상 코드 구조**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('슬롯 관리 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 및 홈 페이지 이동
    await page.goto('/login');
    // ... 로그인 로직
    await page.goto('/');
  });

  test('슬롯 조회 및 표시', async ({ page }) => {
    // egg-slot 컴포넌트 확인
    const eggSlot = page.locator('[data-testid="egg-slot"]');
    await expect(eggSlot).toBeVisible();
    
    // API 호출 대기
    await page.waitForResponse(resp => 
      resp.url().includes('/api/capsules/slots') && resp.status() === 200
    );
    
    // 슬롯 개수 확인
    const filledEggs = page.locator('[data-testid="filled-egg"]');
    await expect(filledEggs).toHaveCount(3); // 초기값
  });

  test('슬롯 모달 열기 및 정보 확인', async ({ page }) => {
    await page.click('[data-testid="egg-slot"]');
    
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible();
    
    await expect(modal).toContainText('전체 슬롯: 3개');
  });

  test('슬롯 초기화 성공', async ({ page }) => {
    await page.click('[data-testid="egg-slot"]');
    await page.click('[data-testid="reset-button"]');
    
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible();
    
    await page.click('[data-testid="confirm-reset-button"]');
    
    // API 호출 대기
    await page.waitForResponse(resp => 
      resp.url().includes('/api/capsules/slots/reset') && resp.status() === 200
    );
    
    // 모달 닫힘 확인
    await expect(dialog).not.toBeVisible();
    
    // 슬롯 개수 3개로 복구 확인
    const filledEggs = page.locator('[data-testid="filled-egg"]');
    await expect(filledEggs).toHaveCount(3);
  });

  test('초기화 취소', async ({ page }) => {
    await page.click('[data-testid="egg-slot"]');
    await page.click('[data-testid="reset-button"]');
    
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible();
    
    await page.click('[data-testid="cancel-reset-button"]');
    
    await expect(dialog).not.toBeVisible();
  });
});
```

---

## Phase 3: Dependencies & Integration

### External Dependencies

**없음** - 기존 의존성으로 구현 가능:
- `@tanstack/react-query`: 서버 상태 관리
- `axios`: HTTP 클라이언트
- `react`: UI 컴포넌트

### Internal Dependencies

**의존하는 모듈**:
1. `src/commons/provider/api-provider/api-client.ts`: API 통신
2. `src/commons/apis/endpoints.ts`: 엔드포인트 관리
3. `src/components/home/components/egg-slot/`: 기존 egg-slot 컴포넌트

**영향받는 모듈**:
1. `src/components/home/hooks/useEasterEggSubmit.ts`: 슬롯 캐시 무효화 추가
2. `src/app/(main)/page.tsx`: 슬롯 정보 및 모달 통합

### Integration Points

#### 1. API Client Integration

- api-client의 인증 인터셉터 활용
- 토큰 자동 주입
- 401 에러 자동 처리

#### 2. React Query Integration

- 쿼리 캐시를 통한 전역 상태 관리
- 캐시 무효화를 통한 실시간 동기화
- 낙관적 업데이트 (선택 사항)

#### 3. Component Integration

- EggSlot 컴포넌트 재사용
- 홈 페이지에서 모달 상태 관리
- 이스터에그 제출 후 슬롯 자동 갱신

---

## Phase 4: Migration & Rollout

### Migration Strategy

**없음** - 신규 기능이므로 마이그레이션 불필요

### Deployment Plan

#### Stage 1: API 함수 및 훅 구현
- API 함수 구현 및 테스트
- 슬롯 관리 훅 구현 및 테스트

#### Stage 2: UI 컴포넌트 구현
- ResetConfirmDialog 구현
- EggSlotModal 구현
- EggSlot 컴포넌트 수정

#### Stage 3: 통합 및 테스트
- 홈 페이지 통합
- 이스터에그 제출 훅 수정
- E2E 테스트 작성 및 실행

#### Stage 4: 배포
- 빌드 테스트
- 프로덕션 배포

### Rollback Plan

**문제 발생 시**:
1. 슬롯 API 호출 실패: 기본값(3개) 표시
2. 초기화 API 실패: 에러 메시지 표시 및 재시도 옵션
3. 심각한 버그: 슬롯 모달 기능 비활성화 (egg-slot 클릭 무시)

---

## Phase 5: Performance & Optimization

### Performance Considerations

#### 1. API 호출 최적화

**캐시 전략**:
- `staleTime: 1분`: 1분간 캐시된 데이터 사용
- `cacheTime: 5분`: 5분간 캐시 유지

**재조회 전략**:
- 이스터에그 생성 후: 즉시 무효화 및 재조회
- 슬롯 초기화 후: 즉시 무효화 및 재조회
- 페이지 재진입 시: stale 상태면 백그라운드 재조회

#### 2. UI 렌더링 최적화

**메모이제이션**:
- EggSlot 컴포넌트: `React.memo` 적용 (선택 사항)
- 모달 컴포넌트: 열림 상태일 때만 렌더링

**로딩 최적화**:
- 스켈레톤 UI로 로딩 상태 표시
- 초기화 중 버튼 비활성화

### Scalability Considerations

**현재 규모**:
- 슬롯 개수: 3개 고정
- API 호출 빈도: 낮음 (페이지 로드 시, 이스터에그 생성 후)

**확장 가능성**:
- 슬롯 개수 동적 조정: API 응답의 `totalSlots` 활용
- 프리미엄 기능: 슬롯 개수 증가 상품
- 배치 작업: 다중 이스터에그 생성 시 슬롯 체크

---

## Phase 6: Security & Compliance

### Security Considerations

#### 1. 인증 및 권한

- 슬롯 조회: 인증된 사용자만 가능
- 슬롯 초기화: 인증된 사용자만 가능
- 다른 사용자의 슬롯 정보 접근 불가

**구현**:
- api-client가 자동으로 토큰 주입
- 서버에서 사용자 검증

#### 2. 데이터 보안

- 슬롯 정보는 민감하지 않은 데이터
- HTTPS 통신으로 전송
- 클라이언트 캐시에 임시 저장 (React Query)

#### 3. 초기화 보호

- 초기화 전 경고 메시지 표시
- 확인 다이얼로그로 실수 방지
- 초기화 중 중복 요청 방지 (버튼 비활성화)

### Compliance

**개인정보 처리**:
- 슬롯 정보는 개인정보에 해당하지 않음
- 서버에서 사용자별로 관리

---

## Phase 7: Monitoring & Maintenance

### Monitoring Plan

#### 1. API 호출 모니터링

**지표**:
- 슬롯 조회 API 호출 횟수
- 슬롯 조회 API 응답 시간
- 슬롯 초기화 API 호출 횟수
- API 에러율 (401, 404, 500)

**도구**:
- 브라우저 개발자 도구 (개발 중)
- 서버 로그 (프로덕션)

#### 2. 사용자 행동 모니터링

**지표**:
- egg-slot 클릭 횟수
- 슬롯 모달 열림 횟수
- 슬롯 초기화 시도 횟수
- 초기화 취소 횟수

### Maintenance Plan

#### 1. 정기 점검

- API 응답 시간 모니터링
- 에러율 모니터링
- 캐시 전략 효율성 검토

#### 2. 버그 대응

**일반적인 문제**:
- 슬롯 개수 불일치: 서버 데이터 확인 및 캐시 무효화
- 초기화 실패: 서버 로그 확인 및 재시도
- 네트워크 오류: 자동 재시도 및 사용자 안내

---

## Success Criteria

### Functional Requirements

- [ ] 슬롯 조회 API 연동 완료
- [ ] 슬롯 초기화 API 연동 완료
- [ ] egg-slot 컴포넌트에 슬롯 정보 표시
- [ ] egg-slot-modal 구현 완료
- [ ] 초기화 확인 다이얼로그 구현 완료
- [ ] 이스터에그 생성 후 슬롯 자동 갱신
- [ ] 슬롯 초기화 후 슬롯 자동 갱신

### Non-Functional Requirements

- [ ] 슬롯 조회 응답 시간 1초 이내
- [ ] 초기화 작업 완료 시간 3초 이내
- [ ] UI 업데이트 반영 2초 이내
- [ ] 에러 발생 시 적절한 메시지 표시
- [ ] 401 에러 시 로그인 페이지 리다이렉트
- [ ] 초기화 전 경고 메시지 표시

### User Experience

- [ ] 슬롯 상태가 시각적으로 명확하게 표시
- [ ] 로딩 중 상태 표시
- [ ] 에러 발생 시 재시도 옵션 제공
- [ ] 초기화 확인/취소 버튼 명확히 구분
- [ ] 모달 닫기 버튼 동작

---

## Risks & Mitigation

### Technical Risks

**Risk 1: API 응답 지연**
- **영향**: 사용자 경험 저하
- **완화**: 로딩 인디케이터 표시, 캐시 활용
- **대응**: 타임아웃 설정, 재시도 로직

**Risk 2: 슬롯 개수 불일치**
- **영향**: 사용자 혼란
- **완화**: 서버 데이터를 신뢰하여 표시
- **대응**: 음수 값은 0으로 처리

**Risk 3: 초기화 중 네트워크 끊김**
- **영향**: 초기화 상태 불명확
- **완화**: 에러 메시지 표시, 재시도 옵션
- **대응**: 서버에서 트랜잭션 처리

### Product Risks

**Risk 1: 실수로 초기화**
- **영향**: 사용자 데이터 손실
- **완화**: 확인 다이얼로그로 2단계 확인
- **대응**: 경고 메시지 강조

**Risk 2: 초기화 후 후회**
- **영향**: 사용자 불만
- **완화**: 경고 메시지에 "되돌릴 수 없음" 명시
- **대응**: 고객 지원 문의 안내

---

## Next Steps

### Immediate Actions

1. `/speckit.tasks` 명령어 실행하여 작업 목록 생성
2. API 엔드포인트 및 타입 정의 구현
3. API 함수 구현 및 테스트

### Short-term Goals

- 슬롯 관리 훅 구현
- UI 컴포넌트 구현
- 홈 페이지 통합

### Long-term Goals

- E2E 테스트 작성
- 성능 최적화
- 사용자 피드백 수집 및 개선

---

**계획 완료일**: 2026-01-27  
**예상 구현 기간**: 2-3일  
**다음 단계**: `/speckit.tasks` 실행
