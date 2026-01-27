# 작업 목록: 이스터에그 폼 제출

## 개요

이 문서는 "이스터에그 폼 제출" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/005-easter-egg-form-submit/spec.md`
- 기술 계획: `specs/005-easter-egg-form-submit/plan.md`

**총 작업 수**: 31개
**예상 소요 기간**: 5-8일 (개발자 1명 기준)

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 | 작업 수 |
|-----------|------|---------|
| US1 | 이스터에그 생성 성공 | 12개 |
| US2 | 위치 정보 수집 실패 | 4개 |
| US3 | 슬롯 부족으로 인한 생성 실패 | 3개 |
| US4 | 네트워크 오류 처리 | 3개 |
| US5 | 파일 업로드 진행 상태 표시 | 3개 |
| 공통 | 설정 및 테스트 | 10개 |

---

## Phase 1: API 함수 및 타입 정의

### 타입 정의

- [x] T001 src/commons/apis/easter-egg/types.ts 생성
  - `CreateEasterEggRequest` 인터페이스 정의
    - `latitude` (number, required)
    - `longitude` (number, required)
    - `title` (string, optional, max 30 chars)
    - `message` (string, optional, max 500 chars)
    - `media_files` (File[], optional, max 3 files)
    - `view_limit` (number, optional)
    - `product_id` (string, optional, deprecated)
  - `CreateEasterEggResponse` 인터페이스 정의
    - `success` (boolean)
    - `data` (object with id, title, message, latitude, longitude, created_at)
    - `message` (string, optional)
  - `ApiErrorResponse` 인터페이스 정의
    - `statusCode` (number)
    - `message` (string)
    - `code` (string, optional)
    - `details` (any, optional)

### API 함수 구현

- [x] T002 src/commons/apis/easter-egg/index.ts 생성
  - `createEasterEgg` 함수 구현
  - multipart/form-data 생성 로직
  - FormData에 필수 필드 추가 (latitude, longitude)
  - FormData에 선택 필드 추가 (title, message, view_limit, product_id)
  - FormData에 미디어 파일 추가 (media_files)
  - `apiClient.post`를 사용한 API 호출
  - `Content-Type: multipart/form-data` 헤더 설정
  - `onUploadProgress` 콜백 지원
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [x] T003 src/commons/apis/endpoints.ts 확인 및 수정
  - `TIMEEGG_ENDPOINTS.CREATE_CAPSULE` 엔드포인트 확인
  - 필요시 엔드포인트 상수 추가 또는 수정
  - 파일: `src/commons/apis/endpoints.ts`

---

## Phase 2: E2E 테스트 (API 함수 테스트)

### 환경 변수 설정

- [x] T004 .env.local 파일에 테스트 로그인용 환경 변수 설정
  - `NEXT_PUBLIC_PHONE_NUMBER`: 테스트용 전화번호
  - `NEXT_PUBLIC_EMAIL`: 테스트용 이메일
  - `NEXT_PUBLIC_PASSWORD`: 테스트용 비밀번호
  - **참고**: 이 환경 변수들은 E2E 테스트에서 인증된 사용자로 API를 호출하기 위해 필요합니다
  - 파일: `.env.local`

### E2E 테스트 작성

- [x] T005 [US1] tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts 생성
  - 이스터에그 생성 API 함수 직접 테스트
  - multipart/form-data 형식 검증
  - 필수 필드 (latitude, longitude) 검증
  - 선택 필드 (title, message, media_files) 검증
  - 성공 응답 검증
  - 파일: `tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts`

- [x] T006 [US2] tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts에 위치 정보 수집 실패 시나리오 테스트 추가
  - 위치 정보 누락 시 API 호출 실패 검증
  - 파일: `tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts`

- [x] T007 [US3] tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts에 슬롯 부족 시나리오 테스트 추가
  - 409 에러 응답 시뮬레이션
  - 에러 응답 구조 검증
  - 파일: `tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts`

- [x] T008 [US4] tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts에 네트워크 오류 시나리오 테스트 추가
  - 네트워크 차단 시뮬레이션
  - 에러 처리 검증
  - 파일: `tests/e2e/easter-egg/easter-egg-form-submit.e2e.spec.ts`

---

## Phase 3: 폼 데이터 검증 및 변환 로직

### 검증 함수 구현

- [x] T009 src/components/home/hooks/useEasterEggSubmit.ts에 검증 함수 구현
  - `validateFormData` 함수 구현
    - 제목 길이 검증 (최대 30자)
    - 메시지 길이 검증 (최대 500자)
    - 첨부파일 개수 검증 (최대 3개)
    - 필수 필드 검증 (제목, 위치 정보)
  - 검증 실패 시 에러 메시지 반환
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 변환 함수 구현

- [x] T010 src/components/home/hooks/useEasterEggSubmit.ts에 변환 함수 구현
  - `transformFormDataToApiRequest` 함수 구현
    - `EasterEggFormData` → `CreateEasterEggRequest` 변환
    - 첨부파일 배열 변환 (Attachment[] → File[])
    - 위치 정보 포함
  - 타입 안전성 보장
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

---

## Phase 4: 위치 정보 수집 및 포함 로직

### 위치 정보 수집 통합

- [x] T011 src/components/home/hooks/useEasterEggSubmit.ts에 위치 정보 수집 로직 추가
  - 기존 `useGeolocation` 훅 활용
  - 제출 시점에 위치 정보 수집
  - 위치 정보 수집 실패 시 에러 처리
  - 위치 정보 수집 중 로딩 상태 관리
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

---

## Phase 5: 제출 훅 구현

### React Query Mutation 설정

- [x] T012 src/components/home/hooks/useEasterEggSubmit.ts에 React Query mutation 설정
  - `useMutation` 훅 사용
  - `createEasterEgg` API 함수 호출
  - mutation 옵션 설정 (onSuccess, onError)
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 제출 함수 구현

- [x] T013 [US1] src/components/home/hooks/useEasterEggSubmit.ts에 제출 함수 구현
  - `submit` 함수 구현
  - 위치 정보 수집 통합
  - 폼 데이터 검증 호출
  - 폼 데이터 변환 호출
  - API 호출 및 진행률 추적
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 상태 관리 구현

- [x] T014 src/components/home/hooks/useEasterEggSubmit.ts에 상태 관리 구현
  - `isSubmitting` 상태 관리
  - `progress` 상태 관리 (파일 업로드 진행률)
  - `error` 상태 관리
  - `clearError` 함수 구현
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 훅 인터페이스 정의

- [x] T015 src/components/home/hooks/useEasterEggSubmit.ts에 훅 인터페이스 정의
  - `UseEasterEggSubmitReturn` 인터페이스 정의
    - `submit` 함수
    - `isSubmitting` (boolean)
    - `progress` (number)
    - `error` (string | null)
    - `clearError` 함수
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

---

## Phase 6: 바텀시트 컴포넌트 통합

### 제출 훅 통합

- [x] T016 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 useEasterEggSubmit 훅 통합
  - `useEasterEggSubmit` 훅 import 및 사용
  - 제출 상태 변수 할당
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

### handleConfirm 함수 수정

- [ ] T016 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx의 handleConfirm 함수 수정
  - 기존 콘솔 로그 제거
  - `submit` 함수 호출
  - 제출 성공 후 바텀시트 닫기 및 폼 초기화
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

### 제출 중 상태 표시

- [x] T018 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 제출 중 상태 표시 추가
  - `isSubmitting` 상태에 따른 로딩 인디케이터 표시
  - 제출 중 버튼 비활성화
  - 제출 중 폼 필드 수정 불가능 상태
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

### 파일 업로드 진행률 표시

- [x] T019 [US5] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 파일 업로드 진행률 표시 추가
  - `progress` 상태에 따른 진행률 표시
  - 진행률 바 또는 퍼센트 표시
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

### 에러 메시지 표시

- [x] T020 [US2] [US3] [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 에러 메시지 표시 추가
  - `error` 상태에 따른 에러 메시지 표시
  - 에러 메시지 UI 컴포넌트 추가
  - 에러 발생 시 폼 데이터 보존
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

### 제출 성공 후 처리

- [x] T021 [US1] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 제출 성공 후 처리 추가
  - 성공 메시지 표시 (선택적)
  - 바텀시트 닫기
  - 폼 데이터 초기화
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

---

## Phase 7: 에러 핸들링 및 사용자 피드백

### 에러 메시지 정의

- [x] T022 src/components/home/hooks/useEasterEggSubmit.ts에 에러 메시지 상수 정의
  - `ERROR_MESSAGES` 객체 정의
    - `LOCATION_PERMISSION_DENIED`
    - `LOCATION_TIMEOUT`
    - `LOCATION_UNAVAILABLE`
    - `TITLE_TOO_LONG`
    - `MESSAGE_TOO_LONG`
    - `TOO_MANY_FILES`
    - `MISSING_REQUIRED_FIELDS`
    - `SLOT_INSUFFICIENT`
    - `NETWORK_ERROR`
    - `SERVER_ERROR`
    - `UNKNOWN_ERROR`
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 위치 정보 수집 실패 처리

- [x] T023 [US2] src/components/home/hooks/useEasterEggSubmit.ts에 위치 정보 수집 실패 처리 추가
  - 권한 거부 에러 처리
  - 타임아웃 에러 처리
  - 브라우저 미지원 에러 처리
  - 적절한 에러 메시지 반환
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### API 에러 처리

- [x] T024 [US3] [US4] src/components/home/hooks/useEasterEggSubmit.ts에 API 에러 처리 추가
  - 400 에러 처리 (잘못된 요청 데이터)
  - 401 에러 처리 (인증 실패)
  - 409 에러 처리 (슬롯 부족)
  - 500 에러 처리 (서버 오류)
  - 네트워크 오류 처리
  - 적절한 에러 메시지 반환
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

### 재시도 옵션 제공

- [x] T025 [US4] src/components/home/components/easter-egg-bottom-sheet/index.tsx에 재시도 옵션 추가
  - 네트워크 오류 시 재시도 버튼 표시
  - 재시도 버튼 클릭 시 제출 재시도
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

---

## Phase 8: 홈 페이지 통합

### 홈 페이지 수정

- [x] T026 [US1] src/components/home/index.tsx의 handleEasterEggConfirm 함수 수정
  - 기존 TODO 주석 제거
  - 제출 로직은 바텀시트 컴포넌트 내부에서 처리하도록 변경
  - 제출 성공 후 지도 업데이트 (선택적)
  - 파일: `src/components/home/index.tsx`

---

## Phase 9: UI 테스트 및 최적화

### UI 테스트 작성

- [ ] T027 [US1] [US5] tests/ui/easter-egg/easter-egg-form-submit.ui.spec.ts 생성
  - 제출 중 로딩 인디케이터 표시 테스트
  - 파일 업로드 진행률 표시 테스트
  - 파일: `tests/ui/easter-egg/easter-egg-form-submit.ui.spec.ts`

- [ ] T028 [US2] [US3] [US4] tests/ui/easter-egg/easter-egg-form-submit.ui.spec.ts에 에러 메시지 표시 테스트 추가
  - 에러 메시지 표시 테스트
  - 제출 성공 후 바텀시트 닫기 테스트
  - 파일: `tests/ui/easter-egg/easter-egg-form-submit.ui.spec.ts`

### 성능 최적화

- [ ] T029 src/components/home/components/easter-egg-bottom-sheet/index.tsx에 메모리 누수 방지 로직 추가
  - 미리보기 URL 정리 (URL.revokeObjectURL)
  - 제출 완료 후 폼 데이터 초기화
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/index.tsx`

