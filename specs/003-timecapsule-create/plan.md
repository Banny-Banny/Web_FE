# 타임캡슐 생성 페이지 기술 계획서

**Branch**: `feat/timecapsule-create` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-timecapsule-create/spec.md`

## Summary

타임캡슐 생성 페이지를 구현하여 사용자가 타임캡슐의 기본 정보를 입력하고 결제 페이지로 진행할 수 있도록 합니다.

**주요 목표**:
- 타임캡슐 기본 정보 입력 폼 구현 (캡슐 이름, 오픈 예정일, 참여 인원 수, 캡슐 테마/디자인)
- 폼 유효성 검사 및 에러 메시지 표시
- 입력 데이터를 결제 페이지로 전달
- Figma 디자인과 pixel-perfect 수준으로 일치하는 UI 구현

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Hook Form + Zod를 활용한 폼 관리 및 유효성 검사
- CSS Module 기반 스타일링 (375px 모바일 고정 레이아웃)
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- Next.js App Router를 활용한 라우팅 및 데이터 전달

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, React Hook Form, Zod, Tailwind CSS v4  
**Storage**: N/A (폼 데이터는 결제 페이지로 전달, API 호출 없음)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 페이지 로드 시간 2초 이하, 폼 검증 수행 시간 200ms 이하  
**Constraints**: 
- 375px 모바일 고정 레이아웃
- 반응형 디자인 미지원
- 디자인 토큰은 `src/commons/styles`에서 import (중복 선언 금지)
- Figma 디자인과 정확히 일치해야 함
- 이 페이지에서는 API 호출 없음 (폼 데이터만 결제 페이지로 전달)
**Scale/Scope**: 타임캡슐 생성 페이지 1개 + 폼 컴포넌트 + 유효성 검사 로직

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/TimecapsuleCreate/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **폼 관리**: React Hook Form + Zod를 활용한 타입 안전한 폼 관리  
✅ **성능**: 폼 검증 최적화, 페이지 로드 성능 고려

---

## Project Structure

### Documentation (this feature)

```text
specs/003-timecapsule-create/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── timecapsule/
│           └── create/
│               └── page.tsx              # 라우팅 전용 (컴포넌트 import만)
├── components/
│   └── TimecapsuleCreate/               # 타임캡슐 생성 페이지 컴포넌트
│       ├── index.tsx                    # 메인 컨테이너 컴포넌트
│       ├── types.ts                     # 타입 정의
│       ├── styles.module.css            # 스타일 (CSS Module)
│       ├── hooks/                       # 페이지별 비즈니스 로직
│       │   ├── useTimecapsuleForm.ts    # 폼 상태 관리 훅
│       │   └── useFormValidation.ts     # 유효성 검사 훅
│       ├── components/                  # UI 컴포넌트
│       │   ├── CapsuleNameInput/        # 캡슐 이름 입력 필드
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── OpenDatePicker/          # 오픈 예정일 선택 필드
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── ParticipantCountInput/    # 참여 인원 수 입력 필드
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   ├── ThemeSelector/           # 캡슐 테마/디자인 선택 필드
│       │   │   ├── index.tsx
│       │   │   ├── types.ts
│       │   │   └── styles.module.css
│       │   └── FormError/               # 에러 메시지 컴포넌트
│       │       ├── index.tsx
│       │       ├── types.ts
│       │       └── styles.module.css
│       └── schemas/                     # Zod 스키마 정의
│           └── timecapsuleFormSchema.ts # 폼 유효성 검사 스키마
└── commons/
    ├── components/                       # 공용 컴포넌트 (재사용)
    │   ├── button/                       # Button 컴포넌트
    │   ├── timecapsule-header/           # TimeCapsuleHeader 컴포넌트
    │   └── ...                          # 기타 공용 컴포넌트
    └── styles/                          # 디자인 토큰
        ├── color.ts
        ├── spacing.ts
        ├── fonts.ts
        └── typography.ts
