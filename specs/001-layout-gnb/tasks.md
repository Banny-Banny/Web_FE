# TimeEgg 웹 레이아웃 및 GNB 작업 목록

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 기본 레이아웃 구조와 GNB(Global Navigation Bar) 구현을 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

---

## 🎯 Phase 1: 기본 레이아웃 구조 (P1)

### P1-1: Mobile Frame 컴포넌트 구현

#### T001: Mobile Frame 컴포넌트 타입 정의
**목표**: Mobile Frame 컴포넌트의 Props 타입 정의
**소요시간**: 10분
**의존성**: 없음

**작업 내용**:
1. `src/commons/layout/mobile-frame/types.ts` 파일 생성
2. `MobileFrameProps` 인터페이스 정의

**생성할 파일**:
- `src/commons/layout/mobile-frame/types.ts`

**완료 기준**:
- [x] `MobileFrameProps` 인터페이스가 정의됨
- [x] TypeScript 컴파일 에러 없음

#### T002: Mobile Frame CSS Module 스타일 작성
**목표**: Mobile Frame 컴포넌트의 스타일 정의
**소요시간**: 20분
**의존성**: T001

**작업 내용**:
1. `src/commons/layout/mobile-frame/styles.module.css` 파일 생성
2. 375px 고정 너비, 중앙 정렬, 배경색 스타일 정의
3. CSS 변수를 사용한 디자인 토큰 적용

**생성할 파일**:
- `src/commons/layout/mobile-frame/styles.module.css`

**완료 기준**:
- [x] 375px 고정 너비 스타일 정의됨
- [x] 중앙 정렬 스타일 적용됨
- [x] 배경색이 CSS 변수로 정의됨
- [x] 최대 너비 480px 제한 설정됨

#### T003: Mobile Frame 컴포넌트 구현
**목표**: Mobile Frame 컴포넌트 기본 구조 구현
**소요시간**: 30분
**의존성**: T001, T002

**작업 내용**:
1. `src/commons/layout/mobile-frame/index.tsx` 파일 생성
2. CSS Module import 및 적용
3. children을 래핑하는 컨테이너 구조 구현
4. Props 타입 적용

**생성할 파일**:
- `src/commons/layout/mobile-frame/index.tsx`

**완료 기준**:
- [x] Mobile Frame 컴포넌트가 정상적으로 렌더링됨
- [x] CSS Module 스타일이 적용됨
- [x] 375px 고정 너비로 표시됨
- [x] 중앙 정렬됨

#### T004: Mobile Frame 컴포넌트 export 설정
**목표**: Mobile Frame 컴포넌트를 commons에서 export
**소요시간**: 5분
**의존성**: T003

**작업 내용**:
1. `src/commons/layout/mobile-frame/index.ts` 배럴 파일 확인 또는 생성
2. Mobile Frame 컴포넌트 export

**수정할 파일**:
- `src/commons/layout/mobile-frame/index.ts` (필요시)

**완료 기준**:
- [x] `@/commons/layout/mobile-frame`로 import 가능
- [x] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 2: GNB 컴포넌트 구현 (P2)

### P2-1: GNB 타입 및 스타일 정의

#### T005: GNB 컴포넌트 타입 정의
**목표**: GNB 컴포넌트의 Props 및 관련 타입 정의
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `src/commons/layout/gnb/types.ts` 파일 생성
2. `GNBProps` 인터페이스 정의
3. 메뉴 아이템 타입 정의

**생성할 파일**:
- `src/commons/layout/gnb/types.ts`

**완료 기준**:
- [x] `GNBProps` 인터페이스가 정의됨
- [x] 메뉴 아이템 타입이 정의됨
- [x] TypeScript 컴파일 에러 없음

#### T006: GNB CSS Module 스타일 작성
**목표**: GNB 컴포넌트의 스타일 정의
**소요시간**: 30분
**의존성**: T005

