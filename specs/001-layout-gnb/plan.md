# TimeEgg 웹 레이아웃 및 GNB 기술 계획서

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 기본 레이아웃 구조와 GNB(Global Navigation Bar) 구현을 위한 기술적 결정사항과 구현 계획을 정의합니다.

---

## 🏗 기술 스택 결정

### Core Framework
- **Next.js 16+** (App Router)
  - **선택 이유**: 레이아웃 시스템, 중첩 레이아웃 지원, 페이지별 레이아웃 제어
  - **App Router 활용**: Layout 컴포넌트를 통한 GNB 표시/숨김 제어
  - **Server Component 우선**: 기본은 서버 컴포넌트, GNB는 클라이언트 컴포넌트

### Language & Type System
- **TypeScript 5+**
  - **선택 이유**: 타입 안전성, 컴포넌트 Props 타입 정의
  - **엄격한 설정**: strict mode 유지
  - **절대 경로**: `@/commons`, `@/components` 등 별칭 사용

### Styling & Design System
- **CSS Modules (필수)**
  - **선택 이유**: 컴포넌트별 스타일 격리, 타입 안전성
  - **파일 형식**: `styles.module.css` 필수 사용
  - **모바일 전용 설계**: 375px 고정값 기준, 반응형 미지원
  - **CSS 변수 기반**: 기존 디자인 토큰 시스템 활용
- **Tailwind CSS 4+ (선택사항)**
  - **사용 범위**: CSS Module로 구현하기 어려운 유틸리티 클래스가 필요한 경우에만 선택적 사용
  - **우선순위**: CSS Module을 우선 사용하고, 필요시에만 Tailwind 보조 사용

### Icon Library
- **lucide-react** (이미 설치됨: v0.563.0)
  - **선택 이유**: 명세서 요구사항, 경량 아이콘 라이브러리
  - **사용 아이콘**: 
    - `Bell` (소식/알림)
    - `Map` (홈/지도)
    - `User` (마이/사용자)
  - **최적화**: Next.js의 `optimizePackageImports` 설정 활용

### State Management
- **React Context API** (클라이언트 상태)
  - **선택 이유**: GNB 표시/숨김 상태 관리, 경로 기반 조건부 렌더링
  - **사용 범위**: 현재 경로 감지, GNB 표시 여부 결정

---

## 🏛 아키텍처 설계

### Feature Slice Architecture 적용

레이아웃 및 GNB는 공용 컴포넌트이므로 `commons/` 레이어에 배치합니다.

```
src/
├── app/                          # [Routing Layer]
│   ├── layout.tsx               # Root Layout (375px 모바일 프레임)
│   ├── (auth)/                  # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   └── (main)/                  # 메인 기능 라우트 그룹
│       ├── page.tsx            # 홈
│       ├── notifications/      # 소식
│       └── profile/             # 마이
├── components/                   # [Feature Layer] (레이아웃 관련 없음)
└── commons/                      # [Shared Layer]
    ├── layout/                   # 레이아웃 관련 컴포넌트
    │   ├── mobile-frame/        # 375px 모바일 프레임 컨테이너
    │   │   ├── index.tsx
    │   │   └── styles.module.css
    │   └── gnb/                  # GNB 컴포넌트
    │       ├── index.tsx
    │       ├── styles.module.css
    │       └── types.ts
    └── hooks/
        └── useGNB.ts             # GNB 표시 여부 결정 훅
```

### 레이아웃 구조 설계

#### 1. Root Layout (`app/layout.tsx`)
- **역할**: 375px 모바일 프레임 컨테이너 설정
- **구조**: 
  - 중앙 고정 컨테이너 (최대 480px)
  - 배경색 설정 (`bg-[#F4F5F7]`)
  - 모바일 프레임 내부에 콘텐츠 영역 배치

#### 2. Mobile Frame Component (`commons/layout/mobile-frame/`)
- **역할**: 모든 페이지에 적용되는 모바일 프레임 래퍼
- **특징**:
  - 375px 고정 너비
  - 중앙 정렬
  - 좌우 여백 자동 처리
  - 배경색 적용

