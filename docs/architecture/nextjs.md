# Next.js에서 꼭 알아야 하는 것들

## 📋 개요

이 문서는 TimeEgg 웹 프론트엔드 프로젝트에서 Next.js를 사용할 때 반드시 알아야 하는 핵심 규칙과 원칙을 정리한 가이드입니다.

---

## 🏗 App Router 핵심 원칙

### 1. 서버 컴포넌트 우선 원칙

**기본은 서버 컴포넌트, 필요할 때만 클라이언트 컴포넌트**

```tsx
// ✅ 좋은 예: 서버 컴포넌트 (기본)
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await fetch(`/api/users/${userId}`).then(res => res.json());
  
  return (
    <div>
      <h1>{user.name}</h1>
      <UserInteractions user={user} /> {/* 클라이언트 컴포넌트 */}
    </div>
  );
}

// ✅ 좋은 예: 상호작용이 필요한 부분만 클라이언트 컴포넌트
'use client';

export function UserInteractions({ user }: { user: User }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} 좋아요
    </button>
  );
}
```

```tsx
// ❌ 나쁜 예: 불필요한 클라이언트 컴포넌트
'use client';

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  if (!user) return <div>로딩 중...</div>;
  
  return <div>{user.name}</div>; // 서버에서 렌더링할 수 있는 내용
}
```

### 2. 데이터 패칭 전략

**서버에서 초기 데이터, 클라이언트에서 상호작용 데이터**

```tsx
// ✅ 서버 컴포넌트: 초기 데이터 로딩
export default async function PostList() {
  // 서버에서 초기 포스트 로딩
  const initialPosts = await fetch('/api/posts').then(res => res.json());
  
  return (
    <div>
      <PostGrid initialData={initialPosts} />
      <LoadMoreButton /> {/* 클라이언트에서 추가 로딩 */}
    </div>
  );
}

// ✅ 클라이언트 컴포넌트: 추가 데이터 로딩
'use client';

export function PostGrid({ initialData }: { initialData: Post[] }) {
  const { data: posts, fetchNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialData: { pages: [initialData], pageParams: [0] },
  });
  
  return (
    <div>
      {posts.pages.map(page => 
        page.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
```

### 3. 레이아웃 시스템 활용

**중첩 레이아웃으로 공통 UI 재사용**

```tsx
// app/layout.tsx - 전역 레이아웃
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

// app/(auth)/layout.tsx - 인증 페이지 레이아웃
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <AuthHeader />
        {children}
      </div>
    </div>
  );
}
```

---

## 🚀 성능 최적화 규칙

### 1. 이미지 최적화

**next/image를 반드시 사용**

```tsx
import Image from 'next/image';

// ✅ 좋은 예: next/image 사용
export function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // 중요한 이미지만 priority={true}
    />
  );
}

// ❌ 나쁜 예: 일반 img 태그 사용
export function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-10 h-10 rounded-full" />;
}
```

### 2. 폰트 최적화

**next/font로 폰트 최적화**

```tsx
// app/layout.tsx
import { Pretendard } from '@/commons/styles/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={Pretendard.className}>
      <body>{children}</body>
    </html>
  );
}

// commons/styles/fonts.ts
import localFont from 'next/font/local';

export const Pretendard = localFont({
  src: [
    {
      path: '../assets/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
});
```

### 3. 동적 임포트 활용

**무거운 컴포넌트는 동적 로딩**

```tsx
import dynamic from 'next/dynamic';

// ✅ 좋은 예: 무거운 컴포넌트 동적 로딩
const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false, // 클라이언트에서만 렌더링
  loading: () => <MapSkeleton />,
});

export function MapPage() {
  return (
    <div>
      <h1>지도</h1>
      <MapComponent />
    </div>
  );
}
```

---

## 🔄 캐싱 및 재검증 전략

### 1. fetch 캐싱 활용

**서버 컴포넌트에서 fetch 캐싱 사용**