```

**Structure Decision**: 
- 페이지 컴포넌트는 `src/components/TimecapsuleCreate/`에 배치
- 라우팅은 `src/app/(main)/timecapsule/create/page.tsx`에서 컴포넌트 import만 수행
- 폼 관련 로직은 `hooks/` 디렉토리에 분리
- UI 컴포넌트는 `components/` 디렉토리에 개별 컴포넌트로 구성
- Zod 스키마는 `schemas/` 디렉토리에 분리

---

## Implementation Strategy

### Phase 1: 프로젝트 구조 및 타입 정의

**목적**: 기본 구조 설정 및 타입 정의

**작업**:
1. 디렉토리 구조 생성
   - `src/components/TimecapsuleCreate/` 디렉토리 생성
   - 하위 디렉토리 구조 생성 (hooks, components, schemas)
2. 타입 정의 (`types.ts`)
   - 폼 데이터 타입 (`TimecapsuleFormData`)
   - 각 입력 필드 타입
   - 에러 메시지 타입
   - 결제 페이지로 전달할 데이터 타입
3. Zod 스키마 정의 (`schemas/timecapsuleFormSchema.ts`)
   - 캡슐 이름: 필수, 최대 길이 제한 (선택적)
   - 오픈 예정일: 필수, 미래 날짜만 허용
   - 참여 인원 수: 필수, 1 이상의 정수
   - 캡슐 테마/디자인: 선택적 (필수일 수 있음)

**결과물**:
- 완전한 디렉토리 구조
- TypeScript 타입 정의
- Zod 유효성 검사 스키마

---

### Phase 2: Figma 디자인 분석 및 디자인 토큰 확인

**목적**: Figma 디자인 스펙 확인 및 디자인 토큰 매핑

**작업**:
1. Figma MCP 서버를 통해 디자인 스펙 추출
   - 타임캡슐 생성 페이지 전체 레이아웃
   - 각 입력 필드의 디자인 스펙
   - 테마/디자인 선택 UI 스펙
   - 에러 메시지 스타일
   - 버튼 스타일
2. `src/commons/styles`에 정의된 디자인 토큰 확인
   - 색상: `Colors`
   - 간격: `Spacing`
   - 타이포그래피: `Typography`
   - 반경: `BorderRadius`
3. 디자인 토큰 매핑
   - Figma에서 추출한 값과 프로젝트 디자인 토큰 매핑
   - CSS 변수로 사용할 토큰 식별

**결과물**:
- 디자인 스펙 문서
- 디자인 토큰 매핑 테이블
- CSS Module에서 사용할 CSS 변수 목록

---

### Phase 3: 기본 UI 컴포넌트 구현 (Priority: P1)

**목적**: 각 입력 필드 컴포넌트 구현

**작업 순서**:
1. **CapsuleNameInput 컴포넌트**
   - React Hook Form과 통합
   - 텍스트 입력 필드
   - 실시간 글자 수 표시 (선택적)
   - 에러 메시지 표시
   - CSS Module로 스타일 구현

2. **OpenDatePicker 컴포넌트**
   - 날짜 선택 인터페이스 구현
   - 미래 날짜만 선택 가능하도록 제한
   - 과거/오늘 날짜 선택 시 에러 표시
   - React Hook Form과 통합
   - CSS Module로 스타일 구현

3. **ParticipantCountInput 컴포넌트**
   - 숫자 입력 필드
   - 1 이상의 정수만 허용
   - 0 이하, 음수, 소수점 입력 시 에러 표시
   - React Hook Form과 통합
   - CSS Module로 스타일 구현

4. **ThemeSelector 컴포넌트**
   - 테마/디자인 옵션 표시
   - 선택 상태 시각적 구분
   - React Hook Form과 통합
   - CSS Module로 스타일 구현

5. **FormError 컴포넌트**
   - 에러 메시지 표시 컴포넌트
   - 접근성 지원 (aria-live)
   - CSS Module로 스타일 구현

**결과물**:
- 5개 입력 필드 컴포넌트 구현 완료
- TypeScript 타입 정의 완료
- CSS Module 스타일 구현 완료

---

### Phase 4: 폼 관리 및 유효성 검사 구현 (Priority: P1)

**목적**: React Hook Form + Zod를 활용한 폼 상태 관리 및 유효성 검사

**작업**:
1. **useTimecapsuleForm 훅 구현**
   - React Hook Form 설정
   - Zod 스키마와 통합 (`resolver: zodResolver`)
   - 폼 상태 관리
   - 제출 핸들러 구현
   - 에러 상태 관리

2. **useFormValidation 훅 구현**
   - 실시간 유효성 검사
   - 필드별 에러 메시지 관리
   - 전체 폼 검증 로직
   - 에러 메시지 표시 로직

3. **폼 제출 로직**
   - 모든 필드 검증
   - 검증 통과 시 결제 페이지로 이동
   - 검증 실패 시 에러 메시지 표시
   - 첫 번째 에러 필드로 자동 스크롤

**결과물**:
- 완전한 폼 관리 훅
- 유효성 검사 로직 구현
- 에러 처리 로직 구현

---

### Phase 5: 메인 페이지 컴포넌트 구현 (Priority: P1)

**목적**: 모든 컴포넌트를 통합한 메인 페이지 구현

**작업**:
1. **TimecapsuleCreate 메인 컴포넌트**
   - TimeCapsuleHeader 컴포넌트 사용
   - 모든 입력 필드 컴포넌트 통합
   - 폼 제출 버튼 (Button 컴포넌트 사용)
   - 에러 메시지 표시 영역
   - CSS Module로 레이아웃 스타일 구현

2. **라우팅 페이지 구현**
   - `src/app/(main)/timecapsule/create/page.tsx` 생성
   - TimecapsuleCreate 컴포넌트 import 및 렌더링
   - 라우팅 전용 규칙 준수

3. **결제 페이지로 데이터 전달**
   - 검증 통과 시 Next.js Router를 사용하여 결제 페이지로 이동
   - URL 쿼리 파라미터 또는 상태 관리 라이브러리를 통한 데이터 전달
   - 또는 세션 스토리지를 통한 임시 데이터 저장 (선택적)

**결과물**:
- 완전한 타임캡슐 생성 페이지
- 라우팅 설정 완료
- 결제 페이지로 데이터 전달 로직 구현

---

### Phase 6: 스타일링 및 디자인 적용 (Priority: P1)

**목적**: Figma 디자인과 정확히 일치하도록 스타일 적용

**작업**:
1. **CSS Module로 컴포넌트별 스타일 구현**
   - 각 컴포넌트의 `styles.module.css` 파일에 스타일 작성
   - CSS 변수를 사용하여 디자인 토큰 참조
     - 색상: `var(--color-*)` (예: `var(--color-black-500)`)
     - 간격: `var(--spacing-*)` (예: `var(--spacing-xl)`)
     - 반경: `var(--radius-*)` (예: `var(--radius-xl)`)
     - 폰트: `var(--font-*)`, `var(--font-size-*)`, `var(--font-weight-*)` 등
   - 디자인 토큰은 `src/commons/styles/`에 TypeScript 객체로 정의되어 있으며, `src/app/layout.tsx`에서 CSS 변수로 변환되어 `:root`에 주입됨
   - Figma에서 추출한 수치 값 반올림 적용
   - 375px 기준 고정 레이아웃
   - 하드코딩된 색상값(hex/rgb/hsl) 사용 금지
   - 인라인 스타일(`style={...}`) 사용 금지

2. **레이아웃 스타일링**
   - 375px 기준 고정 레이아웃
   - 입력 필드 간 간격
   - 에러 메시지 위치 및 스타일
   - 제출 버튼 위치 및 스타일

3. **에러 상태 스타일링**
   - 에러가 있는 필드의 시각적 구분
   - 에러 메시지 스타일
   - 포커스 상태 스타일

**결과물**:
- Figma 디자인과 정확히 일치하는 스타일
- CSS Module 기반 컴포넌트별 스타일 격리
- CSS 변수를 통한 디자인 토큰 기반 일관된 스타일링

---

### Phase 7: 접근성 및 사용자 경험 개선 (Priority: P2)

**목적**: 접근성 요구사항 충족 및 사용자 경험 최적화

**작업**:
1. **접근성 개선**
   - 모든 입력 필드에 적절한 라벨 (`<label>` 또는 `aria-label`)
   - 에러 메시지에 `aria-live` 속성 추가
   - 키보드 네비게이션 지원
   - 포커스 관리 (에러 필드로 자동 포커스)
   - 최소 터치 타겟 크기 44px × 44px 보장
   - 색상 대비 WCAG AA 기준 준수

2. **사용자 경험 개선**
   - 입력 필드 간 자연스러운 이동 (Tab 키)
   - 에러 메시지 명확성 향상
   - 로딩 상태 표시 (제출 중)
   - 제출 버튼 비활성화 (검증 실패 시)

3. **성능 최적화**
   - 폼 검증 최적화 (debounce 적용 가능)
   - 불필요한 리렌더링 방지
   - 컴포넌트 메모이제이션 (필요시)

**결과물**:
- 접근성 요구사항 충족
- 사용자 경험 최적화 완료
- 성능 최적화 완료

---

### Phase 8: E2E 테스트 작성 (Priority: P1)

**목적**: 사용자 시나리오 기반 E2E 테스트 작성

**작업**:
1. **Playwright 테스트 파일 생성**
   - `tests/timecapsule-create.spec.ts` 생성
   - `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN`을 사용하여 인증 상태 설정

2. **주요 테스트 시나리오**
   - 모든 필수 정보 입력 후 제출 테스트
   - 필수 필드 누락 시 에러 메시지 표시 테스트
   - 잘못된 날짜 입력 시 에러 메시지 표시 테스트
   - 잘못된 참여 인원 수 입력 시 에러 메시지 표시 테스트
   - 결제 페이지로 이동 테스트
   - 입력 데이터가 결제 페이지로 전달되는지 테스트

3. **접근성 테스트**
   - 키보드 네비게이션 테스트
   - 스크린 리더 지원 테스트

**결과물**:
- 완전한 E2E 테스트 스위트
- 자동화된 테스트 실행 가능

---

## Component-Specific Implementation Details

### TimecapsuleCreate Main Component

**구조**:
```typescript
interface TimecapsuleCreateProps {
  // props 없음 (자체적으로 모든 상태 관리)
}
```

**기능**:
- React Hook Form으로 폼 상태 관리
- Zod 스키마로 유효성 검사
- 모든 입력 필드 컴포넌트 통합
- 폼 제출 처리
- 결제 페이지로 데이터 전달

---

### CapsuleNameInput Component

**구조**:
```typescript
interface CapsuleNameInputProps {
  register: UseFormRegister<TimecapsuleFormData>;
  errors: FieldErrors<TimecapsuleFormData>;
  maxLength?: number;
}
```

**기능**:
- 텍스트 입력 필드
- 실시간 글자 수 표시 (선택적)
- 에러 메시지 표시
- React Hook Form과 통합

---

### OpenDatePicker Component

**구조**:
```typescript
interface OpenDatePickerProps {
  register: UseFormRegister<TimecapsuleFormData>;
  errors: FieldErrors<TimecapsuleFormData>;
  setValue: UseFormSetValue<TimecapsuleFormData>;
}
```

**기능**:
- 날짜 선택 인터페이스
- 미래 날짜만 선택 가능
- 과거/오늘 날짜 선택 시 에러 표시
- React Hook Form과 통합

**날짜 선택 구현 옵션**:
- HTML5 `<input type="date">` 사용 (가장 간단)
- 또는 커스텀 날짜 선택 컴포넌트 구현
- 브라우저 호환성 고려

---

### ParticipantCountInput Component

**구조**:
```typescript
interface ParticipantCountInputProps {
  register: UseFormRegister<TimecapsuleFormData>;
  errors: FieldErrors<TimecapsuleFormData>;
}
```

**기능**:
- 숫자 입력 필드 (`type="number"`)
- 1 이상의 정수만 허용
- 0 이하, 음수, 소수점 입력 시 에러 표시
- React Hook Form과 통합

---

### ThemeSelector Component

**구조**:
```typescript
interface ThemeSelectorProps {
  register: UseFormRegister<TimecapsuleFormData>;
  errors: FieldErrors<TimecapsuleFormData>;
  themes: ThemeOption[]; // 테마 옵션 배열
}

