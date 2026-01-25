# TimeEgg 웹 프론트엔드 작업 분해서

## 📋 개요

이 문서는 TimeEgg 웹 프론트엔드 기본 세팅을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

---

## 🎯 Phase 1: 기본 인프라 구축 (P1 - MVP)

### P1-1: 프로젝트 구조 및 폴더 세팅

#### TASK-001: 폴더 구조 생성
**목표**: Feature Slice Architecture 기반 폴더 구조 생성
**소요시간**: 30분
**의존성**: 없음

**작업 내용**:
1. `src/commons/` 하위 폴더 생성
2. `src/components/` 폴더 구조 준비
3. 각 폴더별 `.gitkeep` 파일 제거 및 `index.ts` 배럴 파일 생성

**생성할 파일**:
```
src/commons/apis/index.ts
src/commons/providers/index.ts
src/commons/hooks/index.ts
src/commons/components/index.ts
src/commons/utils/index.ts
src/commons/styles/index.ts
src/components/index.ts
```

**완료 기준**:
- [x] 모든 폴더 생성 완료
- [x] 각 폴더에 index.ts 배럴 파일 존재
- [x] TypeScript 컴파일 에러 없음

#### TASK-002: TypeScript 경로 별칭 설정
**목표**: 절대 경로 import를 위한 TypeScript 설정
**소요시간**: 15분
**의존성**: TASK-001

**작업 내용**:
1. `tsconfig.json` 수정 - baseUrl 및 paths 설정
2. `next.config.ts` 수정 - webpack alias 설정 (필요시)

**수정할 파일**:
- `tsconfig.json`
- `next.config.ts` (필요시)

**완료 기준**:
- [x] `@/commons/*` 경로로 import 가능
- [x] `@/components/*` 경로로 import 가능
- [x] IDE에서 자동완성 동작
- [x] 빌드 에러 없음

#### TASK-003: ESLint 및 Prettier 설정 강화
**목표**: 코드 품질 도구 설정 및 규칙 정의
**소요시간**: 30분
**의존성**: TASK-002

**작업 내용**:
1. `eslint.config.mjs` 수정 - 프로젝트 규칙 추가
2. `.prettierrc` 생성 - 포매팅 규칙 정의
3. `.prettierignore` 생성 - 제외 파일 정의