```tsx
// ✅ 정적 데이터: 캐싱 활용
async function getStaticData() {
  const res = await fetch('/api/static-data', {
    cache: 'force-cache', // 기본값: 무한 캐시
  });
  return res.json();
}

// ✅ 동적 데이터: 재검증 주기 설정
async function getDynamicData() {
  const res = await fetch('/api/dynamic-data', {
    next: { revalidate: 60 }, // 60초마다 재검증
  });
  return res.json();
}

// ✅ 실시간 데이터: 캐싱 비활성화
async function getRealtimeData() {
  const res = await fetch('/api/realtime-data', {
    cache: 'no-store', // 캐싱하지 않음
  });
  return res.json();
}
```

### 2. 페이지 수준 재검증

**revalidatePath, revalidateTag 활용**

```tsx
// app/actions.ts (Server Actions)
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  // 포스트 생성 로직
  await createPostInDB(formData);
  
  // 관련 페이지 재검증
  revalidatePath('/posts');
  revalidateTag('posts');
}

// 태그 기반 캐싱
async function getPosts() {
  const res = await fetch('/api/posts', {
    next: { tags: ['posts'] },
  });
  return res.json();
}
```

---

## 🛡 에러 처리 및 로딩

### 1. 에러 바운더리

**error.tsx로 에러 처리**

```tsx
// app/error.tsx - 전역 에러 처리
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">문제가 발생했습니다</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary-500 text-white rounded"
      >
        다시 시도
      </button>
    </div>
  );
}

// app/posts/error.tsx - 특정 경로 에러 처리
'use client';

export default function PostsError({ error, reset }: ErrorProps) {
  return (
    <div className="p-4 text-center">
      <h2>포스트를 불러올 수 없습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 2. 로딩 상태

**loading.tsx로 로딩 처리**

```tsx
// app/loading.tsx - 전역 로딩
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  );
}

// app/posts/loading.tsx - 특정 경로 로딩
export default function PostsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 인증 및 권한 관리

### 1. 미들웨어 활용

**middleware.ts로 인증 가드**

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // 보호된 경로 확인
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

### 2. 서버 액션 활용

**Server Actions로 서버 사이드 로직**

```tsx
// app/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const { token } = await response.json();
      cookies().set('auth-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      redirect('/dashboard');
    }
  } catch (error) {
    throw new Error('로그인에 실패했습니다');
  }
}

// 컴포넌트에서 사용
export function LoginForm() {
  return (
    <form action={login}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">로그인</button>
    </form>
  );
}
```

---

## 🎨 스타일링 및 CSS

### 1. Tailwind CSS 활용 (필요시)

**CSS 변수와 Tailwind 조합**

```css
/* globals.css */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
}

.dark {
  --color-primary-50: #1e3a8a;
  --color-primary-500: #3b82f6;
  --color-primary-900: #eff6ff;
}
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          900: 'var(--color-primary-900)',
        },
      },
    },
  },
};
```

### 2. CSS Modules (필수)

**컴포넌트별 스타일 격리**

```css
/* Button.module.css */
.button {
  @apply px-4 py-2 rounded font-medium transition-colors;
}

.primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}

.secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant])}>
      {children}
    </button>
  );
}
```

---

## 📱 반응형 및 접근성

### 1. 반응형 디자인

**모바일 퍼스트 접근법**

```tsx
// ✅ 좋은 예: 모바일 퍼스트
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
    </div>
  );
}

// ✅ 좋은 예: 반응형 텍스트
export function ResponsiveText() {
  return (
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
      반응형 제목
    </h1>
  );
}
```

### 2. 접근성 고려사항

**시맨틱 HTML 및 ARIA 속성**

```tsx
// ✅ 좋은 예: 접근성을 고려한 컴포넌트
export function AccessibleModal({ isOpen, onClose, children }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={clsx(
        'fixed inset-0 z-50',
        isOpen ? 'block' : 'hidden'
      )}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
        <button
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute top-4 right-4"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
```

