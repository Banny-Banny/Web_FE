# 작업 목록: 마이페이지 캡슐보관함

## 개요

이 문서는 "마이페이지 캡슐보관함" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/012-mypage-capsule-storage/spec.md`
- 기술 계획: `specs/012-mypage-capsule-storage/plan.md`

**총 작업 수**: 33개  
**예상 소요 기간**: 2~3일  

**워크플로우 (순서 고정)**:
1. **API 연동** → 2. **React Query 훅·날짜 유틸** → 3. **페이지·진입 경로** → 4. **UI (Mock)** → 5. **데이터 바인딩** → 6. **E2E·UI 테스트**

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 (spec.md 시나리오) | 작업 수 |
|-----------|-------------------------|---------|
| US1 | 캡슐보관함에서 작성 중인 캡슐로 이동해 작성하기 (대기실 → /waiting-room/[id]) | 4개 |
| US2 | 열린 캡슐 내용 확인하기 (열린 리스트 + 상세 모달) | 5개 |
| US3 | 잠긴 캡슐의 개봉일만 확인하기 (잠긴 리스트, 상세 미오픈) | 3개 |
| US4 | 캡슐이 없을 때 (빈 상태 안내) | 2개 |
| US5 | 캡슐보관함 닫고 마이페이지로 돌아가기 (닫기·진입 경로) | 3개 |
| 공통 | API·훅·페이지·테스트 | 16개 |

---

## Phase 1: API 연동

**목표**: `commons/apis/me/capsules` 및 타임캡슐 상세 API 연결 (엔드포인트·타입·호출 함수·날짜 유틸).

- [x] T001 `src/commons/apis/endpoints.ts`에 ME 캡슐·타임캡슐 상세 엔드포인트 추가
  - ME_CAPSULES: `GET /api/me/capsules` (목록)
  - 타임캡슐 상세: `GET /api/timecapsules/:id?user_id=` (또는 기존 CAPSULE 엔드포인트 확장)
  - AUTH_ENDPOINTS 또는 ME·CAPSULE 전용 상수에 추가

- [x] T002 [P] `src/commons/apis/me/capsules/types.ts` 생성
  - MyCapsuleItem (id, title, status, openDate, participantCount, completedCount, myWriteStatus, deadline, createdAt, location?)
  - MyCapsuleListResponse (items, total, limit, offset, hasNext?)
  - CategorizedCapsules (waitingRooms, openedCapsules, lockedCapsules)
  - 서버 응답 camelCase 기준 타입 정의

- [x] T003 [P] 타임캡슐 상세 타입 정의 (`src/commons/apis/me/capsules/types.ts` 확장 또는 `src/commons/apis/timecapsules/types.ts` 생성)
  - CapsuleDetailSlotAuthor, SlotContentImage, SlotContentVideo, SlotContentAudio, SlotContent, CapsuleDetailSlot, CapsuleDetailResponse
  - snake_case 응답 시 camelCase 변환용 타입 포함

- [x] T004 `src/commons/apis/me/capsules/index.ts` 생성
  - getMyCapsules(limit?, offset?): GET /api/me/capsules, 응답 data 반환
  - fetchAllMyCapsules(): hasNext 동안 limit/offset 반복 호출 후 items 합쳐 반환 (또는 훅 내부에서 처리)
  - api-client(Axios) 사용, 401/500 시 빈 배열 반환해 UI 유지

- [x] T005 타임캡슐 상세 API 함수 생성 (`src/commons/apis/timecapsules/detail.ts` 또는 `src/commons/apis/capsules/detail.ts`)
  - getCapsuleDetail(id: string, userId: string): GET /api/timecapsules/:id?user_id=, 응답 snake_case → camelCase 변환 유틸 적용 후 반환
  - 401/403/404/500 시 throw 또는 에러 객체 반환해 훅에서 처리

- [x] T006 [P] `src/commons/utils/date.ts` 확장 (또는 `src/commons/utils/capsule-date.ts` 생성)
  - formatRemainingTime(deadline: string | null): "N일 N시간 N분" 또는 "마감됨"
  - formatDday(openDate: string | null): "D-N일 남음", "오늘 개봉", "개봉됨"
  - formatCapsuleDate(isoString: string): "YYYY년 MM월 DD일" (dayjs 또는 기존 format 활용)

---

## Phase 2: React Query 훅

**목표**: useMyCapsules(목록·분류), useCapsuleDetail(상세) 구현.

- [x] T007 `src/commons/apis/me/capsules/hooks/useMyCapsules.ts` 생성
  - getMyCapsules 또는 fetchAllMyCapsules 호출, queryKey: ['me', 'capsules', 'list']
  - useMemo로 분류 로직 적용 (openDate·deadline null 제외, WAITING → waitingRooms, openDate ≤ now → openedCapsules, else lockedCapsules)
  - 반환: { waitingRooms, openedCapsules, lockedCapsules, isLoading, isError, refetch }
  - staleTime 0, refetchOnWindowFocus true, gcTime 5분

- [x] T008 [P] `src/commons/apis/timecapsules/hooks/useCapsuleDetail.ts` 생성 (또는 `src/commons/apis/capsules/hooks/useCapsuleDetail.ts`)
  - getCapsuleDetail(id, userId) 호출, queryKey: ['timecapsules', 'detail', id]
  - enabled: !!id && !!userId (현재 사용자 ID는 useAuth 등에서 획득)
  - staleTime 1분

- [x] T009 `src/commons/apis/me/capsules/hooks/index.ts` 생성 및 `src/commons/apis/timecapsules/hooks/index.ts` (또는 capsules/hooks) 익스포트 정리
  - useMyCapsules 익스포트
  - useCapsuleDetail 익스포트

---

## Phase 3: 캡슐보관함 페이지 및 진입 경로

**목표**: 캡슐보관함 전용 페이지 추가, 마이페이지 "캡슐" 클릭 시 진입.

- [x] T010 [US5] `src/app/(main)/profile/capsules/page.tsx` 생성
  - CapsuleStorage 컨테이너 렌더
  - 공통 레이아웃(Main Layout) 적용, 375px 프레임

- [x] T011 [US5] `src/components/Mypage/index.tsx` 수정
  - 활동 카드 "캡슐" 영역에 onClick 추가 → router.push('/profile/capsules')
  - 기존 timeCapsuleCount 표시 유지

---

## Phase 4: UI 구현 (Mock 데이터 기반)

**목표**: 캡슐보관함 컨테이너·헤더·대기실·탭·열린/잠긴 리스트·상세 모달을 Mock 데이터로 구현 (375px, CSS Modules).

- [x] T012 [P] `src/components/CapsuleStorage/types.ts` 생성
  - 컴포넌트 props 타입 (CapsuleHeaderProps, WaitingRoomSectionProps, CapsuleTabsProps, OpenedCapsuleListProps, LockedCapsuleListProps, CapsuleDetailModalProps)
  - MyCapsuleItem, CategorizedCapsules 등 commons 타입 re-export 또는 import

- [x] T013 [P] [US5] `src/components/CapsuleStorage/components/CapsuleHeader.tsx` 생성
  - 제목 "캡슐보관함", 우측 닫기 버튼(X), 서브타이틀 "열린 캡슐 N개 · 잠긴 캡슐 N개" (props로 전달)
  - onClose 콜백, 375px·CSS Modules

- [x] T014 [P] [US1] `src/components/CapsuleStorage/components/WaitingRoomSection.tsx` 생성
  - 섹션 제목 "캡슐 대기실", "N개", 가로 스크롤(overflow-x: auto) 카드 리스트
  - 카드: 제목, 진행률(completedCount/participantCount)·프로그레스 바, 참여자 요약, 남은 시간(formatRemainingTime)
  - onCardClick(capsuleId) 콜백, Mock 데이터로 렌더
  - 빈 목록 시 "캡슐이 없어요" 안내

- [x] T015 [P] `src/components/CapsuleStorage/components/CapsuleTabs.tsx` 생성
  - "열린 캡슐 (N)", "잠긴 캡슐 (N)" 탭, 선택 탭 하단 인디케이터
  - activeTab, onTabChange props

- [x] T016 [P] [US2] `src/components/CapsuleStorage/components/OpenedCapsuleList.tsx` 생성
  - 열린 캡슐 세로 리스트, 카드: 💊, 제목, 위치(지도 아이콘+주소), 묻은/열린 날짜(formatCapsuleDate)
  - onCardClick(capsuleId) 콜백, Mock 데이터로 렌더
  - 빈 목록 시 "열린 캡슐이 없어요"

- [x] T017 [P] [US3] `src/components/CapsuleStorage/components/LockedCapsuleList.tsx` 생성
  - 잠긴 캡슐 세로 리스트, 카드: 그라데이션 배경, 💊, 제목, 묻은/열리는 날짜, 푸터 "D-N일 남음"(formatDday)
  - 클릭 시 상세 미오픈(또는 "아직 개봉 전이에요" 안내), Mock 데이터로 렌더
  - 빈 목록 시 "잠긴 캡슐이 없어요"

- [x] T018 [US2] `src/components/CapsuleStorage/components/CapsuleDetailModal.tsx` 생성
  - 헤더: 닫기 버튼, 캡슐 제목, 참여자 아바타(이모지+이름) 목록 — 클릭 시 selectedSlotIndex 전환
  - 콘텐츠: 텍스트, 이미지 캐러셀, 영상(기존 VideoPlayer), 오디오(기존 AudioPlayer)
  - onClose, ESC·오버레이·닫기 버튼으로 닫기, Mock 슬롯 데이터로 렌더
  - 기존 Modal·AudioPlayer·VideoPlayer 재사용

- [x] T019 `src/components/CapsuleStorage/index.tsx` 생성
  - CapsuleHeader, WaitingRoomSection, CapsuleTabs, OpenedCapsuleList 또는 LockedCapsuleList, CapsuleDetailModal 조합
  - 로컬 state: activeTab('opened'|'locked'), isDetailModalOpen, selectedCapsuleId, selectedSlotIndex
  - Mock CategorizedCapsules·Mock 상세 데이터 사용, 375px·CSS Modules

- [x] T020 `src/components/CapsuleStorage/styles.module.css` 및 각 컴포넌트 styles.module.css 생성
  - 컨테이너·헤더·대기실 가로 스크롤·탭·리스트 카드·모달 스타일
  - 375px 고정, 디자인 토큰(색상·타이포) 사용

---

## Phase 5: 데이터 바인딩

**목표**: Mock 제거, useMyCapsules·useCapsuleDetail 연동, 로딩·에러·빈 상태 처리.

- [x] T021 [US1][US2][US3][US4][US5] `src/components/CapsuleStorage/index.tsx` 수정 — useMyCapsules 연동
  - useMyCapsules() 호출, waitingRooms·openedCapsules·lockedCapsules를 자식에 전달
  - 목록 로딩 시 스피너 또는 스켈레톤 표시
  - 목록 에러 시 "불러오지 못했어요" + 재시도/닫기 버튼

- [x] T022 [US1] `src/components/CapsuleStorage/components/WaitingRoomSection.tsx` 수정
  - props로 전달받은 waitingRooms 사용, 카드 클릭 시 router.push(`/waiting-room/${capsule.id}`)
  - formatRemainingTime(deadline) 사용, 진행률·참여자 표시

- [x] T023 [US2] `src/components/CapsuleStorage/components/OpenedCapsuleList.tsx` 수정
  - props로 전달받은 openedCapsules 사용, 카드 클릭 시 onCardClick(capsuleId) → 부모에서 selectedCapsuleId 설정, CapsuleDetailModal 오픈
  - 위치 표시: location 좌표 있으면 Kakao 역지오코딩(기존 address 유틸 또는 useKakaoAddress)으로 주소, 없으면 "-"

- [x] T024 [US2] `src/components/CapsuleStorage/components/CapsuleDetailModal.tsx` 수정
  - useCapsuleDetail(selectedCapsuleId) 호출, 로딩 시 스피너, 403/404 시 "권한이 없어요"/"캡슐을 찾을 수 없어요" + 닫기
  - 슬롯 목록·선택 슬롯 콘텐츠(텍스트·이미지·영상·오디오) 실제 데이터로 렌더

- [x] T025 [US3] `src/components/CapsuleStorage/components/LockedCapsuleList.tsx` 수정
  - props로 전달받은 lockedCapsules 사용, formatDday(openDate) 사용
  - 카드 클릭 시 상세 미오픈(토스트 "아직 개봉 전이에요" 선택 사항)

- [x] T026 [US5] `src/components/CapsuleStorage/components/CapsuleHeader.tsx` 수정
  - 닫기 버튼 클릭 시 router.back() 또는 router.push('/profile')
  - 서브타이틀 열린 N·잠긴 N 동적 표시(props)

- [x] T027 [US4] 빈 상태·로딩·에러 UI 정리
  - WaitingRoomSection·OpenedCapsuleList·LockedCapsuleList 각각 빈 목록 메시지 유지
  - CapsuleStorage 컨테이너: 목록 로딩·에러 시 메시지·재시도/닫기
  - CapsuleDetailModal: 상세 로딩·403/404 에러 메시지

---

## Phase 6: E2E·UI 테스트

**목표**: 캡슐보관함 진입, 대기실 이동, 열린 캡슐 상세, 잠긴 캡슐 비공개, 닫기 시나리오 검증.

- [x] T028 `tests/e2e/capsule-storage/capsule-storage.e2e.spec.ts` 작성
  - 마이페이지 → "캡슐" 영역 클릭 → /profile/capsules 진입, "캡슐보관함" 제목·서브타이틀·대기실/탭 구역 표시
  - 대기실 캡슐 카드 클릭 → /waiting-room/[capsuleId] 이동 확인

- [x] T029 `tests/e2e/capsule-storage/capsule-storage.e2e.spec.ts`에 열린 캡슐 상세 시나리오 추가
  - 열린 캡슐 탭 선택 → 열린 캡슐 카드 클릭 → 상세 모달 열림, 참여자 아바타 클릭 → 슬롯 콘텐츠 전환
  - 모달 닫기(ESC·오버레이·닫기 버튼) → 목록으로 복귀

- [x] T030 `tests/e2e/capsule-storage/capsule-storage.e2e.spec.ts`에 잠긴 캡슐 시나리오 추가
  - 잠긴 캡슐 탭 선택 → 잠긴 캡슐 카드 클릭 → 상세 모달 미오픈(또는 안내만) 확인

- [x] T031 `tests/e2e/capsule-storage/capsule-storage.e2e.spec.ts`에 닫기·진입 시나리오 추가
  - 캡슐보관함 헤더 닫기 버튼 클릭 → 마이페이지(또는 이전 화면) 복귀

- [x] T032 [P] `tests/ui/capsule-storage/capsule-storage.ui.spec.ts` 작성 (선택)
  - 목록 로딩·빈 목록·에러 상태 표시
  - 탭 전환(열린/잠긴), 모달 열기/닫기

- [x] T033 `tests/e2e/capsule-storage/fixtures/mockData.ts` 생성 (선택)
  - Mock MyCapsuleItem·CategorizedCapsules·CapsuleDetailResponse (E2E/UI 테스트용)

---

## 의존성 순서

1. **Phase 1** (API): T001 → T002, T003 → T004, T005, T006
2. **Phase 2** (훅): T004,T005,T006 완료 후 T007 → T008 → T009
3. **Phase 3** (페이지·진입): T010, T011 (T009 이후 가능)
4. **Phase 4** (UI Mock): T012~T020 — T012 후 T013~T018 병렬 가능, T019는 T013~T018 완료 후, T020은 각 컴포넌트와 병렬 가능
5. **Phase 5** (데이터 바인딩): T019 완료 후 T021 → T022,T023,T024,T025,T026,T027 (일부 병렬 가능)
6. **Phase 6** (테스트): T027 완료 후 T028 → T029 → T030 → T031, T032는 T028~T031과 병렬 가능

---

## 병렬 실행 예시

- **Phase 1**: T002, T003은 T001 완료 후 [P] 가능; T006은 T001 없이 [P] 가능
- **Phase 2**: T008은 T005 완료 후 T007과 [P] 가능
- **Phase 4**: T012~T018 중 T012 완료 후 T013~T018 [P] 가능; T020은 각 컴포넌트 작업과 함께 진행
- **Phase 5**: T022~T027은 T021 완료 후 서로 다른 파일이면 [P] 가능
- **Phase 6**: T032는 T028~T031과 [P] 가능

---

## 구현 전략 요약 (순서 고정)

| 순서 | 단계 | 내용 |
|------|------|------|
| 1 | **API 연동** | endpoints·타입·getMyCapsules·fetchAllMyCapsules·getCapsuleDetail·날짜 유틸. |
| 2 | **React Query 훅** | useMyCapsules(분류), useCapsuleDetail, hooks/index. |
| 3 | **페이지·진입** | /profile/capsules 페이지, Mypage "캡슐" → router.push('/profile/capsules'). |
| 4 | **UI (Mock)** | CapsuleStorage 컨테이너·헤더·대기실·탭·열린/잠긴 리스트·상세 모달, 375px·CSS Modules. |
| 5 | **데이터 바인딩** | useMyCapsules·useCapsuleDetail 연동, 로딩·에러·빈 상태, 대기실 클릭 → /waiting-room/[id], 열린 캡슐 모달, Kakao 주소. |
| 6 | **E2E·UI 테스트** | 진입·대기실 이동·열린 상세·잠긴 비공개·닫기·로딩/빈/에러 UI 검증. |

---

## MVP 범위 제안

- **MVP**: US5(진입·닫기) + US1(대기실 목록·작성 페이지 이동) + US4(빈 상태) — Phase 3·4·5 중 해당 작업까지 완료 시 캡슐보관함 진입 후 대기실만 사용 가능.
- **전체**: US2(열린 캡슐 상세 모달), US3(잠긴 캡슐 리스트) 포함 후 Phase 6 E2E·UI 테스트 수행.
