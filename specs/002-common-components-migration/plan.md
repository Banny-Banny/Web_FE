# 공통 컴포넌트 및 모달 프로바이더 마이그레이션 기술 계획서

**Branch**: `migrate-common-components` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-common-components-migration/spec.md`

## Summary

RN Expo 프로젝트에서 사용되던 공통 UI 컴포넌트와 전역 프로바이더를 Next.js 웹 애플리케이션으로 마이그레이션합니다. 

**주요 목표**:
- 7개의 공통 컴포넌트 마이그레이션 (Button, DualButton, Spinner, BottomSheet, TimecapsuleHeader, Modal, Toast)
- 모달 및 토스트 전역 프로바이더 구현
- Figma MCP를 통한 정확한 디자인 스펙 반영
- `src/app/(main)/page.tsx`에 컴포넌트 미리보기 페이지 구성

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- CSS Module + Tailwind CSS를 활용한 스타일링
- React Context API를 활용한 전역 프로바이더 구현
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- 375px 모바일 고정 레이아웃 기준

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, Tailwind CSS v4, React Context API  
**Storage**: N/A (클라이언트 사이드 컴포넌트)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 컴포넌트 초기 렌더링 100ms 이하, 애니메이션 60fps  
**Constraints**: 
- 375px 모바일 고정 레이아웃
- 반응형 디자인 미지원
- 디자인 토큰은 `src/commons/styles`에서 import (중복 선언 금지)
- Figma 디자인과 정확히 일치해야 함
**Scale/Scope**: 7개 공통 컴포넌트 + 2개 프로바이더 + 미리보기 페이지

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 모든 공통 컴포넌트는 `src/commons/components/`, 프로바이더는 `src/commons/providers/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **성능**: 컴포넌트 렌더링 최적화, 애니메이션 성능 고려

---

## Project Structure

### Documentation (this feature)

```text
specs/002-common-components-migration/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── page.tsx              # 컴포넌트 미리보기 페이지 (라우팅 전용)
├── commons/
│   ├── components/               # 공통 UI 컴포넌트
│   │   ├── index.ts             # 통합 익스포트
│   │   ├── button/              # 버튼 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   ├── dual-button/         # 듀얼 버튼 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   ├── spinner/             # 스피너 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   ├── bottom-sheet/        # 바텀시트 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   ├── timecapsule-header/  # 타임캡슐 헤더 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   ├── modal/               # 모달 컴포넌트
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── styles.module.css
│   │   └── toast/               # 토스트 컴포넌트
│   │       ├── index.tsx
│   │       ├── types.ts
│   │       └── styles.module.css
│   └── providers/               # 전역 프로바이더
│       ├── index.tsx            # 프로바이더 통합
│       ├── modal-provider/      # 모달 프로바이더
│       │   ├── index.tsx
│       │   ├── modal-context.tsx
│       │   └── use-modal.ts
│       └── toast-provider/      # 토스트 프로바이더
│           ├── index.tsx
│           ├── toast-context.tsx
│           └── use-toast.ts
```

**Structure Decision**: 
- 모든 공통 컴포넌트는 `src/commons/components/`에 개별 디렉토리로 구성
- 각 컴포넌트는 `index.tsx`, `types.ts`, `styles.module.css` 구조
- 전역 프로바이더는 `src/commons/providers/`에 배치
- `app/(main)/page.tsx`는 라우팅 전용으로 컴포넌트 import만 수행

---

## Implementation Strategy

### Phase 1: 기존 코드 분석 및 Figma 디자인 확인

**목적**: RN Expo 코드 구조 파악 및 Figma 디자인 스펙 확인

**작업**:
1. RN Expo 프로젝트에서 마이그레이션할 컴포넌트 코드 확인
2. Figma MCP 서버를 통해 디자인 스펙 추출
   - 각 컴포넌트의 디자인 토큰 (색상, 간격, 타이포그래피, 반경)
   - 컴포넌트 크기 및 레이아웃 스펙
   - 에셋 (이미지, SVG) 확인
3. `src/commons/styles`에 정의된 디자인 토큰 확인
   - `Colors`: 색상 팔레트
   - `Spacing`, `BorderRadius`: 간격 및 반경
   - `Typography`: 타이포그래피 스타일
   - `FontFamily`, `FontWeight`: 폰트 관련
4. 컴포넌트별 props 인터페이스 설계

**결과물**:
- 컴포넌트별 디자인 스펙 문서
- Props 인터페이스 설계 문서
- 마이그레이션 매핑 테이블

---

### Phase 2: 기본 UI 컴포넌트 마이그레이션 (Priority: P1)

**목적**: 비상호작용 컴포넌트부터 마이그레이션

