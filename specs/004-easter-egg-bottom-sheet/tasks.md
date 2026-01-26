# 작업 목록: 이스터에그 바텀시트

## 개요

이 문서는 "이스터에그 바텀시트" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/004-easter-egg-bottom-sheet/spec.md`
- 기술 계획: `specs/004-easter-egg-bottom-sheet/plan.md`

**총 작업 수**: 38개
**예상 소요 기간**: 7-12일 (개발자 1명 기준)

---

## 사용자 스토리 매핑

| 스토리 ID | 설명 | 작업 수 |
|-----------|------|---------|
| US1 | 이스터에그 생성 시작 | 17개 |
| US3 | 바텀시트 취소 | 3개 |
| US4 | 키보드 네비게이션 | 5개 |
| 공통 | 설정 및 테스트 | 12개 |

---

## Phase 1: 프로젝트 설정 및 의존성 설치 ✅

### 설정 작업

- [x] T001 package.json에 새로운 의존성 추가 및 설치
  - `@use-gesture/react`: ^10.3.0 ✅
  - `@react-spring/web`: ^9.7.3 ✅
  - **참고**: `@remixicon/react`는 이미 설치되어 있음 (v4.8.0)
  - 파일: `package.json`
  - 명령: `npm install @use-gesture/react @react-spring/web`

- [x] T002 FE/doc/v.1.0/package.md 파일 업데이트
  - 새로운 패키지 정보 추가 (@use-gesture/react, @react-spring/web) ✅
  - 도입 목적, 사용처, 번들 크기 문서화 ✅
  - **아이콘 라이브러리 정책 명시**: @remixicon/react만 사용, 새로운 아이콘 패키지 추가 금지 ✅
  - 파일: `docs/dependencies/package.md` (새로 생성)

- [x] T003 디렉토리 구조 생성
  - `src/components/home/components/easter-egg-bottom-sheet/` 생성 ✅
  - `src/components/home/components/easter-egg-bottom-sheet/hooks/` 생성 ✅
  - `src/components/home/components/easter-egg-bottom-sheet/components/` 생성 ✅
  - `src/components/home/components/easter-egg-bottom-sheet/components/option-button/` 생성 ✅
  - `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/` 생성 ✅

---

## Phase 2: 기본 타입 정의 및 Mock 데이터 ✅

### 타입 정의

- [x] T004 [P] src/components/home/components/easter-egg-bottom-sheet/types.ts 생성 ✅
  - EasterEggOption 인터페이스 정의 ✅
    - icon 필드: @remixicon/react 컴포넌트 이름 (string) ✅
  - EasterEggSheetState 인터페이스 정의 ✅
  - EasterEggBottomSheetProps 인터페이스 정의 ✅
  - OptionButtonProps 인터페이스 정의 ✅
  - SheetContentProps 인터페이스 정의 ✅

- [x] T005 [P] src/components/home/components/easter-egg-bottom-sheet/components/option-button/types.ts 생성 ✅
  - OptionButtonProps 타입 재export ✅
  - 추가 내부 타입 정의 (필요 시) ✅

- [x] T006 [P] src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/types.ts 생성 ✅
  - SheetContentProps 타입 재export ✅
  - 추가 내부 타입 정의 (필요 시) ✅

### Mock 데이터

- [x] T007 src/components/home/hooks/useEasterEggOptions.ts 생성 ✅
  - EASTER_EGG_OPTIONS Mock 데이터 정의 ✅
  - **아이콘**: @remixicon/react 컴포넌트 이름 사용 (예: 'RiFlashlightLine') ✅
  - useEasterEggOptions Hook 구현 ✅
  - 파일: `src/components/home/hooks/useEasterEggOptions.ts` ✅

---

## Phase 3: Phase 1 구현 - 기본 바텀시트 통합 및 상태 관리 ✅

### [US1] 이스터에그 생성 시작 - 기본 구조

- [x] T008 [US1] src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet.ts 생성 ✅
  - 바텀시트 상태 관리 Hook 구현 ✅
  - isOpen, selectedOption, height, isDragging 상태 관리 ✅
  - handleOpen, handleClose, handleSelectOption 함수 구현 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet.ts` ✅

