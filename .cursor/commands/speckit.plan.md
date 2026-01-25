---
description: 기능 명세서를 바탕으로 기술적 구현 계획을 수립합니다
handoffs: 
  - label: 작업 생성
    agent: speckit.tasks
    prompt: 계획을 작업으로 분해
    send: true
---

## 사용자 입력

```text
$ARGUMENTS
```

진행하기 전에 사용자 입력을 **반드시** 고려해야 합니다 (비어있지 않은 경우).

## 개요

TimeEgg Web Frontend 프로젝트의 기술적 구현 계획을 수립하는 단계입니다.

### 1. 설정 및 초기화

기능 명세서(`spec.md`)를 바탕으로 기술적 구현 계획을 생성합니다.

**필요한 파일**:
- `specs/[feature]/spec.md` - 기능 명세서
- `.cursor/rules/project-structure.mdc` - 프로젝트 아키텍처 규칙

### 2. 기술 스택 정의

**Frontend Framework**: Next.js 16 (App Router)
- TypeScript 사용
- React Server Components 활용
- 클라이언트/서버 컴포넌트 분리

**스타일링**: css module & tailwind css
- 디자인 토큰 기반 스타일링
- **모바일 전용 설계**: 반응형 디자인 무시, 375px 모바일 폰 프레임 전용
- 컴포넌트별 스타일 분리

**상태 관리**: 
- React Query (서버 상태)
- Context API + Provider (클라이언트 상태 및 전역 설정)

**API 통신**: Axios
- 인터셉터를 통한 토큰 관리
- 타입 안전한 API 클라이언트

### 3. 아키텍처 설계

**TimeEgg 모바일 전용 설계 원칙**:
- **반응형 디자인 무시**: 모든 UI는 `src/app/layout.tsx`에 정의된 375px 모바일 폰 프레임 안에서만 작동
- **구조 지침**: 
  - 공통 로직은 `src/commons/hooks/`에 배치
  - 화면 조각은 `src/components/{PageName}/`에 배치

**Feature Slice Architecture 적용**:

```text
src/
├── app/                    # Next.js 라우팅 (375px 모바일 프레임)
│   ├── layout.tsx         # 375px 모바일 폰 프레임 정의
│   ├── page.tsx           # 홈페이지
│   └── [feature]/         # 기능별 페이지
├── components/             # 화면별 컴포넌트
│   └── {PageName}/        # 페이지명 기반 화면 조각
│       ├── index.tsx      # 컨테이너
│       ├── types.ts       # 타입 정의
│       ├── hooks/         # 페이지별 비즈니스 로직
│       └── components/    # UI 컴포넌트
└── commons/               # 공용 자산
    ├── apis/              # API 함수
    ├── components/        # 공용 UI 컴포넌트
    ├── hooks/             # 공통 로직 (전역 사용)
    ├── providers/         # 전역 Provider
    ├── utils/             # 유틸리티 함수
    └── styles/            # 전역 스타일 (375px 기준)
```

### 4. 데이터 모델링

기능 명세서의 엔티티를 바탕으로:
- TypeScript 인터페이스 정의
- API 요청/응답 타입
- 폼 데이터 타입
- 상태 관리 타입

### 5. API 설계

RESTful API 설계 원칙:
- 리소스 기반 URL 구조
- HTTP 메서드 적절한 사용
- 표준 HTTP 상태 코드
- 일관된 응답 형식

### 6. 컴포넌트 설계

**컴포넌트 분류**:
- **Page Components** (`app/`): 라우팅 담당
- **Feature Components** (`components/[feature]/`): 기능별 비즈니스 로직
- **UI Components** (`commons/components/`): 재사용 가능한 순수 UI

**컴포넌트 패턴**:
- Container/Presenter 패턴
- Custom Hooks를 통한 로직 분리
- Props 기반 데이터 전달

### 7. 상태 관리 전략

**서버 상태** (React Query):
- API 데이터 캐싱
- 백그라운드 업데이트
- 낙관적 업데이트

**클라이언트 상태** (Context API + Provider):
- UI 상태 (모달, 토글 등)
- 사용자 설정
- 임시 폼 데이터
- 전역 애플리케이션 상태

### 8. 모바일 전용 최적화

- **375px 고정 레이아웃**: 반응형 CSS 제거로 번들 크기 감소
- **모바일 터치 최적화**: 터치 이벤트 및 제스처 최적화
- **코드 분할**: 페이지별 동적 임포트
- **이미지 최적화**: Next.js Image 컴포넌트 (375px 기준)
- **번들 최적화**: 반응형 관련 라이브러리 제거
- **캐싱**: React Query 캐시 전략

### 9. 개발 환경 설정

**필수 도구**:
- ESLint + Prettier (코드 품질)
- Husky + lint-staged (Git hooks)
- TypeScript (타입 안전성)
- Tailwind CSS (스타일링)

**개발 서버**:
- Next.js 개발 서버
- Hot Module Replacement
- TypeScript 실시간 검사

### 10. 배포 전략

