# 작업 목록: 이스터에그 목록 페이지

## 개요

이 문서는 "이스터에그 목록 페이지" 기능 구현을 위한 실행 가능한 작업 목록입니다.

**관련 문서**:
- 기능 명세서: `specs/008-easter-egg-list/spec.md`
- 기술 계획: `specs/008-easter-egg-list/plan.md`

**총 작업 수**: 35개
**예상 소요 기간**: 6-8일 (개발자 1명 기준)

---

## 기능 요구사항 매핑

| 요구사항 ID | 설명 | 작업 수 |
|------------|------|---------|
| FR-1 | 마이페이지에서 이스터에그 목록 페이지로 이동 | 2개 |
| FR-2 | 이스터에그 목록 조회 및 표시 | 8개 |
| FR-3 | 이스터에그 목록 항목 정보 표시 | 1개 (완료) |
| FR-4 | 심은 알의 활성/소멸 상태 구분 | 1개 (완료) |
| FR-5 | 이스터에그 목록 정렬 | 1개 (완료) |
| FR-6 | 이스터에그 상세 정보 모달 표시 | 1개 (완료) |
| FR-7 | 상세 모달 닫기 | 1개 (완료) |
| FR-8 | 페이지 요약 정보 표시 | 1개 (완료) |
| 공통 | API 연동 및 테스트 | 20개 |

---

## Phase 1: 프로젝트 구조 및 기본 설정

### 1.1 페이지 라우팅 설정

- [x] T001 src/app/(main)/my-eggs/page.tsx 생성
  - Next.js App Router 페이지 컴포넌트 생성
  - MyEggList 컴포넌트 import 및 렌더링
  - 라우팅 연결 확인
  - 파일: `src/app/(main)/my-eggs/page.tsx`

- [x] T002 src/components/Mypage/index.tsx 수정
  - 이스터에그 영역 클릭 시 `/my-eggs` 페이지로 라우팅 연결
  - Next.js router 사용하여 페이지 이동 구현
  - 파일: `src/components/Mypage/index.tsx`

### 1.2 API 타입 정의

- [x] T003 src/commons/apis/easter-egg/types.ts 수정
  - `MyEggsResponse` 인터페이스 추가
    - `eggs` (MyEggItem[])
  - `MyEggItem` 인터페이스 추가
    - `eggId` (string)
    - `type` ('FOUND' | 'PLANTED')
    - `isMine` (boolean)
    - `title` (string)
    - `message` (string)
    - `imageMediaId`, `imageObjectKey` (string, optional)
    - `audioMediaId`, `audioObjectKey` (string, optional)
    - `videoMediaId`, `videoObjectKey` (string, optional)
    - `location` (object: address, latitude, longitude)
    - `author` (object: id, nickname, profileImg)
    - `createdAt` (string)
    - `foundAt` (string, optional)
    - `expiredAt` (string, optional)
    - `discoveredCount` (number)
    - `viewers` (array, optional)
  - `EggDetailResponse` 인터페이스 추가
    - `id`, `title`, `content`, `message` (string)
    - `open_at`, `created_at` (string)
    - `is_locked`, `view_limit`, `view_count` (number)
    - `media_items` (array)
    - `product` (object)
    - `latitude`, `longitude` (number)
    - `text_blocks` (array)
    - `author` (object)
    - `viewers` (array)
    - `type` ('FOUND' | 'PLANTED', optional)
    - `foundAt`, `found_at` (string, optional)
  - 파일: `src/commons/apis/easter-egg/types.ts`

---

## Phase 2: API 연결 및 E2E 테스트

### 2.1 API 함수 구현

**중요**: 모든 API 함수는 `src/commons/provider/api-provider/api-client.ts`에 있는 `apiClient`를 import하여 사용해야 합니다. `apiClient`는 이미 인증 토큰 인터셉터가 설정되어 있어 자동으로 토큰이 추가됩니다.

