# Tasks: 타임캡슐 대기실 진입 및 참여

**Input**: Design documents from `/specs/007-timecapsule-waiting-room/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: E2E 테스트와 UI 테스트 포함 (Playwright)

**Organization**: TimeEgg 워크플로우 기반 - API 연결 → E2E 테스트 → UI 구현 → 데이터 바인딩 → UI 테스트

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 처리 가능 (다른 파일, 의존성 없음)
- **[Story]**: 사용자 스토리 라벨 (US1, US2)
- 모든 작업에 정확한 파일 경로 포함

---

## Phase 1: 프로젝트 설정

**목적**: 타임캡슐 대기실 진입 기능 구현을 위한 기본 설정

- [x] T001 [P] 대기실 페이지 디렉토리 구조 생성 (`src/components/WaitingRoom/`, `src/app/(main)/waiting-room/[capsuleId]/`, `src/commons/apis/capsules/step-rooms/`)

**Checkpoint**: 프로젝트 설정 완료 - API 연결 단계로 진행 가능

---

## Phase 2: API 연결 레이어

**목적**: 대기실 조회 API 구현

**⚠️ CRITICAL**: 이 단계가 완료되어야 UI 구현 및 데이터 바인딩이 가능합니다

### API 엔드포인트 및 타입 정의

- [x] T002 `src/commons/apis/endpoints.ts` 수정 - `CAPSULE_ENDPOINTS.WAITING_ROOM_SETTINGS(capsuleId)` 엔드포인트 추가 (`/api/capsules/step-rooms/{capsuleId}/settings`)
- [x] T003 `src/commons/apis/endpoints.ts` 수정 - `CAPSULE_ENDPOINTS.WAITING_ROOM_DETAIL(capsuleId)` 엔드포인트 추가 (`/api/capsules/step-rooms/{capsuleId}`)
- [x] T004 `src/commons/apis/capsules/step-rooms/types.ts` 생성 - `WaitingRoomSettingsResponse` (capsuleName, maxHeadcount, openDate, theme, design), `WaitingRoomDetailResponse` (waitingRoomId, orderId, capsuleName, currentHeadcount, maxHeadcount, openDate, theme, design, createdAt, status, participants), `Participant` (participantId, userId, userName, userAvatarUrl, slotNumber, joinedAt, role) 타입 정의

### API 함수 구현

- [x] T005 `src/commons/apis/capsules/step-rooms/index.ts` 생성 - `getWaitingRoomSettings` 함수 구현 (대기실 설정값 조회 API 호출, JWT Bearer 토큰 포함, 에러 처리: 404 STEP_ROOM_NOT_FOUND, 401 UNAUTHORIZED, 403 FORBIDDEN)
- [x] T006 `src/commons/apis/capsules/step-rooms/index.ts` 수정 - `getWaitingRoomDetail` 함수 추가 (대기실 상세 정보 조회 API 호출, JWT Bearer 토큰 포함, 에러 처리: 404 STEP_ROOM_NOT_FOUND, 401 UNAUTHORIZED, 403 FORBIDDEN)

### React Query 훅 구현

- [x] T007 `src/commons/apis/capsules/step-rooms/hooks/useWaitingRoom.ts` 생성 - 대기실 상세 조회 React Query query 훅 구현 (queryKey: ['waitingRoom', capsuleId], staleTime: 30000, refetchInterval: 5000)
- [x] T008 `src/commons/apis/capsules/step-rooms/hooks/useWaitingRoomSettings.ts` 생성 - 대기실 설정값 조회 React Query query 훅 구현 (queryKey: ['waitingRoomSettings', capsuleId], staleTime: 60000)
- [x] T009 `src/commons/apis/capsules/step-rooms/hooks/useParticipants.ts` 생성 - 참여자 목록 조회 훅 구현 (useWaitingRoom 훅을 사용하여 participants, currentHeadcount, maxHeadcount 반환)
- [x] T010 `src/commons/apis/capsules/step-rooms/hooks/index.ts` 생성 - hooks export 파일 생성

### 유틸리티 함수

- [x] T011 [P] `src/commons/utils/waiting-room.ts` 생성 - 대기실 관련 유틸리티 함수 (`getWaitingRoomStatusText` - 대기실 상태를 사용자 친화적인 텍스트로 변환: WAITING→'대기 중', IN_PROGRESS→'진행 중', COMPLETED→'완료됨`, `formatOpenDate` - 날짜를 사용자 친화적인 형식으로 포맷팅: "2026년 1월 27일", `getParticipantRoleText` - 참여자 역할을 사용자 친화적인 텍스트로 변환: HOST→'방장', PARTICIPANT→'참여자')

