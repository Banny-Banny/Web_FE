# 타임캡슐 방장 최종 제출 기술 구현 계획

**Branch**: `feat/time-capsule-final` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: 타임캡슐 방장 최종 제출 기능 명세서 (`specs/010-timecapsule-host-submit/spec.md`)

## Summary

방장이 모든 참여자의 콘텐츠 작성이 완료되면 타임캡슐을 최종 제출하여 땅에 묻을 수 있도록 하는 기능을 구현합니다. 24시간 자동 제출 타이머를 실시간으로 표시하고, GPS 위치 정보를 수집하여 제출하며, 자동 제출된 경우에도 적절한 안내를 제공합니다.

**주요 목표**:
- 방장 권한 확인 및 제출 버튼 표시 제어
- 모든 참여자의 콘텐츠 제출 완료 여부 확인
- GPS 위치 정보 수집 및 검증
- 24시간 자동 제출 타이머 실시간 표시
- 수동 제출 플로우 (확인 모달, API 호출, 완료 안내)
- 자동 제출 후 방 재접속 시 안내
- 제출 관련 에러 상황 처리

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Query를 활용한 서버 상태 관리
- Web Geolocation API를 통한 GPS 위치 수집
- CSS Module + Tailwind CSS를 활용한 스타일링
- 375px 모바일 고정 레이아웃 기준

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
- GPS 위치 정보 수집 시간 5초 이하
- 제출 API 호출 응답 시간 3초 이하
- 타이머 업데이트 지연 없음 (1초 단위 정확도)

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 모든 API 요청에 인증 토큰 포함 (`Authorization: Bearer {token}`)
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- 방장 권한은 백엔드에서 최종 검증
- GPS 위치 정보는 필수 (위도: -90~90, 경도: -180~180)
- 24시간 자동 제출 규칙 엄격 준수

**Scale/Scope**: 
- 대기실 페이지 내 제출 기능 추가
- 24시간 타이머 컴포넌트
- 제출 확인 모달
- 제출 완료 모달
- 자동 제출 안내 모달
- GPS 위치 수집 유틸리티

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 기존 `WaitingRoom/` 컴포넌트 확장, 제출 관련 컴포넌트 추가  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: 기존 디자인 토큰 활용 (`src/commons/styles`)  
✅ **상태 관리**: React Query (서버 상태) + React State (클라이언트 상태)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부  
✅ **성능**: GPS 수집 최적화, API 호출 최적화, 타이머 성능 최적화

---

## Project Structure

### Documentation (this feature)

```text
specs/010-timecapsule-host-submit/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── waiting-room/
│           └── [capsuleId]/
│               └── page.tsx              # 대기실 페이지 (기존, 수정 없음)
├── components/
│   └── WaitingRoom/                      # 대기실 페이지 컴포넌트 (기존 확장)
│       ├── index.tsx                     # 메인 컨테이너 (제출 버튼 추가)
│       ├── types.ts                      # 타입 정의 (제출 관련 타입 추가)
│       ├── styles.module.css             # 스타일 (제출 버튼 스타일 추가)
│       ├── hooks/
│       │   ├── useWaitingRoom.ts         # 대기실 정보 조회 (기존)
│       │   ├── useSubmitTimer.ts         # 24시간 타이머 훅 (신규)
│       │   ├── useGeolocation.ts         # GPS 위치 수집 훅 (신규)
│       │   └── useCapsuleSubmit.ts       # 타임캡슐 제출 훅 (신규)
│       └── components/
│           ├── SubmitTimer/              # 24시간 타이머 컴포넌트 (신규)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── SubmitButton/             # 제출 버튼 컴포넌트 (신규)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── SubmitConfirmModal/       # 제출 확인 모달 (신규)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── SubmitCompleteModal/      # 제출 완료 모달 (신규)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           └── AutoSubmitModal/          # 자동 제출 안내 모달 (신규)
│               ├── index.tsx
│               ├── types.ts
│               └── styles.module.css
└── commons/
    ├── apis/
    │   ├── endpoints.ts                  # 엔드포인트 (제출 API 추가)
    │   └── capsules/
    │       └── step-rooms/
    │           ├── index.ts              # API 함수 (제출 API 추가)
    │           ├── types.ts              # 타입 정의 (제출 타입 추가)
    │           └── hooks/
    │               └── useCapsuleSubmit.ts  # 제출 React Query 훅 (신규)
    └── utils/
        ├── geolocation.ts                # GPS 위치 유틸리티 (신규)
        ├── timer.ts                      # 타이머 계산 유틸리티 (신규)
        └── date.ts                       # 날짜 포맷팅 유틸리티 (기존 확장)
```

