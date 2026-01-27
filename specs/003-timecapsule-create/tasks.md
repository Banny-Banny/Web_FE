# 타임캡슐 생성 페이지 작업 목록

## 📋 개요

이 문서는 타임캡슐 생성 페이지 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**총 작업 수**: 34개  
**우선순위**: P1 (필수) → P2 (중요) → P3 (선택)

---

## 🎯 Phase 1: 프로젝트 구조 및 타입 정의

### T001: 프로젝트 디렉토리 구조 생성
**목표**: 타임캡슐 생성 페이지를 위한 디렉토리 구조 생성
**소요시간**: 10분
**의존성**: 없음

**작업 내용**:
1. `src/components/TimecapsuleCreate/` 디렉토리 생성
2. 하위 디렉토리 생성:
   - `hooks/`
   - `components/`
   - `schemas/`

**생성할 디렉토리**:
- `src/components/TimecapsuleCreate/`
- `src/components/TimecapsuleCreate/hooks/`
- `src/components/TimecapsuleCreate/components/`
- `src/components/TimecapsuleCreate/schemas/`

**완료 기준**:
- [x] 모든 디렉토리가 생성됨
- [x] 디렉토리 구조가 plan.md와 일치함

---

### T002: React Hook Form 및 Zod 의존성 확인
**목표**: 필요한 라이브러리 설치 확인 및 설치 (필요시)
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `package.json`에서 `react-hook-form`, `zod`, `@hookform/resolvers` 확인
2. 설치되지 않은 경우 설치:
   ```bash
   npm install react-hook-form zod @hookform/resolvers
   ```

**확인할 파일**:
- `package.json`

**완료 기준**:
- [x] react-hook-form이 설치됨
- [x] zod가 설치됨
- [x] @hookform/resolvers가 설치됨

---

### T003: 타임캡슐 폼 타입 정의
**목표**: 폼 데이터 및 관련 타입 정의
**소요시간**: 20분
**의존성**: T001

**작업 내용**:
1. `src/components/TimecapsuleCreate/types.ts` 파일 생성
2. `TimecapsuleFormData` 인터페이스 정의:
   - `capsuleName: string`
   - `openDate: string`
   - `participantCount: number`
   - `theme: string | undefined`
3. 에러 메시지 타입 정의
4. 결제 페이지로 전달할 데이터 타입 정의

**생성할 파일**:
- `src/components/TimecapsuleCreate/types.ts`

**완료 기준**:
- [x] `TimecapsuleFormData` 인터페이스가 정의됨
- [x] 모든 필드 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

---

### T004: Zod 스키마 정의
**목표**: 폼 유효성 검사를 위한 Zod 스키마 정의
**소요시간**: 30분
**의존성**: T002, T003

**작업 내용**:
1. `src/components/TimecapsuleCreate/schemas/timecapsuleFormSchema.ts` 파일 생성
2. Zod 스키마 정의:
   - 캡슐 이름: 필수, 최대 50자 (선택적)
   - 오픈 예정일: 필수, 미래 날짜만 허용 (오늘 이후)
   - 참여 인원 수: 필수, 1 이상의 정수
   - 캡슐 테마/디자인: 선택적 (필수일 수 있음)
3. 에러 메시지 정의
4. `TimecapsuleFormData` 타입 export (z.infer 사용)

**생성할 파일**:
- `src/components/TimecapsuleCreate/schemas/timecapsuleFormSchema.ts`

**완료 기준**:
- [x] Zod 스키마가 정의됨
- [x] 모든 필드에 대한 유효성 검사 규칙이 포함됨
- [x] 에러 메시지가 명확하게 정의됨
- [x] TypeScript 타입이 올바르게 추론됨

---

### T004-1: Figma MCP 서버를 통한 디자인 스펙 추출
**목표**: 타임캡슐 생성 페이지 전체 및 각 컴포넌트의 정확한 디자인 스펙 확인
**소요시간**: 1시간
**의존성**: 없음

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=187-4920&t=GSF9XflGaRp0IBGw-4

**작업 내용**:
1. Figma MCP 서버를 통해 타임캡슐 생성 페이지 디자인 파일 접근
2. 각 컴포넌트의 Figma 프레임 선택 및 디자인 스펙 추출:
   - 타임캡슐 생성 페이지 전체 레이아웃
   - 캡슐 이름 입력 필드 디자인 스펙
   - 오픈 예정일 선택 필드 디자인 스펙
   - 참여 인원 수 입력 필드 디자인 스펙
   - 캡슐 테마/디자인 선택 UI 스펙
   - 에러 메시지 스타일
   - 제출 버튼 스타일
3. 디자인 토큰 추출:
   - 색상 (Color)
   - 간격 (Spacing)
   - 타이포그래피 (Typography)
   - 반경 (Radius)
