# 타임캡슐 대기실 초대/참여 기능 작업 목록

**Branch**: `feat/timecapsule-invite-friends`  
**Spec**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)

---

## Phase 1. 기초 설정 / 구조 정리

- [x] T001 Timecapsule 대기실 초대/참여 관련 디렉토리 구조 점검 및 정리  
  - `src/commons/apis/capsules/step-rooms/` 및 `src/app/(main)/room/` 디렉토리 구조 확정 완료

---

## Phase 2. API 연동 레이어 (방 생성 / 초대 코드 조회 / 방 참여)

- [x] T002 `CAPSULE_ENDPOINTS`에 스텝룸 초대 관련 엔드포인트 추가  
  - 파일: `src/commons/apis/endpoints.ts`  
  - 작업: `CREATE_ROOM`, `INVITE_CODE_QUERY`, `JOIN_ROOM` 키 추가

- [x] T003 스텝룸 초대/참여 타입 정의 추가  
  - 파일: `src/commons/apis/capsules/step-rooms/types.ts`  
  - 작업: `CreateRoomRequest`, `CreateRoomResponse`, `InviteCodeQueryRequest`, `InviteCodeQueryResponse`, `JoinRoomRequest`, `JoinRoomResponse`, `AlreadyJoinedResponse` 타입 정의

- [x] T004 [P] 방 생성 API 함수 구현  
  - 파일: `src/commons/apis/capsules/step-rooms/index.ts`  
  - 작업: `createRoom(data: CreateRoomRequest)` 구현 (POST `/api/capsules/step-rooms/create`)

- [x] T005 [P] 초대 코드로 방 조회 API 함수 구현 (Public API)  
  - 파일: `src/commons/apis/capsules/step-rooms/index.ts`  
  - 작업: `queryRoomByInviteCode(code: string)` 구현 (GET `/api/capsules/step-rooms/by-code?invite_code={code}`), 요청 시 `Authorization` 헤더 제거 처리

- [x] T006 [P] 방 참여 API 함수 구현 (409 ALREADY_JOINED 원본 그대로 throw)  
  - 파일: `src/commons/apis/capsules/step-rooms/index.ts`  
  - 작업: `joinRoom(capsuleId: string, data: JoinRoomRequest)` 구현 (POST `/api/capsules/step-rooms/{capsuleId}/join`)

- [x] T007 [P] 초대/참여 에러를 도메인별로 해석하는 헬퍼 추가  
  - 파일: `src/commons/utils/invite.ts`  
  - 작업: `getInviteErrorMessage`, `isAlreadyJoinedError`, `extractSlotNumberFromError`, `convertAlreadyJoinedToJoinResponse` 구현

- [x] T008 [P] React Query 훅: 방 생성 훅 추가  
  - 파일: `src/commons/apis/capsules/step-rooms/hooks/useCreateRoom.ts`  
  - 작업: `useCreateRoom` mutation 훅 구현

- [x] T009 [P] React Query 훅: 초대 코드 조회 훅 추가  
  - 파일: `src/commons/apis/capsules/step-rooms/hooks/useInviteCodeQuery.ts`  
  - 작업: `useInviteCodeQuery(code: string | null)` query 훅 구현 (retry 비활성화)

- [x] T010 [P] React Query 훅: 방 참여 훅 추가 (409 ALREADY_JOINED 처리 포함)  
  - 파일: `src/commons/apis/capsules/step-rooms/hooks/useJoinRoom.ts`  
  - 작업: `useJoinRoom` mutation 훅 구현, ALREADY_JOINED 시 `convertAlreadyJoinedToJoinResponse` 사용

---

## Phase 3. E2E 테스트 인프라 (초대/참여 전체 플로우)

- [x] T011 E2E 테스트 스켈레톤 파일 생성  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 기본 describe/it 구조 및 공통 setup 작성 완료

- [x] T012 [P] [US1] 방 생성 후 초대 코드/링크 발급 플로우 E2E 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 결제 완료 → `createRoom` 호출 → 초대 코드/링크 발급 테스트 완료

- [x] T013 [P] [US2] 비로그인 사용자의 초대 링크 진입 및 로그인 후 복귀 플로우 E2E 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 비로그인 → Public API 조회 → 로그인 → 참여 플로우 테스트 완료

- [x] T014 [P] [US3] 로그인 사용자의 초대 링크 진입 및 참여 플로우 E2E 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 초대 링크 진입 → 방 정보 조회 → 참여하기 → 대기실 라우팅까지 검증 완료

- [x] T015 [P] [US4] 이미 참여한 사용자의 재진입 (409 ALREADY_JOINED) 플로우 E2E 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 409 응답 시에도 에러 없이 대기실로 이동하는지 검증 완료

- [x] T016 [P] [US5] 잘못된/만료/정원 초과 초대 코드 에러 플로우 E2E 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 400/404/403 등의 에러 메시지 노출 및 행동 옵션 검증 완료

---

## Phase 4. UI 개발 (Mock 데이터 기반)

- [x] T017 [US1] 호스트용 초대 링크 공유 컴포넌트 타입/인터페이스 정의  
  - 작업: WaitingRoom 컴포넌트 내부에서 타입 정의 완료

