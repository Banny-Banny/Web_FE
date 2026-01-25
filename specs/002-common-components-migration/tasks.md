# 공통 컴포넌트 및 모달 프로바이더 마이그레이션 작업 목록

## 📋 개요

이 문서는 RN Expo 프로젝트에서 사용되던 공통 UI 컴포넌트와 전역 프로바이더를 Next.js 웹 애플리케이션으로 마이그레이션하기 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**총 작업 수**: 85개  
**우선순위**: P1 (필수) → P2 (중요) → P3 (선택)

---

## 🎯 Phase 1: 기존 코드 분석 및 Figma 디자인 확인

### T001: RN Expo 프로젝트 코드 분석
**목표**: 마이그레이션할 컴포넌트의 기존 구현 확인
**소요시간**: 30분
**의존성**: 없음

**작업 내용**:
1. RN Expo 프로젝트에서 다음 컴포넌트 코드 확인:
   - Button, DualButton, Spinner, BottomSheet, TimecapsuleHeader, Modal, Toast
2. 각 컴포넌트의 props 인터페이스 파악
3. 스타일링 방식 및 디자인 토큰 사용 방법 확인

**결과물**:
- 컴포넌트별 마이그레이션 매핑 테이블
- Props 인터페이스 비교 문서

**완료 기준**:
- [ ] 모든 컴포넌트의 기존 구현 확인 완료
- [ ] Props 인터페이스 파악 완료
- [ ] 스타일링 방식 파악 완료

---

### T002: Figma MCP 서버를 통한 디자인 스펙 추출
**목표**: 각 컴포넌트의 정확한 디자인 스펙 확인
**소요시간**: 1시간
**의존성**: 없음

**Figma 디자인 링크**:
- **Button**: 
  - [Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12778&t=uKOdETW1MjzS0ux4-4)
  - [Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12783&t=uKOdETW1MjzS0ux4-4)
  - [Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12790&t=uKOdETW1MjzS0ux4-4)
  - [Variant 4](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=535-887&t=uKOdETW1MjzS0ux4-4)
- **DualButton**: 
  - [Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=515-1370&t=uKOdETW1MjzS0ux4-4)
  - [Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12764&t=uKOdETW1MjzS0ux4-4)
  - [Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=541-984&t=uKOdETW1MjzS0ux4-4)
- **Toast**: 
  - [Toast 디자인](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12798&t=uKOdETW1MjzS0ux4-4)
- **TimecapsuleHeader**: 
  - [Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=356-703&t=uKOdETW1MjzS0ux4-4)
  - [Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=365-787&t=uKOdETW1MjzS0ux4-4)
  - [Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=420-5991&t=uKOdETW1MjzS0ux4-4)

**작업 내용**:
1. 위 Figma 디자인 링크를 통해 각 컴포넌트의 디자인 확인
2. Figma MCP 서버 연결 (구현 단계에서 제공될 주소 사용)
3. 각 컴포넌트의 Figma 프레임 선택
4. 디자인 토큰 추출:
   - 색상 (Color)
   - 간격 (Spacing)
   - 타이포그래피 (Typography)
   - 반경 (Radius)
5. 컴포넌트 크기 및 레이아웃 스펙 확인
6. 에셋 (이미지, SVG) 확인

**결과물**:
- 컴포넌트별 디자인 스펙 문서
- 디자인 토큰 매핑 테이블

**완료 기준**:
- [ ] 모든 컴포넌트의 Figma 디자인 스펙 추출 완료
- [ ] 디자인 토큰 매핑 완료
- [ ] 에셋 확인 완료

---

### T003: src/commons/styles 디자인 토큰 확인
**목표**: 프로젝트에 정의된 디자인 토큰 구조 파악
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `src/commons/styles/index.ts` 확인
2. 각 디자인 토큰 파일 확인:
   - `color.ts`: Colors 객체
   - `spacing.ts`: Spacing, BorderRadius 객체
   - `typography.ts`: Typography 객체
   - `fonts.ts`: FontFamily, FontWeight 객체
3. 디자인 토큰 사용 방법 파악

**결과물**:
- 디자인 토큰 사용 가이드

**완료 기준**:
- [ ] 모든 디자인 토큰 파일 확인 완료
- [ ] 디자인 토큰 사용 방법 파악 완료

---

### T004: 컴포넌트별 Props 인터페이스 설계
**목표**: 각 컴포넌트의 TypeScript 인터페이스 설계
**소요시간**: 1시간
**의존성**: T001, T002

**작업 내용**:
1. 각 컴포넌트의 Props 인터페이스 설계:
   - Button: variant, size, disabled, loading 등
   - DualButton: leftButton, rightButton
   - Spinner: size, color
   - BottomSheet: isOpen, onClose, children
   - TimecapsuleHeader: title, actions 등
   - Modal: isOpen, onClose, children, title
   - Toast: message, type, duration, onClose
2. Variant, Size 등 enum 타입 정의

**결과물**:
- 컴포넌트별 Props 인터페이스 설계 문서

**완료 기준**:
- [ ] 모든 컴포넌트의 Props 인터페이스 설계 완료
- [ ] enum 타입 정의 완료

---

## 🎯 Phase 2: 기본 UI 컴포넌트 마이그레이션 (Priority: P1)

### [US1] Button 컴포넌트

**Figma 디자인 링크**:
- [Button Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12778&t=uKOdETW1MjzS0ux4-4)
- [Button Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12783&t=uKOdETW1MjzS0ux4-4)
- [Button Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12790&t=uKOdETW1MjzS0ux4-4)
- [Button Variant 4](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=535-887&t=uKOdETW1MjzS0ux4-4)

#### T005 [US1]: Button 컴포넌트 타입 정의
**목표**: Button 컴포넌트의 Props 및 관련 타입 정의
**소요시간**: 15분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/button/types.ts` 파일 생성
2. `ButtonProps` 인터페이스 정의
3. `ButtonVariant`, `ButtonSize` enum 타입 정의

**생성할 파일**:
- `src/commons/components/button/types.ts`

**완료 기준**:
- [x] `ButtonProps` 인터페이스가 정의됨
- [x] `ButtonVariant`, `ButtonSize` enum이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T006 [US1]: Button 컴포넌트 CSS Module 스타일 작성
**목표**: Button 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T005, T002, T003

**Figma 디자인 참조**: 위 [Button 컴포넌트 Figma 디자인 링크](#us1-button-컴포넌트) 참조

**작업 내용**:
1. `src/commons/components/button/styles.module.css` 파일 생성
2. `src/commons/styles`에서 디자인 토큰 import
3. variant별 스타일 정의 (primary, secondary, outline, ghost)
4. size별 스타일 정의 (small, medium, large)
5. disabled, loading 상태 스타일 정의
6. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/button/styles.module.css`

