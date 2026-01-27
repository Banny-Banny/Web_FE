# 작업 목록: 카카오 지도 이스터에그 표시 및 조회

## 개요

이 문서는 "카카오 지도 이스터에그 표시 및 조회" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/007-easter-egg-map-display/spec.md`
- 기술 계획: `specs/007-easter-egg-map-display/plan.md`

**총 작업 수**: 68개
**예상 소요 기간**: 10-14일 (개발자 1명 기준)

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 | 작업 수 |
|-----------|------|---------|
| US1 | 지도 진입 시 자동 발견 성공 | 15개 |
| US2 | 지도 이동 중 자동 발견 성공 | 5개 |
| US3 | 마커 클릭을 통한 캡슐 조회 | 8개 |
| US4 | 내 캡슐 조회 | 6개 |
| US5 | 친구 이스터에그 발견 성공 (30m 이내) | 8개 |
| US6 | 친구 이스터에그 힌트 확인 (30m 밖) | 4개 |
| 공통 | 설정 및 테스트 | 22개 |

---

## Phase 1: API 함수 및 타입 정의

### 타입 정의

- [ ] T001 src/commons/apis/easter-egg/types.ts 수정
  - `GetCapsulesRequest` 인터페이스 추가
    - `lat` (number, required)
    - `lng` (number, required)
    - `radius_m` (number, optional, default 300)
    - `limit` (number, optional, default 50)
    - `cursor` (string, optional)
    - `include_consumed` (boolean, optional, default false)
    - `include_locationless` (boolean, optional, default false)
  - `GetCapsuleRequest` 인터페이스 추가
    - `id` (string, required)
    - `lat` (number, required)
    - `lng` (number, required)
  - `RecordCapsuleViewRequest` 인터페이스 추가
    - `lat` (number, optional, -90~90)
    - `lng` (number, optional, -180~180)
  - `CapsuleType` 타입 추가: `'EASTER_EGG' | 'TIME_CAPSULE'`
  - `CapsuleItem` 인터페이스 추가
    - `id`, `title`, `content`, `open_at`, `is_locked`, `view_limit`, `view_count`, `can_open`
    - `latitude`, `longitude`, `distance_m`, `type`, `is_mine`
    - `media_types`, `media_urls`, `media_items`, `product`
  - `GetCapsulesResponse` 인터페이스 추가
    - `items` (CapsuleItem[])
    - `page_info` (object | null)
  - `GetCapsuleResponse` 인터페이스 추가
    - `id`, `title`, `content`, `open_at`, `is_locked`, `view_limit`, `view_count`
    - `media_types`, `media_urls`, `media_items`, `author`, `viewers`, `created_at`
  - `RecordCapsuleViewResponse` 인터페이스 추가
    - `success` (boolean)
    - `message` (string)
    - `is_first_view` (boolean)
  - `ViewerInfo` 인터페이스 추가
    - `id`, `nickname`, `profile_img`, `viewed_at`
  - `GetCapsuleViewersResponse` 인터페이스 추가
    - `capsule_id`, `total_viewers`, `view_limit`, `viewers` (ViewerInfo[])
  - 파일: `src/commons/apis/easter-egg/types.ts`

### API 함수 구현

- [ ] T002 src/commons/apis/easter-egg/index.ts 수정
  - `getCapsules` 함수 추가
    - `GetCapsulesRequest` 파라미터 받기
    - Query 파라미터로 lat, lng, radius_m 등 전달
    - `apiClient.get`를 사용한 API 호출
    - `GetCapsulesResponse` 반환
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [ ] T003 src/commons/apis/easter-egg/index.ts 수정
  - `getCapsule` 함수 추가
    - `id` (string), `lat` (number), `lng` (number) 파라미터 받기
    - Path 파라미터로 id 전달
    - Query 파라미터로 lat, lng 전달
    - `apiClient.get`를 사용한 API 호출
    - `GetCapsuleResponse` 반환
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [ ] T004 src/commons/apis/easter-egg/index.ts 수정
  - `recordCapsuleView` 함수 추가
    - `id` (string), `data` (RecordCapsuleViewRequest, optional) 파라미터 받기
    - Path 파라미터로 id 전달
    - Body에 lat, lng 선택적 전달
    - `apiClient.post`를 사용한 API 호출
    - `RecordCapsuleViewResponse` 반환
    - 에러 발생 시에도 사용자 경험에 영향 없도록 처리
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [ ] T005 src/commons/apis/easter-egg/index.ts 수정
  - `getCapsuleViewers` 함수 추가
    - `id` (string) 파라미터 받기
    - Path 파라미터로 id 전달
    - `apiClient.get`를 사용한 API 호출
    - `GetCapsuleViewersResponse` 반환
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [ ] T006 src/commons/apis/endpoints.ts 확인 및 수정
  - `GET_CAPSULES` 엔드포인트 상수 추가
  - `GET_CAPSULE` 엔드포인트 상수 추가
  - `RECORD_CAPSULE_VIEW` 엔드포인트 상수 추가
  - `GET_CAPSULE_VIEWERS` 엔드포인트 상수 추가
  - 파일: `src/commons/apis/endpoints.ts`

---

## Phase 2: 거리 계산 유틸리티 구현

### 거리 계산 함수

- [ ] T007 [P] src/commons/utils/distance/calculate-distance.ts 생성
  - `calculateDistance` 함수 구현
    - Haversine formula 사용
    - `lat1`, `lng1`, `lat2`, `lng2` 파라미터 받기
    - 미터 단위로 거리 반환
    - `toRadians` 헬퍼 함수 구현
  - 파일: `src/commons/utils/distance/calculate-distance.ts`

---

## Phase 3: E2E 테스트 (API 함수 테스트)

### 환경 변수 설정

- [ ] T008 .env.local 파일에 테스트 로그인용 환경 변수 설정
  - `NEXT_PUBLIC_PHONE_NUMBER`: 테스트용 전화번호
  - `NEXT_PUBLIC_EMAIL`: 테스트용 이메일
  - `NEXT_PUBLIC_PASSWORD`: 테스트용 비밀번호
  - **참고**: 이 환경 변수들은 E2E 테스트에서 인증된 사용자로 API를 호출하기 위해 필요합니다
  - 파일: `.env.local`

### 로그인 헬퍼 함수

- [ ] T009 tests/e2e/easter-egg-map-display/fixtures/mockData.ts에 테스트 계정 정보 추가
  - 기존 패턴 참조: `tests/e2e/login/fixtures/mockData.ts`
  - 환경 변수에서 테스트 계정 정보 가져오기 (NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_EMAIL, NEXT_PUBLIC_PASSWORD)
  - `testLoginRequest` 객체 생성 (LocalLoginRequest 타입)
  - 파일: `tests/e2e/easter-egg-map-display/fixtures/mockData.ts`

- [ ] T009-1 tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts에 로그인 헬퍼 함수 추가
  - 기존 패턴 참조: `tests/e2e/slot-management/slot-management-ui.e2e.spec.ts`의 `login` 함수
  - `localLogin`을 `@/commons/apis/auth/login`에서 import
  - `mockData.ts`에서 `testLoginRequest` import
  - `login` 헬퍼 함수 구현
    - `localLogin` API 호출하여 토큰 발급
    - 홈 페이지로 이동
    - localStorage에 토큰 저장
    - 페이지 새로고침하여 토큰 적용
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

### E2E 테스트 작성

- [ ] T010 tests/e2e/easter-egg-map-display/fixtures/mockData.ts에 캡슐 Mock 데이터 추가
  - 캡슐 목록 Mock 데이터 생성
  - 캡슐 기본 정보 Mock 데이터 생성
  - 발견자 목록 Mock 데이터 생성
  - 파일: `tests/e2e/easter-egg-map-display/fixtures/mockData.ts`

- [ ] T011 [US1] tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts 생성
  - `setupAuthenticatedPage` 헬퍼 함수 사용하여 인증 설정
  - 지도 진입 시 캡슐 목록 조회 API 테스트
  - `getCapsules` 함수 직접 테스트
  - Query 파라미터 검증 (lat, lng, radius_m)
  - 성공 응답 검증
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

- [ ] T012 [US3] tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts에 마커 클릭 시 캡슐 기본 정보 조회 테스트 추가
  - `getCapsule` 함수 직접 테스트
  - Path 파라미터 및 Query 파라미터 검증
  - 성공 응답 검증
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

- [ ] T013 [US5] tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts에 발견 기록 API 테스트 추가
  - `recordCapsuleView` 함수 직접 테스트
  - 첫 발견 시나리오 테스트 (is_first_view: true)
  - 중복 발견 시나리오 테스트 (is_first_view: false)
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

- [ ] T014 [US4] tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts에 발견자 목록 조회 테스트 추가
  - `getCapsuleViewers` 함수 직접 테스트
  - 성공 응답 검증
  - 빈 배열 응답 검증
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

- [ ] T015 [US5] tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts에 에러 케이스 테스트 추가
  - 400 에러 (잘못된 파라미터)
  - 401 에러 (인증 실패)
  - 404 에러 (캡슐 미존재)
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

---

## Phase 4: 캡슐 마커 표시 로직 구현 (Mock 데이터 기반)

### 훅 구현

- [ ] T016 src/components/home/hooks/useCapsuleMarkers.ts 생성
  - React Query를 활용한 캡슐 목록 조회
  - Query Key: `['capsules', lat, lng, radius_m]`
  - 캐시 시간: 5분, Stale Time: 1분
  - Mock 데이터 반환 (초기 구현)
  - `capsules`, `isLoading`, `error` 반환
  - 파일: `src/components/home/hooks/useCapsuleMarkers.ts`

### 마커 컴포넌트 구현

- [ ] T017 [P] [US1] src/components/home/components/capsule-markers/types.ts 생성
  - `CapsuleMarkersProps` 인터페이스 정의
    - `map` (KakaoMap | null)
    - `capsules` (CapsuleItem[])
    - `onMarkerClick` (capsule: CapsuleItem) => void
  - 파일: `src/components/home/components/capsule-markers/types.ts`

- [ ] T018 [P] [US1] src/components/home/components/capsule-markers/index.tsx 생성
  - 카카오 지도 CustomOverlay 또는 Marker API 활용
  - 캡슐 타입별 마커 아이콘 구분 (EASTER_EGG, TIME_CAPSULE)
  - 마커 생성 및 제거 로직
  - 마커 클릭 이벤트 처리
  - Mock 데이터 기반 구현
  - 파일: `src/components/home/components/capsule-markers/index.tsx`

- [ ] T019 [P] [US1] src/components/home/components/capsule-markers/styles.module.css 생성
  - 캡슐 마커 스타일 정의
  - 이스터에그 마커 스타일
  - 타임캡슐 마커 스타일
  - 375px 기준 스타일
  - 파일: `src/components/home/components/capsule-markers/styles.module.css`

- [ ] T020 [US1] src/components/home/components/map-view/index.tsx 수정
  - `CapsuleMarkers` 컴포넌트 통합
  - `useCapsuleMarkers` 훅 사용
  - 마커 클릭 핸들러 연결
  - 파일: `src/components/home/components/map-view/index.tsx`

---

## Phase 5: 실시간 위치 추적 구현

### 위치 추적 훅 구현

- [ ] T021 src/components/home/hooks/useLocationTracking.ts 생성
  - Geolocation API watchPosition 활용
  - 위치 업데이트 주기 최적화 (배터리 고려)
  - `latitude`, `longitude`, `isTracking`, `error` 상태 관리
  - `startTracking`, `stopTracking` 함수 제공
  - 에러 처리 및 재시도 로직
  - 파일: `src/components/home/hooks/useLocationTracking.ts`

---

## Phase 6: 자동 발견 감지 로직 구현

### 자동 발견 훅 구현

- [ ] T022 [US1] src/components/home/hooks/useAutoDiscovery.ts 생성
  - 거리 계산 유틸리티 활용
  - 30m 이내 친구 캡슐 감지 로직
  - 여러 캡슐 동시 발견 시 우선순위 처리 (가장 가까운 것 우선)
  - `discoveredCapsule`, `isChecking` 상태 관리
  - `checkDiscovery`, `clearDiscovery` 함수 제공
  - 파일: `src/components/home/hooks/useAutoDiscovery.ts`

- [ ] T023 [US1] src/components/home/index.tsx 수정
  - `useLocationTracking` 훅 통합
  - `useAutoDiscovery` 훅 통합
  - 지도 로드 시 위치 추적 시작
  - 위치 업데이트 시 자동 발견 감지
  - 발견된 캡슐 상태 관리
  - 파일: `src/components/home/index.tsx`

---

## Phase 7: 마커 클릭 이벤트 처리 및 정보 조회 (Mock 데이터 기반)

### 마커 클릭 처리

- [ ] T024 [US3] src/components/home/hooks/useCapsuleDetail.ts 생성
  - React Query를 활용한 캡슐 기본 정보 조회
  - Query Key: `['capsule', id, lat, lng]`
  - 캐시 시간: 10분, Stale Time: 5분
  - Mock 데이터 반환 (초기 구현)
  - `capsule`, `isLoading`, `error` 반환
  - 파일: `src/components/home/hooks/useCapsuleDetail.ts`

- [ ] T025 [US3] src/components/home/index.tsx 수정
  - 마커 클릭 핸들러 구현
  - `useCapsuleDetail` 훅 사용
  - 소유자 및 거리 조건 판단 로직
  - 조건별 모달 표시 상태 관리
  - 파일: `src/components/home/index.tsx`

---

## Phase 8: 조건별 모달 UI 구현 (Mock 데이터 기반)

### 내 캡슐 모달

- [ ] T026 [P] [US4] src/components/home/components/my-capsule-modal/types.ts 생성
  - `MyCapsuleModalProps` 인터페이스 정의
    - `isOpen` (boolean)
    - `capsule` (GetCapsuleResponse)
    - `viewers` (GetCapsuleViewersResponse | null)
    - `onClose` () => void
  - 파일: `src/components/home/components/my-capsule-modal/types.ts`

- [ ] T027 [P] [US4] src/components/home/components/my-capsule-modal/index.tsx 생성
  - Figma 디자인 기반 UI 구현 (node-id=600-6931, node-id=600-7114)
  - 발견자 목록 표시
  - 발견자 수, 상태 정보 표시
  - 모달 열기/닫기 기능
  - Mock 데이터 기반 구현
  - 파일: `src/components/home/components/my-capsule-modal/index.tsx`

- [ ] T028 [P] [US4] src/components/home/components/my-capsule-modal/styles.module.css 생성
  - 내 캡슐 모달 스타일 정의
  - 375px 기준 스타일
  - 파일: `src/components/home/components/my-capsule-modal/styles.module.css`

### 발견 성공 모달

- [ ] T029 [P] [US5] src/components/home/components/discovery-modal/types.ts 생성
  - `DiscoveryModalProps` 인터페이스 정의
    - `isOpen` (boolean)
    - `capsule` (GetCapsuleResponse)
    - `onClose` () => void
    - `onDiscoveryRecorded` (() => void, optional)
  - 파일: `src/components/home/components/discovery-modal/types.ts`

- [ ] T030 [P] [US5] src/components/home/components/discovery-modal/index.tsx 생성
  - Figma 디자인 기반 UI 구현
    - 텍스트 + 이미지 (node-id=599-6755)
    - 텍스트 + 이미지 + 음원 + 영상 (node-id=599-6801)
    - 텍스트 + 음원 (node-id=599-6868)
  - 콘텐츠 타입별 UI 분기
  - 모달 열기/닫기 기능
  - Mock 데이터 기반 구현
  - 파일: `src/components/home/components/discovery-modal/index.tsx`

- [ ] T031 [P] [US5] src/components/home/components/discovery-modal/styles.module.css 생성
  - 발견 성공 모달 스타일 정의
  - 콘텐츠 타입별 스타일
  - 375px 기준 스타일
  - 파일: `src/components/home/components/discovery-modal/styles.module.css`

### 힌트 모달

- [ ] T032 [P] [US6] src/components/home/components/hint-modal/types.ts 생성
  - `HintModalProps` 인터페이스 정의
    - `isOpen` (boolean)
    - `capsule` (GetCapsuleResponse)
    - `onClose` () => void
  - 파일: `src/components/home/components/hint-modal/types.ts`

- [ ] T033 [P] [US6] src/components/home/components/hint-modal/index.tsx 생성
  - Figma 디자인 기반 UI 구현 (node-id=291-1176, node-id=291-1301)
  - 위치 힌트 정보 표시
  - 실제 콘텐츠는 표시하지 않음
  - 모달 열기/닫기 기능
  - Mock 데이터 기반 구현
  - 파일: `src/components/home/components/hint-modal/index.tsx`

- [ ] T034 [P] [US6] src/components/home/components/hint-modal/styles.module.css 생성
  - 힌트 모달 스타일 정의
  - 375px 기준 스타일
  - 파일: `src/components/home/components/hint-modal/styles.module.css`

### 모달 통합

- [ ] T035 [US3] src/components/home/index.tsx 수정
  - `MyCapsuleModal` 컴포넌트 통합
  - `DiscoveryModal` 컴포넌트 통합
  - `HintModal` 컴포넌트 통합
  - 조건별 모달 표시 로직
  - 파일: `src/components/home/index.tsx`

---

## Phase 9: 발견 기록 저장 로직 구현 (Mock 데이터 기반)

### 발견 기록 훅 구현

- [ ] T036 [US5] src/components/home/hooks/useRecordCapsuleView.ts 생성
  - React Query Mutation 활용
  - `recordCapsuleView` API 호출
  - Optimistic Update 적용
  - 에러 발생 시에도 사용자 경험에 영향 없도록 처리
  - 중복 요청 방지
  - Mock 데이터 기반 구현 (초기)
  - 파일: `src/components/home/hooks/useRecordCapsuleView.ts`

- [ ] T037 [US5] src/components/home/components/discovery-modal/index.tsx 수정
  - 모달 진입 시점에 발견 기록 저장
  - `useRecordCapsuleView` 훅 사용
  - 백그라운드 처리
  - 파일: `src/components/home/components/discovery-modal/index.tsx`

---

## Phase 10: 발견자 목록 조회 로직 구현 (Mock 데이터 기반)

### 발견자 목록 훅 구현

- [ ] T038 [US4] src/components/home/hooks/useCapsuleViewers.ts 생성
  - React Query를 활용한 발견자 목록 조회
  - Query Key: `['capsule-viewers', id]`
  - 캐시 시간: 5분, Stale Time: 1분
  - Mock 데이터 반환 (초기 구현)
  - `viewers`, `isLoading`, `error` 반환
  - 파일: `src/components/home/hooks/useCapsuleViewers.ts`

- [ ] T039 [US4] src/components/home/components/my-capsule-modal/index.tsx 수정
  - `useCapsuleViewers` 훅 사용
  - 발견자 목록 조회 및 표시
  - 파일: `src/components/home/components/my-capsule-modal/index.tsx`

---

## Phase 11: 데이터 바인딩 (Mock → 실제 API)

### 캡슐 목록 조회 바인딩

- [ ] T040 [US1] src/components/home/hooks/useCapsuleMarkers.ts 수정
  - Mock 데이터를 실제 `getCapsules` API 호출로 교체
  - React Query `useQuery` 활용
  - 로딩/에러 상태 처리
  - 파일: `src/components/home/hooks/useCapsuleMarkers.ts`

### 캡슐 기본 정보 조회 바인딩

- [ ] T041 [US3] src/components/home/hooks/useCapsuleDetail.ts 수정
  - Mock 데이터를 실제 `getCapsule` API 호출로 교체
  - React Query `useQuery` 활용
  - 로딩/에러 상태 처리
  - 파일: `src/components/home/hooks/useCapsuleDetail.ts`

### 발견 기록 저장 바인딩

- [ ] T042 [US5] src/components/home/hooks/useRecordCapsuleView.ts 수정
  - Mock 데이터를 실제 `recordCapsuleView` API 호출로 교체
  - React Query `useMutation` 활용
  - 파일: `src/components/home/hooks/useRecordCapsuleView.ts`

### 발견자 목록 조회 바인딩

- [ ] T043 [US4] src/components/home/hooks/useCapsuleViewers.ts 수정
  - Mock 데이터를 실제 `getCapsuleViewers` API 호출로 교체
  - React Query `useQuery` 활용
  - 로딩/에러 상태 처리
  - 파일: `src/components/home/hooks/useCapsuleViewers.ts`

---

## Phase 12: 자동 발견 감지 로직 개선 (실제 거리 계산)

- [ ] T044 [US1] src/components/home/hooks/useAutoDiscovery.ts 수정
  - 실제 거리 계산 유틸리티 활용
  - 실제 위치 데이터 기반 감지
  - 파일: `src/components/home/hooks/useAutoDiscovery.ts`

- [ ] T045 [US2] src/components/home/index.tsx 수정
  - 지도 이동 시 위치 추적 로직 개선
  - 실시간 거리 계산 및 자동 발견 감지
  - 파일: `src/components/home/index.tsx`

---

## Phase 13: 오류 처리 및 최적화

### 에러 처리

- [ ] T046 [US5] src/components/home/components/map-view/index.tsx 수정
  - 캡슐 목록 조회 실패 시 에러 처리
  - 사용자에게 적절한 오류 메시지 표시
  - 재시도 옵션 제공
  - 파일: `src/components/home/components/map-view/index.tsx`

- [ ] T047 [US6] src/components/home/index.tsx 수정
  - 마커 클릭 시 정보 조회 실패 에러 처리
  - 사용자에게 적절한 오류 메시지 표시
  - 모달 닫기 처리
  - 파일: `src/components/home/index.tsx`

- [ ] T048 src/components/home/hooks/useLocationTracking.ts 수정
  - 위치 추적 실패 시 에러 처리
  - 기본값 또는 오류 메시지 처리
  - 파일: `src/components/home/hooks/useLocationTracking.ts`

### 성능 최적화

- [ ] T049 src/components/home/components/capsule-markers/index.tsx 수정
  - 마커 렌더링 최적화
  - 마커 클러스터링 고려 (선택사항)
  - 파일: `src/components/home/components/capsule-markers/index.tsx`

- [ ] T048 src/components/home/hooks/useLocationTracking.ts 수정
  - 위치 추적 주기 최적화 (배터리 고려)
  - 지도 이동 시에만 추적하도록 개선
  - 파일: `src/components/home/hooks/useLocationTracking.ts`

---

## Phase 14: UI 테스트 (Playwright)

### UI 테스트 작성

- [ ] T051 [P] [US1] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts 생성
  - 캡슐 마커 렌더링 테스트
  - 캡슐 타입별 마커 구분 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

- [ ] T052 [P] [US3] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts에 마커 클릭 이벤트 테스트 추가
  - 마커 클릭 시 모달 표시 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

- [ ] T053 [P] [US4] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts에 내 캡슐 모달 테스트 추가
  - 내 캡슐 모달 렌더링 테스트
  - 발견자 목록 표시 테스트
  - 모달 열기/닫기 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

- [ ] T054 [P] [US5] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts에 발견 성공 모달 테스트 추가
  - 발견 성공 모달 렌더링 테스트
  - 콘텐츠 타입별 UI 분기 테스트
  - 모달 열기/닫기 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

- [ ] T055 [P] [US6] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts에 힌트 모달 테스트 추가
  - 힌트 모달 렌더링 테스트
  - 모달 열기/닫기 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

- [ ] T056 [P] [US1] tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts에 자동 발견 모달 테스트 추가
  - 지도 진입 시 자동 발견 모달 표시 테스트
  - 지도 이동 중 자동 발견 모달 표시 테스트
  - 파일: `tests/ui/easter-egg-map-display/easter-egg-map-display.ui.spec.ts`

---

## Phase 15: 통합 및 최종 검증

### 통합 테스트

- [ ] T057 [US1] 전체 플로우 통합 테스트
  - 지도 진입 → 마커 표시 → 자동 발견 → 모달 표시
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

- [ ] T058 [US3] 마커 클릭 플로우 통합 테스트
  - 마커 클릭 → 정보 조회 → 조건별 모달 표시
  - 파일: `tests/e2e/easter-egg-map-display/easter-egg-map-display.e2e.spec.ts`

### 성능 검증

- [ ] T059 성능 목표 달성 검증
  - 캡슐 목록 조회 3초 이내
  - 기본 정보 조회 2초 이내
  - 거리 계산 100ms 이내
  - 자동 발견 감지 지연 1초 이내

### 접근성 검증

- [ ] T060 접근성 검증
  - 마커 스크린 리더 접근 가능
  - 모달 키보드 조작 가능
  - 오류 메시지 스크린 리더 읽기 가능

---

## 의존성 및 병렬 처리

### 순차 실행이 필요한 작업

- Phase 1 (API 함수) → Phase 3 (E2E 테스트)
- Phase 2 (거리 계산) → Phase 6 (자동 발견 감지)
- Phase 4 (마커 표시) → Phase 7 (마커 클릭 처리)
- Phase 5 (위치 추적) → Phase 6 (자동 발견 감지)
- Phase 7 (마커 클릭) → Phase 8 (모달 UI)
- Phase 8 (모달 UI) → Phase 11 (데이터 바인딩)

### 병렬 처리 가능한 작업 ([P] 마커)

- Phase 4: 모달 컴포넌트 타입 정의 (T024, T027, T030)
- Phase 4: 모달 컴포넌트 구현 (T025, T028, T031)
- Phase 4: 모달 스타일 (T026, T029, T032)
- Phase 14: UI 테스트 (T049-T054)

---

## 구현 전략

### MVP 범위

**우선순위 P1 (필수 기능)**:
- US1: 지도 진입 시 자동 발견 성공
- US3: 마커 클릭을 통한 캡슐 조회
- US5: 친구 이스터에그 발견 성공 (30m 이내)

**우선순위 P2 (중요 기능)**:
- US2: 지도 이동 중 자동 발견 성공
- US4: 내 캡슐 조회
- US6: 친구 이스터에그 힌트 확인 (30m 밖)

### 점진적 전달

1. **1차 전달**: API 연결 + 기본 마커 표시 (Phase 1-3)
2. **2차 전달**: 자동 발견 감지 + 기본 모달 (Phase 4-8)
3. **3차 전달**: 데이터 바인딩 + 오류 처리 (Phase 11-13)
4. **4차 전달**: 최종 검증 및 최적화 (Phase 14-15)

---

## 작업 완료 체크리스트

각 Phase 완료 시 확인:

- [ ] 모든 작업이 완료되었는지 확인
- [ ] 관련 테스트가 통과하는지 확인
- [ ] 타입 안전성이 보장되는지 확인
- [ ] 에러 처리가 완료되었는지 확인
- [ ] 성능 목표가 달성되었는지 확인

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-27  
**다음 단계**: 작업 목록에 따라 단계별 구현 시작
