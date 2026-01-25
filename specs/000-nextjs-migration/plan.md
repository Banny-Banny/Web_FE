# TimeEgg 웹 프론트엔드 기술 계획서

## 📋 개요

이 문서는 TimeEgg 웹 프론트엔드의 기본 인프라 구축을 위한 기술적 결정사항과 구현 계획을 정의합니다.

---

## 🏗 기술 스택 결정

### Core Framework
- **Next.js 16+** (App Router)
  - **선택 이유**: SSR/SSG 지원, 성능 최적화, 개발 경험
  - **App Router 사용**: 최신 라우팅 시스템, 레이아웃 시스템, 메타데이터 API
  - **Server Component 우선**: 기본은 서버 컴포넌트, 필요시에만 클라이언트 컴포넌트

### Language & Type System
- **TypeScript 5+**
  - **선택 이유**: 타입 안전성, 개발 생산성, 팀 협업 효율성
  - **엄격한 설정**: strict mode, noImplicitAny, exactOptionalPropertyTypes
  - **절대 경로**: `@/commons`, `@/components` 등 별칭 사용

### Styling & Design System
- **Tailwind CSS 4+**
  - **선택 이유**: 유틸리티 퍼스트, 빠른 개발, 일관성
  - **커스텀 설정**: 기존 디자인 토큰 통합
  - **CSS 변수 기반**: 색상, 폰트, 간격 등 토큰화

### State Management
- **React Query 5+** (서버 상태)
  - **선택 이유**: 캐싱, 동기화, 백그라운드 업데이트
  - **사용 범위**: API 호출, 데이터 캐싱, 낙관적 업데이트

- **React Context + useReducer** (전역 상태)
  - **선택 이유**: React 내장 기능, 추가 의존성 없음
  - **사용 범위**: 사용자 인증, 전역 UI 상태, 설정

### HTTP Client
- **Axios 1+**
  - **선택 이유**: 인터셉터, 요청/응답 변환, 에러 처리
  - **설정**: 기본 URL, 타임아웃, 재시도 로직
  - **인터셉터**: 인증 토큰, 에러 처리, 로깅

---

## 🏛 아키텍처 설계

### Feature Slice Architecture
프로젝트는 3개 레이어로 구성되며, 의존성은 단방향으로 흐릅니다: `app` → `components` → `commons`

```
src/
├── app/              # [Routing Layer] Next.js App Router
├── components/       # [Feature Layer] 화면별 스마트 컴포넌트
└── commons/          # [Shared Layer] 공용 자산
```

### Routing Strategy (App Router)
- **파일 기반 라우팅**: `app/` 폴더 구조가 URL 구조 결정
- **레이아웃 시스템**: 중첩 레이아웃으로 공통 UI 재사용
- **Server Component 우선**: 기본은 서버 렌더링, 필요시에만 클라이언트
- **메타데이터 API**: SEO 최적화를 위한 동적 메타데이터

### Data Fetching Strategy
- **Server Component**: 초기 데이터 로딩 (fetch API + 캐시)
- **Client Component**: 사용자 상호작용, 실시간 데이터 (React Query)
- **캐싱 전략**: Next.js 내장 캐시 + React Query 캐시 조합
- **재검증**: ISR (Incremental Static Regeneration) 활용

---

## 📁 상세 폴더 구조

### 1. App Layer (`src/app/`)
```
app/
├── layout.tsx           # Root Layout (HTML, Body, 전역 설정)
├── page.tsx            # 홈페이지
├── globals.css         # 전역 스타일
├── loading.tsx         # 전역 로딩 컴포넌트
├── error.tsx           # 전역 에러 컴포넌트
├── not-found.tsx       # 404 페이지
└── (routes)/           # 라우트 그룹
    ├── auth/           # 인증 관련 페이지
    ├── map/            # 지도 관련 페이지
    └── profile/        # 프로필 관련 페이지
```

**역할 및 규칙**:
- URL 라우팅 및 레이아웃 관리
- 비즈니스 로직 금지 (순수 라우팅 역할)
- Feature Container 컴포넌트 import 및 렌더링
- 메타데이터 및 SEO 설정

### 2. Components Layer (`src/components/`)
```
components/
├── home/               # 홈 화면 피처
│   ├── index.tsx      # Feature Container
│   ├── types.ts       # 피처 타입 정의
│   ├── hooks/         # 비즈니스 로직
│   │   └── useHomeFeature.ts
│   └── components/    # 피처별 서브 컴포넌트
│       ├── home-view/
│       └── home-card/
├── auth/              # 인증 피처
└── map/               # 지도 피처
```

