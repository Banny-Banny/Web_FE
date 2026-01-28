# TimeEgg 카카오 소셜 로그인 기능 기술 구현 계획

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 카카오 소셜 로그인 기능을 구현하기 위한 기술적 계획을 담고 있습니다. 명세서(`spec.md`)의 요구사항을 바탕으로 구체적인 구현 방안을 제시합니다.

---

## 🛠 기술 스택

### Frontend Framework
- **Next.js 16** (App Router)
  - TypeScript 사용
  - React Server Components 활용
  - 클라이언트/서버 컴포넌트 분리

### 스타일링
- **CSS Module** + **Tailwind CSS**
  - 디자인 토큰 기반 스타일링
  - **모바일 전용 설계**: 375px 고정 너비 (최대 480px)
  - 컴포넌트별 스타일 분리

### 상태 관리
- **React Query** (서버 상태)
  - 카카오 로그인 API 호출 및 캐싱
  - 로딩/에러 상태 관리
- **React Context API** (클라이언트 상태)
  - 인증 상태 전역 관리
  - 사용자 정보 관리

### API 통신
- **Axios**
  - 기존 `apiClient` 활용
  - 인터셉터를 통한 토큰 관리
  - 타입 안전한 API 클라이언트

### 외부 SDK
- **카카오 JavaScript SDK**
  - 카카오 계정 인증
  - 동적 스크립트 로딩
  - 팝업 기반 인증 플로우

---

## 🏛 아키텍처 설계

### Feature Slice Architecture 적용

카카오 소셜 로그인 기능은 기존 자체 로그인과 통합되어 `components/Login/` 디렉토리에 배치됩니다.

```
src/
├── app/                          # [Routing Layer]
│   └── (auth)/                   # 인증 관련 라우트 그룹
│       └── login/                # 로그인 페이지 (기존)
│           └── page.tsx          # 페이지 컴포넌트
├── components/                   # [Feature Layer]
│   └── Login/                    # 로그인 기능 컴포넌트
│       ├── index.tsx            # 컨테이너 컴포넌트 (수정)
│       ├── LoginMethodSelector/ # 로그인 방법 선택 (기존)
│       ├── hooks/                # 로그인 관련 훅
│       │   ├── useLoginMutation.ts (기존 - 참고용)
│       │   └── useKakaoLoginMutation.ts (신규)
│       └── styles.module.css    # 스타일
└── commons/                      # [Shared Layer]
    ├── apis/                     # API 함수
    │   └── auth/                 # 인증 API
    │       ├── login.ts          # 자체 로그인 API (기존)
    │       ├── types.ts          # API 타입 (확장)
    │       └── kakao-login.ts    # 카카오 로그인 API (신규)
    └── utils/                     # 유틸리티 함수
        ├── auth.ts               # 토큰 저장 함수 (기존)
        └── kakao-auth/           # 카카오 인증 유틸리티 (신규)
            ├── config.ts         # 환경 변수 설정
            ├── script-loader.ts  # SDK 스크립트 로더
            └── kakao-login.ts    # 카카오 로그인 플로우
```

---

## 📊 데이터 모델링

### API 요청/응답 타입

#### 카카오 로그인 요청 타입
```typescript
interface KakaoLoginRequest {
  code: string;  // 카카오 인증 코드
}
```

**제약사항**:
- `code`는 카카오 인증 후 받은 인증 코드 (필수)
- 일회용 코드로 재사용 불가

#### 카카오 로그인 응답 타입
```typescript
interface KakaoLoginResponse {
  accessToken: string;    // JWT 액세스 토큰
  refreshToken?: string;  // 리프레시 토큰 (선택)
  user?: User;            // 사용자 정보 (선택)
}
```

**응답 구조**:
- 자체 로그인과 동일한 형식의 토큰 사용
- 사용자 정보는 선택적으로 포함

#### API 에러 응답 타입
```typescript
interface LoginErrorResponse {
  message: string;         // 오류 메시지
  status: number;          // HTTP 상태 코드
  code?: string;           // 오류 코드 (선택)
}
```

**HTTP 상태 코드 매핑**:
- `200`: 로그인 성공
- `400`: 잘못된 인증 코드
- `401`: 인증 실패
- `500`: 서버 오류

### 카카오 SDK 타입 정의

```typescript
declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: { code: string }) => void;
          fail: (err: any) => void;
        }) => void;
      };
    };
  }
}
```

---

## 🔌 API 설계

### 엔드포인트

**POST** `/api/auth/kakao`

