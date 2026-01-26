# TimeEgg 온보딩 기능 기술 구현 계획

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 온보딩 기능을 구현하기 위한 기술적 계획을 담고 있습니다. 명세서(`spec.md`)의 요구사항을 바탕으로 구체적인 구현 방안을 제시합니다.

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
  - 온보딩 완료 API 호출 및 캐싱
  - 로딩/에러 상태 관리
- **React State** (클라이언트 상태)
  - 동의 상태 임시 저장
  - 단계별 네비게이션 상태

### API 통신
- **Axios**
  - 기존 `apiClient` 활용
  - 인터셉터를 통한 토큰 관리
  - 타입 안전한 API 클라이언트

---

## 🏛 아키텍처 설계

### Feature Slice Architecture 적용

온보딩 기능은 인증 관련 기능이므로 `app/(auth)/onboarding/` 경로에 페이지를 배치하고, 관련 컴포넌트는 `components/Onboarding/`에 배치합니다.

```
src/
├── app/                          # [Routing Layer]
│   └── (auth)/                   # 인증 관련 라우트 그룹
│       └── onboarding/           # 온보딩 페이지
│           └── page.tsx          # 페이지 컴포넌트
├── components/                   # [Feature Layer]
│   └── Onboarding/              # 온보딩 기능 컴포넌트
│       ├── index.tsx            # 컨테이너 컴포넌트
│       ├── FriendConsentStep.tsx # 친구 연동 허용 단계
│       ├── LocationConsentStep.tsx # 위치 권한 허용 단계
│       ├── types.ts              # 타입 정의
│       ├── hooks/                # 온보딩 관련 훅
│       │   ├── useOnboardingFlow.ts # 플로우 상태 관리 훅
│       │   └── useOnboardingMutation.ts # 온보딩 완료 API 훅
│       └── styles.module.css    # 스타일
└── commons/                      # [Shared Layer]
    ├── apis/                     # API 함수
    │   └── onboarding/          # 온보딩 API
    │       ├── complete.ts      # 온보딩 완료 API 함수
    │       └── types.ts         # API 타입
    └── hooks/                    # 공통 훅
        └── useAuth.ts            # 인증 훅 (온보딩 완료 상태 확인)
```

---

## 📊 데이터 모델링

### API 요청/응답 타입

#### 온보딩 완료 요청 타입
```typescript
interface OnboardingCompleteRequest {
  friend_consent: boolean;    // 친구 연동 허용 동의 여부
  location_consent: boolean;   // 위치 권한 허용 동의 여부
}
```

**제약사항**:
- `friend_consent`와 `location_consent` 모두 필수
- boolean 타입으로 동의(true) 또는 거부(false) 상태 전송

#### 온보딩 완료 응답 타입
```typescript
interface OnboardingCompleteResponse {
  success: boolean;  // 온보딩 완료 성공 여부
}
```

#### API 에러 응답 타입
```typescript
interface OnboardingErrorResponse {
  message: string;   // 오류 메시지
  status: number;    // HTTP 상태 코드
  code?: string;     // 오류 코드 (선택)
}
```

**HTTP 상태 코드 매핑**:
- `200`: 온보딩 완료 성공
- `400`: 잘못된 요청 (필수 필드 누락 등)
- `401`: 인증 실패 (유효하지 않은 토큰)
- `500`: 서버 내부 오류

### 온보딩 상태 타입

```typescript
interface OnboardingState {
  friendConsent: boolean | null;    // 친구 연동 허용 동의 (null: 미선택)
  locationConsent: boolean | null;   // 위치 권한 허용 동의 (null: 미선택)
  currentStep: OnboardingStep;     // 현재 단계
}

type OnboardingStep = 'friend' | 'location' | 'complete';
```

### 단계별 컴포넌트 Props 타입

```typescript
interface ConsentStepProps {
  consent: boolean | null;
  onConsentChange: (consent: boolean) => void;
  onNext: () => void;
  isLoading?: boolean;
}
```

---

## 🔌 API 설계

### 엔드포인트

**POST** `/api/onboarding/complete`

**요청 본문**:
```json
{
  "friend_consent": true,
  "location_consent": true
}
```

**성공 응답** (200):
```json
{
  "success": true
}
```

**에러 응답** (400):
```json
{
  "message": "잘못된 요청입니다. 필수 필드를 확인해주세요.",
  "status": 400
}
```

**에러 응답** (401):
```json
{
  "message": "인증에 실패했습니다. 로그인 후 다시 시도해주세요.",
  "status": 401
}
```

**에러 응답** (500):
```json
{
  "message": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  "status": 500
}
```

### API 함수 구현 위치

