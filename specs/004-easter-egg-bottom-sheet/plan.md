# 기술 계획: 이스터에그 바텀시트

## 개요

이 문서는 "이스터에그 바텀시트" 기능의 기술적 구현 계획을 담고 있습니다. 기능 명세서(`spec.md`)를 바탕으로 구체적인 기술 스택, 아키텍처, 구현 단계를 정의합니다.

**관련 문서**:
- 기능 명세서: `specs/004-easter-egg-bottom-sheet/spec.md`
- Figma 디자인: 
  - 초기 상태: https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5186&m=dev
  - 확장 상태: https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5362&m=dev

---

## 1. 기술 스택

### Frontend Framework
- **Next.js 16** (App Router)
- **TypeScript 5.x**
- **React 19** (클라이언트 컴포넌트)

### 스타일링
- **CSS Modules** (컴포넌트별 스타일 분리)
- **Tailwind CSS** (유틸리티 클래스, 375px 고정 기준)
- **디자인 토큰** (`src/commons/styles/`)

### 상태 관리
- **React Hooks** (useState, useCallback, useEffect)
- **Context API** (필요 시 전역 상태)

### 드래그 인터랙션
- **react-use-gesture** 또는 **네이티브 터치 이벤트**
- **framer-motion** (부드러운 애니메이션, 선택적)

### 접근성
- **ARIA 속성** (role, aria-label, aria-expanded 등)
- **포커스 관리** (focus-trap-react 또는 커스텀 구현)

---

## 2. 아키텍처 설계

### 2.1 디렉토리 구조

```
src/
├── components/
│   └── home/
│       ├── index.tsx                          # HomeFeature (기존)
│       ├── components/
│       │   ├── fab-button/                    # FAB 버튼 (기존)
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   └── easter-egg-bottom-sheet/       # 🆕 이스터에그 바텀시트
│       │       ├── index.tsx                  # 바텀시트 컨테이너
│       │       ├── types.ts                   # 타입 정의
│       │       ├── styles.module.css          # 스타일
│       │       ├── hooks/
│       │       │   └── useEasterEggSheet.ts   # 바텀시트 상태 관리
│       │       └── components/
│       │           ├── option-button/         # 옵션 버튼
│       │           │   ├── index.tsx
│       │           │   ├── types.ts
│       │           │   └── styles.module.css
│       │           └── sheet-content/         # 바텀시트 컨텐츠
│       │               ├── index.tsx
│       │               ├── types.ts
│       │               └── styles.module.css
│       └── hooks/
│           └── useEasterEggOptions.ts         # 🆕 옵션 데이터 관리
│
└── commons/
    └── components/
        ├── bottom-sheet/                      # 기존 공통 컴포넌트
        │   ├── index.tsx
        │   ├── types.ts
        │   └── styles.module.css
        └── dual-button/                       # 기존 공통 컴포넌트
            ├── index.tsx
            ├── types.ts
            └── styles.module.css
```

### 2.2 컴포넌트 계층 구조

```
HomeFeature (src/components/home/index.tsx)
├── FabButton (기존)
│   └── onClick="이스터에그" → setEasterEggSheetOpen(true)
│
└── EasterEggBottomSheet (신규)
    └── BottomSheet (공통 컴포넌트)
        ├── SheetContent (컨텐츠 영역)
        │   ├── 제목
        │   ├── 설명
        │   └── OptionButton[] (옵션 버튼들)
        │       └── onClick → setSelectedOption(id)
        │
        └── DualButton (공통 컴포넌트, footer)
            ├── 취소 버튼 → onClose()
            └── 확인 버튼 → onConfirm(selectedOption)
```

---

## 3. 데이터 모델링

### 3.1 타입 정의

**파일 위치**: `src/components/home/components/easter-egg-bottom-sheet/types.ts`

