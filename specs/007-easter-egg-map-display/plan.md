# 카카오 지도 이스터에그 표시 및 조회 기능 기술 계획서

**Branch**: `feat/easter-egg-map-display` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-easter-egg-map-display/spec.md`

## Summary

카카오 지도에 캡슐(이스터에그/타임캡슐) 마커를 표시하고, 사용자의 위치와 거리에 따라 자동으로 발견 모달을 표시하거나 마커 클릭을 통해 캡슐 정보를 조회하는 기능을 구현합니다.

**주요 목표**:
- 캡슐 목록 조회 API 함수 구현 (GET /api/capsules)
- 캡슐 기본 정보 조회 API 함수 구현 (GET /api/capsules/{id})
- 캡슐 발견 기록 API 함수 구현 (POST /api/capsules/{id}/viewers)
- 캡슐 발견자 목록 조회 API 함수 구현 (GET /api/capsules/{id}/viewers)
- 카카오 지도 마커 표시 로직 구현 (타입별 구분)
- 실시간 위치 추적 및 자동 발견 감지 로직 구현
- 거리 계산 및 조건 판단 로직 구현
- 조건별 모달 UI 구현 (내 캡슐, 발견 성공, 힌트)
- 발견 기록 저장 로직 구현

**기술적 접근**:
- React 19 + TypeScript 기반 훅 및 유틸리티 함수 구현
- 카카오 지도 API를 활용한 마커 표시 및 이벤트 처리
- React Query를 활용한 서버 상태 관리
- 기존 useKakaoMap, useGeolocation 훅 활용
- api-client.ts를 통한 API 통신
- 실시간 위치 추적을 위한 Geolocation API 활용

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, Axios, React Query, @tanstack/react-query, 카카오 지도 API  
**Storage**: N/A (서버 상태는 React Query 캐시로 관리)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- 캡슐 목록 조회 3초 이내
- 기본 정보 조회 2초 이내
- 거리 계산 100ms 이내
- 자동 발견 감지 지연 1초 이내

**Constraints**: 
- API 엔드포인트: GET /api/capsules, GET /api/capsules/{id}, POST /api/capsules/{id}/viewers, GET /api/capsules/{id}/viewers
- 마커 표시 범위: 현재 위치 기준 반경 300m
- 상세 모달 표시 기준: 현재 위치 기준 30m
- 캡슐 타입별 마커 아이콘 구분 (EASTER_EGG, TIME_CAPSULE)
- 최초 로드 시에만 목록 조회 (지도 이동 시 재조회 안 함)
- 실시간 위치 추적 및 자동 발견 감지

**Scale/Scope**: 
- API 함수 4개 + 타입 정의
- 카카오 지도 마커 관리 훅
- 실시간 위치 추적 훅
- 거리 계산 유틸리티
- 자동 발견 감지 로직
- 조건별 모달 UI 컴포넌트 3개
- 발견 기록 저장 로직

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, API 함수는 `src/commons/apis/`에 배치  
✅ **디렉토리 구조**: API 함수는 `src/commons/apis/capsule/`, 훅은 `src/components/home/hooks/`  
✅ **타입 안전성**: TypeScript로 모든 API 요청/응답 타입 정의  
✅ **API 통신**: api-client.ts를 통한 일관된 API 통신  
✅ **에러 핸들링**: 표준화된 에러 처리 및 사용자 피드백  
✅ **성능**: 실시간 위치 추적 최적화, 배터리 소모 최소화  
✅ **모바일 최적화**: 375px 고정 기준 UI 구현

---

## Project Structure

### Documentation (this feature)

```text
specs/007-easter-egg-map-display/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   └── capsule/                    # 캡슐 관련 API 함수 (신규)
│   │       ├── index.ts               # API 함수들
│   │       └── types.ts              # API 요청/응답 타입 정의
│   └── utils/
│       └── distance/                  # 거리 계산 유틸리티 (신규)
│           └── calculate-distance.ts  # 거리 계산 함수
├── components/
│   └── home/
│       ├── hooks/                      # 홈 페이지 관련 훅
│       │   ├── useGeolocation.ts     # 위치 정보 수집 훅 (기존)
│       │   ├── useKakaoMap.ts        # 카카오 지도 훅 (기존)
│       │   ├── useCapsuleMarkers.ts  # 캡슐 마커 관리 훅 (신규)
│       │   ├── useLocationTracking.ts # 실시간 위치 추적 훅 (신규)
│       │   └── useAutoDiscovery.ts   # 자동 발견 감지 훅 (신규)
│       └── components/
│           ├── map-view/              # 지도 뷰 컴포넌트 (수정)
│           │   └── index.tsx
│           ├── capsule-markers/       # 캡슐 마커 컴포넌트 (신규)
│           │   ├── index.tsx
│           │   └── types.ts
│           ├── my-capsule-modal/      # 내 캡슐 모달 (신규)
│           │   ├── index.tsx
│           │   └── types.ts
│           ├── discovery-modal/       # 발견 성공 모달 (신규)
│           │   ├── index.tsx
│           │   └── types.ts
│           └── hint-modal/            # 힌트 모달 (신규)
│               ├── index.tsx
│               └── types.ts
└── app/
    └── (main)/
        └── page.tsx                    # 홈 페이지 (수정)