- **파일**: `src/commons/apis/onboarding/complete.ts`
- **함수명**: `completeOnboarding(request: OnboardingCompleteRequest): Promise<OnboardingCompleteResponse>`
- **에러 처리**: Axios 인터셉터를 통한 표준화된 에러 처리

### 엔드포인트 상수 추가

`src/commons/apis/endpoints.ts`에 온보딩 엔드포인트 추가:
```typescript
export const ONBOARDING_ENDPOINTS = {
  COMPLETE: `${BASE_PATHS.API}/onboarding/complete`,
} as const;
```

---

## 🧩 컴포넌트 설계

### 컴포넌트 계층 구조

```
OnboardingPage (app/(auth)/onboarding/page.tsx)
  └── OnboardingContainer (components/Onboarding/index.tsx)
      ├── FriendConsentStep (components/Onboarding/FriendConsentStep.tsx)
      │   ├── ConsentDescription (설명 텍스트)
      │   ├── ConsentToggle (동의/거부 선택 UI)
      │   └── NextButton (다음 단계 버튼)
      └── LocationConsentStep (components/Onboarding/LocationConsentStep.tsx)
          ├── ConsentDescription (설명 텍스트)
          ├── ConsentToggle (동의/거부 선택 UI)
          └── CompleteButton (온보딩 완료 버튼)
```

### 컴포넌트 상세 설계

#### 1. OnboardingPage (`app/(auth)/onboarding/page.tsx`)
- **역할**: Next.js 라우팅 담당
- **타입**: Server Component (기본)
- **책임**:
  - 온보딩 컨테이너 렌더링
  - 이미 온보딩을 완료한 사용자 리다이렉트 처리
  - 인증되지 않은 사용자 리다이렉트 처리

#### 2. OnboardingContainer (`components/Onboarding/index.tsx`)
- **역할**: 온보딩 기능의 컨테이너 컴포넌트
- **타입**: Client Component
- **책임**:
  - 온보딩 플로우 상태 관리
  - 단계별 컴포넌트 렌더링
  - 온보딩 완료 API 호출 (React Query)
  - 성공/실패 처리
  - 리다이렉트 처리

#### 3. FriendConsentStep (`components/Onboarding/FriendConsentStep.tsx`)
- **역할**: 친구 연동 허용 동의 단계 UI 컴포넌트
- **타입**: Client Component
- **Props**:
  ```typescript
  interface FriendConsentStepProps {
    consent: boolean | null;
    onConsentChange: (consent: boolean) => void;
    onNext: () => void;
  }
  ```
- **책임**:
  - 친구 연동 허용 설명 표시
  - 동의/거부 선택 UI 렌더링
  - 다음 단계로 이동 버튼 표시

#### 4. LocationConsentStep (`components/Onboarding/LocationConsentStep.tsx`)
- **역할**: 위치 권한 허용 동의 단계 UI 컴포넌트
- **타입**: Client Component
- **Props**:
  ```typescript
  interface LocationConsentStepProps {
    consent: boolean | null;
    onConsentChange: (consent: boolean) => void;
    onComplete: () => void;
    isLoading: boolean;
  }
  ```
- **책임**:
  - 위치 권한 허용 설명 표시
  - 동의/거부 선택 UI 렌더링
  - 온보딩 완료 버튼 표시

### 동의 선택 UI 설계

#### ConsentToggle 컴포넌트 (인라인 또는 공용 컴포넌트)
- **타입**: `button` 또는 `div` 기반 커스텀 토글
- **상태**: 동의(true), 거부(false), 미선택(null)
- **시각적 피드백**: 선택 상태에 따른 스타일 변경
- **접근성**: `aria-label`, `aria-pressed`, `role="switch"` 속성

---

## 🔄 상태 관리 전략

### 서버 상태 (React Query)

#### useOnboardingMutation 훅
```typescript
function useOnboardingMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      // 온보딩 완료 상태 업데이트 (필요시)
      queryClient.setQueryData(['onboarding', 'status'], { completed: true });
      // 메인 페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      // 에러 처리
    },
  });
}
```

### 클라이언트 상태 (React State)

#### useOnboardingFlow 훅
```typescript
function useOnboardingFlow() {
  const [state, setState] = useState<OnboardingState>({
    friendConsent: null,
    locationConsent: null,
    currentStep: 'friend',
  });
  
  const handleFriendConsentChange = (consent: boolean) => {
    setState(prev => ({ ...prev, friendConsent: consent }));
  };
  
  const handleLocationConsentChange = (consent: boolean) => {
    setState(prev => ({ ...prev, locationConsent: consent }));
  };
  
  const handleNext = () => {
    setState(prev => ({ ...prev, currentStep: 'location' }));
  };
  
  const handleComplete = () => {
    // 두 동의 상태가 모두 선택되었는지 확인
    if (state.friendConsent !== null && state.locationConsent !== null) {
      return {
        friend_consent: state.friendConsent,
        location_consent: state.locationConsent,
      };
    }
    return null;
  };
  
  return {
    state,
    handleFriendConsentChange,
    handleLocationConsentChange,
    handleNext,
    handleComplete,
  };
}
```

