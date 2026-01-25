# TimeEgg 웹 프론트엔드 개발 환경 설정 가이드

이 문서는 TimeEgg 웹 프론트엔드 프로젝트의 개발 환경을 설정하는 방법을 안내합니다.

---

## 📋 목차

1. [필수 도구 설치](#필수-도구-설치)
2. [프로젝트 클론 및 설치](#프로젝트-클론-및-설치)
3. [환경 변수 설정](#환경-변수-설정)
4. [개발 서버 실행](#개발-서버-실행)
5. [IDE 설정](#ide-설정)
6. [유용한 명령어](#유용한-명령어)

---

## 필수 도구 설치

### 1. Node.js 설치

**권장 버전**: Node.js 20.x 이상

#### macOS (Homebrew 사용)
```bash
brew install node@20
```

#### Windows (Node.js 공식 사이트)
[Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드

#### 설치 확인
```bash
node --version  # v20.x.x 이상
npm --version   # 10.x.x 이상
```

### 2. Git 설치

#### macOS
```bash
brew install git
```

#### Windows
[Git 공식 사이트](https://git-scm.com/)에서 다운로드

#### 설치 확인
```bash
git --version
```

### 3. IDE 설치 (권장: Visual Studio Code)

[VS Code 공식 사이트](https://code.visualstudio.com/)에서 다운로드

#### 필수 VS Code 확장 프로그램
- **ESLint**: 코드 린팅
- **Prettier**: 코드 포매팅
- **Tailwind CSS IntelliSense**: Tailwind 자동완성
- **TypeScript and JavaScript Language Features**: TypeScript 지원
- **Playwright Test for VSCode**: E2E 테스트 실행

확장 프로그램 설치:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-playwright.playwright
```

---

## 프로젝트 클론 및 설치

### 1. 저장소 클론

```bash
git clone <repository-url>
cd TimeEgg/Web_FE
```

### 2. 의존성 설치

```bash
npm install
```

이 명령어는 다음 패키지들을 설치합니다:
- **Next.js 16**: React 프레임워크
- **React 19**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Tailwind CSS 4**: 스타일링
- **React Query**: 서버 상태 관리
- **Axios**: HTTP 클라이언트
- **Playwright**: E2E 테스트
- **ESLint/Prettier**: 코드 품질 도구

### 3. 설치 확인

```bash
npm run build
```

빌드가 성공하면 설치가 완료된 것입니다.

---

## 환경 변수 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

### 2. 환경 변수 설정

`.env.local` 파일을 열어 다음 값들을 설정합니다:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 포트원 설정 (결제 기능 사용 시)
NEXT_PUBLIC_PORTONE_STORE_ID=your_store_id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your_channel_key
```

### 3. 환경 변수 규칙

- **`NEXT_PUBLIC_*`**: 클라이언트에서 접근 가능한 환경 변수
- **일반 변수**: 서버 사이드에서만 접근 가능

⚠️ **보안 주의사항**:
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 민감한 정보(API 키, 비밀번호 등)는 반드시 환경 변수로 관리하세요

---

## 개발 서버 실행

### 1. 개발 모드 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 2. 개발 서버 특징

- **Hot Reload**: 코드 변경 시 자동 새로고침
- **Fast Refresh**: React 컴포넌트 상태 유지하며 업데이트
- **TypeScript 타입 체크**: 실시간 타입 에러 표시
- **React Query Devtools**: 서버 상태 모니터링 도구 (개발 환경에서만 표시)

---

## IDE 설정

### VS Code 설정

프로젝트 루트에 `.vscode/settings.json` 파일을 생성합니다:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 자동 포매팅 설정

1. VS Code에서 `Cmd/Ctrl + Shift + P` 실행
2. "Format Document With..." 선택
3. "Prettier - Code formatter" 선택
4. 기본 포매터로 설정

---

## 유용한 명령어

### 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 번들 분석
npm run analyze
```

### 테스트 명령어

```bash
# Playwright E2E 테스트 실행
npx playwright test

# Playwright UI 모드 실행
npx playwright test --ui

# Playwright 특정 테스트 실행
npx playwright test tests/example.spec.ts
```

### 유틸리티 명령어

```bash
# TypeScript 타입 체크
npx tsc --noEmit

# 캐시 정리
rm -rf .next node_modules package-lock.json
npm install

# 포트 확인 및 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

---

## 프로젝트 구조 이해

```
src/
├── app/                 # Next.js App Router (라우팅)
│   ├── layout.tsx      # 전역 레이아웃
│   ├── page.tsx        # 홈페이지
│   ├── loading.tsx     # 로딩 UI
│   ├── error.tsx       # 에러 UI
│   └── not-found.tsx   # 404 페이지
│
├── components/          # 기능별 컴포넌트 (Feature Slice)
│   └── [feature]/
│       ├── index.tsx   # 컨테이너
│       ├── types.ts    # 타입 정의
│       ├── hooks/      # 비즈니스 로직
│       └── components/ # UI 컴포넌트
│
└── commons/             # 공용 자산
    ├── apis/           # API 함수
    ├── provider/       # Context Provider
    ├── hooks/          # 공용 훅
    ├── components/     # 디자인 시스템
    ├── utils/          # 유틸리티 함수
    └── styles/         # 스타일 정의
```

---

## 다음 단계

1. ✅ 개발 환경 설정 완료
2. 📖 [Next.js 프로젝트 규칙 문서](../architecture/nextjs.md) 읽기
3. 🚀 첫 번째 기능 개발 시작
4. 🧪 테스트 작성 및 실행

---

## 도움이 필요한 경우

- 일반적인 문제는 [트러블슈팅 가이드](./troubleshooting.md)를 참고하세요
- 추가 질문은 팀 채널에 문의하세요

---

**예상 설정 시간**: 약 30분

**마지막 업데이트**: 2026-01-25
