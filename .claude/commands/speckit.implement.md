---
description: tasks.md에 정의된 모든 작업을 처리하고 실행하여 구현을 진행합니다
---

## 사용자 입력

```text
$ARGUMENTS
```

진행하기 전에 사용자 입력을 **반드시** 고려해야 합니다 (비어있지 않은 경우).

## 개요

TimeEgg Web Frontend 프로젝트의 구현을 위한 단계별 실행 가이드입니다.

### 1. 사전 요구사항 확인

프로젝트 루트에서 필요한 파일들이 준비되었는지 확인합니다:
- `specs/[feature]/tasks.md` - 구현할 작업 목록
- `specs/[feature]/plan.md` - 기술 스택 및 아키텍처 계획
- `specs/[feature]/spec.md` - 기능 명세서

### 2. 프로젝트 설정 검증

**Next.js 프로젝트 설정**:
- `package.json` 의존성 확인
- `tailwind.config.js` 설정 검증
- TypeScript 설정 확인
- ESLint/Prettier 설정 검증

**Feature Slice Architecture 준수**:
- `src/app/` - 라우팅 레이어
- `src/components/` - 기능별 컴포넌트
- `src/commons/` - 공용 자산

### 3. TimeEgg 워크플로우 기반 작업 실행 단계

#### Phase 1: 프로젝트 초기 설정
- 의존성 설치 및 설정
- 기본 폴더 구조 생성
- 개발 환경 설정 (ESLint, Prettier, TypeScript)

#### Phase 2: API 연동 레이어 구축
- **목적**: 백엔드와의 통신 인터페이스 확립
- API 클라이언트 설정 (`commons/apis/`)
- 타입 정의 (요청/응답 인터페이스)
- 에러 핸들링 및 인터셉터 구현
- API 통합 테스트 작성 및 실행

#### Phase 3: E2E 테스트 인프라 구축 (Playwright)
- **목적**: 전체 사용자 플로우 검증 환경 구축
- Playwright 테스트 환경 설정
- 주요 사용자 시나리오 테스트 작성
- 데이터 플로우 검증 테스트
- CI/CD 파이프라인에 테스트 통합

#### Phase 4+: 사용자 스토리별 UI 개발 (Mock 데이터)
**중요**: 이 단계에서는 실제 API 연결 없이 Mock 데이터만 사용
각 사용자 스토리별로:
1. Mock 데이터 생성 (`mocks/data.ts`)
2. 컴포넌트 타입 정의 (`types.ts`)
3. UI 컴포넌트 구현 (`components/`)
4. 스타일링 및 반응형 디자인
5. 컨테이너 컴포넌트 (Mock 데이터 사용)
6. 페이지 라우팅 (`app/`)

#### Phase N: 사용자 승인 단계
- **목적**: UI/UX 최종 검증 및 피드백 수집
- 스테이징 환경 배포
- 사용자 테스트 세션 진행
- 피드백 수집 및 개선사항 반영
- 최종 UI/UX 승인 획득

#### Phase N+1: 데이터 바인딩
- **목적**: 실제 API와 UI 연결
각 사용자 스토리별로:
1. 비즈니스 로직 훅 구현 (`hooks/use[Feature].ts`)
2. Mock 데이터를 실제 API 호출로 교체
3. 상태 관리 연결 (React Query + Context Provider)
4. 로딩/에러 상태 UI 추가
5. 낙관적 업데이트 구현

#### Final Phase: UI 테스트 및 최적화
- **목적**: 통합된 기능의 최종 검증
- 기능별 Playwright UI 테스트 파일 작성 및 실행
  - 컴포넌트 렌더링, 상호작용, 시각적 검증을 하나의 파일에 통합
- 기능별 Playwright E2E 테스트 실행
- 성능 최적화 (코드 분할, 이미지 최적화)
- 접근성 검증 및 개선
- 문서화 업데이트

### 4. 구현 규칙

**Feature Slice Architecture 준수**:
```text
components/[feature]/
├── index.tsx          # 컨테이너 (Controller 역할)
├── types.ts           # 기능별 타입 정의
├── hooks/             # 비즈니스 로직
│   └── use[Feature].ts
└── components/        # UI 컴포넌트
    └── [component]/
        ├── index.tsx
        ├── styles.module.css  # 스타일 정의
        └── types.ts   # Props 타입
```

**의존성 규칙**:
- `app/` → `components/` → `commons/` (단방향)
- 컨테이너는 로직을 직접 포함하지 않고 훅에서 가져옴
- 스타일은 Tailwind CSS 또는 별도 파일로 분리

**코드 품질**:
- TypeScript 엄격 모드 사용
- ESLint 규칙 준수
- 컴포넌트별 Props 타입 정의
- 재사용 가능한 컴포넌트는 `commons/components/`에 배치

### 5. TimeEgg 워크플로우별 진행 상황 추적

#### API 연동 단계 완료 체크:
- [ ] API 클라이언트 함수 작동 확인
- [ ] 타입 정의 완료 및 타입 검사 통과
- [ ] API 통합 테스트 통과
- [ ] 에러 핸들링 검증

#### E2E 테스트 단계 완료 체크 (Playwright):
- [ ] 모든 Playwright E2E 테스트 통과
- [ ] 사용자 시나리오 커버리지 확인
- [ ] CI/CD 파이프라인 통합 완료

#### UI 개발 단계 완료 체크 (Mock 데이터):
- [ ] Mock 데이터로 모든 UI 컴포넌트 렌더링
- [ ] 사용자 상호작용 정상 동작
- [ ] 반응형 디자인 검증
- [ ] 스타일 가이드 준수

#### 사용자 승인 단계:
- [ ] 스테이징 환경 배포 완료
- [ ] 사용자 테스트 완료
- [ ] 피드백 반영 완료
- [ ] 최종 UI/UX 승인 획득

#### 데이터 바인딩 단계 완료 체크:
- [ ] 실제 API 연결 완료
- [ ] 로딩/에러 상태 UI 동작 확인
- [ ] Context Provider 상태 관리 정상 동작
- [ ] 데이터 플로우 검증

#### UI 테스트 단계 완료 체크 (Playwright):
- [ ] 기능별 UI 테스트 파일 통과 (렌더링, 상호작용, 시각적 검증 포함)
- [ ] 접근성 검증 완료

#### 각 작업 완료 후 공통 체크:
- `tasks.md`에서 해당 작업을 `[x]`로 체크
- 빌드 오류 확인 (`npm run build`)
- 타입 검사 (`npm run type-check`)
- 린트 검사 (`npm run lint`)
- E2E 및 UI 테스트 실행 (`npm run test:e2e`, `npm run test:ui`)

### 6. 완료 검증

구현 완료 시 다음을 확인:
- 모든 작업이 완료되었는지 확인
- 기능이 원래 명세와 일치하는지 검증
- 빌드가 성공하는지 확인
- Feature Slice Architecture 규칙 준수 여부

### 7. 오류 처리

구현 중 오류 발생 시:
- 명확한 오류 메시지와 컨텍스트 제공
- 다음 단계 제안
- 필요시 작업 순서 조정

---

**참고**: 이 명령은 `tasks.md`에 완전한 작업 분석이 있다고 가정합니다. 작업이 불완전하거나 누락된 경우 먼저 `/speckit.tasks`를 실행하여 작업 목록을 재생성하는 것을 권장합니다.