**작업 내용**:
1. `src/commons/layout/gnb/styles.module.css` 파일 생성
2. 하단 고정 스타일 (`position: fixed; bottom: 0`)
3. 375px 너비, 최소 60px 높이 설정
4. 아이콘 배치 및 간격 스타일
5. 터치 타겟 크기 (최소 44px × 44px) 보장
6. 포커스 상태 스타일 (`:focus`)
7. CSS 변수를 사용한 디자인 토큰 적용

**생성할 파일**:
- `src/commons/layout/gnb/styles.module.css`

**완료 기준**:
- [x] 하단 고정 스타일 정의됨
- [x] 너비 375px, 높이 최소 60px 설정됨
- [x] 터치 타겟 크기 보장됨
- [x] 포커스 상태 스타일 정의됨
- [x] CSS 변수로 디자인 토큰 적용됨

### P2-2: GNB 컴포넌트 구현

#### T007 [US2]: GNB 컴포넌트 기본 구조 구현
**목표**: GNB 컴포넌트 기본 구조 및 아이콘 렌더링
**소요시간**: 45분
**의존성**: T005, T006

**작업 내용**:
1. `src/commons/layout/gnb/index.tsx` 파일 생성
2. `'use client'` 지시어 추가 (클라이언트 컴포넌트)
3. CSS Module import 및 적용
4. lucide-react 아이콘 개별 import (Bell, Map, User)
5. 3개 메뉴 아이템 기본 구조 구현
6. 아이콘 배치 순서: 소식(Bell) → 홈(Map) → 마이(User)

**생성할 파일**:
- `src/commons/layout/gnb/index.tsx`

**아이콘 import 최적화**:
```tsx
import { Bell } from 'lucide-react/dist/esm/icons/bell';
import { Map } from 'lucide-react/dist/esm/icons/map';
import { User } from 'lucide-react/dist/esm/icons/user';
```

**완료 기준**:
- [x] GNB 컴포넌트가 정상적으로 렌더링됨
- [x] 3개 아이콘이 왼쪽에서 오른쪽 순서로 배치됨
- [x] CSS Module 스타일이 적용됨
- [x] 하단 고정 스타일이 적용됨

#### T008 [US2]: GNB 네비게이션 로직 구현
**목표**: Next.js Link를 사용한 페이지 전환 기능 구현
**소요시간**: 30분
**의존성**: T007

**작업 내용**:
1. Next.js `Link` 컴포넌트 import
2. 각 메뉴 아이템에 Link 적용
3. 경로 매핑:
   - 소식: `/notifications`
   - 홈: `/`
   - 마이: `/profile`
4. 클릭 이벤트 처리

**수정할 파일**:
- `src/commons/layout/gnb/index.tsx`

**완료 기준**:
- [x] 각 아이콘 클릭 시 해당 페이지로 이동함
- [x] 페이지 전환이 정상적으로 동작함
- [x] Link 컴포넌트가 올바르게 적용됨

#### T009 [US2]: GNB 접근성 속성 추가
**목표**: 접근성 요구사항 충족 (aria-label, role, 키보드 네비게이션)
**소요시간**: 25분
**의존성**: T008

**작업 내용**:
1. `role="navigation"` 속성 추가
2. 각 아이콘에 `aria-label` 추가:
   - 소식: "소식"
   - 홈: "홈"
   - 마이: "마이페이지"
3. `tabIndex={0}` 설정 (키보드 네비게이션)
4. Enter/Space 키 이벤트 처리 (필요시)

**수정할 파일**:
- `src/commons/layout/gnb/index.tsx`

**완료 기준**:
- [x] 모든 아이콘에 aria-label이 설정됨
- [x] role="navigation"이 설정됨
- [x] 키보드로 네비게이션 가능함
- [x] 포커스 스타일이 적용됨

#### T010: GNB 컴포넌트 export 설정
**목표**: GNB 컴포넌트를 commons에서 export
**소요시간**: 5분
**의존성**: T009

**작업 내용**:
1. `src/commons/layout/gnb/index.ts` 배럴 파일 확인 또는 생성
2. GNB 컴포넌트 export

**수정할 파일**:
- `src/commons/layout/gnb/index.ts` (필요시)

