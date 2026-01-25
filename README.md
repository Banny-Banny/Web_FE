# 바니바니 웹 프론트엔드

바니바니 프로젝트의 웹입니다.

## 기술 스택

- **Framework**: Next.js 16.1.4
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack React Query v5
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Bundler**: Webpack (Next.js 16 기본값은 Turbopack이지만 Webpack 사용)
- **Testing**: Playwright
- **Linting**: ESLint

## 프로젝트 구조

이 프로젝트는 **Feature Slice Architecture**를 따릅니다.

```
src/
├── app/              # [Routing Layer] Next.js 페이지 및 레이아웃
│   ├── (auth)/       # 인증 관련 라우트 그룹
│   └── (main)/       # 메인 앱 라우트 그룹
├── components/       # [Features] Feature별 스마트 컴포넌트
└── commons/          # [Shared Core] 프로젝트의 모든 공용 자산
    ├── apis/         # API 함수 + 데이터 타입 (Axios 활용)
    ├── providers/    # QueryProvider, Axios 인스턴스 등 전역 Provider
    ├── hooks/        # React Query, Zustand 등 데이터 바인딩 훅
    ├── components/   # 디자인 시스템 (공용 버튼, 인풋 등)
    ├── layout/       # 공용 레이아웃 컴포넌트 (GNB, MobileFrame 등)
    ├── styles/       # Tailwind CSS 설정 및 디자인 토큰
    ├── types/        # 공용 타입 정의
    └── utils/        # 순수 함수 (날짜 포맷터, 성능 측정 등)
```

### 아키텍처 규칙

- **app/**: 라우팅과 레이아웃만 관리. 비즈니스 로직 금지
- **components/**: Feature별 비즈니스 로직과 스마트 컨테이너
- **commons/**: 모든 공용 자산 통합 관리
  - `apis/`: API 함수 및 타입
  - `providers/`: 전역 Provider (React Query, Axios 등)
  - `hooks/`: 데이터 바인딩 훅
  - `components/`: 순수 UI 컴포넌트 (디자인 시스템)
  - `layout/`: 공용 레이아웃 컴포넌트
  - `styles/`: 디자인 토큰 및 글로벌 스타일
  - `types/`: 공용 타입 정의
  - `utils/`: React와 무관한 순수 함수

자세한 구조 규칙은 `.cursor/rules/project-structure.mdc`를 참고하세요.

## 시작하기

### 필수 요구사항

- Node.js 20 이상
- npm, yarn, pnpm, 또는 bun

### 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

> **참고**: Next.js 16은 기본적으로 Turbopack을 사용하지만, 이 프로젝트는 Webpack을 사용합니다 (`--webpack` 플래그 사용).

### 빌드

```bash
# 린트 체크 후 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 번들 분석

```bash
# 전체 번들 분석
npm run analyze

# 서버 번들만 분석
npm run analyze:server

# 브라우저 번들만 분석
npm run analyze:browser
```

### 린트

```bash
npm run lint
```

## 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

주요 환경 변수:
- `NEXT_PUBLIC_API_BASE_URL`: API 서버 기본 URL (기본값: `https://be-production-8aa2.up.railway.app`)
- `CDN_URL`: 프로덕션 환경의 CDN URL (선택사항)

## 개발 가이드

### 컴포넌트 생성

새로운 Feature를 생성할 때는 다음 구조를 따르세요:

```
components/{feature}/
├── index.tsx        # Feature Container
├── types.ts         # Feature-wide Definitions
├── hooks/           # Business Logic
│   └── use{Feature}.ts
└── components/      # Feature-specific Sub-components
    └── {sub-component}/
        ├── index.tsx
        └── styles.ts
```

### 스타일링 규칙

프로젝트는 **CSS Module**을 사용하여 컴포넌트별 스타일을 관리합니다.

#### 디자인 토큰 시스템

1. **디자인 토큰 정의**: `src/commons/styles/` 디렉토리에 TypeScript 객체로 정의
   - `color.ts`: 색상 팔레트
   - `spacing.ts`: 간격 및 반경 토큰
   - `fonts.ts`: 폰트 패밀리, 크기, 웨이트
   - `typography.ts`: 타이포그래피 스타일

2. **CSS 변수 생성**: `src/app/layout.tsx`에서 디자인 토큰을 CSS 변수로 변환하여 `:root`에 주입
   - `generateColorCSSVariables()`: 색상 토큰 → `--color-*` 변수
   - `generateSpacingCSSVariables()`: 간격/반경 토큰 → `--spacing-*`, `--radius-*` 변수
   - `generateTypographyCSSVariables()`: 타이포그래피 토큰 → `--font-*` 변수

3. **컴포넌트 스타일링**: `styles.module.css`에서 CSS 변수 사용
   ```css
   .button {
     background-color: var(--color-black-500);
     padding: 0 var(--spacing-xl);
     border-radius: var(--radius-xl);
   }
   ```

#### 주요 규칙

- ✅ **CSS Module 사용**: 모든 컴포넌트 스타일은 `styles.module.css`에 작성
- ✅ **CSS 변수 사용**: 디자인 토큰은 CSS 변수(`var(--color-*)`, `var(--spacing-*)` 등)로 참조
- ❌ **인라인 스타일 금지**: `style={...}` 사용 금지
- ❌ **하드코딩 색상값 금지**: hex/rgb/hsl 직접 입력 금지, CSS 변수만 사용
- ❌ **중복 선언 금지**: 디자인 토큰은 `src/commons/styles/`에서만 정의

자세한 스타일링 규칙은 `.cursor/rules/03-ui.mdc`를 참고하세요.

### API 클라이언트

- Axios 기반 API 클라이언트를 사용합니다
- API 함수는 `src/commons/apis/`에 정의합니다
- React Query를 통한 서버 상태 관리를 권장합니다
- API Provider는 `src/commons/provider/api-provider/`에서 관리합니다

## 라이브러리 관리

새로운 라이브러리를 추가하거나 제거할 때는 `doc/v.1.0/package.md` 파일을 업데이트해야 합니다.

자세한 내용은 `.cursor/rules/package.mdc`를 참고하세요.

## 기여하기

1. Feature 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
2. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
3. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
4. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