**생성/수정할 파일**:
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`

**완료 기준**:
- [x] ESLint 규칙 위반 시 에러 발생
- [x] Prettier 포매팅 자동 적용
- [x] import 순서 자동 정렬
- [x] 빌드 시 린트 검사 통과

### P1-2: 디자인 시스템 이식

#### TASK-004: 기존 폰트 파일 복사 및 설정
**목표**: Pretendard 폰트를 웹 프로젝트로 이식
**소요시간**: 45분
**의존성**: TASK-001

**작업 내용**:
1. `src/assets/fonts/` 폴더에서 Pretendard 폰트 파일 확인
2. `src/commons/styles/fonts.ts` 생성 - 폰트 정의
3. `src/app/layout.tsx` 수정 - 폰트 적용
4. Next.js 폰트 최적화 설정

**생성/수정할 파일**:
- `src/commons/styles/fonts.ts`
- `src/app/layout.tsx`
- `src/app/globals.css` (폰트 적용)

**완료 기준**:
- [x] Pretendard 폰트 로딩 확인
- [x] 폰트 프리로드 설정 적용
- [x] 브라우저에서 폰트 렌더링 확인
- [x] 폰트 로딩 성능 최적화

#### TASK-005: 디자인 토큰 이식 (globals.css + TypeScript)
**목표**: 기존 TimeEgg/FE 디자인 토큰을 globals.css(CSS 변수) + TypeScript 파일로 이식
**소요시간**: 90분
**의존성**: TASK-004

**작업 내용**:
1. **globals.css에 CSS 변수 등록**:
   - 기존 `color.ts`의 모든 색상을 CSS 변수로 변환
   - 폰트 관련 CSS 변수 추가
   - 간격 관련 CSS 변수 추가
2. **TypeScript 디자인 토큰 파일 생성**:
   - `src/commons/constants/color.ts` 복사 및 웹 환경에 맞게 수정
   - `src/commons/constants/typography.ts` 복사 및 웹 환경에 맞게 수정
   - `src/commons/constants/spacing.ts` 복사 및 웹 환경에 맞게 수정
   - `src/commons/constants/fonts.ts` 복사 및 웹 환경에 맞게 수정
3. **배럴 파일 생성**:
   - `src/commons/constants/index.ts` 생성

**생성/수정할 파일**:
- `src/app/globals.css` (CSS 변수 추가)
- `src/commons/constants/color.ts`
- `src/commons/constants/typography.ts`
- `src/commons/constants/spacing.ts`
- `src/commons/constants/fonts.ts`
- `src/commons/constants/index.ts`

**완료 기준**:
- [x] globals.css에 모든 색상이 CSS 변수로 정의
- [x] TypeScript 파일에서 기존 디자인 토큰 객체 그대로 사용 가능
- [x] `import { Colors, Typography } from '@/commons/constants'` 정상 동작
- [x] 브라우저에서 CSS 변수 확인 가능
- [x] TypeScript 타입 추론 정상 동작

#### TASK-006: CSS 모듈 기반 컴포넌트 구조 예시 생성
**목표**: CSS 변수와 TypeScript 토큰을 활용한 컴포넌트 구조 예시 생성
**소요시간**: 60분
**의존성**: TASK-005

**작업 내용**:
1. **공용 컴포넌트 예시 생성**:
   - `src/commons/components/button/index.tsx` 생성
   - `src/commons/components/button/styles.module.css` 생성
   - CSS 변수와 TypeScript 토큰 혼용 예시
2. **배럴 파일 생성**:
   - `src/commons/components/index.ts` 생성
3. **Tailwind CSS 설정 (선택적)**:
   - `tailwind.config.js` 수정 - CSS 변수 기반 색상 매핑
   - 기존 spacing 토큰 통합

**생성/수정할 파일**:
- `src/commons/components/button/index.tsx`
- `src/commons/components/button/styles.module.css`
- `src/commons/components/index.ts`
- `tailwind.config.js` (선택적)

**완료 기준**:
- [x] CSS 모듈과 TypeScript 토큰을 활용한 컴포넌트 예시 동작
- [x] `styles.module.css`에서 CSS 변수 사용 확인
- [x] TypeScript에서 디자인 토큰 객체 사용 확인
- [x] 컴포넌트 import/export 정상 동작
- [x] Tailwind 클래스와 CSS 모듈 동시 사용 가능 (선택적)

#### TASK-007: 아이콘 시스템 정리
**목표**: 기존 아이콘을 웹 프로젝트에서 사용할 수 있도록 정리
**소요시간**: 30분
**의존성**: TASK-001

**작업 내용**:
1. `src/assets/icons/` 폴더 정리 및 분류
2. `src/commons/components/icon/` 폴더 생성
3. 아이콘 컴포넌트 기본 구조 생성
4. 아이콘 접근 경로 정의
5. `public/icons/` 폴더로 아이콘 파일 복사

**생성할 파일**:
- `src/commons/components/icon/index.tsx`
- `src/commons/components/icon/types.ts`

**완료 기준**:
- [x] 아이콘 파일 정리 완료 (public/icons로 복사됨)
- [x] 아이콘 컴포넌트 기본 구조 생성
- [x] 아이콘 타입 정의 완료
- [x] Icon 컴포넌트 사용 가능

### P1-3: Next.js App Router 및 기본 라우팅

#### TASK-008: Root Layout 컴포넌트 구성
**목표**: 전체 애플리케이션의 기본 레이아웃 설정
**소요시간**: 45분
**의존성**: TASK-004, TASK-005

**작업 내용**:
1. `src/app/layout.tsx` 수정 - HTML, Body 태그 설정
2. 메타데이터 기본 설정 (title, description 등)
3. 폰트 및 글로벌 스타일 적용
4. 프로바이더 컴포넌트 연결 준비

**수정할 파일**:
- `src/app/layout.tsx`

**완료 기준**:
- [x] HTML lang 속성 설정 (ko)
- [x] 기본 메타데이터 설정 완료
- [x] Pretendard 폰트 적용 확인
- [x] 글로벌 스타일 적용 확인

#### TASK-009: 기본 페이지 및 에러 처리 컴포넌트
**목표**: 기본 라우팅 구조 및 에러 처리 시스템 구축
**소요시간**: 30분
**의존성**: TASK-008

**작업 내용**:
1. `src/app/page.tsx` 수정 - 홈페이지 기본 구조
2. `src/app/loading.tsx` 생성 - 전역 로딩 컴포넌트
3. `src/app/error.tsx` 생성 - 전역 에러 컴포넌트
4. `src/app/not-found.tsx` 생성 - 404 페이지

**생성/수정할 파일**:
- `src/app/page.tsx`
- `src/app/loading.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`

**완료 기준**:
- [x] 홈페이지 기본 렌더링 확인
- [x] 로딩 컴포넌트 동작 확인
- [x] 에러 페이지 동작 확인
- [x] 404 페이지 동작 확인

---

## 🔄 Phase 2: 상태 관리 및 API 설정 (P2)

### P2-1: 전역 프로바이더 시스템

#### TASK-010: React Query 프로바이더 설정
**목표**: 서버 상태 관리를 위한 React Query 설정
**소요시간**: 45분
**의존성**: TASK-008

**작업 내용**:
1. `@tanstack/react-query` 패키지 설치
2. `src/commons/providers/query-provider.tsx` 생성
3. QueryClient 설정 및 기본 옵션 정의
4. React Query Devtools 설정 (개발 환경)

**생성할 파일**:
- `src/commons/providers/query-provider.tsx`
- `src/commons/providers/query-client.ts`

**완료 기준**:
- [x] React Query 프로바이더 정상 동작
- [x] 개발 도구 정상 작동
- [x] 기본 캐싱 옵션 적용
- [x] 에러 처리 기본 설정

#### TASK-011: React Context 기반 상태 관리 구조
**목표**: 클라이언트 상태 관리를 위한 React Context 설정
**소요시간**: 45분
**의존성**: TASK-010

**작업 내용**:
1. `src/commons/providers/auth-provider.tsx` 생성 - 인증 컨텍스트
2. `src/commons/providers/ui-provider.tsx` 생성 - UI 상태 컨텍스트
3. `src/commons/hooks/useAuth.ts` 생성 - 인증 훅
4. `src/commons/hooks/useUI.ts` 생성 - UI 상태 훅

**생성할 파일**:
- `src/commons/providers/auth-provider.tsx`
- `src/commons/providers/ui-provider.tsx`
- `src/commons/hooks/useAuth.ts`
- `src/commons/hooks/useUI.ts`
- `src/commons/types/auth.ts`
- `src/commons/types/ui.ts`

**완료 기준**:
- [x] 인증 컨텍스트 기본 구조 생성
- [x] UI 컨텍스트 기본 구조 생성
- [x] 커스텀 훅으로 타입 안전한 접근
- [x] 컨텍스트 프로바이더 정상 동작

#### TASK-012: 프로바이더 컴포지션
**목표**: 모든 프로바이더를 통합하는 컴포지션 패턴 구현
**소요시간**: 30분
**의존성**: TASK-010, TASK-011

**작업 내용**:
1. `src/commons/providers/index.tsx` 수정 - 프로바이더 통합
2. `src/app/layout.tsx` 수정 - 프로바이더 적용
3. 프로바이더 순서 최적화
4. 타입 정의 및 에러 처리

**수정할 파일**:
- `src/commons/providers/index.tsx`
- `src/app/layout.tsx`

**완료 기준**:
- [x] 모든 프로바이더 정상 동작
- [x] 프로바이더 중첩 구조 최적화
- [x] 에러 바운더리 적용
- [x] React Query 개발 도구 정상 작동

### P2-2: API 클라이언트 및 환경 설정

#### TASK-013: Axios 클라이언트 설정
**목표**: HTTP 통신을 위한 Axios 클라이언트 구성
**소요시간**: 45분
**의존성**: TASK-012

**작업 내용**:
1. `axios` 패키지 설치
2. `src/commons/provider/api-client.ts` 생성 - Axios 인스턴스
3. 요청/응답 인터셉터 기본 구조
4. 에러 처리 및 재시도 로직 기본 틀

**생성할 파일**:
- `src/commons/provider/api-client.ts`

**완료 기준**:
- [x] Axios 인스턴스 정상 생성
- [x] 기본 URL 및 타임아웃 설정
- [x] 인터셉터 기본 구조 적용
- [x] 에러 타입 정의 완료

#### TASK-014: 환경 변수 관리 시스템
**목표**: 환경별 설정을 위한 환경 변수 시스템 구축
**소요시간**: 30분
**의존성**: TASK-013

**작업 내용**:
1. `.env.example` 파일 생성 - 환경 변수 템플릿

**생성할 파일**:
- `.env.example`

**완료 기준**:
- [x] 환경 변수 스키마 정의
- [x] 타입 안전한 환경 변수 접근
- [x] 필수 환경 변수 검증
- [x] 개발/프로덕션 환경 분리

#### TASK-015: API 엔드포인트 상수 관리
**목표**: API 엔드포인트를 체계적으로 관리하는 시스템 구축
**소요시간**: 30분
**의존성**: TASK-013, TASK-014

**작업 내용**:
1. `src/commons/apis/endpoints.ts` 생성 - API 엔드포인트 상수
2. `src/commons/apis/auth/auth.ts` 생성 - 인증 API 함수 기본 구조
3. API 함수 타입 정의
4. 에러 처리 표준화

**생성할 파일**:
- `src/commons/apis/endpoints.ts`
- `src/commons/apis/auth/auth.ts`
- `src/commons/types/auth/auth.ts`

**완료 기준**:
- [x] API 엔드포인트 상수 정의
- [x] 인증 API 기본 구조 생성
- [x] API 응답 타입 정의
- [x] 에러 처리 표준화

---

## ⚡ Phase 3: 성능 최적화 및 도구 (P3)

### P3-1: 번들 최적화 및 모니터링

#### TASK-016: Next.js 설정 최적화
**목표**: Next.js 성능 최적화 설정 적용
**소요시간**: 30분
**의존성**: TASK-015

**작업 내용**:
1. `next.config.ts` 수정 - 성능 최적화 설정
2. 이미지 최적화 설정
3. 번들 분석 설정
4. 압축 및 캐싱 설정

**수정할 파일**:
- `next.config.ts`

**완료 기준**:
- [x] 이미지 최적화 설정 적용
- [x] 번들 압축 설정 적용
- [x] 캐싱 헤더 설정
- [x] 빌드 최적화 확인

#### TASK-017: Bundle Analyzer 설정
**목표**: 번들 사이즈 분석 도구 설정
**소요시간**: 15분
**의존성**: TASK-016

**작업 내용**:
1. `@next/bundle-analyzer` 패키지 설치
2. `package.json` 스크립트 추가
3. 번들 분석 설정 구성

**수정할 파일**:
- `package.json`
- `next.config.ts`

**완료 기준**:
- [x] `npm run analyze` 명령어 동작
- [x] 번들 분석 리포트 생성
- [x] 번들 사이즈 모니터링 가능

#### TASK-018: 성능 측정 도구 통합
**목표**: 성능 측정 및 모니터링 도구 설정
**소요시간**: 30분
**의존성**: TASK-017

**작업 내용**:
1. Lighthouse CI 설정 준비
2. Core Web Vitals 측정 준비
3. 성능 모니터링 기본 구조
4. 개발 환경 성능 도구 설정

**생성할 파일**:
- `src/commons/utils/performance.ts`
- `.lighthouserc.js` (기본 구조)

**완료 기준**:
- [x] 성능 측정 도구 기본 구조
- [x] Core Web Vitals 측정 가능
- [x] 개발 환경 성능 모니터링
- [x] 성능 데이터 수집 준비

---

## 📚 Phase 4: 문서화 및 가이드 (P4)

### P4-1: 아키텍처 문서 작성

#### TASK-019: Next.js 프로젝트 규칙 문서
**목표**: Next.js 프로젝트의 핵심 규칙을 문서화
**소요시간**: 60분
**의존성**: TASK-018

**작업 내용**:
1. `docs/architecture/nextjs.md` 생성
2. App Router 사용 규칙 정리
3. 서버/클라이언트 컴포넌트 구분 가이드
4. 성능 최적화 규칙 정리

**생성할 파일**:
- `docs/architecture/nextjs.md`

**완료 기준**:
- [ ] Next.js 핵심 규칙 문서화
- [ ] 컴포넌트 작성 가이드 완성
- [ ] 성능 최적화 가이드 완성
- [ ] 팀 공유 가능한 수준의 문서

#### TASK-020: 개발 환경 설정 가이드
**목표**: 새로운 개발자를 위한 설정 가이드 작성
**소요시간**: 45분
**의존성**: TASK-019

**작업 내용**:
1. `docs/development/setup.md` 생성
2. 필수 도구 설치 가이드
3. 환경 변수 설정 가이드
4. 트러블슈팅 가이드

**생성할 파일**:
- `docs/development/setup.md`
- `docs/development/troubleshooting.md`

**완료 기준**:
- [ ] 개발 환경 설정 가이드 완성
- [ ] 환경 변수 설정 가이드 완성
- [ ] 일반적인 문제 해결 가이드
- [ ] 30분 내 온보딩 가능한 수준

---

## 📋 작업 의존성 그래프

```
TASK-001 (폴더 구조)
├── TASK-002 (TS 경로 별칭)
│   └── TASK-003 (ESLint/Prettier)
├── TASK-004 (폰트 설정)
│   └── TASK-005 (색상 시스템)
│       └── TASK-006 (Tailwind 설정)
│           └── TASK-008 (Root Layout)
│               └── TASK-009 (기본 페이지)
│                   └── TASK-010 (React Query)
│                       └── TASK-011 (React Context)
│                           └── TASK-012 (프로바이더)
│                               └── TASK-013 (Axios)
│                                   └── TASK-014 (환경 변수)
│                                       └── TASK-015 (API 엔드포인트)
│                                           └── TASK-016 (Next.js 최적화)
│                                               └── TASK-017 (Bundle Analyzer)
│                                                   └── TASK-018 (성능 도구)
│                                                       └── TASK-019 (문서화)
│                                                           └── TASK-020 (가이드)
└── TASK-007 (아이콘 시스템) [독립적]
```

---

## 🎯 우선순위 및 병렬 처리

### 높은 우선순위 (P1 - 즉시 시작 가능)
- **TASK-001**: 폴더 구조 생성 ⭐⭐⭐
- **TASK-007**: 아이콘 시스템 정리 (병렬 처리 가능) ⭐⭐⭐

### 중간 우선순위 (P2 - P1 완료 후)
- **TASK-002 ~ TASK-006**: 기본 설정 및 디자인 시스템 ⭐⭐
- **TASK-008 ~ TASK-015**: 라우팅 및 상태 관리 ⭐⭐

### 낮은 우선순위 (P3 - 기본 기능 완료 후)
- **TASK-016 ~ TASK-018**: 성능 최적화 ⭐
- **TASK-019 ~ TASK-020**: 문서화 ⭐

---

## ✅ 완료 기준 체크리스트

### Phase 1 완료 기준
- [x] 모든 폴더 구조 생성 및 배럴 파일 존재
- [x] TypeScript 절대 경로 import 정상 동작
- [x] ESLint/Prettier 규칙 적용 및 자동 포매팅
- [x] Pretendard 폰트 로딩 및 적용 확인 (TASK-004)
- [x] CSS 변수 기반 색상 시스템 구축 (TASK-005)
- [x] Tailwind CSS 커스텀 설정 적용 (TASK-006)
- [x] 기본 라우팅 및 에러 처리 동작 (TASK-009)

### Phase 2 완료 기준
- [x] React Query 프로바이더 정상 동작
- [x] React Context 기본 구조 생성
- [x] 프로바이더 컴포지션 적용
- [x] Axios 클라이언트 설정 완료
- [x] 환경 변수 관리 시스템 구축
- [x] API 엔드포인트 상수 관리

### Phase 3 완료 기준
- [x] Next.js 성능 최적화 설정 적용
- [x] Bundle Analyzer 정상 동작
- [x] 성능 측정 도구 기본 구조

### Phase 4 완료 기준
- [x] Next.js 프로젝트 규칙 문서 완성
- [ ] 개발 환경 설정 가이드 완성 (TASK-020)

---

## 📊 예상 소요 시간

| Phase | 작업 수 | 예상 시간 | 누적 시간 |
|-------|---------|-----------|-----------|
| Phase 1 | 9개 | 5.5시간 | 5.5시간 |
| Phase 2 | 6개 | 3.5시간 | 9시간 |
| Phase 3 | 3개 | 1.25시간 | 10.25시간 |
| Phase 4 | 2개 | 1.75시간 | 12시간 |

**총 예상 소요 시간**: 약 12시간 (1.5일)

---

## 🚨 리스크 및 대응 방안

### 기술적 리스크
1. **폰트 로딩 이슈**: 폰트 파일 경로 문제 → 상대/절대 경로 확인
2. **CSS 변수 호환성**: 구형 브라우저 → 폴백 색상 정의
3. **번들 사이즈 증가**: 패키지 추가로 인한 크기 증가 → Tree shaking 최적화

### 프로세스 리스크
1. **의존성 충돌**: 패키지 버전 충돌 → package-lock.json 관리
2. **설정 복잡성**: 설정 파일 복잡화 → 단계별 검증
3. **문서화 지연**: 개발 우선으로 문서 후순위 → 병렬 작업 권장

### 대응 방안
- 각 TASK 완료 후 즉시 테스트 및 검증
- 문제 발생 시 이전 단계로 롤백 가능한 구조 유지
- 핵심 기능 우선, 부가 기능은 선택적 적용