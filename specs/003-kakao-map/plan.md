# TimeEgg 웹 카카오 지도 통합 기술 계획서

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 홈 페이지에 카카오 지도를 통합하기 위한 기술적 결정사항과 구현 계획을 정의합니다.

---

## 🏗 기술 스택 결정

### Core Framework
- **Next.js 16+** (App Router)
  - **선택 이유**: 서버/클라이언트 컴포넌트 분리, 동적 스크립트 로딩 지원
  - **App Router 활용**: 홈 페이지(`app/(main)/page.tsx`)에 지도 컴포넌트 통합
  - **Server Component 우선**: 기본은 서버 컴포넌트, 지도는 클라이언트 컴포넌트

### Language & Type System
- **TypeScript 5+**
  - **선택 이유**: 타입 안전성, 카카오 지도 API 타입 정의
  - **엄격한 설정**: strict mode 유지
  - **절대 경로**: `@/commons`, `@/components` 등 별칭 사용

### Map Integration
- **카카오 지도 JavaScript API**
  - **선택 이유**: 명세서 요구사항, 웹 표준 지도 API
  - **로딩 방식**: 동적 스크립트 로딩 (`next/script`)
  - **타입 정의**: 카카오 지도 API 타입 정의 파일 생성

### Styling & Design System
- **CSS Modules (필수)**
  - **선택 이유**: 컴포넌트별 스타일 격리, 타입 안전성
  - **파일 형식**: `styles.module.css` 필수 사용
  - **모바일 전용 설계**: 375px 고정값 기준, 반응형 미지원
  - **CSS 변수 기반**: 기존 디자인 토큰 시스템 활용
- **Tailwind CSS 4+ (선택사항)**
  - **사용 범위**: CSS Module로 구현하기 어려운 유틸리티 클래스가 필요한 경우에만 선택적 사용
  - **우선순위**: CSS Module을 우선 사용하고, 필요시에만 Tailwind 보조 사용

### State Management
- **React Context API** (클라이언트 상태)
  - **선택 이유**: 지도 인스턴스 관리, 지도 상태 공유
  - **사용 범위**: 지도 초기화 상태, 지도 관리 기능 상태

### Environment Variables
- **NEXT_PUBLIC_KAKAO_MAP_API_KEY**: 카카오 지도 JavaScript API 키
- **NEXT_PUBLIC_KAKAO_REST_API_KEY**: 카카오 REST API 키 (주소 조회용)
  - **주의사항**: Next.js에서는 클라이언트 접근을 위해 `NEXT_PUBLIC_` 접두사 필수
  - **처리 방법**: `.env.local` 파일에 환경 변수 설정

---

## 🏛 아키텍처 설계

### Feature Slice Architecture 적용

지도 기능은 홈 페이지에 통합되므로 `components/home/` 레이어에 배치합니다.

```
src/
├── app/                          # [Routing Layer]
│   └── (main)/
│       └── page.tsx             # 홈 페이지 (지도 통합)
├── components/                   # [Feature Layer]
│   └── home/                    # 홈 화면 피처
│       ├── index.tsx            # Home Feature Container
│       ├── types.ts              # 타입 정의
│       ├── hooks/                # 비즈니스 로직
│       │   ├── useKakaoMap.ts   # 카카오 지도 훅
│       │   ├── useMapControl.ts # 지도 관리 훅
│       │   ├── useAddress.ts    # 주소 조회 훅
│       │   └── useCurrentLocation.ts # 현재 위치 훅
│       └── components/          # UI 컴포넌트
│           ├── map-view/         # 지도 뷰 컴포넌트
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── map-controls/     # 지도 관리 컨트롤
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── fab-button/        # FAB 버튼 (우측 하단)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           ├── egg-slot/          # 알 슬롯 (우측 상단)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           └── location-display/  # 현재 위치 및 주소 표시
│               ├── index.tsx
│               ├── types.ts
│               └── styles.module.css
└── commons/                      # [Shared Layer]
    ├── apis/                     # API 함수
    │   └── kakao-map/            # 카카오 지도 API
    │       └── address.ts        # 주소 조회 API
    ├── utils/                    # 유틸리티 함수
    │   └── kakao-map/            # 카카오 지도 유틸리티
    │       ├── script-loader.ts  # 스크립트 로더
    │       └── types.ts          # 카카오 지도 타입 정의
    └── hooks/                    # 공통 훅 (필요시)
```