```

---

## Data Model

### API Request Types

```typescript
/**
 * 캡슐 목록 조회 요청 파라미터
 */
export interface GetCapsulesRequest {
  /** 사용자 현재 위도 (필수) */
  lat: number;
  /** 사용자 현재 경도 (필수) */
  lng: number;
  /** 조회 반경(m) (선택, 기본 300) */
  radius_m?: number;
  /** 페이지 크기 (선택, 기본 50, 최대 200) */
  limit?: number;
  /** 다음 페이지 커서 (선택) */
  cursor?: string;
  /** view_limit 소진 캡슐도 포함 여부 (선택, 기본 false) */
  include_consumed?: boolean;
  /** 좌표 없는 캡슐도 포함 여부 (선택, 기본 false) */
  include_locationless?: boolean;
}

/**
 * 캡슐 기본 정보 조회 요청 파라미터
 */
export interface GetCapsuleRequest {
  /** 캡슐 ID (UUID) */
  id: string;
  /** 사용자 현재 위도 (필수) */
  lat: number;
  /** 사용자 현재 경도 (필수) */
  lng: number;
}

/**
 * 캡슐 발견 기록 요청 데이터
 */
export interface RecordCapsuleViewRequest {
  /** 발견 위치 위도 (선택, -90~90) */
  lat?: number;
  /** 발견 위치 경도 (선택, -180~180) */
  lng?: number;
}
```

### API Response Types

```typescript
/**
 * 캡슐 타입
 */
export type CapsuleType = 'EASTER_EGG' | 'TIME_CAPSULE';

/**
 * 캡슐 목록 항목
 */
export interface CapsuleItem {
  id: string;
  title?: string;
  content?: string;
  open_at?: string;
  is_locked: boolean;
  view_limit?: number;
  view_count?: number;
  can_open: boolean;
  latitude: number;
  longitude: number;
  distance_m?: number;
  type: CapsuleType;
  is_mine: boolean;
  media_types?: string[];
  media_urls?: string[];
  media_items?: any[];
  product?: any;
}

/**
 * 캡슐 목록 조회 응답
 */
export interface GetCapsulesResponse {
  items: CapsuleItem[];
  page_info: {
    cursor?: string;
    has_next?: boolean;
  } | null;
}

/**
 * 캡슐 기본 정보 응답
 */
