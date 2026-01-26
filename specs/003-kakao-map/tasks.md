# TimeEgg 웹 카카오 지도 통합 작업 목록

## 📋 개요

이 문서는 TimeEgg 웹 애플리케이션의 홈 페이지에 카카오 지도를 통합하기 위한 구체적인 작업 목록을 정의합니다.
모든 작업은 독립적으로 테스트 가능한 수준으로 분해되었으며, 파일 경로까지 명시되어 있습니다.

**총 작업 수**: 85개  
**우선순위**: P1 (필수) → P2 (중요) → P3 (선택)

---

## 🎯 Phase 1: 프로젝트 설정 및 기초 인프라

### 환경 변수 및 타입 정의

- [x] T001 프로젝트 구조 확인 및 기본 폴더 생성
- [x] T002 `src/commons/utils/kakao-map/config.ts`에 카카오 지도 API 키 유틸리티 함수 구현
- [x] T003 `src/commons/utils/kakao-map/types.ts`에 카카오 지도 API 타입 정의 생성
- [x] T004 `src/commons/utils/kakao-map/script-loader.ts`에 카카오 지도 스크립트 로더 구현
- [x] T005 `src/components/home/config/map-config.ts`에 지도 초기 설정값 정의

---

## 🎯 Phase 2: API 연동 레이어

### 카카오 REST API 주소 조회

- [x] T006 `src/commons/apis/kakao-map/address.ts`에 주소 조회 API 타입 정의 (Coord2RegionCodeParams, Coord2RegionCodeResponse)
- [x] T007 `src/commons/apis/kakao-map/address.ts`에 getAddressFromCoord 함수 구현 (카카오 REST API 호출)

---

## 🎯 Phase 3: E2E 테스트 인프라

### 테스트 환경 설정

- [x] T008 `tests/e2e/kakao-map/kakao-map.e2e.spec.ts`에 E2E 테스트 파일 생성
- [x] T009 `tests/e2e/kakao-map/fixtures/mockData.ts`에 테스트용 Mock 데이터 생성

---

## 🎯 Phase 4: [US1] 홈 페이지에서 지도 확인 (P1)

### 지도 훅 및 기본 컴포넌트

- [x] T010 [US1] `src/components/home/types.ts`에 Home Feature 타입 정의 생성
- [x] T011 [US1] `src/components/home/hooks/useKakaoMap.ts`에 카카오 지도 훅 구현
- [x] T012 [US1] `src/components/home/components/map-view/types.ts`에 MapView 컴포넌트 타입 정의 생성
- [x] T013 [P] [US1] `src/components/home/components/map-view/styles.module.css`에 MapView 스타일 작성 (375px 기준)
- [x] T014 [US1] `src/components/home/components/map-view/index.tsx`에 MapView 컴포넌트 구현
- [x] T015 [US1] `src/components/home/index.tsx`에 Home Feature Container 구현 (스크립트 로딩 및 지도 초기화)
- [x] T016 [US1] `src/app/(main)/page.tsx`에 Home Feature 통합

---

## 🎯 Phase 5: [US2] 지도 기본 조작 (P1)

### 지도 조작 기능 (카카오 지도 API 기본 기능 활용)

- [x] T017 [US2] `src/components/home/components/map-view/index.tsx`에 지도 드래그 이동 기능 활성화
- [x] T018 [US2] `src/components/home/components/map-view/index.tsx`에 지도 확대/축소 기능 활성화

**참고**: US2는 카카오 지도 API의 기본 기능이므로 별도 구현 없이 활성화만 필요합니다.

---

## 🎯 Phase 6: [US6] 현재 위치 및 주소 확인 (P1)

### 주소 조회 훅 및 위치 표시 컴포넌트

- [x] T019 [US6] `src/components/home/hooks/useCurrentLocation.ts`에 현재 위치 추적 훅 구현
- [x] T020 [US6] `src/components/home/hooks/useAddress.ts`에 주소 조회 훅 구현 (디바운싱 포함)
- [x] T021 [US6] `src/components/home/components/location-display/types.ts`에 LocationDisplay 컴포넌트 타입 정의 생성
- [x] T022 [P] [US6] `src/components/home/components/location-display/styles.module.css`에 LocationDisplay 스타일 작성
- [x] T023 [US6] `src/components/home/components/location-display/index.tsx`에 LocationDisplay 컴포넌트 구현 (현재 위치 마커 및 주소 표시)
- [x] T024 [US6] `src/components/home/index.tsx`에 LocationDisplay 컴포넌트 통합
- [x] T025 [US6] `src/components/home/components/map-view/index.tsx`에 지도 이동 이벤트 리스너 등록 (주소 업데이트 트리거)

---

## 🎯 Phase 7: [US4] FAB 버튼을 통한 콘텐츠 생성 선택 (P1)