### 컴포넌트 구조 설계

#### 1. Home Feature Container (`components/home/index.tsx`)
- **역할**: 홈 페이지의 메인 컨테이너
- **구조**: 
  - 지도 뷰 컴포넌트 포함
  - 지도 관리 컨트롤 포함
  - FAB 버튼 포함
  - 알 슬롯 포함
  - 현재 위치 및 주소 표시 포함
  - 카카오 지도 스크립트 로딩 관리

#### 2. Map View Component (`components/home/components/map-view/`)
- **역할**: 카카오 지도 렌더링 및 기본 조작
- **특징**:
  - 카카오 지도 API를 사용한 지도 렌더링
  - 드래그, 확대/축소 기본 조작 지원
  - 지도 인스턴스 관리
  - CSS Module로 스타일링 (375px 기준)

#### 3. Map Controls Component (`components/home/components/map-controls/`)
- **역할**: 지도 관리 기능 (초기화 등)
- **특징**:
  - 지도 초기화 버튼
  - 지도 설정 조정 기능
  - CSS Module로 스타일링
  - 터치 타겟 크기 44px × 44px 이상

#### 4. Kakao Map Hook (`components/home/hooks/useKakaoMap.ts`)
- **역할**: 카카오 지도 인스턴스 생성 및 관리
- **기능**:
  - 카카오 지도 API 초기화
  - 지도 인스턴스 생성
  - 지도 상태 관리 (위치, 확대/축소 레벨)
  - 에러 처리

#### 5. Map Control Hook (`components/home/hooks/useMapControl.ts`)
- **역할**: 지도 관리 기능 로직
- **기능**:
  - 지도 초기화
  - 지도 설정 변경
  - 지도 상태 제어

#### 6. Script Loader Utility (`commons/utils/kakao-map/script-loader.ts`)
- **역할**: 카카오 지도 스크립트 동적 로딩
- **기능**:
  - 스크립트 중복 로딩 방지
  - 로딩 상태 관리
  - 에러 처리

#### 7. FAB Button Component (`components/home/components/fab-button/`)
- **역할**: 우측 하단에 배치된 FAB 버튼
- **기능**:
  - "+" 아이콘에서 "x" 아이콘으로 전환
  - 클릭 시 투명 검정 배경 표시
  - 이스터에그/타임캡슐 선택 옵션 표시
  - CSS Module로 스타일링
  - 터치 타겟 크기 44px × 44px 이상

#### 8. Egg Slot Component (`components/home/components/egg-slot/`)
- **역할**: 우측 상단에 배치된 알 슬롯
- **기능**:
  - 알 개수 표시
  - 클릭 시 알림 모달 표시
  - CSS Module로 스타일링
  - 터치 타겟 크기 44px × 44px 이상

#### 9. Location Display Component (`components/home/components/location-display/`)
- **역할**: 지도 중앙에 현재 위치 및 주소 표시
- **기능**:
  - 현재 위치 마커 표시
  - 지도 중앙점 기준 주소 표시 (`region_2depth_name` 형식)
  - 지도 이동 시 주소 자동 업데이트
  - CSS Module로 스타일링

#### 10. Address API (`commons/apis/kakao-map/address.ts`)
- **역할**: 카카오 REST API를 통한 주소 조회
- **기능**:
  - 좌표를 주소로 변환 (coord2regioncode)
  - `region_2depth_name` 추출 및 반환
  - 에러 처리

#### 11. useAddress Hook (`components/home/hooks/useAddress.ts`)
- **역할**: 주소 조회 로직 관리
- **기능**:
  - 지도 중앙점 좌표 기반 주소 조회
  - 디바운싱을 통한 API 호출 최적화
  - 로딩 상태 및 에러 상태 관리