#### 3. GNB Component (`commons/layout/gnb/`)
- **역할**: 화면 하단 고정 네비게이션 바
- **특징**:
  - 화면 하단 고정 (`position: fixed`)
  - 3개 아이콘 배치 (소식, 홈, 마이)
  - lucide-react 아이콘 사용
  - 클릭 시 페이지 전환
  - 접근성 지원 (aria-label, 키보드 네비게이션)

#### 4. Conditional Layout (`app/(main)/layout.tsx`)
- **역할**: 메인 기능 페이지에만 GNB 표시
- **구조**: 
  - Mobile Frame + GNB 조합
  - 콘텐츠 영역에 GNB 높이만큼 하단 여백 추가

#### 5. Auth Layout (`app/(auth)/layout.tsx`)
- **역할**: 인증 관련 페이지 (GNB 숨김)
- **구조**: 
  - Mobile Frame만 사용 (GNB 제외)
  - 콘텐츠 영역에 하단 여백 불필요

### 라우팅 전략

#### 라우트 그룹 활용
- **`(auth)` 그룹**: 로그인, 회원가입, 온보딩 페이지
  - GNB 숨김
  - 전용 레이아웃 적용
- **`(main)` 그룹**: 메인 기능 페이지
  - GNB 표시
  - 공통 레이아웃 적용

#### 경로 구조
```
app/
├── layout.tsx                    # Root Layout (모바일 프레임)
├── (auth)/
│   ├── layout.tsx               # Auth Layout (GNB 숨김)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── onboarding/
│       └── page.tsx
└── (main)/
    ├── layout.tsx               # Main Layout (GNB 표시)
    ├── page.tsx                # 홈 (/)
    ├── notifications/
    │   └── page.tsx            # 소식 (/notifications)
    └── profile/
        └── page.tsx            # 마이 (/profile)
```

---

## 📁 상세 컴포넌트 설계

### 1. Mobile Frame Component

**위치**: `src/commons/layout/mobile-frame/`

**역할**:
- 375px 고정 너비 컨테이너
- 중앙 정렬
- 배경색 적용 (`bg-[#F4F5F7]`)
- 모든 페이지의 기본 래퍼

**Props**:
```typescript
interface MobileFrameProps {
  children: React.ReactNode;
  className?: string;
}
```

**스타일 규칙** (CSS Module 사용):
- 최대 너비: 480px (375px 기준, 여유 공간)
- 중앙 정렬: `margin: 0 auto`
- 배경색: 프로젝트 메인 배경색 (CSS 변수 사용)
- 고정 단위 사용 (px)
- `styles.module.css` 파일에 모든 스타일 정의

### 2. GNB Component

**위치**: `src/commons/layout/gnb/`

**역할**:
- 화면 하단 고정 네비게이션 바
- 3개 메뉴 아이콘 표시
- 페이지 전환 기능
- 접근성 지원

**Props**:
```typescript
interface GNBProps {
  currentPath?: string; // 현재 경로 (활성 상태 표시용, 향후 확장)
}
```

**아이콘 구성**:
- **소식**: `Bell` (lucide-react)
  - 경로: `/notifications`
  - aria-label: "소식"
- **홈**: `Map` (lucide-react)
  - 경로: `/`
  - aria-label: "홈"
- **마이**: `User` (lucide-react)
  - 경로: `/profile`
  - aria-label: "마이페이지"

**스타일 규칙** (CSS Module 사용):
- 하단 고정: `position: fixed; bottom: 0`
- 너비: 375px (모바일 프레임 너비와 동일)
- 높이: 최소 60px (터치 타겟 고려)
- 아이콘 크기: 24px × 24px
- 터치 타겟: 최소 44px × 44px
- 배경색: 디자인 토큰 사용 (CSS 변수)
- 그림자: 상단 그림자 (선택적)
- `styles.module.css` 파일에 모든 스타일 정의

### 3. useGNB Hook

**위치**: `src/commons/hooks/useGNB.ts`

**역할**:
- 현재 경로 감지
- GNB 표시 여부 결정
- 경로별 조건부 로직

**반환값**:
```typescript
interface UseGNBReturn {
  shouldShowGNB: boolean;
  currentPath: string;
}
```

**로직**:
- 인증 관련 경로 (`/login`, `/signup`, `/onboarding`) → `shouldShowGNB: false`
- 그 외 경로 → `shouldShowGNB: true`

---