**작업 순서**:
1. **Spinner 컴포넌트**
   - Figma에서 애니메이션 스펙 확인
   - CSS Module로 스타일 구현
   - size, color props 지원
   
2. **Button 컴포넌트**
   - Figma에서 variant별 스타일 확인
   - variant (primary, secondary 등), size (small, medium, large) 구현
   - disabled, loading 상태 구현
   - `src/commons/styles`의 Colors, Spacing, Typography 토큰 import

3. **DualButton 컴포넌트**
   - 두 개의 Button을 조합
   - 독립적인 props 및 핸들러 지원

4. **TimecapsuleHeader 컴포넌트**
   - Figma에서 레이아웃 및 스타일 확인
   - 헤더 구성 요소 구현

**결과물**:
- 4개 기본 컴포넌트 구현 완료
- TypeScript 타입 정의 완료
- `src/commons/components/index.ts`에 export 추가

---

### Phase 3: 인터랙티브 컴포넌트 마이그레이션 (Priority: P1)

**목적**: 사용자 상호작용이 필요한 컴포넌트 구현

**작업 순서**:
1. **BottomSheet 컴포넌트**
   - 하단에서 올라오는 애니메이션 구현 (CSS transitions)
   - 오버레이 및 닫기 기능
   - 옵션 선택 핸들러 지원
   - 브라우저 뒤로가기 처리 (선택적)

2. **Modal 컴포넌트 (기본)**
   - 화면 중앙 배치
   - 오버레이 및 닫기 기능
   - 기본 레이아웃 구조

3. **Toast 컴포넌트 (기본)**
   - 화면 상단/하단 배치
   - 자동 사라짐 기능
   - 타입별 스타일 (success, error, info, warning)

**결과물**:
- 3개 인터랙티브 컴포넌트 기본 구현 완료
- 애니메이션 및 상호작용 로직 구현

---

### Phase 4: 전역 프로바이더 구현 (Priority: P1)

**목적**: 모달과 토스트의 전역 상태 관리

**작업 순서**:
1. **Modal Provider**
   - React Context API로 모달 상태 관리
   - 모달 스택 관리 (여러 모달 동시 표시)
   - `useModal` 훅 구현
   - 모달 열기/닫기 API
   - z-index 관리

2. **Toast Provider**
   - React Context API로 토스트 상태 관리
   - 토스트 큐 관리 (여러 토스트 순차 표시)
   - `useToast` 훅 구현
   - 토스트 표시/제거 API
   - 자동 사라짐 타이머 관리

3. **Provider 통합**
   - `src/commons/providers/index.tsx`에 통합
   - `app/layout.tsx`에 프로바이더 마운트

**결과물**:
- Modal Provider 및 Toast Provider 구현 완료
- 전역 프로바이더 통합 완료
- 앱 레이아웃에 프로바이더 마운트 완료

---

### Phase 5: 컴포넌트 미리보기 페이지 구성 (Priority: P1)

**목적**: 모든 마이그레이션된 컴포넌트를 한 페이지에서 확인

**작업**:
1. `src/app/(main)/page.tsx` 수정
   - 라우팅 전용 규칙 준수 (컴포넌트 import만)
   - 섹션별로 컴포넌트 그룹화
   - 각 컴포넌트의 모든 variant, size 표시
   - 인터랙티브 컴포넌트 트리거 버튼 추가
   - 컴포넌트 이름 및 설명 추가

2. 미리보기 페이지 구성
   - Button 섹션 (모든 variant, size, 상태)
   - DualButton 섹션
   - Spinner 섹션 (다양한 size)
   - BottomSheet 섹션 (트리거 버튼)
   - TimecapsuleHeader 섹션
   - Modal 섹션 (트리거 버튼)
   - Toast 섹션 (각 타입별 트리거 버튼)

**결과물**:
- 완전한 컴포넌트 미리보기 페이지
- 모든 컴포넌트의 변형 및 상태 확인 가능

---

### Phase 6: 타입 정의 및 통합 익스포트

**목적**: 모든 컴포넌트의 타입 안전성 보장 및 통합 관리

**작업**:
1. 각 컴포넌트의 `types.ts` 파일 완성
   - Props 인터페이스
   - Variant, Size 등 enum 타입
   - 이벤트 핸들러 타입

2. `src/commons/components/index.ts` 업데이트
   - 모든 컴포넌트 export
   - 모든 타입 export

3. `src/commons/providers/index.tsx` 업데이트
   - 프로바이더 export
   - 훅 export

**결과물**:
- 완전한 타입 정의
- 통합 익스포트 파일 완성

---

### Phase 7: 스타일링 및 디자인 토큰 적용

**목적**: Figma 디자인과 정확히 일치하도록 스타일 적용

