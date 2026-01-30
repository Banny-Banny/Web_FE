# 알림 기능 기술 계획서

**Branch**: `feat/MYP-notification` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/011-notification/spec.md`

## Summary

사용자가 알림 모달 또는 알림(소식) 페이지에서 알림 목록을 조회하고, 새 알림/이전 알림으로 구분하여 표시합니다. 새 알림 선택 시 알림 타입·대상 식별자에 따라 해당 화면으로 라우팅하며, 선택 시 읽음 처리되어 이전 알림으로 이동합니다. 이전 알림은 개별 삭제할 수 있습니다.

**주요 목표**:
- 알림 목록 조회 API·훅 구현 (GET /api/me/notifications)
- 알림 읽음 처리 API·뮤테이션 구현 (POST /api/me/notifications/{notificationId}/read)
- 알림 삭제 API·뮤테이션 구현 (POST /api/me/notifications/{notificationId}/delete)
- 알림 타입·대상 식별자 기반 라우팅 맵 구현
- 알림 모달(기존 Notification)에 새 알림/이전 알림 목록·읽음·삭제 연동
- 소식 전용 페이지(/notifications)에 동일 목록·동작 적용
- 마이페이지 "소식" 메뉴 클릭 시 알림 전용 페이지로 이동하도록 변경

**기술적 접근**:
- Next.js App Router, TypeScript
- React Query (목록 조회 쿼리, 읽음/삭제 뮤테이션, 캐시 무효화)
- Axios + `commons/apis/me/notifications` 확장
- CSS Modules + Tailwind(디자인 토큰), 375px 고정
- 모달과 소식 페이지가 동일 쿼리 키로 동일 데이터 소스 사용

---

## Technical Context

**Language/Version**: TypeScript 5, React 19  
**Primary Dependencies**: Next.js 16, Axios, React Query (@tanstack/react-query)  
**Storage**: N/A (서버 상태는 React Query 캐시)  
**Testing**: Playwright (E2E, UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**:
- 알림 목록 최초 로드 3초 이내
- 새 알림 선택 후 화면 전환 2초 이내
- 읽음 처리·삭제 후 화면 반영 2초 이내

**Constraints**:
- API: GET /api/me/notifications (목록), POST /api/me/notifications/{notificationId}/read (읽음), POST /api/me/notifications/{notificationId}/delete (삭제)
- 기존 `getUnreadNotificationCount`·`useUnreadNotificationCount` 유지, 읽음/삭제 시 해당 쿼리 무효화
- 알림 모달과 소식 페이지는 동일 React Query 키로 일관된 목록·읽음·삭제 동작

**Scale/Scope**:
- API 함수 3개 + 타입 정의 (commons/apis/me/notifications 확장)
- React Query: useNotifications(목록), useMarkNotificationRead, useDeleteNotification(뮤테이션)
- 라우팅 맵: 알림 type + targetId → path
- Notification(모달) UI 확장, 소식 페이지 본문 컴포넌트 공유 또는 재사용

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **아키텍처 준수**: Feature Slice, API는 `src/commons/apis/me/notifications/`  
- **디렉토리 구조**: API·훅은 commons/apis/me/notifications, UI는 components/Mypage/components/notification 및 app/(main)/notifications  
- **타입 안전성**: API 요청/응답 TypeScript 인터페이스 정의  
- **API 통신**: 기존 api-client(Axios) 사용  
- **에러 핸들링**: 표준 오류 처리 및 사용자 메시지  
- **성능**: React Query 캐시, 읽음/삭제 시 목록·unread-count 무효화  
- **모바일**: 375px 고정, 터치 영역·접근성 고려  

---

## Project Structure

### Documentation (this feature)

```text
specs/011-notification/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   ├── endpoints.ts                    # ME 알림 목록/읽음/삭제 엔드포인트 추가
│   │   └── me/
│   │       └── notifications/
│   │           ├── index.ts                # getNotifications, markNotificationRead, deleteNotification (+ 기존 getUnreadNotificationCount)
│   │           ├── types.ts                # Notification, 목록 응답 타입
│   │           └── hooks/
│   │               ├── index.ts
│   │               ├── useUnreadNotificationCount.ts   # 기존 유지
│   │               ├── useNotifications.ts             # 목록 조회
│   │               ├── useMarkNotificationRead.ts      # 읽음 뮤테이션
│   │               └── useDeleteNotification.ts        # 삭제 뮤테이션
│   └── utils/
│       └── notification-route.ts          # (선택) type + targetId → path 맵
├── components/
│   └── Mypage/
│       ├── index.tsx                      # 알림 버튼 → 모달, "소식" → router.push('/notifications')
│       └── components/
│           └── notification/
│               ├── index.tsx              # 알림 모달 컨테이너 (새/이전 목록, 읽음·삭제 연동)
│               ├── styles.module.css
│               └── components/            # (선택) NotificationList, NotificationItem
├── app/
│   └── (main)/
│       └── notifications/
│           └── page.tsx                   # 소식 페이지 (동일 목록·동작, 공통 목록 UI 재사용)
└── ...
```

---

## Data Model

### API Response Types (서버 응답 구조 가정)

```typescript
/**
 * 알림 한 건 (목록 항목)
 */
