# 타임캡슐 방장 최종 제출 기능 작업 목록

**Branch**: `feat/time-capsule-final`  
**Spec**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)

---

## 📋 작업 개요

- **총 작업 수**: 47개
- **사용자 스토리**: 5개 (US1-US5)
- **예상 기간**: 8일
- **병렬 처리 가능**: 23개 작업

---

## Phase 1. 기초 설정 및 구조 확인

- [x] T001 타임캡슐 제출 관련 디렉토리 구조 점검
  - `src/components/WaitingRoom/` 및 `src/commons/apis/capsules/step-rooms/` 디렉토리 구조 확정
  - 기존 대기실 컴포넌트 구조 파악 및 확장 계획 수립

---

## Phase 2. API 연동 레이어 (타임캡슐 제출)

### 2.1 엔드포인트 및 타입 정의

- [x] T002 `CAPSULE_ENDPOINTS`에 타임캡슐 제출 엔드포인트 추가
  - 파일: `src/commons/apis/endpoints.ts`
  - 작업: `SUBMIT_CAPSULE: (roomId: string) => \`${BASE_PATHS.API}/capsules/step-rooms/${roomId}/submit\`` 추가

- [x] T003 타임캡슐 제출 관련 타입 정의 추가
  - 파일: `src/commons/apis/capsules/step-rooms/types.ts`
  - 작업: `CapsuleSubmitRequest`, `CapsuleSubmitResponse`, `CapsuleSubmitError` 인터페이스 추가
  - 작업: `WaitingRoomDetailResponse`에 `created_at`, `deadline_at`, `status`, `is_auto_submitted` 필드 추가

### 2.2 API 함수 및 React Query 훅

- [x] T004 타임캡슐 제출 API 함수 구현
  - 파일: `src/commons/apis/capsules/step-rooms/index.ts`
  - 작업: `submitCapsule(roomId: string, data: CapsuleSubmitRequest): Promise<CapsuleSubmitResponse>` 구현
  - 작업: POST `/api/capsules/step-rooms/:roomId/submit` 호출

- [x] T005 타임캡슐 제출 React Query 훅 구현
  - 파일: `src/commons/apis/capsules/step-rooms/hooks/useCapsuleSubmit.ts` (신규)
  - 작업: `useCapsuleSubmit(roomId: string)` mutation 훅 구현
  - 작업: 성공 시 대기실 정보 캐시 무효화 (`queryClient.invalidateQueries`)

---

## Phase 3. 유틸리티 함수 구현

### 3.1 GPS 위치 유틸리티

- [x] T006 [P] GPS 위치 유틸리티 함수 구현
  - 파일: `src/commons/utils/geolocation.ts` (신규)
  - 작업: `validateGeolocation(latitude: number, longitude: number): boolean` 구현
  - 작업: `formatGeolocation(latitude: number, longitude: number): string` 구현

### 3.2 타이머 계산 유틸리티

- [x] T007 [P] 타이머 계산 유틸리티 함수 구현
  - 파일: `src/commons/utils/timer.ts` (신규)
  - 작업: `calculateDeadline(createdAt: string): Date` 구현
  - 작업: `calculateRemainingTime(createdAt: string)` 구현 (hours, minutes, seconds, expired 반환)
  - 작업: `formatTimerText(hours: number, minutes: number, seconds: number): string` 구현

### 3.3 날짜 포맷팅 유틸리티 확장

- [x] T008 [P] 날짜 포맷팅 유틸리티 함수 확장
  - 파일: `src/commons/utils/date.ts` (기존 파일 확장)
  - 작업: `calculateDDay(targetDate: string): number` 구현
  - 작업: `formatDateKorean(dateString: string): string` 구현 ("YYYY년 MM월 DD일")
  - 작업: `formatDateTimeKorean(dateString: string): string` 구현 ("YYYY년 MM월 DD일 HH:mm")

---

## Phase 4. E2E 테스트 작성 (Playwright)

- [x] T009 E2E 테스트 파일 생성 및 기본 구조 작성
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts` (신규)
  - 작업: 기본 describe/it 구조 및 공통 setup 작성

- [x] T010 [P] [US1] 방장의 정상 제출 플로우 E2E 테스트 추가
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts`
  - 작업: 대기실 접속 → 모든 참여자 완료 확인 → 제출 버튼 클릭 → 확인 모달 → 제출 완료 모달 검증