**요청 본문**:
```json
{
  "code": "카카오_인증_코드"
}
```

**성공 응답** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "nickname": "타임캡슐러",
    "profileImage": "https://..."
  }
}
```

**에러 응답** (400):
```json
{
  "message": "유효하지 않은 인증 코드입니다.",
  "status": 400
}
```

**에러 응답** (401):
```json
{
  "message": "카카오 인증에 실패했습니다.",
  "status": 401
}
```

### API 함수 구현 위치

- **파일**: `src/commons/apis/auth/kakao-login.ts`
- **함수명**: `kakaoLogin(request: KakaoLoginRequest): Promise<KakaoLoginResponse>`
- **에러 처리**: Axios 인터셉터를 통한 표준화된 에러 처리
- **엔드포인트**: `EXTERNAL_ENDPOINTS.KAKAO_LOGIN` 사용

---

## 🧩 컴포넌트 설계

### 컴포넌트 계층 구조

```
LoginPage (app/(auth)/login/page.tsx)
  └── LoginContainer (components/Login/index.tsx)
      ├── LoginMethodSelector (기존)
      │   └── "카카오로 시작하기" 버튼
      └── LoginForm (기존 - 이메일 로그인)
```

### 컴포넌트 상세 설계

#### 1. LoginContainer (`components/Login/index.tsx`)
- **역할**: 로그인 방법 선택 및 카카오 로그인 처리
- **타입**: Client Component
- **변경 사항**:
  - `handleSelectKakao` 함수 구현
  - `useKakaoLoginMutation` 훅 연결
  - 로딩 상태 및 에러 처리

#### 2. LoginMethodSelector (`components/Login/LoginMethodSelector/index.tsx`)
- **역할**: 로그인 방법 선택 UI (기존)
- **변경 사항**: 없음 (이미 구현됨)

---

## 🔄 상태 관리 전략

### 서버 상태 (React Query)

#### useKakaoLoginMutation 훅
```typescript
function useKakaoLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (code: string) => kakaoLogin({ code }),
    onSuccess: (data) => {
      // 토큰 저장
      if (data.accessToken) {
        saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || '',
        });
      }
      
      // 사용자 정보 캐시 업데이트
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }
      
      // 온보딩 상태 확인
      const onboardingStatus = queryClient.getQueryData<{ completed: boolean }>(['onboarding', 'status']);
      const isOnboardingCompleted = onboardingStatus?.completed === true;
      
      // 리다이렉트
      if (!isOnboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      // 에러 처리 (사용자 취소는 조용히 처리)
      console.error('카카오 로그인 실패:', error);
    },
  });
}
```

### 클라이언트 상태 (React State)

#### 카카오 로그인 플로우 상태
```typescript
interface KakaoLoginState {
  isInitializing: boolean;  // SDK 초기화 중
  isAuthenticating: boolean; // 카카오 인증 중
  error: string | null;     // 에러 메시지
}
```

---

## 🎨 UI/UX 설계

### 레이아웃

- **375px 고정 너비**: MobileFrame 컴포넌트 활용
- **중앙 정렬**: 기존 레이아웃 시스템 활용
- **Figma 디자인 준수**: 제공된 디자인과 일치하는 레이아웃

### 카카오 로그인 버튼

- **디자인 토큰 사용**: CSS 변수를 통한 색상, 간격, 타이포그래피
- **카카오 브랜드 가이드 준수**: 카카오 로그인 버튼 디자인 가이드라인 준수
- **터치 타겟**: 최소 44px × 44px
- **로딩 상태**: 버튼 내부 스피너 또는 비활성화

### 오류 메시지 표시

- **일반 오류**: 폼 상단에 표시 (서버 오류 등)
- **사용자 취소**: 오류 메시지 표시 안 함 (조용히 처리)
- **접근성**: `role="alert"`, `aria-live` 속성

---

## 🔐 보안 고려사항

### 카카오 JavaScript 키

- **클라이언트 노출**: 카카오 JavaScript 키는 클라이언트에 노출됨 (정상)
- **환경 변수**: `NEXT_PUBLIC_KAKAO_JS_KEY`에 저장
- **실제 인증**: 백엔드에서 카카오 액세스 토큰으로 사용자 정보 조회 후 JWT 발급

### 인증 코드

- **일회용**: 카카오 인증 코드는 일회용으로 사용
- **재사용 불가**: 한 번 사용된 코드는 재사용 불가
- **백엔드 교환**: 백엔드에서 카카오 액세스 토큰으로 교환

### 토큰 저장

- **로컬 스토리지**: 기존 시스템 활용 (`timeEgg_accessToken`, `timeEgg_refreshToken`)
- **XSS 방지**: 입력 값 sanitization (기본적으로 React가 처리)

### 통신 보안

- **HTTPS**: 프로덕션 환경에서 필수
- **토큰 전송**: Authorization 헤더를 통한 Bearer 토큰 전송

### 오류 메시지

- **보안**: 구체적인 오류 정보 노출 최소화
- **사용자 친화적**: 일반적인 오류 메시지 제공

---

## 🧪 테스트 전략

### E2E 테스트 (Playwright)

#### 주요 시나리오
1. **카카오 로그인 성공 (신규 사용자)**
   - "카카오로 시작하기" 버튼 클릭
   - 카카오 로그인 팝업에서 로그인
   - 온보딩 페이지로 리다이렉트 확인

2. **카카오 로그인 성공 (기존 사용자)**
   - "카카오로 시작하기" 버튼 클릭
   - 카카오 로그인 팝업에서 로그인
   - 홈 페이지로 리다이렉트 확인

3. **카카오 로그인 취소**
   - "카카오로 시작하기" 버튼 클릭
   - 카카오 로그인 팝업에서 취소
   - 로그인 페이지에 그대로 남아있음 확인
   - 오류 메시지가 표시되지 않음 확인

4. **카카오 로그인 실패**
   - 잘못된 인증 코드로 시도
   - 오류 메시지 표시 확인

### UI 테스트 (Playwright)

#### 컴포넌트 테스트
1. **렌더링 테스트**
   - 카카오 로그인 버튼이 표시되는지 확인
   - 버튼 디자인이 Figma와 일치하는지 확인

2. **상호작용 테스트**
   - 버튼 클릭 시 카카오 로그인 팝업이 열리는지 확인
   - 로딩 상태 표시 확인

3. **시각적 검증**
   - Figma 디자인과 일치하는지 확인
   - 오류 상태 시각적 피드백 확인

---

## 📝 개발 워크플로우

### Step 1: 카카오 JavaScript SDK 설정

**목적**: 카카오 JavaScript SDK를 동적으로 로드하고 초기화

**작업**:
1. `src/commons/utils/kakao-auth/config.ts` 파일 생성
   - 환경 변수 `NEXT_PUBLIC_KAKAO_JS_KEY` 읽기 함수 구현
   - 에러 처리 및 경고 메시지

2. `src/commons/utils/kakao-auth/script-loader.ts` 파일 생성
   - 카카오 지도 스크립트 로더(`src/commons/utils/kakao-map/script-loader.ts`) 참고
   - `https://developers.kakao.com/sdk/js/kakao.js` 스크립트 동적 로드
   - `Kakao.init()` 호출하여 SDK 초기화
   - Promise 기반 비동기 처리
   - 중복 로딩 방지

