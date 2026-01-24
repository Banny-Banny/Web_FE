# 바니바니 웹 프론트엔드

바니바니 프로젝트의 웹입니다.

## 기술 스택

- **Framework**: Next.js 16.1.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Playwright
- **Linting**: ESLint

## 프로젝트 구조

이 프로젝트는 **Feature Slice Architecture**를 따릅니다.

```
src/
├── app/          # [Routing Layer] URL & Navigation ONLY
├── components/   # [Features] Business Logic & "Smart" Containers
├── commons/      # [Design System] Reusable "Dumb" UI components
└── utils/        # [Pure Functions] Helper functions
```

### 아키텍처 규칙

- **app/**: 라우팅과 레이아웃만 관리. 비즈니스 로직 금지
- **components/**: Feature별 비즈니스 로직과 스마트 컨테이너
- **commons/**: 순수 UI 컴포넌트 (디자인 시스템)
- **utils/**: React와 무관한 순수 함수

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

### 빌드

```bash
npm run build
npm run start
```

### 테스트

```bash
npm run test
```

## 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

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

- Tailwind CSS 토큰을 사용하여 스타일을 적용합니다
- `tailwind.config.js`에서 호스트의 색상 토큰을 임포트하여 사용합니다
- 인라인 스타일과 하드코딩된 색상값 사용을 금지합니다

자세한 스타일링 규칙은 `.cursor/rules/03-ui.mdc`를 참고하세요.

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