- [x] T004 src/commons/apis/easter-egg/index.ts 에 추가
  - `getMyEggs` 함수 구현
    - `apiClient`를 `@/commons/provider/api-provider/api-client`에서 import하여 사용
    - `GET /api/capsules/my-eggs` 엔드포인트 호출
    - `apiClient.get` 메서드 사용
    - 인증 토큰 자동 추가 (api-client.ts의 인터셉터 활용)
    - `MyEggsResponse` 타입 반환 (오버로드로 파라미터 없는 버전 추가)
    - 에러 핸들링 구현 (Axios 에러를 ApiError 형식으로 변환)
  - 파일: `src/commons/apis/easter-egg/index.ts`

- [x] T005 src/commons/apis/easter-egg/index.ts 에 추가
  - `getEggDetail` 함수 구현
    - `apiClient`를 `@/commons/provider/api-provider/api-client`에서 import하여 사용
    - `GET /api/capsules/{id}/detail` 엔드포인트 호출
    - `id` (string) 파라미터 받기
    - `apiClient.get` 메서드 사용
    - 인증 토큰 자동 추가 (api-client.ts의 인터셉터 활용)
    - `EggDetailResponse` 타입 반환
    - 에러 핸들링 구현 (Axios 에러를 ApiError 형식으로 변환)
  - 파일: `src/commons/apis/easter-egg/index.ts`


### 2.2 E2E 테스트 작성 (Playwright) - API 전용

- [x] T007 tests/e2e/my-egg-list/my-egg-list.e2e.spec.ts 생성
  - Playwright 테스트 파일 생성
  - 테스트 계정 정보 설정 (`.env.local` 참고)
    - 전화번호: `01030728535`
    - 이메일: `jiho@test.com`
    - 비밀번호: `test1234!@`
  - 로그인 API 호출 테스트
    - 테스트 계정으로 로그인
    - 인증 토큰 획득 확인
  - 내 이스터에그 목록 조회 API 테스트
    - `getMyEggs` API 함수 직접 호출
    - 응답 구조 검증 (eggs 배열, 각 항목의 필수 필드)
    - 타입 검증 (eggId, type, title, message 등)
    - FOUND 타입과 PLANTED 타입 구분 확인
    - 응답 시간 검증 (3초 이하)
  - 알 상세 정보 조회 API 테스트
    - 목록에서 첫 번째 이스터에그 ID 추출
    - `getEggDetail` API 함수 직접 호출
    - 응답 구조 검증 (id, title, content, author, viewers 등)
    - 미디어 항목 검증 (media_items 배열)
    - 발견자 목록 검증 (viewers 배열)
    - 응답 시간 검증 (3초 이하)
  - 에러 처리 테스트
    - 존재하지 않는 ID로 상세 조회 시 에러 처리 확인
    - 네트워크 오류 시 에러 처리 확인
  - 파일: `tests/e2e/my-egg-list/my-egg-list.e2e.spec.ts`

---

## Phase 3: 비즈니스 로직 훅 구현

### 3.1 useMyEggList 훅 구현

- [x] T008 src/components/my-egg-list/hooks/useMyEggList.ts 수정
  - React Query를 활용한 목록 데이터 조회
    - `useQuery`를 사용하여 `getMyEggs` API 호출
    - 쿼리 키: `['myEggs']`
    - 캐시 설정 및 재시도 로직 구현
  - 탭 상태 관리 (discovered/planted)
    - `activeTab` 상태 유지
    - 탭별 데이터 필터링 로직
  - 필터 상태 관리 (latest/oldest)
    - `selectedFilter` 상태 유지
    - 정렬 로직 구현 (foundAt 또는 createdAt 기준)
  - 모달 상태 관리
    - `modalVisible` 상태
    - `selectedEggData` 상태
  - 정렬 로직 구현
    - 최신 발견순: `foundAt` 내림차순
    - 오래된순: `foundAt` 오름차순
  - 활성/소멸 구분 로직
    - `expiredAt` 기준으로 상태 판단
    - 활성 알과 소멸된 알 분리
  - 데이터 변환 로직
    - API 응답을 컴포넌트 Props로 변환
    - 날짜 포맷팅 (YYYY-MM-DD)
    - 미디어 URL 생성 (objectKey 우선, 없으면 mediaId)
  - 로딩/에러 상태 처리
    - `isLoading`, `isError` 상태 반환
    - 에러 메시지 처리
  - 파일: `src/components/my-egg-list/hooks/useMyEggList.ts`