---

## 데이터 모델링

### API 타입 (신규 추가)

```typescript
// src/commons/apis/capsules/step-rooms/types.ts (기존 파일에 추가)

/**
 * 타임캡슐 제출 요청
 */
export interface CapsuleSubmitRequest {
  /** 위도 (-90 ~ 90) */
  latitude: number;
  /** 경도 (-180 ~ 180) */
  longitude: number;
}

/**
 * 타임캡슐 제출 응답
 */
export interface CapsuleSubmitResponse {
  success: boolean;
  data: {
    /** 타임캡슐 ID */
    capsule_id: string;
    /** 제출 완료 상태 */
    status: 'BURIED';
    /** 위치 정보 */
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    /** 제출 시각 (ISO 8601) */
    buried_at: string;
    /** 개봉 예정일 (ISO 8601) */
    open_date: string;
    /** 총 참여자 수 */
    participants: number;
    /** 자동 제출 여부 */
    is_auto_submitted: boolean;
  };
}

/**
 * 타임캡슐 제출 에러 응답
 */
export interface CapsuleSubmitError {
  success: false;
  error: {
    code: 
      | 'INCOMPLETE_PARTICIPANTS'
      | 'INVALID_LOCATION'
      | 'PAYMENT_NOT_COMPLETED'
      | 'UNAUTHORIZED'
      | 'NOT_HOST'
      | 'ROOM_NOT_FOUND'
      | 'ALREADY_SUBMITTED'
      | 'INTERNAL_SERVER_ERROR';
    message: string;
    details?: {
      is_auto_submitted?: boolean;
      [key: string]: any;
    };
  };
}

/**
 * 대기실 정보 (기존 타입 확장)
 */
export interface WaitingRoomDetailResponse {
  // ... 기존 필드 ...
  /** 방 생성 시각 (ISO 8601) */
  created_at: string;
  /** 자동 제출 마감 시각 (ISO 8601, created_at + 24시간) */
  deadline_at: string;
  /** 방 상태 */
  status: 'ACTIVE' | 'BURIED';
  /** 자동 제출 여부 (BURIED 상태일 때만) */
  is_auto_submitted?: boolean;
}
```

### 컴포넌트 타입 (신규 추가)

```typescript
// src/components/WaitingRoom/types.ts (기존 파일에 추가)

/**
 * 24시간 타이머 상태
 */
export interface TimerState {
  /** 남은 시간 (시) */
  hours: number;
  /** 남은 시간 (분) */
  minutes: number;
  /** 남은 시간 (초) */
  seconds: number;
  /** 타이머 만료 여부 */
  expired: boolean;
  /** 긴급 상태 (1시간 미만) */
  isUrgent: boolean;
  /** 위급 상태 (10분 미만) */
  isCritical: boolean;
}

/**
 * GPS 위치 정보
 */
export interface GeolocationData {
  latitude: number;
  longitude: number;
}

/**
 * 제출 버튼 Props
 */
export interface SubmitButtonProps {
  /** 버튼 활성화 여부 */
  disabled: boolean;
  /** 비활성화 사유 */
  disabledReason?: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 제출 확인 모달 Props
 */
export interface SubmitConfirmModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 확인 핸들러 */
  onConfirm: () => void;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 남은 시간 (시간 단위) */
  remainingHours: number;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 제출 완료 모달 Props
 */
export interface SubmitCompleteModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 타임캡슐 ID */
  capsuleId: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 자동 제출 여부 */
  isAutoSubmitted: boolean;
}

/**
 * 자동 제출 안내 모달 Props
 */
export interface AutoSubmitModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 시각 (ISO 8601) */
  buriedAt: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 보관함으로 이동 핸들러 */
  onNavigateToVault: () => void;
}
```

