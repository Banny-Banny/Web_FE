# 작업 목록: 프로필 수정

## 개요

이 문서는 "프로필 수정" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/010-profile-edit/spec.md`
- 기술 계획: `specs/010-profile-edit/plan.md`

**총 작업 수**: 18개  
**완료된 작업**: 18개  
**남은 작업**: 0개  
**예상 소요 기간**: 1~2일

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 | 작업 수 |
|-----------|------|---------|
| US1 | 프로필 수정 모달 열기 | 3개 |
| US2 | 프로필 사진만 변경 (사진 변경 버튼 → 업로드 → 저장) | 1개 |
| US3 | 닉네임만 변경 (입력 → 저장) | 1개 |
| US4 | 사진과 닉네임 모두 변경 후 저장 | 1개 |
| US5 | 취소/배경 클릭으로 모달 닫기 | 1개 |
| US6 | 사진 업로드 실패 (형식/크기 검증) | 1개 |
| US7 | 닉네임 중복(409) 오류 메시지 | 1개 |
| 공통 | API·훅·E2E/UI 테스트 | 11개 |

---

## 의존성 순서

1. **Phase 1** 완료 후 Phase 2 진행  
2. **Phase 2** 완료 후 Phase 3(모달 UI) 진행  
3. **Phase 3** 완료 후 Phase 4(ProfileSection 연동) 진행  
4. **Phase 4** 완료 후 Phase 5(검증·에러 메시지) 및 Phase 6(데이터 바인딩) 진행  
5. **Phase 6** 완료 후 Phase 7(E2E/UI 테스트) 진행  

**병렬 가능**: T002와 T003, T005와 T006, T009와 T010 등 서로 다른 파일을 다루는 작업은 동시 진행 가능([P] 표시).

---

## Phase 1: API 연동 레이어

### 엔드포인트 및 타입

- [x] T001 src/commons/apis/endpoints.ts 수정
  - `AUTH_ENDPOINTS`에 `ME_UPDATE`, `ME_PROFILE_IMAGE` 추가
  - `ME_UPDATE`: `${AUTH_ENDPOINTS.ME}/update`
  - `ME_PROFILE_IMAGE`: `${AUTH_ENDPOINTS.ME}/profile-image`
  - 파일: `src/commons/apis/endpoints.ts`

- [x] T002 [P] src/commons/apis/auth/types.ts 수정
  - `MeUpdateRequest` 인터페이스 추가 (nickname: string)
  - `ProfileImageUploadResponse` 인터페이스 추가 (profileImageUrl: string)
  - 파일: `src/commons/apis/auth/types.ts`

### API 함수 구현

- [ ] T003 src/commons/apis/auth/me-update.ts 생성
  - `updateMe(payload: MeUpdateRequest)` 함수 구현
  - POST /api/me/update, application/json
  - Axios 에러를 ApiError 형태로 변환 (status, message, 409 등 전달)
  - `AUTH_ENDPOINTS.ME_UPDATE` 사용
  - 파일: `src/commons/apis/auth/me-update.ts`

- [x] T004 src/commons/apis/auth/me-profile-image.ts 생성
  - `uploadProfileImage(file: File)` 함수 구현
  - POST /api/me/profile-image, multipart/form-data (FormData에 file 추가, 필드명은 백엔드 스펙에 맞춤)
  - `ProfileImageUploadResponse` 반환
  - Axios 에러를 ApiError 형태로 변환
  - `AUTH_ENDPOINTS.ME_PROFILE_IMAGE` 사용
  - 파일: `src/commons/apis/auth/me-profile-image.ts`

---

## Phase 2: React Query Mutation 훅

- [ ] T005 src/components/Mypage/components/profile-section/hooks/useUpdateProfile.ts 생성
  - `useUpdateProfile` 훅 구현
  - `useMutation`으로 `updateMe` 호출
  - 성공 시 `queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })` 호출
  - 파일: `src/components/Mypage/components/profile-section/hooks/useUpdateProfile.ts`

- [x] T006 src/components/Mypage/components/profile-section/hooks/useUploadProfileImage.ts 생성
  - `useUploadProfileImage` 훅 구현
  - `useMutation`으로 `uploadProfileImage` 호출
  - 성공 시 `queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })` 호출
  - 파일: `src/components/Mypage/components/profile-section/hooks/useUploadProfileImage.ts`

---

## Phase 3: 프로필 수정 모달 UI (Figma 기준)

### [US1] 프로필 수정 모달 열기

- [ ] T007 [US1] src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx 생성
  - `ProfileEditModal` 컴포넌트 구현
  - Props: open, onClose, profile (MeResponse | null), onSuccess (선택)
  - 모달 레이아웃: 제목 "프로필 수정", 오버레이(배경 딤), 중앙 모달 컨테이너
  - open이 false일 때는 렌더하지 않거나 display none 처리
  - Figma 노드 161-24140 기준 구조 (제목, 프로필 미리보기 영역, 닉네임 영역, 취소/저장 버튼)
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

- [x] T008 [P] [US1] src/components/Mypage/components/profile-section/components/ProfileEditModal/styles.module.css 생성
  - 오버레이, 모달 컨테이너, 제목, 프로필 미리보기 원형, 사진 변경 버튼, 닉네임 레이블/입력, 취소/저장 버튼 스타일
  - 375px 고정, 디자인 토큰 활용
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/styles.module.css`

### [US2] 사진 변경

- [ ] T009 [US2] ProfileEditModal에 "사진 변경" 버튼 및 hidden file input 연동
  - "사진 변경" 버튼 클릭 시 `<input type="file" accept="image/jpeg,image/png,image/webp" />` 트리거
  - 파일 선택 시 클라이언트 검증: 형식(jpeg/png/webp), 크기(5MB 이하)
  - 통과 시 로컬 미리보기 URL 생성(URL.createObjectURL) 및 모달 내 프로필 미리보기 갱신, 선택 파일 상태 보관
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