- [x] T009 src/components/my-egg-list/hooks/useMyEggList.ts 수정
  - 상세 정보 조회 로직 추가
    - `useQuery`를 사용하여 `getEggDetail` API 호출
    - 쿼리 키: `['eggDetail', eggId]`
    - 모달 열기 시 상세 정보 자동 조회
  - 데이터 변환 로직
    - `EggDetailResponse`를 모달 Props로 변환
    - `message` 필드 처리 (content 우선, 없으면 message)
    - `type` 필드 처리 (viewers 길이로 PLANTED 판단)
  - 파일: `src/components/my-egg-list/hooks/useMyEggList.ts`

---

## Phase 4: UI 컴포넌트 구현 (이미 완료)

### 4.1 기본 컴포넌트 (완료)

- [x] PageHeader 컴포넌트 (공통 컴포넌트로 이미 생성됨)
- [x] Tab 컴포넌트
- [x] Filter 컴포넌트
- [x] Item 컴포넌트
- [x] ItemList 컴포넌트
- [x] Modal 컴포넌트

### 4.2 공통 헤더 컴포넌트 적용 (이미 완료)

- [x] `my-egg-list` 컴포넌트에서 공통 PageHeader 사용 중
- [x] 기존 header 컴포넌트는 유지 (필요시 제거 가능)

---

## Phase 5: 데이터 바인딩 및 통합

### 5.1 API 연동

- [x] T010 src/components/my-egg-list/index.tsx 수정
  - `useMyEggList` 훅에서 실제 API 호출 결과 사용
  - 로딩 상태 처리
    - `isLoading` 상태일 때 로딩 인디케이터 표시
  - 에러 상태 처리
    - `isError` 상태일 때 에러 메시지 및 재시도 버튼 표시
  - 데이터 바인딩
    - `currentItems`를 ItemList 컴포넌트에 전달
    - `discoveredCount`, `plantedCount`, `activeCount`를 PageHeader에 전달
  - 파일: `src/components/my-egg-list/index.tsx`

### 5.2 컴포넌트 통합

- [x] T011 src/components/my-egg-list/components/item-list/index.tsx 수정
  - 로딩 상태 처리 추가
    - `isLoading` prop 받아서 로딩 인디케이터 표시
  - 빈 상태 처리 추가
    - `items`가 빈 배열일 때 빈 상태 메시지 표시
  - 활성/소멸 구분 표시
    - 활성 알 섹션과 소멸된 알 섹션 구분 표시
    - 각 섹션별 개수 표시
  - 파일: `src/components/my-egg-list/components/item-list/index.tsx`

- [x] T012 src/components/my-egg-list/components/item/index.tsx 수정
  - 실제 데이터 Props 바인딩
    - API 응답 데이터를 컴포넌트 Props로 변환
    - 날짜 포맷팅 적용
    - 미디어 아이콘 표시 로직 적용
  - 활성/소멸 상태 아이콘 표시
    - 심은 알의 경우 `expiredAt` 기준으로 아이콘 변경
  - 파일: `src/components/my-egg-list/components/item/index.tsx`

- [x] T013 src/components/my-egg-list/components/modal/index.tsx 수정
  - 실제 상세 데이터 바인딩
    - `EggDetailResponse` 데이터를 모달 Props로 변환
    - 작성자 정보 표시
    - FOUND/PLANTED 타입별 메시지 표시
    - 위치 정보 배지 표시 (Kakao API로 주소 변환 추가)
    - 발견 날짜/시간 표시 (FOUND 타입)
  - 미디어 콘텐츠 표시
    - 이미지 표시 (next/image 사용)
    - 오디오 플레이어 표시 (HTML5 audio)
    - 비디오 플레이어 표시 (HTML5 video)
  - 발견자 목록 표시
    - PLANTED 타입일 때만 표시
    - 각 발견자의 프로필 이미지, 닉네임, 발견 시간 표시
    - 발견자가 없는 경우 메시지 표시
  - 파일: `src/components/my-egg-list/components/modal/index.tsx`

---

## Phase 6: 빈 상태 및 에러 처리

### 6.1 빈 상태 처리

