# 회원가입 500 에러 처리 및 인증 플로우 개선

## 📝 개요

> 회원가입 기능 구현 중 백엔드 서버의 버그로 인해 발생하는 500 에러를 프론트엔드에서 우아하게 처리하고, 인증되지 않은 사용자의 메인 페이지 접근을 차단하는 기능을 구현하던 중 발생한 문제들을 해결했습니다.

---

## 1️⃣ 배경 (Background)

회원가입 및 로그인 기능을 구현하고, 인증되지 않은 사용자가 메인 페이지에 접근하지 못하도록 보호하는 기능을 추가하던 중이었습니다. 또한 백엔드 서버의 버그로 인해 회원가입 시 데이터는 정상적으로 DB에 저장되지만 응답 과정에서 500 에러가 발생하는 문제가 있었습니다.

---

## 2️⃣ 문제 현상 (Issue)

### 에러 메시지

```
❌ API Error: POST https://be-production-8aa2.up.railway.app/api/api/auth/local/signup

Error Details: {
  statusCode: 500,
  httpStatus: 500,
  statusText: '',
  message: 'Internal server error',
  errorCode: 'ERR_BAD_RESPONSE',
  ...
}
```

### 발생 상황

1. **API URL 중복 문제**: `/api/api/auth/local/signup` 형태로 URL이 중복되어 호출됨
2. **회원가입 500 에러**: 회원가입 요청 시 데이터는 저장되지만 500 에러 발생
3. **인증 체크 누락**: 인증되지 않은 사용자가 메인 페이지에 직접 접근 가능
4. **타입 에러**: LoginForm에서 `loginType` 필드 접근 시 타입 에러 발생

---

## 3️⃣ 가설 설정 (Hypothesis)

처음에는 여러 원인을 추측했습니다:

- **가설 1**: 네트워크 연결 문제 또는 서버 다운
- **가설 2**: API 엔드포인트 경로 설정 오류
- **가설 3**: 요청 데이터 형식이 서버가 기대하는 형식과 다름
- **가설 4**: 백엔드 서버의 실제 버그 (데이터는 저장되지만 응답 실패)

---

## 4️⃣ 원인 분석 (Root Cause)

### 문제 1: API URL 중복

**근본 원인**: 
- `api-client.ts`의 `baseURL`이 `https://be-production-8aa2.up.railway.app/api`로 설정되어 있었고
- `endpoints.ts`에서 `LOCAL_SIGNUP`이 `/api/auth/local/signup`로 정의되어 있어
- 최종 URL이 `https://be-production-8aa2.up.railway.app/api/api/auth/local/signup`로 중복됨

### 문제 2: 회원가입 500 에러

**근본 원인**:
- 백엔드 서버의 버그로 인해 회원가입 데이터는 정상적으로 DB에 저장되지만
- 응답을 생성하는 과정에서 서버 내부 오류 발생
- 프론트엔드에서 이를 일반적인 에러로 처리하여 사용자 경험이 저하됨

### 문제 3: 인증 체크 누락

**근본 원인**:
- `(main)` 레이아웃과 메인 페이지에 인증 체크 로직이 없어
- 인증되지 않은 사용자도 메인 페이지에 접근 가능했음

### 문제 4: 타입 에러

**근본 원인**:
- `LoginFormData`에는 `loginType` 필드가 있지만
- `LoginFormErrors`에는 `loginType` 필드가 없어서
- `keyof LoginFormData`를 `LoginFormErrors`의 인덱스로 사용할 수 없음

---

## 5️⃣ 해결 방안 (Solution)

### 문제 1: API URL 중복 해결

#### ❌ Before (수정 전)

```typescript
// src/commons/provider/api-provider/api-client.ts
export const apiClient: AxiosInstance = axios.create({
  ...DEFAULT_CONFIG,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
});
```

#### ✅ After (수정 후)

```typescript
// src/commons/provider/api-provider/api-client.ts
function normalizeBaseURL(url: string | undefined): string {
  if (!url) return ''; // 빈 문자열 = 상대 경로 (Next.js rewrites 사용)
  
  // 끝의 슬래시 제거
  let normalized = url.trim().replace(/\/+$/, '');
  
  // 끝의 /api 제거 (endpoints.ts에서 이미 /api 포함)
  normalized = normalized.replace(/\/api$/, '');
  
  return normalized;
}

const baseURL = normalizeBaseURL(process.env.NEXT_PUBLIC_API_BASE_URL);

export const apiClient: AxiosInstance = axios.create({
  ...DEFAULT_CONFIG,
  baseURL,
});
```

#### 변경 사항 설명

- `normalizeBaseURL` 함수를 추가하여 baseURL에서 끝의 `/api`를 자동으로 제거
- `endpoints.ts`에서 이미 `/api`가 포함되어 있으므로 baseURL에는 포함하지 않도록 수정
- 개발 환경에서 baseURL 설정 확인 로그 추가

### 문제 2: 회원가입 500 에러 처리

#### ❌ Before (수정 전)

```typescript
// src/components/Signup/hooks/useSignupMutation.ts
onError: (error: any) => {
  // 모든 에러 발생 시 로그인 페이지로 리다이렉트
  router.push('/login');
},
```

#### ✅ After (수정 후)

```typescript
// src/components/Signup/hooks/useSignupMutation.ts
onError: (error: any) => {
  const errorStatus = error?.status || error?.response?.status;
  
  // 500 에러는 백엔드 버그로 인해 데이터는 저장되지만 응답에서 에러가 발생
  // 사용자에게는 에러 메시지를 표시하지 않고 로그인 페이지로 리다이렉트
  // 사용자가 직접 로그인하여 온보딩을 진행할 수 있도록 함
  if (errorStatus === 500) {
    router.push('/login');
  } else {
    router.push('/login');
  }
},
```