**Checkpoint**: API 연결 레이어 완료 - E2E 테스트 및 UI 구현 시작 가능

---

## Phase 3: E2E 테스트 작성 (Playwright)

**목적**: 전체 대기실 진입 및 정보 조회 플로우 검증을 위한 E2E 테스트 작성

- [x] T012 `tests/e2e/waiting-room/waiting-room.spec.ts` 생성 - 대기실 진입 및 정보 조회 E2E 테스트 (대기실 진입 플로우, 대기실 상세 정보 조회, 대기실 설정값 조회, 참여자 목록 조회, 오류 처리: 대기실 조회 실패, 설정값 조회 실패, 네트워크 오류, 권한 없는 사용자 접근)
- [x] T013 [P] `tests/e2e/waiting-room/fixtures/mockData.ts` 생성 - 대기실 진입 및 정보 조회 테스트용 Mock 데이터 추가 (대기실 상세 정보 응답, 대기실 설정값 응답, 참여자 목록, 오류 응답 등)

**Checkpoint**: E2E 테스트 작성 완료 - UI 구현 시작 가능

---

## Phase 4: UI 구현 (Mock 데이터 기반)

**목적**: 375px 고정 레이아웃 기준 Mock 데이터 기반 UI 컴포넌트 구현

**⚠️ Figma MCP 연결 필수**: 모든 UI 컴포넌트 구현 전에 Figma 디자인 정보를 MCP를 통해 가져와야 함

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=407-1828&t=qSVsqDsyM3lEU153-4

### Phase 4.0: Figma 디자인 정보 수집 (필수)

**목적**: Figma MCP를 통해 대기실 페이지 디자인 정보를 가져와 구현 가이드 확보

**⚠️ 이 단계가 완료되어야 Phase 4.1 UI 구현을 시작할 수 있습니다**

- [x] T014 Figma MCP 연결 및 대기실 페이지 디자인 정보 확인 - Figma 노드 ID `407-1828`에서 대기실 페이지 디자인 노드 정보 수집 (`mcp_Figma_Desktop_get_design_context` 사용)
- [x] T015 Figma MCP 연결 및 대기실 정보 표시 디자인 정보 확인 - 대기실 정보 표시 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `407-1828` 내부의 대기실 정보 섹션)
- [x] T016 Figma MCP 연결 및 참여자 목록 디자인 정보 확인 - 참여자 목록 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `407-1828` 내부의 참여자 목록 섹션)
- [x] T017 디자인 토큰 추출 (색상, 간격, 타이포그래피 등) - Figma MCP를 통해 대기실 페이지 관련 디자인 토큰 추출 (`mcp_Figma_Desktop_get_variable_defs` 사용), 기존 디자인 토큰 시스템(`src/commons/styles`)과 매핑
- [x] T018 `tailwind.config.js` 디자인 토큰 변수 확인 및 필요 시 업데이트 - Figma에서 추출한 디자인 토큰을 `src/commons/styles`에 선언된 변수로 import하여 사용, 중복 선언 금지

**Checkpoint**: Figma 디자인 정보 수집 완료 - UI 컴포넌트 구현 시작 가능

---

### Phase 4.1: US1 - 방장이 결제 완료 후 대기실에 진입 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 결제를 완료한 후 대기실 페이지에 진입하고 캡슐 설정 정보를 확인하는 기능

**Independent Test**: 대기실 페이지 접근 → 대기실 ID 파라미터 추출 확인 → 대기실 상세 정보 조회 확인 → 대기실 설정값 조회 확인 → 대기실 정보 표시 확인

#### 타입 및 Mock 데이터

- [x] T019 [US1] `src/components/WaitingRoom/types.ts` 생성 - 대기실 페이지 컴포넌트 타입 정의 (`WaitingRoomPageProps`, `WaitingRoomState`, `WaitingRoomInfoProps`, `ParticipantListProps` 등)
- [x] T020 [P] [US1] `src/components/WaitingRoom/mocks/data.ts` 생성 - Mock 대기실 상세 정보 데이터 및 설정값 데이터