**Feature Slice 규칙**:
- **Container**: 로직과 UI 연결, 컴포지션 역할
- **Hooks**: 비즈니스 로직, API 호출, 상태 관리
- **Components**: 순수 UI 컴포넌트, props 기반

### 3. Commons Layer (`src/commons/`)
```
commons/
├── apis/              # API 함수 및 타입
│   ├── index.ts      # 배럴 파일
│   ├── client.ts     # Axios 인스턴스
│   ├── auth.ts       # 인증 API
│   └── types/        # API 타입 정의
├── providers/         # 전역 프로바이더
│   ├── index.ts      # 프로바이더 컴포지션
│   ├── query-provider.tsx
│   └── theme-provider.tsx
├── hooks/             # 공용 훅
│   ├── index.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── components/        # 디자인 시스템
│   ├── index.ts
│   ├── button/
│   ├── input/
│   └── modal/
├── utils/             # 순수 함수
│   ├── index.ts
│   ├── format.ts     # 날짜, 숫자 포맷팅
│   └── validation.ts # 유효성 검사
└── styles/            # 스타일 시스템
    ├── index.ts
    ├── globals.css   # 전역 스타일
    ├── variables.css # CSS 변수
    └── components.css # 컴포넌트 스타일
```

---

## 🎨 디자인 시스템 이식 계획

### 1. 디자인 시스템 구조
```
src/
├── app/
│   └── globals.css              # CSS 변수 등록 (컬러, 폰트)
├── commons/
│   ├── constants/
│   │   ├── color.ts            # 디자인 토큰 (TS 객체)
│   │   ├── typography.ts       # 타이포그래피 토큰 (TS 객체)
│   │   ├── spacing.ts          # 간격 토큰 (TS 객체)
│   │   └── fonts.ts            # 폰트 토큰 (TS 객체)
│   └── components/
│       └── button/
│           ├── index.ts        # 컴포넌트 로직
│           └── styles.module.css # 컴포넌트 스타일
└── components/
    └── home/
        └── components/
            └── home-card/
                ├── index.tsx
                └── styles.module.css
```

**globals.css에 CSS 변수 등록**:
```css
/* app/globals.css */
:root {
  /* 기존 TimeEgg/FE 색상 팔레트 */
  --color-white-50: #FFFFFF;
  --color-white-500: #FAFAFA;
  --color-white-600: #E4E4E4;
  --color-white-900: #696969;
  
  --color-grey-50: #F7F7F7;
  --color-grey-500: #B2B2B2;
  --color-grey-800: #626262;
  --color-grey-900: #4B4B4B;
  
  --color-black-50: #E7E7E7;
  --color-black-500: #0A0A0A;
  --color-black-600: #090909;
  --color-black-900: #040404;
  
  /* 폰트 변수 */
  --font-family-pretendard: 'Pretendard Variable', 'Pretendard', sans-serif;
}
```

### 2. 디자인 토큰 (TypeScript 파일)
```typescript
// commons/constants/color.ts - 기존 구조 유지
export const Colors = {
  white: {
    50: '#FFFFFF',
    500: '#FAFAFA',
    600: '#E4E4E4',
    900: '#696969',
  },
  grey: {
    50: '#F7F7F7',
    500: '#B2B2B2',
    800: '#626262',
    900: '#4B4B4B',
  },
  // ... 기존 구조 그대로
} as const;

// commons/constants/typography.ts - 기존 구조 유지
export const Typography = {
  header: {
    h1: {
      fontSize: 24,
      lineHeight: 24,
      fontWeight: 700,
      letterSpacing: -0.3125,
    },
    // ... 기존 구조 그대로
  },
  body: {
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 700,
      letterSpacing: -0.3125,
    },
    // ... 기존 구조 그대로
  },
} as const;
```

### 3. 컴포넌트 CSS 모듈 사용법
```typescript
// commons/components/button/index.tsx
import styles from './styles.module.css';
import { Colors, Typography } from '@/commons/constants';

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button 
      className={styles.button}
      style={{
        backgroundColor: Colors.blue[500],
        fontSize: Typography.caption.button.fontSize,
        fontWeight: Typography.caption.button.fontWeight,
      }}
    >
      {children}
    </button>
  );
}
```

```css
/* commons/components/button/styles.module.css */
.button {
  /* CSS 변수 사용 */
  background-color: var(--color-blue-500);
  color: var(--color-white-50);
  font-family: var(--font-family-pretendard);
  
  /* 기본 스타일 */
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover {
  background-color: var(--color-blue-600);
}
```

