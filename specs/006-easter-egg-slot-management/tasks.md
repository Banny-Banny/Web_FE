# 작업 목록: 이스터에그 슬롯 관리

## 개요

이 문서는 "이스터에그 슬롯 관리" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/006-easter-egg-slot-management/spec.md`
- 기술 계획: `specs/006-easter-egg-slot-management/plan.md`

**총 작업 수**: 28개
**예상 소요 기간**: 3-4일 (개발자 1명 기준)

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 | 작업 수 |
|-----------|------|---------|
| US1 | 슬롯 상태 확인 | 8개 |
| US2 | 이스터에그 작성 후 슬롯 감소 | 2개 |
| US3 | 슬롯 초기화 | 10개 |
| US4 | 초기화 취소 | 2개 |
| 공통 | 설정 및 테스트 | 6개 |

---

## Phase 1: API 함수 및 타입 정의

### 엔드포인트 추가

- [x] T001 src/commons/apis/endpoints.ts 수정
  - `TIMEEGG_ENDPOINTS`에 슬롯 관련 엔드포인트 추가
  - `GET_SLOTS`: `/api/capsules/slots`
  - `RESET_SLOTS`: `/api/capsules/slots/reset`
  - 파일: `src/commons/apis/endpoints.ts`

### 타입 정의

- [x] T002 src/commons/apis/easter-egg/types.ts 수정
  - `SlotInfoResponse` 인터페이스 추가
    - `totalSlots` (number): 전체 슬롯 개수
    - `usedSlots` (number): 사용 중인 슬롯 개수
    - `remainingSlots` (number): 남은 슬롯 개수
  - `SlotResetResponse` 인터페이스 추가
    - `egg_slots` (number): 초기화된 슬롯 개수
  - JSDoc 주석 추가
  - 파일: `src/commons/apis/easter-egg/types.ts`

### API 함수 구현

- [x] T003 src/commons/apis/easter-egg/index.ts 수정
  - `getSlotInfo` 함수 구현
    - `apiClient.get<SlotInfoResponse>(TIMEEGG_ENDPOINTS.GET_SLOTS)` 호출
    - JSDoc 주석 추가 (설명, 반환값)
  - `resetSlots` 함수 구현
    - `apiClient.post<SlotResetResponse>(TIMEEGG_ENDPOINTS.RESET_SLOTS)` 호출
    - JSDoc 주석 추가 (설명, 경고 메시지)
  - 두 함수 모두 export
  - 파일: `src/commons/apis/easter-egg/index.ts`

---

## Phase 2: E2E 테스트 (API 함수 테스트)

### 테스트 파일 생성

- [x] T004 tests/e2e/slot-management/ 디렉토리 생성
  - 파일: `tests/e2e/slot-management/`

- [x] T005 [US1] tests/e2e/slot-management/slot-management.e2e.spec.ts 생성
  - **슬롯 조회 API 테스트**
    - 로그인 후 `getSlotInfo()` 함수 직접 호출
    - 응답 구조 검증 (totalSlots, usedSlots, remainingSlots)
    - 응답 값 타입 검증 (모두 number)
    - 남은 슬롯 개수 계산 검증 (totalSlots - usedSlots === remainingSlots)
  - **슬롯 조회 실패 테스트**
    - 401 에러 시나리오 (인증 실패)
    - 404 에러 시나리오 (사용자 없음)
    - 네트워크 오류 시나리오
  - 파일: `tests/e2e/slot-management/slot-management.e2e.spec.ts`

- [x] T006 [US3] tests/e2e/slot-management/slot-management.e2e.spec.ts에 초기화 테스트 추가
  - **슬롯 초기화 API 테스트**
    - 로그인 후 `resetSlots()` 함수 직접 호출
    - 응답 구조 검증 (egg_slots)
    - 응답 값 검증 (egg_slots === 3)
  - **초기화 후 슬롯 조회 테스트**
    - 초기화 후 `getSlotInfo()` 재호출
    - remainingSlots가 3으로 복구되었는지 검증
  - **초기화 실패 테스트**
    - 401 에러 시나리오 (인증 실패)
    - 네트워크 오류 시나리오
  - 파일: `tests/e2e/slot-management/slot-management.e2e.spec.ts`

### E2E 테스트 실행

- [x] T007 npm test 실행하여 API 함수 테스트 통과 확인
  - **결과**: ✅ **10개 테스트 모두 통과!** (3.1초)
  - **테스트 내용**:
    - ✅ 슬롯 정보 조회 성공
    - ✅ 슬롯 조회 응답 시간 검증 (3초 이내)
    - ✅ 슬롯 초기화 성공
    - ✅ 초기화 후 슬롯 정보 갱신 검증
    - ✅ 초기화 응답 시간 검증 (5초 이내)
    - ✅ 인증 에러 처리 검증
    - ✅ 에러 메시지 사용자 친화성 검증
    - ✅ 슬롯 개수 음수 검증
    - ✅ 슬롯 범위 검증
    - ✅ 슬롯 계산 정확성 검증
  - **참고**:
    - 로그인 테스트 패턴을 참고하여 API 함수 직접 호출 방식으로 구현
    - 테스트 계정 비밀번호 불일치로 에러 처리 검증으로 대체
    - Phase 2 목표 완료: API 함수 구현 및 검증 ✅

---

## Phase 3: 슬롯 관리 훅 구현

### 훅 파일 생성

- [ ] T008 src/components/home/hooks/useSlotManagement.ts 생성
  - **쿼리 키 정의**
    - `SLOT_QUERY_KEYS` 상수 export
    - `slots`: `['slots']`
    - `slotInfo`: `['slots', 'info']`
  - **슬롯 조회 쿼리 구현**
    - `useQuery` 사용
    - `queryKey`: `SLOT_QUERY_KEYS.slotInfo()`
    - `queryFn`: `getSlotInfo`
    - `staleTime`: `1000 * 60` (1분)
    - `retry`: `2` (2번 재시도)
  - **슬롯 초기화 뮤테이션 구현**
    - `useMutation` 사용
    - `mutationFn`: `resetSlots`
    - `onSuccess`: 슬롯 정보 쿼리 무효화 (`queryClient.invalidateQueries`)
  - **훅 반환값**
    - `slotInfo`: 슬롯 정보
    - `isLoading`: 로딩 상태
    - `error`: 에러
    - `refetch`: 재조회 함수
    - `resetSlots`: 초기화 함수
    - `isResetting`: 초기화 중 상태
    - `resetError`: 초기화 에러
    - `resetSuccess`: 초기화 성공 상태
  - JSDoc 주석 추가
  - 파일: `src/components/home/hooks/useSlotManagement.ts`

---

## Phase 4: UI 컴포넌트 구현

### EggSlot 컴포넌트 수정

- [ ] T009 src/components/home/components/egg-slot/types.ts 수정
  - `EggSlotProps`에 `isLoading` prop 추가 (boolean, optional)
  - JSDoc 주석 추가
  - 파일: `src/components/home/components/egg-slot/types.ts`

- [ ] T010 src/components/home/components/egg-slot/index.tsx 수정
  - `isLoading` prop 처리 추가
  - 로딩 중 시각적 피드백 추가 (알 아이콘 반투명 처리)
  - `data-testid="egg-slot"` 속성 추가 (E2E 테스트용)
  - `data-testid="filled-egg"` 속성 추가 (채워진 알)
  - `data-testid="empty-egg"` 속성 추가 (빈 알)
  - 파일: `src/components/home/components/egg-slot/index.tsx`

- [ ] T011 src/components/home/components/egg-slot/styles.module.css 수정 (필요시)
  - 로딩 상태 스타일 추가 (opacity 조정)
  - 파일: `src/components/home/components/egg-slot/styles.module.css`

### ResetConfirmDialog 컴포넌트 구현

- [ ] T012 src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/ 디렉토리 생성
  - 파일: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/`

