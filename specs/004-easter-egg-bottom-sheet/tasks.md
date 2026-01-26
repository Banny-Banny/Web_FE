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
| US1 | 이스터에그 생성 시작 | 12개 |
| US2 | 바텀시트 드래그 조작 | 6개 |
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

## Phase 2: 기본 타입 정의 및 Mock 데이터

### 타입 정의

- [ ] T004 [P] src/components/home/components/easter-egg-bottom-sheet/types.ts 생성
  - EasterEggOption 인터페이스 정의
    - icon 필드: @remixicon/react 컴포넌트 이름 (string)
  - EasterEggSheetState 인터페이스 정의
  - EasterEggBottomSheetProps 인터페이스 정의
  - OptionButtonProps 인터페이스 정의
  - SheetContentProps 인터페이스 정의

- [ ] T005 [P] src/components/home/components/easter-egg-bottom-sheet/components/option-button/types.ts 생성
  - OptionButtonProps 타입 재export
  - 추가 내부 타입 정의 (필요 시)

- [ ] T006 [P] src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/types.ts 생성
  - SheetContentProps 타입 재export
  - 추가 내부 타입 정의 (필요 시)

### Mock 데이터

- [ ] T007 src/components/home/hooks/useEasterEggOptions.ts 생성
  - EASTER_EGG_OPTIONS Mock 데이터 정의
  - **아이콘**: @remixicon/react 컴포넌트 이름 사용 (예: 'RiFlashlightLine')
  - useEasterEggOptions Hook 구현
  - 파일: `src/components/home/hooks/useEasterEggOptions.ts`

---

## Phase 3: Phase 1 구현 - 기본 바텀시트 통합 및 상태 관리

### [US1] 이스터에그 생성 시작 - 기본 구조

- [ ] T008 [US1] src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet.ts 생성
  - 바텀시트 상태 관리 Hook 구현
  - isOpen, selectedOption, height, isDragging 상태 관리
  - handleOpen, handleClose, handleSelectOption 함수 구현
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet.ts`

- [ ] T009 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx 생성 (기본 구조)
  - 'use client' 지시어 추가
  - EasterEggBottomSheet 컴포넌트 기본 구조 작성
  - BottomSheet 공통 컴포넌트 import 및 사용
  - props 정의 및 기본 렌더링
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T010 [US1] src/components/home/components/easter-egg-bottom-sheet/styles.module.css 생성
  - 바텀시트 컨테이너 스타일
  - 디자인 토큰 기반 스타일링
  - 375px 모바일 프레임 기준
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/styles.module.css`

- [ ] T011 [US1] src/components/home/index.tsx 수정 - 바텀시트 상태 추가
  - easterEggSheetOpen 상태 추가
  - handleEasterEggClick 함수 수정 (바텀시트 열기)
  - handleEasterEggSheetClose 함수 추가
  - handleEasterEggConfirm 함수 추가 (임시 구현)
  - 파일: `src/components/home/index.tsx`

- [ ] T012 [US1] src/components/home/index.tsx 수정 - 바텀시트 렌더링
  - EasterEggBottomSheet 컴포넌트 import
  - JSX에 EasterEggBottomSheet 추가
  - isOpen, onClose, onConfirm props 연결
  - 파일: `src/components/home/index.tsx`

### [US3] 바텀시트 취소 - 닫기 동작

- [ ] T013 [US3] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 닫기 동작 구현
  - 배경 오버레이 클릭 시 닫기 (closeOnBackdropPress prop)
  - ESC 키 입력 시 닫기 (BottomSheet 기본 기능 활용)
  - 취소 버튼 클릭 시 닫기 (DualButton onCancelPress)
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

---

## Phase 4: Phase 2 구현 - Figma 디자인 기반 컨텐츠

### Figma 디자인 추출

- [ ] T014 Figma Dev Mode MCP를 통해 디자인 스펙 추출
  - 초기 상태 디자인 분석 (node-id=599-5186)
  - 확장 상태 디자인 분석 (node-id=599-5362)
  - 색상, 타이포그래피, 간격 토큰 확인
  - **아이콘 확인**: Figma 디자인의 아이콘을 @remixicon/react에서 찾아 매칭
  - **중요**: 새로운 아이콘 패키지 추가 금지, @remixicon/react만 사용
  - 참고: Figma MCP 사용 시 로컬호스트 소스 직접 사용

### [US1] 옵션 버튼 컴포넌트