- [x] T009 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx 생성 (기본 구조) ✅
  - 'use client' 지시어 추가 ✅
  - EasterEggBottomSheet 컴포넌트 기본 구조 작성 ✅
  - BottomSheet 공통 컴포넌트 import 및 사용 ✅
  - props 정의 및 기본 렌더링 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

- [x] T010 [US1] src/components/home/components/easter-egg-bottom-sheet/styles.module.css 생성 ✅
  - 바텀시트 컨테이너 스타일 ✅
  - 디자인 토큰 기반 스타일링 ✅
  - 375px 모바일 프레임 기준 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/styles.module.css` ✅

- [x] T011 [US1] src/components/home/index.tsx 수정 - 바텀시트 상태 추가 ✅
  - easterEggSheetOpen 상태 추가 ✅
  - handleEasterEggClick 함수 수정 (바텀시트 열기) ✅
  - handleEasterEggSheetClose 함수 추가 ✅
  - handleEasterEggConfirm 함수 추가 (임시 구현) ✅
  - 파일: `src/components/home/index.tsx` ✅

- [x] T012 [US1] src/components/home/index.tsx 수정 - 바텀시트 렌더링 ✅
  - EasterEggBottomSheet 컴포넌트 import ✅
  - JSX에 EasterEggBottomSheet 추가 ✅
  - isOpen, onClose, onConfirm props 연결 ✅
  - 파일: `src/components/home/index.tsx` ✅

### [US3] 바텀시트 취소 - 닫기 동작

- [x] T013 [US3] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 닫기 동작 구현 ✅
  - 배경 오버레이 클릭 시 닫기 (closeOnBackdropPress prop) ✅
  - ESC 키 입력 시 닫기 (BottomSheet 기본 기능 활용) ✅
  - 취소 버튼 클릭 시 닫기 (DualButton onCancelPress) ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

---

## Phase 4: Phase 2 구현 - Figma 디자인 기반 폼 컨텐츠 ✅ (재구현 완료)

✅ **완료**: 기존 "옵션 선택 버튼" 구현을 삭제하고, 실제 Figma 디자인에 맞는 "이스터에그 작성 폼"으로 재구현 완료!

### Figma 디자인 추출 및 분석

- [x] T014 Figma Desktop MCP를 통해 실제 디자인 확인 ✅
  - 노드 ID: 599:5084 ✅
  - **실제 디자인**: 이스터에그 작성 폼 (제목, 메시지, 첨부파일) ✅
  - 색상, 타이포그래피, 간격 토큰 확인 ✅
  - **아이콘**: @remixicon/react 사용 ✅

### [US1] 폼 타입 정의

- [x] T015-NEW src/components/home/components/easter-egg-bottom-sheet/types.ts 수정 ✅
  - EasterEggFormData 인터페이스 추가 ✅
    - title: string (필수, 최대 30자) ✅
    - message: string (선택, 최대 500자) ✅
    - attachments: File[] (선택) ✅
    - location (선택) ✅
  - 기존 EasterEggOption 인터페이스 삭제 ✅
  - TitleInputProps, MessageInputProps, AttachmentButtonsProps 인터페이스 추가 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/types.ts` ✅

### [US1] 제목 입력 필드 컴포넌트

- [ ] T016-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/title-input/index.tsx 생성
  - 'use client' 지시어 추가
  - TitleInput 컴포넌트 구현
  - placeholder: "추억의 제목을 입력하세요"
  - 최대 30자 제한
  - 글자 수 표시 (우측 하단)
  - onChange 핸들러
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/title-input/index.tsx`

- [ ] T017-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/title-input/styles.module.css 생성
  - Figma 디자인 스펙 준수
  - 입력 필드 스타일 (border, padding, radius)
  - 라벨 스타일
  - 글자 수 카운터 스타일
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/title-input/styles.module.css`

### [US1] 메시지 입력 영역 컴포넌트