### 4. Tailwind CSS 통합 (선택적)
```javascript
// tailwind.config.js - CSS 변수 기반
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: {
          50: 'var(--color-white-50)',
          500: 'var(--color-white-500)',
          // ...
        },
      },
    },
  },
}
```

---

## ⚙️ 환경 설정 및 도구

### 환경 변수 관리
```bash
# .env.local (개발환경)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
DATABASE_URL=postgresql://...
JWT_SECRET=...

# .env.production (프로덕션)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.timeegg.com
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/commons/*": ["./src/commons/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

### ESLint + Prettier 설정
```javascript
// eslint.config.mjs
export default [
  {
    extends: ['next/core-web-vitals', '@typescript-eslint/recommended'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'import/order': ['error', { 'newlines-between': 'always' }],
    }
  }
];
```

---

## 🚀 성능 최적화 전략

### 번들 최적화
- **Code Splitting**: 라우트별 자동 분할
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Dynamic Import**: 필요시에만 로딩
- **Bundle Analyzer**: 번들 사이즈 모니터링

### 이미지 최적화
- **next/image**: 자동 최적화, 지연 로딩
- **WebP/AVIF**: 모던 포맷 우선 사용
- **Responsive Images**: 디바이스별 최적화
- **Placeholder**: 로딩 중 블러 효과

### 폰트 최적화
- **next/font**: 폰트 최적화 및 프리로드
- **Font Subsetting**: 필요한 글자만 포함
- **Font Display**: swap 전략으로 FOIT 방지
- **Local Fonts**: 로컬 폰트 우선 사용

---

## 🔄 데이터 플로우 설계

### 1. 서버 상태 (React Query)
```typescript
// API 호출 및 캐싱
const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.user.getProfile(),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};
```

### 2. 클라이언트 상태 (React Context)
```typescript
// 전역 상태 관리
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (credentials: LoginCredentials) => {
    const user = await api.auth.login(credentials);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. 프로바이더 컴포지션
```tsx
// 프로바이더 중첩 구조
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🛡 에러 처리 및 로깅

### Error Boundary 전략
```tsx
// 전역 에러 바운더리
export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Global Error:', error, errorInfo);
        // 에러 로깅 서비스 연동
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### API 에러 처리
```typescript
// Axios 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 에러 처리
      authStore.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

---

## 📋 개발 워크플로우

### 1. 개발 환경 설정
```bash
# 프로젝트 설치
npm install

# 개발 서버 시작
npm run dev

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 빌드 테스트
npm run build
```

### 2. 코드 품질 관리
- **Pre-commit Hook**: Husky + lint-staged
- **자동 포매팅**: Prettier 적용
- **타입 체크**: TypeScript strict mode
- **린트 검사**: ESLint 규칙 준수

### 3. 성능 모니터링
- **Bundle Analyzer**: 번들 사이즈 분석
- **Lighthouse**: 성능 지표 측정
- **React DevTools**: 컴포넌트 성능 분석
- **Next.js Analytics**: 실제 사용자 성능 데이터

---

## 🎯 구현 우선순위

### Phase 1: 기본 인프라 (1-2일)
1. 프로젝트 구조 및 폴더 생성
2. TypeScript 설정 및 절대 경로 별칭
3. ESLint + Prettier 설정
4. 기본 Next.js 설정 (next.config.js)

### Phase 2: 디자인 시스템 (2-3일)
1. 폰트 파일 복사 및 최적화 설정
2. 색상 시스템 CSS 변수 변환
3. Tailwind CSS 커스텀 설정
4. 아이콘 시스템 정리

### Phase 3: 상태 관리 및 API (1-2일)
1. React Query 프로바이더 설정
2. React Context 기본 구조
3. Axios 클라이언트 설정
4. 환경 변수 관리 시스템

### Phase 4: 성능 최적화 (1일)
1. 번들 최적화 설정
2. 이미지 및 폰트 최적화
3. 성능 모니터링 도구 설정
4. 에러 처리 시스템

---

## 📝 문서화 계획

### 1. 아키텍처 문서
- `docs/architecture/nextjs.md`: Next.js 프로젝트 규칙
- `docs/architecture/folder-structure.md`: 폴더 구조 가이드
- `docs/architecture/design-system.md`: 디자인 시스템 가이드

### 2. 개발 가이드
- `docs/development/setup.md`: 개발 환경 설정
- `docs/development/conventions.md`: 코딩 컨벤션
- `docs/development/performance.md`: 성능 최적화 가이드

### 3. 컴포넌트 문서
- Storybook 또는 문서화 도구 활용
- 컴포넌트별 사용법 및 예시
- 디자인 토큰 사용 가이드