- [ ] T015 [P] [US1] src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx 생성
  - 'use client' 지시어 추가
  - OptionButton 컴포넌트 구현
  - **아이콘 렌더링**: @remixicon/react 동적 import 사용
    - 예: `import * as RemixIcons from '@remixicon/react'`
    - 동적 렌더링: `const Icon = RemixIcons[option.icon]`
  - 선택 상태 시각적 표시 (isSelected prop)
  - 클릭 이벤트 핸들러
  - 접근성 속성 (aria-label, role)
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx`

- [ ] T016 [P] [US1] src/components/home/components/easter-egg-bottom-sheet/components/option-button/styles.module.css 생성
  - 옵션 버튼 기본 스타일
  - 선택 상태 스타일 (.selected)
  - 호버 및 포커스 스타일
  - 디자인 토큰 기반 스타일링
  - 터치 타겟 크기 44x44px 이상
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/option-button/styles.module.css`

### [US1] 바텀시트 컨텐츠 컴포넌트

- [ ] T017 [P] [US1] src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/index.tsx 생성
  - 'use client' 지시어 추가
  - SheetContent 컴포넌트 구현
  - 제목 및 설명 텍스트 렌더링
  - 옵션 버튼 목록 렌더링 (OptionButton 컴포넌트 사용)
  - 선택된 옵션 상태 관리
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/index.tsx`

- [ ] T018 [P] [US1] src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/styles.module.css 생성
  - 컨텐츠 컨테이너 스타일
  - 제목 및 설명 스타일 (Figma 타이포그래피)
  - 옵션 버튼 목록 레이아웃 (간격, 정렬)
  - 스크롤 가능 영역 스타일
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/styles.module.css`

### [US1] 바텀시트 통합 - DualButton

- [ ] T019 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 컨텐츠 및 버튼 통합
  - SheetContent 컴포넌트 import 및 사용
  - DualButton 컴포넌트 import (commons/components/dual-button)
  - BottomSheet의 children에 SheetContent 추가
  - BottomSheet의 footer에 DualButton 추가
  - 선택된 옵션에 따라 확인 버튼 활성화/비활성화
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T020 [US1] src/components/home/components/easter-egg-bottom-sheet/styles.module.css 수정 - 최종 스타일 조정
  - Figma 디자인과 100% 일치하도록 조정
  - 패딩, 마진, 간격 최종 확인
  - 색상 및 타이포그래피 최종 확인
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/styles.module.css`

---

## Phase 5: Phase 3 구현 - 드래그 인터랙션

### [US2] 바텀시트 드래그 조작

- [ ] T021 [US2] src/commons/components/bottom-sheet/hooks/useDragGesture.ts 생성 (선택적)
  - @use-gesture/react를 사용한 드래그 제스처 Hook
  - 최대 높이 70% 제한 로직
  - 드래그로 닫기 threshold 구현 (30%)
  - rubber band effect 구현 (70% 초과 시)
  - 파일: `src/commons/components/bottom-sheet/hooks/useDragGesture.ts`

- [ ] T022 [US2] src/commons/components/bottom-sheet/types.ts 수정 - 드래그 관련 props 추가
  - maxHeight prop 추가 (string | number)
  - draggable prop 추가 (boolean)
  - onDragEnd prop 추가 (함수)
  - 파일: `src/commons/components/bottom-sheet/types.ts`

- [ ] T023 [US2] src/commons/components/bottom-sheet/index.tsx 수정 - 드래그 기능 통합
  - useDragGesture Hook 사용
  - 드래그 핸들에 제스처 바인딩
  - 드래그 상태에 따른 높이 조정
  - 애니메이션 적용 (@react-spring/web)
  - 파일: `src/commons/components/bottom-sheet/index.tsx`

- [ ] T024 [US2] src/commons/components/bottom-sheet/styles.module.css 수정 - 드래그 애니메이션 스타일
  - GPU 가속 활용 (transform, will-change)
  - 드래그 중 스타일 (.dragging)
  - 트랜지션 애니메이션
  - 파일: `src/commons/components/bottom-sheet/styles.module.css`

- [ ] T025 [US2] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 드래그 props 전달
  - BottomSheet에 maxHeight="70vh" prop 전달
  - draggable={true} prop 전달
  - onDragEnd 핸들러 구현 (필요 시)
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T026 [US2] 드래그 인터랙션 성능 최적화
  - 60fps 유지 확인 (Chrome DevTools Performance)
  - requestAnimationFrame 사용 확인
  - 불필요한 리렌더링 방지 (React.memo, useCallback)
  - 파일: 전체 드래그 관련 파일

---

## Phase 6: Phase 4 구현 - 접근성 및 키보드 네비게이션

### [US4] 키보드 네비게이션

- [ ] T027 [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - 포커스 관리
  - 바텀시트 열릴 때 포커스를 첫 번째 옵션으로 이동
  - 바텀시트 닫힐 때 포커스를 FAB 버튼으로 복원
  - useEffect를 사용한 포커스 관리
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T028 [P] [US4] src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx 수정 - 키보드 접근성
  - Enter/Space 키로 버튼 활성화
  - 포커스 스타일 명확히 표시
  - tabIndex 적절히 설정
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx`