### FAB 버튼 컴포넌트

- [ ] T026 [US4] `src/components/home/components/fab-button/types.ts`에 FabButton 컴포넌트 타입 정의 생성
- [ ] T027 [P] [US4] `src/components/home/components/fab-button/styles.module.css`에 FabButton 스타일 작성 (우측 하단 고정, 아이콘 전환 애니메이션, 오버레이 배경)
- [ ] T028 [US4] `src/components/home/components/fab-button/index.tsx`에 FabButton 컴포넌트 구현 (아이콘 전환, 선택 옵션 표시/숨김)
- [ ] T029 [US4] `src/components/home/index.tsx`에 FabButton 컴포넌트 통합
- [ ] T030 [US4] `src/components/home/components/fab-button/index.tsx`에 이스터에그/타임캡슐 선택 핸들러 연결 (임시 라우팅 또는 콜백)

---

## 🎯 Phase 8: [US5] 알 슬롯을 통한 알림 확인 (P2)

### 알 슬롯 컴포넌트

- [ ] T031 [US5] `src/components/home/components/egg-slot/types.ts`에 EggSlot 컴포넌트 타입 정의 생성
- [ ] T032 [P] [US5] `src/components/home/components/egg-slot/styles.module.css`에 EggSlot 스타일 작성 (우측 상단 고정, 알 개수 배지)
- [ ] T033 [US5] `src/components/home/components/egg-slot/index.tsx`에 EggSlot 컴포넌트 구현 (알 개수 표시, 모달 열기)
- [ ] T034 [US5] `src/components/home/index.tsx`에 EggSlot 컴포넌트 통합
- [ ] T035 [US5] `src/components/home/components/egg-slot/index.tsx`에 알림 모달 연동 (공용 모달 컴포넌트 사용)
- [ ] T036 [US5] `src/components/home/components/egg-slot/index.tsx`에 알 개수 0인 경우 처리

---

## 🎯 Phase 9: [US3] 지도 관리 기능 활용 (P2)

### 지도 관리 컨트롤

- [ ] T037 [US3] `src/components/home/hooks/useMapControl.ts`에 지도 관리 훅 구현
- [ ] T038 [US3] `src/components/home/components/map-controls/types.ts`에 MapControls 컴포넌트 타입 정의 생성
- [ ] T039 [P] [US3] `src/components/home/components/map-controls/styles.module.css`에 MapControls 스타일 작성
- [ ] T040 [US3] `src/components/home/components/map-controls/index.tsx`에 MapControls 컴포넌트 구현 (지도 초기화 버튼)
- [ ] T041 [US3] `src/components/home/index.tsx`에 MapControls 컴포넌트 통합

---

## 🎯 Phase 10: 에러 처리 및 최적화 (P3)

### 에러 처리

- [ ] T042 `src/commons/utils/kakao-map/config.ts`에 환경 변수 미설정 에러 처리 개선
- [ ] T043 `src/commons/utils/kakao-map/script-loader.ts`에 네트워크 오류 처리 개선
- [ ] T044 `src/commons/apis/kakao-map/address.ts`에 API 호출 실패 처리 개선
- [ ] T045 `src/components/home/components/map-view/index.tsx`에 지도 렌더링 실패 에러 처리 추가
- [ ] T046 `src/components/home/components/location-display/index.tsx`에 주소 조회 실패 에러 처리 추가

### 성능 최적화

- [ ] T047 `src/components/home/hooks/useAddress.ts`에 디바운싱 최적화 (500ms)
- [ ] T048 `src/components/home/hooks/useAddress.ts`에 주소 캐싱 로직 추가 (선택사항)
- [ ] T049 `src/components/home/components/map-view/index.tsx`에 React.memo 적용 (필요시)

### 접근성 개선

- [ ] T050 `src/components/home/components/map-view/index.tsx`에 지도 영역 접근성 레이블 추가
- [ ] T051 `src/components/home/components/map-controls/index.tsx`에 키보드 네비게이션 지원 추가
- [ ] T052 `src/components/home/components/fab-button/index.tsx`에 접근성 레이블 및 키보드 지원 추가
- [ ] T053 `src/components/home/components/egg-slot/index.tsx`에 접근성 레이블 및 키보드 지원 추가
- [ ] T054 `src/components/home/components/location-display/index.tsx`에 접근성 레이블 추가

---

## 🎯 Phase 11: 데이터 바인딩 (실제 API 연결)

### 주소 조회 API 연결

- [ ] T055 [US6] `src/components/home/hooks/useAddress.ts`에서 Mock 데이터를 실제 API 호출로 교체
- [ ] T056 [US6] `src/components/home/components/location-display/index.tsx`에 로딩 상태 표시 추가
- [ ] T057 [US6] `src/components/home/components/location-display/index.tsx`에 에러 상태 표시 추가