**결과물**: 카카오 JavaScript SDK를 동적으로 로드하고 초기화하는 유틸리티

### Step 2: 카카오 로그인 타입 정의

**목적**: 카카오 로그인 API 타입 정의

**작업**:
1. `src/commons/apis/auth/types.ts` 파일 확장
   - `KakaoLoginRequest` 인터페이스 추가
   - `KakaoLoginResponse` 인터페이스 추가

**결과물**: 타입 안전한 카카오 로그인 API 인터페이스

### Step 3: 카카오 로그인 API 함수 구현

**목적**: 백엔드와의 통신 인터페이스 확립

**작업**:
1. `src/commons/apis/auth/kakao-login.ts` 파일 생성
2. `kakaoLogin` API 함수 구현
   - `apiClient.post()` 사용하여 백엔드 API 호출
   - `EXTERNAL_ENDPOINTS.KAKAO_LOGIN` 엔드포인트 사용
   - 에러 처리 (자체 로그인과 동일한 패턴)
   - Axios 에러를 `ApiError` 형식으로 변환

**결과물**: 완전히 작동하는 카카오 로그인 API 통신 레이어

### Step 4: 카카오 로그인 플로우 함수 구현

**목적**: 카카오 인증 플로우 실행

**작업**:
1. `src/commons/utils/kakao-auth/kakao-login.ts` 파일 생성
2. `executeKakaoLogin` 함수 구현
   - 카카오 SDK 초기화 확인 (`Kakao.isInitialized()`)
   - SDK 미초기화 시 스크립트 로더 호출
   - `Kakao.Auth.login()` 호출하여 로그인 팝업 열기
   - 인증 코드 받기
   - 사용자 취소 감지 및 조용히 처리
   - 에러 처리 (네트워크 오류 등)