**완료 기준**:
- [x] 모든 variant 스타일이 정의됨
- [x] 모든 size 스타일이 정의됨
- [x] disabled 상태 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T007 [US1]: Button 컴포넌트 구현
**목표**: Button 컴포넌트 기본 구조 구현
**소요시간**: 30분
**의존성**: T005, T006

**작업 내용**:
1. `src/commons/components/button/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. variant, size에 따른 className 조합
5. disabled, loading 상태 처리
6. onClick 핸들러 연결

**생성할 파일**:
- `src/commons/components/button/index.tsx`

**완료 기준**:
- [x] Button 컴포넌트가 정상적으로 렌더링됨
- [x] 모든 variant와 size가 정상 작동함
- [x] disabled 상태가 정상 작동함
- [x] onPress 핸들러가 정확히 실행됨

---

#### T008 [US1]: Button 컴포넌트 export 설정
**목표**: Button 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T007

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. Button 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [x] `@/commons/components`로 Button import 가능
- [x] Button 타입도 export됨
- [x] TypeScript 컴파일 에러 없음

---

### [US2] DualButton 컴포넌트

**Figma 디자인 링크**:
- [DualButton Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=515-1370&t=uKOdETW1MjzS0ux4-4)
- [DualButton Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12764&t=uKOdETW1MjzS0ux4-4)
- [DualButton Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=541-984&t=uKOdETW1MjzS0ux4-4)

#### T009 [US2]: DualButton 컴포넌트 타입 정의
**목표**: DualButton 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T004, T005

**작업 내용**:
1. `src/commons/components/dual-button/types.ts` 파일 생성
2. `DualButtonProps` 인터페이스 정의
3. 각 버튼의 props 타입 정의

**생성할 파일**:
- `src/commons/components/dual-button/types.ts`

**완료 기준**:
- [x] `DualButtonProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T010 [US2]: DualButton 컴포넌트 CSS Module 스타일 작성
**목표**: DualButton 컴포넌트의 스타일 정의
**소요시간**: 20분
**의존성**: T009, T002, T003