---

## 🔧 개발 도구 및 디버깅

### 1. React DevTools 활용

**컴포넌트 성능 분석**

```tsx
// 성능 측정이 필요한 컴포넌트
import { Profiler } from 'react';

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

export function ProfiledComponent({ children }: { children: React.ReactNode }) {
  return (
    <Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}
```

### 2. Next.js 개발 도구

**빌드 분석 및 성능 측정**

```bash
# 번들 분석
npm run analyze

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 성능 측정 (Lighthouse)
npm run lighthouse
```

---

## 📊 성능 모니터링

### 1. Core Web Vitals 측정

**실제 사용자 성능 데이터 수집**

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2. 커스텀 성능 측정

**비즈니스 메트릭 측정**

```tsx
// commons/utils/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name}: ${end - start}ms`);
  
  // 분석 도구로 전송
  if (typeof window !== 'undefined') {
    window.gtag?.('event', 'timing_complete', {
      name,
      value: Math.round(end - start),
    });
  }
}
```

---

## 🚨 주의사항 및 안티패턴

### 1. 피해야 할 패턴

```tsx
// ❌ 서버 컴포넌트에서 클라이언트 API 사용
export default function BadServerComponent() {
  const [data, setData] = useState(null); // 에러!
  
  useEffect(() => { // 에러!
    fetch('/api/data').then(setData);
  }, []);
  
  return <div>{data}</div>;
}

// ❌ 클라이언트 컴포넌트에서 서버 전용 API 사용
'use client';
export default function BadClientComponent() {
  const data = await fetch('/api/data'); // 에러!
  return <div>{data}</div>;
}

// ❌ 불필요한 'use client' 사용
'use client'; // 불필요!
export default function StaticComponent() {
  return <div>정적 컨텐츠</div>;
}
```

### 2. 일반적인 실수

```tsx
// ❌ 이미지 최적화 무시
<img src="/large-image.jpg" alt="큰 이미지" /> // 성능 문제

// ✅ 올바른 이미지 사용
<Image
  src="/large-image.jpg"
  alt="큰 이미지"
  width={800}
  height={600}
  priority={false}
/>

// ❌ 폰트 최적화 무시
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

// ✅ 올바른 폰트 사용
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

---

## 📚 추가 학습 자료

### 1. 공식 문서
- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [React Server Components 설명](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

### 2. 성능 최적화
- [Next.js 성능 최적화 가이드](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Core Web Vitals 측정](https://web.dev/vitals/)

### 3. 접근성
- [Next.js 접근성 가이드](https://nextjs.org/docs/app/building-your-application/accessibility)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎯 체크리스트

개발 시 다음 사항들을 확인하세요:

### 기본 설정
- [ ] 서버 컴포넌트를 기본으로 사용하고 있는가?
- [ ] 'use client'를 필요한 곳에만 사용하고 있는가?
- [ ] 이미지는 next/image를 사용하고 있는가?
- [ ] 폰트는 next/font로 최적화되어 있는가?

### 성능
- [ ] 무거운 컴포넌트는 동적 임포트를 사용하고 있는가?
- [ ] 적절한 캐싱 전략을 사용하고 있는가?
- [ ] Bundle Analyzer로 번들 사이즈를 확인했는가?
- [ ] Core Web Vitals 지표가 양호한가?

### 접근성
- [ ] 시맨틱 HTML을 사용하고 있는가?
- [ ] 적절한 ARIA 속성을 사용하고 있는가?
- [ ] 키보드 네비게이션이 가능한가?
- [ ] 색상 대비가 충분한가?

### 에러 처리
- [ ] 적절한 에러 바운더리가 설정되어 있는가?
- [ ] 로딩 상태가 적절히 처리되고 있는가?
- [ ] 사용자 친화적인 에러 메시지를 제공하는가?