```typescript
/**
 * 이스터에그 옵션 타입
 */
export interface EasterEggOption {
  /** 옵션 고유 식별자 */
  id: string;
  /** 옵션 표시 텍스트 */
  label: string;
  /** 옵션 설명 */
  description: string;
  /** @remixicon/react 아이콘 이름 (예: 'RiFlashlightLine') */
  icon: string;
  /** 활성화 여부 (향후 확장용) */
  enabled?: boolean;
}

/**
 * 바텀시트 상태 타입
 */
export interface EasterEggSheetState {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 선택된 옵션 ID */
  selectedOption: string | null;
  /** 현재 바텀시트 높이 (드래그용) */
  height: number;
  /** 드래그 중인지 여부 */
  isDragging: boolean;
}

/**
 * 바텀시트 Props
 */
export interface EasterEggBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 확인 버튼 클릭 핸들러 (선택된 옵션 ID 전달) */
  onConfirm: (optionId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 옵션 버튼 Props
 */
export interface OptionButtonProps {
  /** 옵션 데이터 */
  option: EasterEggOption;
  /** 선택 여부 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: (optionId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 바텀시트 컨텐츠 Props
 */
export interface SheetContentProps {
  /** 옵션 목록 */
  options: EasterEggOption[];
  /** 선택된 옵션 ID */
  selectedOption: string | null;
  /** 옵션 선택 핸들러 */
  onSelectOption: (optionId: string) => void;
}
```

### 3.2 Mock 데이터

**파일 위치**: `src/components/home/hooks/useEasterEggOptions.ts`

```typescript
import { EasterEggOption } from '../components/easter-egg-bottom-sheet/types';

/**
 * 이스터에그 옵션 Mock 데이터
 * TODO: 향후 API 연동 시 실제 데이터로 교체
 * 
 * 아이콘은 @remixicon/react 사용
 * - 아이콘 이름은 컴포넌트 이름 (예: 'RiFlashlightLine')
 * - 실제 렌더링 시 동적 import 사용
 */
export const EASTER_EGG_OPTIONS: EasterEggOption[] = [
  {
    id: 'quick-create',
    label: '빠른 생성',
    description: '기본 설정으로 빠르게 이스터에그를 생성합니다',
    icon: 'RiFlashlightLine', // @remixicon/react
    enabled: true,
  },
  {
    id: 'custom-create',
    label: '커스텀 생성',
    description: '상세 설정을 통해 나만의 이스터에그를 만듭니다',
    icon: 'RiSettings3Line', // @remixicon/react
    enabled: true,
  },
  {
    id: 'template-create',
    label: '템플릿 사용',
    description: '미리 만들어진 템플릿으로 쉽게 생성합니다',
    icon: 'RiLayoutGridLine', // @remixicon/react
    enabled: false, // 향후 기능
  },
];

/**
 * 이스터에그 옵션 데이터를 반환하는 Hook
 */
export function useEasterEggOptions() {
  // 현재는 Mock 데이터 반환
  // TODO: 향후 API 연동 시 React Query 사용
  return {
    options: EASTER_EGG_OPTIONS.filter(opt => opt.enabled !== false),
    isLoading: false,
    error: null,
  };
}
```

---

## 4. 구현 단계별 계획

### Phase 1: 기본 바텀시트 통합 및 상태 관리

**목표**: 기존 BottomSheet 컴포넌트를 활용하여 기본 구조 구축

**작업 내역**:
1. `src/components/home/components/easter-egg-bottom-sheet/` 디렉토리 생성
2. 타입 정의 파일 작성 (`types.ts`)
3. 바텀시트 상태 관리 Hook 작성 (`hooks/useEasterEggSheet.ts`)
4. 기본 바텀시트 컨테이너 컴포넌트 작성 (`index.tsx`)
5. HomeFeature에 바텀시트 통합 및 FAB 버튼 연결

**파일 목록**:
- `src/components/home/components/easter-egg-bottom-sheet/index.tsx`
- `src/components/home/components/easter-egg-bottom-sheet/types.ts`
- `src/components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet.ts`
- `src/components/home/index.tsx` (수정)

**검증 기준**:
- FAB 버튼의 "이스터에그" 클릭 시 바텀시트가 열림
- 배경 오버레이 클릭 시 바텀시트가 닫힘
- ESC 키로 바텀시트가 닫힘
- 취소 버튼 클릭 시 바텀시트가 닫힘

---

### Phase 2: Figma 디자인 기반 컨텐츠 구현

**목표**: Figma 디자인을 기반으로 바텀시트 내부 UI 구현