**작업**:
1. Figma MCP를 통해 각 컴포넌트의 디자인 스펙 재확인
2. `src/commons/styles`에서 디자인 토큰 import
   - `Colors` (색상 팔레트)
   - `Spacing`, `BorderRadius` (간격 및 반경)
   - `Typography` (타이포그래피 스타일)
   - `FontFamily`, `FontWeight` (폰트 관련)
3. CSS Module로 컴포넌트별 스타일 구현
   - Figma에서 추출한 수치 값 반올림 적용
   - 375px 기준 고정 레이아웃
4. 애니메이션 구현
   - 모달, 바텀시트 열기/닫기 애니메이션 (300ms 이하)
   - 스피너 회전 애니메이션 (60fps)

**결과물**:
- Figma 디자인과 정확히 일치하는 스타일
- 디자인 토큰 기반 일관된 스타일링

---

### Phase 8: 접근성 및 최적화

**목적**: 접근성 요구사항 충족 및 성능 최적화

**작업**:
1. 접근성 개선
   - 모든 인터랙티브 컴포넌트에 aria-label 추가
   - 키보드 네비게이션 지원
   - 모달 포커스 트랩 구현
   - 최소 터치 타겟 크기 44px × 44px 보장
   - 색상 대비 WCAG AA 기준 준수

2. 성능 최적화
   - 컴포넌트 렌더링 최적화 (React.memo 활용)
   - 애니메이션 성능 최적화 (transform, opacity 활용)
   - 불필요한 리렌더링 방지

3. 에러 처리
   - 필수 props 누락 시 기본값 또는 에러 메시지
   - 프로바이더 미마운트 시 경고

**결과물**:
- 접근성 요구사항 충족
- 성능 최적화 완료

---

### Phase 9: 테스트 및 문서화

**목적**: 컴포넌트 동작 검증 및 사용법 문서화

**작업**:
1. 컴포넌트별 테스트
   - 각 컴포넌트의 기본 렌더링 테스트
   - Props 변경 시 동작 테스트
   - 인터랙션 테스트

2. 통합 테스트
   - 프로바이더와의 통합 테스트
   - 여러 컴포넌트 동시 사용 테스트

3. 문서화
   - 각 컴포넌트의 사용법 주석
   - Props 설명
   - 예제 코드

**결과물**:
- 테스트 완료
- 문서화 완료

---

## Component-Specific Implementation Details

### Button Component

**구조**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**스타일링**:
- `src/commons/styles`의 디자인 토큰 import
  - `Colors`: variant별 배경색, 텍스트 색상
  - `Spacing`: size별 padding
  - `Typography`: 버튼 텍스트 스타일 (caption.button)
  - `BorderRadius`: 버튼 모서리 둥글기
- disabled 상태 스타일
- loading 상태 스피너 표시

---

### DualButton Component

**구조**:
```typescript
interface DualButtonProps {
  leftButton: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
  };
  rightButton: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
  };
}
```

**스타일링**:
- 두 버튼을 나란히 배치 (flexbox)
- 버튼 간 간격: `Spacing.md` 또는 `Spacing.sm` 사용
- `src/commons/styles`의 디자인 토큰 활용

---

### Spinner Component

**구조**:
```typescript
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```

**스타일링**:
- `src/commons/styles`의 `Colors` 토큰으로 색상 설정
- size별 크기 조정 (Figma 스펙 기준)

**애니메이션**:
- CSS keyframes를 활용한 회전 애니메이션
- 60fps 유지를 위한 transform 활용

---

### BottomSheet Component

**구조**:
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**스타일링**:
- `src/commons/styles`의 디자인 토큰 활용
  - 오버레이 배경: `Colors.black[500]` + opacity
  - 간격: `Spacing` 토큰
  - 반경: `BorderRadius` 토큰 (상단 모서리)

**애니메이션**:
- 하단에서 올라오는 애니메이션 (transform: translateY)
- 오버레이 fade-in/out
- 300ms transition

---

### Modal Component

**구조**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
```

**스타일링**:
- `src/commons/styles`의 디자인 토큰 활용
  - 오버레이 배경: `Colors.black[500]` + opacity
  - 모달 배경: `Colors.white[500]`
  - 간격: `Spacing` 토큰
  - 반경: `BorderRadius.lg` 또는 `BorderRadius.xl`
  - 타이포그래피: `Typography` 토큰

**레이아웃**:
- 화면 중앙 배치 (fixed positioning)
- 오버레이 배경
- 모달 컨텐츠 영역

---

### Toast Component

**구조**:
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}
```