- [ ] T029 [P] [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx 수정 - ARIA 속성 추가
  - role="dialog" 추가
  - aria-modal="true" 추가
  - aria-labelledby 및 aria-describedby 추가
  - 모든 버튼에 aria-label 추가
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T030 [US4] src/commons/components/bottom-sheet/index.tsx 확인 - 포커스 트랩
  - 포커스 트랩이 올바르게 작동하는지 확인
  - Tab 키로 바텀시트 내부만 탐색 가능한지 확인
  - 필요 시 focus-trap-react 라이브러리 사용
  - 파일: `src/commons/components/bottom-sheet/index.tsx`

- [ ] T031 [US4] 접근성 검증 및 개선
  - 스크린 리더 테스트 (VoiceOver/NVDA)
  - 명도 대비 검증 (최소 4.5:1)
  - 터치 타겟 크기 검증 (최소 44x44px)
  - axe-core를 사용한 자동 검증
  - 파일: 전체 컴포넌트

---

## Phase 7: Phase 5 구현 - E2E 테스트

### E2E 테스트 작성 (Playwright)

- [ ] T032 tests/easter-egg-bottom-sheet.spec.ts 생성 - 기본 플로우 테스트
  - FAB 버튼 클릭 → 이스터에그 선택 → 바텀시트 열림 테스트
  - 옵션 선택 → 확인 버튼 활성화 테스트
  - 확인 버튼 클릭 → 다음 단계 진행 테스트
  - 파일: `tests/easter-egg-bottom-sheet.spec.ts`

- [ ] T033 tests/easter-egg-bottom-sheet.spec.ts 수정 - 닫기 동작 테스트
  - 배경 오버레이 클릭으로 닫기 테스트
  - 취소 버튼 클릭으로 닫기 테스트
  - ESC 키로 닫기 테스트
  - 파일: `tests/easter-egg-bottom-sheet.spec.ts`

- [ ] T034 tests/easter-egg-bottom-sheet.spec.ts 수정 - 드래그 인터랙션 테스트
  - 위로 드래그하여 확장 테스트
  - 아래로 드래그하여 닫기 테스트
  - 70% 최대 높이 제한 검증
  - 파일: `tests/easter-egg-bottom-sheet.spec.ts`

- [ ] T035 tests/easter-egg-bottom-sheet.spec.ts 수정 - 키보드 네비게이션 테스트
  - Tab 키로 옵션 탐색 테스트
  - Enter 키로 옵션 선택 테스트
  - 포커스 관리 검증 (열기/닫기 시)
  - 파일: `tests/easter-egg-bottom-sheet.spec.ts`

- [ ] T036 tests/easter-egg-bottom-sheet-a11y.spec.ts 생성 - 접근성 테스트
  - WCAG 2.1 AA 준수 검증 (axe-core)
  - 포커스 관리 검증
  - 스크린 리더 호환성 검증
  - 파일: `tests/easter-egg-bottom-sheet-a11y.spec.ts`

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
Phase 5 (T021-T026) - US2
  ↓
Phase 6 (T027-T031) - US4 (T028-T029 병렬 가능)
  ↓
Phase 7 (T032-T036) - E2E 테스트
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
- ✅ 옵션 선택 및 확인
- ✅ 기본 닫기 동작 (오버레이, 취소, ESC)
- ✅ Figma 디자인 100% 일치

**Phase 5-6: 향상된 UX**:
- 드래그 인터랙션
- 접근성 및 키보드 네비게이션

**Phase 7-8: 품질 보증**:
- E2E 테스트
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
   - 드래그 및 접근성 구현
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

**US2: 바텀시트 드래그 조작**
- [ ] 바텀시트를 위로 드래그하여 최대 70%까지 확장 가능
- [ ] 70%를 초과하면 rubber band effect 발생
- [ ] 바텀시트를 아래로 드래그하여 닫기 가능 (threshold: 30%)
- [ ] 드래그 동작이 60fps로 부드럽게 동작
- [ ] 드래그 중 다른 인터랙션 무시

**US3: 바텀시트 취소**
- [ ] 배경 오버레이 클릭 시 바텀시트가 닫힘
- [ ] 취소 버튼 클릭 시 바텀시트가 닫힘
- [ ] ESC 키 입력 시 바텀시트가 닫힘
- [ ] 닫힐 때 아래로 슬라이드 애니메이션 적용
- [ ] 닫힌 후 홈 화면으로 돌아감

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
