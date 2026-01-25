# TimeEgg RN → Web 마이그레이션 가이드

## 📋 개요

이 문서는 기존 TimeEgg React Native 프로젝트에서 웹 프로젝트로 가져올 자산과 웹에서 새롭게 설계할 부분을 정리한 가이드입니다.

---

## ✅ 기존 RN에서 가져갈 것

### 1. 디자인 시스템 (100% 재사용)

#### 색상 팔레트
```
기존 위치: TimeEgg/FE/src/constants/colors.ts
웹 적용: src/commons/styles/variables.css (CSS 변수로 변환)
```
- 모든 색상 값을 CSS 변수로 변환하여 재사용
- 다크모드 대응을 위한 구조 준비
- Tailwind CSS 설정에 통합

#### 타이포그래피
```
기존 위치: TimeEgg/FE/src/constants/typography.ts
웹 적용: src/commons/styles/fonts.css + Tailwind 설정
```
- Pretendard 폰트 파일 그대로 사용
- 폰트 크기, 줄 간격, 굵기 설정 동일 적용
- 웹폰트 최적화 추가 (프리로드, 서브셋)

#### 아이콘 시스템
```
기존 위치: TimeEgg/FE/src/assets/icons/
웹 적용: src/assets/icons/ (SVG 파일 복사)
```
- SVG 아이콘 파일 전체 복사
- 아이콘 컴포넌트 시스템 웹 버전으로 재구성
- 아이콘 네이밍 컨벤션 동일 유지

#### 간격(Spacing) 시스템
```
기존 위치: TimeEgg/FE/src/constants/spacing.ts
웹 적용: tailwind.config.js (spacing 설정)
```
- 4px 기반 간격 시스템 동일 적용
- Tailwind의 spacing 설정으로 통합

### 2. 비즈니스 로직 (개념적 재사용)

#### 사용자 인증 플로우
```
기존: React Native AsyncStorage + Context
웹: React Context + localStorage/sessionStorage
```
- 로그인/로그아웃 플로우 동일
- 토큰 관리 방식 유사 (저장소만 변경)
- 인증 상태 관리 로직 재사용

#### 데이터 모델 및 타입
```
기존 위치: TimeEgg/FE/src/types/
웹 적용: src/commons/types/
```
- User, Capsule, Location 등 핵심 타입 정의 재사용
- API 요청/응답 타입 동일 적용
- 비즈니스 규칙 및 유효성 검사 로직

#### API 엔드포인트 및 함수
```
기존 위치: TimeEgg/FE/src/api/
웹 적용: src/commons/apis/
```
- API 엔드포인트 URL 동일 사용
- 요청/응답 처리 로직 유사 구조
- 에러 처리 방식 일관성 유지

### 3. 상태 관리 패턴

#### 전역 상태 구조
```
기존: Context API + useReducer
웹: React Context + useReducer (동일한 패턴 유지)
```
- 인증 상태, 사용자 정보, 앱 설정 등
- 상태 업데이트 로직 유사 패턴
- 상태 지속성(persistence) 방식만 변경

#### 로컬 상태 관리
```
기존: useState, useEffect 패턴
웹: 동일한 React 훅 패턴 + React Query 추가
```
- 컴포넌트 레벨 상태 관리 방식 동일
- 폼 상태 관리 패턴 재사용
- 사용자 상호작용 상태 처리 방식

### 4. 유틸리티 함수 (90% 재사용)

#### 날짜/시간 처리
```
기존 위치: TimeEgg/FE/src/utils/date.ts
웹 적용: src/commons/utils/date.ts
```
- 날짜 포맷팅 함수 동일 사용
- 상대 시간 표시 로직 재사용
- 타임존 처리 방식 동일

#### 문자열 처리 및 검증
```
기존 위치: TimeEgg/FE/src/utils/validation.ts
웹 적용: src/commons/utils/validation.ts
```
- 이메일, 비밀번호 유효성 검사
- 텍스트 길이 제한 및 포맷팅
- 사용자 입력 sanitization

#### 수학적 계산 (거리, 좌표 등)
```
기존 위치: TimeEgg/FE/src/utils/geo.ts
웹 적용: src/commons/utils/geo.ts
```
- 위치 간 거리 계산
- 좌표 변환 로직
- 지도 관련 수학 함수

---

## 🔄 웹에서 대체 설계할 것

### 1. 플랫폼별 기능 대체

#### 네비게이션 시스템
```
기존: React Navigation (Stack, Tab, Drawer)
웹: Next.js App Router (파일 기반 라우팅)
```
**대체 설계**:
- Stack Navigation → 페이지 라우팅 + 브라우저 히스토리
- Tab Navigation → 상단/하단 네비게이션 바
- Modal Navigation → 모달 컴포넌트 + URL 상태 관리

#### 위치 서비스
```
기존: react-native-geolocation
웹: Web Geolocation API + 권한 관리
```
**대체 설계**:
- 브라우저 Geolocation API 사용
- 위치 권한 요청 UX 웹 최적화
- 위치 정확도 및 오차 처리 방식 조정

#### 로컬 저장소
```
기존: AsyncStorage
웹: localStorage + sessionStorage + IndexedDB
```
**대체 설계**:
- 간단한 설정: localStorage
- 세션 데이터: sessionStorage  
- 대용량 데이터: IndexedDB (React Query 캐시)
- 오프라인 지원을 위한 캐싱 전략

### 2. 지도 시스템 재설계

#### 지도 라이브러리
```
기존: react-native-maps (Google/Apple Maps)
웹: Kakao Map API (웹 버전)
```
**대체 설계**:
- Kakao Map JavaScript API 사용
- 웹 최적화된 지도 컨트롤
- 터치/마우스 상호작용 최적화
- 반응형 지도 크기 조정