---

## API 설계

### 엔드포인트 추가

```typescript
// src/commons/apis/endpoints.ts (기존 파일에 추가)

export const CAPSULE_ENDPOINTS = {
  // ... 기존 엔드포인트 ...
  
  /**
   * 타임캡슐 제출 (방장 전용)
   * POST /api/capsules/step-rooms/:roomId/submit
   */
  SUBMIT_CAPSULE: (roomId: string) =>
    `${BASE_PATHS.API}/capsules/step-rooms/${roomId}/submit`,
} as const;
```

### API 함수 구현

```typescript
// src/commons/apis/capsules/step-rooms/index.ts (기존 파일에 추가)

import type {
  CapsuleSubmitRequest,
  CapsuleSubmitResponse,
} from './types';

/**
 * 타임캡슐 제출 API
 * 
 * 방장이 모든 참여자의 콘텐츠 작성 완료 후 타임캡슐을 최종 제출합니다.
 * JWT Bearer 토큰이 자동으로 포함됩니다.
 * 
 * @param {string} roomId - 대기실 ID
 * @param {CapsuleSubmitRequest} data - 제출 요청 데이터 (GPS 위치)
 * @returns {Promise<CapsuleSubmitResponse>} 제출 응답
 * 
 * @throws {CapsuleSubmitError} 제출 실패 시 에러
 * 
 * @example
 * ```typescript
 * const result = await submitCapsule('room-123', {
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 * });
 * ```
 */
export async function submitCapsule(
  roomId: string,
  data: CapsuleSubmitRequest
): Promise<CapsuleSubmitResponse> {
  const response = await apiClient.post<CapsuleSubmitResponse>(
    CAPSULE_ENDPOINTS.SUBMIT_CAPSULE(roomId),
    data
  );
  return response.data;
}
```

### React Query 훅

```typescript
// src/commons/apis/capsules/step-rooms/hooks/useCapsuleSubmit.ts (신규)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitCapsule } from '../index';
import type { CapsuleSubmitRequest } from '../types';

/**
 * 타임캡슐 제출 Mutation 훅
 * 
 * @param {string} roomId - 대기실 ID
 * @returns React Query mutation 객체
 * 
 * @example
 * ```typescript
 * const { mutate, isPending, error } = useCapsuleSubmit('room-123');
 * 
 * mutate(
 *   { latitude: 37.5665, longitude: 126.9780 },
 *   {
 *     onSuccess: (data) => {
 *       console.log('제출 완료:', data);
 *     },
 *     onError: (error) => {
 *       console.error('제출 실패:', error);
 *     },
 *   }
 * );
 * ```
 */
export function useCapsuleSubmit(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CapsuleSubmitRequest) => submitCapsule(roomId, data),
    onSuccess: () => {
      // 대기실 정보 캐시 무효화 (상태가 BURIED로 변경됨)
      queryClient.invalidateQueries({
        queryKey: ['waiting-room', roomId],
      });
    },
  });
}
```

---

## 컴포넌트 설계

### 1. SubmitTimer 컴포넌트 (24시간 타이머)

**책임**: 방 생성 시각으로부터 24시간 카운트다운을 실시간으로 표시

**Props**:
```typescript
interface SubmitTimerProps {
  /** 방 생성 시각 (ISO 8601) */
  createdAt: string;
  /** 타이머 만료 시 콜백 (선택) */
  onExpired?: () => void;
}
```