interface ThemeOption {
  id: string;
  name: string;
  image?: string; // 테마 미리보기 이미지 (선택적)
}
```

**기능**:
- 테마/디자인 옵션 표시
- 선택 상태 시각적 구분
- React Hook Form과 통합
- Figma 디자인에 따라 그리드 또는 리스트 레이아웃

---

### FormError Component

**구조**:
```typescript
interface FormErrorProps {
  message: string;
  fieldName?: string; // 필드 이름 (접근성용)
}
```

**기능**:
- 에러 메시지 표시
- 접근성 지원 (`aria-live`, `role="alert"`)
- 시각적 스타일링

---

## Form Management Strategy

### React Hook Form + Zod 통합

**설정**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timecapsuleFormSchema } from './schemas/timecapsuleFormSchema';

const form = useForm<TimecapsuleFormData>({
  resolver: zodResolver(timecapsuleFormSchema),
  mode: 'onChange', // 실시간 검증
  defaultValues: {
    capsuleName: '',
    openDate: '',
    participantCount: 1,
    theme: '',
  },
});
```

**장점**:
- 타입 안전성 (TypeScript + Zod)
- 실시간 유효성 검사
- 성능 최적화 (불필요한 리렌더링 방지)
- 에러 메시지 자동 관리

---

### Zod Schema 정의

