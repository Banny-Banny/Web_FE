# 마이페이지 캡슐보관함 기술 계획서

**Branch**: `012-mypage-capsule-storage` (또는 `feat/MYP-capsule-storage`)  
**Date**: 2025-01-30  
**Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/012-mypage-capsule-storage/spec.md`

## Summary

마이페이지에서 참여 중인 타임캡슐을 "캡슐 대기실", "열린 캡슐", "잠긴 캡슐"로 구분해 한 화면에 표시하고, 대기실 캡슐은 작성 페이지로 이동, 열린 캡슐은 상세 모달에서 내용(텍스트·이미지·영상·오디오)을 보며, 잠긴 캡슐은 D-day만 확인할 수 있도록 합니다.

**주요 목표**:
- 참여 캡슐 목록 API·훅 구현 (GET /api/me/capsules, 전체 자동 수집)
- 타임캡슐 상세 API·훅 구현 (GET /api/timecapsules/{id}?user_id=, snake_case → camelCase 변환)
- 캡슐 상태 분류 로직 (WAITING → 대기실, openDate ≤ now → 열린, openDate > now → 잠긴)
- 캡슐보관함 전용 페이지 및 진입 경로 (마이페이지 "캡슐" 영역 클릭)
- 대기실 섹션(가로 스크롤 카드), 열린/잠긴 탭, 열린 캡슐 상세 모달
- 대기실 카드 클릭 → `/waiting-room/[capsuleId]` 이동
- 위치 표시 시 Kakao Maps API(기존 `commons/apis/kakao-map/address`) 활용

**기술적 접근**:
- Next.js App Router, TypeScript
- React Query (목록 조회·전체 수집, 상세 조회, 캐시 무효화)
- Axios + `commons/apis/me/capsules` 신규, 타임캡슐 상세 엔드포인트 확장
- CSS Modules + Tailwind(디자인 토큰), 375px 고정
- dayjs 날짜 포맷, 기존 오디오/비디오 플레이어·모달 재사용

---

## Technical Context

**Language/Version**: TypeScript 5, React 19  
**Primary Dependencies**: Next.js 16, Axios, React Query (@tanstack/react-query), dayjs  
**Storage**: N/A (서버 상태는 React Query 캐시)  
**Testing**: Playwright (E2E, UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**:
- 캡슐보관함 목록 최초 로드 5초 이내
- 대기실 카드 선택 후 작성 페이지 전환 3초 이내
- 열린 캡슐 상세 모달 열기 3초 이내

**Constraints**:
- API: GET /api/me/capsules (limit, offset), GET /api/timecapsules/{id}?user_id= (상세, snake_case 응답 가정)
- 캡슐 분류는 클라이언트에서 status·openDate·deadline 기준으로 수행
- 열린 캡슐 상세는 이미 개봉된 캡슐만 요청, 403/404 시 모달 내 에러 메시지
- 위치(주소)는 Kakao Maps 역지오코딩 또는 기존 `useKakaoAddress`/address 유틸 활용

**Scale/Scope**:
- API 함수 2개 + 타입 정의 (me/capsules, timecapsules 상세)
- React Query: useMyCapsules(목록·분류), useCapsuleDetail(상세)
- 캡슐보관함 페이지 1개, 섹션/탭/리스트/모달 컴포넌트

---

## Constitution Check

*GATE: Must pass before Phase 0. Re-check after Phase 1 design.*

- **아키텍처 준수**: Feature Slice, API는 `src/commons/apis/me/capsules` 및 캡슐 상세 엔드포인트
- **디렉토리 구조**: API·훅은 commons/apis/me/capsules, 캡슐보관함 UI는 components/CapsuleStorage 및 app/(main)/profile/capsules
- **타입 안전성**: API 요청/응답 TypeScript 인터페이스 정의, snake_case → camelCase 변환 타입
- **API 통신**: 기존 api-client(Axios) 사용
- **에러 핸들링**: 401/403/404/500 처리, 빈 배열 또는 에러 메시지로 UI 유지
- **성능**: React Query 캐시, useMemo로 분류 로직 메모이제이션
- **모바일**: 375px 고정, 터치 영역·접근성(포커스, ESC 닫기) 고려

---

## Project Structure

### Documentation (this feature)

```text
specs/012-mypage-capsule-storage/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   ├── endpoints.ts                      # ME_CAPSULES, 타임캡슐 상세 엔드포인트 추가
│   │   ├── me/
│   │   │   └── capsules/
│   │   │       ├── index.ts                  # getMyCapsules (전체 수집)
│   │   │       ├── types.ts                  # MyCapsuleItem, MyCapsuleListResponse, CategorizedCapsules
│   │   │       └── hooks/
│   │   │           ├── index.ts
│   │   │           └── useMyCapsules.ts      # 목록 조회 + 분류(대기실/열린/잠긴)
│   │   └── timecapsules/ (또는 capsules/ 확장)
│   │       ├── detail.ts                     # getCapsuleDetail(id, userId), snake→camel
│   │       └── hooks/
│   │           └── useCapsuleDetail.ts       # 상세 조회 (열린 캡슐용)
│   └── utils/
│       └── date.ts                           # (기존) formatRemainingTime, formatDday, formatDate
├── components/
│   └── CapsuleStorage/
│       ├── index.tsx                         # 캡슐보관함 컨테이너 (헤더, 대기실, 탭, 리스트)
│       ├── types.ts
│       ├── styles.module.css
│       ├── hooks/
│       │   └── useCapsuleClassification.ts  # (선택) 분류 유틸 재사용
│       └── components/
│           ├── CapsuleHeader.tsx             # 제목 "캡슐보관함", 닫기, 서브타이틀
│           ├── WaitingRoomSection.tsx        # 대기실 가로 스크롤 카드
│           ├── CapsuleTabs.tsx               # 열린/잠긴 탭
│           ├── OpenedCapsuleList.tsx         # 열린 캡슐 세로 리스트
│           ├── LockedCapsuleList.tsx         # 잠긴 캡슐 세로 리스트
│           └── CapsuleDetailModal.tsx       # 열린 캡슐 상세 (아바타, 슬롯 콘텐츠)
├── app/
│   └── (main)/
│       └── profile/
│           └── capsules/
│               └── page.tsx                  # 캡슐보관함 페이지 (CapsuleStorage 렌더)
└── ...
```

- 마이페이지 "캡슐" 클릭 시 `router.push('/profile/capsules')` 로 진입.
- 기존 `commons/components/modal`, `commons/components/audio-player`, `commons/components/video-player` 등 재사용.

---

## Data Model

### API Response Types (명세·백엔드 스펙 기준)

**참여 캡슐 목록 (GET /api/me/capsules)**

```typescript
// 목록 한 건
export interface MyCapsuleItem {
  id: string;
  title: string;
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED' | 'BURIED';
  openDate: string | null;       // ISO 8601
  participantCount: number;
  completedCount: number;
  myWriteStatus: boolean;
  deadline: string | null;      // ISO 8601
  createdAt: string;
  location?: { latitude: number; longitude: number };
}