---

## 🎨 UI/UX 설계

### 레이아웃

- **375px 고정 너비**: MobileFrame 컴포넌트 활용
- **중앙 정렬**: 기존 레이아웃 시스템 활용
- **Figma 디자인 준수**: 제공된 디자인과 일치하는 레이아웃
  - 친구 연동 허용: [Figma 링크](https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1587&t=GV7N56w43IzWbaVI-4)
  - 위치 권한 허용: [Figma 링크](https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1563&t=GV7N56w43IzWbaVI-4)

### 동의 선택 UI 스타일

- **디자인 토큰 사용**: CSS 변수를 통한 색상, 간격, 타이포그래피
- **선택 상태**: 명확한 시각적 피드백 (배경색, 테두리 등)
- **터치 타겟**: 최소 44px × 44px
- **명확한 설명**: 각 동의 항목에 대한 설명 텍스트 표시

### 버튼 스타일

- **다음 단계 버튼**: 주요 액션 버튼 스타일
- **온보딩 완료 버튼**: 주요 액션 버튼 스타일
- **로딩 상태**: 버튼 내부 스피너 또는 비활성화

### 오류 메시지 표시

- **일반 오류**: 화면 상단 또는 버튼 하단에 표시
- **접근성**: `role="alert"`, `aria-live` 속성

---

## 🔐 보안 고려사항

### 인증 확인
- **토큰 검증**: 온보딩 완료 API 호출 시 인증 토큰 필요
- **인증되지 않은 사용자**: 로그인 페이지로 리다이렉트

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
1. **온보딩 완료 성공**
   - 친구 연동 허용 동의 선택
   - 위치 권한 허용 동의 선택
   - 온보딩 완료 버튼 클릭
   - 메인 페이지로 리다이렉트 확인

2. **동의 거부 후 온보딩 완료**
   - 친구 연동 허용 거부 선택
   - 위치 권한 허용 거부 선택
   - 온보딩 완료 버튼 클릭
   - 메인 페이지로 리다이렉트 확인

3. **온보딩 완료 실패 (서버 오류)**
   - 동의 선택 후 온보딩 완료 시도
   - 서버 오류 발생
   - 오류 메시지 표시 확인

4. **이미 온보딩 완료한 사용자 접근**
   - 온보딩 완료 상태의 사용자가 온보딩 페이지 접근
   - 메인 페이지로 리다이렉트 확인

5. **인증되지 않은 사용자 접근**
   - 로그인하지 않은 사용자가 온보딩 페이지 접근
   - 로그인 페이지로 리다이렉트 확인

### UI 테스트 (Playwright)

#### 컴포넌트 테스트
1. **렌더링 테스트**
   - 친구 연동 허용 단계가 표시되는지 확인
   - 위치 권한 허용 단계가 표시되는지 확인
   - 동의 선택 UI가 표시되는지 확인
   - 버튼이 표시되는지 확인

2. **상호작용 테스트**
   - 동의 선택 UI 클릭
   - 선택 상태 변경 확인
   - 다음 단계로 이동 확인
   - 온보딩 완료 동작 확인

3. **시각적 검증**
   - Figma 디자인과 일치하는지 확인
   - 선택 상태 시각적 피드백 확인

---

## 📝 개발 워크플로우

### Step 1: API 연결

**목적**: 백엔드와의 통신 인터페이스 확립

**작업**:
1. `src/commons/apis/onboarding/` 디렉토리 생성
2. `OnboardingCompleteRequest`, `OnboardingCompleteResponse` 타입 정의
3. `completeOnboarding` API 함수 구현
4. `src/commons/apis/endpoints.ts`에 온보딩 엔드포인트 추가
5. 에러 핸들링 및 타입 안전성 보장

**결과물**: 완전히 작동하는 온보딩 완료 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 사용자 플로우 검증

**작업**:
1. 온보딩 완료 성공 시나리오 테스트 작성
2. 동의 거부 후 온보딩 완료 시나리오 테스트 작성
3. 온보딩 완료 실패 시나리오 테스트 작성
4. 이미 온보딩 완료한 사용자 접근 테스트 작성
5. 인증되지 않은 사용자 접근 테스트 작성

