# TimeEgg 자체 로그인 기능 기술 구현 계획

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 자체 로그인 기능을 구현하기 위한 기술적 계획을 담고 있습니다. 명세서(`spec.md`)의 요구사항을 바탕으로 구체적인 구현 방안을 제시합니다.

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
  - 로그인 API 호출 및 캐싱
  - 로딩/에러 상태 관리
- **React Context API** (클라이언트 상태)
  - 인증 상태 전역 관리
  - 사용자 정보 관리

### API 통신
- **Axios**
  - 기존 `apiClient` 활용
  - 인터셉터를 통한 토큰 관리
  - 타입 안전한 API 클라이언트

### 폼 관리
- **React Hook Form** (선택적)
  - 폼 상태 관리
  - 유효성 검증
- **Native HTML5 Validation** (기본)
  - 기본 입력 검증
  - 접근성 향상

---

## 🏛 아키텍처 설계

### Feature Slice Architecture 적용

자체 로그인 기능은 인증 관련 기능이므로 `app/(auth)/login/` 경로에 페이지를 배치하고, 관련 컴포넌트는 `components/Login/`에 배치합니다.

```
src/
├── app/                          # [Routing Layer]
│   └── (auth)/                   # 인증 관련 라우트 그룹
│       └── login/                # 로그인 페이지
│           └── page.tsx          # 페이지 컴포넌트
├── components/                   # [Feature Layer]
│   └── Login/                    # 로그인 기능 컴포넌트
│       ├── index.tsx            # 컨테이너 컴포넌트
│       ├── LoginForm.tsx         # 로그인 폼 컴포넌트
│       ├── types.ts              # 타입 정의
│       ├── hooks/                # 로그인 관련 훅
│       │   ├── useLoginForm.ts  # 폼 상태 관리 훅
│       │   └── useLoginMutation.ts # 로그인 API 훅
│       └── styles.module.css    # 스타일
└── commons/                      # [Shared Layer]
    ├── apis/                     # API 함수
    │   └── auth/                 # 인증 API
    │       ├── login.ts          # 로그인 API 함수
    │       └── types.ts          # API 타입
    ├── types/                     # 공용 타입
    │   └── auth.ts               # 인증 타입 (업데이트)
    └── hooks/                     # 공통 훅
        └── useAuth.ts             # 인증 훅 (업데이트)
```

---

## 📊 데이터 모델링

### API 요청/응답 타입

#### 로그인 요청 타입
```typescript
interface LocalLoginRequest {
  phoneNumber?: string;  // 전화번호 (선택)
  email?: string;         // 이메일 (선택)
  password: string;       // 비밀번호 (필수)
}
```

**제약사항**:
- `phoneNumber` 또는 `email` 중 하나는 반드시 제공되어야 함
- `password`는 필수

#### 로그인 응답 타입
```typescript
interface LocalLoginResponse {
  accessToken: string;    // JWT 액세스 토큰
  refreshToken?: string;  // 리프레시 토큰 (선택)
  user?: User;            // 사용자 정보 (선택)
}
```

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
- `401`: 인증 실패 (잘못된 자격 증명)
- `403`: 계정 비활성화 또는 SNS 계정으로 시도

### 폼 데이터 타입

```typescript
interface LoginFormData {
  phoneNumber: string;
  email: string;
  password: string;
}

interface LoginFormErrors {
  phoneNumber?: string;
  email?: string;
  password?: string;
  general?: string;  // 서버 오류 메시지
}
```

### 상태 관리 타입

```typescript
interface LoginFormState {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  touched: {
    phoneNumber: boolean;
    email: boolean;
    password: boolean;
  };
}
```

---

## 🔌 API 설계

### 엔드포인트

**POST** `/api/auth/local/login`