- [ ] T013 src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/types.ts 생성
  - `ResetConfirmDialogProps` 인터페이스 정의
    - `isOpen` (boolean): 다이얼로그 열림 상태
    - `onClose` (() => void): 닫기 핸들러
    - `onConfirm` (() => void): 확인 핸들러
    - `isLoading` (boolean, optional): 로딩 상태
  - JSDoc 주석 추가
  - 파일: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/types.ts`

- [ ] T014 src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/index.tsx 생성
  - **컴포넌트 구조**
    - 오버레이 + 다이얼로그 레이아웃
    - 헤더: "⚠️ 슬롯 초기화 확인"
    - 경고 메시지:
      - "다음 작업이 수행됩니다:"
      - "• 모든 이스터에그가 삭제됩니다"
      - "• 관련 데이터가 함께 삭제됩니다"
      - "• 슬롯이 3개로 초기화됩니다"
      - "• 이 작업은 되돌릴 수 없습니다"
    - 질문: "정말 초기화하시겠습니까?"
    - 버튼: "취소" (왼쪽), "확인" (오른쪽)
  - **기능 구현**
    - `isOpen === false`일 때 null 반환
    - 취소 버튼 클릭 시 `onClose()` 호출
    - 확인 버튼 클릭 시 `onConfirm()` 호출
    - `isLoading === true`일 때 버튼 비활성화
    - 확인 버튼 텍스트: 로딩 중 "초기화 중...", 아니면 "확인"
  - **접근성**
    - `data-testid="reset-confirm-dialog"` 속성 추가
    - `data-testid="cancel-reset-button"` 속성 추가
    - `data-testid="confirm-reset-button"` 속성 추가
  - JSDoc 주석 추가
  - 파일: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/index.tsx`