export interface GetCapsuleResponse {
  id: string;
  title?: string;
  content?: string;
  open_at?: string;
  is_locked: boolean;
  view_limit?: number;
  view_count?: number;
  media_types?: string[];
  media_urls?: string[];
  media_items?: any[];
  author?: {
    id: string;
    nickname?: string;
    profile_img?: string;
  };
  viewers?: any[];
  created_at?: string;
  // 기타 서버 응답 필드
}

/**
 * 캡슐 발견 기록 응답
 */
export interface RecordCapsuleViewResponse {
  success: boolean;
  message: string;
  is_first_view: boolean;
}

/**
 * 발견자 정보
 */
export interface ViewerInfo {
  id: string;
  nickname?: string;
  profile_img?: string | null;
  viewed_at: string;
}

/**
 * 캡슐 발견자 목록 조회 응답
 */
export interface GetCapsuleViewersResponse {
  capsule_id: string;
  total_viewers: number;
  view_limit?: number;
  viewers: ViewerInfo[];
}
```

---

## API Design

### 1. 캡슐 목록 조회 API

**엔드포인트**: `GET /api/capsules`

**함수명**: `getCapsules(params: GetCapsulesRequest): Promise<GetCapsulesResponse>`

**구현 위치**: `src/commons/apis/capsule/index.ts`

**주요 로직**:
- lat, lng 필수 파라미터로 전달
- radius_m 기본값 300 설정
- limit 기본값 50 설정
- api-client를 통한 GET 요청
- 응답 데이터 타입 검증

### 2. 캡슐 기본 정보 조회 API

**엔드포인트**: `GET /api/capsules/{id}`

**함수명**: `getCapsule(id: string, lat: number, lng: number): Promise<GetCapsuleResponse>`

**구현 위치**: `src/commons/apis/capsule/index.ts`

**주요 로직**:
- Path 파라미터로 id 전달
- Query 파라미터로 lat, lng 전달
- api-client를 통한 GET 요청
- 응답 데이터 타입 검증

### 3. 캡슐 발견 기록 API

**엔드포인트**: `POST /api/capsules/{id}/viewers`

**함수명**: `recordCapsuleView(id: string, data?: RecordCapsuleViewRequest): Promise<RecordCapsuleViewResponse>`

**구현 위치**: `src/commons/apis/capsule/index.ts`

**주요 로직**:
- Path 파라미터로 id 전달
- Body에 lat, lng 선택적 전달
- api-client를 통한 POST 요청
- 백그라운드 처리 (에러 발생 시에도 사용자 경험에 영향 없음)
- 중복 요청 방지

### 4. 캡슐 발견자 목록 조회 API

**엔드포인트**: `GET /api/capsules/{id}/viewers`

**함수명**: `getCapsuleViewers(id: string): Promise<GetCapsuleViewersResponse>`

**구현 위치**: `src/commons/apis/capsule/index.ts`

**주요 로직**:
- Path 파라미터로 id 전달
- api-client를 통한 GET 요청
- 응답 데이터 타입 검증

---

## Component Design

### 1. 캡슐 마커 컴포넌트

**위치**: `src/components/home/components/capsule-markers/index.tsx`

**책임**:
- 카카오 지도에 캡슐 마커 표시
- 캡슐 타입별 마커 아이콘 구분
- 마커 클릭 이벤트 처리

**Props**:
```typescript
interface CapsuleMarkersProps {
  map: KakaoMap | null;
  capsules: CapsuleItem[];
  onMarkerClick: (capsule: CapsuleItem) => void;
}
```

**주요 로직**:
- 카카오 지도 CustomOverlay 또는 Marker API 활용
- 캡슐 타입에 따라 다른 마커 아이콘 표시
- 마커 클릭 시 onMarkerClick 콜백 호출
- 마커 생성/제거 관리

### 2. 내 캡슐 모달 컴포넌트

**위치**: `src/components/home/components/my-capsule-modal/index.tsx`

**책임**:
- 내가 숨긴 캡슐 정보 표시
- 발견자 목록 표시
- 발견자 수, 상태 정보 표시

**Props**:
```typescript
interface MyCapsuleModalProps {
  isOpen: boolean;
  capsule: GetCapsuleResponse;
  viewers: GetCapsuleViewersResponse | null;
  onClose: () => void;
}
```

**주요 로직**:
- 모달 열기/닫기 상태 관리
- 발견자 목록 조회 및 표시
- Figma 디자인 기반 UI 구현 (node-id=600-6931, node-id=600-7114)

### 3. 발견 성공 모달 컴포넌트

**위치**: `src/components/home/components/discovery-modal/index.tsx`

**책임**:
- 친구 캡슐 발견 성공 시 콘텐츠 표시
- 콘텐츠 타입별 UI 분기 (텍스트+이미지, 텍스트+이미지+음원+영상, 텍스트+음원)
- 발견 기록 저장

**Props**:
```typescript
interface DiscoveryModalProps {
  isOpen: boolean;
  capsule: GetCapsuleResponse;
  onClose: () => void;
  onDiscoveryRecorded?: () => void;
}
```

**주요 로직**:
- 모달 열기/닫기 상태 관리
- 콘텐츠 타입에 따른 UI 분기
- 발견 기록 자동 저장 (백그라운드)
- Figma 디자인 기반 UI 구현 (node-id=599-6755, node-id=599-6801, node-id=599-6868)

### 4. 힌트 모달 컴포넌트

**위치**: `src/components/home/components/hint-modal/index.tsx`

**책임**:
- 친구 캡슐 힌트 정보 표시
- 실제 콘텐츠는 표시하지 않음

**Props**:
```typescript
interface HintModalProps {
  isOpen: boolean;
  capsule: GetCapsuleResponse;
  onClose: () => void;
}
```

**주요 로직**:
- 모달 열기/닫기 상태 관리
- 위치 힌트 정보 표시
- Figma 디자인 기반 UI 구현 (node-id=291-1176, node-id=291-1301)

---

## Hook Design

### 1. useCapsuleMarkers

**위치**: `src/components/home/hooks/useCapsuleMarkers.ts`

**책임**:
- 캡슐 목록 조회 및 관리
- 카카오 지도 마커 생성/제거
- 마커 클릭 이벤트 처리

**반환값**:
```typescript
interface UseCapsuleMarkersReturn {
  capsules: CapsuleItem[];
  isLoading: boolean;
  error: Error | null;
  markers: Map<string, KakaoMarker>;
  handleMarkerClick: (capsule: CapsuleItem) => void;
}
```

**주요 로직**:
- React Query를 활용한 캡슐 목록 조회
- 카카오 지도 마커 생성 및 관리
- 마커 클릭 시 기본 정보 조회 트리거

### 2. useLocationTracking

**위치**: `src/components/home/hooks/useLocationTracking.ts`

**책임**:
- 실시간 위치 추적
- 위치 업데이트 시 콜백 호출
- 배터리 소모 최적화

**반환값**:
```typescript
interface UseLocationTrackingReturn {
  latitude: number | null;
  longitude: number | null;
  isTracking: boolean;
  error: GeolocationPositionError | null;
  startTracking: () => void;
  stopTracking: () => void;
}
```

**주요 로직**:
- Geolocation API watchPosition 활용
- 적절한 주기로 위치 업데이트 (배터리 최적화)
- 에러 처리 및 재시도 로직

### 3. useAutoDiscovery

**위치**: `src/components/home/hooks/useAutoDiscovery.ts`

**책임**:
- 실시간 위치 추적 기반 자동 발견 감지
- 30m 이내 진입 시 자동 모달 표시
- 여러 캡슐 동시 발견 시 우선순위 처리

**반환값**:
```typescript
interface UseAutoDiscoveryReturn {
  discoveredCapsule: CapsuleItem | null;
  isChecking: boolean;
  checkDiscovery: (capsules: CapsuleItem[], lat: number, lng: number) => void;
  clearDiscovery: () => void;
}
```

**주요 로직**:
- 거리 계산 유틸리티 활용
- 30m 이내 친구 캡슐 감지
- 가장 가까운 캡슐 우선 표시
- 중복 발견 방지

---

## Utility Functions

### 거리 계산 함수

**위치**: `src/commons/utils/distance/calculate-distance.ts`

**함수명**: `calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number`

**책임**:
- 두 좌표 간의 직선 거리 계산 (Haversine formula)
- 미터 단위로 반환

**구현**:
```typescript
/**
 * 두 좌표 간의 거리를 계산합니다 (Haversine formula)
 * @param lat1 첫 번째 좌표의 위도
 * @param lng1 첫 번째 좌표의 경도
 * @param lat2 두 번째 좌표의 위도
 * @param lng2 두 번째 좌표의 경도
 * @returns 거리 (미터)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

---

## State Management Strategy

### 서버 상태 (React Query)

**캡슐 목록 조회**:
- Query Key: `['capsules', lat, lng, radius_m]`
- 캐시 시간: 5분
- Stale Time: 1분
- 최초 로드 시에만 조회 (지도 이동 시 재조회 안 함)

**캡슐 기본 정보 조회**:
- Query Key: `['capsule', id, lat, lng]`
- 캐시 시간: 10분
- Stale Time: 5분

**발견자 목록 조회**:
- Query Key: `['capsule-viewers', id]`
- 캐시 시간: 5분
- Stale Time: 1분

**발견 기록 저장**:
- Mutation으로 처리
- Optimistic Update 적용
- 에러 발생 시에도 사용자 경험에 영향 없음 (백그라운드 처리)

### 클라이언트 상태 (React State)

**모달 상태**:
- 내 캡슐 모달 열림/닫힘
- 발견 성공 모달 열림/닫힘
- 힌트 모달 열림/닫힘

**선택된 캡슐**:
- 현재 조회 중인 캡슐 정보
- 마커 클릭 또는 자동 발견으로 설정

**자동 발견 상태**:
- 현재 발견된 캡슐
- 발견 감지 중 여부

---

## Implementation Phases

### Phase 1: API 함수 및 타입 정의

**목표**: API 통신 레이어 구축

**작업**:
1. `src/commons/apis/capsule/types.ts` 생성 및 타입 정의
2. `src/commons/apis/capsule/index.ts` 생성 및 API 함수 구현
   - `getCapsules` 함수
   - `getCapsule` 함수
   - `recordCapsuleView` 함수
   - `getCapsuleViewers` 함수
3. API 엔드포인트 상수 정의 (`src/commons/apis/endpoints.ts` 수정)

**검증**:
- API 함수 타입 안전성 확인
- 에러 핸들링 검증

### Phase 2: 거리 계산 유틸리티 구현

**목표**: 거리 계산 로직 구현

**작업**:
1. `src/commons/utils/distance/calculate-distance.ts` 생성
2. Haversine formula 구현
3. 단위 테스트 작성 (선택사항)

**검증**:
- 거리 계산 정확도 검증 (30m, 300m 기준)

### Phase 3: 캡슐 마커 표시 로직 구현

**목표**: 카카오 지도에 캡슐 마커 표시

**작업**:
1. `src/components/home/hooks/useCapsuleMarkers.ts` 생성
2. React Query를 활용한 캡슐 목록 조회
3. 카카오 지도 마커 생성 로직 구현
4. 캡슐 타입별 마커 아이콘 구분
5. 마커 클릭 이벤트 처리
6. `src/components/home/components/capsule-markers/index.tsx` 생성
7. `src/components/home/components/map-view/index.tsx` 수정 (마커 컴포넌트 통합)

**검증**:
- 마커가 정확한 위치에 표시되는지 확인
- 캡슐 타입별 마커 구분 확인
- 마커 클릭 이벤트 동작 확인

### Phase 4: 실시간 위치 추적 구현

**목표**: 사용자 위치 실시간 추적

**작업**:
1. `src/components/home/hooks/useLocationTracking.ts` 생성
2. Geolocation API watchPosition 활용
3. 위치 업데이트 주기 최적화 (배터리 고려)
4. 에러 처리 및 재시도 로직

**검증**:
- 위치 추적 정확도 확인
- 배터리 소모 최적화 확인

### Phase 5: 자동 발견 감지 로직 구현

**목표**: 30m 이내 진입 시 자동 발견 모달 표시

**작업**:
1. `src/components/home/hooks/useAutoDiscovery.ts` 생성
2. 거리 계산 유틸리티 활용
3. 30m 이내 친구 캡슐 감지 로직
4. 여러 캡슐 동시 발견 시 우선순위 처리
5. `src/components/home/index.tsx` 수정 (자동 발견 로직 통합)

**검증**:
- 30m 이내 진입 시 자동 모달 표시 확인
- 여러 캡슐 동시 발견 시 우선순위 확인

### Phase 6: 마커 클릭 이벤트 처리 및 정보 조회

**목표**: 마커 클릭 시 캡슐 정보 조회 및 모달 표시

**작업**:
1. `src/components/home/index.tsx` 수정
2. 마커 클릭 시 기본 정보 조회 로직
3. 소유자 및 거리 조건 판단 로직
4. 조건별 모달 표시 로직

**검증**:
- 마커 클릭 시 정보 조회 확인
- 조건별 모달 표시 확인

### Phase 7: 조건별 모달 UI 구현

**목표**: 내 캡슐, 발견 성공, 힌트 모달 UI 구현

**작업**:
1. `src/components/home/components/my-capsule-modal/index.tsx` 생성
   - Figma 디자인 기반 UI 구현 (node-id=600-6931, node-id=600-7114)
   - 발견자 목록 표시
2. `src/components/home/components/discovery-modal/index.tsx` 생성
   - Figma 디자인 기반 UI 구현 (node-id=599-6755, node-id=599-6801, node-id=599-6868)
   - 콘텐츠 타입별 UI 분기
3. `src/components/home/components/hint-modal/index.tsx` 생성
   - Figma 디자인 기반 UI 구현 (node-id=291-1176, node-id=291-1301)
4. 각 모달 컴포넌트 타입 정의

**검증**:
- Figma 디자인과 일치하는지 확인
- 콘텐츠 타입별 UI 분기 확인

### Phase 8: 발견 기록 저장 로직 구현

**목표**: 발견 기록 자동 저장

**작업**:
1. 발견 성공 모달 진입 시점에 발견 기록 저장
2. React Query Mutation 활용
3. 백그라운드 처리 (에러 발생 시에도 사용자 경험에 영향 없음)
4. 중복 요청 방지

**검증**:
- 발견 기록 저장 확인
- 중복 저장 방지 확인
- 에러 처리 확인

### Phase 9: 오류 처리 및 최적화

**목표**: 에러 처리 및 성능 최적화

**작업**:
1. 모든 API 호출 에러 처리
2. 위치 추적 실패 시 처리
3. 거리 계산 실패 시 처리
4. 성능 최적화 (마커 렌더링, 위치 추적 주기)
5. 배터리 소모 최적화

**검증**:
- 모든 에러 케이스 처리 확인
- 성능 목표 달성 확인

---

## Testing Strategy

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 지도 진입 시 캡슐 마커 표시
2. 마커 클릭 시 정보 조회 및 모달 표시
3. 지도 이동 중 자동 발견 모달 표시
4. 내 캡슐 모달 표시 및 발견자 목록 조회
5. 발견 성공 모달 표시 및 발견 기록 저장
6. 힌트 모달 표시

**테스트 파일**: `tests/e2e/capsule-map-display/capsule-map-display.e2e.spec.ts`

### UI 테스트 (Playwright)

**테스트 시나리오**:
1. 캡슐 마커 렌더링 테스트
2. 모달 컴포넌트 렌더링 테스트
3. 마커 클릭 이벤트 테스트
4. 모달 열기/닫기 테스트
5. 콘텐츠 타입별 UI 분기 테스트

**테스트 파일**: `tests/ui/capsule-map-display/capsule-map-display.ui.spec.ts`

---

## Development Workflow

**핵심 개발 순서**:
```
API 연결 → E2E 테스트 → UI 구현 → 사용자 승인 → 데이터 바인딩 → UI 테스트
```

### Step 1: API 연결
- `src/commons/apis/capsule/`에 타입과 API 함수 통합 작성
- 요청/응답 인터페이스 정의
- 에러 핸들링 및 인터셉터 구현

### Step 2: E2E 테스트 작성 (Playwright)
- 주요 사용자 시나리오 테스트 작성
- API 통합 테스트
- 데이터 플로우 검증

### Step 3: UI 구현 (375px 고정 기준)
- Mock 데이터 기반 UI 구현
- Figma 디자인 기반 컴포넌트 구현
- 모바일 터치 및 상호작용 구현

### Step 4: 사용자 승인 단계
- 스테이징 환경 배포
- 사용자 테스트 및 피드백 수집
- UI/UX 개선사항 반영

### Step 5: 데이터 바인딩
- React Query 훅을 만들어 UI와 바인딩
- Mock 데이터를 실제 API 호출로 교체
- 로딩/에러 상태 처리

### Step 6: UI 테스트 (Playwright)
- 기능별 UI 테스트 파일 작성
- 375px 모바일 프레임 기준 테스트
- 성능 및 접근성 검증

---

## Risk & Mitigation

### 위험 요소

1. **카카오 지도 API 성능 이슈**
   - **위험**: 많은 마커 표시 시 성능 저하
   - **완화**: 마커 클러스터링 고려, 최적화된 렌더링

2. **실시간 위치 추적 배터리 소모**
   - **위험**: 과도한 위치 추적으로 인한 배터리 소모
   - **완화**: 적절한 주기 설정, 지도 이동 시에만 추적

3. **자동 발견 모달 중복 표시**
   - **위험**: 여러 캡슐 동시 발견 시 모달 중복 표시
   - **완화**: 우선순위 처리 및 큐 관리

4. **거리 계산 정확도**
   - **위험**: GPS 오차로 인한 거리 계산 부정확
   - **완화**: Haversine formula 사용, 오차 범위 고려

### 완화 전략

- 단계별 구현 및 테스트
- 성능 모니터링 및 최적화
- 사용자 피드백 수집 및 개선

---

## Success Criteria

### 기능 완성도
- ✅ 캡슐 마커 표시 성공률 95% 이상
- ✅ 마커 클릭 시 정보 조회 성공률 95% 이상
- ✅ 자동 발견 감지 정확도 95% 이상
- ✅ 거리 계산 정확도 100% (30m 기준 오차 ±5m 이내)
- ✅ 발견 기록 저장 성공률 90% 이상

### 사용자 경험
- ✅ 지도 진입 시 자동 발견 모달 표시까지 3초 이내
- ✅ 지도 이동 중 자동 발견 감지 지연 1초 이내
- ✅ 마커 클릭 후 모달 표시까지 2초 이내
- ✅ 캡슐 목록 조회 완료 시간 3초 이내
- ✅ 기본 정보 조회 완료 시간 2초 이내

### 기술적 품질
- ✅ 타입 안전성 100%
- ✅ 에러 처리 완성도 100%
- ✅ 코드 커버리지 80% 이상 (테스트)

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-27  
**다음 단계**: `/speckit.tasks` 명령어로 작업 목록 생성