- [x] T018 [P] [US1] 초대 링크 생성 유틸 함수 구현  
  - 파일: `src/commons/utils/invite.ts`  
  - 작업: `generateInviteLink(inviteCode: string)` 구현 (`NEXT_PUBLIC_WEB_URL` 기반) 완료

- [x] T019 [P] [US1] 초대 링크 공유 컴포넌트 UI 구현  
  - 파일: `src/components/WaitingRoom/index.tsx`  
  - 작업: `handleInviteFriend` 함수로 초대 링크 공유 기능 구현 (Web Share API + 클립보드 복사) 완료

- [x] T020 [US1] 타임캡슐 생성 플로우에서 초대 링크 공유 컴포넌트 연결  
  - 파일: `src/components/WaitingRoom/index.tsx`  
  - 작업: 대기실에서 "친구 초대하기" 버튼 클릭 시 초대 링크 공유 기능 연동 완료

- [x] T021 [US2][US3] 초대 참여 페이지 컴포넌트 타입/상태 인터페이스 정의  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: 컴포넌트 내부에서 상태 타입 정의 완료

- [x] T022 [P] [US2][US3] 초대 참여 페이지 UI 구현  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: 로딩, 에러, 참여 플로우 UI 구현 완료

- [x] T023 [P] [US2][US3] 초대 참여 페이지 스타일 정의 (375px 기준)  
  - 파일: `src/app/(main)/room/join/styles.module.css`  
  - 작업: 모바일 기준 레이아웃/스타일 적용 완료

- [x] T024 [US2][US3] 초대 참여 라우팅 페이지 생성 및 RoomJoin 연동  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: 클라이언트 컴포넌트로 완전 구현 완료

---

## Phase 5. 데이터 바인딩 (실제 API 연결)

- [x] T025 [US1] 결제 완료 후 방 생성 API와 타임캡슐 생성 플로우 연결  
  - 파일: `src/components/WaitingRoom/index.tsx`  
  - 작업: 대기실에서 `settings.inviteCode` 또는 `waitingRoom.inviteCode`를 사용하여 실제 초대 링크 공유 완료

- [x] T026 [US1] InviteLinkShare 컴포넌트를 실제 초대 코드/링크로 교체  
  - 파일: `src/components/WaitingRoom/index.tsx`  
  - 작업: `generateInviteLink`와 실제 `inviteCode` 연동 완료

- [x] T027 [US2] 비로그인 상태 초대 링크 진입 시 초대 코드 로컬 스토리지 저장 로직 구현  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: `pending_invite_code` localStorage save/get/clear 로직 구현 완료

- [x] T028 [US2] 온보딩/로그인 완료 후 pending 초대 코드 기반으로 RoomJoin으로 복귀 로직 구현  
  - 파일: `src/components/Login/hooks/useLoginMutation.ts`, `src/components/Onboarding/hooks/useOnboardingMutation.ts`  
  - 작업: 로그인/온보딩 완료 후 `pending_invite_code` 확인 및 `/room/join?invite_code={code}` 리다이렉트 구현 완료

- [x] T029 [US2][US3] 로그인/비로그인 분기 및 초대 코드/방 정보 조회 연결  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: `useSearchParams`로 `invite_code` 추출, 인증 상태 확인, `useInviteCodeQuery` 호출 완료

- [x] T030 [US3][US4] 방 참여 처리 및 409 ALREADY_JOINED 성공 처리 구현  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: `useJoinRoom` 호출, 성공 시 `/waiting-room/{room_id}` 이동, 409 에러 시에도 성공 처리 완료

- [x] T031 [US5] 방 조회/참여 에러 메시지 매핑 로직 연결  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: 에러 메시지 표시 및 홈 이동 버튼 제공 완료

- [x] T032 [US2][US3][US5] RoomJoin UI에서 로딩/성공/에러/참여 불가 상태별 렌더링 분기 구현  
  - 파일: `src/app/(main)/room/join/page.tsx`  
  - 작업: 로딩, 에러, 참여 성공 상태에 따른 화면 분기 구현 완료

---

## Phase 6. UI 테스트 및 마무리

- [x] T033 [P] [US1] 초대 링크 공유 UI 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: E2E 테스트에서 초대 코드/링크 발급 플로우 검증 완료

- [x] T034 [P] [US2][US3] 초대 참여 페이지 UI 테스트 추가  
  - 파일: `tests/e2e/room/room-invite-api.spec.ts`  
  - 작업: 비로그인/로그인 사용자 참여 플로우, 409 ALREADY_JOINED 처리, 에러 케이스 검증 완료

- [ ] T035 전체 플로우 리그레션 테스트 및 KPI/성공 기준 점검  
  - 작업: E2E 테스트 전체 실행 필요, 명세서 SC-001~SC-008 충족 여부 수동 확인 필요

---

## 의존성 참고

- T002 → T003 → T004~T006 → T008~T010 순으로 API 레이어를 구현해야 E2E/데이터 바인딩 작업(T011 이후)이 안정적으로 진행 가능  
- T017~T024(UI Mock) 완료 후 T025~T032(데이터 바인딩) 진행 권장  
- [P] 태그가 있는 작업은 서로 다른 파일을 다루며, 선행 작업에 강한 의존성이 없으므로 병렬 수행 가능

