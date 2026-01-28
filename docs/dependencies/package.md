# 외부 라이브러리 의존성 관리

이 문서는 TimeEgg Web Frontend 프로젝트에서 사용하는 외부 라이브러리의 도입 배경, 사용처, 관리 정책을 담고 있습니다.

## 라이브러리 생명주기 및 문서화 원칙

모든 외부 패키지의 설치와 삭제는 반드시 이 문서에 기록되어야 합니다.

- **설치 시**: 도입 목적, 주요 사용처, 번들 크기를 명확히 기록
- **삭제 시**: 제거 사유와 대체 수단을 'Archived' 섹션에 기록
- **동기화**: package.json의 변경사항과 이 문서가 항상 일치해야 함

---

## 현재 사용 중인 라이브러리

### 프레임워크 및 코어

#### Next.js (v16.1.4)
- **도입 목적**: React 기반 프로덕션 프레임워크
- **주요 기능**: App Router, SSR, 이미지 최적화, 라우팅
- **사용처**: 프로젝트 전체

#### React (v19.2.3)
- **도입 목적**: UI 라이브러리
- **주요 기능**: 컴포넌트 기반 개발, 상태 관리
- **사용처**: 프로젝트 전체

#### TypeScript (v5.x)
- **도입 목적**: 타입 안전성 확보
- **주요 기능**: 정적 타입 검사, 자동완성
- **사용처**: 프로젝트 전체

---

### 상태 관리

#### @tanstack/react-query (v5.90.20)
- **도입 목적**: 서버 상태 관리 및 데이터 페칭
- **주요 사용처**: API 호출, 캐싱, 백그라운드 업데이트
- **번들 크기**: ~40KB (gzipped)
- **대안**: SWR, Redux Toolkit Query

#### @tanstack/react-query-devtools (v5.91.2)
- **도입 목적**: React Query 디버깅 도구
- **주요 사용처**: 개발 환경에서 쿼리 상태 모니터링
- **번들 크기**: 개발 환경에만 포함

---

### HTTP 클라이언트

#### axios (v1.13.4)
- **도입 목적**: HTTP 요청 라이브러리
- **주요 사용처**: `src/commons/apis/` 디렉토리 내 API 호출
- **주요 기능**: 인터셉터, 타임아웃, 요청/응답 변환
- **번들 크기**: ~13KB (gzipped)
- **대안**: Fetch API (네이티브)

---

### 서버 사이드 유틸리티 & 미들웨어

#### express (v5.2.1) 🆕
- **도입 목적**: Next.js API Route에서 간단한 OAuth 콜백 및 세션 처리용 서버 유틸리티
- **주요 사용처**: 카카오 소셜 로그인 임시 콜백 처리 및 향후 인증 관련 서버 로직
- **주요 기능**: 라우팅, 미들웨어 기반 요청 처리
- **번들 크기**: 사용되는 라우트에 한정되어 최소화 (Dynamic Import 및 API Route 내부에서만 사용)
- **대안**: Next.js 기본 Request/Response 핸들러 (복잡한 미들웨어 구성이 필요 없을 경우)

#### express-session (v1.19.0) 🆕
- **도입 목적**: 인증 관련 세션 관리 (카카오 로그인 등) 기능을 위한 세션 미들웨어
- **주요 사용처**: 인증 흐름에서 세션 기반 상태 관리가 필요한 경우 (실제 사용 여부는 향후 백엔드 연동 상황에 따라 결정)
- **주요 기능**: 세션 쿠키 발급 및 검증, 서버 사이드 세션 저장
- **번들 크기**: 서버 사이드 전용 (클라이언트 번들에 포함되지 않음)
- **대안**: JWT 기반 완전 무상태 인증 (현재 기본 전략, 세션은 보조 수단으로 활용)

#### qs (v6.14.1) 🆕
- **도입 목적**: OAuth 및 인증 관련 요청에서 복잡한 쿼리스트링을 안정적으로 직렬화/파싱
- **주요 사용처**: 카카오 로그인 등 외부 인증 연동 시 쿼리 파라미터 처리
- **주요 기능**: 중첩 객체 직렬화, 배열/객체 쿼리 파라미터 처리
- **번들 크기**: ~6KB (gzipped)
- **대안**: URLSearchParams (단, 중첩 구조 처리 한계가 있어 qs를 보조적으로 사용)

---

### 폼 관리

#### react-hook-form (v7.71.1)
- **도입 목적**: 고성능 폼 관리
- **주요 사용처**: 타임캡슐 생성, 사용자 입력 폼
- **주요 기능**: 비제어 컴포넌트, 유효성 검사, 성능 최적화
- **번들 크기**: ~9KB (gzipped)

#### @hookform/resolvers (v5.2.2)
- **도입 목적**: react-hook-form과 스키마 검증 라이브러리 통합
- **주요 사용처**: Zod 스키마와 react-hook-form 연동
- **번들 크기**: ~2KB (gzipped)

#### zod (v4.3.6)
- **도입 목적**: 타입 안전한 스키마 검증
- **주요 사용처**: 폼 유효성 검사, API 응답 검증
- **번들 크기**: ~12KB (gzipped)

---

### 스타일링

#### tailwindcss (v4.x)
- **도입 목적**: 유틸리티 우선 CSS 프레임워크
- **주요 사용처**: 프로젝트 전체 스타일링
- **주요 기능**: 디자인 토큰, 반응형 디자인, 퍼지 최적화
- **번들 크기**: 사용한 클래스만 포함 (Tree-shaking)

#### @tailwindcss/postcss (v4.x)
- **도입 목적**: Tailwind CSS PostCSS 플러그인
- **주요 사용처**: CSS 빌드 프로세스

