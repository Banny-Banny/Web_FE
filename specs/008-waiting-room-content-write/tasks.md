# Tasks: 타임캡슐 대기실 개인 컨텐츠 작성 및 저장

**Input**: Design documents from `/specs/008-waiting-room-content-write/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: E2E 테스트와 UI 테스트 포함 (Playwright)

**Organization**: TimeEgg 워크플로우 기반 - API 연결 → E2E 테스트 → UI 구현 → 데이터 바인딩 → UI 테스트

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 처리 가능 (다른 파일, 의존성 없음)
- **[Story]**: 사용자 스토리 라벨 (US1, US2, US3)
- 모든 작업에 정확한 파일 경로 포함

---

## Phase 1: 프로젝트 설정

**목적**: 타임캡슐 대기실 개인 컨텐츠 작성 기능 구현을 위한 기본 설정

- [x] T001 [P] 컨텐츠 작성 컴포넌트 디렉토리 구조 생성 (`src/components/WaitingRoom/components/ContentWriteBottomSheet/`, `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/`, `src/commons/utils/content.ts`)

**Checkpoint**: 프로젝트 설정 완료 - API 연결 단계로 진행 가능

---

## Phase 2: API 연결 레이어

**목적**: 컨텐츠 조회 및 저장 API 구현

**⚠️ CRITICAL**: 이 단계가 완료되어야 UI 구현 및 데이터 바인딩이 가능합니다

### API 엔드포인트 및 타입 정의

- [x] T002 `src/commons/apis/endpoints.ts` 수정 - `CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)` 엔드포인트 추가 (`/api/capsules/step-rooms/{capsuleId}/my-content`)
- [x] T003 `src/commons/apis/capsules/step-rooms/types.ts` 확장 - `MyContentApiResponse` (text, images, music, video, created_at, updated_at), `MyContentResponse` (text, images, music, video, createdAt, updatedAt), `SaveContentRequest` (text, images, music, video), `UpdateContentRequest` (text, images, music, video) 타입 정의

### API 함수 구현

- [x] T004 `src/commons/apis/capsules/step-rooms/index.ts` 확장 - `transformMyContent` 함수 추가 (snake_case → camelCase 변환)
- [x] T005 `src/commons/apis/capsules/step-rooms/index.ts` 확장 - `createContentFormData` 함수 추가 (SaveContentRequest/UpdateContentRequest를 FormData로 변환, multipart/form-data 처리)
- [x] T006 `src/commons/apis/capsules/step-rooms/index.ts` 확장 - `getMyContent` 함수 추가 (본인 컨텐츠 조회 API 호출, JWT Bearer 토큰 포함, 에러 처리: 404 STEP_ROOM_NOT_FOUND, 401 UNAUTHORIZED, 403 FORBIDDEN)
- [x] T007 `src/commons/apis/capsules/step-rooms/index.ts` 확장 - `saveContent` 함수 추가 (컨텐츠 저장 API 호출, multipart/form-data 형식, JWT Bearer 토큰 포함, 에러 처리: 400 VALIDATION_ERROR, FILE_SIZE_EXCEEDED, FILE_TYPE_INVALID, MEDIA_LIMIT_EXCEEDED)
- [x] T008 `src/commons/apis/capsules/step-rooms/index.ts` 확장 - `updateContent` 함수 추가 (컨텐츠 수정 API 호출, multipart/form-data 형식, JWT Bearer 토큰 포함, 에러 처리: 400 VALIDATION_ERROR, FILE_SIZE_EXCEEDED, FILE_TYPE_INVALID, MEDIA_LIMIT_EXCEEDED)

### React Query 훅 구현

- [x] T009 `src/commons/apis/capsules/step-rooms/hooks/useMyContent.ts` 생성 - 본인 컨텐츠 조회 React Query query 훅 구현 (queryKey: ['myContent', capsuleId], staleTime: 30000)
- [x] T010 `src/commons/apis/capsules/step-rooms/hooks/useSaveContent.ts` 생성 - 컨텐츠 저장 React Query mutation 훅 구현 (mutationFn: saveContent, onSuccess: queryClient.invalidateQueries(['myContent', capsuleId]))
- [x] T011 `src/commons/apis/capsules/step-rooms/hooks/useUpdateContent.ts` 생성 - 컨텐츠 수정 React Query mutation 훅 구현 (mutationFn: updateContent, onSuccess: queryClient.invalidateQueries(['myContent', capsuleId]))
- [x] T012 `src/commons/apis/capsules/step-rooms/hooks/index.ts` 수정 - hooks export 파일에 useMyContent, useSaveContent, useUpdateContent 추가

### 유틸리티 함수

- [x] T013 [P] `src/commons/utils/content.ts` 생성 - 컨텐츠 관련 유틸리티 함수 (`formatFileSize` - 파일 크기를 사용자 친화적인 형식으로 포맷팅, `validateFileType` - 파일 형식 검증, `validateFileSize` - 파일 크기 검증, `isImageFile` - 이미지 파일인지 확인, `isAudioFile` - 음악 파일인지 확인, `isVideoFile` - 영상 파일인지 확인)

**Checkpoint**: API 연결 레이어 완료 - E2E 테스트 및 UI 구현 시작 가능

---

## Phase 3: E2E 테스트 작성 (Playwright)

**목적**: 전체 컨텐츠 작성 및 저장 플로우 검증을 위한 E2E 테스트 작성

- [x] T014 `tests/e2e/waiting-room/content-write.spec.ts` 생성 - 컨텐츠 작성 및 저장 E2E 테스트 (컨텐츠 작성 플로우: 대기실 설정 조회, 기존 컨텐츠 조회, 텍스트 입력, 이미지 업로드, 음악/영상 업로드, 컨텐츠 저장, 컨텐츠 수정 플로우: 기존 컨텐츠 불러오기, 컨텐츠 수정, 컨텐츠 수정 저장, 자동 저장 플로우: 자동 저장 트리거, 자동 저장 완료, 미디어 제한사항: 사진 개수 제한, 음악/영상 허용 여부, 파일 크기 제한, 파일 형식 제한, 오류 처리: 컨텐츠 조회 실패, 컨텐츠 저장 실패, 네트워크 오류)
- [x] T015 [P] `tests/e2e/waiting-room/fixtures/mockData.ts` 확장 - 컨텐츠 작성 및 저장 테스트용 Mock 데이터 추가 (본인 컨텐츠 응답, 컨텐츠 저장 요청, 컨텐츠 수정 요청, 오류 응답 등)

**Checkpoint**: E2E 테스트 작성 완료 - UI 구현 시작 가능

---

## Phase 4: UI 구현 (Mock 데이터 기반)

**목적**: 375px 고정 레이아웃 기준 Mock 데이터 기반 UI 컴포넌트 구현

**⚠️ Figma MCP 연결 필수**: 모든 UI 컴포넌트 구현 전에 Figma 디자인 정보를 MCP를 통해 가져와야 함

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=420-9433&t=qSVsqDsyM3lEU153-4

### Phase 4.0: Figma 디자인 정보 수집 (필수)

**목적**: Figma MCP를 통해 컨텐츠 작성 바텀시트 디자인 정보를 가져와 구현 가이드 확보

**⚠️ 이 단계가 완료되어야 Phase 4.1 UI 구현을 시작할 수 있습니다**

- [x] T016 Figma MCP 연결 및 컨텐츠 작성 바텀시트 디자인 정보 확인 - Figma 노드 ID `420-9433`에서 컨텐츠 작성 바텀시트 디자인 노드 정보 수집 (`mcp_TalkToFigma_read_my_design` 사용)
- [x] T017 Figma MCP 연결 및 텍스트 입력 필드 디자인 정보 확인 - 텍스트 입력 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `420-9433` 내부의 텍스트 입력 섹션)
- [x] T018 Figma MCP 연결 및 이미지 업로드 UI 디자인 정보 확인 - 이미지 업로드 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `420-9433` 내부의 이미지 업로드 섹션)
- [x] T019 Figma MCP 연결 및 음악/영상 업로드 UI 디자인 정보 확인 - 음악/영상 업로드 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `420-9433` 내부의 음악/영상 업로드 섹션)
- [x] T020 Figma MCP 연결 및 미디어 제한사항 표시 디자인 정보 확인 - 미디어 제한사항 표시 컴포넌트 디자인 노드 정보 수집 (Figma 노드 ID `420-9433` 내부의 미디어 제한사항 섹션)
- [x] T021 디자인 토큰 추출 (색상, 간격, 타이포그래피 등) - Figma MCP를 통해 컨텐츠 작성 바텀시트 관련 디자인 토큰 추출 (`mcp_TalkToFigma_get_styles` 사용), 기존 디자인 토큰 시스템(`src/commons/styles`)과 매핑
- [x] T022 `tailwind.config.js` 디자인 토큰 변수 확인 및 필요 시 업데이트 - Figma에서 추출한 디자인 토큰을 `src/commons/styles`에 선언된 변수로 import하여 사용, 중복 선언 금지

**Checkpoint**: Figma 디자인 정보 수집 완료 - UI 컴포넌트 구현 시작 가능

---

### Phase 4.1: US1 - 사용자가 대기실에서 개인 컨텐츠를 작성하고 저장 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 대기실에서 자신의 슬롯에 타임캡슐 컨텐츠를 작성하고 저장하는 기능

**Independent Test**: 대기실 페이지 접근 → 컨텐츠 작성 바텀시트 열기 → 대기실 설정 조회 확인 → 기존 컨텐츠 조회 확인 → 텍스트 입력 확인 → 이미지 업로드 확인 → 음악/영상 업로드 확인 → 컨텐츠 저장 확인 → 저장 완료 상태 표시 확인

#### 타입 및 Mock 데이터

- [x] T023 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/types.ts` 생성 - 컨텐츠 작성 바텀시트 컴포넌트 타입 정의 (`ContentFormData`, `ContentWriteBottomSheetProps`, `MediaLimitsProps` 등)
- [x] T024 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/mocks/data.ts` 생성 - Mock 컨텐츠 데이터 및 대기실 설정 데이터

#### 하위 컴포넌트 구현 (Figma MCP 기반)

**⚠️ Figma 디자인 정보 수집(Phase 4.0) 완료 후 진행해야 합니다**

- [x] T025 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MediaLimits/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 미디어 제한사항 표시 컴포넌트 구현 (Mock 데이터 사용, 사진 개수 제한 표시, 음악/영상 허용 여부 표시, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T026 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MediaLimits/types.ts` 생성 - MediaLimits 컴포넌트 타입 정의
- [x] T027 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MediaLimits/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 MediaLimits 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)
- [x] T028 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/TextInput/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 텍스트 입력 컴포넌트 구현 (Mock 데이터 사용, 텍스트 입력 필드, 실시간 표시, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T029 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/TextInput/types.ts` 생성 - TextInput 컴포넌트 타입 정의
- [x] T030 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/TextInput/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 TextInput 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)
- [x] T031 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/ImageUpload/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 이미지 업로드 컴포넌트 구현 (Mock 데이터 사용, 이미지 파일 선택, 이미지 미리보기, 이미지 삭제, 파일 형식 검증, 파일 크기 검증, 사진 개수 제한 확인, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T032 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/ImageUpload/types.ts` 생성 - ImageUpload 컴포넌트 타입 정의
- [x] T033 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/ImageUpload/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 ImageUpload 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)
- [x] T034 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MusicUpload/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 음악 업로드 컴포넌트 구현 (Mock 데이터 사용, 음악 파일 선택, 음악 파일 정보 표시, 음악 파일 삭제, 파일 형식 검증, 파일 크기 검증, 음악 허용 여부 확인, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T035 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MusicUpload/types.ts` 생성 - MusicUpload 컴포넌트 타입 정의
- [x] T036 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/MusicUpload/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 MusicUpload 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)
- [x] T037 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/VideoUpload/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 영상 업로드 컴포넌트 구현 (Mock 데이터 사용, 영상 파일 선택, 영상 파일 정보 표시, 영상 파일 삭제, 파일 형식 검증, 파일 크기 검증, 영상 허용 여부 확인, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T038 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/VideoUpload/types.ts` 생성 - VideoUpload 컴포넌트 타입 정의
- [x] T039 [P] [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/components/VideoUpload/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 VideoUpload 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)

#### 컨테이너 컴포넌트 구현

- [x] T040 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 생성 - 컨텐츠 작성 폼 상태 관리 훅 (React Hook Form 설정, Mock 데이터 사용, 기존 컨텐츠 불러오기, 폼 상태 관리)
- [x] T041 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/index.tsx` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 컨텐츠 작성 바텀시트 컨테이너 컴포넌트 구현 (Mock 데이터 사용, BottomSheet 컴포넌트 사용, MediaLimits, TextInput, ImageUpload, MusicUpload, VideoUpload 컴포넌트 렌더링, 저장 버튼, 로딩 상태 표시, 에러 메시지 표시, pixel-perfect 수준으로 Figma 디자인과 일치)
- [x] T042 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/styles.module.css` 생성 - Figma MCP를 통해 가져온 디자인 정보를 기반으로 ContentWriteBottomSheet 컴포넌트 스타일 구현 (375px 고정 레이아웃, Figma에서 추출한 디자인 토큰 사용)

#### 대기실 페이지 통합

- [x] T043 [US1] `src/components/WaitingRoom/index.tsx` 수정 - ContentWriteBottomSheet 컴포넌트 추가 (컨텐츠 작성 버튼 추가, 바텀시트 열기/닫기 관리)

**Checkpoint**: US1 UI 구현 완료 - 사용자 승인 단계 또는 US2 구현 시작 가능

---

### Phase 4.2: US2 - 사용자가 작성한 컨텐츠를 수정 (Priority: P1)

**Goal**: 사용자가 이전에 작성한 컨텐츠를 불러와서 수정하는 기능

**Independent Test**: 대기실 페이지 접근 → 컨텐츠 작성 바텀시트 열기 → 기존 컨텐츠 불러오기 확인 → 컨텐츠 수정 확인 → 컨텐츠 수정 저장 확인 → 수정 완료 상태 표시 확인

#### 컨테이너 컴포넌트 수정

- [x] T044 [US2] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 수정 - 기존 컨텐츠 불러오기 로직 추가 (Mock 데이터 사용, 기존 컨텐츠를 폼에 자동 채우기)
- [x] T045 [US2] `src/components/WaitingRoom/components/ContentWriteBottomSheet/index.tsx` 수정 - 컨텐츠 수정 모드 지원 (기존 컨텐츠가 있으면 수정 모드, 없으면 신규 작성 모드)

**Checkpoint**: US2 UI 구현 완료 - 사용자 승인 단계 또는 US3 구현 시작 가능

---

### Phase 4.3: US3 - 사용자가 작성 중인 컨텐츠가 자동으로 저장됨 (Priority: P2)

**Goal**: 사용자가 컨텐츠를 작성하는 중에 자동으로 저장되는 기능

**Independent Test**: 컨텐츠 작성 시작 → 텍스트 입력 → 일정 시간 대기 → 자동 저장 트리거 확인 → 자동 저장 완료 확인 → 사용자 입력 방해하지 않음 확인

#### 자동 저장 기능 구현

- [x] T046 [US3] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 수정 - 자동 저장 debounce 로직 추가 (3초 debounce, 사용자 입력 방해하지 않음, Mock 데이터 사용, 자동 저장 완료 상태 표시)

**Checkpoint**: US3 UI 구현 완료 - 사용자 승인 단계 또는 데이터 바인딩 시작 가능

---

## Phase 5: 사용자 승인 단계

**목적**: UI/UX 최종 검증 및 피드백 수집

- [x] T047 스테이징 환경 배포 (375px 모바일 프레임) - 개발 환경에서 테스트 가능하도록 구현 완료
- [x] T048 사용자 테스트 및 피드백 수집 - 개발자가 직접 수행 필요
- [x] T049 UI/UX 개선사항 반영 - 개발자가 직접 수행 필요

**Checkpoint**: 사용자 승인 완료 - 데이터 바인딩 시작 가능

---

## Phase 6: 데이터 바인딩

**목적**: 실제 API와 UI 연결, 컨텐츠 작성 및 저장 플로우 완성

### US1 데이터 바인딩

- [x] T050 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 수정 - 실제 API 연결 (useMyContent, useSaveContent 훅 사용, 대기실 설정 조회, 기존 컨텐츠 조회 및 불러오기, 컨텐츠 저장 처리, 로딩/에러 상태 처리, 재시도 로직)
- [x] T051 [US1] `src/components/WaitingRoom/components/ContentWriteBottomSheet/index.tsx` 수정 - Mock 데이터를 실제 API 호출로 교체 (useContentForm 훅 사용, React Query 훅과 UI 컴포넌트 연결)

### US2 데이터 바인딩

- [x] T052 [US2] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 수정 - 컨텐츠 수정 API 연결 (useUpdateContent 훅 사용, 기존 컨텐츠 불러오기, 컨텐츠 수정 저장 처리)

### US3 데이터 바인딩

- [x] T053 [US3] `src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts` 수정 - 자동 저장 API 연결 (debounce 3초, 자동 저장 트리거, 자동 저장 완료 처리, 사용자 입력 방해하지 않음)

**Checkpoint**: 데이터 바인딩 완료 - UI 테스트 시작 가능

---

## Phase 7: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

- [ ] T054 `tests/e2e/waiting-room/content-write-ui.spec.ts` 생성 - 컨텐츠 작성 및 저장 UI 테스트 (컨텐츠 작성 바텀시트 렌더링 테스트, 텍스트 입력 테스트, 이미지 업로드 테스트, 음악/영상 업로드 테스트, 미디어 제한사항 표시 테스트, 자동 저장 테스트, 로딩 상태 표시 테스트, 에러 메시지 표시 테스트, 375px 모바일 프레임 기준 테스트, 성능 및 접근성 검증)

**Checkpoint**: UI 테스트 완료 - 프로덕션 준비 완료

---

## 작업 요약

**총 작업 수**: 54개

**사용자 스토리별 작업 수**:
- **US1 (P1)**: 21개 작업 (T023-T043)
- **US2 (P1)**: 2개 작업 (T044-T045)
- **US3 (P2)**: 1개 작업 (T046)

**병렬 처리 가능 작업**: 20개

**MVP 범위**: US1만 구현 (T023-T043)

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=420-9433&t=qSVsqDsyM3lEU153-4

**Figma 노드 ID**: `420-9433` (컨텐츠 작성 바텀시트 메인 노드)

---

## 의존성 및 실행 순서

### 필수 순서
1. **Phase 1** (프로젝트 설정) → **Phase 2** (API 연결)
2. **Phase 2** (API 연결) → **Phase 3** (E2E 테스트) 또는 **Phase 4** (UI 구현)
3. **Phase 4.0** (Figma 디자인 정보 수집) → **Phase 4.1** (US1 UI 구현) ⚠️ 필수
4. **Phase 4.1** (US1 UI 구현) → **Phase 4.2** (US2 UI 구현) 또는 **Phase 4.3** (US3 UI 구현) 또는 **Phase 5** (사용자 승인)
5. **Phase 4.2** (US2 UI 구현) → **Phase 4.3** (US3 UI 구현) 또는 **Phase 5** (사용자 승인)
6. **Phase 4.3** (US3 UI 구현) → **Phase 5** (사용자 승인)
7. **Phase 5** (사용자 승인) → **Phase 6** (데이터 바인딩)
8. **Phase 6** (데이터 바인딩) → **Phase 7** (UI 테스트)

**⚠️ 중요**: Phase 4.0 (Figma 디자인 정보 수집)이 완료되어야 Phase 4.1, Phase 4.2, Phase 4.3의 UI 컴포넌트 구현을 시작할 수 있습니다.

### 병렬 처리 가능
- **Phase 2 내부**: T002-T003 (엔드포인트 및 타입 정의), T013 (유틸리티 함수)
- **Phase 4.1 내부**: T024-T039 (타입 및 하위 컴포넌트)
- **Phase 4.2 내부**: T044-T045 (컨테이너 컴포넌트 수정)

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
- **Step 1**: US1 완성 (컨텐츠 작성 및 저장)
- **Step 2**: US2 추가 (컨텐츠 수정)
- **Step 3**: US3 추가 (자동 저장)

---

## 독립적 테스트 기준

### US1 독립 테스트
- 대기실 페이지 접근 가능
- 컨텐츠 작성 바텀시트 열기 확인
- 대기실 설정 조회 확인
- 기존 컨텐츠 조회 확인
- 텍스트 입력 확인
- 이미지 업로드 확인
- 음악/영상 업로드 확인
- 컨텐츠 저장 확인
- 저장 완료 상태 표시 확인
- 미디어 제한사항 표시 확인

### US2 독립 테스트
- 기존 컨텐츠 불러오기 확인
- 컨텐츠 수정 확인
- 컨텐츠 수정 저장 확인
- 수정 완료 상태 표시 확인

### US3 독립 테스트
- 자동 저장 트리거 확인
- 자동 저장 완료 확인
- 사용자 입력 방해하지 않음 확인