**결과물**: 카카오 인증 플로우를 실행하는 유틸리티 함수

### Step 5: 카카오 로그인 Mutation 훅 구현

**목적**: React Query를 통한 카카오 로그인 상태 관리

**작업**:
1. `src/components/Login/hooks/useKakaoLoginMutation.ts` 파일 생성
2. `useKakaoLoginMutation` 훅 구현
   - `useMutation` 사용 (기존 `useLoginMutation` 참고)
   - `executeKakaoLogin` 호출하여 카카오 인증 실행
   - 성공 시 `kakaoLogin` API 호출
   - 토큰 저장 및 사용자 정보 업데이트
   - 온보딩 완료 여부 확인 후 리다이렉트
   - 에러 처리

**결과물**: 카카오 로그인을 위한 React Query 훅

### Step 6: LoginContainer에 카카오 로그인 연결

**목적**: UI와 카카오 로그인 플로우 연결

**작업**:
1. `src/components/Login/index.tsx` 파일 수정
2. `handleSelectKakao` 함수 구현
   - `useKakaoLoginMutation` 훅 사용
   - `executeKakaoLogin` 호출
   - 로딩 상태 관리
   - 에러 처리 및 사용자 피드백

**결과물**: 카카오 로그인이 연결된 로그인 컨테이너

### Step 7: 환경 변수 설정

**목적**: 카카오 JavaScript 키 설정

**작업**:
1. `.env.local` 파일에 환경 변수 추가
   ```env
   NEXT_PUBLIC_KAKAO_JS_KEY=76464dc0c450e1a52df586f4bba35579
   ```
2. 환경 변수 설정 가이드 문서화

**결과물**: 환경 변수 설정 완료

### Step 8: E2E 테스트 작성 (Playwright)

**목적**: 전체 사용자 플로우 검증

**작업**:
1. 카카오 로그인 성공 시나리오 테스트 작성
2. 카카오 로그인 취소 시나리오 테스트 작성
3. 카카오 로그인 실패 시나리오 테스트 작성

**결과물**: 자동화된 E2E 테스트 스위트

### Step 9: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 🔧 구현 세부사항

### 카카오 SDK 스크립트 로더

#### 구현 패턴 (카카오 지도 스크립트 로더 참고)

```typescript
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadKakaoAuthScript(): Promise<void> {
  // 이미 로드된 경우
  if (isLoaded && window.Kakao?.isInitialized()) {
    return Promise.resolve();
  }

  // 로딩 중인 경우 기존 Promise 반환
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // 새로운 로딩 시작
  isLoading = true;
  
  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Kakao) {
        try {
          const apiKey = getKakaoJsKey();
          window.Kakao.init(apiKey);
          isLoaded = true;
          isLoading = false;
          resolve();
        } catch (error) {
          isLoading = false;
          reject(new Error('카카오 SDK 초기화 실패'));
        }
      } else {
        isLoading = false;
        reject(new Error('카카오 SDK 객체를 찾을 수 없습니다.'));
      }
    };
    
    script.onerror = () => {
      isLoading = false;
      loadPromise = null;
      reject(new Error('카카오 SDK 스크립트 로딩 실패'));
    };
    
    document.head.appendChild(script);
  });
  
  return loadPromise;
}
```

### 카카오 로그인 플로우

```typescript
export async function executeKakaoLogin(): Promise<string> {
  // SDK 초기화 확인
  if (!window.Kakao?.isInitialized()) {
    await loadKakaoAuthScript();
  }

  return new Promise((resolve, reject) => {
    window.Kakao?.Auth.login({
      success: (authObj) => {
        resolve(authObj.code);
      },
      fail: (err) => {
        // 사용자 취소는 조용히 처리
        if (err.error === 'user_cancelled') {
          reject(new Error('USER_CANCELLED'));
        } else {
          reject(new Error('카카오 로그인에 실패했습니다.'));
        }
      },
    });
  });
}
```

### API 요청 데이터 변환

```typescript
function prepareKakaoLoginRequest(code: string): KakaoLoginRequest {
  return {
    code,
  };
}
```

### 에러 메시지 매핑

```typescript
function getKakaoLoginErrorMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return '유효하지 않은 인증 코드입니다.';
    case 401:
      return '카카오 인증에 실패했습니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return error.message || '카카오 로그인 중 오류가 발생했습니다.';
  }
}
```

### 리다이렉트 처리