**작업 내역**:
1. Figma Dev Mode MCP를 통해 디자인 스펙 추출
2. 옵션 버튼 컴포넌트 작성 (`components/option-button/`)
   - **중요**: 아이콘은 @remixicon/react 사용 (새로운 아이콘 패키지 추가 금지)
   - Figma 디자인의 아이콘을 @remixicon/react에서 찾아 매칭
3. 바텀시트 컨텐츠 컴포넌트 작성 (`components/sheet-content/`)
4. Mock 데이터 및 옵션 Hook 작성 (`hooks/useEasterEggOptions.ts`)
   - 아이콘 이름은 @remixicon/react 컴포넌트 이름으로 저장
5. 스타일 파일 작성 (CSS Modules, 디자인 토큰 활용)

**파일 목록**:
- `src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx`
- `src/components/home/components/easter-egg-bottom-sheet/components/option-button/types.ts`
- `src/components/home/components/easter-egg-bottom-sheet/components/option-button/styles.module.css`
- `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/index.tsx`
- `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/types.ts`
- `src/components/home/components/easter-egg-bottom-sheet/components/sheet-content/styles.module.css`
- `src/components/home/hooks/useEasterEggOptions.ts`
- `src/components/home/components/easter-egg-bottom-sheet/styles.module.css`

**검증 기준**:
- Figma 디자인과 100% 일치하는 UI
- 옵션 버튼 클릭 시 선택 상태 시각적 표시
- 선택되지 않은 경우 확인 버튼 비활성화
- 옵션 선택 시 확인 버튼 활성화
- 모든 텍스트가 디자인 토큰 기반 타이포그래피 적용

---

### Phase 3: 드래그 인터랙션 구현

**목표**: 바텀시트 드래그 기능 및 70% 최대 높이 제한 구현

**작업 내역**:
1. BottomSheet 공통 컴포넌트에 드래그 기능 추가 (또는 확장)
2. 드래그 상태 관리 로직 구현
3. 최대 높이 70% 제한 로직 구현
4. 드래그로 닫기 기능 구현 (threshold 기반)
5. 애니메이션 최적화 (60fps 유지)

**파일 목록**:
- `src/commons/components/bottom-sheet/index.tsx` (수정 또는 확장)
- `src/commons/components/bottom-sheet/types.ts` (수정)
- `src/commons/components/bottom-sheet/styles.module.css` (수정)
- `src/commons/components/bottom-sheet/hooks/useDragGesture.ts` (신규, 선택적)

**검증 기준**:
- 바텀시트를 위로 드래그하여 최대 70%까지 확장 가능
- 70%를 초과하면 저항감 있는 애니메이션 (rubber band effect)
- 바텀시트를 아래로 드래그하여 닫기 가능 (threshold: 30%)
- 드래그 동작이 60fps로 부드럽게 동작
- 드래그 중 다른 인터랙션 무시

**기술적 고려사항**:
- **Option 1**: `react-use-gesture` 라이브러리 사용 (추천)
  - 장점: 터치/마우스 이벤트 통합, 제스처 감지 용이
  - 단점: 추가 의존성 (약 10KB gzipped)
  
- **Option 2**: 네이티브 터치 이벤트 사용
  - 장점: 의존성 없음, 번들 크기 최소화
  - 단점: 크로스 브라우저 호환성 직접 처리 필요

**권장**: Phase 3에서는 Option 1 사용, 성능 이슈 발생 시 Option 2로 전환

---

### Phase 4: 접근성 및 키보드 네비게이션

**목표**: WCAG 2.1 AA 레벨 준수 및 키보드 사용자 지원

**작업 내역**:
1. 포커스 관리 로직 구현 (포커스 트랩)
2. ARIA 속성 추가 (role, aria-label, aria-expanded 등)
3. 키보드 네비게이션 지원 (Tab, Enter, ESC)
4. 스크린 리더 테스트 및 개선
5. 명도 대비 검증 (최소 4.5:1)

**파일 목록**:
- `src/components/home/components/easter-egg-bottom-sheet/index.tsx` (수정)
- `src/components/home/components/easter-egg-bottom-sheet/components/option-button/index.tsx` (수정)
- `src/commons/components/bottom-sheet/index.tsx` (수정)