## 🎨 스타일링 전략

### CSS Module 우선 원칙

#### 1. 필수 사용 규칙
- **CSS Module 필수**: 모든 컴포넌트는 `styles.module.css` 파일을 필수로 사용
- **파일 구조**: 각 컴포넌트 폴더에 `index.tsx`와 `styles.module.css` 쌍으로 구성
- **타입 안전성**: TypeScript에서 CSS Module 클래스명 자동 완성 및 타입 체크
- **스타일 격리**: 컴포넌트별 스타일이 자동으로 격리되어 충돌 방지

#### 2. Tailwind CSS 선택적 사용
- **보조 도구**: CSS Module로 구현하기 어려운 경우에만 선택적 사용
- **우선순위**: CSS Module을 우선 사용하고, 필요시에만 Tailwind 보조 사용
- **혼용 가능**: CSS Module과 Tailwind를 함께 사용 가능 (className에 둘 다 적용 가능)

### 모바일 전용 설계 원칙

#### 1. 고정 단위 사용
- **px 단위 우선**: 반응형 단위(vw, %, rem) 대신 고정 단위(px) 사용
- **375px 기준**: 모든 컴포넌트는 375px 너비 기준으로 설계
- **일관성 유지**: 다양한 기기에서 동일한 시각적 경험

#### 2. 쿠캣 스타일 레이아웃
- **중앙 고정 뷰**: PC 환경에서도 중앙에 모바일 크기로 렌더링
- **기준 너비**: 375px 고정 (최대 480px 초과 금지)
- **배경 설정**: 컨텐츠 영역 밖(좌우 여백)은 CSS 변수 또는 CSS Module로 배경색 적용

#### 3. 반응형 미지원
- **미디어 쿼리 금지**: 반응형 CSS 작성 금지
- **고정 레이아웃**: 모든 화면 크기에서 동일한 레이아웃
- **개발 효율성**: 반응형 고려 없이 빠른 개발

### 디자인 토큰 활용

#### 색상
- 프로젝트 디자인 토큰 시스템 준수
- 하드코딩 색상값 금지
- CSS 변수 또는 CSS Module 내에서 디자인 토큰 변수 사용
- Tailwind 토큰은 선택적으로만 사용

#### 간격
- 디자인 토큰의 spacing 시스템 활용
- CSS Module에서 CSS 변수로 간격 값 사용
- 일관된 간격 유지

#### 타이포그래피
- 기존 타이포그래피 토큰 활용
- CSS Module에서 타이포그래피 스타일 정의
- 아이콘 라벨 (선택적) 스타일링

---

## 🔧 구현 세부사항

### 1. Root Layout 수정

**파일**: `src/app/layout.tsx`

**변경 사항**:
- Mobile Frame 컴포넌트로 children 래핑
- 375px 모바일 프레임 설정
- 배경색 적용

**구조**:
```tsx
<MobileFrame>
  <Providers>
    {children}
  </Providers>
</MobileFrame>
```

### 2. Auth Layout 생성

**파일**: `src/app/(auth)/layout.tsx`

**역할**:
- 인증 관련 페이지 전용 레이아웃
- GNB 제외
- Mobile Frame만 적용

**구조**:
```tsx
import styles from './styles.module.css'; // CSS Module 사용

export default function AuthLayout({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}
```

**스타일 파일**: `src/app/(auth)/styles.module.css`
- CSS Module로 레이아웃 스타일 정의

### 3. Main Layout 생성

**파일**: `src/app/(main)/layout.tsx`

**역할**:
- 메인 기능 페이지 전용 레이아웃
- GNB 포함
- 콘텐츠 영역 하단 여백 추가 (GNB 높이만큼)

**구조**:
```tsx
import styles from './styles.module.css'; // CSS Module 사용

export default function MainLayout({ children }) {
  return (
    <div className={styles.container}>
      {children}
      <GNB />
    </div>
  );
}
```

**스타일 파일**: `src/app/(main)/styles.module.css`
- CSS Module로 하단 여백 및 레이아웃 스타일 정의

### 4. GNB 컴포넌트 구현

**파일**: `src/commons/layout/gnb/index.tsx`