**요청 본문**:
```json
{
  "phoneNumber": "01012345678",  // 선택
  "email": "user@example.com",   // 선택
  "password": "Password123!"
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

**에러 응답** (401):
```json
{
  "message": "인증에 실패했습니다. 전화번호/이메일 또는 비밀번호를 확인해주세요.",
  "status": 401
}
```

**에러 응답** (403):
```json
{
  "message": "비활성화된 계정이거나 SNS 계정입니다.",
  "status": 403
}
```

### API 함수 구현 위치

- **파일**: `src/commons/apis/auth/login.ts`
- **함수명**: `localLogin(request: LocalLoginRequest): Promise<LocalLoginResponse>`
- **에러 처리**: Axios 인터셉터를 통한 표준화된 에러 처리

---

## 🧩 컴포넌트 설계

### 컴포넌트 계층 구조

```
LoginPage (app/(auth)/login/page.tsx)
  └── LoginContainer (components/Login/index.tsx)
      └── LoginForm (components/Login/LoginForm.tsx)
          ├── PhoneNumberInput (인라인 또는 공용 Input 컴포넌트)
          ├── EmailInput (인라인 또는 공용 Input 컴포넌트)
          ├── PasswordInput (인라인 또는 공용 Input 컴포넌트)
          ├── LoginButton (공용 Button 컴포넌트)
          └── SignupLink (회원가입 링크)