**검증 기준**:
- 바텀시트 열릴 때 포커스가 바텀시트 내부로 이동
- Tab 키로 모든 인터랙티브 요소 탐색 가능
- Enter/Space 키로 버튼 활성화 가능
- ESC 키로 바텀시트 닫기 가능
- 바텀시트 닫힐 때 포커스가 FAB 버튼으로 복원
- 스크린 리더가 모든 요소를 올바르게 읽음
- 명도 대비 4.5:1 이상 (텍스트), 3:1 이상 (UI 컴포넌트)

**접근성 체크리스트**:
- [ ] 시맨틱 HTML 사용 (button, dialog 등)
- [ ] ARIA 속성 적절히 사용
- [ ] 포커스 표시 명확 (outline 제거 금지)
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 스크린 리더 테스트 통과 (VoiceOver/NVDA)
- [ ] 명도 대비 검증 통과
- [ ] 터치 타겟 크기 44x44px 이상

---

### Phase 5: 테스트 및 최적화

**목표**: E2E 테스트 작성 및 성능 최적화

**작업 내역**:
1. Playwright E2E 테스트 작성
2. 성능 프로파일링 및 최적화
3. 번들 크기 최적화
4. 크로스 브라우저 테스트
5. 모바일 디바이스 실기기 테스트

**파일 목록**:
- `tests/easter-egg-bottom-sheet.spec.ts` (신규)
- `tests/easter-egg-bottom-sheet-a11y.spec.ts` (신규, 접근성 테스트)

**E2E 테스트 시나리오**:
1. **기본 플로우 테스트**:
   - FAB 버튼 클릭 → 이스터에그 선택 → 바텀시트 열림
   - 옵션 선택 → 확인 버튼 활성화
   - 확인 버튼 클릭 → 다음 단계 진행

2. **닫기 동작 테스트**:
   - 배경 오버레이 클릭으로 닫기
   - 취소 버튼 클릭으로 닫기
   - ESC 키로 닫기

3. **드래그 인터랙션 테스트**:
   - 위로 드래그하여 확장
   - 아래로 드래그하여 닫기
   - 70% 최대 높이 제한 검증

4. **접근성 테스트**:
   - 키보드 네비게이션
   - 포커스 관리
   - ARIA 속성 검증

5. **성능 테스트**:
   - 애니메이션 FPS 측정 (60fps 유지)
   - 렌더링 시간 측정 (100ms 이하)
   - 번들 크기 검증

**성능 최적화 체크리스트**:
- [ ] React.memo로 불필요한 리렌더링 방지
- [ ] useCallback/useMemo로 함수/값 메모이제이션
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] CSS GPU 가속 활용 (transform, will-change)
- [ ] 코드 스플리팅 (동적 import)
- [ ] 번들 크기 분석 및 최적화

---

## 5. 기술적 고려사항

### 5.1 BottomSheet 공통 컴포넌트 확장

**현재 상태**:
- 기본 열기/닫기 기능 지원
- 오버레이, ESC 키, 포커스 관리 구현됨
- 드래그 기능 미구현

**확장 필요 사항**:
1. **드래그 기능 추가**:
   - `maxHeight` prop 추가 (기본값: 90vh, 이스터에그용: 70vh)
   - 드래그 핸들 인터랙션 구현
   - 드래그로 닫기 기능 구현

2. **API 확장**:
   ```typescript
   export interface BottomSheetProps {
     isOpen: boolean;
     onClose: () => void;
     children: React.ReactNode;
     footer?: React.ReactNode;
     showHandle?: boolean;
     closeOnBackdropPress?: boolean;
     maxHeight?: string | number; // 🆕 추가
     draggable?: boolean;          // 🆕 추가
     onDragEnd?: (height: number) => void; // 🆕 추가
   }
   ```

3. **구현 전략**:
   - **Option A**: BottomSheet 컴포넌트 직접 수정 (다른 바텀시트에도 영향)
   - **Option B**: EasterEggBottomSheet에서 BottomSheet를 래핑하여 확장 (권장)

**권장 접근법**: Option B
- 기존 BottomSheet 컴포넌트는 그대로 유지
- EasterEggBottomSheet에서 드래그 로직 구현
- 향후 다른 바텀시트에서도 드래그 필요 시 공통 컴포넌트로 추출

### 5.2 드래그 인터랙션 구현 상세

