# 공지사항 페이지 기술 계획서

**Branch**: `feat/notice` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/010-notice-page/spec.md`

## Summary

사용자가 공지사항 목록을 조회·검색하고, 더보기로 추가 로드하며, 개별 공지 상세를 볼 수 있는 기능을 구현합니다. 마이페이지에서 고객 센터 위의 진입 메뉴로 접근하며, 헤더는 공통 `PageHeader` 컴포넌트를 사용합니다.

**주요 목표**:
- 공지사항 목록 조회 API 함수 구현 (GET /api/notices, query: search, limit, offset)
- 공지사항 상세 조회 API 함수 구현 (GET /api/notices/{id})
- 목록/상세용 React Query 훅 구현 (목록: 10개 단위, 더보기 패턴)
- 공지사항 목록·상세 UI 구현 (375px, 공통 헤더, 검색, 더보기)
- 마이페이지 내비게이션에 공지사항 메뉴 추가 (고객 센터 위)

**기술적 접근**:
- Next.js App Router, TypeScript
- React Query로 서버 상태 관리 (목록: 누적 로드, 검색 시 초기화)
- Axios + commons/apis 레이어
- CSS Modules + Tailwind (디자인 토큰), 375px 고정

---

## Technical Context

**Language/Version**: TypeScript 5, React 19  
**Primary Dependencies**: Next.js 16, Axios, React Query (@tanstack/react-query)  
**Storage**: N/A (서버 상태는 React Query 캐시)  
**Testing**: Playwright (E2E, UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**:
- 목록 최초 로드 3초 이내
- 더보기·검색 결과 3초 이내
- 상세 화면 2초 이내

**Constraints**:
- API: GET /api/notices (search, limit 기본 20, offset 기본 0) → 클라이언트는 limit 10 사용
- API: GET /api/notices/{id}
- 응답: `{ success, data }` 래핑 (목록: data.items, data.total, data.limit, data.offset / 상세: data 객체)
- 헤더: 공통 `PageHeader` 사용

**Scale/Scope**:
- API 함수 2개 + 타입 정의 (commons/apis/notices, 연결만)
- React Query 훅 2개 (components/notice/hooks: 목록 with 더보기, 상세)
- 공지 목록·상세 컴포넌트, 검색·더보기 UI
- 마이페이지에 공지사항 메뉴 1개 추가

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice, API는 `src/commons/apis/`  
✅ **디렉토리 구조**: API는 `src/commons/apis/notices/`(연결만), 훅·화면은 `src/components/notice/`  
✅ **타입 안전성**: API 요청/응답 TypeScript 인터페이스 정의  
✅ **API 통신**: 기존 api-client(Axios) 사용  
✅ **에러 핸들링**: 표준 오류 처리 및 사용자 메시지  
✅ **성능**: React Query 캐시, 목록 10개 단위·더보기  
✅ **모바일**: 375px 고정, 터치 영역·접근성 고려

---

## Project Structure

### Documentation (this feature)

```text
specs/010-notice-page/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   ├── endpoints.ts              # NOTICE_ENDPOINTS 추가
│   │   └── notices/                 # 공지사항 API (연결만, 훅 없음)
│   │       ├── index.ts              # getNotices, getNoticeById
│   │       └── types.ts              # 요청/응답 타입
│   └── components/
│       └── page-header/              # 기존 공통 헤더 (재사용)
├── components/
│   └── notice/                       # 공지사항 화면 조각
│       ├── index.tsx                 # 목록 컨테이너 (헤더+검색+리스트+더보기)
│       ├── notice-detail.tsx         # 상세 컨테이너 (헤더+본문)
│       ├── types.ts
│       ├── styles.module.css
│       ├── hooks/                    # 공지 전용 훅 (React Query)
│       │   ├── index.ts
│       │   ├── useNotices.ts         # 목록 조회 + 더보기(누적) 로직
│       │   └── useNotice.ts         # 상세 조회 (id)
│       └── components/               # 필요 시 하위 UI (리스트 아이템 등)
├── components/
│   └── Mypage/
│       └── index.tsx                 # 공지사항 메뉴 추가 (고객 센터 위)
└── app/
    └── (main)/
        ├── notices/
        │   ├── page.tsx              # 공지사항 목록 페이지
        │   └── [id]/
        │       └── page.tsx           # 공지사항 상세 페이지
        └── ...