**완료 기준**:
- [x] `@/commons/layout/gnb`로 import 가능
- [x] TypeScript 컴파일 에러 없음

---

## 🎯 Phase 3: 조건부 표시 및 레이아웃 통합 (P3)

### P3-1: useGNB Hook 구현

#### T011 [US1] [US2]: useGNB Hook 구현
**목표**: 경로 기반 GNB 표시 여부 결정 로직 구현
**소요시간**: 20분
**의존성**: 없음

**작업 내용**:
1. `src/commons/hooks/useGNB.ts` 파일 생성
2. Next.js `usePathname` 훅 import
3. GNB 숨김 경로 상수 정의: `['/login', '/signup', '/onboarding']`
4. 경로 기반 `shouldShowGNB` 로직 구현
5. 반환 타입 정의: `{ shouldShowGNB: boolean; currentPath: string }`

**생성할 파일**:
- `src/commons/hooks/useGNB.ts`

**완료 기준**:
- [x] useGNB Hook이 정상적으로 동작함
- [x] 로그인/회원가입/온보딩 경로에서 `shouldShowGNB: false` 반환
- [x] 그 외 경로에서 `shouldShowGNB: true` 반환
- [x] TypeScript 타입 안전성 보장됨

#### T012: useGNB Hook export 설정
**목표**: useGNB Hook을 commons에서 export
**소요시간**: 5분
**의존성**: T011

**작업 내용**:
1. `src/commons/hooks/index.ts` 파일 확인 또는 생성
2. useGNB Hook export

**수정할 파일**:
- `src/commons/hooks/index.ts` (필요시)

**완료 기준**:
- [x] `@/commons/hooks/useGNB`로 import 가능
- [x] TypeScript 컴파일 에러 없음

### P3-2: Root Layout 수정

#### T013: Root Layout에 Mobile Frame 적용
**목표**: Root Layout에 Mobile Frame 컴포넌트 통합
**소요시간**: 20분
**의존성**: T004

**작업 내용**:
1. `src/app/layout.tsx` 파일 수정
2. Mobile Frame 컴포넌트 import
3. Providers와 children을 Mobile Frame으로 래핑
4. 기존 구조 유지하면서 Mobile Frame 적용

**수정할 파일**:
- `src/app/layout.tsx`

**완료 기준**:
- [x] Root Layout에 Mobile Frame이 적용됨
- [x] 모든 페이지에서 375px 모바일 프레임이 표시됨
- [x] 중앙 정렬 및 배경색이 적용됨
- [x] 기존 Providers 구조가 유지됨

### P3-3: Auth Layout 생성 (GNB 숨김)

#### T014 [US1]: Auth Layout CSS Module 스타일 작성
**목표**: Auth Layout의 스타일 정의
**소요시간**: 15분
**의존성**: 없음

**작업 내용**:
1. `src/app/(auth)/styles.module.css` 파일 생성
2. 컨테이너 스타일 정의
3. GNB 없이 콘텐츠만 표시하는 레이아웃 스타일

**생성할 파일**:
- `src/app/(auth)/styles.module.css`

**완료 기준**:
- [x] Auth Layout 스타일이 정의됨
- [x] CSS Module이 정상적으로 동작함

#### T015 [US1]: Auth Layout 컴포넌트 구현
**목표**: 인증 관련 페이지 전용 레이아웃 구현 (GNB 숨김)
**소요시간**: 25분
**의존성**: T014

**작업 내용**:
1. `src/app/(auth)/layout.tsx` 파일 생성
2. CSS Module import 및 적용
3. children만 렌더링 (GNB 제외)
4. Mobile Frame은 Root Layout에서 이미 적용됨

**생성할 파일**:
- `src/app/(auth)/layout.tsx`

**완료 기준**:
- [x] Auth Layout이 정상적으로 렌더링됨
- [x] GNB가 표시되지 않음
- [x] 로그인/회원가입/온보딩 페이지에서 적용됨