**상태**:
- `timerState: TimerState` - 타이머 상태 (hours, minutes, seconds, expired, isUrgent, isCritical)

**동작**:
1. `useSubmitTimer` 훅을 사용하여 1초마다 남은 시간 계산
2. 남은 시간에 따라 색상 및 아이콘 변경
   - 1시간 이상: 기본 색상 (회색)
   - 1시간 미만: 주황색 + ⚠️ 아이콘
   - 10분 미만: 빨간색 + 🚨 아이콘 + 깜빡임 효과
3. 24시간 경과 시 "자동 제출됨" 표시

**스타일**:
- 화면 상단에 고정 표시
- 모바일 375px 기준 중앙 정렬
- 깜빡임 애니메이션 (10분 미만 시)

---

### 2. SubmitButton 컴포넌트 (제출 버튼)

**책임**: 제출 조건 충족 여부에 따라 버튼 활성화/비활성화 제어

**Props**:
```typescript
interface SubmitButtonProps {
  disabled: boolean;
  disabledReason?: string;
  onClick: () => void;
  isLoading?: boolean;
}
```

**상태**:
- 없음 (상태는 부모 컴포넌트에서 관리)

**동작**:
1. `disabled` prop에 따라 버튼 활성화/비활성화
2. 비활성화 시 `disabledReason` 표시
3. 로딩 중에는 스피너 표시 및 버튼 비활성화
4. 클릭 시 `onClick` 핸들러 호출

**스타일**:
- 화면 하단에 고정 표시
- 모바일 375px 기준 전체 너비
- 최소 터치 영역 44px × 44px

---

### 3. SubmitConfirmModal 컴포넌트 (제출 확인 모달)

**책임**: 제출 전 최종 확인 모달 표시

**Props**:
```typescript
interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  openDate: string;
  remainingHours: number;
  isLoading?: boolean;
}
```

**상태**:
- 없음 (상태는 부모 컴포넌트에서 관리)

**동작**:
1. 개봉 예정일을 "YYYY년 MM월 DD일에 개봉됩니다" 형식으로 표시
2. 남은 시간을 "자동 제출까지 X시간 남았습니다" 형식으로 표시
3. "묻기" 버튼 클릭 시 `onConfirm` 호출
4. "취소" 버튼 클릭 시 `onClose` 호출
5. 로딩 중에는 버튼 비활성화 및 스피너 표시

**스타일**:
- 중앙 모달 (반투명 배경)
- 모바일 375px 기준 적절한 너비

---

### 4. SubmitCompleteModal 컴포넌트 (제출 완료 모달)

**책임**: 제출 완료 후 성공 안내 모달 표시

**Props**:
```typescript
interface SubmitCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsuleId: string;
  openDate: string;
  isAutoSubmitted: boolean;
}
```

**상태**:
- 없음 (상태는 부모 컴포넌트에서 관리)

**동작**:
1. 수동 제출 시: "타임캡슐이 묻혔어요!" 제목 표시
2. 자동 제출 시: "타임캡슐이 자동으로 묻혔어요" 제목 표시
3. D-Day 계산 및 표시 ("D-XXX일 후 개봉됩니다")
4. 자동 제출 시 추가 안내: "24시간이 경과하여 자동으로 제출되었습니다"
5. "확인" 버튼 클릭 시 홈 화면 또는 보관함으로 이동

**스타일**:
- 중앙 모달 (반투명 배경)
- 성공 아이콘 (체크 마크 등)

---

### 5. AutoSubmitModal 컴포넌트 (자동 제출 안내 모달)

**책임**: 자동 제출된 타임캡슐 재접속 시 안내 모달 표시

**Props**:
```typescript
interface AutoSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  buriedAt: string;
  openDate: string;
  onNavigateToVault: () => void;
}
```

**상태**:
- 없음 (상태는 부모 컴포넌트에서 관리)