export interface Notification {
  id: string;
  isRead: boolean;
  type: string;           // e.g. 'TIME_CAPSULE_INVITE', 'FRIEND_REQUEST'
  targetId: string | null; // 타임캡슐 id, 친구 요청 id 등 (라우팅에 사용)
  title?: string;
  body?: string;         // 내용 요약
  createdAt: string;     // ISO 8601
  // 서버 필드명이 다를 수 있음: readAt, referenceId 등 → 매핑
}

/**
 * 알림 목록 API 응답 (서버가 unread/read 구분 시)
 */
export interface GetNotificationsResponseDataSeparate {
  unread: Notification[];
  read: Notification[];
}

/**
 * 알림 목록 API 응답 (서버가 단일 배열 + isRead 시)
 */
export interface GetNotificationsResponseDataFlat {
  items: Notification[];
}

export type GetNotificationsResponseData =
  | GetNotificationsResponseDataSeparate
  | GetNotificationsResponseDataFlat;
```

- 클라이언트: 응답이 `unread`/`read`면 그대로 사용, `items`면 `isRead`로 새 알림/이전 알림 분리하여 표시.

### 라우팅 맵 (알림 type → path 패턴)

```typescript
// type + targetId 로 이동할 path 결정
// 예: { type: 'TIME_CAPSULE_INVITE', targetId: 'room-1' } → /waiting-room/room-1
// 예: { type: 'FRIEND_REQUEST', targetId: 'req-1' }     → /friends (또는 친구 요청 탭)
export function getNotificationRoute(type: string, targetId: string | null): string | null;
```

- 실제 type 값과 path 규칙은 백엔드·기존 라우트에 맞춰 정의. 대상 없음/삭제됨이면 `null` 반환 → "콘텐츠를 찾을 수 없습니다" 등 처리.

---

## API Design

### 1. 알림 목록 조회

**Endpoint**: `GET /api/me/notifications`

**Response**: `200 OK`  
- Body: `{ success?: true, data: { unread?, read? } | { items? } }`  
- unread/read 또는 items 배열, 각 항목에 id, isRead, type, targetId, title, body, createdAt 등

**Error Handling**: 401 시 기존 api-client 정책, 5xx/네트워크 시 사용자 메시지·재시도

### 2. 알림 읽음 처리

**Endpoint**: `POST /api/me/notifications/{notificationId}/read`

**Path Parameters**: `notificationId` (string)

**Response**: `200 OK` 또는 `204 No Content`

**Error Handling**: 404/이미 삭제 시 무시 또는 안내, 실패 시 토스트/메시지

### 3. 알림 삭제

**Endpoint**: `POST /api/me/notifications/{notificationId}/delete`

**Path Parameters**: `notificationId` (string)

**Response**: `200 OK` 또는 `204 No Content`

**Error Handling**: 404 시 목록에서 제거·캐시 갱신, 실패 시 사용자 메시지

---

## Component Design

### Notification (알림 모달)

**Location**: `src/components/Mypage/components/notification/index.tsx`

**Props**: 기존 유지 `onClose?: () => void`, `className?: string`

**Features**:
1. **헤더**: 제목 "알림", 닫기 버튼 → onClose
2. **새 알림 영역**: `useNotifications`에서 unread 목록 표시, 항목 클릭 → getNotificationRoute(type, targetId)로 이동 → `useMarkNotificationRead.mutate(notificationId)` → 모달 닫기(또는 유지)
3. **이전 알림 영역**: read 목록 표시, 항목별 삭제 버튼 → `useDeleteNotification.mutate(notificationId)` (로딩/비활성화 처리)
4. **상태**: 로딩(스피너/스켈레톤), 빈 목록("새 알림이 없어요" / "이전 알림이 없어요"), 오류 메시지 + 재시도
5. **읽음/삭제 후**: 쿼리 무효화로 목록·unread-count 갱신

**State**: React Query(useNotifications, useMarkNotificationRead, useDeleteNotification), 로컬 UI 상태만 필요 시 사용

### 소식 페이지

**Location**: `src/app/(main)/notifications/page.tsx`

**Features**:
1. 공통 헤더(PageHeader 또는 기존 패턴) "소식", 닫기/뒤로 → 마이페이지 또는 이전 화면
2. 알림 목록: 모달과 동일한 새 알림/이전 알림 구분, 동일 훅(useNotifications) 및 읽음/삭제 뮤테이션 사용
3. 목록 UI는 Notification 모달 본문과 공통 컴포넌트로 추출하거나, 같은 구조를 페이지에 복용하여 동작 일치

### 마이페이지 진입

**Location**: `src/components/Mypage/index.tsx`

**변경 사항**:
- **알림 버튼(헤더)**: 기존처럼 `setShowNotification(true)` → 모달 표시
- **"소식" 메뉴**: `router.push('/notifications')` 로 변경하여 알림 전용 페이지로 이동

---

## State Management

### Server State (React Query)

**Query Keys**:
- `['me', 'notifications', 'unread-count']`: 기존 유지
- `['me', 'notifications', 'list']`: 알림 목록 (모달·소식 페이지 공통)

**Mutations**:
- markNotificationRead: 성공 시 `queryClient.invalidateQueries({ queryKey: ['me', 'notifications'] })` (목록 + unread-count)
- deleteNotification: 성공 시 동일 무효화

**Stale/GC**: 목록 1분 stale, 5분 gc; unread-count 기존 설정 유지

### Client State

- 모달 열림/닫힘: Mypage `showNotification` (기존)
- 삭제 중인 항목 비활성화: mutation isPending 또는 로컬 Set으로 중복 요청 방지

---

## 라우팅 전략 (알림 → 화면)

- 알림 클릭 시 `getNotificationRoute(notification.type, notification.targetId)` 호출
- 반환 path가 있으면 `router.push(path)`, 없으면 토스트 "콘텐츠를 찾을 수 없습니다" (및 필요 시 읽음 처리)
- type별 path 규칙은 앱 라우트와 백엔드 알림 type 값에 맞춰 `notification-route.ts`(또는 상수 맵)에 정의
- 예시: 타임캡슐 대기실 초대 → `/waiting-room/[capsuleId]`, 친구 요청 → `/friends` 등

---

## Implementation Strategy (개발 워크플로우 반영)

### Phase 1: API Layer

**목표**: 알림 목록·읽음·삭제 API 통신 레이어 구축

**작업**:
1. `endpoints.ts`에 ME 알림 엔드포인트 추가  
   - 목록: `GET /api/me/notifications`  
   - 읽음: `POST /api/me/notifications/:id/read`  
   - 삭제: `POST /api/me/notifications/:id/delete`
2. `commons/apis/me/notifications/types.ts`: Notification, GetNotificationsResponseData 등 정의
3. `commons/apis/me/notifications/index.ts`: getNotifications(), markNotificationRead(id), deleteNotification(id) 구현 (기존 getUnreadNotificationCount 유지)
4. 응답이 `{ data }` 래핑 시 data 기준으로 타입 반환, 에러는 기존 패턴

### Phase 2: React Query Hooks

**목표**: 목록 쿼리·읽음/삭제 뮤테이션 훅

**작업**:
1. `useNotifications.ts`: getNotifications 호출, queryKey `['me', 'notifications', 'list']`, 반환 데이터를 새 알림(unread)/이전 알림(read)으로 분리하여 반환
2. `useMarkNotificationRead.ts`: useMutation, 성공 시 ['me', 'notifications'] 무효화
3. `useDeleteNotification.ts`: useMutation, 성공 시 ['me', 'notifications'] 무효화
4. `useUnreadNotificationCount.ts`: 기존 유지, 무효화 시 자동 재조회

### Phase 3: 라우팅 맵

**목표**: 알림 type + targetId → path 변환

**작업**:
1. `commons/utils/notification-route.ts` (또는 apis/me/notifications 내): getNotificationRoute(type, targetId) 구현
2. 앱 라우트 및 백엔드 알림 type 값에 맞춰 맵/switch 작성 (추후 type 추가 시 확장)

### Phase 4: 알림 모달 UI 연동

**목표**: Notification 모달에 목록·읽음·삭제 반영

**작업**:
1. Notification 컴포넌트에서 useNotifications, useMarkNotificationRead, useDeleteNotification 사용
2. 새 알림/이전 알림 섹션 구분, 항목 클릭 시 라우팅 + 읽음 처리, 이전 알림에 삭제 버튼
3. 로딩·빈 상태·오류 UI, 삭제 중 비활성화
4. 375px, CSS Modules, 디자인 토큰 준수

### Phase 5: 소식 페이지 및 진입 경로

**목표**: 소식 페이지에서 동일 목록·동작, 마이페이지 "소식" → 페이지 이동

**작업**:
1. `app/(main)/notifications/page.tsx`: 알림 목록 컨테이너 렌더 (모달과 동일 훅·동작), 헤더 "소식" 및 닫기/뒤로
2. Mypage에서 "소식" 메뉴 클릭 시 `router.push('/notifications')` 로 변경
3. 모달과 페이지 간 데이터 일관성: 동일 queryKey로 자동 동기화

### Phase 6: E2E / UI 테스트

**목표**: 알림 목록 조회, 새 알림 클릭·라우팅·읽음, 이전 알림 삭제, 소식 페이지 진입 검증

**작업**:
1. E2E: 마이페이지 → 알림 버튼 → 모달 목록 표시, 새 알림 클릭 → 해당 화면 이동, 다시 알림 → 이전 알림으로 이동 확인
2. E2E: 마이페이지 → 소식 → /notifications 목록, 이전 알림 삭제 → 목록에서 제거
3. UI: 로딩·빈 목록·오류 상태, 삭제 버튼 비활성화

---

## Edge Cases (구현 시 처리)

- **알림 대상 없음/삭제됨**: getNotificationRoute가 null 반환 또는 이동 후 404 → "콘텐츠를 찾을 수 없습니다" + 필요 시 읽음 처리
- **읽음/삭제 실패**: 토스트/인라인 메시지, 재시도 또는 무시
- **동시 삭제**: mutation isPending 동안 해당 항목 삭제 버튼 비활성화
- **모달과 페이지 동시 사용**: 동일 쿼리 키로 한쪽에서 읽음/삭제 시 다른 쪽도 무효화로 갱신

---

## Success Criteria (spec 대응)

- SC-1: 목록 조회 — 진입 후 3초 이내 목록 표시, 새/이전 구분
- SC-2: 새 알림 선택·이동 — 2초 이내 해당 화면 이동, 읽음 처리 후 이전 알림으로 이동
- SC-3: 이전 알림 삭제 — 삭제 후 목록에서 제거, 재조회 시에도 반영
- SC-4: 모달과 소식 페이지 동일 규칙, 오류 시 메시지·복구 제공