#### T016 [US1]: Auth 라우트 그룹 페이지 구조 생성
**목표**: 로그인, 회원가입, 온보딩 페이지 기본 구조 생성
**소요시간**: 30분
**의존성**: T015

**작업 내용**:
1. `src/app/(auth)/login/page.tsx` 파일 생성
2. `src/app/(auth)/signup/page.tsx` 파일 생성
3. `src/app/(auth)/onboarding/page.tsx` 파일 생성
4. 각 페이지에 기본 구조만 구현 (내용은 향후 구현)

**생성할 파일**:
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/onboarding/page.tsx`

**완료 기준**:
- [x] 3개 페이지가 정상적으로 생성됨
- [x] 각 페이지에서 GNB가 숨겨짐
- [x] 라우팅이 정상적으로 동작함

### P3-4: Main Layout 생성 (GNB 표시)

#### T017 [US2]: Main Layout CSS Module 스타일 작성
**목표**: Main Layout의 스타일 정의 (GNB 높이만큼 하단 여백)
**소요시간**: 20분
**의존성**: T006

**작업 내용**:
1. `src/app/(main)/styles.module.css` 파일 생성
2. 컨테이너 스타일 정의
3. GNB 높이만큼 하단 여백 추가 (padding-bottom 또는 margin-bottom)
4. 콘텐츠 영역과 GNB 간 겹침 방지

**생성할 파일**:
- `src/app/(main)/styles.module.css`

**완료 기준**:
- [x] Main Layout 스타일이 정의됨
- [x] GNB 높이만큼 하단 여백이 설정됨
- [x] CSS Module이 정상적으로 동작함

#### T018 [US2]: Main Layout 컴포넌트 구현
**목표**: 메인 기능 페이지 전용 레이아웃 구현 (GNB 표시)
**소요시간**: 30분
**의존성**: T010, T017

**작업 내용**:
1. `src/app/(main)/layout.tsx` 파일 생성
2. CSS Module import 및 적용
3. GNB 컴포넌트 import 및 렌더링
4. children과 GNB를 함께 렌더링
5. 하단 여백이 적용된 컨테이너로 래핑

**생성할 파일**:
- `src/app/(main)/layout.tsx`

**완료 기준**:
- [x] Main Layout이 정상적으로 렌더링됨
- [x] GNB가 화면 하단에 표시됨
- [x] 콘텐츠 영역과 GNB가 겹치지 않음
- [x] 하단 여백이 올바르게 적용됨

#### T019 [US2]: Main 라우트 그룹 페이지 구조 생성
**목표**: 홈, 소식, 마이페이지 기본 구조 생성
**소요시간**: 30분
**의존성**: T018

**작업 내용**:
1. `src/app/(main)/page.tsx` 파일 생성 또는 수정 (홈 페이지)
2. `src/app/(main)/notifications/page.tsx` 파일 생성 (소식 페이지)
3. `src/app/(main)/profile/page.tsx` 파일 생성 (마이페이지)
4. 각 페이지에 기본 구조만 구현 (내용은 향후 구현)

**생성/수정할 파일**:
- `src/app/(main)/page.tsx`
- `src/app/(main)/notifications/page.tsx`
- `src/app/(main)/profile/page.tsx`

**완료 기준**:
- [x] 3개 페이지가 정상적으로 생성됨
- [x] 각 페이지에서 GNB가 표시됨
- [x] 라우팅이 정상적으로 동작함
- [x] GNB 아이콘 클릭 시 해당 페이지로 이동함

---

## 🎯 Phase 4: 접근성 및 최적화 (P4)

### P4-1: 접근성 개선

#### T020 [US2] [US3]: GNB 키보드 네비게이션 완성
**목표**: 키보드 네비게이션 완전 지원
**소요시간**: 20분
**의존성**: T009

**작업 내용**:
1. Enter/Space 키 이벤트 핸들러 추가
2. 포커스 관리 개선
3. 키보드 접근성 테스트

**수정할 파일**:
- `src/commons/layout/gnb/index.tsx`

**완료 기준**:
- [x] Enter 키로 네비게이션 가능
- [x] Space 키로 네비게이션 가능
- [x] Tab 키로 순차 이동 가능
- [x] 포커스 표시가 명확함

#### T021 [US2] [US3]: GNB 스크린 리더 지원 강화
**목표**: 스크린 리더 사용자를 위한 추가 지원
**소요시간**: 15분
**의존성**: T009

**작업 내용**:
1. `aria-label` 검증 및 개선
2. `aria-current` 속성 추가 (현재 페이지 표시, 향후 확장)
3. 의미 있는 텍스트 라벨 확인

**수정할 파일**:
- `src/commons/layout/gnb/index.tsx`

**완료 기준**:
- [x] 모든 아이콘에 명확한 aria-label이 설정됨
- [x] 스크린 리더에서 네비게이션 구조가 명확함
- [x] 접근성 검증 도구에서 경고 없음

### P4-2: 성능 최적화

#### T022: lucide-react 아이콘 import 최적화
**목표**: 번들 크기 최소화를 위한 아이콘 import 최적화
**소요시간**: 15분
**의존성**: T007

**작업 내용**:
1. `next.config.ts` 파일 확인
2. `optimizePackageImports: ['lucide-react']` 설정 확인 또는 추가
3. 개별 아이콘 import 방식 검증

**수정할 파일**:
- `next.config.ts` (필요시)

**완료 기준**:
- [x] optimizePackageImports 설정이 적용됨
- [x] 개별 아이콘 import가 사용됨 (lucide-react의 optimizePackageImports로 최적화됨)
- [x] 번들 크기가 최적화됨

#### T023: CSS Module 타입 생성 확인
**목표**: TypeScript에서 CSS Module 타입 자동 생성 확인
**소요시간**: 10분
**의존성**: T002, T006, T014, T017

**작업 내용**:
1. `src/commons/layout/mobile-frame/styles.module.css.d.ts` 타입 파일 확인
2. `src/commons/layout/gnb/styles.module.css.d.ts` 타입 파일 확인
3. TypeScript 설정에서 CSS Module 타입 지원 확인

**확인할 파일**:
- `tsconfig.json`
- 각 `styles.module.css` 파일

**완료 기준**:
- [x] CSS Module 클래스명에 자동 완성 지원됨
- [x] 타입 체크가 정상적으로 동작함
- [x] 컴파일 에러 없음

### P4-3: 최종 테스트 및 검증

#### T024 [US1] [US2] [US3]: 레이아웃 및 GNB 통합 테스트
**목표**: 모든 사용자 시나리오 검증
**소요시간**: 45분
**의존성**: T016, T019, T020, T021

**작업 내용**:
1. 로그인 페이지에서 GNB 숨김 확인
2. 회원가입 페이지에서 GNB 숨김 확인
3. 온보딩 페이지에서 GNB 숨김 확인
4. 홈 페이지에서 GNB 표시 확인
5. 소식 페이지에서 GNB 표시 확인
6. 마이페이지에서 GNB 표시 확인
7. GNB 아이콘 클릭 시 페이지 전환 확인
8. 모바일 프레임 375px 고정 너비 확인
9. 중앙 정렬 확인
10. 키보드 네비게이션 동작 확인

**테스트 항목**:
- [ ] US1: 인증되지 않은 사용자 시나리오 통과
- [ ] US2: 인증된 사용자 시나리오 통과
- [ ] US3: 모바일 환경 시나리오 통과
- [ ] 모든 기능 요구사항 충족
- [ ] 접근성 요구사항 충족

#### T025 [US3]: 다양한 기기 및 브라우저 호환성 확인
**목표**: 주요 모바일 브라우저에서 정상 동작 확인
**소요시간**: 30분
**의존성**: T024

**작업 내용**:
1. Chrome 모바일에서 테스트
2. Safari 모바일에서 테스트
3. Firefox 모바일에서 테스트 (가능한 경우)
4. 다양한 화면 크기에서 레이아웃 일관성 확인

**완료 기준**:
- [ ] 주요 모바일 브라우저에서 정상 동작
- [ ] 레이아웃 너비가 일관되게 유지됨
- [ ] GNB가 모든 브라우저에서 정상 표시됨

---

## 📊 작업 요약

### 총 작업 수
- **총 25개 작업**

### 사용자 스토리별 작업 수
- **US1 (인증되지 않은 사용자)**: 4개 작업 (T011, T014, T015, T016)
- **US2 (인증된 사용자)**: 9개 작업 (T007, T008, T009, T011, T017, T018, T019, T020, T021)
- **US3 (모바일 환경)**: 3개 작업 (T020, T021, T025)

### Phase별 작업 수
- **Phase 1 (기본 레이아웃)**: 4개 작업
- **Phase 2 (GNB 구현)**: 6개 작업
- **Phase 3 (조건부 표시)**: 9개 작업
- **Phase 4 (접근성 및 최적화)**: 6개 작업

### 병렬 처리 가능한 작업
다음 작업들은 병렬 처리 가능합니다:
- **T001, T005**: 타입 정의 작업 (서로 다른 컴포넌트)
- **T002, T006**: CSS Module 스타일 작성 (서로 다른 컴포넌트)
- **T014, T017**: Layout CSS Module 작성 (서로 다른 레이아웃)
- **T016, T019**: 페이지 구조 생성 (서로 다른 라우트 그룹)

### 의존성 순서
1. **Phase 1 완료** → Phase 2 시작 가능
2. **Phase 2 완료** → Phase 3 시작 가능
3. **Phase 3 완료** → Phase 4 시작 가능

---

## 🚀 구현 전략

### MVP 범위
**최소 기능 제품 (MVP)**은 다음 Phase까지 포함:
- Phase 1: 기본 레이아웃 구조
- Phase 2: GNB 컴포넌트 구현
- Phase 3: 조건부 표시 및 레이아웃 통합

**Phase 4 (접근성 및 최적화)**는 MVP 이후 개선 사항으로 분류됩니다.

### 점진적 전달
1. **1차 전달**: Phase 1 + Phase 2 (기본 레이아웃 + GNB)
2. **2차 전달**: Phase 3 (조건부 표시)
3. **3차 전달**: Phase 4 (접근성 및 최적화)

### 독립적 테스트 기준
각 Phase는 완료 후 독립적으로 테스트 가능합니다:
- **Phase 1 완료**: Mobile Frame이 모든 페이지에 적용됨
- **Phase 2 완료**: GNB가 정상적으로 표시되고 네비게이션 동작함
- **Phase 3 완료**: 페이지별 GNB 표시/숨김이 정상 동작함
- **Phase 4 완료**: 접근성 및 성능 요구사항 충족

---

## ✅ 완료 체크리스트

### Phase 1 완료 기준
- [x] Mobile Frame 컴포넌트가 정상적으로 렌더링됨
- [x] 375px 고정 너비로 표시됨
- [x] 중앙 정렬 및 배경색이 적용됨
- [x] Root Layout에 Mobile Frame이 통합됨

### Phase 2 완료 기준
- [x] GNB 컴포넌트가 화면 하단에 고정됨
- [x] 3개 아이콘이 올바른 순서로 배치됨
- [x] 각 아이콘 클릭 시 해당 페이지로 이동함
- [x] 접근성 속성이 모두 적용됨

### Phase 3 완료 기준
- [x] 로그인/회원가입/온보딩 페이지에서 GNB가 숨겨짐
- [x] 홈/소식/마이페이지에서 GNB가 표시됨
- [x] 콘텐츠 영역과 GNB가 겹치지 않음
- [x] 모든 라우팅이 정상 동작함

### Phase 4 완료 기준
- [x] 키보드 네비게이션이 완전히 지원됨
- [x] 스크린 리더 지원이 강화됨
- [x] 성능 최적화가 적용됨
- [x] 모든 브라우저에서 정상 동작함

---

**다음 단계**: 작업 목록을 기반으로 단계별 구현을 시작합니다.