**동작**:
1. "이미 제출된 타임캡슐입니다" 제목 표시
2. "24시간이 경과하여 자동으로 제출되었습니다" 안내 표시
3. 제출 시각을 "YYYY년 MM월 DD일 HH:mm에 제출되었습니다" 형식으로 표시
4. 개봉 예정일을 "YYYY년 MM월 DD일에 개봉됩니다" 형식으로 표시
5. "보관함으로 이동" 버튼 클릭 시 `onNavigateToVault` 호출
6. "홈으로" 버튼 클릭 시 `onClose` 호출 후 홈 화면으로 이동

**스타일**:
- 중앙 모달 (반투명 배경)
- 정보 아이콘

---

## 커스텀 훅 설계

### 1. useSubmitTimer (24시간 타이머 훅)

**책임**: 방 생성 시각으로부터 24시간 카운트다운 계산

**입력**:
- `createdAt: string` - 방 생성 시각 (ISO 8601)

**출력**:
- `timerState: TimerState` - 타이머 상태

**로직**:
```typescript
export function useSubmitTimer(createdAt: string): TimerState {
  const [timerState, setTimerState] = useState<TimerState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    isUrgent: false,
    isCritical: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const created = new Date(createdAt);
      const deadline = new Date(created.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const remaining = deadline.getTime() - now.getTime();

      if (remaining <= 0) {
        setTimerState({
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
          isUrgent: false,
          isCritical: false,
        });
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimerState({
        hours,
        minutes,
        seconds,
        expired: false,
        isUrgent: hours === 0 && minutes < 60,
        isCritical: hours === 0 && minutes < 10,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return timerState;
}
```

---

### 2. useGeolocation (GPS 위치 수집 훅)

**책임**: Web Geolocation API를 통한 GPS 위치 정보 수집

**입력**: 없음

**출력**:
- `location: GeolocationData | null` - GPS 위치 정보
- `error: string | null` - 에러 메시지
- `isLoading: boolean` - 로딩 상태
- `getCurrentLocation: () => Promise<GeolocationData>` - 위치 수집 함수

**로직**:
```typescript
export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('GPS를 지원하지 않는 브라우저입니다');
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const data: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(data);
      setIsLoading(false);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.code === 1
          ? '위치 권한을 허용해주세요'
          : '위치 정보를 가져올 수 없습니다';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return { location, error, isLoading, getCurrentLocation };
}
```

---

### 3. useCapsuleSubmit (타임캡슐 제출 훅)

**책임**: 타임캡슐 제출 플로우 관리 (GPS 수집 + API 호출)

**입력**:
- `roomId: string` - 대기실 ID

**출력**:
- `submitCapsule: () => Promise<void>` - 제출 함수
- `isSubmitting: boolean` - 제출 중 상태
- `error: string | null` - 에러 메시지
- `submitResult: CapsuleSubmitResponse | null` - 제출 결과

**로직**:
```typescript
export function useCapsuleSubmit(roomId: string) {
  const { getCurrentLocation } = useGeolocation();
  const mutation = useCapsuleSubmit(roomId);
  const [error, setError] = useState<string | null>(null);

  const submitCapsule = useCallback(async () => {
    setError(null);

    try {
      // 1. GPS 위치 수집
      const location = await getCurrentLocation();

      // 2. API 호출
      await mutation.mutateAsync(location);
    } catch (err: any) {
      const errorCode = err.response?.data?.error?.code;
      const isAutoSubmitted = err.response?.data?.error?.details?.is_auto_submitted;

      setError(getErrorMessage(errorCode, isAutoSubmitted));
      throw err;
    }
  }, [getCurrentLocation, mutation]);

  return {
    submitCapsule,
    isSubmitting: mutation.isPending,
    error,
    submitResult: mutation.data,
  };
}

function getErrorMessage(code: string, isAutoSubmitted?: boolean): string {
  switch (code) {
    case 'INCOMPLETE_PARTICIPANTS':
      return '아직 제출하지 않은 참여자가 있습니다';
    case 'NOT_HOST':
      return '방장만 제출할 수 있습니다';
    case 'ALREADY_SUBMITTED':
      return isAutoSubmitted
        ? '24시간이 경과하여 자동으로 제출되었습니다'
        : '이미 제출된 타임캡슐입니다';
    case 'INVALID_LOCATION':
      return '위치 정보를 가져올 수 없습니다';
    case 'PAYMENT_NOT_COMPLETED':
      return '결제가 완료되지 않았습니다';
    default:
      return '오류가 발생했습니다. 다시 시도해주세요';
  }
}
```