**스키마 구조**:
```typescript
import { z } from 'zod';

export const timecapsuleFormSchema = z.object({
  capsuleName: z.string()
    .min(1, '캡슐 이름을 입력해주세요')
    .max(50, '캡슐 이름은 50자 이하여야 합니다'), // 선택적
  
  openDate: z.string()
    .min(1, '오픈 예정일을 선택해주세요')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, '오픈 예정일은 오늘 이후의 날짜여야 합니다'),
  
  participantCount: z.number()
    .int('참여 인원 수는 정수여야 합니다')
    .min(1, '참여 인원 수는 1명 이상이어야 합니다'),
  
  theme: z.string()
    .min(1, '캡슐 테마/디자인을 선택해주세요') // 선택적 (필수일 수 있음)
    .optional(),
});

export type TimecapsuleFormData = z.infer<typeof timecapsuleFormSchema>;
```

---

## Data Transfer Strategy

### 결제 페이지로 데이터 전달

**옵션 1: URL 쿼리 파라미터 (간단한 데이터)**
```typescript
const router = useRouter();

const handleSubmit = (data: TimecapsuleFormData) => {
  const queryParams = new URLSearchParams({
    capsuleName: data.capsuleName,
    openDate: data.openDate,
    participantCount: data.participantCount.toString(),
    theme: data.theme || '',
  });
  
  router.push(`/payment?${queryParams.toString()}`);
};
```

