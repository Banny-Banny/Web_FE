# 작업 목록: 공지사항 페이지

## 개요

이 문서는 "공지사항 페이지" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/010-notice-page/spec.md`
- 기술 계획: `specs/010-notice-page/plan.md`

**총 작업 수**: 18개  
**예상 소요 기간**: 1~2일  
**워크플로우**: API 연결(Phase 1~3) 완료 후 **E2E 실행(Phase 4)**으로 연동 검증 → 이후 UI 보완(Phase 5)

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 (spec.md 시나리오) | 작업 수 |
|-----------|-------------------------|---------|
| US1 | 공지사항 목록 보기 (총 N개, 항목 표시, 더보기, 빈 목록) | 5개 |
| US2 | 공지 검색하기 | 1개 |
| US3 | 공지 상세 읽기 | 2개 |
| 공통 | API·훅·라우트·진입·테스트 | 10개 |

---

## Phase 1: API 연동 레이어 (연결만, 훅 없음)

- [ ] T001 `src/commons/apis/endpoints.ts`에 NOTICE_ENDPOINTS 추가
  - LIST: `/api/notices`, DETAIL: (id) => `/api/notices/${id}`
  - ENDPOINTS 객체에 NOTICE: NOTICE_ENDPOINTS 추가

- [ ] T002 [P] `src/commons/apis/notices/types.ts` 생성
  - GetNoticesParams (search?, limit?, offset?)
  - NoticeListItem (id, title, imageUrl, isPinned, isVisible, createdAt)
  - GetNoticesResponseData (items, total, limit, offset)
  - NoticeDetail (id, title, content, imageUrl, isPinned, isVisible, createdAt, updatedAt)
  - ApiResponse<T> (success, data)

- [ ] T003 `src/commons/apis/notices/index.ts` 생성
  - getNotices(params): GET /api/notices, query search/limit/offset, 응답 data 반환
  - getNoticeById(id): GET /api/notices/:id, 응답 data 반환
  - 기존 api-client(Axios) 사용, 에러는 기존 패턴으로 변환

---

## Phase 2: React Query 훅 (components/notice/hooks)

- [ ] T004 [P] `src/components/notice/hooks/useNotices.ts` 생성
  - useNotices(search, limit=10, offset 누적) 훅
  - commons/apis/notices getNotices 호출
  - 더보기 시 offset 증가해 다음 10개 요청 후 기존 items와 concat
  - 검색어 변경 시 offset 0으로 초기화
  - Query key: ['notices', 'list', search?, offset] 또는 누적 리스트 관리

- [ ] T005 [P] `src/components/notice/hooks/useNotice.ts` 생성
  - useNotice(id) 훅, getNoticeById(id) 호출
  - Query key: ['notices', 'detail', id], staleTime/gcTime 설정 (예: 1분/5분)

- [ ] T006 `src/components/notice/hooks/index.ts` 생성
  - useNotices, useNotice 익스포트

---

## Phase 3: 라우트 및 E2E 통과용 최소 UI

(E2E가 API 연동을 검증하려면 /notices·/notices/[id] 페이지와 목록/상세 컴포넌트가 API를 호출해 결과를 보여줘야 함. 스타일·검색·Mypage 메뉴는 Phase 5로 미룸.)

- [ ] T007 [P] `src/app/(main)/notices/page.tsx` 생성
  - 공지사항 목록 페이지, Notice 목록 컨테이너 렌더

- [ ] T008 [P] `src/app/(main)/notices/[id]/page.tsx` 생성
  - 공지사항 상세 페이지, id from params로 NoticeDetail 렌더

- [ ] T009 [US1] `src/components/notice/types.ts` 생성
  - NoticeListProps, NoticeDetailProps 등 컴포넌트 타입

- [ ] T010 [US1] `src/components/notice/index.tsx` 목록 컨테이너 구현
  - PageHeader (title="공지사항", subtitle="총 N개의 공지사항", onButtonPress=닫기)
  - 검색 입력 (플레이스홀더 "공지사항 검색", 엔터/버튼으로 검색)
  - 리스트: 공지 라벨(isPinned), 제목, 상대 시간(createdAt → "N일 전"), 클릭 시 /notices/[id]
  - 더보기 버튼 (loadedCount < total일 때만), 로딩/빈 목록/오류 UI
  - useNotices 훅 사용

- [ ] T012 [US1] 상대 시간 유틸 구현
  - createdAt ISO 문자열 → "N일 전" 등 (commons/utils 또는 notice 내부)

- [ ] T014 [US3] `src/components/notice/notice-detail.tsx` 생성
  - PageHeader (닫기 → 목록으로), useNotice(id)로 상세 조회
  - 제목, 게시 일시, content, imageUrl(있으면 표시)
  - 로딩/오류("공지를 찾을 수 없습니다" + 목록으로 돌아가기)

---

## Phase 4: E2E 실행 및 API 연동 검증

- [ ] T016 `tests/e2e/notice/notice.e2e.spec.ts` 실행 및 API 연동 검증
  - API 연결(Phase 1~3) 완료 후 **즉시** 실행
  - .env.local 기반 로그인 → GET /api/notices·GET /api/notices/:id·검색 호출 및 화면 반영 확인
  - 실패 시 목록/상세 컴포넌트·훅 보완 후 재실행

---

## Phase 5: UI 보완 및 진입 경로

- [ ] T011 [P] [US1] `src/components/notice/styles.module.css` 생성
  - 375px 고정, 디자인 토큰 기반, 터치 영역·간격

- [ ] T013 [US2] `src/components/notice/index.tsx` 검색 연동
  - 검색어 제출 시 useNotices(search) 호출, offset 0, 검색 결과 개수/빈 결과 안내

- [ ] T015 `src/components/Mypage/index.tsx` 수정
  - 내비게이션 카드에 "공지사항" 메뉴 버튼 추가 (고객 센터 버튼 **위**에 배치)
  - 클릭 시 router.push('/notices')

---

## Phase 6: (선택) UI 테스트

- [ ] T017 [P] (선택) `tests/ui/notice/notice.ui.spec.ts` UI 테스트
  - 목록: 로딩, 빈 목록, 오류 상태, 공지 라벨·상대 시간
  - 상세: 로딩, 오류, 본문·이미지

---

## 의존성 순서

1. T001 → T002, T003 (endpoints 선행)
2. T002, T003 완료 후 T004, T005 (API 타입/함수 선행)
3. T004, T005 완료 후 T006
4. T006 완료 후 T007, T008 (라우트)
5. T007, T008, T009 완료 후 T010, T012, T014 (E2E 통과용 최소 목록·상세 UI)
6. **T010, T012, T014 완료 직후 T016 (E2E 실행)** — API 연결 검증을 여기서 수행
7. T016 통과 후 T011, T013, T015 (스타일·검색·Mypage 메뉴)
8. (선택) T017 UI 테스트

---

## 병렬 실행 예시

- **Phase 1**: T002는 T001 완료 후 [P] 가능
- **Phase 2**: T004, T005는 T003 완료 후 서로 [P]
- **Phase 3**: T007, T008은 [P]; T010·T012·T014는 의존 관계에 따라 순차 또는 부분 병렬
- **Phase 5**: T011, T013, T015는 서로 [P] 가능

---

## 구현 전략 (API 연결 후 E2E 우선)

- **1단계**: API(Phase 1) → 훅(Phase 2) → 라우트·최소 목록/상세 UI(Phase 3)
- **2단계**: **E2E 실행(Phase 4)** — API 연동·화면 반영 검증, 실패 시 Phase 3 보완
- **3단계**: 스타일·검색·Mypage(Phase 5), (선택) UI 테스트(Phase 6)