---

## 유틸리티 함수

### 1. geolocation.ts (GPS 위치 유틸리티)

```typescript
// src/commons/utils/geolocation.ts (신규)

/**
 * GPS 위치 정보 검증
 */
export function validateGeolocation(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * GPS 위치 정보 포맷팅
 */
export function formatGeolocation(
  latitude: number,
  longitude: number
): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
```

---

### 2. timer.ts (타이머 계산 유틸리티)

```typescript
// src/commons/utils/timer.ts (신규)

/**
 * 24시간 마감 시각 계산
 */
export function calculateDeadline(createdAt: string): Date {
  const created = new Date(createdAt);
  return new Date(created.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * 남은 시간 계산
 */
export function calculateRemainingTime(createdAt: string): {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const deadline = calculateDeadline(createdAt);
  const now = new Date();
  const remaining = deadline.getTime() - now.getTime();

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
}

/**
 * 타이머 텍스트 포맷팅
 */
export function formatTimerText(
  hours: number,
  minutes: number,
  seconds: number
): string {
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }
  return `${minutes}분 ${seconds}초 남음`;
}
```

---

### 3. date.ts (날짜 포맷팅 유틸리티, 기존 확장)

```typescript
// src/commons/utils/date.ts (기존 파일에 추가)

/**
 * D-Day 계산
 */
export function calculateDDay(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷팅
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜와 시간을 "YYYY년 MM월 DD일 HH:mm" 형식으로 포맷팅
 */
export function formatDateTimeKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}
```

---

## 상태 관리 전략

### 서버 상태 (React Query)

1. **대기실 정보 조회**
   - Query Key: `['waiting-room', roomId]`
   - 캐시 시간: 5분
   - Stale 시간: 1분
   - 자동 리페치: 포커스 시, 재연결 시

2. **타임캡슐 제출**
   - Mutation Key: `['submit-capsule', roomId]`
   - 성공 시: 대기실 정보 캐시 무효화
   - 에러 처리: 사용자 친화적 메시지 변환

### 클라이언트 상태 (React State)

1. **모달 상태**
   - `isSubmitConfirmOpen: boolean` - 제출 확인 모달
   - `isSubmitCompleteOpen: boolean` - 제출 완료 모달
   - `isAutoSubmitModalOpen: boolean` - 자동 제출 안내 모달

2. **타이머 상태**
   - `timerState: TimerState` - 24시간 타이머 상태

3. **GPS 상태**
   - `location: GeolocationData | null` - GPS 위치 정보
   - `locationError: string | null` - GPS 에러 메시지

---

## 에러 처리 전략

### 1. GPS 위치 수집 에러

- **권한 거부 (code: 1)**: "위치 권한을 허용해주세요" + 권한 설정 안내
- **위치 사용 불가 (code: 2)**: "GPS 신호를 받을 수 있는 곳으로 이동해주세요"
- **타임아웃 (code: 3)**: "위치 정보를 가져오는 데 시간이 오래 걸립니다. 다시 시도해주세요"
- **기타**: "위치 정보를 가져올 수 없습니다"

### 2. API 에러

- **INCOMPLETE_PARTICIPANTS**: "아직 제출하지 않은 참여자가 있습니다"
- **NOT_HOST**: "방장만 제출할 수 있습니다"
- **ALREADY_SUBMITTED**: 
  - 수동 제출: "이미 제출된 타임캡슐입니다"
  - 자동 제출: "24시간이 경과하여 자동으로 제출되었습니다"