- [ ] T018-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/message-input/index.tsx 생성
  - 'use client' 지시어 추가
  - MessageInput 컴포넌트 구현
  - textarea 사용
  - 문서 아이콘 표시 (@remixicon/react)
  - placeholder: "미래의 나에게 또는 친구에게 남길 메시지를 작성하세요..."
  - 최대 500자 제한
  - 글자 수 표시 (우측 하단)
  - onChange 핸들러
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/message-input/index.tsx`

- [ ] T019-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/message-input/styles.module.css 생성
  - Figma 디자인 스펙 준수
  - textarea 스타일 (높이, padding)
  - 라벨 및 아이콘 스타일
  - 글자 수 카운터 스타일
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/message-input/styles.module.css`

### [US1] 첨부파일 버튼 컴포넌트

- [ ] T020-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/attachment-buttons/index.tsx 생성
  - 'use client' 지시어 추가
  - AttachmentButtons 컴포넌트 구현
  - 3개 버튼: 사진, 음성, 동영상
  - 각 버튼에 아이콘 표시 (@remixicon/react)
  - 파일 선택 input (hidden)
  - 파일 타입별 accept 속성
  - onFileSelect 핸들러
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/attachment-buttons/index.tsx`

- [ ] T021-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/attachment-buttons/styles.module.css 생성
  - Figma 디자인 스펙 준수
  - 버튼 그리드 레이아웃 (3개 가로 배치)
  - 버튼 스타일 (border, radius, 아이콘 크기)
  - 호버 상태
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/attachment-buttons/styles.module.css`

### [US1] 안내 정보 박스 컴포넌트

- [ ] T022-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/info-box/index.tsx 생성
  - 'use client' 지시어 추가
  - InfoBox 컴포넌트 구현
  - 2개 안내 메시지:
    - "💡 현재 위치에 추억이 저장됩니다"
    - "💡 3명이 발견하면 이스터에그가 소멸됩니다"
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/info-box/index.tsx`

- [ ] T023-NEW [P] src/components/home/components/easter-egg-bottom-sheet/components/info-box/styles.module.css 생성
  - Figma 디자인 스펙 준수
  - 배경색: #f5f5f5
  - border 및 radius
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/info-box/styles.module.css`

### [US1] 폼 상태 관리 Hook

- [ ] T024-NEW src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggForm.ts 생성
  - useEasterEggForm Hook 구현
  - 폼 상태 관리 (title, message, attachments)
  - 폼 검증 로직
    - title 필수 체크
    - 글자 수 제한 체크
  - 파일 첨부 핸들러
  - 폼 리셋 함수
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggForm.ts`

### [US1] 바텀시트 메인 컴포넌트 재구현

- [ ] T025-NEW src/components/home/components/easter-egg-bottom-sheet/index.tsx 대폭 수정
  - 기존 옵션 선택 로직 제거
  - useEasterEggForm Hook 사용
  - TitleInput, MessageInput, AttachmentButtons, InfoBox 컴포넌트 사용
  - DualButton: "취소" / "작성 완료"
  - 작성 완료 버튼: title 입력 시에만 활성화
  - onConfirm에 폼 데이터 전달
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T026-NEW src/components/home/components/easter-egg-bottom-sheet/styles.module.css 수정
  - 폼 레이아웃에 맞게 스타일 조정
  - 스크롤 가능 영역 설정
  - Figma 디자인 100% 일치
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/styles.module.css`

### 기존 구현 정리

- [x] T027-CLEANUP 기존 옵션 버튼 관련 파일 삭제 ✅
  - src/components/home/components/easter-egg-bottom-sheet/components/option-button/ 폴더 전체 삭제 ✅
  - src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/ 폴더 전체 삭제 ✅
  - src/components/home/hooks/useEasterEggOptions.ts 삭제 ✅

### 통합 구현 (컴포넌트를 메인 파일에 통합)

- [x] T028-INTEGRATED 메인 컴포넌트에 폼 기능 통합 구현 ✅
  - 제목 입력 필드 (최대 30자, 글자 수 표시) ✅
  - 메시지 입력 영역 (최대 500자, 글자 수 표시) ✅
  - 첨부파일 버튼 3개 (사진/음성/동영상) - UI만 구현 ✅
  - 안내 정보 박스 2개 ✅
  - 폼 상태 관리 (useState 사용) ✅
  - 폼 검증 (제목 필수) ✅
  - 작성 완료 버튼 활성화/비활성화 ✅
  - 폼 초기화 로직 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