- [ ] T030 src/commons/apis/easter-egg/index.ts에 타임아웃 설정 추가
  - API 요청 타임아웃 설정 (30초)
  - 파일: `src/commons/apis/easter-egg/index.ts`

### 타입 정의 확장

- [ ] T031 src/components/home/components/easter-egg-bottom-sheet/types.ts에 제출 상태 타입 추가
  - `SubmitState` 인터페이스 정의 (필요시)
  - 파일: `src/components/home/components/easter-egg-bottom-sheet/types.ts`

---

## 의존성 및 순서

### 필수 순서

1. **Phase 1 (T001-T003)**: API 함수 및 타입 정의는 모든 작업의 기초
2. **Phase 2 (T004-T008)**: 환경 변수 설정 및 E2E 테스트는 API 함수 구현 직후 작성 (API 함수 검증)
3. **Phase 3 (T009-T010)**: 검증 및 변환 로직은 제출 훅에 필요
4. **Phase 4 (T011)**: 위치 정보 수집 로직은 제출 훅에 필요
5. **Phase 5 (T012-T015)**: 제출 훅 구현은 바텀시트 통합 전 필요
6. **Phase 6 (T016-T021)**: 바텀시트 통합은 제출 훅 완료 후 가능
7. **Phase 7 (T022-T025)**: 에러 핸들링은 제출 훅과 바텀시트 통합 후
8. **Phase 8 (T026)**: 홈 페이지 통합은 바텀시트 통합 후
9. **Phase 9 (T027-T031)**: UI 테스트 및 최적화는 모든 기능 구현 완료 후