4. 컴포넌트 크기 및 레이아웃 스펙 확인 (375px 기준)
5. 에셋 (이미지, SVG) 확인 및 추출 (테마/디자인 미리보기 이미지 등)
6. 소수점 값 반올림 처리
7. `src/commons/styles`에 정의된 디자인 토큰과 매핑

**결과물**:
- 컴포넌트별 디자인 스펙 문서
- 디자인 토큰 매핑 테이블
- CSS Module에서 사용할 CSS 변수 목록

**완료 기준**:
- [x] 타임캡슐 생성 페이지 전체 디자인 스펙 추출 완료
- [x] 모든 컴포넌트의 Figma 디자인 스펙 추출 완료
- [x] 디자인 토큰 매핑 완료
- [x] 에셋 확인 및 추출 완료

---

## 🎯 Phase 2: 기본 UI 컴포넌트 구현 (Priority: P1)

### [US1] [US2] CapsuleNameInput 컴포넌트

#### T005 [P] [US1] [US2]: CapsuleNameInput 타입 정의
**목표**: CapsuleNameInput 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T003

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/CapsuleNameInput/types.ts` 파일 생성
2. `CapsuleNameInputProps` 인터페이스 정의:
   - `register: UseFormRegister<TimecapsuleFormData>`
   - `errors: FieldErrors<TimecapsuleFormData>`
   - `maxLength?: number`

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/CapsuleNameInput/types.ts`

**완료 기준**:
- [x] `CapsuleNameInputProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T006 [P] [US1] [US2]: CapsuleNameInput CSS Module 스타일 작성
**목표**: CapsuleNameInput 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T005, T004-1

**작업 내용**:
1. Figma MCP를 통해 CapsuleNameInput 컴포넌트의 디자인 스펙 추출
2. `src/components/TimecapsuleCreate/components/CapsuleNameInput/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 입력 필드 기본 스타일 (크기, 색상, 간격, 반경 등)
   - 에러 상태 스타일
   - 포커스 상태 스타일
4. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
5. Figma에서 추출한 수치 값 반올림 적용
6. 375px 기준 고정 레이아웃
7. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/CapsuleNameInput/styles.module.css`

**완료 기준**:
- [x] 입력 필드 스타일이 정의됨
- [x] 에러 상태 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T007 [US1] [US2]: CapsuleNameInput 컴포넌트 구현
**목표**: 캡슐 이름 입력 필드 컴포넌트 구현
**소요시간**: 30분
**의존성**: T005, T006

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/CapsuleNameInput/index.tsx` 파일 생성
2. React Hook Form의 `register` 사용
3. 에러 메시지 표시 로직
4. 실시간 글자 수 표시 (선택적, Figma 디자인에 따라 결정)
5. CSS Module 스타일 적용 (T006에서 작성한 스타일)
6. 접근성 속성 추가 (`label`, `aria-label`)
7. Figma 디자인과 일치하는 레이아웃 및 구조 구현

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/CapsuleNameInput/index.tsx`

**완료 기준**:
- [x] CapsuleNameInput 컴포넌트가 정상적으로 렌더링됨
- [x] React Hook Form과 통합됨
- [x] 에러 메시지가 표시됨
- [x] 접근성 속성이 적용됨

---

### [US1] [US2] OpenDatePicker 컴포넌트

#### T008 [P] [US1] [US2]: OpenDatePicker 타입 정의
**목표**: OpenDatePicker 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T003

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/OpenDatePicker/types.ts` 파일 생성
2. `OpenDatePickerProps` 인터페이스 정의:
   - `register: UseFormRegister<TimecapsuleFormData>`
   - `errors: FieldErrors<TimecapsuleFormData>`
   - `setValue: UseFormSetValue<TimecapsuleFormData>`

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/OpenDatePicker/types.ts`

**완료 기준**:
- [x] `OpenDatePickerProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T009 [P] [US1] [US2]: OpenDatePicker CSS Module 스타일 작성
**목표**: OpenDatePicker 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T008, T004-1

**작업 내용**:
1. Figma MCP를 통해 OpenDatePicker 컴포넌트의 디자인 스펙 추출
2. `src/components/TimecapsuleCreate/components/OpenDatePicker/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 날짜 입력 필드 기본 스타일 (크기, 색상, 간격, 반경 등)
   - 에러 상태 스타일
   - 포커스 상태 스타일
4. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
5. Figma에서 추출한 수치 값 반올림 적용
6. 375px 기준 고정 레이아웃
7. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/OpenDatePicker/styles.module.css`