#### 12. useCurrentLocation Hook (`components/home/hooks/useCurrentLocation.ts`)
- **역할**: 현재 위치 표시 로직 관리
- **기능**:
  - 지도 중앙점 추적
  - 주소 조회 훅과 연동
  - 위치 업데이트 관리

---

## 📁 상세 컴포넌트 설계

### 1. Home Feature Container

**위치**: `src/components/home/index.tsx`

**역할**:
- 홈 페이지의 메인 컨테이너
- 지도 뷰 및 관리 컨트롤 통합
- 카카오 지도 스크립트 로딩 관리

**Props**:
```typescript
interface HomeFeatureProps {
  // 필요시 props 추가
}
```

**구조**:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useKakaoMap } from './hooks/useKakaoMap';
import MapView from './components/map-view';
import MapControls from './components/map-controls';
import { loadKakaoMapScript } from '@/commons/utils/kakao-map/script-loader';

export default function HomeFeature() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { mapInstance, initializeMap } = useKakaoMap();

  useEffect(() => {
    loadKakaoMapScript()
      .then(() => setScriptLoaded(true))
      .catch((error) => console.error('카카오 지도 스크립트 로딩 실패:', error));
  }, []);

  useEffect(() => {
    if (scriptLoaded && !mapInstance) {
      initializeMap();
    }
  }, [scriptLoaded, mapInstance, initializeMap]);

  return (
    <div>
      {scriptLoaded ? (
        <>
          <MapView mapInstance={mapInstance} />
          <MapControls mapInstance={mapInstance} />
        </>
      ) : (
        <div>지도 로딩 중...</div>
      )}
    </div>
  );
}
```

### 2. Map View Component

**위치**: `src/components/home/components/map-view/`

**역할**:
- 카카오 지도 렌더링
- 지도 기본 조작 (드래그, 확대/축소)
- 지도 상태 표시

**Props**:
```typescript
interface MapViewProps {
  mapInstance: kakao.maps.Map | null;
}
```

**스타일 규칙** (CSS Module 사용):
- 너비: 375px (모바일 프레임 너비와 동일)
- 높이: 적절한 높이 설정 (예: 400px)
- 고정 단위 사용 (px)
- `styles.module.css` 파일에 모든 스타일 정의

**구현 내용**:
- `useEffect`를 사용하여 지도 인스턴스가 생성되면 지도 렌더링
- 카카오 지도 API의 기본 조작 기능 활용
- 로딩 상태 및 에러 상태 처리

### 3. Map Controls Component

**위치**: `src/components/home/components/map-controls/`

**역할**:
- 지도 관리 기능 제공
- 지도 초기화 버튼
- 지도 설정 조정

**Props**:
```typescript
interface MapControlsProps {
  mapInstance: kakao.maps.Map | null;
  onReset?: () => void;
}
```

**스타일 규칙** (CSS Module 사용):
- 터치 타겟: 최소 44px × 44px
- 위치: 지도 위 또는 하단에 배치
- `styles.module.css` 파일에 모든 스타일 정의

**구현 내용**:
- 지도 초기화 버튼
- 지도 설정 조정 기능 (향후 확장)
- CSS Module로 스타일링

### 4. useKakaoMap Hook

**위치**: `src/components/home/hooks/useKakaoMap.ts`

**역할**:
- 카카오 지도 인스턴스 생성 및 관리
- 지도 상태 관리
- 지도 초기화 로직

**반환값**:
```typescript
interface UseKakaoMapReturn {
  mapInstance: kakao.maps.Map | null;
  initializeMap: (container?: HTMLElement) => void;
  resetMap: () => void;
  isLoading: boolean;
  error: Error | null;
}
```

**로직**:
- 환경 변수에서 API 키 가져오기
- 카카오 지도 API 초기화
- 지도 인스턴스 생성 (기본 위치, 확대/축소 레벨)
- 지도 상태 관리

### 5. useMapControl Hook

**위치**: `src/components/home/hooks/useMapControl.ts`

**역할**:
- 지도 관리 기능 로직
- 지도 초기화
- 지도 설정 변경

**반환값**:
```typescript
interface UseMapControlReturn {
  resetMap: () => void;
  canReset: boolean;
}
```

**로직**:
- 지도 초기 상태로 복원
- 지도 설정 변경 기능

### 6. Script Loader Utility

**위치**: `src/commons/utils/kakao-map/script-loader.ts`

**역할**:
- 카카오 지도 스크립트 동적 로딩
- 중복 로딩 방지
- 로딩 상태 관리

**함수**:
```typescript
export function loadKakaoMapScript(): Promise<void>;
```

**로직**:
- 스크립트가 이미 로드되었는지 확인
- 동적으로 스크립트 태그 생성 및 추가
- Promise를 사용한 비동기 로딩
- 에러 처리

### 7. FAB Button Component

**위치**: `src/components/home/components/fab-button/`

**역할**:
- 우측 하단에 배치된 FAB 버튼
- 이스터에그/타임캡슐 생성 선택 기능

**Props**:
```typescript
interface FabButtonProps {
  onEasterEggClick?: () => void;
  onTimeCapsuleClick?: () => void;
}
```

**상태 관리**:
- `isOpen`: 선택 옵션 표시 여부
- 아이콘 전환: "+" ↔ "x"

**스타일 규칙** (CSS Module 사용):
- 위치: 우측 하단 고정 (position: fixed 또는 absolute)
- 터치 타겟: 최소 44px × 44px
- 아이콘 애니메이션: 부드러운 회전/변환
- 배경 오버레이: 투명 검정 배경 (rgba(0, 0, 0, 0.5) 등)
- `styles.module.css` 파일에 모든 스타일 정의

**구현 내용**:
- FAB 버튼 클릭 시 상태 토글
- 아이콘 전환 애니메이션
- 선택 옵션 표시/숨김
- 오버레이 클릭 시 닫기

### 8. Egg Slot Component

**위치**: `src/components/home/components/egg-slot/`

**역할**:
- 우측 상단에 배치된 알 슬롯
- 알 개수 표시 및 모달 열기

**Props**:
```typescript
interface EggSlotProps {
  count: number;
  onClick?: () => void;
}
```

**스타일 규칙** (CSS Module 사용):
- 위치: 우측 상단 고정 (position: fixed 또는 absolute)
- 터치 타겟: 최소 44px × 44px
- 알 개수 배지 표시
- `styles.module.css` 파일에 모든 스타일 정의

**구현 내용**:
- 알 개수 표시
- 클릭 시 모달 열기 (모달은 별도 컴포넌트 또는 공용 모달 사용)
- 알 개수가 0인 경우 처리

### 9. Location Display Component

**위치**: `src/components/home/components/location-display/`

**역할**:
- 지도 중앙에 현재 위치 표시
- 지도 중앙점 기준 주소 표시

**Props**:
```typescript
interface LocationDisplayProps {
  map: kakao.maps.Map | null;
  address?: string;
  isLoading?: boolean;
}
```

**스타일 규칙** (CSS Module 사용):
- 위치: 지도 중앙 또는 상단에 배치
- 현재 위치 마커 표시
- 주소 텍스트 표시
- `styles.module.css` 파일에 모든 스타일 정의

**구현 내용**:
- 현재 위치 마커 렌더링
- 주소 정보 표시 (`region_2depth_name` 형식)
- 로딩 상태 표시
- 에러 상태 처리

### 10. Address API

**위치**: `src/commons/apis/kakao-map/address.ts`

**역할**:
- 카카오 REST API를 통한 주소 조회

**함수**:
```typescript
export interface Coord2RegionCodeParams {
  x: number; // longitude
  y: number; // latitude
}