- **INVALID_LOCATION**: "위치 정보를 가져올 수 없습니다"
- **PAYMENT_NOT_COMPLETED**: "결제가 완료되지 않았습니다"
- **네트워크 오류**: "네트워크 오류가 발생했습니다. 다시 시도해주세요"
- **기타**: "오류가 발생했습니다. 다시 시도해주세요"

### 3. 재시도 전략

- GPS 수집: 수동 재시도 (버튼 클릭)
- API 호출: 최대 3회 자동 재시도 (네트워크 오류 시)

---

## 성능 최적화

### 1. 타이머 최적화

- `setInterval` 대신 `requestAnimationFrame` 고려 (더 정확한 타이밍)
- 타이머 업데이트로 인한 불필요한 리렌더링 방지 (React.memo)
- 컴포넌트 언마운트 시 타이머 정리

### 2. GPS 수집 최적화

- `enableHighAccuracy: true` - 정확도 우선
- `timeout: 10000` - 10초 타임아웃
- `maximumAge: 0` - 캐시 사용 안 함 (최신 위치 정보)

### 3. API 호출 최적화

- React Query 캐시 활용
- 중복 요청 방지 (로딩 중 버튼 비활성화)
- 낙관적 업데이트 (필요 시)

---

## 테스트 전략

### E2E 테스트 (Playwright)

```typescript
// tests/e2e/capsule-submit.spec.ts (신규)

test.describe('타임캡슐 제출', () => {
  test('방장이 모든 조건 충족 시 제출 성공', async ({ page }) => {
    // 1. 대기실 페이지 접속
    // 2. 모든 참여자 콘텐츠 제출 완료 확인
    // 3. 제출 버튼 활성화 확인
    // 4. 제출 버튼 클릭
    // 5. 확인 모달 표시 확인
    // 6. "묻기" 버튼 클릭
    // 7. GPS 위치 수집 모킹
    // 8. 제출 완료 모달 표시 확인
    // 9. D-Day 정보 확인
  });

  test('참여자 미완료 시 제출 버튼 비활성화', async ({ page }) => {
    // 1. 대기실 페이지 접속
    // 2. 일부 참여자 미완료 상태 확인
    // 3. 제출 버튼 비활성화 확인
    // 4. 비활성화 사유 표시 확인
  });

  test('24시간 타이머 정상 작동', async ({ page }) => {
    // 1. 대기실 페이지 접속
    // 2. 타이머 표시 확인
    // 3. 1초 후 타이머 업데이트 확인
    // 4. 남은 시간 포맷 확인
  });

  test('자동 제출 후 재접속 시 안내 모달 표시', async ({ page }) => {
    // 1. 자동 제출된 대기실 접속
    // 2. 안내 모달 표시 확인
    // 3. 자동 제출 안내 메시지 확인
    // 4. 제출 시각 및 개봉 예정일 확인
  });

  test('GPS 권한 거부 시 에러 처리', async ({ page, context }) => {
    // 1. GPS 권한 거부 설정
    // 2. 제출 버튼 클릭
    // 3. 에러 메시지 표시 확인
    // 4. 권한 설정 안내 확인
  });
});
```

### UI 테스트 (Playwright)

```typescript
// tests/ui/capsule-submit.spec.ts (신규)

test.describe('타임캡슐 제출 UI', () => {
  test('제출 버튼 렌더링', async ({ page }) => {
    // 버튼 표시, 스타일, 위치 확인
  });

  test('24시간 타이머 렌더링', async ({ page }) => {
    // 타이머 표시, 색상, 아이콘 확인
  });

  test('제출 확인 모달 렌더링', async ({ page }) => {
    // 모달 표시, 내용, 버튼 확인
  });

  test('제출 완료 모달 렌더링', async ({ page }) => {
    // 모달 표시, 내용, D-Day 확인
  });

  test('자동 제출 안내 모달 렌더링', async ({ page }) => {
    // 모달 표시, 내용, 버튼 확인
  });
});
```