**완료 기준**:
- [x] 날짜 입력 필드 스타일이 정의됨
- [x] 에러 상태 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T010 [US1] [US2]: OpenDatePicker 컴포넌트 구현
**목표**: 오픈 예정일 선택 필드 컴포넌트 구현
**소요시간**: 40분
**의존성**: T008, T009

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/OpenDatePicker/index.tsx` 파일 생성
2. HTML5 `<input type="date">` 사용
3. `min` 속성으로 오늘 이후 날짜만 선택 가능하도록 제한
4. React Hook Form의 `register` 및 `setValue` 사용
5. 과거/오늘 날짜 선택 시 에러 표시 로직
6. CSS Module 스타일 적용 (T009에서 작성한 스타일)
7. 접근성 속성 추가 (`label`, `aria-label`)
8. Figma 디자인과 일치하는 레이아웃 및 구조 구현

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/OpenDatePicker/index.tsx`

**완료 기준**:
- [x] OpenDatePicker 컴포넌트가 정상적으로 렌더링됨
- [x] React Hook Form과 통합됨
- [x] 미래 날짜만 선택 가능함
- [x] 과거/오늘 날짜 선택 시 에러 표시됨
- [x] 접근성 속성이 적용됨

---

### [US1] [US2] ParticipantCountInput 컴포넌트

#### T011 [P] [US1] [US2]: ParticipantCountInput 타입 정의
**목표**: ParticipantCountInput 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: T003

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/ParticipantCountInput/types.ts` 파일 생성
2. `ParticipantCountInputProps` 인터페이스 정의:
   - `register: UseFormRegister<TimecapsuleFormData>`
   - `errors: FieldErrors<TimecapsuleFormData>`

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ParticipantCountInput/types.ts`

**완료 기준**:
- [x] `ParticipantCountInputProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T012 [P] [US1] [US2]: ParticipantCountInput CSS Module 스타일 작성
**목표**: ParticipantCountInput 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T011, T004-1

**작업 내용**:
1. Figma MCP를 통해 ParticipantCountInput 컴포넌트의 디자인 스펙 추출
2. `src/components/TimecapsuleCreate/components/ParticipantCountInput/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 숫자 입력 필드 기본 스타일 (크기, 색상, 간격, 반경 등)
   - 에러 상태 스타일
   - 포커스 상태 스타일
4. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
5. Figma에서 추출한 수치 값 반올림 적용
6. 375px 기준 고정 레이아웃
7. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ParticipantCountInput/styles.module.css`

**완료 기준**:
- [x] 숫자 입력 필드 스타일이 정의됨
- [x] 에러 상태 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T013 [US1] [US2]: ParticipantCountInput 컴포넌트 구현
**목표**: 참여 인원 수 입력 필드 컴포넌트 구현
**소요시간**: 30분
**의존성**: T011, T012

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/ParticipantCountInput/index.tsx` 파일 생성
2. HTML5 `<input type="number">` 사용
3. `min="1"` 속성 설정
4. React Hook Form의 `register` 사용
5. 0 이하, 음수, 소수점 입력 시 에러 표시 로직
6. CSS Module 스타일 적용 (T012에서 작성한 스타일)
7. 접근성 속성 추가 (`label`, `aria-label`)
8. Figma 디자인과 일치하는 레이아웃 및 구조 구현

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ParticipantCountInput/index.tsx`

**완료 기준**:
- [x] ParticipantCountInput 컴포넌트가 정상적으로 렌더링됨
- [x] React Hook Form과 통합됨
- [x] 1 이상의 정수만 입력 가능함
- [x] 잘못된 값 입력 시 에러 표시됨
- [x] 접근성 속성이 적용됨

---

### [US3] ThemeSelector 컴포넌트

#### T014 [P] [US3]: ThemeSelector 타입 정의
**목표**: ThemeSelector 컴포넌트의 Props 타입 정의
**소요시간**: 15분
**의존성**: T003

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/ThemeSelector/types.ts` 파일 생성
2. `ThemeSelectorProps` 인터페이스 정의:
   - `register: UseFormRegister<TimecapsuleFormData>`
   - `errors: FieldErrors<TimecapsuleFormData>`
   - `themes: ThemeOption[]`
3. `ThemeOption` 인터페이스 정의:
   - `id: string`
   - `name: string`
   - `image?: string`

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ThemeSelector/types.ts`

**완료 기준**:
- [x] `ThemeSelectorProps` 인터페이스가 정의됨
- [x] `ThemeOption` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T015 [P] [US3]: ThemeSelector CSS Module 스타일 작성
**목표**: ThemeSelector 컴포넌트의 스타일 정의
**소요시간**: 45분
**의존성**: T014, T004-1

**작업 내용**:
1. Figma MCP를 통해 ThemeSelector 컴포넌트의 디자인 스펙 추출
2. 테마/디자인 미리보기 이미지 에셋 추출 (있는 경우)
3. `src/components/TimecapsuleCreate/components/ThemeSelector/styles.module.css` 파일 생성
4. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 테마 옵션 그리드/리스트 레이아웃 스타일 (Figma 디자인에 따라 결정)
   - 선택 상태 스타일 (시각적 구분)
   - 에러 상태 스타일
   - 테마 미리보기 이미지 스타일 (있는 경우)
5. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
6. Figma에서 추출한 수치 값 반올림 적용
7. 375px 기준 고정 레이아웃
8. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ThemeSelector/styles.module.css`