**Figma 디자인 참조**: 위 [DualButton 컴포넌트 Figma 디자인 링크](#us2-dualbutton-컴포넌트) 참조

**작업 내용**:
1. `src/commons/components/dual-button/styles.module.css` 파일 생성
2. 두 버튼을 나란히 배치하는 flexbox 스타일
3. 버튼 간 간격 스타일 (Spacing 토큰 사용)
4. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/dual-button/styles.module.css`

**완료 기준**:
- [x] 두 버튼이 나란히 배치되는 스타일이 정의됨
- [x] 버튼 간 간격이 올바르게 설정됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T011 [US2]: DualButton 컴포넌트 구현
**목표**: DualButton 컴포넌트 기본 구조 구현
**소요시간**: 30분
**의존성**: T009, T010, T007

**작업 내용**:
1. `src/commons/components/dual-button/index.tsx` 파일 생성
2. Button 컴포넌트 import
3. Props 타입 import 및 적용
4. CSS Module import 및 적용
5. 두 개의 Button 컴포넌트를 조합하여 렌더링
6. 각 버튼의 독립적인 onClick 핸들러 연결

**생성할 파일**:
- `src/commons/components/dual-button/index.tsx`

**완료 기준**:
- [x] DualButton 컴포넌트가 정상적으로 렌더링됨
- [x] 두 버튼이 나란히 표시됨
- [x] 각 버튼의 클릭 이벤트가 독립적으로 처리됨

---

#### T012 [US2]: DualButton 컴포넌트 export 설정
**목표**: DualButton 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T011

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. DualButton 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [x] `@/commons/components`로 DualButton import 가능
- [x] DualButton 타입도 export됨
- [x] TypeScript 컴파일 에러 없음

---

### [US5] Spinner 컴포넌트

#### T013 [US5]: Spinner 컴포넌트 타입 정의
**목표**: Spinner 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/spinner/types.ts` 파일 생성
2. `SpinnerProps` 인터페이스 정의
3. `SpinnerSize` enum 타입 정의

**생성할 파일**:
- `src/commons/components/spinner/types.ts`

**완료 기준**:
- [x] `SpinnerProps` 인터페이스가 정의됨
- [x] `SpinnerSize` 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T014 [US5]: Spinner 컴포넌트 CSS Module 스타일 작성
**목표**: Spinner 컴포넌트의 스타일 및 애니메이션 정의
**소요시간**: 30분
**의존성**: T013, T002, T003

**작업 내용**:
1. `src/commons/components/spinner/styles.module.css` 파일 생성
2. `src/commons/styles`에서 Colors 토큰 import
3. size별 스타일 정의 (small, medium, large)
4. CSS keyframes를 활용한 회전 애니메이션 정의
5. 60fps 유지를 위한 transform 활용
6. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/spinner/styles.module.css`

**완료 기준**:
- [x] 모든 size 스타일이 정의됨 (small, large)
- [x] 회전 애니메이션이 정의됨 (60fps 유지)
- [x] GPU 가속을 위한 transform 활용

---

#### T015 [US5]: Spinner 컴포넌트 구현
**목표**: Spinner 컴포넌트 기본 구조 구현
**소요시간**: 20분
**의존성**: T013, T014

**작업 내용**:
1. `src/commons/components/spinner/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. size에 따른 className 조합
5. 애니메이션 적용

**생성할 파일**:
- `src/commons/components/spinner/index.tsx`

**완료 기준**:
- [x] Spinner 컴포넌트가 정상적으로 렌더링됨
- [x] 모든 size가 정상 작동함
- [x] 애니메이션이 부드럽게 작동함 (60fps)

---

#### T016 [US5]: Spinner 컴포넌트 export 설정
**목표**: Spinner 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T015

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. Spinner 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [x] `@/commons/components`로 Spinner import 가능
- [x] Spinner 타입도 export됨
- [x] TypeScript 컴파일 에러 없음

---

### [US7] TimecapsuleHeader 컴포넌트

**Figma 디자인 링크**:
- [TimecapsuleHeader Variant 1](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=356-703&t=uKOdETW1MjzS0ux4-4)
- [TimecapsuleHeader Variant 2](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=365-787&t=uKOdETW1MjzS0ux4-4)
- [TimecapsuleHeader Variant 3](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=420-5991&t=uKOdETW1MjzS0ux4-4)

#### T017 [US7]: TimecapsuleHeader 컴포넌트 타입 정의
**목표**: TimecapsuleHeader 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/timecapsule-header/types.ts` 파일 생성
2. `TimecapsuleHeaderProps` 인터페이스 정의
3. 헤더 구성 요소 타입 정의 (제목, 버튼 등)

**생성할 파일**:
- `src/commons/components/timecapsule-header/types.ts`

**완료 기준**:
- [ ] `TimecapsuleHeaderProps` 인터페이스가 정의됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T018 [US7]: TimecapsuleHeader 컴포넌트 CSS Module 스타일 작성
**목표**: TimecapsuleHeader 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T017, T002, T003

**Figma 디자인 참조**: 위 [TimecapsuleHeader 컴포넌트 Figma 디자인 링크](#us7-timecapsuleheader-컴포넌트) 참조

**작업 내용**:
1. `src/commons/components/timecapsule-header/styles.module.css` 파일 생성
2. `src/commons/styles`에서 디자인 토큰 import
3. 헤더 레이아웃 스타일 정의
4. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/timecapsule-header/styles.module.css`

**완료 기준**:
- [ ] 헤더 레이아웃 스타일이 정의됨
- [ ] 디자인 토큰이 올바르게 사용됨

---

#### T019 [US7]: TimecapsuleHeader 컴포넌트 구현
**목표**: TimecapsuleHeader 컴포넌트 기본 구조 구현
**소요시간**: 30분
**의존성**: T017, T018

**작업 내용**:
1. `src/commons/components/timecapsule-header/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. 헤더 구성 요소 렌더링 (제목, 버튼 등)
5. 인터랙티브 요소 핸들러 연결

**생성할 파일**:
- `src/commons/components/timecapsule-header/index.tsx`

**완료 기준**:
- [ ] TimecapsuleHeader 컴포넌트가 정상적으로 렌더링됨
- [ ] 헤더 내 모든 인터랙티브 요소가 정상 작동함

---

#### T020 [US7]: TimecapsuleHeader 컴포넌트 export 설정
**목표**: TimecapsuleHeader 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T019

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. TimecapsuleHeader 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [ ] `@/commons/components`로 TimecapsuleHeader import 가능
- [ ] TimecapsuleHeader 타입도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 3: 인터랙티브 컴포넌트 마이그레이션 (Priority: P1)

### [US6] BottomSheet 컴포넌트

#### T021 [US6]: BottomSheet 컴포넌트 타입 정의
**목표**: BottomSheet 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/bottom-sheet/types.ts` 파일 생성
2. `BottomSheetProps` 인터페이스 정의
3. 옵션 선택 핸들러 타입 정의

**생성할 파일**:
- `src/commons/components/bottom-sheet/types.ts`

**완료 기준**:
- [ ] `BottomSheetProps` 인터페이스가 정의됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T022 [US6]: BottomSheet 컴포넌트 CSS Module 스타일 작성
**목표**: BottomSheet 컴포넌트의 스타일 및 애니메이션 정의
**소요시간**: 40분
**의존성**: T021, T002, T003

**작업 내용**:
1. `src/commons/components/bottom-sheet/styles.module.css` 파일 생성
2. `src/commons/styles`에서 디자인 토큰 import
3. 오버레이 스타일 정의 (Colors.black[500] + opacity)
4. 바텀시트 컨테이너 스타일 정의
5. 하단에서 올라오는 애니메이션 정의 (transform: translateY)
6. 오버레이 fade-in/out 애니메이션 정의
7. 300ms transition 설정
8. 상단 모서리 반경 적용 (BorderRadius 토큰)
9. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/bottom-sheet/styles.module.css`

**완료 기준**:
- [ ] 오버레이 스타일이 정의됨
- [ ] 바텀시트 컨테이너 스타일이 정의됨
- [ ] 애니메이션이 정의됨 (300ms)
- [ ] 디자인 토큰이 올바르게 사용됨

---

#### T023 [US6]: BottomSheet 컴포넌트 구현
**목표**: BottomSheet 컴포넌트 기본 구조 및 상호작용 구현
**소요시간**: 45분
**의존성**: T021, T022

**작업 내용**:
1. `src/commons/components/bottom-sheet/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. isOpen 상태에 따른 렌더링
5. 오버레이 클릭 시 onClose 핸들러 실행
6. 옵션 선택 핸들러 연결
7. 브라우저 뒤로가기 처리 (선택적)

**생성할 파일**:
- `src/commons/components/bottom-sheet/index.tsx`

**완료 기준**:
- [ ] BottomSheet 컴포넌트가 정상적으로 렌더링됨
- [ ] 하단에서 올라오는 애니메이션이 부드럽게 작동함
- [ ] 오버레이 클릭 시 닫힘
- [ ] 옵션 선택 시 핸들러가 실행됨

---

#### T024 [US6]: BottomSheet 컴포넌트 export 설정
**목표**: BottomSheet 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T023

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. BottomSheet 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [ ] `@/commons/components`로 BottomSheet import 가능
- [ ] BottomSheet 타입도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

### [US3] Modal 컴포넌트 (기본)

#### T025 [US3]: Modal 컴포넌트 타입 정의
**목표**: Modal 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/modal/types.ts` 파일 생성
2. `ModalProps` 인터페이스 정의
3. 모달 옵션 타입 정의

**생성할 파일**:
- `src/commons/components/modal/types.ts`

**완료 기준**:
- [ ] `ModalProps` 인터페이스가 정의됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T026 [US3]: Modal 컴포넌트 CSS Module 스타일 작성
**목표**: Modal 컴포넌트의 스타일 정의
**소요시간**: 40분
**의존성**: T025, T002, T003

**작업 내용**:
1. `src/commons/components/modal/styles.module.css` 파일 생성
2. `src/commons/styles`에서 디자인 토큰 import
3. 오버레이 스타일 정의 (Colors.black[500] + opacity)
4. 모달 컨테이너 스타일 정의 (화면 중앙 배치, fixed positioning)
5. 모달 배경 스타일 (Colors.white[500])
6. 간격 스타일 (Spacing 토큰)
7. 반경 스타일 (BorderRadius.lg 또는 BorderRadius.xl)
8. 타이포그래피 스타일 (Typography 토큰)
9. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/modal/styles.module.css`

**완료 기준**:
- [ ] 오버레이 스타일이 정의됨
- [ ] 모달 컨테이너 스타일이 정의됨
- [ ] 디자인 토큰이 올바르게 사용됨

---

#### T027 [US3]: Modal 컴포넌트 구현
**목표**: Modal 컴포넌트 기본 구조 및 상호작용 구현
**소요시간**: 45분
**의존성**: T025, T026

**작업 내용**:
1. `src/commons/components/modal/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. isOpen 상태에 따른 렌더링
5. 화면 중앙 배치 (fixed positioning)
6. 오버레이 클릭 시 onClose 핸들러 실행
7. 확인/취소 버튼 핸들러 연결
8. 포커스 트랩 구현 (접근성)

**생성할 파일**:
- `src/commons/components/modal/index.tsx`

**완료 기준**:
- [ ] Modal 컴포넌트가 정상적으로 렌더링됨
- [ ] 화면 중앙에 정확히 배치됨
- [ ] 오버레이 클릭 시 닫힘
- [ ] 확인/취소 버튼이 정상 작동함
- [ ] 포커스 트랩이 작동함

---

#### T028 [US3]: Modal 컴포넌트 export 설정
**목표**: Modal 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T027

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. Modal 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [ ] `@/commons/components`로 Modal import 가능
- [ ] Modal 타입도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

### [US4] Toast 컴포넌트 (기본)

**Figma 디자인 링크**:
- [Toast 디자인](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=506-12798&t=uKOdETW1MjzS0ux4-4)

#### T029 [US4]: Toast 컴포넌트 타입 정의
**목표**: Toast 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T004

**작업 내용**:
1. `src/commons/components/toast/types.ts` 파일 생성
2. `ToastProps` 인터페이스 정의
3. `ToastType` enum 타입 정의 (success, error, info, warning)

**생성할 파일**:
- `src/commons/components/toast/types.ts`

**완료 기준**:
- [ ] `ToastProps` 인터페이스가 정의됨
- [ ] `ToastType` enum이 정의됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T030 [US4]: Toast 컴포넌트 CSS Module 스타일 작성
**목표**: Toast 컴포넌트의 스타일 정의
**소요시간**: 40분
**의존성**: T029, T002, T003

**Figma 디자인 참조**: 위 [Toast 컴포넌트 Figma 디자인 링크](#us4-toast-컴포넌트-기본) 참조

**작업 내용**:
1. `src/commons/components/toast/styles.module.css` 파일 생성
2. `src/commons/styles`에서 디자인 토큰 import
3. 타입별 배경색 스타일 정의:
   - success: Colors.green[500]
   - error: Colors.red[500]
   - info: Colors.blue[500]
   - warning: Colors.yellow[500]
4. 텍스트 색상 스타일 (Colors.white[500] 또는 Colors.black[500])
5. 간격 스타일 (Spacing 토큰)
6. 반경 스타일 (BorderRadius 토큰)
7. 타이포그래피 스타일 (Typography.body 또는 Typography.caption)
8. 화면 상단/하단 고정 스타일
9. Figma 디자인과 정확히 일치하도록 스타일 적용

**생성할 파일**:
- `src/commons/components/toast/styles.module.css`

**완료 기준**:
- [ ] 모든 타입별 스타일이 정의됨
- [ ] 디자인 토큰이 올바르게 사용됨

---

#### T031 [US4]: Toast 컴포넌트 구현
**목표**: Toast 컴포넌트 기본 구조 및 자동 사라짐 기능 구현
**소요시간**: 45분
**의존성**: T029, T030

**작업 내용**:
1. `src/commons/components/toast/index.tsx` 파일 생성
2. Props 타입 import 및 적용
3. CSS Module import 및 적용
4. 타입별 스타일 적용
5. 자동 사라짐 타이머 구현 (duration props)
6. 수동 닫기 기능 구현 (선택적)
7. 화면 상단/하단 배치

**생성할 파일**:
- `src/commons/components/toast/index.tsx`

**완료 기준**:
- [ ] Toast 컴포넌트가 정상적으로 렌더링됨
- [ ] 모든 타입이 정상 작동함
- [ ] 자동 사라짐 기능이 정상 작동함
- [ ] 수동 닫기 기능이 정상 작동함 (선택적)

---

#### T032 [US4]: Toast 컴포넌트 export 설정
**목표**: Toast 컴포넌트를 commons/components에서 export
**소요시간**: 5분
**의존성**: T031

**작업 내용**:
1. `src/commons/components/index.ts` 파일 수정
2. Toast 컴포넌트 및 타입 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [ ] `@/commons/components`로 Toast import 가능
- [ ] Toast 타입도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 4: 전역 프로바이더 구현 (Priority: P1)

### [US3] Modal Provider

#### T033 [US3]: Modal Context 생성
**목표**: Modal 상태 관리를 위한 Context 생성
**소요시간**: 30분
**의존성**: T027

**작업 내용**:
1. `src/commons/providers/modal-provider/modal-context.tsx` 파일 생성
2. React Context API로 ModalContext 생성
3. 모달 상태 타입 정의 (id, content, options 등)
4. 모달 스택 상태 관리
5. z-index 관리 로직

**생성할 파일**:
- `src/commons/providers/modal-provider/modal-context.tsx`

**완료 기준**:
- [ ] ModalContext가 생성됨
- [ ] 모달 스택 상태 관리 로직이 구현됨
- [ ] z-index 관리 로직이 구현됨

---

#### T034 [US3]: useModal 훅 구현
**목표**: Modal을 쉽게 사용할 수 있는 커스텀 훅 구현
**소요시간**: 30분
**의존성**: T033

**작업 내용**:
1. `src/commons/providers/modal-provider/use-modal.ts` 파일 생성
2. `useModal` 훅 구현
3. `openModal` 함수 구현 (content, options)
4. `closeModal` 함수 구현 (id)
5. `closeAll` 함수 구현
6. 모달 ID 생성 로직

**생성할 파일**:
- `src/commons/providers/modal-provider/use-modal.ts`

**완료 기준**:
- [ ] `useModal` 훅이 구현됨
- [ ] `openModal`, `closeModal`, `closeAll` 함수가 구현됨
- [ ] 모달 ID 생성 로직이 구현됨

---

#### T035 [US3]: Modal Provider 컴포넌트 구현
**목표**: Modal Provider 컴포넌트 구현
**소요시간**: 40분
**의존성**: T033, T034, T027

**작업 내용**:
1. `src/commons/providers/modal-provider/index.tsx` 파일 생성
2. ModalContext.Provider 구현
3. 모달 스택을 순회하며 Modal 컴포넌트 렌더링
4. z-index 자동 관리
5. 포커스 트랩 구현

**생성할 파일**:
- `src/commons/providers/modal-provider/index.tsx`

**완료 기준**:
- [ ] ModalProvider 컴포넌트가 구현됨
- [ ] 여러 모달이 동시에 표시될 수 있음
- [ ] z-index가 올바르게 관리됨
- [ ] 포커스 트랩이 작동함

---

#### T036 [US3]: Modal Provider export 설정
**목표**: Modal Provider를 commons/providers에서 export
**소요시간**: 5분
**의존성**: T035

**작업 내용**:
1. `src/commons/providers/index.tsx` 파일 수정
2. ModalProvider 및 useModal export 추가

**수정할 파일**:
- `src/commons/providers/index.tsx`

**완료 기준**:
- [ ] `@/commons/providers`로 ModalProvider import 가능
- [ ] `useModal` 훅도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

### [US4] Toast Provider

#### T037 [US4]: Toast Context 생성
**목표**: Toast 상태 관리를 위한 Context 생성
**소요시간**: 30분
**의존성**: T031

**작업 내용**:
1. `src/commons/providers/toast-provider/toast-context.tsx` 파일 생성
2. React Context API로 ToastContext 생성
3. 토스트 상태 타입 정의 (id, message, type, duration 등)
4. 토스트 큐 상태 관리

**생성할 파일**:
- `src/commons/providers/toast-provider/toast-context.tsx`

**완료 기준**:
- [ ] ToastContext가 생성됨
- [ ] 토스트 큐 상태 관리 로직이 구현됨

---

#### T038 [US4]: useToast 훅 구현
**목표**: Toast를 쉽게 사용할 수 있는 커스텀 훅 구현
**소요시간**: 30분
**의존성**: T037

**작업 내용**:
1. `src/commons/providers/toast-provider/use-toast.ts` 파일 생성
2. `useToast` 훅 구현
3. `showToast` 함수 구현 (message, type, options)
4. `removeToast` 함수 구현 (id)
5. 토스트 ID 생성 로직
6. 자동 사라짐 타이머 관리

**생성할 파일**:
- `src/commons/providers/toast-provider/use-toast.ts`

**완료 기준**:
- [ ] `useToast` 훅이 구현됨
- [ ] `showToast`, `removeToast` 함수가 구현됨
- [ ] 토스트 ID 생성 로직이 구현됨
- [ ] 자동 사라짐 타이머 관리 로직이 구현됨

---

#### T039 [US4]: Toast Provider 컴포넌트 구현
**목표**: Toast Provider 컴포넌트 구현
**소요시간**: 40분
**의존성**: T037, T038, T031

**작업 내용**:
1. `src/commons/providers/toast-provider/index.tsx` 파일 생성
2. ToastContext.Provider 구현
3. 토스트 큐를 순회하며 Toast 컴포넌트 렌더링
4. 여러 토스트 순차 표시 (겹침 없이)
5. 자동 사라짐 타이머 관리

**생성할 파일**:
- `src/commons/providers/toast-provider/index.tsx`

**완료 기준**:
- [ ] ToastProvider 컴포넌트가 구현됨
- [ ] 여러 토스트가 순차적으로 표시됨
- [ ] 토스트 간 겹침이 없음
- [ ] 자동 사라짐 기능이 정상 작동함

---

#### T040 [US4]: Toast Provider export 설정
**목표**: Toast Provider를 commons/providers에서 export
**소요시간**: 5분
**의존성**: T039

**작업 내용**:
1. `src/commons/providers/index.tsx` 파일 수정
2. ToastProvider 및 useToast export 추가

**수정할 파일**:
- `src/commons/providers/index.tsx`

**완료 기준**:
- [ ] `@/commons/providers`로 ToastProvider import 가능
- [ ] `useToast` 훅도 export됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T041: 전역 프로바이더 통합 및 앱 레이아웃에 마운트
**목표**: 모든 프로바이더를 통합하고 앱 레이아웃에 마운트
**소요시간**: 20분
**의존성**: T035, T039

**작업 내용**:
1. `src/commons/providers/index.tsx` 파일 확인 및 수정
2. 모든 프로바이더를 통합하는 Providers 컴포넌트 확인
3. `src/app/layout.tsx` 파일 확인
4. Providers 컴포넌트를 앱 레이아웃에 마운트
5. ModalProvider, ToastProvider가 포함되어 있는지 확인

**수정할 파일**:
- `src/commons/providers/index.tsx`
- `src/app/layout.tsx`

**완료 기준**:
- [ ] 모든 프로바이더가 통합됨
- [ ] 앱 레이아웃에 프로바이더가 마운트됨
- [ ] 프로바이더가 정상적으로 작동함

---

## 🎯 Phase 5: 컴포넌트 미리보기 페이지 구성 (Priority: P1)

### [US8] 컴포넌트 미리보기 페이지

#### T042 [US8]: 미리보기 페이지 기본 구조 생성
**목표**: 컴포넌트 미리보기 페이지의 기본 구조 생성
**소요시간**: 20분
**의존성**: T008, T012, T016, T020, T024, T028, T032

**작업 내용**:
1. `src/app/(main)/page.tsx` 파일 수정
2. 라우팅 전용 규칙 준수 (컴포넌트 import만)
3. 모든 공통 컴포넌트 import
4. 섹션별 구조 생성 (각 컴포넌트별 섹션)

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] 미리보기 페이지 기본 구조가 생성됨
- [ ] 모든 컴포넌트가 import됨
- [ ] 섹션별 구조가 생성됨

---

#### T043 [US8]: Button 컴포넌트 미리보기 섹션 구현
**목표**: Button 컴포넌트의 모든 variant, size, 상태 표시
**소요시간**: 30분
**의존성**: T042, T008

**작업 내용**:
1. Button 섹션 추가
2. 모든 variant 표시 (primary, secondary, outline, ghost)
3. 모든 size 표시 (small, medium, large)
4. disabled, loading 상태 표시
5. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] Button 섹션이 표시됨
- [ ] 모든 variant와 size가 표시됨
- [ ] disabled, loading 상태가 표시됨

---

#### T044 [US8]: DualButton 컴포넌트 미리보기 섹션 구현
**목표**: DualButton 컴포넌트 표시
**소요시간**: 20분
**의존성**: T042, T012

**작업 내용**:
1. DualButton 섹션 추가
2. 다양한 조합의 DualButton 표시
3. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] DualButton 섹션이 표시됨
- [ ] 다양한 조합이 표시됨

---

#### T045 [US8]: Spinner 컴포넌트 미리보기 섹션 구현
**목표**: Spinner 컴포넌트의 모든 size 표시
**소요시간**: 20분
**의존성**: T042, T016

**작업 내용**:
1. Spinner 섹션 추가
2. 모든 size 표시 (small, medium, large)
3. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] Spinner 섹션이 표시됨
- [ ] 모든 size가 표시됨

---

#### T046 [US8]: BottomSheet 컴포넌트 미리보기 섹션 구현
**목표**: BottomSheet 컴포넌트 트리거 버튼 및 동작 확인
**소요시간**: 30분
**의존성**: T042, T024

**작업 내용**:
1. BottomSheet 섹션 추가
2. BottomSheet를 열 수 있는 트리거 버튼 추가
3. BottomSheet 컴포넌트 렌더링
4. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] BottomSheet 섹션이 표시됨
- [ ] 트리거 버튼이 작동함
- [ ] BottomSheet가 정상적으로 열리고 닫힘

---

#### T047 [US8]: TimecapsuleHeader 컴포넌트 미리보기 섹션 구현
**목표**: TimecapsuleHeader 컴포넌트 표시
**소요시간**: 20분
**의존성**: T042, T020

**작업 내용**:
1. TimecapsuleHeader 섹션 추가
2. TimecapsuleHeader 컴포넌트 표시
3. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] TimecapsuleHeader 섹션이 표시됨
- [ ] 컴포넌트가 정상적으로 렌더링됨

---

#### T048 [US8]: Modal 컴포넌트 미리보기 섹션 구현
**목표**: Modal 컴포넌트 트리거 버튼 및 동작 확인
**소요시간**: 30분
**의존성**: T042, T028, T041

**작업 내용**:
1. Modal 섹션 추가
2. Modal을 열 수 있는 트리거 버튼 추가
3. useModal 훅을 사용하여 Modal 열기/닫기
4. 여러 Modal 동시 열기 테스트
5. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] Modal 섹션이 표시됨
- [ ] 트리거 버튼이 작동함
- [ ] Modal이 정상적으로 열리고 닫힘
- [ ] 여러 Modal이 동시에 열릴 수 있음

---

#### T049 [US8]: Toast 컴포넌트 미리보기 섹션 구현
**목표**: Toast 컴포넌트 각 타입별 트리거 버튼 및 동작 확인
**소요시간**: 30분
**의존성**: T042, T032, T041

**작업 내용**:
1. Toast 섹션 추가
2. 각 타입별 트리거 버튼 추가 (success, error, info, warning)
3. useToast 훅을 사용하여 Toast 표시
4. 여러 Toast 동시 표시 테스트
5. 컴포넌트 이름 및 설명 추가

**수정할 파일**:
- `src/app/(main)/page.tsx`

**완료 기준**:
- [ ] Toast 섹션이 표시됨
- [ ] 모든 타입별 트리거 버튼이 작동함
- [ ] Toast가 정상적으로 표시되고 사라짐
- [ ] 여러 Toast가 순차적으로 표시됨

---

## 🎯 Phase 6: 타입 정의 및 통합 익스포트

#### T050: 모든 컴포넌트 타입 정의 검증
**목표**: 모든 컴포넌트의 타입 정의가 완료되었는지 검증
**소요시간**: 30분
**의존성**: T005, T009, T013, T017, T021, T025, T029

**작업 내용**:
1. 모든 컴포넌트의 types.ts 파일 확인
2. Props 인터페이스가 완전한지 확인
3. enum 타입이 모두 정의되었는지 확인
4. TypeScript 컴파일 에러 확인

**완료 기준**:
- [ ] 모든 컴포넌트의 타입 정의가 완료됨
- [ ] TypeScript 컴파일 에러 없음

---

#### T051: src/commons/components/index.ts 통합 익스포트 완성
**목표**: 모든 컴포넌트와 타입을 통합 익스포트
**소요시간**: 15분
**의존성**: T008, T012, T016, T020, T024, T028, T032

**작업 내용**:
1. `src/commons/components/index.ts` 파일 확인
2. 모든 컴포넌트 export 확인
3. 모든 타입 export 확인
4. 누락된 export 추가

**수정할 파일**:
- `src/commons/components/index.ts`

**완료 기준**:
- [ ] 모든 컴포넌트가 export됨
- [ ] 모든 타입이 export됨
- [ ] `@/commons/components`로 모든 컴포넌트 import 가능

---

#### T052: src/commons/providers/index.tsx 통합 익스포트 완성
**목표**: 모든 프로바이더와 훅을 통합 익스포트
**소요시간**: 10분
**의존성**: T036, T040

**작업 내용**:
1. `src/commons/providers/index.tsx` 파일 확인
2. 모든 프로바이더 export 확인
3. 모든 훅 export 확인
4. 누락된 export 추가

**수정할 파일**:
- `src/commons/providers/index.tsx`

**완료 기준**:
- [ ] 모든 프로바이더가 export됨
- [ ] 모든 훅이 export됨
- [ ] `@/commons/providers`로 모든 프로바이더 import 가능

---

## 🎯 Phase 7: 스타일링 및 디자인 토큰 적용

#### T053: 모든 컴포넌트의 디자인 토큰 사용 검증
**목표**: 모든 컴포넌트가 src/commons/styles의 디자인 토큰을 올바르게 사용하는지 검증
**소요시간**: 1시간
**의존성**: T006, T010, T014, T018, T022, T026, T030

**작업 내용**:
1. 각 컴포넌트의 styles.module.css 파일 확인
2. 디자인 토큰 import 확인
3. 하드코딩된 값이 없는지 확인
4. Figma 디자인과 일치하는지 확인
5. 소수점 값 반올림 확인

**완료 기준**:
- [ ] 모든 컴포넌트가 디자인 토큰을 사용함
- [ ] 하드코딩된 값이 없음
- [ ] Figma 디자인과 일치함

---

#### T054: Figma MCP를 통한 최종 디자인 검증
**목표**: Figma 디자인과 구현된 컴포넌트의 최종 검증
**소요시간**: 1시간
**의존성**: T053

**작업 내용**:
1. Figma MCP 서버를 통해 각 컴포넌트의 디자인 재확인
2. 구현된 컴포넌트와 Figma 디자인 비교
3. 차이점이 있으면 수정
4. 모든 컴포넌트의 크기, 간격, 색상, 스타일이 정확히 일치하는지 확인

**완료 기준**:
- [ ] 모든 컴포넌트가 Figma 디자인과 100% 일치함
- [ ] 차이점이 없음

---

## 🎯 Phase 8: 접근성 및 최적화

#### T055: 모든 인터랙티브 컴포넌트에 aria-label 추가
**목표**: 접근성 요구사항 충족
**소요시간**: 30분
**의존성**: T007, T011, T023, T027, T031

**작업 내용**:
1. Button, DualButton, BottomSheet, Modal, Toast 컴포넌트 확인
2. 각 컴포넌트에 적절한 aria-label 추가
3. 스크린 리더가 이해할 수 있는 라벨 작성

**수정할 파일**:
- `src/commons/components/button/index.tsx`
- `src/commons/components/dual-button/index.tsx`
- `src/commons/components/bottom-sheet/index.tsx`
- `src/commons/components/modal/index.tsx`
- `src/commons/components/toast/index.tsx`

**완료 기준**:
- [ ] 모든 인터랙티브 컴포넌트에 aria-label이 추가됨
- [ ] 스크린 리더가 올바르게 읽을 수 있음

---

#### T056: 키보드 네비게이션 지원 구현
**목표**: 키보드로 모든 컴포넌트에 접근 가능하도록 구현
**소요시간**: 45분
**의존성**: T055

**작업 내용**:
1. 모든 컴포넌트에 키보드 이벤트 핸들러 추가
2. Tab 키로 포커스 이동 가능하도록 구현
3. Enter/Space 키로 클릭 가능하도록 구현
4. Escape 키로 모달/바텀시트 닫기 구현

**수정할 파일**:
- `src/commons/components/button/index.tsx`
- `src/commons/components/dual-button/index.tsx`
- `src/commons/components/bottom-sheet/index.tsx`
- `src/commons/components/modal/index.tsx`

**완료 기준**:
- [ ] 모든 컴포넌트가 키보드로 접근 가능함
- [ ] Tab, Enter, Space, Escape 키가 정상 작동함

---

#### T057: 모달 포커스 트랩 강화
**목표**: 모달이 열릴 때 포커스가 모달 내부로 이동하고, 닫힐 때 원래 위치로 복귀
**소요시간**: 30분
**의존성**: T027, T035

**작업 내용**:
1. Modal 컴포넌트에 포커스 트랩 로직 강화
2. 모달이 열릴 때 첫 번째 포커스 가능한 요소로 포커스 이동
3. 모달이 닫힐 때 이전 포커스 위치로 복귀
4. Tab 키가 모달 내부에서만 순환하도록 구현

**수정할 파일**:
- `src/commons/components/modal/index.tsx`
- `src/commons/providers/modal-provider/index.tsx`

**완료 기준**:
- [ ] 모달이 열릴 때 포커스가 모달 내부로 이동함
- [ ] 모달이 닫힐 때 원래 위치로 복귀함
- [ ] Tab 키가 모달 내부에서만 순환함

---

#### T058: 최소 터치 타겟 크기 보장
**목표**: 모든 버튼의 최소 터치 타겟 크기가 44px × 44px 이상이 되도록 보장
**소요시간**: 20분
**의존성**: T006, T010

**작업 내용**:
1. Button, DualButton 컴포넌트의 스타일 확인
2. 최소 터치 타겟 크기 44px × 44px 보장
3. 필요시 padding 조정

**수정할 파일**:
- `src/commons/components/button/styles.module.css`
- `src/commons/components/dual-button/styles.module.css`

**완료 기준**:
- [ ] 모든 버튼의 최소 터치 타겟 크기가 44px × 44px 이상
- [ ] 모바일 환경에서 터치하기 쉬움

---

#### T059: 색상 대비 WCAG AA 기준 준수 확인
**목표**: 모든 텍스트와 배경의 색상 대비가 WCAG AA 기준을 만족하는지 확인
**소요시간**: 30분
**의존성**: T053

**작업 내용**:
1. 각 컴포넌트의 텍스트와 배경 색상 확인
2. 색상 대비 비율 계산
3. WCAG AA 기준 (4.5:1) 만족 여부 확인
4. 기준을 만족하지 않는 경우 색상 조정

**완료 기준**:
- [ ] 모든 텍스트와 배경의 색상 대비가 WCAG AA 기준을 만족함
- [ ] 접근성 도구로 검증 완료

---

#### T060: 컴포넌트 렌더링 성능 최적화
**목표**: 컴포넌트 초기 렌더링 시간 100ms 이하 달성
**소요시간**: 45분
**의존성**: T007, T011, T015, T019, T023, T027, T031

**작업 내용**:
1. React.memo를 활용한 불필요한 리렌더링 방지
2. useMemo, useCallback을 활용한 최적화
3. 컴포넌트 렌더링 시간 측정
4. 성능 병목 지점 개선

**수정할 파일**:
- 각 컴포넌트의 index.tsx 파일

**완료 기준**:
- [ ] 컴포넌트 초기 렌더링 시간이 100ms 이하
- [ ] 불필요한 리렌더링이 방지됨

---

#### T061: 애니메이션 성능 최적화
**목표**: 애니메이션이 60fps로 부드럽게 작동하도록 최적화
**소요시간**: 30분
**의존성**: T014, T022

**작업 내용**:
1. Spinner, BottomSheet 애니메이션 확인
2. transform, opacity 등 GPU 가속 속성 활용
3. will-change 속성 활용
4. 애니메이션 프레임 레이트 측정

**수정할 파일**:
- `src/commons/components/spinner/styles.module.css`
- `src/commons/components/bottom-sheet/styles.module.css`

**완료 기준**:
- [ ] 애니메이션이 60fps로 부드럽게 작동함
- [ ] GPU 가속 속성이 활용됨

---

## 🎯 Phase 9: 테스트 및 문서화

#### T062: Button 컴포넌트 테스트
**목표**: Button 컴포넌트의 기본 동작 테스트
**소요시간**: 20분
**의존성**: T007

**작업 내용**:
1. Button 컴포넌트의 기본 렌더링 테스트
2. 모든 variant와 size 조합 테스트
3. disabled, loading 상태 테스트
4. onClick 핸들러 실행 테스트

**완료 기준**:
- [ ] Button 컴포넌트의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T063: DualButton 컴포넌트 테스트
**목표**: DualButton 컴포넌트의 기본 동작 테스트
**소요시간**: 15분
**의존성**: T011

**작업 내용**:
1. DualButton 컴포넌트의 기본 렌더링 테스트
2. 각 버튼의 독립적인 클릭 이벤트 테스트

**완료 기준**:
- [ ] DualButton 컴포넌트의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T064: Spinner 컴포넌트 테스트
**목표**: Spinner 컴포넌트의 기본 동작 테스트
**소요시간**: 15분
**의존성**: T015

**작업 내용**:
1. Spinner 컴포넌트의 기본 렌더링 테스트
2. 모든 size 테스트
3. 애니메이션 테스트

**완료 기준**:
- [ ] Spinner 컴포넌트의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T065: BottomSheet 컴포넌트 테스트
**목표**: BottomSheet 컴포넌트의 기본 동작 테스트
**소요시간**: 20분
**의존성**: T023

**작업 내용**:
1. BottomSheet 컴포넌트의 기본 렌더링 테스트
2. 열기/닫기 동작 테스트
3. 오버레이 클릭 테스트
4. 옵션 선택 테스트

**완료 기준**:
- [ ] BottomSheet 컴포넌트의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T066: TimecapsuleHeader 컴포넌트 테스트
**목표**: TimecapsuleHeader 컴포넌트의 기본 동작 테스트
**소요시간**: 15분
**의존성**: T019

**작업 내용**:
1. TimecapsuleHeader 컴포넌트의 기본 렌더링 테스트
2. 헤더 내 인터랙티브 요소 테스트

**완료 기준**:
- [ ] TimecapsuleHeader 컴포넌트의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T067: Modal 컴포넌트 및 Provider 테스트
**목표**: Modal 컴포넌트와 Provider의 통합 테스트
**소요시간**: 30분
**의존성**: T027, T035

**작업 내용**:
1. Modal 컴포넌트의 기본 렌더링 테스트
2. useModal 훅 테스트
3. 여러 모달 동시 표시 테스트
4. 모달 스택 관리 테스트

**완료 기준**:
- [ ] Modal 컴포넌트와 Provider의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T068: Toast 컴포넌트 및 Provider 테스트
**목표**: Toast 컴포넌트와 Provider의 통합 테스트
**소요시간**: 30분
**의존성**: T031, T039

**작업 내용**:
1. Toast 컴포넌트의 기본 렌더링 테스트
2. useToast 훅 테스트
3. 모든 타입 테스트
4. 여러 토스트 순차 표시 테스트
5. 자동 사라짐 테스트

**완료 기준**:
- [ ] Toast 컴포넌트와 Provider의 모든 기능이 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T069: 미리보기 페이지 통합 테스트
**목표**: 미리보기 페이지에서 모든 컴포넌트가 정상 작동하는지 테스트
**소요시간**: 30분
**의존성**: T049

**작업 내용**:
1. 미리보기 페이지 접근 테스트
2. 모든 컴포넌트 섹션이 표시되는지 확인
3. 인터랙티브 컴포넌트 동작 테스트
4. 모든 variant, size, 상태가 표시되는지 확인

**완료 기준**:
- [ ] 미리보기 페이지에서 모든 컴포넌트가 정상 작동함
- [ ] 테스트 결과 문서화됨

---

#### T070: 컴포넌트 사용법 문서화
**목표**: 각 컴포넌트의 사용법을 문서화
**소요시간**: 1시간
**의존성**: T051

**작업 내용**:
1. 각 컴포넌트의 JSDoc 주석 작성
2. Props 설명 추가
3. 사용 예제 코드 추가
4. README 또는 문서 파일 생성 (선택적)

**수정할 파일**:
- 각 컴포넌트의 index.tsx 파일 (JSDoc 주석)

**완료 기준**:
- [ ] 모든 컴포넌트의 사용법이 문서화됨
- [ ] 개발자가 쉽게 이해할 수 있음

---

#### T071: 프로바이더 사용법 문서화
**목표**: 각 프로바이더의 사용법을 문서화
**소요시간**: 30분
**의존성**: T052

**작업 내용**:
1. 각 프로바이더의 JSDoc 주석 작성
2. 훅 사용법 설명 추가
3. 사용 예제 코드 추가

**수정할 파일**:
- 각 프로바이더의 index.tsx 파일 (JSDoc 주석)
- 각 훅 파일 (JSDoc 주석)

**완료 기준**:
- [ ] 모든 프로바이더의 사용법이 문서화됨
- [ ] 개발자가 쉽게 이해할 수 있음

---

## 📊 작업 요약

### 총 작업 수: 71개

### 우선순위별 작업 수
- **P1 (필수)**: 49개 작업
- **P2 (중요)**: 12개 작업
- **P3 (선택)**: 10개 작업

### 사용자 스토리별 작업 수
- **US1 (Button)**: 4개 작업
- **US2 (DualButton)**: 4개 작업
- **US3 (Modal)**: 8개 작업 (컴포넌트 + 프로바이더)
- **US4 (Toast)**: 8개 작업 (컴포넌트 + 프로바이더)
- **US5 (Spinner)**: 4개 작업
- **US6 (BottomSheet)**: 4개 작업
- **US7 (TimecapsuleHeader)**: 4개 작업
- **US8 (미리보기 페이지)**: 8개 작업
- **공통 작업**: 27개 작업

### 병렬 처리 가능한 작업
다음 작업들은 서로 다른 파일에서 작업하므로 병렬 처리 가능:
- T006, T010, T014, T018, T022, T026, T030 (CSS Module 스타일 작성)
- T007, T011, T015, T019, T023, T027, T031 (컴포넌트 구현)
- T033, T037 (Context 생성)
- T034, T038 (훅 구현)

---

## 🚀 구현 전략

### MVP 범위 (최소 기능 제품)
우선순위 P1 작업만 포함:
- Button, DualButton, Spinner, BottomSheet, TimecapsuleHeader 컴포넌트
- Modal, Toast 컴포넌트 및 프로바이더
- 미리보기 페이지

### 점진적 전달
1. **1단계**: 기본 UI 컴포넌트 (Button, DualButton, Spinner, TimecapsuleHeader)
2. **2단계**: 인터랙티브 컴포넌트 (BottomSheet, Modal, Toast)
3. **3단계**: 전역 프로바이더 (Modal Provider, Toast Provider)
4. **4단계**: 미리보기 페이지 및 최적화

---

## ✅ 완료 기준

각 사용자 스토리가 완료되려면:
- [ ] 해당 스토리의 모든 작업이 완료됨
- [ ] 컴포넌트가 정상적으로 렌더링됨
- [ ] 모든 variant, size, 상태가 정상 작동함
- [ ] TypeScript 컴파일 에러 없음
- [ ] 디자인 토큰이 올바르게 사용됨
- [ ] Figma 디자인과 일치함

전체 프로젝트 완료 기준:
- [ ] 모든 7개 컴포넌트 구현 완료
- [ ] 모달 및 토스트 프로바이더 구현 완료
- [ ] 미리보기 페이지에서 모든 컴포넌트 확인 가능
- [ ] 모든 컴포넌트의 접근성 요구사항 준수
- [ ] 컴포넌트 초기 렌더링 100ms 이하
- [ ] 애니메이션 60fps 유지
- [ ] Figma 디자인과 100% 일치