### [US3] 닉네임 수정

- [x] T010 [US3] ProfileEditModal에 닉네임 입력 필드 및 초기값 바인딩
  - 모달 open 시 profile.nickname을 입력 필드 초기값으로 설정
  - "닉네임" 레이블 + controlled input (nickname state)
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

### [US4][US5] 저장 및 취소

- [ ] T011 [US4][US5] ProfileEditModal에 "저장"·"취소" 동작 구현
  - "저장" 클릭 시: (1) 이미지 변경 있으면 uploadProfileImage 호출 (2) 닉네임 변경 있으면 updateMe(nickname) 호출. 순서는 이미지 먼저 후 닉네임
  - 저장 중 isSubmitting true, 버튼 비활성화
  - 성공 시 onClose 호출, onSuccess 호출(부모 refetch용)
  - "취소" 클릭 시 onClose 호출
  - 배경(오버레이) 클릭 시 onClose 호출
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

### [US6][US7] 에러 메시지

- [x] T012 [US6][US7] ProfileEditModal에 에러 표시 및 409/400 메시지 처리
  - 업로드 실패(형식/크기): "파일 형식이 올바르지 않습니다" 또는 "파일 크기는 5MB 이하여야 합니다" 등 표시
  - 닉네임 중복(409): "이미 사용 중인 닉네임입니다" 표시, 모달 유지
  - 네트워크/기타: "일시적인 오류가 발생했습니다. 다시 시도해주세요." 등 표시
  - error state를 모달 내에 표시하는 UI 추가
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

---

## Phase 4: ProfileSection 모달 트리거

- [ ] T013 [US1] src/components/Mypage/components/profile-section/index.tsx 수정
  - `useState`로 모달 열림 상태 추가 (예: modalOpen, setModalOpen)
  - cameraButtonWrapper 내부 버튼(또는 cameraButtonWrapper)에 onClick 연결 → setModalOpen(true)
  - 로딩/에러/프로필 없음 시 카메라 버튼 disabled 유지 (기존 동작)
  - `ProfileEditModal` 렌더: open={modalOpen}, onClose={() => setModalOpen(false)}, profile={profile}, onSuccess={() => refetch()} (useProfile의 refetch 전달)
  - 파일: `src/components/Mypage/components/profile-section/index.tsx`

---

## Phase 5: 데이터 바인딩 및 검증

- [x] T014 ProfileEditModal에 useUpdateProfile, useUploadProfileImage 훅 연결
  - "저장" 시 mutation 호출 순서: uploadProfileImage(있을 때) → updateMe(nickname)
  - 성공 시 쿼리 무효화는 훅 내부에서 수행되므로 onSuccess에서 부모 refetch만 호출
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

- [ ] T015 닉네임 클라이언트 검증 추가
  - 닉네임 빈 값 또는 공백만일 경우 저장 버튼 비활성화 또는 저장 시 "닉네임을 입력해주세요" 메시지 표시
  - 백엔드 스펙에 길이 제한이 있으면 동일하게 검증 후 메시지 표시
  - 파일: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

---

## Phase 6: E2E 테스트 (Playwright)

- [x] T016 tests/e2e/profile-edit/profile-edit.e2e.spec.ts 생성
  - 마이페이지 진입 후 프로필 섹션에서 카메라 버튼 클릭 → 프로필 수정 모달 표시 확인
  - 모달 내 "프로필 수정" 제목, 닉네임 입력 필드, 사진 변경/취소/저장 버튼 존재 확인
  - 파일: `tests/e2e/profile-edit/profile-edit.e2e.spec.ts`

- [ ] T017 tests/e2e/profile-edit/profile-edit.e2e.spec.ts 수정
  - 닉네임 수정 후 "저장" 클릭 → 모달 닫힘 확인, 프로필 섹션 닉네임 갱신 확인 (가능 시)
  - "취소" 또는 배경 클릭 시 모달 닫힘 확인
  - 파일: `tests/e2e/profile-edit/profile-edit.e2e.spec.ts`

---

## Phase 7: UI 테스트 (Playwright)

- [x] T018 [P] tests/ui/profile-edit/profile-edit.ui.spec.ts 생성
  - ProfileEditModal 렌더 테스트 (open=true, profile mock)
  - "취소" 클릭 시 onClose 호출 확인
  - 배경 클릭 시 onClose 호출 확인 (구현된 경우)
  - "저장" 클릭 시 mutation 호출 및 onSuccess 호출 확인 (mock)
  - 파일: `tests/ui/profile-edit/profile-edit.ui.spec.ts`

---

## 구현 전략 (MVP 우선)

- **MVP 범위**: US1(모달 열기) + US3(닉네임 수정·저장) + US5(취소/닫기)까지로 먼저 완료 후, US2(사진 변경)·US4·US6·US7 추가 권장
- **병렬 처리**: T002와 T003·T004는 서로 다른 파일이므로 T001 완료 후 T002·T003·T004 중 T002와 T003 또는 T004를 병렬 진행 가능. T009와 T010은 같은 파일 순차 수정.
- **테스트**: E2E(T016·T017)는 API 연동 후 실행, UI 테스트(T018)는 모달 구현 후 실행

---

## 형식 검증

- 모든 작업은 `- [ ]` 체크박스로 시작함
- 모든 작업에 TaskID(T001~T018) 포함
- 사용자 스토리 단계 작업에 [USn] 라벨 포함
- 병렬 가능 작업에 [P] 포함
- 각 작업 설명에 대상 파일 경로 포함