- [x] T029-INTEGRATED Figma 디자인 100% 일치 스타일 적용 ✅
  - 헤더 스타일 (제목 + 부제목) ✅
  - 입력 필드 스타일 (border, padding, radius) ✅
  - textarea 스타일 ✅
  - 글자 수 카운터 스타일 ✅
  - 첨부파일 버튼 그리드 레이아웃 ✅
  - 안내 정보 박스 스타일 ✅
  - 스크롤 가능 영역 설정 ✅
  - 반응형 디자인 (375px 기준) ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/styles.module.css` ✅

- [x] T030-INTEGRATED home/index.tsx 수정 ✅
  - handleEasterEggConfirm 타입 변경 (optionId → formData) ✅
  - 파일: `src/components/home/index.tsx` ✅

---

## Phase 5: Phase 3 구현 - 미리보기 기능

### [US1] 첨부파일 미리보기 구현

- [ ] T021 [US1] 이미지 미리보기 컴포넌트 구현
  - 이미지 파일 선택 시 미리보기 표시
  - Figma 디자인: https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5260&m=dev
  - 이미지 삭제 기능
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/image-preview/index.tsx`

- [ ] T022 [US1] 음원 모달 컴포넌트 구현
  - 음원 버튼 클릭 시 모달 표시
  - Figma 디자인:
    - https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5637&m=dev
    - https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-6061&m=dev
    - https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-6504&m=dev
  - 직접 녹음 또는 파일 업로드 기능
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/audio-modal/index.tsx`

- [ ] T023 [US1] 음원 미리보기 컴포넌트 구현
  - 음원 선택/녹음 완료 후 미리보기 표시
  - Figma 디자인: https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5660&m=dev
  - 오디오 플레이어 기능 (재생/일시정지)
  - 음원 삭제 기능
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/audio-preview/index.tsx`

- [ ] T024 [US1] 비디오 미리보기 컴포넌트 구현
  - 비디오 파일 선택 시 썸네일 미리보기 표시
  - Figma 디자인: https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-6527&m=dev
  - 비디오 삭제 기능
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/video-preview/index.tsx`

- [ ] T025 [US1] 첨부파일 버튼 컴포넌트 수정 - 미리보기 연동
  - 파일 선택 후 미리보기 컴포넌트 표시
  - 미리보기 상태 관리
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/attachment-buttons/index.tsx`

---

## Phase 6: Phase 4 구현 - 접근성 및 키보드 네비게이션 ✅

### [US4] 키보드 네비게이션