**요구사항**:
- 최대 높이: 화면 높이의 70%
- 최소 높이: 컨텐츠 높이 (auto)
- 닫기 threshold: 초기 높이의 30% 이하로 드래그 시 닫힘

**구현 방법**:

```typescript
// hooks/useDragGesture.ts (예시)
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

export function useDragGesture(
  maxHeight: number,
  onClose: () => void
) {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useGesture({
    onDrag: ({ down, movement: [, my], velocity: [, vy] }) => {
      // 위로 드래그: my < 0, 아래로 드래그: my > 0
      const newY = Math.max(0, Math.min(my, maxHeight * 0.7));
      
      if (down) {
        // 드래그 중
        api.start({ y: newY, immediate: true });
      } else {
        // 드래그 종료
        if (my > maxHeight * 0.3 || vy > 0.5) {
          // 닫기
          onClose();
        } else {
          // 원래 위치로 복원
          api.start({ y: 0 });
        }
      }
    },
  });

  return { bind, y };
}
```

### 5.3 성능 최적화 전략

**애니메이션 최적화**:
- `transform`과 `opacity`만 사용 (GPU 가속)
- `will-change` 속성 활용
- `requestAnimationFrame` 사용

**렌더링 최적화**:
- 옵션 버튼 컴포넌트에 `React.memo` 적용
- 이벤트 핸들러에 `useCallback` 적용
- 옵션 데이터에 `useMemo` 적용

**번들 크기 최적화**:
- 드래그 라이브러리는 동적 import로 로드
- 아이콘은 SVG 스프라이트 또는 인라인 SVG 사용
- 불필요한 의존성 제거

### 5.4 에러 처리 및 엣지 케이스

**에러 시나리오**:
1. **옵션 데이터 로딩 실패**: 에러 메시지 표시 및 재시도 버튼
2. **빠른 연속 클릭**: 디바운싱 적용 (300ms)
3. **작은 화면 크기**: 최소 높이 보장 및 스크롤 가능 영역
4. **드래그 중 화면 회전**: 드래그 상태 초기화 및 높이 재계산
5. **포커스 트랩 실패**: 포커스 강제 이동 및 로그 기록

**처리 방법**:
```typescript
// 디바운싱 예시
const handleOptionClick = useCallback(
  debounce((optionId: string) => {
    setSelectedOption(optionId);
  }, 300),
  []
);

// 화면 회전 감지
useEffect(() => {
  const handleResize = () => {
    if (isDragging) {
      setIsDragging(false);
      recalculateHeight();
    }
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [isDragging]);
```

---

## 6. 의존성 관리

### 6.1 새로운 패키지 설치

**필수 패키지**:
```json
{
  "dependencies": {
    "@use-gesture/react": "^10.3.0",
    "@react-spring/web": "^9.7.3",
    "@remixicon/react": "^4.2.0"
  }
}
```

**선택적 패키지** (Phase 4 - 접근성):
```json
{
  "dependencies": {
    "focus-trap-react": "^10.2.3"
  }
}
```

**아이콘 라이브러리**:
- **@remixicon/react**: 프로젝트 전체에서 사용하는 아이콘 라이브러리
- Figma 디자인의 아이콘을 @remixicon/react에서 찾아 사용
- 새로운 아이콘 패키지 추가 금지 (일관성 유지)

### 6.2 패키지 문서화

**파일 위치**: `FE/doc/v.1.0/package.md` (업데이트 필요)

```markdown
## 추가된 패키지 (2026-01-26)

### @use-gesture/react (v10.3.0)
- **도입 목적**: 바텀시트 드래그 인터랙션 구현
- **주요 사용처**: `src/components/home/components/easter-egg-bottom-sheet/`
- **번들 크기**: ~10KB (gzipped)
- **대안**: 네이티브 터치 이벤트 (성능 이슈 시 마이그레이션 고려)

### @react-spring/web (v9.7.3)
- **도입 목적**: 부드러운 애니메이션 및 물리 기반 스프링 애니메이션
- **주요 사용처**: 바텀시트 드래그 애니메이션
- **번들 크기**: ~20KB (gzipped)
- **대안**: CSS 애니메이션 + framer-motion (이미 프로젝트에 있는 경우)

### @remixicon/react (v4.2.0)
- **도입 목적**: 프로젝트 전체 아이콘 라이브러리 (일관성 유지)
- **주요 사용처**: 모든 컴포넌트의 아이콘
- **번들 크기**: Tree-shaking 지원으로 사용한 아이콘만 번들에 포함
- **중요**: 새로운 아이콘 패키지 추가 금지, @remixicon/react만 사용

### focus-trap-react (v10.2.3) - 선택적
- **도입 목적**: 바텀시트 포커스 트랩 구현 (접근성)
- **주요 사용처**: 모달 및 바텀시트 컴포넌트
- **번들 크기**: ~5KB (gzipped)
- **대안**: 커스텀 포커스 관리 로직 (기존 BottomSheet에 이미 구현된 경우)
```