**완료 기준**:
- [x] 테마 옵션 레이아웃 스타일이 정의됨
- [x] 선택 상태 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T016 [US3]: ThemeSelector 컴포넌트 구현
**목표**: 캡슐 테마/디자인 선택 필드 컴포넌트 구현
**소요시간**: 1시간
**의존성**: T014, T015

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/ThemeSelector/index.tsx` 파일 생성
2. Figma MCP에서 추출한 테마/디자인 미리보기 이미지 에셋 사용 (있는 경우)
3. 테마 옵션 배열을 받아서 렌더링
4. React Hook Form의 `register` 사용
5. 선택 상태 시각적 구분 (Figma 디자인 기준)
6. CSS Module 스타일 적용 (T015에서 작성한 스타일)
7. 접근성 속성 추가 (`label`, `aria-label`, `role="radiogroup"`)
8. Figma 디자인과 일치하는 레이아웃 및 구조 구현 (그리드 또는 리스트)

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/ThemeSelector/index.tsx`

**완료 기준**:
- [x] ThemeSelector 컴포넌트가 정상적으로 렌더링됨
- [x] React Hook Form과 통합됨
- [x] 테마 옵션이 표시됨
- [x] 선택 상태가 시각적으로 구분됨
- [x] 접근성 속성이 적용됨

---

### [US1] [US2] FormError 컴포넌트

#### T017 [P] [US1] [US2]: FormError 타입 정의
**목표**: FormError 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: 없음

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/FormError/types.ts` 파일 생성
2. `FormErrorProps` 인터페이스 정의:
   - `message: string`
   - `fieldName?: string`

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/FormError/types.ts`