export interface Coord2RegionCodeResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    region_type: string;
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    code: string;
    x: number;
    y: number;
  }>;
}

export async function getAddressFromCoord(
  params: Coord2RegionCodeParams
): Promise<string | null>;
```

**로직**:
- 카카오 REST API 호출 (`GET https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`)
- `NEXT_PUBLIC_KAKAO_REST_API_KEY` 사용
- 응답에서 `region_2depth_name` 추출
- 첫 번째 결과의 `region_2depth_name` 반환
- 에러 처리

### 11. useAddress Hook

**위치**: `src/components/home/hooks/useAddress.ts`

**역할**:
- 주소 조회 로직 관리
- 디바운싱을 통한 API 호출 최적화

**반환값**:
```typescript
interface UseAddressReturn {
  address: string | null;
  isLoading: boolean;
  error: Error | null;
  fetchAddress: (lat: number, lng: number) => void;
}
```

**로직**:
- 지도 중앙점 좌표를 받아 주소 조회
- 디바운싱 적용 (지도 이동 완료 후 500ms 대기)
- 로딩 상태 및 에러 상태 관리
- 이전 주소 캐싱 (선택사항)

### 12. useCurrentLocation Hook

**위치**: `src/components/home/hooks/useCurrentLocation.ts`

**역할**:
- 현재 위치 표시 로직 관리
- 지도 중앙점 추적

**반환값**:
```typescript
interface UseCurrentLocationReturn {
  center: { lat: number; lng: number } | null;
  updateCenter: (lat: number, lng: number) => void;
}
```

**로직**:
- 지도 중앙점 좌표 추적
- 지도 이동 이벤트 리스너 등록
- 주소 조회 훅과 연동

---

## 🎨 스타일링 전략

### CSS Module 우선 원칙

#### 1. 필수 사용 규칙
- **CSS Module 필수**: 모든 컴포넌트는 `styles.module.css` 파일을 필수로 사용
- **파일 구조**: 각 컴포넌트 폴더에 `index.tsx`와 `styles.module.css` 쌍으로 구성
- **타입 안전성**: TypeScript에서 CSS Module 클래스명 자동 완성 및 타입 체크
- **스타일 격리**: 컴포넌트별 스타일이 자동으로 격리되어 충돌 방지

#### 2. Tailwind CSS 선택적 사용
- **보조 도구**: CSS Module로 구현하기 어려운 경우에만 선택적 사용
- **우선순위**: CSS Module을 우선 사용하고, 필요시에만 Tailwind 보조 사용
- **혼용 가능**: CSS Module과 Tailwind를 함께 사용 가능 (className에 둘 다 적용 가능)

### 모바일 전용 설계 원칙

#### 1. 고정 단위 사용
- **px 단위 우선**: 반응형 단위(vw, %, rem) 대신 고정 단위(px) 사용
- **375px 기준**: 모든 컴포넌트는 375px 너비 기준으로 설계
- **일관성 유지**: 다양한 기기에서 동일한 시각적 경험

#### 2. 쿠캣 스타일 레이아웃
- **중앙 고정 뷰**: PC 환경에서도 중앙에 모바일 크기로 렌더링
- **기준 너비**: 375px 고정 (최대 480px 초과 금지)
- **배경 설정**: 컨텐츠 영역 밖(좌우 여백)은 CSS 변수 또는 CSS Module로 배경색 적용

#### 3. 반응형 미지원
- **미디어 쿼리 금지**: 반응형 CSS 작성 금지
- **고정 레이아웃**: 모든 화면 크기에서 동일한 레이아웃
- **개발 효율성**: 반응형 고려 없이 빠른 개발

### 디자인 토큰 활용

#### 색상
- 프로젝트 디자인 토큰 시스템 준수
- 하드코딩 색상값 금지
- CSS 변수 또는 CSS Module 내에서 디자인 토큰 변수 사용
- Tailwind 토큰은 선택적으로만 사용

#### 간격
- 디자인 토큰의 spacing 시스템 활용
- CSS Module에서 CSS 변수로 간격 값 사용
- 일관된 간격 유지

---

## 🔧 구현 세부사항

### 1. 환경 변수 처리

**파일**: `src/commons/utils/kakao-map/config.ts`

**변경 사항**:
- `NEXT_PUBLIC_KAKAO_MAP_API_KEY` 환경 변수 접근
- Next.js에서 클라이언트 접근 가능하도록 처리
- 환경 변수 미설정 시 에러 처리

**구현**:
```typescript
export function getKakaoMapApiKey(): string {
  // Next.js에서는 NEXT_PUBLIC_ 접두사가 필요하지만,
  // 기존 모바일 앱과의 일관성을 위해 EXPO_PUBLIC_ 사용
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  
  if (!apiKey) {
    throw new Error('카카오 지도 API 키가 설정되지 않았습니다.');
  }
  
  return apiKey;
}
```

**주의사항**:
- Next.js에서는 클라이언트에서 접근하려면 `NEXT_PUBLIC_` 접두사가 필요
- `.env.local` 파일에 `NEXT_PUBLIC_KAKAO_MAP_API_KEY`로도 추가 설정 권장
- 또는 `next.config.ts`에서 환경 변수 변환 처리

### 2. 카카오 지도 스크립트 로딩

**파일**: `src/commons/utils/kakao-map/script-loader.ts`

**구현 내용**:
- 동적 스크립트 로딩
- 중복 로딩 방지
- Promise 기반 비동기 처리
- 에러 처리

**구현**:
```typescript
let scriptLoadingPromise: Promise<void> | null = null;