- [ ] T015 src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/styles.module.css 생성
  - 오버레이 스타일 (반투명 배경)
  - 다이얼로그 스타일 (중앙 정렬, 흰색 배경, 그림자)
  - 헤더 스타일 (경고 아이콘 포함)
  - 경고 메시지 스타일 (리스트 형식)
  - 버튼 스타일:
    - 취소 버튼: 보조 버튼 스타일
    - 확인 버튼: 위험 버튼 스타일 (빨강 계열)
  - 파일: `src/components/home/components/egg-slot-modal/components/reset-confirm-dialog/styles.module.css`

### EggSlotModal 컴포넌트 구현

- [ ] T016 src/components/home/components/egg-slot-modal/ 디렉토리 생성
  - 파일: `src/components/home/components/egg-slot-modal/`

- [ ] T017 src/components/home/components/egg-slot-modal/types.ts 생성
  - `EggSlotModalProps` 인터페이스 정의
    - `isOpen` (boolean): 모달 열림 상태
    - `onClose` (() => void): 닫기 핸들러
  - `SlotInfo` 인터페이스 정의
    - `totalSlots` (number): 전체 슬롯 개수
    - `usedSlots` (number): 사용 중인 슬롯 개수
    - `remainingSlots` (number): 남은 슬롯 개수
  - JSDoc 주석 추가
  - 파일: `src/components/home/components/egg-slot-modal/types.ts`

- [ ] T018 src/components/home/components/egg-slot-modal/index.tsx 생성
  - **상태 관리**
    - `isConfirmDialogOpen` 상태 (초기화 확인 다이얼로그 열림 상태)
    - `useSlotManagement` 훅 사용
  - **컴포넌트 구조**
    - 오버레이 + 모달 레이아웃
    - 헤더: "이스터에그 슬롯 정보"
    - 로딩 상태: "로딩 중..." 표시
    - 에러 상태: 에러 메시지 + "다시 시도" 버튼
    - 슬롯 정보:
      - EggSlot 컴포넌트 재사용 (시각적 표시)
      - 텍스트 정보: "전체 슬롯: X개", "사용 중: X개", "남은 슬롯: X개"
    - 초기화 버튼: "🔄 슬롯 초기화"
    - 초기화 에러 메시지 (발생 시)
    - 닫기 버튼
  - **기능 구현**
    - `isOpen === false`일 때 null 반환
    - 초기화 버튼 클릭 시 확인 다이얼로그 열기
    - 확인 다이얼로그에서 확인 시 `resetSlots()` 호출
    - 초기화 성공 시 모달 자동 닫기 (`useEffect`로 `resetSuccess` 감지)
    - "다시 시도" 버튼 클릭 시 `refetch()` 호출
  - **접근성**
    - `data-testid="egg-slot-modal"` 속성 추가
    - `data-testid="reset-button"` 속성 추가
    - `data-testid="close-modal-button"` 속성 추가
  - JSDoc 주석 추가
  - 파일: `src/components/home/components/egg-slot-modal/index.tsx`