**옵션 2: 세션 스토리지 (복잡한 데이터 또는 보안 고려)**
```typescript
const handleSubmit = (data: TimecapsuleFormData) => {
  sessionStorage.setItem('timecapsuleFormData', JSON.stringify(data));
  router.push('/payment');
};
```

**옵션 3: 상태 관리 라이브러리 (전역 상태)**
- Context API 또는 상태 관리 라이브러리 사용
- 결제 페이지에서 상태 읽기

**선택**: 명세서에 따르면 간단한 폼 데이터이므로 **옵션 1 (URL 쿼리 파라미터)** 또는 **옵션 2 (세션 스토리지)** 중 선택 가능. 구현 시 명확히 결정.

---

## Figma MCP Integration

### 디자인 토큰 추출 프로세스

1. **Figma MCP 서버 연결**
   - Figma 링크: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=187-4920&t=GSF9XflGaRp0IBGw-4
   - MCP 서버를 통해 디자인 파일 접근

2. **컴포넌트별 디자인 스펙 추출**
   - 타임캡슐 생성 페이지 전체 레이아웃
   - 각 입력 필드의 디자인 스펙
   - 테마/디자인 선택 UI 스펙
   - 에러 메시지 스타일
   - 버튼 스타일
   - 소수점 값 반올림 처리