- [x] T011 [P] [US2] 24시간 타이머 정상 작동 E2E 테스트 추가
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts`
  - 작업: 타이머 표시 → 1초 후 업데이트 → 남은 시간 포맷 검증

- [x] T012 [P] [US3] 자동 제출 후 재접속 시 안내 모달 E2E 테스트 추가
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts`
  - 작업: 자동 제출된 대기실 접속 → 안내 모달 표시 → 자동 제출 메시지 확인

- [x] T013 [P] [US4] 참여자 미완료 시 제출 버튼 비활성화 E2E 테스트 추가
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts`
  - 작업: 일부 참여자 미완료 → 제출 버튼 비활성화 → 비활성화 사유 표시 검증

- [x] T014 [P] [US5] GPS 권한 거부 시 에러 처리 E2E 테스트 추가
  - 파일: `tests/e2e/capsule-submit/capsule-submit.spec.ts`
  - 작업: GPS 권한 거부 설정 → 제출 시도 → 에러 메시지 표시 검증

---

## Phase 5. 커스텀 훅 구현

### 5.1 24시간 타이머 훅

- [x] T015 24시간 타이머 훅 구현
  - 파일: `src/components/WaitingRoom/hooks/useSubmitTimer.ts` (신규)
  - 작업: `useSubmitTimer(createdAt: string): TimerState` 구현
  - 작업: 1초마다 남은 시간 계산 (hours, minutes, seconds, expired, isUrgent, isCritical)
  - 작업: useEffect로 setInterval 설정 및 cleanup

### 5.2 GPS 위치 수집 훅

- [x] T016 GPS 위치 수집 훅 구현
  - 파일: `src/components/WaitingRoom/hooks/useGeolocation.ts` (신규)
  - 작업: `useGeolocation()` 훅 구현
  - 작업: `getCurrentLocation(): Promise<GeolocationData>` 함수 구현
  - 작업: Web Geolocation API 사용 (enableHighAccuracy, timeout 10초)
  - 작업: 에러 처리 (권한 거부, 위치 사용 불가, 타임아웃)

### 5.3 타임캡슐 제출 훅

- [x] T017 타임캡슐 제출 훅 구현
  - 파일: `src/components/WaitingRoom/hooks/useCapsuleSubmit.ts` (신규)
  - 작업: `useCapsuleSubmit(roomId: string)` 훅 구현
  - 작업: GPS 수집 + API 호출 플로우 관리
  - 작업: 에러 메시지 변환 함수 (`getErrorMessage`) 구현

---

## Phase 6. UI 컴포넌트 구현 (Mock 데이터 기반)

### 6.1 컴포넌트 타입 정의

- [x] T018 제출 관련 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/types.ts` (기존 파일 확장)
  - 작업: `TimerState`, `GeolocationData`, `SubmitButtonProps`, `SubmitConfirmModalProps`, `SubmitCompleteModalProps`, `AutoSubmitModalProps` 인터페이스 추가

### 6.2 24시간 타이머 컴포넌트

- [x] T019 [P] [US2] SubmitTimer 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/components/SubmitTimer/types.ts` (신규)
  - 작업: `SubmitTimerProps` 인터페이스 정의

- [x] T020 [P] [US2] SubmitTimer 컴포넌트 구현
  - 파일: `src/components/WaitingRoom/components/SubmitTimer/index.tsx` (신규)
  - 작업: `useSubmitTimer` 훅 사용하여 타이머 상태 관리
  - 작업: 남은 시간에 따라 색상 및 아이콘 변경 (기본/주황/빨강)
  - 작업: 24시간 경과 시 "자동 제출됨" 표시

- [x] T021 [P] [US2] SubmitTimer 스타일 구현
  - 파일: `src/components/WaitingRoom/components/SubmitTimer/styles.module.css` (신규)
  - 작업: 화면 상단 고정 스타일
  - 작업: 깜빡임 애니메이션 (10분 미만 시)
  - 작업: 색상 변경 스타일 (기본/주황/빨강)

### 6.3 제출 버튼 컴포넌트

- [x] T022 [P] [US1] [US4] SubmitButton 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/components/SubmitButton/types.ts` (신규)
  - 작업: `SubmitButtonProps` 인터페이스 정의

- [x] T023 [P] [US1] [US4] SubmitButton 컴포넌트 구현
  - 파일: `src/components/WaitingRoom/components/SubmitButton/index.tsx` (신규)
  - 작업: disabled prop에 따라 버튼 활성화/비활성화
  - 작업: 비활성화 시 disabledReason 표시
  - 작업: 로딩 중 스피너 표시