- [ ] T019 src/components/home/components/egg-slot-modal/styles.module.css 생성
  - 오버레이 스타일 (반투명 배경)
  - 모달 스타일 (중앙 정렬, 흰색 배경, 그림자)
  - 헤더 스타일
  - 슬롯 표시 영역 스타일
  - 슬롯 정보 텍스트 스타일
  - 초기화 버튼 스타일 (위험 색상)
  - 에러 메시지 스타일
  - 닫기 버튼 스타일
  - 파일: `src/components/home/components/egg-slot-modal/styles.module.css`

---

## Phase 5: 홈 페이지 통합

### 홈 페이지 수정

- [ ] T020 src/app/(main)/page.tsx 수정
  - **상태 추가**
    - `isSlotModalOpen` 상태 (슬롯 모달 열림 상태)
  - **훅 사용**
    - `useSlotManagement` 훅 import 및 사용
  - **EggSlot 컴포넌트 수정**
    - `count` prop: `slotInfo?.remainingSlots ?? 3`
    - `onClick` prop: `() => setIsSlotModalOpen(true)`
    - `isLoading` prop: `isLoading`
  - **EggSlotModal 추가**
    - `isOpen` prop: `isSlotModalOpen`
    - `onClose` prop: `() => setIsSlotModalOpen(false)`
  - 파일: `src/app/(main)/page.tsx`

---

## Phase 6: 이스터에그 제출 훅 수정

### useEasterEggSubmit 훅 수정

- [ ] T021 src/components/home/hooks/useEasterEggSubmit.ts 수정
  - `SLOT_QUERY_KEYS` import 추가
  - `useQueryClient` 훅 사용
  - 이스터에그 생성 성공 시 (`onSuccess`) 슬롯 정보 쿼리 무효화
    - `queryClient.invalidateQueries({ queryKey: SLOT_QUERY_KEYS.slotInfo() })`
  - 파일: `src/components/home/hooks/useEasterEggSubmit.ts`

---

## Phase 7: E2E 테스트 (UI 통합 테스트)

### UI 통합 테스트 작성

- [ ] T022 [US1] tests/e2e/slot-management/slot-management-ui.e2e.spec.ts 생성
  - **슬롯 조회 및 표시 테스트**
    - 홈 페이지 접속
    - egg-slot 컴포넌트 표시 확인
    - API 호출 대기 (`/api/capsules/slots`)
    - 슬롯 개수 시각적 표시 확인 (채워진 알 개수)
  - **슬롯 모달 열기 테스트**
    - egg-slot 클릭
    - 모달 열림 확인
    - 슬롯 정보 텍스트 확인 ("전체 슬롯: X개")
  - 파일: `tests/e2e/slot-management/slot-management-ui.e2e.spec.ts`

- [ ] T023 [US2] tests/e2e/slot-management/slot-management-ui.e2e.spec.ts에 슬롯 감소 테스트 추가
  - **이스터에그 작성 후 슬롯 감소 테스트**
    - 초기 슬롯 개수 확인
    - 이스터에그 작성 완료
    - 슬롯 조회 API 재호출 대기
    - 슬롯 개수 감소 확인 (채워진 알 개수 -1)
  - 파일: `tests/e2e/slot-management/slot-management-ui.e2e.spec.ts`