---

## 구현 단계

### Phase 0: API 연결 (1일)

1. **엔드포인트 추가**
   - `CAPSULE_ENDPOINTS.SUBMIT_CAPSULE` 추가
   
2. **타입 정의**
   - `CapsuleSubmitRequest`, `CapsuleSubmitResponse`, `CapsuleSubmitError` 타입 정의
   - `WaitingRoomDetailResponse` 타입 확장 (created_at, deadline_at, status, is_auto_submitted)
   
3. **API 함수 구현**
   - `submitCapsule` 함수 구현
   
4. **React Query 훅 구현**
   - `useCapsuleSubmit` 훅 구현

### Phase 1: E2E 테스트 작성 (1일)

1. **테스트 시나리오 작성**
   - 정상 제출 플로우
   - 참여자 미완료 시 제출 불가
   - 24시간 타이머 작동
   - 자동 제출 후 재접속
   - GPS 에러 처리
   
2. **테스트 실행 및 검증**
   - API 모킹 설정
   - GPS 모킹 설정
   - 테스트 통과 확인

### Phase 2: UI 구현 (3일)

1. **유틸리티 함수 구현** (0.5일)
   - `geolocation.ts` (GPS 위치 유틸리티)
   - `timer.ts` (타이머 계산 유틸리티)
   - `date.ts` (날짜 포맷팅 유틸리티 확장)
   
2. **커스텀 훅 구현** (1일)
   - `useSubmitTimer` (24시간 타이머 훅)
   - `useGeolocation` (GPS 위치 수집 훅)
   - `useCapsuleSubmit` (타임캡슐 제출 훅)
   
3. **컴포넌트 구현** (1.5일)
   - `SubmitTimer` (24시간 타이머)
   - `SubmitButton` (제출 버튼)
   - `SubmitConfirmModal` (제출 확인 모달)
   - `SubmitCompleteModal` (제출 완료 모달)
   - `AutoSubmitModal` (자동 제출 안내 모달)
   
4. **WaitingRoom 컴포넌트 통합** (0.5일)
   - 제출 버튼 추가
   - 타이머 추가
   - 모달 통합
   - 제출 플로우 연결

### Phase 3: 사용자 승인 (1일)

1. **스테이징 배포**
   - 375px 모바일 프레임 확인
   
2. **사용자 테스트**
   - UI/UX 피드백 수집
   - 버그 수정
   
3. **최종 승인**

### Phase 4: 데이터 바인딩 (1일)

1. **실제 API 연결**
   - Mock 데이터 제거
   - 실제 API 호출로 교체
   
2. **로딩/에러 상태 처리**
   - 로딩 인디케이터 추가
   - 에러 메시지 표시
   
3. **통합 테스트**
   - 전체 플로우 검증

### Phase 5: UI 테스트 (1일)

1. **UI 테스트 작성**
   - 컴포넌트 렌더링 테스트
   - 상호작용 테스트
   - 시각적 검증
   
2. **성능 테스트**
   - 타이머 정확도 검증
   - GPS 수집 시간 측정
   - API 응답 시간 측정
   
3. **최종 검증**
   - 모든 테스트 통과 확인
   - 프로덕션 배포 준비

---

## 배포 체크리스트

- [ ] 모든 E2E 테스트 통과
- [ ] 모든 UI 테스트 통과
- [ ] GPS 위치 수집 정상 작동 (실제 기기 테스트)
- [ ] 24시간 타이머 정확도 검증
- [ ] 제출 API 호출 성공률 95% 이상
- [ ] 에러 처리 검증 (모든 에러 케이스)
- [ ] 성능 목표 달성 (GPS 5초, API 3초)
- [ ] 375px 모바일 레이아웃 검증
- [ ] 접근성 검증 (터치 영역 44px 이상)
- [ ] 사용자 승인 완료

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