**스타일링**:
- `src/commons/styles`의 디자인 토큰 활용
  - 타입별 배경색: `Colors.green[500]` (success), `Colors.red[500]` (error), `Colors.blue[500]` (info), `Colors.yellow[500]` (warning)
  - 텍스트 색상: `Colors.white[500]` 또는 `Colors.black[500]`
  - 간격: `Spacing` 토큰
  - 반경: `BorderRadius` 토큰
  - 타이포그래피: `Typography.body` 또는 `Typography.caption`

**레이아웃**:
- 화면 상단 또는 하단 고정
- 타입별 아이콘 및 색상
- 자동 사라짐 타이머

---

### Modal Provider

**구조**:
```typescript
interface ModalContextValue {
  openModal: (content: React.ReactNode, options?: ModalOptions) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
}

function useModal(): ModalContextValue;
```

**기능**:
- 모달 스택 관리
- z-index 자동 관리
- 포커스 트랩

---

### Toast Provider

**구조**:
```typescript
interface ToastContextValue {
  showToast: (message: string, type: ToastType, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
}

function useToast(): ToastContextValue;
```

**기능**:
- 토스트 큐 관리
- 자동 사라짐 타이머 관리
- 여러 토스트 순차 표시

---

## Figma MCP Integration

### 디자인 토큰 추출 프로세스

1. **Figma MCP 서버 연결**
   - 구현 단계에서 제공될 Figma MCP 주소 사용
   - MCP 서버를 통해 디자인 파일 접근

2. **컴포넌트별 디자인 스펙 추출**
   - 각 컴포넌트의 Figma 프레임 선택
   - 색상, 간격, 타이포그래피, 반경 등 디자인 토큰 추출
   - 소수점 값 반올림 처리

3. **에셋 추출**
   - 이미지 및 SVG 에셋 추출
   - 로컬 호스트 소스가 제공되면 직접 사용

4. **디자인 토큰 적용**
   - `src/commons/styles`에서 디자인 토큰 import
     ```typescript
     import { Colors, Spacing, BorderRadius, Typography } from '@/commons/styles';
     ```
   - 사용 예시:
     - 색상: `Colors.red[500]`, `Colors.black[500]`
     - 간격: `Spacing.md`, `Spacing.lg`
     - 반경: `BorderRadius.md`, `BorderRadius.lg`
     - 타이포그래피: `Typography.caption.button`
   - 중복 선언 금지
   - CSS Module에서 토큰을 CSS 변수나 직접 값으로 활용

---

## Testing Strategy

### 단위 테스트
- 각 컴포넌트의 기본 렌더링
- Props 변경 시 동작
- 이벤트 핸들러 실행

### 통합 테스트
- 프로바이더와의 통합
- 여러 컴포넌트 동시 사용
- 모달/토스트 스택 관리

### E2E 테스트 (Playwright)
- 미리보기 페이지에서 모든 컴포넌트 확인
- 인터랙티브 컴포넌트 동작 테스트
- 접근성 테스트

---

## Risk Mitigation

### 위험 요소 및 대응 방안

1. **RN Expo 코드와 웹 환경 차이**
   - **위험**: React Native 컴포넌트를 웹으로 변환 시 호환성 문제
   - **대응**: 컴포넌트를 처음부터 웹 기준으로 재구현, RN 코드는 참고용으로만 활용

2. **Figma 디자인과 실제 구현 차이**
   - **위험**: 디자인 스펙 해석 오류
   - **대응**: Figma MCP를 통한 정확한 스펙 추출, 단계별 디자인 검증

3. **프로바이더 성능 이슈**
   - **위험**: 전역 상태 관리로 인한 성능 저하
   - **대응**: React.memo, useMemo 등을 활용한 최적화, 불필요한 리렌더링 방지

4. **애니메이션 성능**
   - **위험**: 복잡한 애니메이션으로 인한 프레임 드롭
   - **대응**: transform, opacity 등 GPU 가속 속성 활용, 60fps 목표

---

## Success Criteria

### 기능적 완성도
- ✅ 모든 7개 컴포넌트 구현 완료
- ✅ 모달 및 토스트 프로바이더 구현 완료
- ✅ 미리보기 페이지에서 모든 컴포넌트 확인 가능
- ✅ 모든 컴포넌트의 variant, size, 상태가 정상 작동

### 기술적 품질
- ✅ TypeScript 컴파일 에러 0%
- ✅ 모든 컴포넌트의 접근성 요구사항 준수
- ✅ 컴포넌트 초기 렌더링 100ms 이하
- ✅ 애니메이션 60fps 유지

### 디자인 정확도
- ✅ Figma 디자인과 100% 일치
- ✅ 디자인 토큰 기반 일관된 스타일링
- ✅ 375px 기준 고정 레이아웃 준수

---

## Next Steps

다음 단계로 `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록을 생성합니다.