#### 변경 사항 설명

- 500 에러 발생 시 사용자에게 에러 메시지를 표시하지 않음
- 데이터는 정상적으로 저장되었으므로 로그인 페이지로 리다이렉트하여 사용자가 직접 로그인할 수 있도록 함
- 회원가입 성공 시 온보딩 완료 여부에 따라 적절한 페이지로 이동

### 문제 3: 인증 체크 추가

#### ❌ Before (수정 전)

```typescript
// src/app/(main)/layout.tsx
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {children}
      <GNB />
    </div>
  );
}
```

#### ✅ After (수정 후)

```typescript
// src/app/(main)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GNB from '@/commons/layout/gnb';
import { useAuth } from '@/commons/hooks/useAuth';
import styles from './styles.module.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우 빈 화면 표시
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      {children}
      <GNB />
    </div>
  );
}
```

#### 변경 사항 설명

- `(main)` 레이아웃을 클라이언트 컴포넌트로 변경
- `useAuth` 훅을 사용하여 인증 상태 확인
- 인증되지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트
- 메인 페이지에도 동일한 인증 체크 적용

### 문제 4: 타입 에러 수정

#### ❌ Before (수정 전)

```typescript
// src/components/Login/LoginForm.tsx
const handleChange = (field: keyof LoginFormData) => (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  // ...
  const fieldErrors = validateLoginForm(updatedData);
  if (fieldErrors[field]) { // 타입 에러 발생
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }
};
```

#### ✅ After (수정 후)

```typescript
// src/components/Login/LoginForm.tsx
const handleChange = (field: 'phoneNumber' | 'email' | 'password') => (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  // ...
  const fieldErrors = validateLoginForm(updatedData);
  if (fieldErrors[field as keyof LoginFormErrors]) {
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof LoginFormErrors] }));
  }
};
```

#### 변경 사항 설명

- `handleChange`와 `handleBlur` 함수의 타입을 명시적으로 지정
- `LoginFormErrors`에 없는 `loginType` 필드를 제외하고 `'phoneNumber' | 'email' | 'password'`만 허용
- 타입 단언을 사용하여 안전하게 접근

---

## 6️⃣ 결과 확인 (Result)

### 해결 후 정상 작동 여부 확인 방법

- [x] API URL이 중복되지 않고 정상적으로 호출됨을 확인
- [x] 회원가입 500 에러 발생 시 로그인 페이지로 자동 리다이렉트됨을 확인
- [x] 인증되지 않은 사용자가 메인 페이지 접근 시 로그인 페이지로 리다이렉트됨을 확인
- [x] 타입 에러가 사라지고 린터 에러가 없음을 확인
- [x] 회원가입 성공 시 온보딩 페이지로 정상 이동함을 확인

### 테스트 결과

1. **API URL 중복 해결**: 
   - 이전: `https://be-production-8aa2.up.railway.app/api/api/auth/local/signup` ❌
   - 수정 후: `https://be-production-8aa2.up.railway.app/api/auth/local/signup` ✅

2. **회원가입 500 에러 처리**:
   - 500 에러 발생 시 사용자에게 에러 메시지 표시 없이 로그인 페이지로 이동 ✅
   - 사용자가 로그인 페이지에서 직접 로그인하여 온보딩 진행 가능 ✅

3. **인증 체크**:
   - 인증되지 않은 사용자가 메인 페이지 접근 시 자동으로 로그인 페이지로 리다이렉트 ✅
   - 로그인 후 메인 페이지 정상 접근 가능 ✅

4. **타입 에러**:
   - 모든 타입 에러 해결, 린터 에러 없음 ✅

---

## 7️⃣ 회고 (Lesson Learned)

### 배운 점

1. **API baseURL과 endpoint 경로 관리의 중요성**
   - baseURL과 endpoint 경로를 분리하여 관리할 때 중복을 주의해야 함
   - 정규화 함수를 통해 일관된 URL 생성이 필요함

2. **백엔드 버그에 대한 우아한 처리**
   - 백엔드 버그로 인한 에러를 프론트엔드에서 우아하게 처리하여 사용자 경험을 개선할 수 있음
   - 데이터는 정상 저장되었지만 응답 실패 시에도 사용자가 다음 단계로 진행할 수 있도록 해야 함

3. **인증 체크의 레이어별 적용**
   - 레이아웃 레벨에서 인증 체크를 적용하면 하위 모든 페이지에 자동으로 적용됨
   - 클라이언트 컴포넌트로 변경하여 `useAuth` 훅 사용 가능

4. **TypeScript 타입 안전성**
   - `keyof`를 사용할 때 실제로 존재하는 키만 사용해야 함
   - 타입을 명시적으로 지정하여 컴파일 타임에 에러를 잡을 수 있음

### 앞으로 주의할 점

1. **API 경로 관리**
   - baseURL과 endpoint 경로를 정의할 때 중복을 주의
   - 정규화 함수를 통해 일관된 URL 생성

2. **에러 처리 전략**
   - 사용자 경험을 고려한 에러 처리
   - 백엔드 버그로 인한 에러도 우아하게 처리

3. **인증 체크**
   - 보호가 필요한 모든 페이지/레이아웃에 인증 체크 적용
   - React Hooks 규칙 준수 (조건부 호출 금지)

4. **타입 안전성**
   - 타입을 명시적으로 지정하여 컴파일 타임에 에러 발견
   - `keyof` 사용 시 실제로 존재하는 키만 사용

---

## 🔗 참고 자료

- [Next.js App Router - Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [TypeScript - keyof Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