#### UI 컴포넌트 구현 (Figma MCP 기반)

**⚠️ Figma 디자인 정보 수집(Phase 4.0) 완료 후 진행해야 합니다**

- [x] T021 [P] [US1] `src/components/WaitingRoom/components/WaitingRoomInfo/index.tsx` 수정 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 대기실 정보 표시 컴포넌트 구현 (Mock 데이터 사용, 캡슐명, 참여 인원수, 오픈 예정일, 캡슐 테마/디자인, 대기실 상태 표시, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T022 [P] [US1] `src/components/WaitingRoom/components/WaitingRoomInfo/types.ts` 확인/수정 - WaitingRoomInfo 컴포넌트 타입 정의 (Figma 디자인 기반으로 필요 시 수정)
- [x] T023 [P] [US1] `src/components/WaitingRoom/components/WaitingRoomInfo/styles.module.css` 수정 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 WaitingRoomInfo 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용, pixel-perfect 수준으로 Figma 디자인과 일치)

#### 컨테이너 컴포넌트 구현

- [x] T024 [US1] `src/components/WaitingRoom/hooks/useWaitingRoom.ts` 생성 - 대기실 정보 조회 훅 (Mock 데이터 반환, 로딩/에러 상태 관리)
- [x] T025 [US1] `src/components/WaitingRoom/index.tsx` 수정 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 대기실 페이지 컨테이너 컴포넌트 구현 (Mock 데이터 사용, TimeCapsuleHeader, 로딩 상태 표시, 에러 메시지 표시, WaitingRoomInfo 컴포넌트 렌더링, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T026 [US1] `src/components/WaitingRoom/styles.module.css` 수정 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 WaitingRoom 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)

#### 라우팅 통합

- [x] T027 [US1] `src/app/(main)/waiting-room/[capsuleId]/page.tsx` 생성 - 대기실 페이지 라우팅 (WaitingRoom 컴포넌트 렌더링, URL 파라미터에서 capsuleId 추출)

**Checkpoint**: US1 UI 구현 완료 - 사용자 승인 단계 또는 US2 구현 시작 가능

---

### Phase 4.2: US2 - 방장이 대기실에서 참여자 목록을 확인 (Priority: P2)

**Goal**: 방장이 대기실 페이지에서 현재 참여한 참여자들의 목록을 확인하는 기능

**Independent Test**: 대기실 페이지 접근 → 참여자 목록 섹션 확인 → 참여 인원수 확인 → 각 참여자 정보 확인 → 참여자 목록 업데이트 확인

#### 타입 및 Mock 데이터

- [x] T028 [US2] `src/components/WaitingRoom/components/ParticipantList/types.ts` 생성 - ParticipantList 컴포넌트 타입 정의
- [x] T029 [P] [US2] `src/components/WaitingRoom/mocks/data.ts` 수정 - Mock 참여자 목록 데이터 추가

#### UI 컴포넌트 구현 (Figma MCP 기반)

**⚠️ Figma 디자인 정보 수집(Phase 4.0) 완료 후 진행해야 합니다**

- [x] T030 [P] [US2] `src/components/WaitingRoom/components/ParticipantList/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 참여자 목록 컴포넌트 구현 (Mock 데이터 사용, 참여 인원수 표시, 각 참여자 정보 표시, 빈 상태 안내, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T031 [P] [US2] `src/components/WaitingRoom/components/ParticipantList/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 ParticipantList 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용, pixel-perfect 수준으로 Figma 디자인과 일치)

#### 컨테이너 컴포넌트 통합

- [x] T032 [US2] `src/components/WaitingRoom/index.tsx` 수정 - ParticipantList 컴포넌트 추가 (Mock 데이터 전달)

**Checkpoint**: US2 UI 구현 완료 - 사용자 승인 단계 또는 데이터 바인딩 시작 가능

---

## Phase 5: 사용자 승인 단계

**목적**: UI/UX 최종 검증 및 피드백 수집

- [ ] T033 스테이징 환경 배포 (375px 모바일 프레임)
- [ ] T034 사용자 테스트 및 피드백 수집
- [ ] T035 UI/UX 개선사항 반영

**Checkpoint**: 사용자 승인 완료 - 데이터 바인딩 시작 가능

---

## Phase 6: 데이터 바인딩

**목적**: 실제 API와 UI 연결, 대기실 정보 조회 플로우 완성

### US1 데이터 바인딩