### 병렬 처리 가능한 작업

- **T001, T002**: 타입 정의와 API 함수는 독립적으로 작성 가능 (T001 완료 후 T002)
- **T004**: 환경 변수 설정은 E2E 테스트 작성 전 필수
- **T005-T008**: E2E 테스트는 API 함수별로 독립적으로 작성 가능
- **T009, T010**: 검증 함수와 변환 함수는 독립적으로 작성 가능
- **T018, T019, T020**: 제출 중 상태 표시, 진행률 표시, 에러 메시지 표시는 독립적으로 구현 가능
- **T027, T028**: UI 테스트는 독립적으로 작성 가능

---

## 구현 전략

### MVP 범위

**우선 구현할 핵심 기능**:
- 이스터에그 생성 성공 시나리오 (US1)
- 기본 에러 핸들링 (위치 정보 수집 실패, API 에러)

**후속 구현 기능**:
- 상세 에러 메시지 (US2, US3, US4)
- 파일 업로드 진행률 표시 (US5)
- 재시도 옵션 (US4)

### 점진적 전달

1. **1차 전달**: API 함수 구현 및 E2E 테스트 (T001-T008)
2. **2차 전달**: 제출 훅 구현 (T009-T015)
3. **3차 전달**: 바텀시트 통합 및 기본 에러 핸들링 (T016-T021, T022-T024)
4. **4차 전달**: 상세 에러 핸들링 및 사용자 피드백 (T025, T026)
5. **5차 전달**: UI 테스트 및 최적화 (T027-T031)

