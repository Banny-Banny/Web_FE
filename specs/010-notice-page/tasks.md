# 작업 목록: 공지사항 페이지

## 개요

이 문서는 "공지사항 페이지" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/010-notice-page/spec.md`
- 기술 계획: `specs/010-notice-page/plan.md`

**총 작업 수**: 17개  
**예상 소요 기간**: 1~2일  

**워크플로우 (순서 고정)**:
1. **API 연동** → 2. **API 연동 테스트** → 3. **디자인 구현** → 4. **데이터 바인딩** → 5. **UI 테스트**

---

## 사용자 시나리오 매핑

| 스토리 ID | 설명 (spec.md 시나리오) | 작업 수 |
|-----------|-------------------------|---------|
| US1 | 공지사항 목록 보기 (총 N개, 항목 표시, 더보기, 빈 목록) | 5개 |
| US2 | 공지 검색하기 | 1개 |
| US3 | 공지 상세 읽기 | 2개 |
| 공통 | API·훅·라우트·테스트 | 9개 |

---

## Phase 1: API 연동

**목표**: apis 파일에 공지 API **연결만** (엔드포인트·타입·호출 함수). 훅/UI 없음.

- [x] T001 `src/commons/apis/endpoints.ts`에 NOTICE_ENDPOINTS 추가
  - LIST: `/api/notices`, DETAIL: (id) => `/api/notices/${id}`
  - ENDPOINTS 객체에 NOTICE: NOTICE_ENDPOINTS 추가

- [x] T002 [P] `src/commons/apis/notices/types.ts` 생성
  - GetNoticesParams (search?, limit?, offset?)
  - NoticeListItem (id, title, imageUrl, isPinned, isVisible, createdAt)
  - GetNoticesResponseData (items, total, limit, offset)
  - NoticeDetail (id, title, content, imageUrl, isPinned, isVisible, createdAt, updatedAt)
  - ApiResponse<T> (success, data)

- [x] T003 `src/commons/apis/notices/index.ts` 생성
  - getNotices(params): GET /api/notices, query search/limit/offset, 응답 data 반환
  - getNoticeById(id): GET /api/notices/:id, 응답 data 반환
  - 기존 api-client(Axios) 사용, 에러는 기존 패턴으로 변환

---

## Phase 2: API 연동 테스트

**목표**: API가 잘 붙는지·데이터가 잘 받아와서 화면에 나오는지 검증. 훅·라우트·최소 UI(데이터 표시용) 구현 후 E2E 실행. **UI 테스트·디자인은 이 단계에서 하지 않음.**

- [x] T004 [P] `src/components/notice/hooks/useNotices.ts` 생성
  - useNotices(search, limit=10, offset 누적) 훅
  - commons/apis/notices getNotices 호출
  - 더보기 시 offset 증가해 다음 10개 요청 후 기존 items와 concat
  - 검색어 변경 시 offset 0으로 초기화
  - Query key: ['notices', 'list', search?, offset] 또는 누적 리스트 관리

- [x] T005 [P] `src/components/notice/hooks/useNotice.ts` 생성
  - useNotice(id) 훅, getNoticeById(id) 호출
  - Query key: ['notices', 'detail', id], staleTime/gcTime 설정 (예: 1분/5분)

- [x] T006 `src/components/notice/hooks/index.ts` 생성
  - useNotices, useNotice 익스포트

- [x] T007 [P] `src/app/(main)/notices/page.tsx` 생성
  - 공지사항 목록 페이지, Notice 목록 컨테이너 렌더

- [x] T008 [P] `src/app/(main)/notices/[id]/page.tsx` 생성
  - 공지사항 상세 페이지, id from params로 NoticeDetail 렌더

- [x] T009 [US1] `src/components/notice/types.ts` 생성
  - NoticeListProps, NoticeDetailProps 등 컴포넌트 타입

- [x] T010 [US1] `src/components/notice/index.tsx` 목록 컨테이너 구현 (최소, 데이터 표시용)
  - PageHeader (title="공지사항", subtitle="총 N개의 공지사항", onButtonPress=닫기)
  - 검색 입력 (플레이스홀더 "공지사항 검색", 엔터/버튼으로 검색)
  - 리스트: 공지 라벨(isPinned), 제목, 상대 시간(createdAt → "N일 전"), 클릭 시 /notices/[id]
  - 더보기 버튼 (loadedCount < total일 때만), 로딩/빈 목록/오류 UI
  - useNotices 훅 사용

- [x] T012 [US1] 상대 시간 유틸 구현
  - createdAt ISO 문자열 → "N일 전" 등 (commons/utils 또는 notice 내부)

- [x] T014 [US3] `src/components/notice/notice-detail.tsx` 생성
  - PageHeader (닫기 → 목록으로), useNotice(id)로 상세 조회
  - 제목, 게시 일시, content, imageUrl(있으면 표시)
  - 로딩/오류("공지를 찾을 수 없습니다" + 목록으로 돌아가기)

- [x] T016 `tests/e2e/notice/notice.e2e.spec.ts` 작성 및 실행 (API 연동 테스트)
  - 검증: GET /api/notices·GET /api/notices/:id 호출 여부, 목록/상세 응답 데이터가 화면에 반영되는지
  - UI 테스트·스타일 검증은 하지 않음. 실패 시 Phase 1·2 코드 보완 후 재실행

---

## Phase 3: 디자인 구현

**목표**: 스타일·레이아웃만 구현. 데이터 바인딩(검색 연동·메뉴 등)은 Phase 4에서.

- [x] T011 [P] [US1] `src/components/notice/styles.module.css` 생성
  - 375px 고정, 디자인 토큰 기반, 터치 영역·간격, 검색 바(돋보기 아이콘·연한 회색 둥근 스타일)

---

## Phase 4: 데이터 바인딩

**목표**: 디자인된 UI에 검색·메뉴 등 데이터/상호작용 연동.

- [ ] T013 [US2] `src/components/notice/index.tsx` 검색 연동
  - 검색어 입력 시 디바운싱(버튼 없음)으로 useNotices(search) 호출, offset 0, 검색 결과 개수/빈 결과 안내

- [ ] T015 `src/components/Mypage/index.tsx` 수정
  - 내비게이션 카드에 "공지사항" 메뉴 버튼 추가 (고객 센터 버튼 **위**에 배치)
  - 클릭 시 router.push('/notices')

---

## Phase 5: UI 테스트

**목표**: UI 테스트는 **마지막에** 수행.

- [ ] T017 [P] (선택) `tests/ui/notice/notice.ui.spec.ts` UI 테스트
  - 목록: 로딩, 빈 목록, 오류 상태, 공지 라벨·상대 시간
  - 상세: 로딩, 오류, 본문·이미지

---

## 의존성 순서

1. **Phase 1** (API 연동): T001 → T002, T003
2. **Phase 2** (API 연동 테스트): T002,T003 완료 후 T004,T005 → T006 → T007,T008 → T009 → T010,T012,T014 → T016(E2E 실행)
3. **Phase 3** (디자인 구현): T016 통과 후 T011
4. **Phase 4** (데이터 바인딩): T011 완료 후 T013, T015
5. **Phase 5** (UI 테스트): T013,T015 완료 후 T017

---

## 병렬 실행 예시

- **Phase 1**: T002는 T001 완료 후 [P] 가능
- **Phase 2**: T004,T005는 T003 완료 후 서로 [P]; T007,T008은 [P]; T010·T012·T014는 의존 관계에 따라 순차 또는 부분 병렬
- **Phase 4**: T013, T015는 서로 [P] 가능

---

## 구현 전략 요약 (순서 고정)

| 순서 | 단계 | 내용 |
|------|------|------|
| 1 | **API 연동** | apis에 엔드포인트·타입·getNotices/getNoticeById만. 훅/UI 없음. |
| 2 | **API 연동 테스트** | 훅·라우트·최소 UI 구현 후 E2E로 API 호출·데이터 표시 검증. UI 테스트·디자인 안 함. |
| 3 | **디자인 구현** | styles.module.css 등 스타일·레이아웃. |
| 4 | **데이터 바인딩** | 검색 연동·Mypage 메뉴 등 데이터/상호작용 연동. |
| 5 | **UI 테스트** | UI 테스트 마지막에 수행. |