```

---

## Data Model

### API Request Types

```typescript
/**
 * 공지사항 목록 조회 쿼리 파라미터
 */
export interface GetNoticesParams {
  search?: string;  // 검색 키워드 (제목/본문)
  limit?: number;    // 한 페이지에 표시할 아이템 수 (클라이언트 기본값: 10)
  offset?: number;  // 건너뛸 아이템 수 (기본값: 0)
}
```

### API Response Types (서버 응답 구조 반영)

```typescript
/**
 * 공지사항 목록 항목 (목록 API items 요소)
 */
export interface NoticeListItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isPinned: boolean;
  isVisible: boolean;
  createdAt: string;  // ISO 8601
}

/**
 * 공지사항 목록 API 응답 data
 */
export interface GetNoticesResponseData {
  items: NoticeListItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * 공지사항 상세 (상세 API data)
 */
export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 서버 공통 래핑: { success, data } */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
```

### Component State Types

```typescript
/**
 * 목록 화면 로컬 상태 (검색어, 누적 목록은 훅/서버 상태로 관리)
 */
interface NoticeListState {
  searchKeyword: string;   // 입력 중 검색어
  submittedSearch: string; // 실제 API에 넘긴 검색어 (엔터/버튼 시 동기화)
}
```

---

## API Design

### 1. 공지사항 목록 조회

**Endpoint**: `GET /api/notices`

**Query Parameters**:
- `search` (optional, string): 검색 키워드 (제목/본문)
- `limit` (optional, number): 한 페이지 아이템 수 (기본 20, 클라이언트는 10 사용)
- `offset` (optional, number): 건너뛸 개수 (기본 0)

**Response**: `200 OK`
- Body: `{ success: true, data: { items, total, limit, offset } }`
- items[]: NoticeListItem

**Error Handling**:
- 네트워크/5xx: 재시도 또는 안내 메시지
- 401: 기존 api-client 정책 (로그인 리다이렉트 등)

### 2. 공지사항 상세 조회

**Endpoint**: `GET /api/notices/{id}`

**Path Parameters**:
- `id` (required, string): 공지사항 ID

**Response**: `200 OK`
- Body: `{ success: true, data: NoticeDetail }`

**Error Handling**:
- 404/삭제됨: "공지를 찾을 수 없습니다" + 목록으로 돌아가기
- 네트워크 오류: 안내 + 재시도 또는 뒤로가기

---

## Component Design

### Notice List (목록 페이지)

**Location**: `src/components/notice/index.tsx` (목록 컨테이너)

**Props**:
```typescript
interface NoticeListProps {
  className?: string;
}
```

**Features**:
1. **헤더**: `PageHeader` 사용, title="공지사항", subtitle="총 N개의 공지사항", onButtonPress=닫기(이전/프로필)
2. **검색**: 입력 필드, 플레이스홀더 "공지사항 검색", 엔터 또는 버튼으로 검색 실행 → search 파라미터로 목록 재조회 (offset 0)
3. **목록**: 각 항목에 제목, 상대 시간(createdAt → "N일 전"), isPinned이면 "공지" 라벨, 클릭 시 `/notices/[id]` 이동
4. **더보기**: 목록 하단 버튼, `loadedCount < total`일 때만 노출, 클릭 시 offset 증가해 다음 10개 요청 후 기존 items 아래 append
5. **상태**: 로딩(스켈레톤/스피너), 빈 목록("공지사항이 없습니다" / "검색 결과가 없습니다"), 오류 메시지 + 재시도

**State**:
- 서버: React Query (useNotices에서 search, limit, offset 및 누적 items 관리)
- 로컬: 검색 입력값, 제출된 검색어(필요 시)

### Notice Detail (상세 페이지)

**Location**: `src/components/notice/notice-detail.tsx`

**Props**:
```typescript
interface NoticeDetailProps {
  id: string;
  className?: string;
}
```

**Features**:
1. **헤더**: `PageHeader` 사용, title 또는 "공지사항" 고정, onButtonPress=뒤로(목록으로)
2. **본문**: 제목, 게시 일시(createdAt 포맷), content, imageUrl 있으면 이미지 표시
3. **상태**: 로딩, 오류("공지를 찾을 수 없습니다" + 목록으로 돌아가기)

**State**: React Query `useNotice(id)` 로 상세 조회

### Mypage 진입 메뉴

**Location**: `src/components/Mypage/index.tsx`

**변경 사항**:
- 내비게이션 카드에 "공지사항" 메뉴 버튼 추가, **고객 센터 버튼 위**에 배치
- 클릭 시 `router.push('/notices')`

---

## Implementation Strategy

### Phase 1: API Layer

**목표**: 공지사항 API 통신 레이어 구축

**작업 내용**:
1. `src/commons/apis/endpoints.ts`에 `NOTICE_ENDPOINTS` 추가
   - LIST: `/api/notices`
   - DETAIL: (id) => `/api/notices/${id}`
2. `src/commons/apis/notices/types.ts` 작성
   - GetNoticesParams, NoticeListItem, GetNoticesResponseData, NoticeDetail, ApiResponse<T>
3. `src/commons/apis/notices/index.ts` 작성
   - getNotices(params): GET /api/notices, 응답 data 반환
   - getNoticeById(id): GET /api/notices/:id, 응답 data 반환
4. 기존 api-client(Axios) 사용, 에러는 기존 패턴으로 변환

### Phase 2: React Query Hooks

**목표**: 목록(더보기)·상세 조회 훅 (위치: `src/components/notice/hooks/`, apis 하위 아님)

**작업 내용**:
1. `src/components/notice/hooks/useNotices.ts`: `useNotices(search, limit, offset)` 또는 `useNotices(options)` 훅
   - `commons/apis/notices`의 getNotices 호출
   - 첫 요청: limit=10, offset=0
   - 더보기 시: 동일 search로 offset=10, 20, … 요청 후 기존 items와 merge
   - 검색어 변경 시: search 바뀌면 offset 0으로 초기화
   - Query key: ['notices', 'list', search, offset] 또는 ['notices', search] + 클라이언트 누적 리스트
2. `src/components/notice/hooks/useNotice.ts`: `useNotice(id)` 훅
   - getNoticeById(id) 호출, Query key: ['notices', 'detail', id]
   - staleTime/gcTime 적절히 설정 (예: 1분 / 5분)

### Phase 3: UI 구현 (375px, Mock 가능)

**목표**: 목록·상세 화면 UI (공통 헤더, 검색, 더보기)

**작업 내용**:
1. `src/app/(main)/notices/page.tsx`: Notice 목록 컨테이너 렌더
2. `src/app/(main)/notices/[id]/page.tsx`: Notice 상세 컨테이너 렌더 (id from params)
3. `src/components/notice/index.tsx`: 목록 컨테이너
   - PageHeader, 검색 입력, 리스트(공지 라벨, 제목, 상대 시간, 클릭 시 라우팅), 더보기 버튼
   - 로딩/빈 목록/오류 UI
4. `src/components/notice/notice-detail.tsx`: 상세 컨테이너
   - PageHeader, 제목·일시·content·imageUrl
   - 로딩/오류 UI
5. 스타일: CSS Modules (+ Tailwind 디자인 토큰), 375px 고정, 터치 영역 충분히

### Phase 4: 마이페이지 진입 및 데이터 바인딩

**목표**: 진입 경로 확립 및 실제 API 연동

**작업 내용**:
1. `src/components/Mypage/index.tsx`에 공지사항 메뉴 추가 (고객 센터 위), 클릭 시 `/notices` 이동
2. 목록·상세 컴포넌트가 훅을 통해 실제 API 데이터 사용하는지 확인
3. 상대 시간 포맷 유틸 (createdAt → "N일 전") 필요 시 commons/utils 또는 컴포넌트 내 구현

### Phase 5: E2E / UI 테스트

**목표**: 시나리오 및 UI 검증

**작업 내용**:
1. E2E: 마이페이지 → 공지사항 클릭 → 목록 표시, 검색, 더보기, 항목 클릭 → 상세 표시, 닫기
2. UI: 목록/상세 로딩·빈 상태·오류 상태 렌더, 더보기 노출 조건

---

## State Management

### Server State (React Query)

**Query Keys**:
- `['notices', 'list', search?, offset]` 또는 `['notices', search?]` + 클라이언트에서 누적 리스트 관리
- `['notices', 'detail', id]`: 상세

**Cache / 더보기 전략**:
- 목록: 첫 로드 limit=10, offset=0. 더보기 클릭 시 offset=10, 20, … 호출 후 기존 items와 concat하여 한 리스트로 표시 (또는 useInfiniteQuery 활용)
- 검색어 변경 시 쿼리 키에 search 포함해 새로 조회, offset 0부터
- 상세: staleTime 1분, gcTime 5분 수준

### Client State

- 검색 입력값 (제어 컴포넌트)
- (선택) 제출된 검색어로 API와 동기화

---

## Error Handling Strategy

- **목록/검색/더보기 실패**: 화면에 오류 메시지 + 재시도 버튼
- **상세 404/삭제**: "공지를 찾을 수 없습니다" + 목록으로 돌아가기 버튼
- **네트워크 오류**: 공통 메시지 + 재시도 또는 이전 화면

---

## Testing Strategy

### E2E (Playwright) — API 연동 검증 위주

- **인증**: `.env.local` 기반 테스트 계정 사용 (`NEXT_PUBLIC_PHONE_NUMBER` 또는 `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PASSWORD`)
- **목록**: `GET /api/notices` 호출 후 `status 200`, `success`, `data.items`/`data.total` 검증 → 화면에 "총 N개의 공지사항" 또는 빈 상태 문구 반영 확인
- **상세**: 목록 첫 항목 클릭 → `GET /api/notices/:id` 호출 후 `status 200`, `data.title`/`data.content` 검증 → 상세 화면에 제목·본문 표시 확인
- **검색**: 검색어 입력 후 `GET /api/notices?search=` 호출 및 200 응답·결과 반영 확인
- 테스트 파일: `tests/e2e/notice/notice.e2e.spec.ts`

### UI (Playwright)

- 목록: 로딩, 빈 목록, 오류 상태, 공지 라벨·상대 시간 표시
- 상세: 로딩, 오류 상태, 본문·이미지 표시

---

## Dependencies

### Existing

- @tanstack/react-query, axios, next, react
- PageHeader, 공통 레이아웃(375px)

### No New Dependencies

- 공지 API·훅·UI만 추가, 기존 스타일·api-client 재사용

---

## Notes

1. **apis는 연결만**: `src/commons/apis/notices/`에는 API 함수(getNotices, getNoticeById)와 타입만 둠. React Query 훅은 `src/components/notice/hooks/`에 둠.
2. **처음 표시 개수**: 명세 "10~15개" → 구현은 limit 10으로 첫 로드, 더보기로 10개씩 추가. 필요 시 첫 요청만 limit 15로 할 수 있음.
3. **상대 시간**: `createdAt` ISO 문자열을 "N일 전" 등으로 변환하는 유틸은 commons/utils 또는 notice 전용 유틸로 구현.
4. **이미지**: 목록/상세에서 `imageUrl`이 있으면 Next.js Image 또는 img로 표시, 없으면 생략.
5. **접근성**: 버튼·링크에 aria-label, 키보드/스크린 리더로 탐색 가능하도록 마크업.

---

## Next Steps

1. ⏳ Phase 1: API 레이어 (endpoints, types, getNotices, getNoticeById)
2. ⏳ Phase 2: useNotices, useNotice 훅 (components/notice/hooks)
3. ⏳ Phase 3: 목록·상세 UI 및 라우트
4. ⏳ Phase 4: Mypage 공지사항 메뉴 + 데이터 바인딩
5. ⏳ Phase 5: E2E / UI 테스트
6. ⏳ `/speckit.tasks` 실행으로 작업 목록 생성