export function loadKakaoMapScript(): Promise<void> {
  // 이미 로드된 경우
  if (typeof window !== 'undefined' && window.kakao?.maps) {
    return Promise.resolve();
  }

  // 이미 로딩 중인 경우
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  // 새로 로딩
  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${getKakaoMapApiKey()}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          resolve();
        });
      } else {
        reject(new Error('카카오 지도 API 로딩 실패'));
      }
    };
    script.onerror = () => {
      reject(new Error('카카오 지도 스크립트 로딩 실패'));
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}
```

### 3. 카카오 지도 타입 정의

**파일**: `src/commons/utils/kakao-map/types.ts`

**구현 내용**:
- 카카오 지도 API 타입 정의
- 전역 타입 확장

**구현**:
```typescript
declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: MapOptions) => Map;
        LatLng: new (lat: number, lng: number) => LatLng;
        // 필요한 타입 추가
      };
    };
  }
}

export interface MapOptions {
  center: LatLng;
  level: number;
}

export interface LatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface Map {
  setCenter: (latlng: LatLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => LatLng;
  getLevel: () => number;
  // 필요한 메서드 추가
}
```

### 4. 홈 페이지 통합

**파일**: `src/app/(main)/page.tsx`

**변경 사항**:
- 기존 컴포넌트 미리보기 페이지를 Home Feature로 교체
- Home Feature Container import 및 렌더링

**구조**:
```tsx
import HomeFeature from '@/components/home';

export default function HomePage() {
  return <HomeFeature />;
}
```

### 5. 지도 초기 설정

**기본 위치**: 서울시청 (예시)
- 위도: 37.5665
- 경도: 126.9780

**기본 확대/축소 레벨**: 3 (전국 단위)

**설정 파일**: `src/components/home/config/map-config.ts`

---

## 🚀 성능 최적화

### 1. 스크립트 로딩 최적화

**전략**:
- 동적 스크립트 로딩으로 초기 번들 크기 감소
- 중복 로딩 방지로 네트워크 요청 최소화
- `next/script` 컴포넌트 활용 (선택적)

### 2. 컴포넌트 최적화

**전략**:
- 지도 컴포넌트는 클라이언트 컴포넌트 (`'use client'`)
- React.memo 활용 (필요시)
- 지도 인스턴스 재사용

### 3. 렌더링 최적화

**전략**:
- 지도 로딩 완료 후에만 지도 컴포넌트 렌더링
- 로딩 상태 표시로 사용자 경험 향상
- CSS Module 사용으로 런타임 오버헤드 최소화

---

## 🔐 접근성 (A11y) 전략

### 1. 키보드 네비게이션
- 지도 관리 컨트롤에 `tabIndex={0}` 설정
- Enter/Space 키로 조작 가능
- 포커스 표시 스타일 적용 (CSS Module에서 `:focus` 스타일 정의)

### 2. 스크린 리더 지원
- 지도 영역에 `aria-label` 제공
- 지도 관리 컨트롤에 의미 있는 라벨
- `role="application"` 또는 `role="img"` 설정

### 3. 터치 타겟 크기
- 최소 44px × 44px 터치 타겟
- 충분한 간격 유지
- 터치 영역 확장 (필요시)

### 4. 색상 대비
- WCAG AA 기준 준수
- 컨트롤과 배경 간 충분한 대비
- 포커스 상태 명확한 표시

---

## 📋 개발 워크플로우

### 1. 개발 순서

1. **환경 변수 설정**: `.env.local`에 API 키 추가
2. **타입 정의**: 카카오 지도 API 타입 정의 파일 생성
3. **스크립트 로더**: 카카오 지도 스크립트 로더 유틸리티 구현
4. **지도 훅**: `useKakaoMap` 훅 구현
5. **지도 관리 훅**: `useMapControl` 훅 구현
6. **지도 뷰 컴포넌트**: Map View 컴포넌트 구현 + `styles.module.css` 작성
7. **지도 관리 컨트롤**: Map Controls 컴포넌트 구현 + `styles.module.css` 작성
8. **홈 피처 통합**: Home Feature Container 구현
9. **홈 페이지 통합**: 홈 페이지에 Home Feature 통합
10. **테스트**: 지도 표시, 조작, 관리 기능 확인

### 2. 테스트 체크리스트

- [ ] 환경 변수가 설정된 경우 지도가 정상적으로 로드됨
- [ ] 환경 변수가 설정되지 않은 경우 적절한 오류 메시지 표시됨
- [ ] 지도가 홈 페이지에 정상적으로 표시됨
- [ ] 지도 드래그 이동이 정상 동작함
- [ ] 지도 확대/축소가 정상 동작함
- [ ] 지도 초기화 기능이 정상 동작함
- [ ] 지도 관리 컨트롤이 접근 가능함
- [ ] 지도 로딩 상태가 표시됨
- [ ] 지도 에러 상태가 적절히 처리됨
- [ ] 375px 모바일 프레임 내에서 정상 표시됨
- [ ] CSS Module 스타일이 정상 적용됨
- [ ] 터치 타겟 크기가 44px × 44px 이상임

---

## 🔄 향후 확장 가능성

### 1. 지도 위 마커 표시
- 타임캡슐 위치 마커
- 마커 클러스터링
- 커스텀 마커 아이콘

### 2. 위치 검색 기능
- 주소 검색
- 장소 검색
- 검색 결과 표시

### 3. 현재 위치 표시 (구현 완료)
- ✅ 지도 중앙점 기준 주소 표시
- ✅ 현재 위치 마커 표시
- 향후: GPS 위치 가져오기
- 향후: 현재 위치로 지도 이동

### 4. 지도 스타일 커스터마이징
- 지도 타입 변경 (일반, 위성, 하이브리드)
- 지도 스타일 커스터마이징
- 다크 모드 지원

---

## 📊 기술 의존성

### 필수 패키지
- **Next.js 16+**: App Router, 동적 스크립트 로딩, CSS Module 지원
- **React 19+**: 컴포넌트 라이브러리
- **TypeScript 5+**: 타입 안전성, CSS Module 타입 지원

### 외부 서비스
- **카카오 지도 JavaScript API**: 지도 표시 및 기본 기능
  - API 키 필요: `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
  - 스크립트 URL: `//dapi.kakao.com/v2/maps/sdk.js`
- **카카오 REST API**: 주소 조회 기능
  - API 키 필요: `NEXT_PUBLIC_KAKAO_REST_API_KEY`
  - 엔드포인트: `GET https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`
  - 응답 형식: JSON
  - 주소 표시 형식: `region_2depth_name` (예: "성남시 분당구")

### 선택적 패키지
- **Tailwind CSS 4+**: 스타일링 (선택사항, CSS Module 보조용)

---

## 🎯 구현 우선순위

### Phase 1: 기본 지도 표시 (P1)
1. 환경 변수 설정 및 접근 유틸리티 구현
2. 카카오 지도 타입 정의 파일 생성
3. 카카오 지도 스크립트 로더 구현
4. `useKakaoMap` 훅 기본 구현
5. Map View 컴포넌트 기본 구조 + `styles.module.css` 작성
6. Home Feature Container 기본 구조
7. 홈 페이지에 지도 통합
8. 지도 기본 렌더링 테스트

### Phase 2: 지도 기본 조작 (P1)
1. 지도 드래그 이동 기능 구현
2. 지도 확대/축소 기능 구현
3. 지도 조작 최적화
4. 지도 조작 테스트

### Phase 3: 현재 위치 및 주소 표시 (P1)
1. 카카오 REST API 주소 조회 함수 구현 (`commons/apis/kakao-map/address.ts`)
2. `useAddress` 훅 구현 (디바운싱 포함)
3. `useCurrentLocation` 훅 구현
4. Location Display 컴포넌트 구현 + `styles.module.css` 작성
5. 지도 이동 이벤트 리스너 등록
6. 주소 표시 테스트

### Phase 4: FAB 버튼 구현 (P1)
1. FAB Button 컴포넌트 기본 구조 + `styles.module.css` 작성
2. 아이콘 전환 애니메이션 구현
3. 선택 옵션 표시/숨김 로직 구현
4. 오버레이 배경 구현
5. 이스터에그/타임캡슐 선택 핸들러 연결
6. FAB 버튼 테스트

### Phase 5: 알 슬롯 구현 (P2)
1. Egg Slot 컴포넌트 기본 구조 + `styles.module.css` 작성
2. 알 개수 표시 구현
3. 모달 연동 (공용 모달 컴포넌트 사용)
4. 알 개수 0인 경우 처리
5. 알 슬롯 테스트

### Phase 6: 지도 관리 기능 (P2)
1. `useMapControl` 훅 구현
2. Map Controls 컴포넌트 구현 + `styles.module.css` 작성
3. 지도 초기화 기능 구현
4. 지도 관리 기능 테스트

### Phase 7: 에러 처리 및 최적화 (P3)
1. 환경 변수 미설정 에러 처리
2. 네트워크 오류 처리
3. API 호출 실패 처리 (지도 API, REST API)
4. 로딩 상태 개선
5. 성능 최적화 (디바운싱, 캐싱)
6. 접근성 개선
7. 최종 테스트 및 검증

---

## 📝 참고사항

### 모바일 프레임 완결성
- 모든 결과물은 `app/layout.tsx`에 정의된 모바일 프레임 안에서 완결성 있게 표시
- 375px 기준으로 모든 UI 컴포넌트 설계
- 프레임 내에서 핵심 기능 완료 가능

### 반응형 미지원 원칙
- 미디어 쿼리나 유연한 단위(vw, %) 대신 고정 단위(px) 사용
- 다양한 모바일 기기에서 동일한 시각적 경험 제공
- 반응형 고려 없이 빠른 개발 가능

### Feature Slice Architecture 준수
- 지도 관련 컴포넌트는 `components/home/`에 배치
- 공용 유틸리티는 `commons/utils/kakao-map/`에 배치
- `app/` 레이어는 순수 라우팅 역할만 수행

### CSS Module 필수 사용 원칙
- 모든 컴포넌트는 `styles.module.css` 파일을 필수로 사용
- CSS Module을 우선 사용하고, 필요시에만 Tailwind CSS 보조 사용
- TypeScript에서 CSS Module 타입 자동 생성 및 타입 체크 활용
- 컴포넌트별 스타일 격리로 충돌 방지

### 환경 변수 처리 주의사항
- Next.js에서는 클라이언트 접근을 위해 `NEXT_PUBLIC_` 접두사 필수
- `.env.local` 파일에 다음 환경 변수 설정 필요:
  - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`: 카카오 지도 JavaScript API 키
  - `NEXT_PUBLIC_KAKAO_REST_API_KEY`: 카카오 REST API 키 (주소 조회용)
- 환경 변수 미설정 시 적절한 에러 메시지 표시

### 주소 표시 형식
- 카카오 REST API 응답에서 `region_2depth_name` 필드 사용
- 예시: "성남시 분당구"
- 지도 이동 시 자동으로 주소 업데이트
- 디바운싱을 통한 API 호출 최적화 (500ms)

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