**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. `components/Onboarding/` 디렉토리 생성
2. `FriendConsentStep` 컴포넌트 구현 (Mock 데이터 기반)
3. `LocationConsentStep` 컴포넌트 구현 (Mock 데이터 기반)
4. Figma 디자인에 맞는 스타일 적용
5. 동의 선택 UI 구현
6. 단계별 네비게이션 UI 구현

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
1. `useOnboardingFlow` 훅 구현
2. `useOnboardingMutation` 훅 구현 (React Query)
3. `OnboardingContainer` 컴포넌트에서 훅 연결
4. Mock 데이터를 실제 API 호출로 교체
5. 로딩/에러 상태 처리
6. 성공 시 리다이렉트 처리
7. 인증 상태 확인 및 리다이렉트 처리

**결과물**: 완전히 작동하는 온보딩 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 🔧 구현 세부사항

### API 요청 데이터 변환

```typescript
function prepareOnboardingRequest(
  friendConsent: boolean | null,
  locationConsent: boolean | null
): OnboardingCompleteRequest {
  // null 값은 기본값(false)으로 처리
  return {
    friend_consent: friendConsent ?? false,
    location_consent: locationConsent ?? false,
  };
}
```

### 에러 메시지 매핑

```typescript
function getErrorMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return '잘못된 요청입니다. 필수 필드를 확인해주세요.';
    case 401:
      return '인증에 실패했습니다. 로그인 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return error.message || '온보딩 완료 중 오류가 발생했습니다.';
  }
}
```

### 리다이렉트 처리

```typescript
// 온보딩 완료 성공 시
router.push('/');  // 메인 페이지로 이동

// 이미 온보딩을 완료한 사용자가 온보딩 페이지 접근 시
if (isOnboardingCompleted) {
  router.push('/');
}

// 인증되지 않은 사용자가 온보딩 페이지 접근 시
if (!isAuthenticated) {
  router.push('/login');
}
```

### 단계별 네비게이션

```typescript
// 친구 연동 허용 단계
if (currentStep === 'friend') {
  return <FriendConsentStep {...friendProps} />;
}

// 위치 권한 허용 단계
if (currentStep === 'location') {
  return <LocationConsentStep {...locationProps} />;
}
```

---

## 🚀 성능 최적화

### 코드 분할
- 온보딩 페이지는 동적 임포트로 분할 (필요시)
- React Query를 통한 자동 캐싱

### 번들 최적화
- 불필요한 라이브러리 제거
- Tree-shaking 활용

### 로딩 상태
- 온보딩 완료 요청 중 버튼 비활성화
- 로딩 스피너 표시 (선택적)

---

## 📱 모바일 최적화

### 터치 최적화
- 동의 선택 UI 최소 높이 44px
- 버튼 최소 터치 타겟 44px × 44px
- 적절한 간격 유지

### 반응성
- 375px 고정 너비 유지
- 모바일 브라우저 호환성 확인

---

## 🔍 엣지 케이스 처리

### EC-001: 온보딩 중 페이지 이탈
- **처리**: React Query의 `AbortController`를 통한 요청 취소
- **상태**: 컴포넌트 언마운트 시 자동 정리

### EC-002: 이미 온보딩을 완료한 사용자 접근
- **처리**: 온보딩 완료 상태 확인 (서버 또는 로컬 상태)
- **동작**: 메인 페이지로 자동 리다이렉트

### EC-003: 인증되지 않은 사용자 접근
- **처리**: `useAuth` 훅을 통한 인증 상태 확인
- **동작**: 로그인 페이지로 자동 리다이렉트

### EC-004: 서버 응답 지연
- **처리**: Axios 타임아웃 설정 (기존 10초)
- **UI**: 로딩 상태 표시 및 타임아웃 메시지

### EC-005: 동의 상태 미선택
- **처리**: 기본값(false)으로 처리하거나 사용자에게 안내
- **UI**: 동의 선택을 요청하는 안내 메시지 표시 (선택적)

### EC-006: 네트워크 연결 없음
- **처리**: 네트워크 오류 감지 및 사용자 안내
- **UI**: 네트워크 연결 필요 메시지 표시

---

## 📚 참고 자료

### API 명세
- 온보딩 완료 API: `POST /api/onboarding/complete`

### 디자인
- 친구 연동 허용: [Figma 링크](https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1587&t=GV7N56w43IzWbaVI-4)
- 위치 권한 허용: [Figma 링크](https://www.figma.com/design/ChrSWhvkq3f0bWwOzWHKJN/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=2016-1563&t=GV7N56w43IzWbaVI-4)

### 기존 코드
- API 클라이언트: `src/commons/provider/api-provider/api-client.ts`
- 인증 훅: `src/commons/hooks/useAuth.ts`
- 엔드포인트: `src/commons/apis/endpoints.ts`
- 로그인 컴포넌트: `src/components/Login/` (참고)

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