**구현 내용**:
- lucide-react 아이콘 import
- 3개 메뉴 아이콘 렌더링
- Next.js Link를 사용한 페이지 전환
- 접근성 속성 추가 (aria-label, role)
- 키보드 네비게이션 지원
- CSS Module 사용: `styles.module.css`에서 스타일 import 및 적용

**아이콘 import 최적화**:
```tsx
// ✅ GOOD: 개별 import (트리 쉐이킹)
import { Bell } from 'lucide-react/dist/esm/icons/bell';
import { Map } from 'lucide-react/dist/esm/icons/map';
import { User } from 'lucide-react/dist/esm/icons/user';

// ❌ BAD: 전체 import (번들 크기 증가)
import { Bell, Map, User } from 'lucide-react';
```

### 5. useGNB Hook 구현

**파일**: `src/commons/hooks/useGNB.ts`

**구현 내용**:
- Next.js `usePathname` 훅 활용
- 경로 기반 GNB 표시 여부 결정
- 타입 안전한 반환값

**로직**:
```typescript
const HIDE_GNB_PATHS = ['/login', '/signup', '/onboarding'];

export function useGNB() {
  const pathname = usePathname();
  const shouldShowGNB = !HIDE_GNB_PATHS.includes(pathname);
  
  return { shouldShowGNB, currentPath: pathname };
}
```

---

## 🚀 성능 최적화

### 1. 아이콘 라이브러리 최적화

**전략**:
- lucide-react 개별 아이콘 import
- Next.js `optimizePackageImports` 설정 활용
- 트리 쉐이킹으로 번들 크기 최소화

**설정** (`next.config.ts`):
```typescript
optimizePackageImports: ['lucide-react']
```

### 2. 컴포넌트 최적화

**전략**:
- GNB는 클라이언트 컴포넌트 (`'use client'`)
- Mobile Frame은 서버 컴포넌트 (가능한 경우)
- React.memo 활용 (필요시)

### 3. 레이아웃 최적화

**전략**:
- 중첩 레이아웃으로 코드 중복 최소화
- 조건부 렌더링으로 불필요한 렌더링 방지
- CSS Module 사용으로 런타임 오버헤드 최소화
- Tailwind CSS는 선택적으로만 보조 사용

---

## 🔐 접근성 (A11y) 전략

### 1. 키보드 네비게이션
- GNB 아이콘에 `tabIndex={0}` 설정
- Enter/Space 키로 클릭 가능
- 포커스 표시 스타일 적용 (CSS Module에서 `:focus` 스타일 정의)

### 2. 스크린 리더 지원
- 모든 아이콘에 `aria-label` 제공
- 의미 있는 텍스트 라벨
- `role="navigation"` 설정

### 3. 터치 타겟 크기
- 최소 44px × 44px 터치 타겟
- 충분한 간격 유지
- 터치 영역 확장 (필요시)

### 4. 색상 대비
- WCAG AA 기준 준수
- 아이콘과 배경 간 충분한 대비
- 포커스 상태 명확한 표시

---

## 📋 개발 워크플로우

### 1. 개발 순서

1. **의존성 확인**: lucide-react 설치 확인 (이미 완료)
2. **Mobile Frame 컴포넌트 구현**: 기본 레이아웃 컨테이너 + `styles.module.css` 작성
3. **GNB 컴포넌트 구현**: 아이콘 및 네비게이션 로직 + `styles.module.css` 작성
4. **useGNB Hook 구현**: 경로 기반 표시 여부 결정
5. **Root Layout 수정**: Mobile Frame 적용
6. **Auth Layout 생성**: GNB 숨김 레이아웃 + `styles.module.css` 작성
7. **Main Layout 생성**: GNB 표시 레이아웃 + `styles.module.css` 작성
8. **테스트**: 각 페이지에서 GNB 표시/숨김 확인

### 2. 테스트 체크리스트