---

## 7. 테스트 전략

### 7.1 E2E 테스트 (Playwright)

**파일 위치**: `tests/easter-egg-bottom-sheet.spec.ts`

**테스트 케이스**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('이스터에그 바텀시트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 지도 로딩 대기
    await page.waitForSelector('[data-testid="map-view"]');
  });

  test('FAB 버튼에서 이스터에그 선택 시 바텀시트 열림', async ({ page }) => {
    // FAB 버튼 클릭
    await page.click('[data-testid="fab-button"]');
    
    // 이스터에그 옵션 클릭
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // 바텀시트 표시 확인
    await expect(page.locator('[data-testid="easter-egg-bottom-sheet"]')).toBeVisible();
    
    // 제목 확인
    await expect(page.locator('[data-testid="sheet-title"]')).toHaveText('이스터에그 생성');
  });

  test('옵션 선택 시 확인 버튼 활성화', async ({ page }) => {
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // 초기 확인 버튼 비활성화 확인
    await expect(page.locator('[data-testid="confirm-button"]')).toBeDisabled();
    
    // 옵션 선택
    await page.click('[data-testid="option-button-quick-create"]');
    
    // 확인 버튼 활성화 확인
    await expect(page.locator('[data-testid="confirm-button"]')).toBeEnabled();
  });

  test('배경 오버레이 클릭 시 바텀시트 닫힘', async ({ page }) => {
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // 오버레이 클릭
    await page.click('[data-testid="bottom-sheet-backdrop"]');
    
    // 바텀시트 닫힘 확인
    await expect(page.locator('[data-testid="easter-egg-bottom-sheet"]')).not.toBeVisible();
  });

  test('ESC 키로 바텀시트 닫힘', async ({ page }) => {
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // ESC 키 입력
    await page.keyboard.press('Escape');
    
    // 바텀시트 닫힘 확인
    await expect(page.locator('[data-testid="easter-egg-bottom-sheet"]')).not.toBeVisible();
  });

  test('키보드 네비게이션으로 옵션 선택 및 확인', async ({ page }) => {
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // Tab 키로 첫 번째 옵션으로 이동
    await page.keyboard.press('Tab');
    
    // Enter 키로 옵션 선택
    await page.keyboard.press('Enter');
    
    // Tab 키로 확인 버튼으로 이동
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Enter 키로 확인
    await page.keyboard.press('Enter');
    
    // 다음 단계로 이동 확인 (URL 변경 또는 상태 변경)
    // TODO: 실제 다음 단계 URL로 교체
    await expect(page).toHaveURL(/\/easter-egg\/create/);
  });

  test('드래그로 바텀시트 확장 및 닫기', async ({ page }) => {
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // 드래그 핸들 위치 확인
    const handle = page.locator('[data-testid="bottom-sheet-handle"]');
    const handleBox = await handle.boundingBox();
    
    // 위로 드래그 (확장)
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y - 200);
    await page.mouse.up();
    
    // 높이 증가 확인
    const sheetAfterExpand = page.locator('[data-testid="easter-egg-bottom-sheet"]');
    const heightAfterExpand = await sheetAfterExpand.evaluate(el => el.clientHeight);
    expect(heightAfterExpand).toBeGreaterThan(400);
    
    // 아래로 드래그 (닫기)
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + 300);
    await page.mouse.up();
    
    // 바텀시트 닫힘 확인
    await expect(sheetAfterExpand).not.toBeVisible();
  });
});
```

### 7.2 접근성 테스트 (Playwright + axe-core)

**파일 위치**: `tests/easter-egg-bottom-sheet-a11y.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('이스터에그 바텀시트 접근성', () => {
  test('WCAG 2.1 AA 준수', async ({ page }) => {
    await page.goto('/');
    
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // axe 접근성 검사
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="easter-egg-bottom-sheet"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('포커스 관리', async ({ page }) => {
    await page.goto('/');
    
    // 바텀시트 열기
    await page.click('[data-testid="fab-button"]');
    await page.click('[data-testid="fab-easter-egg-option"]');
    
    // 포커스가 바텀시트 내부로 이동했는지 확인
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toContain('option-button');
    
    // 바텀시트 닫기
    await page.keyboard.press('Escape');
    
    // 포커스가 FAB 버튼으로 복원되었는지 확인
    const focusedAfterClose = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedAfterClose).toBe('fab-button');
  });
});
```

---

## 8. 배포 및 모니터링

### 8.1 배포 체크리스트

- [ ] 모든 E2E 테스트 통과
- [ ] 접근성 테스트 통과
- [ ] 성능 프로파일링 완료 (60fps 유지)
- [ ] 크로스 브라우저 테스트 완료 (iOS Safari, Android Chrome)
- [ ] 실기기 테스트 완료 (iPhone, Android)
- [ ] Lighthouse 점수 확인 (Performance > 90, Accessibility > 95)
- [ ] 번들 크기 확인 (증가분 < 50KB)
- [ ] 문서 업데이트 (`package.md`, `README.md`)

### 8.2 성능 모니터링

**측정 지표**:
- 바텀시트 렌더링 시간 (목표: < 100ms)
- 애니메이션 FPS (목표: 60fps)
- 드래그 응답 시간 (목표: < 16ms)
- 번들 크기 증가분 (목표: < 50KB)

**모니터링 도구**:
- Chrome DevTools Performance 탭
- React DevTools Profiler
- Lighthouse CI
- Bundle Analyzer

---

## 9. 향후 확장 계획

### 9.1 단기 확장 (v1.1)

- **템플릿 옵션 추가**: 미리 만들어진 템플릿으로 이스터에그 생성
- **최근 사용 옵션**: 사용자가 최근 선택한 옵션 표시
- **옵션 검색**: 옵션이 많아질 경우 검색 기능 추가

### 9.2 중기 확장 (v1.2)

- **API 연동**: Mock 데이터를 실제 API로 교체
- **다국어 지원**: i18n을 통한 다국어 옵션 제공
- **애니메이션 개선**: 더 풍부한 마이크로 인터랙션

### 9.3 장기 확장 (v2.0)

- **AI 추천**: 사용자 행동 기반 옵션 추천
- **커스터마이징**: 사용자가 옵션을 직접 추가/수정
- **공유 기능**: 선택한 옵션을 다른 사용자와 공유

---

## 10. 리스크 및 대응 방안

### 10.1 기술적 리스크

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|-----------|-----------|
| 드래그 라이브러리 성능 이슈 | 높음 | 중간 | 네이티브 터치 이벤트로 마이그레이션 |
| BottomSheet 컴포넌트 확장 어려움 | 중간 | 낮음 | 별도 컴포넌트로 구현 후 공통화 |
| 접근성 요구사항 미달 | 높음 | 낮음 | 초기부터 접근성 고려 설계 |
| 번들 크기 증가 | 중간 | 중간 | 동적 import 및 코드 스플리팅 |

### 10.2 일정 리스크

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|-----------|-----------|
| Figma 디자인 변경 | 중간 | 중간 | Phase 2 시작 전 디자인 최종 확정 |
| 드래그 기능 구현 지연 | 높음 | 중간 | Phase 3을 별도 스프린트로 분리 |
| 접근성 테스트 지연 | 중간 | 낮음 | Phase 4를 Phase 2와 병행 |

---

## 11. 참고 자료

### 11.1 내부 문서

- [기능 명세서](./spec.md)
- [프로젝트 아키텍처](./.cursor/rules/project-structure.mdc)
- [디자인 토큰](../src/commons/styles/)
- [공통 컴포넌트 가이드](../src/commons/components/README.md)

### 11.2 외부 문서

- [React Use Gesture 공식 문서](https://use-gesture.netlify.app/)
- [React Spring 공식 문서](https://www.react-spring.dev/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright 공식 문서](https://playwright.dev/)
- [Next.js 공식 문서](https://nextjs.org/docs)

### 11.3 Figma 디자인

- [바텀시트 초기 상태](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5186&m=dev)
- [바텀시트 확장 상태](https://www.figma.com/design/k7IWFISJsHIQ4g6FoAZqup/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8?node-id=599-5362&m=dev)

---

## 12. 구현 순서 요약

### TimeEgg 워크플로우 적용

이 프로젝트는 TimeEgg의 표준 개발 워크플로우를 따릅니다:

```
API 연결 → E2E 테스트 → UI 구현 → 사용자 승인 → 데이터 바인딩 → UI 테스트
```

### 단계별 실행 계획

#### Step 1: API 연결 (해당 없음)
- 이 기능은 순수 프론트엔드 기능으로 API 연동이 필요 없음
- Mock 데이터로 구현 (향후 API 연동 대비 타입 정의)

#### Step 2: E2E 테스트 작성
- **Phase 5**에서 Playwright 테스트 작성
- 주요 사용자 시나리오 테스트 (열기, 선택, 닫기, 드래그)

#### Step 3: UI 구현 (375px 고정 기준)
- **Phase 1**: 기본 바텀시트 통합 및 상태 관리
- **Phase 2**: Figma 디자인 기반 컨텐츠 구현 (Mock 데이터)
- **Phase 3**: 드래그 인터랙션 구현

#### Step 4: 사용자 승인
- 스테이징 환경 배포 (375px 모바일 프레임)
- 사용자 테스트 및 피드백 수집
- UI/UX 개선사항 반영

#### Step 5: 데이터 바인딩
- Mock 데이터를 실제 API로 교체 (향후 API 준비 시)
- 현재는 Mock 데이터로 완결

#### Step 6: UI 테스트
- **Phase 4**: 접근성 및 키보드 네비게이션 테스트
- **Phase 5**: 성능 테스트 및 최적화

### 구현 우선순위

1. **Phase 1** (필수, 1-2일): 기본 구조 및 상태 관리
2. **Phase 2** (필수, 2-3일): Figma 디자인 구현
3. **Phase 3** (필수, 2-3일): 드래그 인터랙션
4. **Phase 4** (필수, 1-2일): 접근성
5. **Phase 5** (필수, 1-2일): 테스트 및 최적화

**총 예상 기간**: 7-12일 (개발자 1명 기준)

---

## 13. 최종 체크리스트

### 기능 완성도
- [ ] FAB 버튼에서 이스터에그 선택 시 바텀시트 열림
- [ ] 바텀시트 최대 높이 70% 제한
- [ ] 드래그로 바텀시트 확장 및 닫기
- [ ] 옵션 선택 시 시각적 피드백
- [ ] 확인 버튼 활성화/비활성화
- [ ] 배경 오버레이 클릭으로 닫기
- [ ] 취소 버튼 클릭으로 닫기
- [ ] ESC 키로 닫기

### 디자인 일관성
- [ ] Figma 디자인 100% 일치
- [ ] 디자인 토큰 사용 (색상, 타이포그래피, 간격)
- [ ] 공통 컴포넌트 재사용 (BottomSheet, DualButton)
- [ ] 375px 모바일 프레임 기준 구현

### 접근성
- [ ] WCAG 2.1 AA 레벨 준수
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 관리 (열기/닫기 시)
- [ ] ARIA 속성 적절히 사용
- [ ] 명도 대비 4.5:1 이상

### 성능
- [ ] 애니메이션 60fps 유지
- [ ] 렌더링 시간 100ms 이하
- [ ] 드래그 응답 시간 16ms 이하
- [ ] 번들 크기 증가분 50KB 이하

### 테스트
- [ ] E2E 테스트 작성 및 통과
- [ ] 접근성 테스트 통과
- [ ] 크로스 브라우저 테스트 완료
- [ ] 실기기 테스트 완료

### 문서화
- [ ] 코드 주석 작성
- [ ] 컴포넌트 Props 문서화
- [ ] package.md 업데이트
- [ ] README.md 업데이트 (필요 시)

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-26  
**작성자**: AI Assistant  
**다음 단계**: `/speckit.tasks` 명령어로 작업 목록 생성