```

### 컴포넌트 상세 설계

#### 1. LoginPage (`app/(auth)/login/page.tsx`)
- **역할**: Next.js 라우팅 담당
- **타입**: Server Component (기본)
- **책임**:
  - 로그인 컨테이너 렌더링
  - 이미 인증된 사용자 리다이렉트 처리 (선택적)

#### 2. LoginContainer (`components/Login/index.tsx`)
- **역할**: 로그인 기능의 컨테이너 컴포넌트
- **타입**: Client Component
- **책임**:
  - 로그인 폼 상태 관리
  - 로그인 API 호출 (React Query)
  - 성공/실패 처리
  - 리다이렉트 처리

#### 3. LoginForm (`components/Login/LoginForm.tsx`)
- **역할**: 로그인 폼 UI 컴포넌트
- **타입**: Client Component
- **Props**:
  ```typescript
  interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isLoading: boolean;
    error?: string;
  }
  ```
- **책임**:
  - 입력 필드 렌더링
  - 클라이언트 사이드 유효성 검증
  - 오류 메시지 표시
  - 폼 제출 처리

### 입력 필드 설계

#### 전화번호/이메일 입력 필드
- **타입**: `text` 또는 `tel` (전화번호), `email` (이메일)
- **유효성 검증**:
  - 전화번호: 한국 전화번호 형식 (010-1234-5678 또는 01012345678)
  - 이메일: 표준 이메일 형식
  - 최소 하나는 필수 입력
- **접근성**: `aria-label`, `aria-required`, `aria-invalid` 속성

#### 비밀번호 입력 필드
- **타입**: `password`
- **유효성 검증**: 최소 길이 확인 (선택적)
- **접근성**: `aria-label`, `aria-required`, `aria-invalid` 속성

---

## 🔄 상태 관리 전략

### 서버 상태 (React Query)

#### useLoginMutation 훅
```typescript
function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: localLogin,
    onSuccess: (data) => {
      // 토큰 저장
      saveTokens(data);
      // 인증 상태 업데이트
      queryClient.setQueryData(['auth'], data.user);
      // 홈 페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      // 에러 처리
    },
  });
}
```

### 클라이언트 상태 (React State)

#### useLoginForm 훅
```typescript
function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState({...});
  
  // 유효성 검증 로직
  // 폼 제출 처리
  // ...
}
```

### 전역 상태 (Context API)

#### AuthContext 업데이트
- 기존 `useAuth` 훅을 실제 인증 로직으로 구현
- 로그인 성공 시 전역 인증 상태 업데이트
- 토큰 저장 및 관리

---

## 🎨 UI/UX 설계

### 레이아웃

- **375px 고정 너비**: MobileFrame 컴포넌트 활용
- **중앙 정렬**: 기존 레이아웃 시스템 활용
- **Figma 디자인 준수**: 제공된 디자인과 일치하는 레이아웃

### 입력 필드 스타일

- **디자인 토큰 사용**: CSS 변수를 통한 색상, 간격, 타이포그래피
- **오류 상태**: 빨간색 테두리 및 오류 메시지 표시
- **포커스 상태**: 명확한 포커스 인디케이터
- **터치 타겟**: 최소 44px × 44px

### 버튼 스타일

- **로그인 버튼**: 주요 액션 버튼 스타일
- **로딩 상태**: 버튼 내부 스피너 또는 비활성화
- **회원가입 링크**: 텍스트 링크 스타일

### 오류 메시지 표시

- **인라인 오류**: 각 입력 필드 하단에 표시
- **일반 오류**: 폼 상단에 표시 (서버 오류 등)
- **접근성**: `role="alert"`, `aria-live` 속성

---

## 🔐 보안 고려사항

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
1. **전화번호 로그인 성공**
   - 전화번호와 비밀번호 입력
   - 로그인 버튼 클릭
   - 홈 페이지로 리다이렉트 확인

2. **이메일 로그인 성공**
   - 이메일과 비밀번호 입력
   - 로그인 버튼 클릭
   - 홈 페이지로 리다이렉트 확인

3. **잘못된 자격 증명으로 실패**
   - 잘못된 자격 증명 입력
   - 오류 메시지 표시 확인

4. **회원가입 페이지 이동**
   - 회원가입 링크 클릭
   - 회원가입 페이지로 이동 확인

### UI 테스트 (Playwright)

#### 컴포넌트 테스트
1. **렌더링 테스트**
   - 모든 입력 필드가 표시되는지 확인
   - 로그인 버튼이 표시되는지 확인
   - 회원가입 링크가 표시되는지 확인

2. **상호작용 테스트**
   - 입력 필드에 값 입력
   - 유효성 검증 동작 확인
   - 폼 제출 동작 확인

3. **시각적 검증**
   - Figma 디자인과 일치하는지 확인
   - 오류 상태 시각적 피드백 확인

---

## 📝 개발 워크플로우

### Step 1: API 연결

**목적**: 백엔드와의 통신 인터페이스 확립

**작업**:
1. `src/commons/apis/auth/login.ts` 파일 생성
2. `LocalLoginRequest`, `LocalLoginResponse` 타입 정의
3. `localLogin` API 함수 구현
4. 에러 핸들링 및 타입 안전성 보장

**결과물**: 완전히 작동하는 로그인 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 사용자 플로우 검증

**작업**:
1. 로그인 성공 시나리오 테스트 작성
2. 로그인 실패 시나리오 테스트 작성
3. 회원가입 페이지 이동 테스트 작성

**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. `components/Login/` 디렉토리 생성
2. `LoginForm` 컴포넌트 구현 (Mock 데이터 기반)
3. Figma 디자인에 맞는 스타일 적용
4. 입력 필드 유효성 검증 UI 구현
5. 오류 메시지 표시 UI 구현

**결과물**: 375px 모바일 프레임 전용 완전한 UI/UX

### Step 4: 사용자 승인 단계

**목적**: UI/UX 최종 검증 및 피드백 수집

**작업**:
1. 스테이징 환경 배포
2. 사용자 테스트 및 피드백 수집
3. UI/UX 개선사항 반영

**결과물**: 사용자 승인된 최종 UI

### Step 5: 데이터 바인딩

**목적**: 실제 API와 UI 연결

**작업**:
1. `useLoginForm` 훅 구현
2. `useLoginMutation` 훅 구현 (React Query)
3. `LoginContainer` 컴포넌트에서 훅 연결
4. Mock 데이터를 실제 API 호출로 교체
5. 로딩/에러 상태 처리
6. 성공 시 리다이렉트 처리
7. `useAuth` 훅 업데이트 (전역 인증 상태 관리)

**결과물**: 완전히 작동하는 로그인 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 🔧 구현 세부사항

### 입력 필드 유효성 검증

#### 클라이언트 사이드 검증
```typescript
function validateLoginForm(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  
  // 전화번호 또는 이메일 중 하나는 필수
  if (!data.phoneNumber && !data.email) {
    errors.general = '전화번호 또는 이메일을 입력해주세요.';
  }
  
  // 전화번호 형식 검증 (입력된 경우)
  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = '올바른 전화번호 형식이 아닙니다.';
  }
  
  // 이메일 형식 검증 (입력된 경우)
  if (data.email && !isValidEmail(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  
  // 비밀번호 필수
  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.';
  }
  
  return errors;
}
```

### API 요청 데이터 변환

```typescript
function prepareLoginRequest(formData: LoginFormData): LocalLoginRequest {
  const request: LocalLoginRequest = {
    password: formData.password,
  };
  
  // 전화번호와 이메일 중 하나만 전송
  if (formData.phoneNumber) {
    request.phoneNumber = formData.phoneNumber;
  } else if (formData.email) {
    request.email = formData.email;
  }
  
  return request;
}
```

### 에러 메시지 매핑

```typescript
function getErrorMessage(error: ApiError): string {
  switch (error.status) {
    case 401:
      return '인증에 실패했습니다. 전화번호/이메일 또는 비밀번호를 확인해주세요.';
    case 403:
      return '비활성화된 계정이거나 SNS 계정입니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return error.message || '로그인 중 오류가 발생했습니다.';
  }
}
```

### 리다이렉트 처리

```typescript
// 로그인 성공 시
router.push('/');  // 홈 페이지로 이동