#### 지도 성능 최적화
```
기존: 네이티브 렌더링 성능
웹: 웹 성능 최적화 전략
```
**대체 설계**:
- 지도 타일 캐싱 전략
- 마커 클러스터링 최적화
- 뷰포트 기반 데이터 로딩
- 지도 레이어 관리 시스템

### 3. 이미지 처리 시스템

#### 이미지 업로드/처리
```
기존: react-native-image-picker + 네이티브 압축
웹: HTML5 File API + Canvas 압축
```
**대체 설계**:
- 웹 파일 선택 인터페이스 (drag & drop 지원)
- Canvas API를 이용한 클라이언트 압축
- 프로그레시브 업로드 (청크 단위)
- WebP/AVIF 포맷 지원

#### 이미지 최적화
```
기존: 네이티브 이미지 캐싱
웹: Next.js Image 최적화 + CDN
```
**대체 설계**:
- next/image 컴포넌트 활용
- 반응형 이미지 (srcset, sizes)
- 지연 로딩 및 placeholder
- 이미지 CDN 통합

### 4. 푸시 알림 대체

#### 알림 시스템
```
기존: React Native Push Notifications
웹: Web Push API + Service Worker (향후)
```
**대체 설계**:
- 브라우저 알림 권한 관리
- Service Worker 기반 백그라운드 알림
- 인앱 알림 시스템 (Toast, Banner)
- 이메일 알림 대체 방안

### 5. 애니메이션 시스템

#### 애니메이션 라이브러리
```
기존: React Native Animated API
웹: Framer Motion + CSS Animations
```
**대체 설계**:
- 페이지 전환 애니메이션
- 컴포넌트 상태 변화 애니메이션
- 제스처 기반 상호작용 (스와이프, 핀치)
- 성능 최적화된 애니메이션

### 6. 오프라인 지원

#### 오프라인 기능
```
기존: 네이티브 앱 캐싱
웹: Service Worker + Cache API
```
**대체 설계**:
- PWA (Progressive Web App) 구조
- 오프라인 우선 데이터 동기화
- 백그라운드 동기화
- 오프라인 상태 UI/UX

---

## 🔧 마이그레이션 전략

### Phase 1: 기본 인프라 (현재)
1. **디자인 시스템 이식**: 색상, 폰트, 아이콘 → CSS 변수 + Tailwind
2. **프로젝트 구조**: Feature Slice Architecture 적용
3. **기본 라우팅**: Next.js App Router 설정
4. **상태 관리**: React Context + React Query 기본 구조

### Phase 2: 핵심 기능 이식
1. **인증 시스템**: RN Context → React Context 구조 개선
2. **API 통신**: RN fetch → Axios + React Query
3. **지도 기본**: react-native-maps → Kakao Map API
4. **이미지 처리**: RN ImagePicker → Web File API

### Phase 3: 고급 기능 구현
1. **실시간 기능**: WebSocket 연결
2. **오프라인 지원**: Service Worker + PWA
3. **성능 최적화**: 번들 분할, 캐싱 전략
4. **접근성**: 웹 표준 준수

### Phase 4: 웹 특화 기능
1. **SEO 최적화**: 메타데이터, 구조화된 데이터
2. **소셜 공유**: Open Graph, Twitter Cards
3. **웹 전용 기능**: 키보드 단축키, 우클릭 메뉴
4. **데스크톱 최적화**: 마우스 호버, 큰 화면 레이아웃

---

## 📊 마이그레이션 우선순위

### 높은 우선순위 (P1)
- ✅ 디자인 시스템 (색상, 폰트, 아이콘)
- ✅ 기본 프로젝트 구조 및 라우팅
- ✅ 인증 시스템 기본 구조
- 🔄 API 통신 기본 구조

### 중간 우선순위 (P2)
- 지도 시스템 기본 기능
- 이미지 업로드/처리 시스템
- 캡슐 CRUD 기능
- 사용자 프로필 관리

### 낮은 우선순위 (P3)
- 실시간 알림 시스템
- 고급 지도 기능 (클러스터링, 히트맵)
- PWA 기능
- 소셜 공유 기능

---

## 🎯 성공 지표

### 기술적 호환성
- [ ] 기존 API 100% 호환
- [ ] 디자인 시스템 95% 일치
- [ ] 핵심 기능 100% 동작
- [ ] 성능 지표 모바일 앱 대비 90% 수준

### 사용자 경험
- [ ] 기존 사용자 워크플로우 100% 지원
- [ ] 웹 특화 기능 추가 (키보드, 마우스)
- [ ] 접근성 WCAG 2.1 AA 수준
- [ ] 모바일/데스크톱 반응형 지원

### 개발 효율성
- [ ] 코드 재사용률 70% 이상
- [ ] 개발 속도 기존 대비 120%
- [ ] 유지보수성 향상
- [ ] 팀 온보딩 시간 단축

---

## 📝 체크리스트

### 디자인 시스템 이식
- [ ] 색상 팔레트 CSS 변수 변환 완료
- [ ] Pretendard 폰트 웹 최적화 적용
- [ ] 아이콘 SVG 파일 정리 및 접근성 확보
- [ ] Tailwind CSS 커스텀 설정 통합

### 기능 대체 설계
- [ ] 지도 시스템 웹 버전 설계 완료
- [ ] 이미지 처리 웹 API 전략 수립
- [ ] 오프라인 지원 PWA 구조 계획
- [ ] 알림 시스템 웹 대체 방안 확정

### 성능 최적화
- [ ] 번들 사이즈 최적화 전략
- [ ] 이미지 최적화 파이프라인
- [ ] 캐싱 전략 수립
- [ ] Core Web Vitals 목표 설정