- [x] T014 src/components/my-egg-list/components/item-list/index.tsx 수정
  - 빈 상태 컴포넌트 추가
    - 목록이 비어있을 때 표시할 메시지
    - "발견한 알" 탭: "아직 발견한 이스터에그가 없습니다"
    - "심은 알" 탭: "아직 심은 이스터에그가 없습니다"
  - 빈 상태 스타일 추가
    - 중앙 정렬
    - 적절한 간격 및 색상 적용
  - 파일: `src/components/my-egg-list/components/item-list/index.tsx`

### 6.2 에러 처리

- [x] T015 src/components/my-egg-list/index.tsx 수정
  - 에러 상태 UI 추가
    - 네트워크 오류 메시지 표시
    - API 오류 메시지 표시
    - 재시도 버튼 추가
  - 재시도 로직 구현
    - React Query의 `refetch` 함수 활용
  - 파일: `src/components/my-egg-list/index.tsx`

- [x] T016 src/components/my-egg-list/components/modal/index.tsx 수정
  - 미디어 로딩 실패 처리
    - 이미지 로딩 실패 시 플레이스홀더 표시
    - 오디오/비디오 로딩 실패 시 에러 메시지 표시
  - 파일: `src/components/my-egg-list/components/modal/index.tsx`

---

## Phase 7: 최적화 및 UI 테스트

### 7.1 성능 최적화

- [ ] T017 src/components/my-egg-list/components/item/index.tsx 수정
  - 이미지 지연 로딩 적용
    - `next/image`의 `loading="lazy"` 속성 사용
  - 메모이제이션 적용
    - `React.memo`로 컴포넌트 래핑
  - 파일: `src/components/my-egg-list/components/item/index.tsx`

- [ ] T018 src/components/my-egg-list/components/item-list/index.tsx 수정
  - 리스트 가상화 고려 (필요시)
    - 목록이 매우 긴 경우 가상화 라이브러리 적용 검토
  - 파일: `src/components/my-egg-list/components/item-list/index.tsx`

- [ ] T019 src/components/my-egg-list/hooks/useMyEggList.ts 수정
  - React Query 캐시 최적화
    - 적절한 `staleTime`, `cacheTime` 설정
    - 쿼리 무효화 전략 수립
  - 파일: `src/components/my-egg-list/hooks/useMyEggList.ts`

### 7.2 접근성 개선

- [ ] T020 src/components/my-egg-list/components/tab/index.tsx 수정
  - 키보드 네비게이션 지원
    - Tab 키로 탭 전환 가능
    - Enter/Space 키로 탭 선택
  - ARIA 속성 추가
    - `role="tablist"`, `role="tab"` 추가
    - `aria-selected` 속성 추가
  - 파일: `src/components/my-egg-list/components/tab/index.tsx`

- [ ] T021 src/components/my-egg-list/components/filter/index.tsx 수정
  - 키보드 네비게이션 지원
    - 드롭다운 메뉴 키보드 접근 가능
  - ARIA 속성 추가
    - `role="combobox"` 추가
    - `aria-expanded` 속성 추가
  - 파일: `src/components/my-egg-list/components/filter/index.tsx`

- [ ] T022 src/components/my-egg-list/components/modal/index.tsx 수정
  - 모달 접근성 개선
    - `role="dialog"` 추가
    - `aria-labelledby`, `aria-describedby` 추가
    - ESC 키로 닫기 기능 (이미 구현되어 있을 수 있음)
    - 포커스 트랩 구현
  - 스크린 리더 지원
    - 모든 인터랙티브 요소에 `aria-label` 추가
  - 파일: `src/components/my-egg-list/components/modal/index.tsx`

### 7.3 UI 테스트 (Playwright)

