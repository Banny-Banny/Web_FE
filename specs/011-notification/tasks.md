# 작업 목록: 알림

## 개요

이 문서는 "알림(소식)" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/011-notification/spec.md`
- 기술 계획: `specs/011-notification/plan.md`

**총 작업 수**: 20개  
**예상 소요 기간**: 1~2일  

**워크플로우 (순서 고정)**:
1. **API 연동** → 2. **React Query 훅** → 3. **라우팅 맵** → 4. **알림 모달 UI** → 5. **소식 페이지·진입 경로** → 6. **E2E·UI 테스트**

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 (spec.md 시나리오) | 작업 수 |
|-----------|-------------------------|---------|
| US1 | 알림 목록 조회 (모달·소식 페이지, 새/이전 구분, 빈 상태·로딩·오류) | 4개 |
| US2 | 새 알림 선택 후 해당 화면으로 이동 (라우팅 + 읽음 처리) | 2개 |
| US3 | 이전 알림 삭제 | 1개 |
| 공통 | API·훅·라우팅·진입·테스트 | 13개 |

---

## Phase 1: API 연동

**목표**: `commons/apis/me/notifications`에 알림 목록·읽음·삭제 API 연결 (엔드포인트·타입·호출 함수). 기존 getUnreadNotificationCount 유지.

- [x] T001 `src/commons/apis/endpoints.ts`에 ME 알림 엔드포인트 추가
  - 목록: `GET /api/me/notifications`
  - 읽음: `POST /api/me/notifications/:id/read`
  - 삭제: `POST /api/me/notifications/:id/delete`
  - AUTH_ENDPOINTS 또는 ME 전용 상수에 추가

- [x] T002 [P] `src/commons/apis/me/notifications/types.ts` 생성
  - Notification (id, isRead, type, targetId, title?, body?, createdAt)
  - GetNotificationsResponseDataSeparate (unread, read)
  - GetNotificationsResponseDataFlat (items)
  - GetNotificationsResponseData 유니온 타입
  - 서버 응답 래핑 시 data 기준 타입 반영

- [x] T003 `src/commons/apis/me/notifications/index.ts` 수정
  - getNotifications(): GET /api/me/notifications, 응답 data 반환
  - markNotificationRead(notificationId: string): POST /api/me/notifications/:id/read
  - deleteNotification(notificationId: string): POST /api/me/notifications/:id/delete
  - 기존 getUnreadNotificationCount 유지, api-client(Axios) 및 기존 에러 패턴 사용

---

## Phase 2: React Query 훅

**목표**: 목록 조회 쿼리·읽음/삭제 뮤테이션 훅 구현. 성공 시 ['me', 'notifications'] 무효화로 목록·unread-count 갱신.

- [x] T004 [P] `src/commons/apis/me/notifications/hooks/useNotifications.ts` 생성
  - getNotifications 호출, queryKey: ['me', 'notifications', 'list']
  - 반환 데이터를 새 알림(unread)·이전 알림(read)으로 분리하여 반환 (서버가 unread/read 구분 시 그대로, items+isRead 시 클라이언트 분리)
  - staleTime 1분, gcTime 5분

- [x] T005 [P] `src/commons/apis/me/notifications/hooks/useMarkNotificationRead.ts` 생성
  - useMutation(markNotificationRead), 성공 시 queryClient.invalidateQueries({ queryKey: ['me', 'notifications'] })

- [x] T006 [P] `src/commons/apis/me/notifications/hooks/useDeleteNotification.ts` 생성
  - useMutation(deleteNotification), 성공 시 queryClient.invalidateQueries({ queryKey: ['me', 'notifications'] })

- [x] T007 `src/commons/apis/me/notifications/hooks/index.ts` 수정
  - useUnreadNotificationCount, useNotifications, useMarkNotificationRead, useDeleteNotification 익스포트

---

## Phase 3: 라우팅 맵

**목표**: 알림 type + targetId → 이동 path 변환. 앱 라우트·백엔드 type 값에 맞춰 확장 가능하게 정의.

- [x] T008 `src/commons/utils/notification-route.ts` 생성
  - getNotificationRoute(type: string, targetId: string | null): string | null
  - type별 path 규칙 (예: 타임캡슐 대기실 초대 → /waiting-room/[capsuleId], 친구 요청 → /friends 등)
  - 대상 없음/미지원 type 시 null 반환

---

## Phase 4: 알림 모달 UI 연동

**목표**: Notification 모달에 useNotifications·useMarkNotificationRead·useDeleteNotification 연동, 새 알림/이전 알림 구분·클릭 라우팅·삭제.

- [x] T009 [US1] `src/components/Mypage/components/notification/index.tsx` 수정 — 목록 연동
  - useNotifications 사용, 새 알림(unread)·이전 알림(read) 섹션 구분 표시
  - 각 항목에 id, type, targetId, title, body, createdAt 등 표시 (요약 정보)
  - 로딩 상태(스피너/스켈레톤), 빈 상태("새 알림이 없어요" / "이전 알림이 없어요"), 오류 메시지 + 재시도
  - 375px, CSS Modules, 디자인 토큰 준수

- [x] T010 [US2] `src/components/Mypage/components/notification/index.tsx` 수정 — 새 알림 클릭 시 라우팅·읽음
  - 새 알림 항목 클릭 시 getNotificationRoute(type, targetId) 호출
  - path가 있으면 router.push(path), useMarkNotificationRead.mutate(notificationId) 호출
  - path가 없으면 토스트 "콘텐츠를 찾을 수 없습니다" (필요 시 읽음 처리)
  - 모달 닫기 여부는 UX에 따라 선택 (명세: 해당 화면으로 이동)

- [x] T011 [US3] `src/components/Mypage/components/notification/index.tsx` 수정 — 이전 알림 삭제
  - 이전 알림 항목에 삭제 버튼/액션 추가
  - useDeleteNotification.mutate(notificationId), 삭제 중 해당 항목 비활성화 또는 로딩 표시
  - 삭제 성공 시 토스트 등 피드백 선택 사항

- [x] T012 [P] [US1] `src/components/Mypage/components/notification/styles.module.css` 수정
  - 새 알림/이전 알림 섹션, 목록 항목, 삭제 버튼, 로딩·빈·오류 상태 스타일
  - 375px 고정, 터치 영역·간격, 디자인 토큰 사용

---

## Phase 5: 소식 페이지 및 진입 경로

**목표**: 소식 전용 페이지에서 동일 목록·동작, 마이페이지 "소식" 메뉴 클릭 시 /notifications 이동.

- [x] T013 [US1] `src/app/(main)/notifications/page.tsx` 수정
  - 알림 목록 컨테이너 렌더 (useNotifications, useMarkNotificationRead, useDeleteNotification 사용 — 모달과 동일 훅·동작)
  - 헤더 "소식", 닫기/뒤로 → 마이페이지 또는 이전 화면
  - 새 알림/이전 알림 구분, 클릭 시 라우팅+읽음, 이전 알림 삭제 (모달과 동일 규칙)
  - 공통 목록 UI는 Notification 내부 컴포넌트 추출 후 재사용하거나, 동일 구조로 페이지에 구현

- [x] T014 `src/components/Mypage/index.tsx` 수정
  - "소식" 메뉴 버튼 클릭 시 setShowNotification(true) 대신 router.push('/notifications') 로 변경
  - 헤더 알림 버튼은 기존대로 setShowNotification(true) 유지 (모달 표시)

---

## Phase 6: E2E·UI 테스트

**목표**: 알림 목록 조회, 새 알림 클릭·라우팅·읽음, 이전 알림 삭제, 소식 페이지 진입 시나리오 검증.

- [ ] T015 `tests/e2e/notification/notification.e2e.spec.ts` 작성 및 실행
  - 마이페이지 → 알림 버튼 → 모달 열림, 새 알림/이전 알림 목록 표시
  - 새 알림 항목 클릭 → 해당 화면 이동, 다시 알림 열면 해당 항목이 이전 알림으로 이동했는지 확인
  - 이전 알림 삭제 버튼 클릭 → 목록에서 제거

- [ ] T016 `tests/e2e/notification/notification.e2e.spec.ts` 또는 별도 스펙에 소식 페이지 시나리오 추가
  - 마이페이지 → "소식" 메뉴 → /notifications 페이지 진입, 목록 표시
  - 이전 알림 삭제 → 목록에서 제거, 새 알림 클릭 → 라우팅·읽음 반영

- [ ] T017 [P] `tests/ui/notification/notification.ui.spec.ts` 작성 (선택)
  - 알림 목록: 로딩, 빈 목록(새/이전), 오류 상태
  - 이전 알림 삭제 버튼 비활성화(삭제 중) 등

---

## 의존성 순서

1. **Phase 1** (API 연동): T001 → T002, T003
2. **Phase 2** (훅): T002,T003 완료 후 T004,T005,T006 → T007
3. **Phase 3** (라우팅 맵): T008 (T004 이후 가능, 모달/페이지에서 사용)
4. **Phase 4** (모달 UI): T004,T005,T006,T008 완료 후 T009 → T010 → T011, T012는 T009와 병렬 가능
5. **Phase 5** (소식 페이지·진입): T009~T012 완료 후 T013, T014
6. **Phase 6** (테스트): T013,T014 완료 후 T015 → T016, T017

---

## 병렬 실행 예시

- **Phase 1**: T002는 T001 완료 후 [P] 가능
- **Phase 2**: T004, T005, T006는 T003 완료 후 서로 [P] 가능
- **Phase 4**: T012는 T009와 [P] 가능 (다른 파일: styles vs index 로직)

---

## 구현 전략 요약 (순서 고정)

| 순서 | 단계 | 내용 |
|------|------|------|
| 1 | **API 연동** | endpoints·types·getNotifications·markNotificationRead·deleteNotification만. 훅/UI 없음. |
| 2 | **React Query 훅** | useNotifications, useMarkNotificationRead, useDeleteNotification, hooks/index 익스포트. |
| 3 | **라우팅 맵** | getNotificationRoute(type, targetId) 구현. |
| 4 | **알림 모달 UI** | Notification에 목록·읽음·삭제 연동, 새/이전 구분, 로딩·빈·오류. |
| 5 | **소식 페이지·진입** | /notifications 페이지 목록·동작, Mypage "소식" → router.push('/notifications'). |
| 6 | **E2E·UI 테스트** | 모달·소식 페이지 시나리오 및 UI 상태 검증. |

---

## MVP 범위 제안

- **MVP**: US1(알림 목록 조회 — 모달·소식 페이지) + US2(새 알림 클릭 → 라우팅·읽음) + US3(이전 알림 삭제) 까지 Phase 5 완료.
- **선택**: Phase 6 E2E·UI 테스트(T015~T017)는 배포 전 검증용으로 수행.
