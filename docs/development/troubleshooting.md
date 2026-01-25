# TimeEgg 웹 프론트엔드 트러블슈팅 가이드

이 문서는 TimeEgg 웹 프론트엔드 개발 중 자주 발생하는 문제와 해결 방법을 정리합니다.

---

## 📋 목차

1. [설치 및 환경 설정 문제](#설치-및-환경-설정-문제)
2. [개발 서버 실행 문제](#개발-서버-실행-문제)
3. [빌드 및 배포 문제](#빌드-및-배포-문제)
4. [TypeScript 관련 문제](#typescript-관련-문제)
5. [스타일링 문제](#스타일링-문제)
6. [API 및 네트워크 문제](#api-및-네트워크-문제)
7. [성능 문제](#성능-문제)
8. [테스트 관련 문제](#테스트-관련-문제)

---

## 설치 및 환경 설정 문제

### 문제: `npm install` 실패

#### 증상
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

#### 해결 방법

**방법 1: 캐시 정리 후 재설치**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**방법 2: Node.js 버전 확인**
```bash
node --version  # v20.x.x 이상이어야 함
```

Node.js 버전이 낮은 경우:
```bash
# macOS
brew upgrade node

# Windows
# Node.js 공식 사이트에서 최신 LTS 버전 다운로드
```

**방법 3: npm 버전 업데이트**
```bash
npm install -g npm@latest
```

---

### 문제: 환경 변수가 인식되지 않음

#### 증상
```typescript
// undefined 반환
console.log(process.env.NEXT_PUBLIC_API_URL);
```

#### 해결 방법

**1. 파일명 확인**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- `.env.example`이 아닌 `.env.local`이어야 함

**2. 변수명 확인**
- 클라이언트에서 사용하려면 `NEXT_PUBLIC_` 접두사 필수
- 서버 사이드에서만 사용하는 변수는 접두사 불필요

**3. 개발 서버 재시작**
```bash
# 서버 종료 (Ctrl + C)
npm run dev
```

**4. 빌드 후 확인**
```bash
npm run build
npm run start
```

---

## 개발 서버 실행 문제

### 문제: 포트 3000이 이미 사용 중

#### 증상
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

#### 해결 방법

**macOS/Linux**
```bash
# 포트 사용 중인 프로세스 확인
lsof -ti:3000

# 프로세스 종료
lsof -ti:3000 | xargs kill -9
```

**Windows**
```bash
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

**다른 포트로 실행**
```bash
PORT=3001 npm run dev
```

---

### 문제: Hot Reload가 작동하지 않음

#### 증상
- 코드 변경 후 자동 새로고침이 안 됨
- 수동으로 새로고침해야 변경사항 반영

#### 해결 방법

**1. 파일 시스템 감시 제한 확인 (macOS/Linux)**
```bash
# 현재 제한 확인
sysctl fs.inotify.max_user_watches

# 제한 증가
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**2. Next.js 설정 확인**

`next.config.ts` 파일에 다음 추가:
```typescript
const nextConfig = {
  // 개발 환경에서 Fast Refresh 활성화
  reactStrictMode: true,
  
  // 파일 감시 옵션
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};
```

**3. 브라우저 캐시 비활성화**
- Chrome 개발자 도구 → Network 탭 → "Disable cache" 체크

---

## 빌드 및 배포 문제

### 문제: 빌드 실패 - 타입 에러

#### 증상
```bash
Type error: Property 'xxx' does not exist on type 'yyy'
```

#### 해결 방법

**1. TypeScript 타입 체크**
```bash
npx tsc --noEmit
```

**2. 타입 정의 확인**
- `src/commons/types/` 폴더에 타입 정의 추가
- Props 타입이 올바르게 정의되었는지 확인

**3. any 타입 임시 사용 (권장하지 않음)**
```typescript
// 임시 해결책
const data: any = ...;
```

---

### 문제: 빌드 후 이미지가 표시되지 않음

#### 증상
- 개발 환경에서는 이미지가 보이지만 프로덕션에서는 안 보임

#### 해결 방법

**1. 이미지 경로 확인**
```typescript
// ❌ 잘못된 방법
<img src="/src/assets/images/logo.png" />

// ✅ 올바른 방법
<img src="/images/logo.png" />
```

**2. Next.js Image 컴포넌트 사용**
```typescript
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="Logo"
  width={100}
  height={100}
/>
```

**3. public 폴더 사용**
- `public/` 폴더에 이미지 배치
- `/` 경로로 접근

---

## TypeScript 관련 문제

### 문제: 절대 경로 import가 작동하지 않음

#### 증상
```typescript
// 에러 발생
import { Button } from '@/commons/components';
```

#### 해결 방법

**1. tsconfig.json 확인**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. IDE 재시작**
- VS Code 재시작
- TypeScript 서버 재시작: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

**3. 캐시 정리**
```bash
rm -rf .next
npm run dev
```

---

### 문제: 타입 추론이 작동하지 않음

#### 증상
- IDE에서 자동완성이 안 됨
- 타입 에러가 표시되지 않음

#### 해결 방법

**1. TypeScript 버전 확인**
```bash
npx tsc --version  # 5.x.x 이상
```

**2. VS Code TypeScript 설정**
- `Cmd/Ctrl + Shift + P`
- "TypeScript: Select TypeScript Version"
- "Use Workspace Version" 선택

**3. 타입 정의 파일 생성**
```typescript
// src/commons/types/index.ts
export * from './auth';
export * from './ui';
```

---

## 스타일링 문제

### 문제: Tailwind CSS 클래스가 적용되지 않음

#### 증상
- Tailwind 클래스를 사용했지만 스타일이 적용되지 않음

#### 해결 방법

**1. tailwind.config.js 확인**
```javascript
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/commons/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
};
```

**2. globals.css 확인**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**3. 개발 서버 재시작**
```bash
npm run dev
```

**4. 빌드 후 확인**
```bash
npm run build
npm run start
```

---

### 문제: CSS 변수가 undefined

#### 증상
```css
/* 작동하지 않음 */
color: var(--color-primary);
```

#### 해결 방법

**1. globals.css 확인**
```css
:root {
  --color-primary: #007AFF;
  /* 다른 CSS 변수들... */
}
```

**2. CSS 모듈에서 사용**
```css
/* styles.module.css */
.button {
  background-color: var(--color-primary);
}
```

**3. TypeScript에서 사용**
```typescript
import { Colors } from '@/commons/styles';

const style = {
  color: Colors.primary,
};
```

---

## API 및 네트워크 문제

### 문제: CORS 에러

#### 증상
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

#### 해결 방법

**1. Next.js API Routes 사용 (권장)**
```typescript
// src/app/api/proxy/route.ts
export async function GET(request: Request) {
  const response = await fetch('http://api.example.com/data');
  const data = await response.json();
  return Response.json(data);
}
```

**2. next.config.ts에 프록시 설정**
```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api.example.com/:path*',
      },
    ];
  },
};
```

**3. 백엔드에서 CORS 허용 (개발 환경)**
- 백엔드 팀에 요청하여 `http://localhost:3000` 허용

---

### 문제: API 요청이 실패함

#### 증상
```
Network Error / Request failed with status code 500
```

#### 해결 방법

**1. 네트워크 탭 확인**
- Chrome 개발자 도구 → Network 탭
- 요청/응답 확인

**2. Axios 인터셉터 로그 추가**
```typescript
// src/commons/provider/api-client.ts
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
```

**3. 환경 변수 확인**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 성능 문제

### 문제: 페이지 로딩이 느림

#### 증상
- 초기 로딩 시간이 3초 이상
- Lighthouse 점수가 낮음

#### 해결 방법

**1. 번들 분석**
```bash
npm run analyze
```

**2. 코드 스플리팅**
```typescript
// Dynamic Import 사용
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

**3. 이미지 최적화**
```typescript
import Image from 'next/image';

<Image 
  src="/images/large.jpg"
  alt="Large Image"
  width={800}
  height={600}
  priority // 중요한 이미지만
/>
```

**4. 폰트 최적화**
```typescript
// src/commons/styles/next-fonts.ts
import localFont from 'next/font/local';

export const pretendard = localFont({
  src: '../../assets/fonts/PretendardVariable.ttf',
  display: 'swap', // 폰트 로딩 전략
  preload: true,
});
```

---

### 문제: React Query 캐시 문제

#### 증상
- 데이터가 업데이트되지 않음
- 오래된 데이터가 표시됨

#### 해결 방법

**1. React Query Devtools 확인**
- 개발 환경에서 자동으로 표시됨
- 캐시 상태 확인

**2. 캐시 무효화**
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// 특정 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['users'] });

// 모든 쿼리 무효화
queryClient.invalidateQueries();
```

**3. staleTime 조정**
```typescript
// src/commons/providers/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10,   // 10분
    },
  },
});
```

---

## 테스트 관련 문제

### 문제: Playwright 테스트 실패

#### 증상
```bash
Error: page.goto: net::ERR_CONNECTION_REFUSED
```

#### 해결 방법

**1. 개발 서버 실행 확인**
```bash
# 터미널 1
npm run dev

# 터미널 2
npx playwright test
```

**2. Playwright 설정 확인**
```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**3. 브라우저 설치**
```bash
npx playwright install
```

---

### 문제: 테스트가 타임아웃됨

#### 증상
```bash
Test timeout of 30000ms exceeded
```

#### 해결 방법

**1. 타임아웃 증가**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // 60초
});
```

**2. 특정 테스트 타임아웃**
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 120초
  // ...
});
```

**3. 대기 조건 최적화**
```typescript
// ❌ 비효율적
await page.waitForTimeout(5000);

// ✅ 효율적
await page.waitForSelector('.loaded');
```

---

## 추가 도움

### 로그 확인

**브라우저 콘솔**
- Chrome 개발자 도구 → Console 탭

**서버 로그**
- 터미널에서 `npm run dev` 실행 중인 창 확인

**빌드 로그**
```bash
npm run build 2>&1 | tee build.log
```

### 디버깅 도구

**React Developer Tools**
- Chrome 확장 프로그램 설치
- 컴포넌트 트리 및 Props 확인

**React Query Devtools**
- 개발 환경에서 자동 표시
- 쿼리 상태 및 캐시 확인

**Network 탭**
- API 요청/응답 확인
- 성능 분석

---

## 문제가 해결되지 않는 경우

1. **GitHub Issues 검색**: 비슷한 문제가 있는지 확인
2. **팀 채널 문의**: 다른 팀원에게 도움 요청
3. **공식 문서 참고**:
   - [Next.js 공식 문서](https://nextjs.org/docs)
   - [React Query 공식 문서](https://tanstack.com/query/latest)
   - [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

---

**마지막 업데이트**: 2026-01-25