3. **에셋 추출**
   - 테마/디자인 미리보기 이미지 (있는 경우)
   - 로컬 호스트 소스가 제공되면 직접 사용

4. **디자인 토큰 적용**
   - `src/commons/styles`에서 디자인 토큰 import
   - CSS Module에서 CSS 변수로 활용
   - 중복 선언 금지

---

## Testing Strategy

### E2E 테스트 (Playwright)

**테스트 파일**: `tests/timecapsule-create.spec.ts`

**주요 테스트 시나리오**:
1. **정상 플로우 테스트**
   - 모든 필수 정보 입력
   - 폼 제출
   - 결제 페이지로 이동 확인
   - 입력 데이터 전달 확인

2. **유효성 검사 테스트**
   - 필수 필드 누락 시 에러 메시지 표시
   - 잘못된 날짜 입력 시 에러 메시지 표시
   - 잘못된 참여 인원 수 입력 시 에러 메시지 표시

3. **접근성 테스트**
   - 키보드 네비게이션
   - 스크린 리더 지원

**인증 토큰 설정**:
```typescript
import { test } from '@playwright/test';

test.use({
  storageState: {
    cookies: [],
    origins: [{
      origin: 'http://localhost:3000',
      localStorage: [{
        name: 'timeEgg_accessToken',
        value: process.env.NEXT_PUBLIC_DEV_TOKEN || '',
      }],
    }],
  },
});
```

---

## Risk Mitigation

### 위험 요소 및 대응 방안

1. **날짜 선택 인터페이스 브라우저 호환성**
   - **위험**: HTML5 `<input type="date">`의 브라우저별 차이
   - **대응**: 주요 브라우저 테스트, 필요시 폴백 제공

2. **폼 데이터 전달 실패**
   - **위험**: 결제 페이지로 데이터 전달 실패
   - **대응**: 세션 스토리지 백업, 에러 처리

3. **Figma 디자인과 실제 구현 차이**
   - **위험**: 디자인 스펙 해석 오류
   - **대응**: Figma MCP를 통한 정확한 스펙 추출, 단계별 디자인 검증

4. **성능 이슈**
   - **위험**: 실시간 검증으로 인한 성능 저하
   - **대응**: React Hook Form의 최적화 활용, debounce 적용 (필요시)

---

## Success Criteria

### 기능적 완성도
- ✅ 모든 입력 필드 구현 완료
- ✅ 폼 유효성 검사 정상 작동
- ✅ 결제 페이지로 데이터 전달 성공
- ✅ 에러 메시지 정상 표시

### 기술적 품질
- ✅ TypeScript 컴파일 에러 0%
- ✅ 모든 컴포넌트의 접근성 요구사항 준수
- ✅ 페이지 로드 시간 2초 이하
- ✅ 폼 검증 수행 시간 200ms 이하

### 디자인 정확도
- ✅ Figma 디자인과 100% 일치
- ✅ 디자인 토큰 기반 일관된 스타일링
- ✅ 375px 기준 고정 레이아웃 준수

---

## Next Steps

다음 단계로 `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록을 생성합니다.