- [x] T024 [P] [US1] [US4] SubmitButton 스타일 구현
  - 파일: `src/components/WaitingRoom/components/SubmitButton/styles.module.css` (신규)
  - 작업: 화면 하단 고정 스타일
  - 작업: 전체 너비 (375px 기준)
  - 작업: 최소 터치 영역 44px

### 6.4 제출 확인 모달 컴포넌트

- [x] T025 [P] [US1] SubmitConfirmModal 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/components/SubmitConfirmModal/types.ts` (신규)
  - 작업: `SubmitConfirmModalProps` 인터페이스 정의

- [x] T026 [P] [US1] SubmitConfirmModal 컴포넌트 구현
  - 파일: `src/components/WaitingRoom/components/SubmitConfirmModal/index.tsx` (신규)
  - 작업: 개봉 예정일 표시 (formatDateKorean 사용)
  - 작업: 남은 시간 표시
  - 작업: "묻기" 및 "취소" 버튼 구현

- [x] T027 [P] [US1] SubmitConfirmModal 스타일 구현
  - 파일: `src/components/WaitingRoom/components/SubmitConfirmModal/styles.module.css` (신규)
  - 작업: 중앙 모달 스타일 (반투명 배경)
  - 작업: 375px 기준 적절한 너비

### 6.5 제출 완료 모달 컴포넌트

- [x] T028 [P] [US1] SubmitCompleteModal 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/components/SubmitCompleteModal/types.ts` (신규)
  - 작업: `SubmitCompleteModalProps` 인터페이스 정의

- [x] T029 [P] [US1] SubmitCompleteModal 컴포넌트 구현
  - 파일: `src/components/WaitingRoom/components/SubmitCompleteModal/index.tsx` (신규)
  - 작업: 수동/자동 제출에 따라 제목 변경
  - 작업: D-Day 계산 및 표시 (calculateDDay 사용)
  - 작업: 자동 제출 시 추가 안내 표시
  - 작업: "확인" 버튼으로 홈/보관함 이동

- [x] T030 [P] [US1] SubmitCompleteModal 스타일 구현
  - 파일: `src/components/WaitingRoom/components/SubmitCompleteModal/styles.module.css` (신규)
  - 작업: 중앙 모달 스타일
  - 작업: 성공 아이콘 표시

### 6.6 자동 제출 안내 모달 컴포넌트

- [x] T031 [P] [US3] AutoSubmitModal 컴포넌트 타입 정의
  - 파일: `src/components/WaitingRoom/components/AutoSubmitModal/types.ts` (신규)
  - 작업: `AutoSubmitModalProps` 인터페이스 정의

- [x] T032 [P] [US3] AutoSubmitModal 컴포넌트 구현
  - 파일: `src/components/WaitingRoom/components/AutoSubmitModal/index.tsx` (신규)
  - 작업: "이미 제출된 타임캡슐입니다" 제목 표시
  - 작업: 자동 제출 안내 메시지 표시
  - 작업: 제출 시각 및 개봉 예정일 표시 (formatDateTimeKorean 사용)
  - 작업: "보관함으로 이동" 및 "홈으로" 버튼 구현

- [x] T033 [P] [US3] AutoSubmitModal 스타일 구현
  - 파일: `src/components/WaitingRoom/components/AutoSubmitModal/styles.module.css` (신규)
  - 작업: 중앙 모달 스타일
  - 작업: 정보 아이콘 표시

### 6.7 Mock 데이터 생성

- [x] T034 제출 관련 Mock 데이터 생성
  - 파일: `src/components/WaitingRoom/mocks/data.ts` (기존 파일 확장)
  - 작업: 제출 성공 응답 Mock 데이터 추가
  - 작업: 자동 제출 응답 Mock 데이터 추가
  - 작업: 제출 에러 응답 Mock 데이터 추가

---

## Phase 7. WaitingRoom 컴포넌트 통합 (Mock 데이터 기반)