---

## 체크리스트

### 각 사용자 스토리별 완성도 확인

- [ ] **US1 (이스터에그 생성 성공)**
  - [ ] API 함수 구현 완료
  - [ ] 제출 훅 구현 완료
  - [ ] 바텀시트 통합 완료
  - [ ] 제출 중 상태 표시 완료
  - [ ] 제출 성공 후 처리 완료
  - [ ] E2E 테스트 작성 완료

- [ ] **US2 (위치 정보 수집 실패)**
  - [ ] 위치 정보 수집 실패 처리 완료
  - [ ] 에러 메시지 표시 완료
  - [ ] E2E 테스트 작성 완료

- [ ] **US3 (슬롯 부족)**
  - [ ] 409 에러 처리 완료
  - [ ] 에러 메시지 표시 완료
  - [ ] E2E 테스트 작성 완료

- [ ] **US4 (네트워크 오류)**
  - [ ] 네트워크 오류 처리 완료
  - [ ] 재시도 옵션 제공 완료
  - [ ] E2E 테스트 작성 완료

- [ ] **US5 (파일 업로드 진행 상태)**
  - [ ] 진행률 표시 완료
  - [ ] UI 테스트 작성 완료

### 최종 검증

- [ ] 모든 API 함수가 타입 안전하게 구현됨
- [ ] 모든 에러 상황에 대한 처리가 구현됨
- [ ] 사용자 피드백이 명확하게 제공됨
- [ ] 성능 최적화가 완료됨
- [ ] 모든 테스트가 통과함
- [ ] 메모리 누수가 없음

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-27  
**다음 단계**: 작업 목록에 따라 단계별 구현 시작