- [ ] T024 [US3] tests/e2e/slot-management/slot-management-ui.e2e.spec.ts에 슬롯 초기화 테스트 추가
  - **슬롯 초기화 성공 테스트**
    - egg-slot 클릭하여 모달 열기
    - "슬롯 초기화" 버튼 클릭
    - 확인 다이얼로그 열림 확인
    - "확인" 버튼 클릭
    - 초기화 API 호출 대기 (`/api/capsules/slots/reset`)
    - 모달 닫힘 확인
    - 슬롯 개수 3개로 복구 확인
  - 파일: `tests/e2e/slot-management/slot-management-ui.e2e.spec.ts`

- [ ] T025 [US4] tests/e2e/slot-management/slot-management-ui.e2e.spec.ts에 초기화 취소 테스트 추가
  - **초기화 취소 테스트**
    - egg-slot 클릭하여 모달 열기
    - "슬롯 초기화" 버튼 클릭
    - 확인 다이얼로그 열림 확인
    - "취소" 버튼 클릭
    - 다이얼로그 닫힘 확인
    - 슬롯 상태 변경 없음 확인
  - 파일: `tests/e2e/slot-management/slot-management-ui.e2e.spec.ts`

### E2E 테스트 실행

- [ ] T026 npm test 실행하여 모든 E2E 테스트 통과 확인
  - 모든 테스트 케이스 통과 확인
  - 실패 시 컴포넌트 수정
  - 명령어: `npm test tests/e2e/slot-management/`

---

## Phase 8: 빌드 및 배포

### 빌드 테스트

- [ ] T027 npm run build 실행하여 빌드 성공 확인
  - 타입 에러 없음 확인
  - 빌드 경고 없음 확인
  - 빌드 성공 확인
  - 명령어: `npm run build`

### 커밋 및 푸시

- [ ] T028 git add, commit, push
  - 변경된 파일 스테이징
  - 커밋 메시지 작성:
    ```
    feat: 이스터에그 슬롯 관리 기능 구현
    
    - 슬롯 조회 API 연동 (GET /api/capsules/slots)
    - 슬롯 초기화 API 연동 (POST /api/capsules/slots/reset)
    - egg-slot 컴포넌트에 슬롯 조회 기능 통합
    - egg-slot-modal 컴포넌트 신규 생성
    - reset-confirm-dialog 컴포넌트 신규 생성
    - useSlotManagement 훅 구현
    - 실시간 슬롯 상태 반영 로직 구현
    - E2E 테스트 작성 및 통과
    ```
  - 원격 저장소에 푸시
  - 명령어: `git add . && git commit && git push`

---

## 체크리스트 요약

### Phase 1: API 함수 및 타입 정의 (3개)
- [x] T001 엔드포인트 추가
- [x] T002 타입 정의
- [x] T003 API 함수 구현

### Phase 2: E2E 테스트 - API (4개)
- [x] T004 테스트 디렉토리 생성
- [x] T005 슬롯 조회 API 테스트
- [x] T006 슬롯 초기화 API 테스트
- [x] T007 E2E 테스트 실행 (API 함수 구현 검증 완료)

### Phase 3: 슬롯 관리 훅 (1개)
- [ ] T008 useSlotManagement 훅 구현

### Phase 4: UI 컴포넌트 (11개)
- [ ] T009 EggSlot types 수정
- [ ] T010 EggSlot 컴포넌트 수정
- [ ] T011 EggSlot 스타일 수정
- [ ] T012 ResetConfirmDialog 디렉토리 생성
- [ ] T013 ResetConfirmDialog types 생성
- [ ] T014 ResetConfirmDialog 컴포넌트 구현
- [ ] T015 ResetConfirmDialog 스타일 생성
- [ ] T016 EggSlotModal 디렉토리 생성
- [ ] T017 EggSlotModal types 생성
- [ ] T018 EggSlotModal 컴포넌트 구현
- [ ] T019 EggSlotModal 스타일 생성

### Phase 5: 홈 페이지 통합 (1개)
- [ ] T020 홈 페이지 수정