**완료 기준**:
- [x] `FormErrorProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

---

#### T018 [P] [US1] [US2]: FormError CSS Module 스타일 작성
**목표**: FormError 컴포넌트의 스타일 정의
**소요시간**: 20분
**의존성**: T017, T004-1

**작업 내용**:
1. Figma MCP를 통해 FormError 컴포넌트의 디자인 스펙 추출
2. `src/components/TimecapsuleCreate/components/FormError/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 에러 메시지 기본 스타일 (색상, 타이포그래피, 간격 등)
4. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
5. Figma에서 추출한 수치 값 반올림 적용
6. 375px 기준 고정 레이아웃
7. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/FormError/styles.module.css`

**완료 기준**:
- [x] 에러 메시지 스타일이 정의됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T019 [US1] [US2]: FormError 컴포넌트 구현
**목표**: 에러 메시지 표시 컴포넌트 구현
**소요시간**: 20분
**의존성**: T017, T018

**작업 내용**:
1. `src/components/TimecapsuleCreate/components/FormError/index.tsx` 파일 생성
2. 에러 메시지 렌더링
3. 접근성 속성 추가 (`aria-live`, `role="alert"`)
4. CSS Module 스타일 적용

**생성할 파일**:
- `src/components/TimecapsuleCreate/components/FormError/index.tsx`

**완료 기준**:
- [x] FormError 컴포넌트가 정상적으로 렌더링됨
- [x] 에러 메시지가 표시됨
- [x] 접근성 속성이 적용됨

---

## 🎯 Phase 3: 폼 관리 및 유효성 검사 구현 (Priority: P1)

### [US1] [US2] 폼 관리 훅

#### T020 [US1] [US2]: useTimecapsuleForm 훅 구현
**목표**: React Hook Form + Zod를 활용한 폼 상태 관리 훅 구현
**소요시간**: 45분
**의존성**: T002, T004

**작업 내용**:
1. `src/components/TimecapsuleCreate/hooks/useTimecapsuleForm.ts` 파일 생성
2. React Hook Form의 `useForm` 설정:
   - `resolver: zodResolver(timecapsuleFormSchema)`
   - `mode: 'onChange'` (실시간 검증)
   - `defaultValues` 설정
3. 폼 제출 핸들러 구현
4. 에러 상태 관리
5. 폼 제출 시 결제 페이지로 이동 로직 (URL 쿼리 파라미터 또는 세션 스토리지)

**생성할 파일**:
- `src/components/TimecapsuleCreate/hooks/useTimecapsuleForm.ts`

**완료 기준**:
- [x] useTimecapsuleForm 훅이 정상적으로 동작함
- [x] React Hook Form과 Zod가 통합됨
- [x] 실시간 유효성 검사가 작동함
- [x] 폼 제출 핸들러가 구현됨
- [x] 결제 페이지로 이동 로직이 구현됨

---

#### T021 [US1] [US2]: useFormValidation 훅 구현
**목표**: 실시간 유효성 검사 및 에러 메시지 관리 훅 구현
**소요시간**: 30분
**의존성**: T020

**작업 내용**:
1. `src/components/TimecapsuleCreate/hooks/useFormValidation.ts` 파일 생성
2. 필드별 에러 메시지 관리
3. 전체 폼 검증 로직
4. 첫 번째 에러 필드로 자동 스크롤 로직
5. 에러 메시지 표시 로직

**생성할 파일**:
- `src/components/TimecapsuleCreate/hooks/useFormValidation.ts`

**완료 기준**:
- [x] useFormValidation 훅이 정상적으로 동작함
- [x] 필드별 에러 메시지가 관리됨
- [x] 전체 폼 검증이 작동함
- [x] 첫 번째 에러 필드로 자동 스크롤됨

---

## 🎯 Phase 4: 메인 페이지 컴포넌트 구현 (Priority: P1)

### [US1] TimecapsuleCreate 메인 컴포넌트

#### T022 [US1]: TimecapsuleCreate CSS Module 스타일 작성
**목표**: TimecapsuleCreate 메인 컴포넌트의 레이아웃 스타일 정의
**소요시간**: 45분
**의존성**: T004-1

**작업 내용**:
1. Figma MCP를 통해 타임캡슐 생성 페이지 전체 레이아웃 디자인 스펙 추출
2. `src/components/TimecapsuleCreate/styles.module.css` 파일 생성
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 작성:
   - 전체 레이아웃 스타일 정의
   - 입력 필드 간 간격 (Figma 디자인 기준)
   - 제출 버튼 위치 및 스타일
   - 섹션 간 간격
4. CSS 변수를 사용한 디자인 토큰 적용 (`var(--color-*)`, `var(--spacing-*)` 등)
5. Figma에서 추출한 수치 값 반올림 적용
6. 375px 기준 고정 레이아웃
7. 하드코딩된 색상값(hex/rgb/hsl) 사용 금지, CSS 변수만 사용

**생성할 파일**:
- `src/components/TimecapsuleCreate/styles.module.css`

**완료 기준**:
- [x] 레이아웃 스타일이 정의됨
- [x] 입력 필드 간 간격이 설정됨
- [x] 디자인 토큰이 올바르게 사용됨

---

#### T023 [US1]: TimecapsuleCreate 메인 컴포넌트 구현
**목표**: 모든 입력 필드 컴포넌트를 통합한 메인 컴포넌트 구현
**소요시간**: 1시간
**의존성**: T007, T010, T013, T016, T019, T020, T021, T022

**작업 내용**:
1. `src/components/TimecapsuleCreate/index.tsx` 파일 생성
2. Figma MCP에서 추출한 전체 레이아웃 디자인 스펙 참조
3. TimeCapsuleHeader 컴포넌트 사용 (공용 컴포넌트)
4. useTimecapsuleForm 훅 사용
5. 모든 입력 필드 컴포넌트 통합:
   - CapsuleNameInput
   - OpenDatePicker
   - ParticipantCountInput
   - ThemeSelector
6. FormError 컴포넌트로 에러 메시지 표시
7. Button 컴포넌트로 제출 버튼 (공용 컴포넌트)
8. CSS Module 스타일 적용 (T022에서 작성한 스타일)
9. 폼 제출 처리
10. Figma 디자인과 일치하는 전체 레이아웃 및 컴포넌트 배치 구현

**생성할 파일**:
- `src/components/TimecapsuleCreate/index.tsx`

**완료 기준**:
- [x] TimecapsuleCreate 컴포넌트가 정상적으로 렌더링됨
- [x] 모든 입력 필드가 표시됨
- [x] 폼 제출 버튼이 표시됨
- [x] 에러 메시지가 표시됨
- [x] 폼 제출이 정상적으로 동작함

---

#### T024 [US1]: 라우팅 페이지 구현
**목표**: Next.js App Router를 사용한 라우팅 페이지 구현
**소요시간**: 15분
**의존성**: T023

**작업 내용**:
1. `src/app/(main)/timecapsule/create/page.tsx` 파일 생성
2. TimecapsuleCreate 컴포넌트 import 및 렌더링
3. 라우팅 전용 규칙 준수 (컴포넌트 import만)

**생성할 파일**:
- `src/app/(main)/timecapsule/create/page.tsx`

**완료 기준**:
- [x] 라우팅 페이지가 정상적으로 생성됨
- [x] `/timecapsule/create` 경로에서 페이지가 표시됨
- [x] TimecapsuleCreate 컴포넌트가 렌더링됨

---

## 🎯 Phase 5: 스타일링 및 디자인 적용 (Priority: P1)

### T025: Figma 디자인 최종 검증 및 스타일 미세 조정
**목표**: 구현된 컴포넌트와 Figma 디자인 최종 비교 및 미세 조정
**소요시간**: 1시간
**의존성**: T023

**Figma 디자인 링크**: https://www.figma.com/design/KJVVnKITMTcrf9qIS7chiy/%ED%83%80%EC%9E%84%EC%BA%A1%EC%8A%90---%EC%9D%B4%EC%8A%A4%ED%84%B0%EC%97%90%EA%B7%B8--%EB%B3%B5%EC%82%AC-?node-id=187-4920&t=GSF9XflGaRp0IBGw-4

**작업 내용**:
1. Figma MCP를 통해 타임캡슐 생성 페이지 전체 디자인 재확인
2. 구현된 컴포넌트와 Figma 디자인 pixel-perfect 비교
3. 차이점 식별 및 수정 사항 정리
4. 디자인 토큰 매핑 재확인
5. 소수점 값 반올림 재확인

**결과물**:
- 디자인 검증 리포트
- 수정 사항 목록

**완료 기준**:
- [x] 모든 컴포넌트가 Figma 디자인과 pixel-perfect 수준으로 일치함
- [x] 디자인 토큰이 올바르게 사용됨

---

### T026 [P]: 모든 컴포넌트 CSS Module 스타일 미세 조정
**목표**: Figma 디자인과 정확히 일치하도록 모든 컴포넌트 스타일 미세 조정
**소요시간**: 1시간
**의존성**: T025

**작업 내용**:
1. T025에서 식별한 수정 사항 반영
2. 각 컴포넌트의 `styles.module.css` 파일 미세 조정:
   - CapsuleNameInput
   - OpenDatePicker
   - ParticipantCountInput
   - ThemeSelector
   - FormError
   - TimecapsuleCreate (메인)
3. Figma 디자인과 pixel-perfect 수준으로 일치하도록 스타일 최종 조정
4. CSS 변수를 사용하여 디자인 토큰 참조 (이미 적용됨, 재확인)
5. 소수점 값 반올림 재확인
6. 375px 기준 고정 레이아웃 유지

**수정할 파일**:
- `src/components/TimecapsuleCreate/components/CapsuleNameInput/styles.module.css`
- `src/components/TimecapsuleCreate/components/OpenDatePicker/styles.module.css`
- `src/components/TimecapsuleCreate/components/ParticipantCountInput/styles.module.css`
- `src/components/TimecapsuleCreate/components/ThemeSelector/styles.module.css`
- `src/components/TimecapsuleCreate/components/FormError/styles.module.css`
- `src/components/TimecapsuleCreate/styles.module.css`

**완료 기준**:
- [x] 모든 컴포넌트 스타일이 Figma 디자인과 일치함
- [x] 디자인 토큰이 올바르게 사용됨
- [x] 375px 기준 고정 레이아웃이 유지됨

---

## 🎯 Phase 6: 접근성 및 사용자 경험 개선 (Priority: P2)

### [US2] 접근성 개선

#### T027 [US2]: 모든 입력 필드 접근성 속성 추가
**목표**: 접근성 요구사항 충족
**소요시간**: 30분
**의존성**: T007, T010, T013, T016, T019

**작업 내용**:
1. 모든 입력 필드에 적절한 라벨 추가 (`<label>` 또는 `aria-label`)
2. 에러 메시지에 `aria-live` 속성 추가
3. 키보드 네비게이션 지원 확인
4. 포커스 관리 (에러 필드로 자동 포커스)
5. 최소 터치 타겟 크기 44px × 44px 보장
6. 색상 대비 WCAG AA 기준 준수

**수정할 파일**:
- `src/components/TimecapsuleCreate/components/CapsuleNameInput/index.tsx`
- `src/components/TimecapsuleCreate/components/OpenDatePicker/index.tsx`
- `src/components/TimecapsuleCreate/components/ParticipantCountInput/index.tsx`
- `src/components/TimecapsuleCreate/components/ThemeSelector/index.tsx`
- `src/components/TimecapsuleCreate/components/FormError/index.tsx`

**완료 기준**:
- [x] 모든 입력 필드에 라벨이 추가됨
- [x] 에러 메시지에 aria-live 속성이 추가됨
- [x] 키보드 네비게이션이 지원됨
- [x] 터치 타겟 크기가 보장됨
- [x] 색상 대비가 WCAG AA 기준을 만족함

---

#### T028 [US2]: 사용자 경험 개선
**목표**: 사용자 경험 최적화
**소요시간**: 30분
**의존성**: T023

**작업 내용**:
1. 입력 필드 간 자연스러운 이동 (Tab 키)
2. 에러 메시지 명확성 향상
3. 로딩 상태 표시 (제출 중)
4. 제출 버튼 비활성화 (검증 실패 시)
5. 첫 번째 에러 필드로 자동 스크롤 개선

**수정할 파일**:
- `src/components/TimecapsuleCreate/index.tsx`
- `src/components/TimecapsuleCreate/hooks/useTimecapsuleForm.ts`

**완료 기준**:
- [x] 입력 필드 간 이동이 자연스러움
- [x] 에러 메시지가 명확함
- [x] 로딩 상태가 표시됨
- [x] 제출 버튼이 적절히 비활성화됨

---

#### T029: 성능 최적화
**목표**: 폼 검증 및 렌더링 성능 최적화
**소요시간**: 20분
**의존성**: T020, T021

**작업 내용**:
1. React Hook Form의 최적화 활용 확인
2. 불필요한 리렌더링 방지
3. 컴포넌트 메모이제이션 (필요시)
4. 폼 검증 최적화 (debounce 적용 가능)

**수정할 파일**:
- `src/components/TimecapsuleCreate/hooks/useTimecapsuleForm.ts`
- `src/components/TimecapsuleCreate/index.tsx`

**완료 기준**:
- [x] 불필요한 리렌더링이 방지됨
- [x] 폼 검증 성능이 최적화됨

---

## 🎯 Phase 7: E2E 테스트 작성 (Priority: P1)

### [US1] [US2] E2E 테스트

#### T030 [US1] [US2]: Playwright 테스트 파일 생성
**목표**: 타임캡슐 생성 페이지 E2E 테스트 파일 생성
**소요시간**: 20분
**의존성**: T024

**작업 내용**:
1. `tests/timecapsule-create.spec.ts` 파일 생성
2. `.env.local`의 `NEXT_PUBLIC_DEV_TOKEN`을 사용하여 인증 상태 설정
3. 기본 테스트 구조 작성

**생성할 파일**:
- `tests/timecapsule-create.spec.ts`

**완료 기준**:
- [x] Playwright 테스트 파일이 생성됨
- [x] 인증 토큰이 설정됨
- [x] 기본 테스트 구조가 작성됨

---

#### T031 [US1]: 정상 플로우 테스트 작성
**목표**: 모든 필수 정보 입력 후 제출하는 정상 플로우 테스트
**소요시간**: 30분
**의존성**: T030

**작업 내용**:
1. 타임캡슐 생성 페이지 접근 테스트
2. 모든 필수 정보 입력 테스트:
   - 캡슐 이름 입력
   - 오픈 예정일 선택 (미래 날짜)
   - 참여 인원 수 입력 (1 이상)
   - 캡슐 테마/디자인 선택
3. 폼 제출 테스트
4. 결제 페이지로 이동 확인
5. 입력 데이터 전달 확인

**수정할 파일**:
- `tests/timecapsule-create.spec.ts`

**완료 기준**:
- [x] 정상 플로우 테스트가 작성됨
- [x] 모든 필수 정보 입력 테스트가 통과함
- [x] 결제 페이지로 이동 테스트가 통과함
- [x] 입력 데이터 전달 테스트가 통과함

---

#### T032 [US1] [US2]: 유효성 검사 테스트 작성
**목표**: 폼 유효성 검사 테스트 작성
**소요시간**: 45분
**의존성**: T030

**작업 내용**:
1. 필수 필드 누락 시 에러 메시지 표시 테스트
2. 잘못된 날짜 입력 시 에러 메시지 표시 테스트:
   - 과거 날짜 선택
   - 오늘 날짜 선택
3. 잘못된 참여 인원 수 입력 시 에러 메시지 표시 테스트:
   - 0 이하 값 입력
   - 음수 값 입력
   - 소수점 값 입력
4. 여러 필드에 에러가 있을 때 모든 에러 메시지 표시 테스트

**수정할 파일**:
- `tests/timecapsule-create.spec.ts`

**완료 기준**:
- [x] 모든 유효성 검사 테스트가 작성됨
- [x] 에러 메시지 표시 테스트가 통과함
- [x] 검증 실패 시 결제 페이지로 이동하지 않는 테스트가 통과함

---

#### T033 [US2]: 접근성 테스트 작성
**목표**: 접근성 요구사항 테스트 작성
**소요시간**: 30분
**의존성**: T030

**작업 내용**:
1. 키보드 네비게이션 테스트
2. 스크린 리더 지원 테스트 (선택적)
3. 터치 타겟 크기 테스트
4. 색상 대비 테스트

**수정할 파일**:
- `tests/timecapsule-create.spec.ts`

**완료 기준**:
- [x] 접근성 테스트가 작성됨
- [x] 키보드 네비게이션 테스트가 통과함

---

## 📊 작업 요약

### 총 작업 수
- **총 33개 작업**

### 사용자 스토리별 작업 수
- **US1 (기본 정보 입력)**: 18개 작업
- **US2 (실수 확인 및 수정)**: 15개 작업
- **US3 (테마/디자인 선택)**: 3개 작업

### Phase별 작업 수
- **Phase 1 (프로젝트 구조 및 타입 정의)**: 5개 작업 (T001~T004, T004-1)
- **Phase 2 (기본 UI 컴포넌트 구현)**: 15개 작업
- **Phase 3 (폼 관리 및 유효성 검사)**: 2개 작업
- **Phase 4 (메인 페이지 컴포넌트)**: 3개 작업
- **Phase 5 (스타일링 및 디자인 적용)**: 2개 작업
- **Phase 6 (접근성 및 UX 개선)**: 3개 작업
- **Phase 7 (E2E 테스트)**: 4개 작업

### 병렬 처리 가능한 작업
다음 작업들은 병렬 처리 가능합니다:
- **T005, T008, T011, T014, T017**: 타입 정의 작업 (서로 다른 컴포넌트)
- **T006, T009, T012, T015, T018**: CSS Module 스타일 작성 (서로 다른 컴포넌트, 단 T004-1 완료 후)
- **T026**: 모든 컴포넌트 스타일 미세 조정 (병렬 처리 가능)

### 의존성 순서
1. **T004-1 완료** → Phase 2의 CSS Module 스타일 작성 작업 시작 가능
2. **Phase 1 완료** → Phase 2 시작 가능
3. **Phase 2 완료** → Phase 3 시작 가능
4. **Phase 3 완료** → Phase 4 시작 가능
5. **Phase 4 완료** → Phase 5 시작 가능
6. **Phase 5 완료** → Phase 6 시작 가능
7. **Phase 6 완료** → Phase 7 시작 가능

---

## 🚀 구현 전략

### MVP 범위
**최소 기능 제품 (MVP)**은 다음 Phase까지 포함:
- Phase 1: 프로젝트 구조 및 타입 정의
- Phase 2: 기본 UI 컴포넌트 구현
- Phase 3: 폼 관리 및 유효성 검사
- Phase 4: 메인 페이지 컴포넌트 구현

**Phase 5 (스타일링 및 디자인 적용)**, **Phase 6 (접근성 및 UX 개선)**, **Phase 7 (E2E 테스트)**는 MVP 이후 개선 사항으로 분류됩니다.

### 점진적 전달
1. **1차 전달**: Phase 1 + Phase 2 (기본 구조 + UI 컴포넌트)
2. **2차 전달**: Phase 3 + Phase 4 (폼 관리 + 메인 페이지)
3. **3차 전달**: Phase 5 (스타일링 및 디자인 적용)
4. **4차 전달**: Phase 6 (접근성 및 UX 개선)
5. **5차 전달**: Phase 7 (E2E 테스트)

### 독립적 테스트 기준
각 Phase는 완료 후 독립적으로 테스트 가능합니다:
- **Phase 1 완료**: 타입 정의 및 Zod 스키마가 완료됨
- **Phase 2 완료**: 모든 입력 필드 컴포넌트가 정상적으로 렌더링됨
- **Phase 3 완료**: 폼 관리 및 유효성 검사가 정상 작동함
- **Phase 4 완료**: 타임캡슐 생성 페이지가 완전히 작동함
- **Phase 5 완료**: Figma 디자인과 일치하는 스타일이 적용됨
- **Phase 6 완료**: 접근성 및 성능 요구사항 충족
- **Phase 7 완료**: E2E 테스트가 모두 통과함

---

## ✅ 완료 체크리스트

### Phase 1 완료 기준
- [x] 프로젝트 디렉토리 구조가 생성됨
- [x] React Hook Form 및 Zod가 설치됨
- [x] 타입 정의가 완료됨
- [x] Zod 스키마가 정의됨
- [x] Figma MCP를 통한 디자인 스펙 추출 완료

### Phase 2 완료 기준
- [x] 모든 입력 필드 컴포넌트가 구현됨
- [x] React Hook Form과 통합됨
- [x] 에러 메시지가 표시됨
- [x] 접근성 속성이 적용됨

### Phase 3 완료 기준
- [x] useTimecapsuleForm 훅이 구현됨
- [x] useFormValidation 훅이 구현됨
- [x] 폼 제출이 정상적으로 동작함
- [x] 결제 페이지로 이동이 작동함

### Phase 4 완료 기준
- [x] TimecapsuleCreate 메인 컴포넌트가 구현됨
- [x] 라우팅 페이지가 생성됨
- [x] 모든 입력 필드가 통합됨
- [x] 폼 제출이 정상적으로 동작함

### Phase 5 완료 기준
- [x] Figma 디자인 스펙이 추출됨
- [x] 모든 컴포넌트 스타일이 Figma 디자인과 일치함
- [x] 디자인 토큰이 올바르게 사용됨

### Phase 6 완료 기준
- [x] 접근성 요구사항이 충족됨
- [x] 사용자 경험이 최적화됨
- [x] 성능이 최적화됨

### Phase 7 완료 기준
- [x] E2E 테스트가 작성됨
- [x] 모든 테스트 시나리오가 통과함
- [x] 접근성 테스트가 통과함

---

**다음 단계**: 작업 목록을 기반으로 단계별 구현을 시작합니다.
