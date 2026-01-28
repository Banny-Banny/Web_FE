# 작업 목록: 친구 관리

## 개요

이 문서는 "친구 관리" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/008-friend-management/spec.md`
- 기술 계획: `specs/008-friend-management/plan.md`

**총 작업 수**: 31개
**완료된 작업**: 31개
**남은 작업**: 0개
**예상 소요 기간**: 2-3일 (테스트 작성)

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 | 작업 수 | 완료 |
|-----------|------|---------|------|
| US1 | 친구 목록 확인 | 4개 | ✅ |
| US2 | 카카오톡 친구 자동 연동 | 1개 | ✅ |
| US3 | 전화번호로 친구 추가 | 3개 | ✅ |
| US4 | 이메일로 친구 추가 | 2개 | ✅ |
| US5 | 친구 목록 새로고침 | 2개 | ✅ |
| US6 | 친구 삭제 | 3개 | ✅ |
| 공통 | API 및 테스트 | 10개 | 7개 남음 |

---

## Phase 1: API 연동 레이어

### 타입 정의

- [x] T001 src/commons/apis/me/friends/types.ts 생성
  - `Friend` 인터페이스 추가 (id, nickname, profileImg)
  - `Friendship` 인터페이스 추가 (id, status, friend, createdAt)
  - `GetFriendsParams` 인터페이스 추가 (limit, offset)
  - `GetFriendsResponse` 인터페이스 추가 (items, total, limit, offset, hasNext)
  - `AddFriendRequest` 인터페이스 추가 (phoneNumber, email)
  - `AddFriendResponse` 인터페이스 추가 (message, friendshipId)
  - 파일: `src/commons/apis/me/friends/types.ts`

### API 함수 구현

- [x] T002 src/commons/apis/me/friends/index.ts 생성
  - `getFriends` 함수 추가
    - `GetFriendsParams` 파라미터 받기
    - Query 파라미터로 limit, offset 전달
    - `apiClient.get`를 사용한 API 호출
    - `GetFriendsResponse` 반환
    - 에러 핸들링 (Axios 에러를 ApiError로 변환)
  - 파일: `src/commons/apis/me/friends/index.ts`

- [x] T003 src/commons/apis/me/friends/index.ts 수정
  - `addFriend` 함수 추가
    - `AddFriendRequest` 파라미터 받기
    - `apiClient.post`를 사용한 API 호출
    - `AddFriendResponse` 반환
    - 에러 핸들링 (400, 401, 404, 409 처리)
  - 파일: `src/commons/apis/me/friends/index.ts`

- [x] T004 src/commons/apis/me/friends/index.ts 수정
  - `deleteFriend` 함수 추가
    - `friendshipId` (string) 파라미터 받기
    - Path 파라미터로 friendshipId 전달
    - `apiClient.delete`를 사용한 API 호출
    - 에러 핸들링 (401, 403, 404 처리)
  - 파일: `src/commons/apis/me/friends/index.ts`

---

## Phase 2: React Query Hooks

- [x] T005 src/commons/apis/me/friends/hooks/useFriends.ts 생성
  - `useFriends` 훅 구현
    - `GetFriendsParams` 파라미터 받기
    - `useQuery`를 사용한 친구 목록 조회
    - Query Key: `['friends', 'list', limit, offset]`
    - 캐싱 전략: staleTime 1분, gcTime 5분
    - 재시도 전략: 4xx 오류는 재시도 안 함, 5xx는 최대 1회
  - 파일: `src/commons/apis/me/friends/hooks/useFriends.ts`

- [x] T006 src/commons/apis/me/friends/hooks/useAddFriend.ts 생성
  - `useAddFriend` 훅 구현
    - `useMutation`을 사용한 친구 추가
    - 성공 시 `queryClient.invalidateQueries(['friends', 'list'])` 호출
  - 파일: `src/commons/apis/me/friends/hooks/useAddFriend.ts`

- [x] T007 src/commons/apis/me/friends/hooks/useDeleteFriend.ts 생성
  - `useDeleteFriend` 훅 구현
    - `useMutation`을 사용한 친구 삭제
    - 성공 시 `queryClient.invalidateQueries(['friends', 'list'])` 호출
  - 파일: `src/commons/apis/me/friends/hooks/useDeleteFriend.ts`

- [x] T008 src/commons/apis/me/friends/hooks/index.ts 생성
  - 훅 통합 익스포트 (useFriends, useAddFriend, useDeleteFriend)
  - 파일: `src/commons/apis/me/friends/hooks/index.ts`

---

## Phase 3: UI 컴포넌트 구현

### [US1] 친구 목록 확인

- [x] T009 [US1] src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - `useFriends` 훅을 사용한 친구 목록 조회
  - 로딩 상태 표시 (isLoading)
  - 오류 상태 처리 및 재시도 버튼
  - 빈 상태 안내 메시지 (friends.length === 0)
  - 친구 항목 렌더링 (닉네임, 프로필 이미지)
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

- [x] T010 [P] [US1] src/components/Mypage/components/activity-stats/friend/styles.module.css 수정
  - 로딩 상태 스타일 추가 (.loadingContainer)
  - 오류 상태 스타일 추가 (.errorContainer, .errorMessage, .retryButton)
  - 빈 상태 스타일 추가 (.emptyContainer, .emptySubtext)
  - 친구 항목 스타일 수정 (프로필 이미지 지원)
  - 파일: `src/components/Mypage/components/activity-stats/friend/styles.module.css`

### [US2] 카카오톡 친구 자동 연동

- [x] T011 [US2] 카카오톡 친구 자동 연동 처리
  - 서버 측에서 자동 처리되므로 프론트엔드 별도 구현 불필요
  - 친구 목록 조회 시 자동으로 포함됨
  - 정보 섹션에 카카오톡 친구 동기화 안내 문구 추가
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

### [US3] 전화번호로 친구 추가

- [x] T012 [US3] src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - 친구 추가 폼 상태 관리 (addType, phoneNumber, addError, showAddForm)
  - 전화번호 타입 선택 버튼
  - 전화번호 입력 필드
  - `isValidPhoneNumber` 검증 함수 사용
  - `useAddFriend` 훅을 사용한 친구 추가
  - 성공 시 폼 초기화 및 목록 자동 갱신
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

- [x] T013 [P] [US3] src/components/Mypage/components/activity-stats/friend/styles.module.css 수정
  - 친구 추가 섹션 스타일 추가 (.addFriendSection, .addFriendButton)
  - 친구 추가 폼 스타일 추가 (.addFriendForm, .addTypeSelector, .typeButton)
  - 입력 필드 스타일 추가 (.addInputGroup, .addInput, .addInputError)
  - 버튼 그룹 스타일 추가 (.addButtonGroup, .addSubmitButton, .addCancelButton)
  - 오류 메시지 스타일 추가 (.addError)
  - 파일: `src/components/Mypage/components/activity-stats/friend/styles.module.css`

### [US4] 이메일로 친구 추가

- [x] T014 [US4] src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - 이메일 타입 선택 버튼
  - 이메일 입력 필드
  - `isValidEmail` 검증 함수 사용
  - `useAddFriend` 훅을 사용한 친구 추가 (이메일)
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

### [US5] 친구 목록 새로고침

- [x] T015 [US5] src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - 새로고침 버튼 클릭 핸들러 구현
  - `refetch()` 호출
  - 새로고침 중 로딩 표시 (isRefetching)
  - 스피닝 애니메이션 추가
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

- [x] T016 [P] [US5] src/components/Mypage/components/activity-stats/friend/styles.module.css 수정
  - 새로고침 버튼 스타일 수정 (.refreshButton:disabled)
  - 스피닝 애니메이션 추가 (@keyframes spin, .spinning)
  - 새로고침 중 표시 스타일 추가 (.refreshingIndicator)
  - 파일: `src/components/Mypage/components/activity-stats/friend/styles.module.css`

### [US6] 친구 삭제

- [x] T017 [US6] src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - 각 친구 항목에 삭제 버튼 추가
  - 삭제 확인 다이얼로그 (window.confirm)
  - `useDeleteFriend` 훅을 사용한 친구 삭제
  - 성공 시 목록 자동 갱신
  - 삭제 중 로딩 상태 표시 (isDeleting)
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

- [x] T018 [P] [US6] src/components/Mypage/components/activity-stats/friend/styles.module.css 수정
  - 삭제 버튼 스타일 수정 (.blockButton:disabled)
  - 파일: `src/components/Mypage/components/activity-stats/friend/styles.module.css`

---

## Phase 4: 검증 로직

- [x] T019 src/components/Mypage/components/activity-stats/friend/index.tsx 수정
  - 기존 검증 유틸리티 import (`isValidPhoneNumber`, `isValidEmail`)
  - 클라이언트 측 검증 로직 구현
  - 입력 필드 실시간 검증
  - 오류 메시지 표시
  - 파일: `src/components/Mypage/components/activity-stats/friend/index.tsx`

---

## Phase 5: E2E 테스트 (Playwright)

- [x] T020 tests/e2e/friend-management/friend-management.e2e.spec.ts 생성
  - 친구 목록 조회 테스트
    - 마이페이지에서 친구 영역 클릭
    - 친구 목록 자동 조회 확인
    - 친구 목록 렌더링 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

- [x] T021 [P] tests/e2e/friend-management/friend-management.e2e.spec.ts 수정
  - 전화번호로 친구 추가 테스트
    - 친구 추가 버튼 클릭
    - 전화번호 타입 선택
    - 전화번호 입력
    - 추가 버튼 클릭
    - 성공 메시지 확인
    - 친구 목록에 추가된 친구 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

- [x] T022 [P] tests/e2e/friend-management/friend-management.e2e.spec.ts 수정
  - 이메일로 친구 추가 테스트
    - 친구 추가 버튼 클릭
    - 이메일 타입 선택
    - 이메일 입력
    - 추가 버튼 클릭
    - 성공 메시지 확인
    - 친구 목록에 추가된 친구 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

- [x] T023 [P] tests/e2e/friend-management/friend-management.e2e.spec.ts 수정
  - 친구 삭제 테스트
    - 친구 항목의 삭제 버튼 클릭
    - 확인 다이얼로그 확인
    - 확인 클릭
    - 친구 목록에서 제거 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

- [x] T024 [P] tests/e2e/friend-management/friend-management.e2e.spec.ts 수정
  - 친구 목록 새로고침 테스트
    - 새로고침 버튼 클릭
    - 새로고침 중 표시 확인
    - 최신 친구 목록 표시 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

- [x] T025 [P] tests/e2e/friend-management/friend-management.e2e.spec.ts 수정
  - 오류 처리 테스트
    - 존재하지 않는 전화번호로 친구 추가 시도
    - 404 오류 메시지 확인
    - 이미 친구인 사용자 추가 시도
    - 409 오류 메시지 확인
  - 파일: `tests/e2e/friend-management/friend-management.e2e.spec.ts`

---

## Phase 6: UI 테스트 (Playwright)

- [x] T026 [P] tests/ui/friend-management/friend-management.ui.spec.ts 생성
  - 컴포넌트 렌더링 테스트
    - 친구 목록 컴포넌트 렌더링 확인
    - 헤더, 정보 섹션, 친구 목록 영역 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

- [x] T027 [P] tests/ui/friend-management/friend-management.ui.spec.ts 수정
  - 로딩 상태 표시 테스트
    - 친구 목록 조회 중 로딩 메시지 표시 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

- [x] T028 [P] tests/ui/friend-management/friend-management.ui.spec.ts 수정
  - 오류 상태 표시 테스트
    - API 오류 발생 시 오류 메시지 표시 확인
    - 재시도 버튼 표시 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

- [x] T029 [P] tests/ui/friend-management/friend-management.ui.spec.ts 수정
  - 빈 상태 표시 테스트
    - 친구 목록이 비어있을 때 안내 메시지 표시 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

- [x] T030 [P] tests/ui/friend-management/friend-management.ui.spec.ts 수정
  - 친구 추가 폼 상호작용 테스트
    - 친구 추가 버튼 클릭 시 폼 표시 확인
    - 전화번호/이메일 타입 전환 확인
    - 입력 필드 검증 오류 메시지 표시 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

- [x] T031 [P] tests/ui/friend-management/friend-management.ui.spec.ts 수정
  - 친구 삭제 확인 다이얼로그 테스트
    - 삭제 버튼 클릭 시 확인 다이얼로그 표시 확인
  - 파일: `tests/ui/friend-management/friend-management.ui.spec.ts`

---

## 의존성 및 실행 순서

### 순차 실행 필요

1. **Phase 1 (API Layer)**: 모든 후속 작업의 기초
   - T001 → T002 → T003 → T004

2. **Phase 2 (React Query Hooks)**: Phase 1 완료 후 실행
   - T005 → T006 → T007 → T008

3. **Phase 3 (UI Component)**: Phase 2 완료 후 실행
   - US1 → US2 → US3 → US4 → US5 → US6 순서로 구현

4. **Phase 4 (Validation)**: Phase 3 완료 후 실행
   - T019

5. **Phase 5 (E2E Tests)**: Phase 1-4 완료 후 실행
   - 모든 E2E 테스트는 병렬 작성 가능 ([P] 마커)

6. **Phase 6 (UI Tests)**: Phase 1-4 완료 후 실행
   - 모든 UI 테스트는 병렬 작성 가능 ([P] 마커)

### 병렬 처리 가능 ([P] 마커)

- **Phase 3**: 스타일 파일 작업 (T010, T013, T016, T018)
- **Phase 5**: 모든 E2E 테스트 (T020-T025)
- **Phase 6**: 모든 UI 테스트 (T026-T031)

---

## 구현 전략

### MVP 범위

**우선순위 1 (P1)**: 핵심 기능
- ✅ 친구 목록 조회 (US1)
- ✅ 친구 추가 (US3, US4)
- ✅ 친구 삭제 (US6)

**우선순위 2 (P2)**: 편의 기능
- ✅ 친구 목록 새로고침 (US5)
- ✅ 카카오톡 친구 자동 연동 (US2) - 서버 측 처리

**우선순위 3 (P3)**: 테스트 및 최적화
- ⏳ E2E 테스트
- ⏳ UI 테스트

### 점진적 전달

1. **1차 전달**: API 레이어 + 기본 UI (US1, US3, US6)
2. **2차 전달**: 추가 기능 (US4, US5)
3. **3차 전달**: 테스트 완료

---

## 완료 상태 요약

### ✅ 완료된 작업 (31개)

- **API Layer**: 4개 작업 완료
- **React Query Hooks**: 4개 작업 완료
- **UI Component**: 9개 작업 완료
- **Validation**: 1개 작업 완료
- **E2E Tests**: 6개 작업 완료
- **UI Tests**: 6개 작업 완료

---

## 다음 단계

1. ✅ E2E 테스트 작성 완료 (T020-T025)
2. ✅ UI 테스트 작성 완료 (T026-T031)
3. ⏳ 테스트 실행 및 버그 수정
4. ⏳ 사용자 승인 및 피드백 반영

---

## 참고사항

1. **카카오톡 친구 자동 연동**: 서버 측에서 처리되므로 프론트엔드에서는 별도 구현 불필요
2. **검증 로직**: 기존 `src/components/Login/utils/validation.ts`의 함수 재사용
3. **에러 처리**: api-client에서 401 오류는 자동으로 로그인 페이지로 리다이렉트
4. **성능**: 친구 목록이 많아질 경우 가상화(virtualization) 고려 가능
5. **페이지네이션**: 현재는 기본값(limit: 20, offset: 0)만 사용, 추후 무한 스크롤 구현 가능