---

### 아이콘 라이브러리

#### @remixicon/react (v4.8.0) ⭐
- **도입 목적**: 프로젝트 전체 아이콘 라이브러리 (일관성 유지)
- **주요 사용처**: 모든 컴포넌트의 아이콘
- **주요 기능**: 2000+ 오픈소스 아이콘, React 컴포넌트
- **번들 크기**: Tree-shaking 지원으로 사용한 아이콘만 번들에 포함
- **중요 정책**: 
  - ⚠️ **새로운 아이콘 패키지 추가 금지**
  - ⚠️ **@remixicon/react만 사용**
  - Figma 디자인의 아이콘을 @remixicon/react에서 찾아 매칭
- **대안**: 없음 (일관성 유지를 위해 단일 라이브러리 사용)

---

### 인터랙션 및 애니메이션

#### @use-gesture/react (v10.3.0) 🆕
- **도입 일자**: 2026-01-26
- **도입 목적**: 바텀시트 드래그 인터랙션 구현
- **주요 사용처**: `src/components/home/components/easter-egg-bottom-sheet/`
- **주요 기능**: 터치/마우스 제스처 감지, 드래그, 스와이프
- **번들 크기**: ~10KB (gzipped)
- **대안**: 네이티브 터치 이벤트 (성능 이슈 시 마이그레이션 고려)

#### @react-spring/web (v9.7.3) 🆕
- **도입 일자**: 2026-01-26
- **도입 목적**: 부드러운 애니메이션 및 물리 기반 스프링 애니메이션
- **주요 사용처**: 바텀시트 드래그 애니메이션
- **주요 기능**: 스프링 물리 기반 애니메이션, 60fps 보장
- **번들 크기**: ~20KB (gzipped)
- **대안**: CSS 애니메이션, framer-motion

---

### 성능 모니터링

#### web-vitals (v5.1.0)
- **도입 목적**: Core Web Vitals 측정
- **주요 사용처**: 성능 모니터링
- **주요 기능**: LCP, FID, CLS 등 측정
- **번들 크기**: ~3KB (gzipped)

---

### 개발 도구

#### @playwright/test (v1.58.0)
- **도입 목적**: E2E 테스트 프레임워크
- **주요 사용처**: `tests/` 디렉토리
- **주요 기능**: 크로스 브라우저 테스트, 자동화
- **번들 크기**: 개발 환경에만 포함

#### eslint (v9.x)
- **도입 목적**: 코드 품질 및 일관성 검사
- **주요 사용처**: 프로젝트 전체
- **번들 크기**: 개발 환경에만 포함

#### @next/bundle-analyzer (v16.1.4)
- **도입 목적**: 번들 크기 분석
- **주요 사용처**: 번들 최적화
- **번들 크기**: 개발 환경에만 포함

#### @svgr/webpack (v8.1.0)
- **도입 목적**: SVG를 React 컴포넌트로 변환
- **주요 사용처**: 아이콘 및 이미지 import
- **번들 크기**: 빌드 타임에만 사용

---

## 라이브러리 선택 기준

### 필수 고려사항
1. **번들 크기**: Tree-shaking 지원 여부, gzipped 크기
2. **유지보수**: 활발한 커뮤니티, 정기적인 업데이트
3. **타입 지원**: TypeScript 타입 정의 제공
4. **성능**: 런타임 성능, 렌더링 최적화
5. **호환성**: Next.js, React 19 호환성

### 도입 프로세스
1. 기존 라이브러리로 해결 가능한지 검토
2. 번들 크기 및 성능 영향 분석
3. 대안 라이브러리 비교
4. 이 문서에 도입 배경 기록
5. package.json 업데이트

### 제거 프로세스
1. 사용하지 않는 라이브러리 식별
2. 대체 수단 확인
3. 'Archived' 섹션으로 이동
4. 제거 사유 및 대체 수단 기록
5. package.json에서 제거

---

## Archived (제거된 라이브러리)

#### lucide-react (v0.563.0) (Archived)
- **제거 일자**: 2026-01-26
- **제거 사유**: 프로젝트 전체 아이콘 라이브러리 통일을 위해 @remixicon/react로 마이그레이션 완료
- **대체 수단**: @remixicon/react
- **이전 사용처**: GNB 컴포넌트 (Bell, Map, User 아이콘)
- **마이그레이션**: RiNotificationLine, RiMapLine, RiUserLine으로 교체 완료

#### remixicon-react (v1.0.0) (Archived)
- **제거 일자**: 2026-01-26
- **제거 사유**: @remixicon/react (v4.8.0)로 통일하여 일관성 유지 및 최신 버전 사용
- **대체 수단**: @remixicon/react (v4.8.0)
- **이전 사용처**: 
  - QuantitySelector 컴포넌트 (AddLineIcon, SubtractLineIcon)
  - AgreementSection 컴포넌트 (CheckboxBlankCircleLineIcon, CheckboxCircleFillIcon)
  - TimeCapsuleHeader 컴포넌트 (ArrowLeftLineIcon, More2FillIcon, CloseLineIcon)
- **마이그레이션**: @remixicon/react의 named export로 교체 완료 (RiAddLine, RiSubtractLine, RiCheckboxBlankCircleLine, RiCheckboxCircleFill, RiArrowLeftLine, RiMore2Fill, RiCloseLine)

---

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Remix Icon 공식 사이트](https://remixicon.com/)
- [Use Gesture 공식 문서](https://use-gesture.netlify.app/)
- [React Spring 공식 문서](https://www.react-spring.dev/)

---

**최종 업데이트**: 2026-01-28  
**관리자**: Development Team