- [ ] Mobile Frame이 375px 고정 너비로 표시됨
- [ ] Mobile Frame이 중앙 정렬됨
- [ ] 배경색이 올바르게 적용됨
- [ ] GNB가 화면 하단에 고정됨
- [ ] GNB 아이콘 배치 순서가 올바름 (소식 → 홈 → 마이)
- [ ] 각 아이콘 클릭 시 해당 페이지로 이동함
- [ ] 로그인 페이지에서 GNB가 숨겨짐
- [ ] 회원가입 페이지에서 GNB가 숨겨짐
- [ ] 온보딩 페이지에서 GNB가 숨겨짐
- [ ] 홈 페이지에서 GNB가 표시됨
- [ ] 소식 페이지에서 GNB가 표시됨
- [ ] 마이페이지에서 GNB가 표시됨
- [ ] 키보드 네비게이션 동작 확인
- [ ] 스크린 리더 지원 확인
- [ ] 터치 타겟 크기 확인 (44px × 44px 이상)

---

## 🔄 향후 확장 가능성

### 1. 활성 상태 표시
- 현재 페이지에 해당하는 아이콘 시각적 구분
- 활성 상태 스타일 적용
- `currentPath` prop 활용

### 2. 알림 배지
- 소식 아이콘에 미확인 알림 개수 표시
- 배지 컴포넌트 추가
- 알림 상태 관리 연동

### 3. 애니메이션
- 페이지 전환 시 부드러운 전환 효과
- 아이콘 클릭 시 피드백 애니메이션
- Framer Motion 등 라이브러리 활용

### 4. 접근성 향상
- 스킵 네비게이션 링크 추가
- 키보드 단축키 지원
- 고대비 모드 지원

---

## 📊 기술 의존성

### 필수 패키지
- **Next.js 16+**: App Router, Layout 시스템, CSS Module 지원
- **React 19+**: 컴포넌트 라이브러리
- **TypeScript 5+**: 타입 안전성, CSS Module 타입 지원
- **lucide-react 0.563.0**: 아이콘 라이브러리 (이미 설치됨)

### 선택적 패키지
- **Tailwind CSS 4+**: 스타일링 (선택사항, CSS Module 보조용)

### 추가 선택적 패키지
- **Framer Motion**: 애니메이션 (향후 확장)
- **React Aria**: 접근성 컴포넌트 (향후 확장)

---

## 🎯 구현 우선순위

### Phase 1: 기본 레이아웃 (P1)
1. Mobile Frame 컴포넌트 구현 + `styles.module.css` 작성
2. Root Layout 수정 (Mobile Frame 적용)
3. 기본 스타일링 (375px 고정, 중앙 정렬) - CSS Module 사용

### Phase 2: GNB 구현 (P2)
1. GNB 컴포넌트 기본 구조 + `styles.module.css` 작성
2. lucide-react 아이콘 통합
3. 페이지 전환 로직 구현
4. 하단 고정 스타일링 - CSS Module 사용

### Phase 3: 조건부 표시 (P3)
1. useGNB Hook 구현
2. Auth Layout 생성 (GNB 숨김) + `styles.module.css` 작성
3. Main Layout 생성 (GNB 표시) + `styles.module.css` 작성
4. 경로별 테스트

### Phase 4: 접근성 및 최적화 (P4)
1. 접근성 속성 추가
2. 키보드 네비게이션 구현 (CSS Module에서 포커스 스타일)
3. 성능 최적화 (아이콘 import 최적화, CSS Module 최적화)
4. 최종 테스트 및 검증

---

## 📝 참고사항

### 모바일 프레임 완결성
- 모든 결과물은 `app/layout.tsx`에 정의된 모바일 프레임 안에서 완결성 있게 표시
- 375px 기준으로 모든 UI 컴포넌트 설계
- 프레임 내에서 핵심 기능 완료 가능

### 반응형 미지원 원칙
- 미디어 쿼리나 유연한 단위(vw, %) 대신 고정 단위(px) 사용
- 다양한 모바일 기기에서 동일한 시각적 경험 제공
- 반응형 고려 없이 빠른 개발 가능

### Feature Slice Architecture 준수
- 레이아웃 관련 컴포넌트는 `commons/layout/`에 배치
- 비즈니스 로직은 `commons/hooks/`에 배치
- `app/` 레이어는 순수 라우팅 역할만 수행

### CSS Module 필수 사용 원칙
- 모든 컴포넌트는 `styles.module.css` 파일을 필수로 사용
- CSS Module을 우선 사용하고, 필요시에만 Tailwind CSS 보조 사용
- TypeScript에서 CSS Module 타입 자동 생성 및 타입 체크 활용
- 컴포넌트별 스타일 격리로 충돌 방지

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