export interface MyCapsuleListResponse {
  items: MyCapsuleItem[];
  total: number;
  limit: number;
  offset: number;
  hasNext?: boolean;
}

// 클라이언트 분류 결과
export interface CategorizedCapsules {
  waitingRooms: MyCapsuleItem[];
  openedCapsules: MyCapsuleItem[];
  lockedCapsules: MyCapsuleItem[];
}
```

**타임캡슐 상세 (GET /api/timecapsules/{id}?user_id=)** — 서버가 snake_case 반환 시 변환

```typescript
export interface CapsuleDetailSlotAuthor {
  id: string;
  name: string;
  emoji: string;
  profileImg?: string;
}

export interface SlotContentImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface SlotContentVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
}

export interface SlotContentAudio {
  id: string;
  title: string;
  url: string;
}

export interface SlotContent {
  text?: string;
  images?: SlotContentImage[];
  video?: SlotContentVideo;
  audio?: SlotContentAudio;
}

export interface CapsuleDetailSlot {
  slotId: string;
  author: CapsuleDetailSlotAuthor;
  isWritten: boolean;
  content?: SlotContent;
}

export interface CapsuleDetailResponse {
  id: string;
  title: string;
  headcount: number;
  isLocked: boolean;
  slots: CapsuleDetailSlot[];
  stats?: { totalSlots: number; filledSlots: number; emptySlots: number };
}
```

- 상세 API 응답이 snake_case면 `slot_id`, `profile_img` 등 → camelCase 변환 유틸 한 곳에서 처리.

### 분류 로직 (클라이언트)

- `openDate === null && deadline === null` → 이스터에그 제외(필터 아웃).
- `status === 'WAITING'` → waitingRooms.
- `openDate` 있음: `new Date(openDate) <= now` → openedCapsules, 아니면 lockedCapsules.
- `openDate` 없음: `status === 'COMPLETED' || status === 'EXPIRED'` → openedCapsules, `status === 'BURIED'` → lockedCapsules.

### 유틸 (날짜·남은 시간)

- **남은 시간 (대기실)**: `deadline` 기준 "N일 N시간 N분" 또는 "마감됨" (기존 `utils/date.ts` 또는 신규 `utils/capsule-date.ts`).
- **D-day (잠긴)**: `openDate` 기준 "D-N일 남음", "오늘 개봉", "개봉됨" (동일 유틸).
- **날짜 표시**: dayjs로 "YYYY년 MM월 DD일".

---

## API Design

### 1. 참여 캡슐 목록 조회

**Endpoint**: `GET /api/me/capsules`  
**Query**: `limit` (기본 20), `offset` (기본 0)  
**Response**: `200 OK` — `{ items, total, limit, offset, hasNext? }` (camelCase)  
**에러**: 401 → 인증 필요, 500 → 서버 오류. 에러 시 빈 배열 반환해 UI 유지.

**전체 수집**: hasNext가 true인 동안 limit/offset으로 반복 호출 후 items 합쳐서 한 번에 반환(또는 첫 페이지만 로드 후 "더보기" 선택). 명세상 "전체 데이터 자동 수집"이면 초기 로드에서 병렬/순차로 전부 가져와서 분류.

### 2. 타임캡슐 상세 조회

**Endpoint**: `GET /api/timecapsules/{id}?user_id={userId}`  
**Path**: `id` (캡슐 ID)  
**Query**: `user_id` (현재 사용자 ID)  
**Response**: `200 OK` — snake_case면 camelCase로 변환 후 CapsuleDetailResponse  
**에러**: 401, 403(권한/미결제), 404(캡슐 없음), 500 → 모달 내 메시지 + 닫기.

---

## Component Design

### 캡슐보관함 페이지

**Location**: `src/app/(main)/profile/capsules/page.tsx`  
- `CapsuleStorage` 컨테이너 렌더.
- 공통 레이아웃(Main Layout) 적용, 375px 프레임.

### CapsuleStorage (컨테이너)

**Location**: `src/components/CapsuleStorage/index.tsx`  
- `useMyCapsules()`로 목록 조회 및 분류(waitingRooms, openedCapsules, lockedCapsules).
- 상태: 선택 탭(열린/잠긴), 상세 모달 열림 여부, 선택된 캡슐 ID.
- 자식: CapsuleHeader, WaitingRoomSection, CapsuleTabs, OpenedCapsuleList 또는 LockedCapsuleList, CapsuleDetailModal(열린 캡슐 선택 시).

### CapsuleHeader

- 제목 "캡슐보관함", 우측 닫기 버튼(X) → `router.back()` 또는 `/profile` 이동.
- 서브타이틀 "열린 캡슐 N개 · 잠긴 캡슐 N개" (동적).

### WaitingRoomSection

- 섹션 제목 "캡슐 대기실", "N개".
- 가로 스크롤(overflow-x: auto) 카드 리스트.
- 카드: 제목, 진행률(completedCount/participantCount) + 프로그레스 바, 참여자 아이콘(완료/미완료 구분), 남은 시간(유틸 사용).
- 클릭 → `router.push(\`/waiting-room/${capsule.id}\`)`.
- 빈 목록 → "캡슐이 없어요" 안내.

### CapsuleTabs

- "열린 캡슐 (N)", "잠긴 캡슐 (N)" 탭, 선택 탭 하단 인디케이터.
- 탭 변경 시 OpenedCapsuleList / LockedCapsuleList 전환.

### OpenedCapsuleList

- 열린 캡슐 세로 리스트. 카드: 💊, 제목, 위치(지도 아이콘 + 주소, Kakao 역지오코딩), 묻은 날짜, 열린 날짜.
- 클릭 → selectedCapsuleId 설정, CapsuleDetailModal 오픈.
- 빈 목록 → "열린 캡슐이 없어요".

### LockedCapsuleList

- 잠긴 캡슐 세로 리스트. 카드: 그라데이션 배경, 💊, 제목, 묻은 날짜, 열리는 날짜, 푸터 "D-N일 남음" 등.
- 클릭 → 상세 열지 않음(또는 "아직 개봉 전이에요" 토스트/안내).
- 빈 목록 → "잠긴 캡슐이 없어요".

### CapsuleDetailModal

- 열린 캡슐 상세: `useCapsuleDetail(selectedCapsuleId)` 호출.
- 헤더: 닫기 버튼, 캡슐 제목, 참여자 아바타(이모지+이름) — 클릭 시 해당 슬롯 콘텐츠로 전환.
- 콘텐츠: 텍스트, 이미지 캐러셀, 비디오(기존 VideoPlayer), 오디오(기존 AudioPlayer).
- 닫기: ESC, 오버레이 클릭, 닫기 버튼. 포커스 트랩 및 닫힐 때 포커스 복귀.
- 로딩: 스피너/스켈레톤. 403/404: 에러 메시지 + 닫기.

---

## State Management

### Server State (React Query)

**Query Keys**:
- `['me', 'capsules', 'list']`: 참여 캡슐 목록 (전체 수집 후 분류 결과는 컴포넌트에서 useMemo)
- `['timecapsules', 'detail', capsuleId]`: 타임캡슐 상세 (열린 캡슐 모달용)

**Options**:
- 목록: staleTime 0, refetchOnWindowFocus true, gcTime 5분. 에러 시 빈 배열 반환.
- 상세: capsuleId 있을 때만 enabled, staleTime 1분.

### Client State

- 탭 선택: 'opened' | 'locked'.
- 모달: isDetailModalOpen, selectedCapsuleId.
- 슬롯 선택: selectedSlotIndex (모달 내).

---

## 라우팅

- 마이페이지 활동 카드 "캡슐" 클릭 → `router.push('/profile/capsules')`.
- 캡슐보관함 닫기 → `router.back()` 또는 `router.push('/profile')`.
- 대기실 캡슐 카드 클릭 → `router.push(\`/waiting-room/${capsuleId}\`)`.
- 열린 캡슐 카드 클릭 → 모달만 열고 URL 변경 없음(선택 시 쿼리 파라미터로 열 수도 있음).

---

## Implementation Strategy (개발 워크플로우 반영)

### Phase 1: API Layer

**목표**: 참여 캡슐 목록·타임캡슐 상세 API 통신 레이어 구축

**작업**:
1. `endpoints.ts`에 `ME_CAPSULES: '/api/me/capsules'`, 타임캡슐 상세 `GET /api/timecapsules/:id?user_id=` 추가(또는 기존 CAPSULE 엔드포인트 확장).
2. `commons/apis/me/capsules/types.ts`: MyCapsuleItem, MyCapsuleListResponse, CategorizedCapsules 정의.
3. `commons/apis/me/capsules/index.ts`: getMyCapsules(limit, offset) 구현. 전체 수집은 hasNext 반복 호출 함수 별도(예: fetchAllMyCapsules) 또는 훅 내부에서 처리.
4. 타임캡슐 상세: `commons/apis/timecapsules/detail.ts`(또는 capsules 확장)에 getCapsuleDetail(id, userId) 구현, 응답 snake_case → camelCase 변환.
5. 에러 시 401/500 목록은 빈 배열, 상세는 throw 또는 에러 객체 반환해 훅에서 처리.

### Phase 2: React Query Hooks & 분류/유틸

**목표**: useMyCapsules(목록+분류), useCapsuleDetail(상세), 날짜/남은시간 유틸

**작업**:
1. `commons/utils/date.ts` 또는 `capsule-date.ts`: formatRemainingTime(deadline), formatDday(openDate), formatCapsuleDate(isoString) (YYYY년 MM월 DD일).
2. `useMyCapsules.ts`: getMyCapsules 호출(전체 수집 로직 포함), queryKey `['me', 'capsules', 'list']`, 반환 데이터를 useMemo로 분류(waitingRooms, openedCapsules, lockedCapsules). 이스터에그 필터(openDate·deadline 둘 다 null 제외) 적용.
3. `useCapsuleDetail.ts`: getCapsuleDetail(id, userId), queryKey `['timecapsules', 'detail', id]`, enabled: !!id && !!userId.

### Phase 3: 캡슐보관함 페이지 및 진입

**목표**: 라우트 추가, 마이페이지에서 캡슐 클릭 시 진입

**작업**:
1. `app/(main)/profile/capsules/page.tsx` 생성, CapsuleStorage 렌더.
2. `components/Mypage/index.tsx`에서 활동 카드 "캡슐" 영역에 onClick 추가 → `router.push('/profile/capsules')`.

### Phase 4: 캡슐보관함 UI (Mock → 실제 바인딩)

**목표**: 헤더, 대기실 섹션, 탭, 열린/잠긴 리스트, 상세 모달 구현

**작업**:
1. CapsuleHeader: 제목, 닫기, 서브타이틀(열린 N · 잠긴 N). 375px, CSS Modules.
2. WaitingRoomSection: 가로 스크롤 카드, 진행률·참여자·남은 시간, 클릭 시 `/waiting-room/[id]`.
3. CapsuleTabs: 열린/잠긴 탭, 인디케이터.
4. OpenedCapsuleList: 카드(제목, 위치(Kakao 주소), 묻은/열린 날짜), 클릭 시 모달 오픈.
5. LockedCapsuleList: 카드(제목, 묻은/열리는 날짜, D-day), 클릭 시 상세 미오픈.
6. CapsuleDetailModal: 헤더(닫기, 제목, 아바타 목록), 슬롯별 콘텐츠(텍스트, 이미지, 비디오, 오디오), ESC/오버레이/닫기로 닫기. 기존 Modal, AudioPlayer, VideoPlayer 재사용.
7. 위치 표시: location 좌표 있으면 Kakao 역지오코딩(기존 address 유틸 또는 useKakaoAddress)으로 주소 표시, 없으면 "-".

### Phase 5: 에러·로딩·빈 상태

**목표**: 목록/상세 오류·로딩·빈 목록 처리

**작업**:
1. 목록 로딩: 스피너 또는 스켈레톤. 에러: "불러오지 못했어요" + 재시도/닫기.
2. 상세 모달 로딩: 스피너. 403/404: "권한이 없어요" / "캡슐을 찾을 수 없어요" + 닫기.
3. 빈 구역: "캡슐이 없어요", "열린 캡슐이 없어요", "잠긴 캡슐이 없어요".

### Phase 6: E2E / UI 테스트

**목표**: 캡슐보관함 진입, 대기실 이동, 열린 캡슐 상세, 잠긴 캡슐 비공개, 닫기 검증

**작업**:
1. E2E: 마이페이지 → 캡슐 클릭 → 캡슐보관함 페이지, 대기실 카드 클릭 → waiting-room 페이지 이동.
2. E2E: 열린 캡슐 카드 클릭 → 모달 열림, 아바타 클릭 → 슬롯 전환, 모달 닫기.
3. E2E: 잠긴 캡슐 카드 클릭 → 상세 미오픈(또는 안내만).
4. UI: 로딩·빈 목록·에러 상태, 탭 전환, 접근성(포커스, ESC).

---

## Edge Cases (구현 시 처리)

- **목록 401/500**: 빈 배열 반환, 화면 깨지지 않게, 재시도/닫기 제공.
- **상세 403/404**: 모달 내 메시지, 닫기만 가능.
- **개봉일 없음**: status로 열린/잠긴 폴백(COMPLETED|EXPIRED → 열린, BURIED → 잠긴).
- **위치 없음/역지오딩 실패**: 주소 영역 "-" 또는 숨김.
- **마감 지난 대기실**: "마감됨" 표시, 클릭 시 `/waiting-room/[id]` 이동은 허용(제출 가능 여부는 서버 정책).

---

## Success Criteria (spec 대응)

- SC-1: 캡슐보관함 진입 후 5초 이내 목록이 대기실/열린/잠긴으로 구분 표시, 서브타이틀·탭 개수 일치.
- SC-2: 대기실 카드 클릭 후 한 번에 `/waiting-room/[capsuleId]` 이동, 작성 가능.
- SC-3: 열린 캡슐 선택 시 상세 모달에서 참여자별 텍스트·이미지·영상·오디오 확인, 슬롯 전환·모달 닫기 동작.
- SC-4: 잠긴 캡슐은 D-day만 표시, 내용 미노출.
- SC-5: 로딩·에러·빈 목록 처리, 접근성(키보드, ESC, 포커스).