**빌드 최적화**:
- 정적 생성 (SSG) 활용
- 서버 사이드 렌더링 (SSR) 필요시 적용
- 환경별 설정 분리

### 11. 테스트 전략

**E2E 테스트** (Playwright):
- 사용자 시나리오 테스트
- API 통합 테스트
- 페이지 플로우 테스트

**UI 테스트** (Playwright):
- 기능별 컴포넌트 테스트 (렌더링, 상호작용, 시각적 검증 통합)

### 12. TimeEgg 프로젝트 개발 워크플로우

**핵심 개발 순서**:
```
API 연결 → E2E 테스트 → UI 구현 → 사용자 승인 → 데이터 바인딩 → UI 테스트
```

#### Step 1: API 연결
- **목적**: 백엔드와의 통신 인터페이스 확립
- **작업**: 
  - `specs/`의 테스트 결과를 분석하여 데이터 구조 파악
  - `src/commons/apis/`에 타입(Interface)과 Axios 함수를 통합 작성
  - 요청/응답 인터페이스 정의
  - 에러 핸들링 및 인터셉터 구현
- **결과물**: 완전히 작동하는 API 통신 레이어

#### Step 2: E2E 테스트 작성 (Playwright)
- **목적**: 전체 사용자 플로우 검증
- **작업**:
  - 주요 사용자 시나리오 테스트 작성
  - API 통합 테스트
  - 데이터 플로우 검증
- **도구**: Playwright
- **결과물**: 자동화된 E2E 테스트 스위트

#### Step 3: UI 구현 (375px 고정 기준)
- **목적**: 모바일 전용 사용자 인터페이스 완성
- **작업**:
  - **너비 375px 고정**을 기준으로 `src/components/{feature}/`에 Mock 데이터 기반 UI 구현
  - 고정 단위(px) 사용, 반응형 미지원
  - 모바일 터치 및 상호작용 구현
- **결과물**: 375px 모바일 프레임 전용 완전한 UI/UX

#### Step 4: 사용자 승인 단계
- **목적**: UI/UX 최종 검증 및 피드백 수집
- **작업**:
  - 스테이징 환경 배포 (375px 모바일 프레임)
  - 사용자 테스트 및 피드백 수집
  - UI/UX 개선사항 반영
- **결과물**: 사용자 승인된 최종 UI

#### Step 5: 데이터 바인딩
- **목적**: 실제 API와 UI 연결
- **작업**:
  - `src/commons/hooks/`에 React Query 또는 Context Provider 훅을 만들어 UI와 바인딩
  - Mock 데이터를 실제 API 호출로 교체
  - 로딩/에러 상태 처리
- **결과물**: 완전히 작동하는 기능

#### Step 6: UI 테스트 (Playwright)
- **목적**: 통합된 기능의 최종 검증
- **작업**:
  - 기능별 UI 테스트 파일 작성 (렌더링, 상호작용, 시각적 검증 통합)
  - 375px 모바일 프레임 기준 테스트
  - 성능 및 접근성 검증
- **결과물**: 프로덕션 준비 완료

### 13. 레이아웃 및 스타일 규칙

#### 쿠캣 스타일 고정 뷰
- **중앙 고정 뷰**: 모든 콘텐츠는 중앙 고정 뷰를 사용
- **기준 너비**: 375px를 기준으로 하되 최대 480px을 넘지 않도록 제한
- **일관성 유지**: 모든 기기에서 동일한 레이아웃 보장

#### 반응형 미지원 원칙
- **고정 단위 우선**: 미디어 쿼리나 유연한 단위(vw, %) 대신 **고정 단위(px)** 사용
- **기기 간 일관성**: 다양한 모바일 기기에서 동일한 시각적 경험 제공
- **개발 효율성**: 반응형 고려 없이 빠른 개발 가능

#### 폰 프레임 완결성
- **모바일 프레임**: 모든 결과물은 `app/layout.tsx`에 정의된 모바일 프레임 안에서 완결성 있게 표시
- **375px 기준**: 모든 UI 컴포넌트는 375px 너비 기준으로 설계
- **프레임 내 완성**: 스크롤 없이 프레임 내에서 핵심 기능 완료 가능

### 14. 구현 단계별 세부 사항

1. **프로젝트 초기 설정**: 의존성, 설정 파일, 375px 모바일 프레임 설정
2. **API 연결**: specs/ 분석 후 commons/apis/ 타입 통합 작성 및 API 통신 레이어 구축
3. **E2E 테스트**: 사용자 시나리오 기반 테스트 작성
4. **UI 구현**: 375px 고정 기준 Mock 데이터 기반 컴포넌트 구현
5. **사용자 승인**: UI/UX 검증 및 피드백 반영
6. **데이터 바인딩**: commons/hooks/에서 실제 API와 UI 연결
7. **UI 테스트**: 375px 프레임 기준 최종 테스트 및 최적화

---

**다음 단계**: `/speckit.tasks`를 실행하여 구체적인 작업 목록을 생성합니다.