- [x] T035 [US1] [US2] [US3] [US4] WaitingRoom 컴포넌트에 제출 기능 통합
  - 파일: `src/components/WaitingRoom/index.tsx` (기존 파일 수정)
  - 작업: 방장 권한 확인 로직 추가 (is_host 플래그)
  - 작업: 제출 조건 확인 로직 추가 (모든 참여자 완료, GPS 가능, 24시간 미경과)
  - 작업: SubmitTimer 컴포넌트 추가 (방장에게만 표시)
  - 작업: SubmitButton 컴포넌트 추가 (방장에게만 표시)
  - 작업: 모달 상태 관리 (isSubmitConfirmOpen, isSubmitCompleteOpen, isAutoSubmitModalOpen)
  - 작업: 제출 플로우 연결 (버튼 클릭 → 확인 모달 → 제출 → 완료 모달)
  - 작업: 자동 제출 감지 및 안내 모달 표시 (status === 'BURIED' && is_auto_submitted === true)
  - 작업: Mock 데이터 사용하여 동작 확인

- [x] T036 [US1] [US2] [US3] [US4] WaitingRoom 스타일 업데이트
  - 파일: `src/components/WaitingRoom/styles.module.css` (기존 파일 수정)
  - 작업: 제출 버튼 및 타이머 레이아웃 스타일 추가 (기존 스타일로 충분)

---

## Phase 8. 사용자 승인 및 피드백

- [ ] T037 스테이징 환경 배포
  - 작업: Mock 데이터 기반 제출 기능 배포
  - 작업: 375px 모바일 프레임 확인

- [ ] T038 사용자 테스트 및 피드백 수집
  - 작업: UI/UX 검증
  - 작업: 타이머 정확도 확인
  - 작업: 모달 플로우 확인
  - 작업: 버그 수정 및 개선사항 반영

---

## Phase 9. 데이터 바인딩 (실제 API 연결)

### 9.1 실제 API 연결

- [x] T039 [US1] [US2] [US3] [US4] [US5] WaitingRoom 컴포넌트에서 Mock 데이터 제거 및 실제 API 연결
  - 파일: `src/components/WaitingRoom/index.tsx` (기존 파일 수정)
  - 작업: Mock 데이터 제거
  - 작업: `useCapsuleSubmit` 훅 사용하여 실제 제출 API 호출
  - 작업: `useGeolocation` 훅 사용하여 실제 GPS 위치 수집
  - 작업: 로딩 상태 처리 (isSubmitting)
  - 작업: 에러 상태 처리 (error 메시지 표시)
  - 작업: Toast를 사용한 성공/에러 메시지 표시

### 9.2 에러 처리 강화

- [x] T040 [US5] 제출 에러 처리 강화
  - 파일: `src/components/WaitingRoom/index.tsx`, `src/components/WaitingRoom/hooks/useCapsuleSubmit.ts` (기존 파일 수정)
  - 작업: GPS 에러 처리 (권한 거부, 위치 사용 불가, 타임아웃)
  - 작업: API 에러 처리 (참여자 미완료, 권한 없음, 이미 제출됨, 위치 오류, 결제 미완료)
  - 작업: 네트워크 오류 처리
  - 작업: 사용자 친화적인 에러 메시지 변환 함수 추가

---

## Phase 10. UI 테스트 작성 (Playwright)

- [x] T041 UI 테스트 파일 생성 및 기본 구조 작성
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts` (신규)
  - 작업: 기본 describe/it 구조 작성

- [x] T042 [P] [US1] [US4] 제출 버튼 렌더링 UI 테스트 추가
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts`
  - 작업: 버튼 표시, 스타일, 위치 확인

- [x] T043 [P] [US2] 24시간 타이머 렌더링 UI 테스트 추가
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts`
  - 작업: 타이머 표시, 색상, 아이콘 확인

- [x] T044 [P] [US1] 제출 확인 모달 렌더링 UI 테스트 추가
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts`
  - 작업: 모달 표시, 내용, 버튼 확인