```typescript
// 로그인 성공 시
const onboardingStatus = queryClient.getQueryData<{ completed: boolean }>(['onboarding', 'status']);
const isOnboardingCompleted = onboardingStatus?.completed === true;

if (!isOnboardingCompleted) {
  router.push('/onboarding');
} else {
  router.push('/');
}
```

---

## 🚀 성능 최적화

### 코드 분할
- 카카오 SDK는 동적 임포트로 분할
- React Query를 통한 자동 캐싱

### 번들 최적화
- 카카오 SDK는 CDN에서 로드 (번들 크기 감소)
- Tree-shaking 활용

### 로딩 상태
- 카카오 로그인 요청 중 버튼 비활성화
- 로딩 스피너 표시 (선택적)

---

## 📱 모바일 최적화

### 터치 최적화
- 카카오 로그인 버튼 최소 터치 타겟 44px × 44px
- 적절한 간격 유지

### 팝업 최적화
- 카카오 로그인 팝업이 모바일 브라우저에서 정상적으로 표시
- 팝업 차단 감지 및 안내

### 반응성
- 375px 고정 너비 유지
- 모바일 브라우저 호환성 확인

---

## 🔍 엣지 케이스 처리

### EC-001: 카카오 로그인 중 페이지 이탈
- **처리**: React Query의 `AbortController`를 통한 요청 취소
- **상태**: 컴포넌트 언마운트 시 자동 정리

### EC-002: 이미 인증된 사용자 접근
- **처리**: `useAuth` 훅을 통한 인증 상태 확인
- **동작**: 홈 페이지로 자동 리다이렉트 (선택적)

### EC-003: 토큰 저장 실패
- **처리**: try-catch를 통한 에러 처리
- **UI**: 사용자에게 오류 메시지 표시

### EC-004: 서버 응답 지연
- **처리**: Axios 타임아웃 설정 (기존 10초)
- **UI**: 로딩 상태 표시 및 타임아웃 메시지

### EC-005: 카카오 인증 팝업 차단
- **처리**: 팝업 차단 감지 및 사용자 안내
- **대안**: 카카오 SDK의 리다이렉트 방식 고려

### EC-006: 카카오 계정 연동 오류
- **처리**: 서버 에러 응답을 `ApiError` 형식으로 변환
- **UI**: 사용자에게 명확한 오류 메시지 표시

### EC-007: 동일한 카카오 계정으로 다른 로그인 방법 사용
- **처리**: 서버에서 계정 상태 확인
- **UI**: 사용자에게 카카오 로그인 사용 안내

---

## 📚 참고 자료

### API 명세
- 카카오 로그인 API: `POST /api/auth/kakao`
- 자체 로그인 API: `POST /api/auth/local/login` (참고)

### 카카오 개발자 센터
- JavaScript 키: `76464dc0c450e1a52df586f4bba35579`
- JavaScript SDK 도메인: `http://localhost:3000` (추가 완료)
- 카카오 로그인 리다이렉트 URI: `http://localhost:3000` (설정 완료)

### 기존 코드
- API 클라이언트: `src/commons/provider/api-provider/api-client.ts`
- 인증 타입: `src/commons/types/auth.ts`
- 인증 훅: `src/commons/hooks/useAuth.ts`
- 엔드포인트: `src/commons/apis/endpoints.ts`
- 자체 로그인 API: `src/commons/apis/auth/login.ts`
- 자체 로그인 훅: `src/components/Login/hooks/useLoginMutation.ts`
- 카카오 지도 스크립트 로더: `src/commons/utils/kakao-map/script-loader.ts` (참고)

---

## ✅ 체크리스트

### 개발 전
- [ ] API 명세서 확인 완료
- [ ] Figma 디자인 확인 완료
- [ ] 기존 코드 구조 파악 완료
- [ ] 카카오 개발자 센터 설정 완료

### 개발 중
- [ ] 카카오 JavaScript SDK 설정 완료
- [ ] 카카오 로그인 타입 정의 완료
- [ ] 카카오 로그인 API 함수 구현 완료
- [ ] 카카오 로그인 플로우 함수 구현 완료
- [ ] 카카오 로그인 Mutation 훅 구현 완료
- [ ] LoginContainer에 카카오 로그인 연결 완료
- [ ] 환경 변수 설정 완료
- [ ] E2E 테스트 작성 완료
- [ ] UI 테스트 작성 완료

### 개발 후
- [ ] 코드 리뷰 완료
- [ ] 테스트 통과 확인
- [ ] 사용자 승인 완료
- [ ] 문서화 완료

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