// 이미 인증된 사용자가 로그인 페이지 접근 시 (선택적)
if (isAuthenticated) {
  router.push('/');
}
```

---

## 🚀 성능 최적화

### 코드 분할
- 로그인 페이지는 동적 임포트로 분할 (필요시)
- React Query를 통한 자동 캐싱

### 번들 최적화
- 불필요한 라이브러리 제거
- Tree-shaking 활용

### 로딩 상태
- 로그인 요청 중 버튼 비활성화
- 로딩 스피너 표시 (선택적)

---

## 📱 모바일 최적화

### 터치 최적화
- 입력 필드 최소 높이 44px
- 버튼 최소 터치 타겟 44px × 44px
- 적절한 간격 유지

### 키보드 최적화
- 적절한 `inputMode` 속성 설정
- 자동 완성 속성 활용 (`autocomplete`)

### 반응성
- 375px 고정 너비 유지
- 모바일 브라우저 호환성 확인

---

## 🔍 엣지 케이스 처리

### EC-001: 전화번호와 이메일 모두 입력
- **처리**: 전화번호 우선 사용 (또는 API 스펙에 따라)
- **UI**: 사용자에게 명확한 안내 제공

### EC-002: 로그인 중 페이지 이탈
- **처리**: React Query의 `AbortController`를 통한 요청 취소
- **상태**: 컴포넌트 언마운트 시 자동 정리

### EC-003: 이미 인증된 사용자 접근
- **처리**: `useAuth` 훅을 통한 인증 상태 확인
- **동작**: 홈 페이지로 자동 리다이렉트 (선택적)

### EC-004: 토큰 저장 실패
- **처리**: try-catch를 통한 에러 처리
- **UI**: 사용자에게 오류 메시지 표시

### EC-005: 서버 응답 지연
- **처리**: Axios 타임아웃 설정 (기존 10초)
- **UI**: 로딩 상태 표시 및 타임아웃 메시지

### EC-006: 입력 필드 포커스 관리
- **처리**: 오류 발생 시 해당 필드에 포커스 이동
- **접근성**: `focus()` 메서드 활용

---

## 📚 참고 자료

### API 명세
- 로그인 API: `POST /api/auth/local/login`
- 토큰 검증 API: `GET /api/auth/verify` (참고)

### 디자인
- 로그인 페이지: [Figma 링크](https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1665&t=GV7N56w43IzWbaVI-4)

### 기존 코드
- API 클라이언트: `src/commons/provider/api-provider/api-client.ts`
- 인증 타입: `src/commons/types/auth.ts`
- 인증 훅: `src/commons/hooks/useAuth.ts`
- 엔드포인트: `src/commons/apis/endpoints.ts`

---

## ✅ 체크리스트

### 개발 전
- [ ] API 명세서 확인 완료
- [ ] Figma 디자인 확인 완료
- [ ] 기존 코드 구조 파악 완료

### 개발 중
- [ ] API 연결 완료
- [ ] E2E 테스트 작성 완료
- [ ] UI 구현 완료
- [ ] 데이터 바인딩 완료
- [ ] UI 테스트 작성 완료

### 개발 후
- [ ] 코드 리뷰 완료
- [ ] 테스트 통과 확인
- [ ] 사용자 승인 완료
- [ ] 문서화 완료

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.