- [x] T045 [P] [US1] 제출 완료 모달 렌더링 UI 테스트 추가
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts`
  - 작업: 모달 표시, 내용, D-Day 확인

- [x] T046 [P] [US3] 자동 제출 안내 모달 렌더링 UI 테스트 추가
  - 파일: `tests/ui/capsule-submit/capsule-submit.spec.ts`
  - 작업: 모달 표시, 내용, 버튼 확인

---

## Phase 11. 최종 검증 및 배포 준비

- [ ] T047 최종 검증 및 배포 체크리스트 완료
  - 작업: 모든 E2E 테스트 통과 확인
  - 작업: 모든 UI 테스트 통과 확인
  - 작업: GPS 위치 수집 정상 작동 확인 (실제 기기 테스트)
  - 작업: 24시간 타이머 정확도 검증
  - 작업: 제출 API 호출 성공률 95% 이상 확인
  - 작업: 에러 처리 검증 (모든 에러 케이스)
  - 작업: 성능 목표 달성 확인 (GPS 5초, API 3초)
  - 작업: 375px 모바일 레이아웃 검증
  - 작업: 접근성 검증 (터치 영역 44px 이상)
  - 작업: 프로덕션 배포 준비

---

## 📊 작업 통계

### 사용자 스토리별 작업 수

- **US1 (방장의 정상 제출)**: 17개 작업
- **US2 (24시간 타이머)**: 7개 작업
- **US3 (자동 제출 안내)**: 5개 작업
- **US4 (참여자 미완료)**: 4개 작업
- **US5 (GPS 에러 처리)**: 4개 작업
- **공통 (설정, API, 유틸리티)**: 10개 작업

### 병렬 처리 가능 작업

다음 작업들은 병렬로 처리 가능합니다 (서로 다른 파일, 의존성 없음):

**Phase 3 (유틸리티)**:
- T006, T007, T008 (각각 다른 유틸리티 파일)

**Phase 4 (E2E 테스트)**:
- T010, T011, T012, T013, T014 (각각 독립적인 테스트 케이스)

**Phase 6 (UI 컴포넌트)**:
- T019-T021 (SubmitTimer)
- T022-T024 (SubmitButton)
- T025-T027 (SubmitConfirmModal)
- T028-T030 (SubmitCompleteModal)
- T031-T033 (AutoSubmitModal)

**Phase 10 (UI 테스트)**:
- T042, T043, T044, T045, T046 (각각 독립적인 테스트 케이스)

---

## 🎯 구현 전략

### MVP 범위 (최소 기능)

**Phase 1-7 완료 시 MVP 달성**:
- API 연동 완료
- E2E 테스트 작성 완료
- 모든 UI 컴포넌트 구현 완료 (Mock 데이터 기반)
- 사용자 승인 가능 상태

### 점진적 전달

1. **1-2일차**: Phase 1-3 완료 (API 연동 + 유틸리티 + E2E 테스트)
2. **3-5일차**: Phase 4-6 완료 (커스텀 훅 + UI 컴포넌트)
3. **6일차**: Phase 7-8 완료 (통합 + 사용자 승인)
4. **7일차**: Phase 9 완료 (데이터 바인딩)
5. **8일차**: Phase 10-11 완료 (UI 테스트 + 최종 검증)

---

## 🔗 의존성

### 사용자 스토리 완료 순서

1. **US2 (타이머)**: 독립적, 먼저 구현 가능
2. **US4 (참여자 미완료)**: 독립적, 먼저 구현 가능
3. **US1 (정상 제출)**: US2 완료 후 (타이머 컴포넌트 필요)
4. **US3 (자동 제출 안내)**: US1 완료 후 (제출 플로우 이해 필요)
5. **US5 (GPS 에러)**: US1 완료 후 (제출 플로우 이해 필요)

### 기술적 의존성

- **T002-T005**: API 연동 레이어 (순차 실행)
- **T006-T008**: 유틸리티 함수 (병렬 실행 가능)
- **T009-T014**: E2E 테스트 (T009 완료 후 병렬 실행 가능)
- **T015-T017**: 커스텀 훅 (T002-T005 완료 후, 순차 실행)
- **T018**: 타입 정의 (T015-T017 완료 후)
- **T019-T033**: UI 컴포넌트 (T018 완료 후, 병렬 실행 가능)
- **T034**: Mock 데이터 (T019-T033과 병렬 가능)
- **T035-T036**: 통합 (T019-T034 완료 후)
- **T037-T038**: 사용자 승인 (T035-T036 완료 후)
- **T039-T040**: 데이터 바인딩 (T037-T038 완료 후)
- **T041-T046**: UI 테스트 (T039-T040 완료 후, 병렬 실행 가능)
- **T047**: 최종 검증 (T041-T046 완료 후)

---

## 📝 참고사항

- 모든 작업은 `feat/time-capsule-final` 브랜치에서 진행
- 각 작업 완료 시 체크박스 체크 (`- [x]`)
- 문제 발생 시 해당 작업에 메모 추가
- 사용자 승인 전까지는 Mock 데이터 사용
- 실제 API 연결은 Phase 9에서 진행

---

**다음 단계**: `/speckit.implement`를 실행하여 단계별 구현을 시작합니다.