- [x] T027 [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 포커스 관리 ✅
  - 바텀시트 열릴 때 포커스를 첫 번째 입력 필드로 이동 ✅
  - 바텀시트 닫힐 때 포커스를 FAB 버튼으로 복원 (BottomSheet 기본 기능) ✅
  - useEffect를 사용한 포커스 관리 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

- [x] T028 [P] [US4] 키보드 접근성 구현 ✅
  - 모든 인터랙티브 요소에 포커스 스타일 추가 (:focus-visible) ✅
  - 첨부파일 버튼에 적절한 aria-label 추가 ✅
  - tabIndex 적절히 설정 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

- [x] T029 [P] [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - ARIA 속성 추가 ✅
  - role="dialog" 추가 (BottomSheet 기본 제공) ✅
  - aria-modal="true" 추가 (BottomSheet 기본 제공) ✅
  - aria-labelledby 및 aria-describedby 추가 ✅
  - 모든 버튼에 aria-label 추가 ✅
  - 입력 필드에 aria-required, aria-describedby 추가 ✅
  - 글자 수 카운터에 aria-live="polite" 추가 ✅
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx` ✅

- [x] T030 [US4] src/commons/components/bottom-sheet/index.tsx 확인 - 포커스 트랩 ✅
  - 포커스 관리가 올바르게 작동함 확인 ✅
  - Escape 키로 닫기 기능 확인 ✅
  - 포커스 복원 기능 확인 ✅
  - 파일: `src/commons/components/bottom-sheet/index.tsx` ✅

- [x] T031 [US4] 접근성 개선 완료 ✅
  - 명도 대비: 디자인 토큰 사용으로 충족 ✅
  - 터치 타겟 크기: 최소 44x44px 이상 (버튼 높이 44px+) ✅
  - 키보드 네비게이션: Tab, Enter, Escape 키 지원 ✅
  - 스크린 리더 호환성: ARIA 속성 추가 완료 ✅
  - 파일: 전체 컴포넌트 ✅

---

## Phase 7: UI 테스트 (Playwright)

### 컴포넌트 단위 테스트

- [ ] T032 tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts 생성 - 기본 플로우 테스트
  - FAB 버튼 클릭 → 이스터에그 선택 → 바텀시트 열림 테스트
  - 옵션 선택 → 확인 버튼 활성화 테스트
  - 확인 버튼 클릭 → 다음 단계 진행 테스트
  - 파일: `tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts`

- [ ] T033 tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts 수정 - 닫기 동작 테스트
  - 배경 오버레이 클릭으로 닫기 테스트
  - 취소 버튼 클릭으로 닫기 테스트
  - ESC 키로 닫기 테스트
  - 파일: `tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts`

- [ ] T034 tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts 수정 - 미리보기 테스트
  - 이미지 미리보기 표시 테스트
  - 음원 모달 열기/닫기 테스트
  - 음원 미리보기 및 재생 테스트
  - 비디오 미리보기 표시 테스트
  - 파일: `tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts`

- [ ] T035 tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts 수정 - 키보드 네비게이션 테스트
  - Tab 키로 옵션 탐색 테스트
  - Enter 키로 옵션 선택 테스트
  - 포커스 관리 검증 (열기/닫기 시)
  - 파일: `tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts`

- [ ] T036 tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts 수정 - 접근성 테스트
  - WCAG 2.1 AA 준수 검증 (axe-core)
  - 포커스 관리 검증
  - 스크린 리더 호환성 검증
  - 파일: `tests/ui/easter-egg-bottom-sheet/easter-egg-bottom-sheet.ui.spec.ts`

---

## Phase 8: 최종 검증 및 문서화

### 성능 최적화 및 검증

- [ ] T037 성능 프로파일링 및 최적화
  - Chrome DevTools Performance 탭으로 FPS 측정 (목표: 60fps)
  - React DevTools Profiler로 렌더링 시간 측정 (목표: < 100ms)
  - Lighthouse 점수 확인 (Performance > 90, Accessibility > 95)
  - 번들 크기 분석 (증가분 < 50KB)
  - 필요 시 코드 스플리팅 및 동적 import 적용

### 문서화 및 최종 검증

- [ ] T038 문서 업데이트 및 최종 체크리스트
  - README.md 업데이트 (필요 시)
  - 컴포넌트 Props 문서화 (JSDoc 주석)
  - 코드 주석 작성 (복잡한 로직)
  - 최종 체크리스트 검증 (plan.md의 13. 최종 체크리스트)
  - 파일: 전체 프로젝트

---

## 의존성 및 실행 순서

### 단계별 의존성

```
Phase 1 (T001-T003)
  ↓
Phase 2 (T004-T007) - 병렬 가능
  ↓
Phase 3 (T008-T013) - US1, US3
  ↓
Phase 4 (T014-T020) - US1 (T015-T016, T017-T018 병렬 가능)
  ↓
Phase 5 (T021-T025) - US1 (미리보기 기능)
  ↓
Phase 6 (T027-T031) - US4 (T028-T029 병렬 가능)
  ↓
Phase 7 (T032-T036) - UI 테스트
  ↓
Phase 8 (T037-T038) - 최종 검증
```

### 병렬 처리 가능한 작업

**Phase 2**:
- T004, T005, T006 (타입 정의) - 동시 실행 가능

**Phase 4**:
- T015, T016 (옵션 버튼) - 동시 실행 가능
- T017, T018 (바텀시트 컨텐츠) - 동시 실행 가능

**Phase 6**:
- T028, T029 (키보드 접근성) - 동시 실행 가능

---

## 구현 전략

### MVP 범위 (최소 기능 제품)

**Phase 1-4 완료 시 MVP 달성**:
- ✅ FAB 버튼에서 바텀시트 열기
- ✅ 폼 입력 및 확인
- ✅ 기본 닫기 동작 (오버레이, 취소, ESC)
- ✅ Figma 디자인 100% 일치

**Phase 5-6: 향상된 UX**:
- 첨부파일 미리보기 기능
- 접근성 및 키보드 네비게이션

**Phase 7-8: 품질 보증**:
- UI 테스트
- 성능 최적화
- 문서화

### 점진적 전달 전략

1. **Week 1 (Day 1-3)**: Phase 1-3 완료
   - 기본 바텀시트 동작 확인 가능
   - 내부 리뷰 및 피드백

2. **Week 1 (Day 4-5)**: Phase 4 완료
   - Figma 디자인 구현 완료
   - 사용자 승인 단계 진입

3. **Week 2 (Day 6-8)**: Phase 5-6 완료
   - 미리보기 기능 및 접근성 구현
   - 기능 완성

4. **Week 2 (Day 9-12)**: Phase 7-8 완료
   - 테스트 및 최적화
   - 프로덕션 배포 준비

---

## 테스트 기준

### 각 사용자 스토리별 독립 테스트 기준

**US1: 이스터에그 생성 시작**
- [ ] FAB 버튼 클릭 시 바텀시트가 0.3초 이내에 표시됨
- [ ] 옵션 선택 시 시각적 피드백이 즉시 표시됨
- [ ] 옵션 미선택 시 확인 버튼이 비활성화됨
- [ ] 옵션 선택 시 확인 버튼이 활성화됨
- [ ] 확인 버튼 클릭 시 선택된 옵션으로 다음 단계 진행

**US1: 첨부파일 미리보기**
- [ ] 이미지 파일 선택 시 미리보기 표시
- [ ] 음원 버튼 클릭 시 모달 표시
- [ ] 음원 선택/녹음 후 미리보기 및 재생 가능
- [ ] 비디오 파일 선택 시 썸네일 미리보기 표시
- [ ] 모든 미리보기에서 삭제 기능 작동

**US3: 바텀시트 취소**
- [ ] 배경 오버레이 클릭 시 바텀시트가 닫힘
- [ ] 취소 버튼 클릭 시 바텀시트가 닫힘
- [ ] ESC 키 입력 시 바텀시트가 닫힘
- [ ] 닫힐 때 아래로 슬라이드 애니메이션 적용
- [ ] 닫힌 후 홈 화면으로 돌아감
- [ ] 바텀시트는 위아래로 드래그하지 않음 (드래그 기능 없음)

**US4: 키보드 네비게이션**
- [ ] 바텀시트 열릴 때 포커스가 바텀시트 내부로 이동
- [ ] Tab 키로 모든 인터랙티브 요소 탐색 가능
- [ ] Enter/Space 키로 버튼 활성화 가능
- [ ] ESC 키로 바텀시트 닫기 가능
- [ ] 바텀시트 닫힐 때 포커스가 FAB 버튼으로 복원

---

## 주의사항 및 체크리스트

### 개발 시 주의사항

**디자인 일관성**:
- [ ] Figma 디자인 스펙 100% 준수
- [ ] 디자인 토큰만 사용 (하드코딩된 색상값 금지)
- [ ] tailwind.config.js 수정 금지
- [ ] 375px 모바일 프레임 기준 구현
- [ ] **아이콘**: @remixicon/react만 사용 (새로운 아이콘 패키지 추가 금지)

**성능**:
- [ ] 애니메이션 60fps 유지
- [ ] 렌더링 시간 100ms 이하
- [ ] 드래그 응답 시간 16ms 이하
- [ ] 번들 크기 증가분 50KB 이하

**접근성**:
- [ ] WCAG 2.1 AA 레벨 준수
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 명도 대비 4.5:1 이상
- [ ] 터치 타겟 크기 44x44px 이상

**코드 품질**:
- [ ] TypeScript 타입 안전성 확보
- [ ] ESLint 및 Prettier 규칙 준수
- [ ] 컴포넌트 주석 작성 (JSDoc)
- [ ] 복잡한 로직에 주석 추가

---

## 다음 단계

작업 목록이 준비되었습니다. 구현을 시작하려면:

```
/speckit.implement
```

이 명령어는 작업 목록을 기반으로 단계별 구현을 시작합니다.

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-26  
**총 작업 수**: 38개  
**예상 소요 기간**: 7-12일