### 알림 데이터 연결 (향후)

- [ ] T058 [US5] `src/components/home/components/egg-slot/index.tsx`에 실제 알림 개수 API 연결 (향후 구현)
- [ ] T059 [US5] `src/components/home/components/egg-slot/index.tsx`에 알림 모달 데이터 바인딩 (향후 구현)

---

## 🎯 Phase 12: UI 테스트 (Playwright)

### 컴포넌트 단위 테스트

- [ ] T060 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 지도 렌더링 테스트 작성
- [ ] T061 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 지도 조작 테스트 작성 (드래그, 확대/축소)
- [ ] T062 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 FAB 버튼 테스트 작성
- [ ] T063 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 알 슬롯 테스트 작성
- [ ] T064 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 현재 위치 및 주소 표시 테스트 작성
- [ ] T065 [P] `tests/ui/kakao-map/kakao-map.ui.spec.ts`에 지도 관리 기능 테스트 작성

---

## 📊 작업 요약

### 우선순위별 작업 수
- **P1 (필수)**: 30개 작업
- **P2 (중요)**: 11개 작업
- **P3 (선택)**: 24개 작업

### 사용자 스토리별 작업 수
- **US1**: 7개 작업
- **US2**: 2개 작업
- **US3**: 5개 작업
- **US4**: 5개 작업
- **US5**: 6개 작업
- **US6**: 7개 작업

### 병렬 처리 가능 작업
- T013, T022, T027, T032, T039: CSS 스타일 작성 (서로 다른 파일)
- T060-T065: UI 테스트 (서로 다른 테스트 케이스)

---

## 🔄 의존성 및 실행 순서

### 필수 순서
1. **Phase 1** (T001-T005): 프로젝트 설정 및 기초 인프라
2. **Phase 2** (T006-T007): API 연동 레이어
3. **Phase 3** (T008-T009): E2E 테스트 인프라
4. **Phase 4** (T010-T016): [US1] 지도 기본 표시
5. **Phase 5** (T017-T018): [US2] 지도 기본 조작
6. **Phase 6** (T019-T025): [US6] 현재 위치 및 주소 표시
7. **Phase 7** (T026-T030): [US4] FAB 버튼
8. **Phase 8** (T031-T036): [US5] 알 슬롯
9. **Phase 9** (T037-T041): [US3] 지도 관리 기능
10. **Phase 10** (T042-T054): 에러 처리 및 최적화
11. **Phase 11** (T055-T059): 데이터 바인딩
12. **Phase 12** (T060-T065): UI 테스트

### 독립적 테스트 기준
각 사용자 스토리는 다음 기준으로 독립적으로 테스트 가능합니다:
- **US1**: 홈 페이지 접근 시 지도 표시 확인
- **US2**: 지도 드래그 및 확대/축소 동작 확인
- **US3**: 지도 초기화 버튼 클릭 시 지도 복원 확인
- **US4**: FAB 버튼 클릭 시 선택 옵션 표시 확인
- **US5**: 알 슬롯 클릭 시 모달 표시 확인
- **US6**: 지도 이동 시 주소 업데이트 확인

---

## 🎯 MVP 범위 제안

**최소 실행 가능 제품 (MVP)**은 다음 사용자 스토리로 구성됩니다:
- **US1**: 홈 페이지에서 지도 확인
- **US2**: 지도 기본 조작
- **US6**: 현재 위치 및 주소 확인

**총 MVP 작업 수**: 16개 작업 (T010-T025)

이 범위로도 사용자는 지도를 확인하고 조작하며 현재 위치의 주소를 확인할 수 있습니다.

---

## 📝 참고사항

### 모바일 프레임 완결성
- 모든 UI 컴포넌트는 375px 기준으로 설계
- `app/layout.tsx`에 정의된 모바일 프레임 안에서 완결성 있게 표시

### CSS Module 필수 사용
- 모든 컴포넌트는 `styles.module.css` 파일 필수 사용
- CSS Module 우선, 필요시에만 Tailwind CSS 보조 사용

### 환경 변수 설정
`.env.local` 파일에 다음 환경 변수 설정 필요:
- `NEXT_PUBLIC_KAKAO_MAP_API_KEY`: 카카오 지도 JavaScript API 키
- `NEXT_PUBLIC_KAKAO_REST_API_KEY`: 카카오 REST API 키 (주소 조회용)

### 주소 표시 형식
- 카카오 REST API 응답에서 `region_2depth_name` 필드 사용
- 예시: "성남시 분당구"
- 디바운싱을 통한 API 호출 최적화 (500ms)

---

**작업 생성 완료**: 2026-01-26  
**총 작업 수**: 65개  
**예상 소요 시간**: 약 40-50시간