- [ ] T036 [US1] `src/components/WaitingRoom/hooks/useWaitingRoom.ts` 수정 - 실제 API 연결 (useWaitingRoomQuery, useWaitingRoomSettingsQuery 사용, URL 파라미터에서 capsuleId 추출, 로딩/에러 상태 처리, 재시도 로직)
- [ ] T037 [US1] `src/components/WaitingRoom/index.tsx` 수정 - Mock 데이터를 실제 API 호출로 교체 (useWaitingRoom 훅 사용, React Query 훅과 UI 컴포넌트 연결)

### US2 데이터 바인딩

- [ ] T038 [US2] `src/components/WaitingRoom/index.tsx` 수정 - 참여자 목록 실제 API 연결 (useParticipants 훅 사용, 참여자 목록 자동 갱신 설정)

**Checkpoint**: 데이터 바인딩 완료 - UI 테스트 시작 가능

---

## Phase 7: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

- [ ] T039 `tests/e2e/waiting-room/waiting-room-ui.spec.ts` 생성 - 대기실 페이지 UI 테스트 (대기실 페이지 렌더링 테스트, 대기실 정보 표시 테스트, 참여자 목록 표시 테스트, 로딩 상태 표시 테스트, 에러 메시지 표시 테스트, 375px 모바일 프레임 기준 테스트, 성능 및 접근성 검증)

**Checkpoint**: UI 테스트 완료 - 프로덕션 준비 완료

---

## 작업 요약

**총 작업 수**: 39개

**사용자 스토리별 작업 수**:
- **US1 (P1)**: 9개 작업 (T019-T027)
- **US2 (P2)**: 5개 작업 (T028-T032)

**병렬 처리 가능 작업**: 15개

**MVP 범위**: US1만 구현 (T019-T027)

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=407-1828&t=qSVsqDsyM3lEU153-4

**Figma 노드 ID**: `407-1828` (대기실 페이지 메인 노드)

---

## 의존성 및 실행 순서

### 필수 순서
1. **Phase 1** (프로젝트 설정) → **Phase 2** (API 연결)
2. **Phase 2** (API 연결) → **Phase 3** (E2E 테스트) 또는 **Phase 4** (UI 구현)
3. **Phase 4.0** (Figma 디자인 정보 수집) → **Phase 4.1** (US1 UI 구현) ⚠️ 필수
4. **Phase 4.1** (US1 UI 구현) → **Phase 4.2** (US2 UI 구현) 또는 **Phase 5** (사용자 승인)
5. **Phase 5** (사용자 승인) → **Phase 6** (데이터 바인딩)
6. **Phase 6** (데이터 바인딩) → **Phase 7** (UI 테스트)

**⚠️ 중요**: Phase 4.0 (Figma 디자인 정보 수집)이 완료되어야 Phase 4.1 및 Phase 4.2의 UI 컴포넌트 구현을 시작할 수 있습니다.

### 병렬 처리 가능
- **Phase 2 내부**: T002-T003 (엔드포인트 추가), T011 (유틸리티 함수)
- **Phase 4.1 내부**: T020-T023 (타입 및 UI 컴포넌트)
- **Phase 4.2 내부**: T028-T031 (타입 및 UI 컴포넌트)

---

## 구현 전략

### MVP 우선 (US1만 구현)
1. Phase 1-2: API 연결 레이어 완성
2. Phase 3: E2E 테스트 작성
3. Phase 4.1: US1 UI 구현 (Mock 데이터)
4. Phase 5: 사용자 승인
5. Phase 6: US1 데이터 바인딩
6. Phase 7: UI 테스트

### 점진적 전달
- **Step 1**: US1 완성 (대기실 진입 및 정보 표시)
- **Step 2**: US2 추가 (참여자 목록 확인)

---

## 독립적 테스트 기준

### US1 독립 테스트
- 대기실 페이지 접근 가능
- 대기실 ID 파라미터 추출 확인
- 대기실 상세 정보 조회 확인
- 대기실 설정값 조회 확인
- 대기실 정보 표시 확인
- 로딩 상태 표시 확인
- 에러 메시지 표시 확인

### US2 독립 테스트
- 참여자 목록 섹션 표시 확인
- 참여 인원수 표시 확인
- 각 참여자 정보 표시 확인
- 빈 상태 안내 표시 확인
- 참여자 목록 업데이트 확인