- [ ] T023 tests/ui/my-egg-list/my-egg-list.ui.spec.ts 생성
  - 컴포넌트 렌더링 테스트
    - 페이지 진입 시 목록 표시 확인
    - 탭 기본 선택 상태 확인
    - 헤더 정보 표시 확인
  - 탭 전환 테스트
    - "발견한 알" 탭 클릭 시 목록 변경 확인
    - "심은 알" 탭 클릭 시 목록 변경 확인
    - 탭별 개수 표시 확인
  - 정렬 기능 테스트
    - "발견한 알" 탭에서만 필터 표시 확인
    - "최신 발견순" 선택 시 목록 재정렬 확인
    - "오래된순" 선택 시 목록 재정렬 확인
  - 모달 열기/닫기 테스트
    - 이스터에그 항목 클릭 시 모달 표시 확인
    - 모달 닫기 버튼 클릭 시 모달 닫힘 확인
    - 모달 배경 클릭 시 모달 닫힘 확인
    - ESC 키 입력 시 모달 닫힘 확인
  - 인터랙션 테스트
    - 오디오 플레이어 재생 확인
    - 비디오 플레이어 재생 확인
    - 이미지 표시 확인
  - 빈 상태 테스트
    - 목록이 비어있을 때 빈 상태 메시지 표시 확인
  - 에러 상태 테스트
    - API 오류 시 에러 메시지 표시 확인
    - 재시도 버튼 동작 확인
  - 시각적 회귀 테스트
    - 스크린샷 비교를 통한 UI 변경 감지
  - 파일: `tests/ui/my-egg-list/my-egg-list.ui.spec.ts`

---

## 의존성 및 순서

### 필수 순서

1. **Phase 1** (T001-T003): 페이지 라우팅 및 타입 정의는 모든 작업의 기초
2. **Phase 2** (T004-T007): API 함수 구현 후 E2E 테스트 작성
3. **Phase 3** (T008-T009): API 함수가 완료된 후 훅 구현
4. **Phase 5** (T010-T013): 훅이 완료된 후 데이터 바인딩
5. **Phase 6** (T014-T016): 데이터 바인딩 완료 후 빈 상태/에러 처리
6. **Phase 7** (T017-T023): 모든 기능 완료 후 최적화 및 테스트

### 병렬 처리 가능한 작업

- **T004, T005**: API 함수들은 서로 독립적이므로 병렬 처리 가능
- **T017, T018, T019**: 성능 최적화 작업들은 서로 독립적
- **T020, T021, T022**: 접근성 개선 작업들은 서로 독립적

---

## 구현 전략

### MVP 범위

**Phase 1-3, 5의 핵심 작업만 포함**:
- T001-T003: 기본 구조
- T004-T006: API 함수
- T008-T009: 비즈니스 로직 훅
- T010-T013: 데이터 바인딩

**제외 항목**:
- E2E 테스트 (T007) - MVP 이후 추가
- 빈 상태/에러 처리 (T014-T016) - MVP 이후 추가
- 최적화 (T017-T019) - MVP 이후 추가
- 접근성 개선 (T020-T022) - MVP 이후 추가
- UI 테스트 (T023) - MVP 이후 추가

### 점진적 전달

1. **1차 전달**: MVP 범위 완료 (기본 기능 동작)
2. **2차 전달**: 빈 상태 및 에러 처리 추가 (T014-T016)
3. **3차 전달**: 최적화 및 접근성 개선 (T017-T022)
4. **4차 전달**: 테스트 완료 (T007, T023)

---

## 검증 기준

### 각 Phase별 완료 기준

**Phase 1 완료**:
- [ ] `/my-eggs` 페이지 접근 가능
- [ ] 마이페이지에서 이스터에그 영역 클릭 시 페이지 이동
- [ ] API 타입 정의 완료

**Phase 2 완료**:
- [ ] `getMyEggs` API 함수 정상 동작
- [ ] `getEggDetail` API 함수 정상 동작
- [ ] E2E 테스트 통과

**Phase 3 완료**:
- [ ] `useMyEggList` 훅에서 API 호출 성공
- [ ] 탭 전환 시 데이터 필터링 정상 동작
- [ ] 정렬 기능 정상 동작
- [ ] 활성/소멸 구분 정상 동작

**Phase 5 완료**:
- [ ] 목록에 실제 데이터 표시
- [ ] 모달에 상세 정보 표시
- [ ] 로딩 상태 표시
- [ ] 에러 상태 표시

**Phase 6 완료**:
- [ ] 빈 목록 상태 메시지 표시
- [ ] 에러 발생 시 재시도 가능

**Phase 7 완료**:
- [ ] 성능 최적화 적용
- [ ] 접근성 개선 적용
- [ ] UI 테스트 통과

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-28  
**다음 단계**: `/speckit.implement` 명령어로 구현 시작