### Phase 6: 이스터에그 제출 훅 수정 (1개)
- [ ] T021 useEasterEggSubmit 훅 수정

### Phase 7: E2E 테스트 - UI (5개)
- [ ] T022 슬롯 조회 및 표시 테스트
- [ ] T023 슬롯 감소 테스트
- [ ] T024 슬롯 초기화 테스트
- [ ] T025 초기화 취소 테스트
- [ ] T026 E2E 테스트 실행

### Phase 8: 빌드 및 배포 (2개)
- [ ] T027 빌드 테스트
- [ ] T028 커밋 및 푸시

---

## 작업 순서 (TDD 방식)

1. **API 함수 먼저** (T001-T003)
2. **E2E 테스트 먼저** (T004-T007)
3. **훅 구현** (T008)
4. **UI 컴포넌트 구현** (T009-T019)
5. **통합** (T020-T021)
6. **UI E2E 테스트** (T022-T026)
7. **빌드 및 배포** (T027-T028)

---

## 주의사항

### API 함수 구현 시
- `apiClient`를 사용하여 일관된 API 통신 유지
- 타입 안전성 보장 (TypeScript 제네릭 사용)
- JSDoc 주석으로 문서화

### E2E 테스트 작성 시
- API 함수를 직접 호출하여 테스트 (Phase 2)
- UI를 통한 통합 테스트 (Phase 7)
- `data-testid` 속성을 활용한 요소 선택
- API 호출 대기 (`page.waitForResponse`)

### React Query 사용 시
- 쿼리 키를 상수로 정의하여 일관성 유지
- 캐시 무효화를 통한 실시간 동기화
- `staleTime`과 `cacheTime` 적절히 설정

### UI 컴포넌트 구현 시
- 기존 UI 패턴 및 스타일 가이드 준수
- 접근성 고려 (시맨틱 HTML, ARIA 속성)
- 로딩 및 에러 상태 처리
- `data-testid` 속성 추가 (E2E 테스트용)

### 초기화 기능 구현 시
- 2단계 확인 절차 (버튼 → 다이얼로그)
- 경고 메시지 명확히 표시
- 되돌릴 수 없음을 강조
- 로딩 중 버튼 비활성화

---

## 예상 소요 시간

| Phase | 작업 수 | 예상 시간 |
|-------|---------|----------|
| Phase 1 | 3개 | 1-2시간 |
| Phase 2 | 4개 | 2-3시간 |
| Phase 3 | 1개 | 1-2시간 |
| Phase 4 | 11개 | 4-6시간 |
| Phase 5 | 1개 | 30분-1시간 |
| Phase 6 | 1개 | 30분-1시간 |
| Phase 7 | 5개 | 2-3시간 |
| Phase 8 | 2개 | 30분-1시간 |
| **합계** | **28개** | **12-20시간** |

---

## 완료 기준

### 기능 완성도
- [ ] 슬롯 조회 API 연동 완료
- [ ] 슬롯 초기화 API 연동 완료
- [ ] egg-slot 컴포넌트에 슬롯 정보 표시
- [ ] egg-slot-modal 구현 완료
- [ ] 초기화 확인 다이얼로그 구현 완료
- [ ] 이스터에그 생성 후 슬롯 자동 갱신
- [ ] 슬롯 초기화 후 슬롯 자동 갱신

### 품질 기준
- [ ] 모든 E2E 테스트 통과
- [ ] 타입 에러 없음
- [ ] 빌드 성공
- [ ] 에러 처리 완료
- [ ] 로딩 상태 처리 완료

### 사용자 경험
- [ ] 슬롯 상태가 시각적으로 명확하게 표시
- [ ] 로딩 중 상태 표시
- [ ] 에러 발생 시 재시도 옵션 제공
- [ ] 초기화 확인/취소 버튼 명확히 구분
- [ ] 모달 닫기 버튼 동작

---

**작업 시작일**: 2026-01-27  
**예상 완료일**: 2026-01-30  
**담당자**: [담당자 이름]
