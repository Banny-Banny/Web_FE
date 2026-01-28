# 기술 계획: 이스터에그 목록 페이지

## 개요

이 문서는 이스터에그 목록 페이지 기능의 기술적 구현 계획을 담고 있습니다. 기존 Expo Go 코드를 웹 환경(Next.js)으로 리팩토링하며, 제공된 디자인 이미지를 기반으로 구현합니다.

**기능 명세서**: `specs/008-easter-egg-list/spec.md`  
**브랜치**: `008-easter-egg-list`  
**작성일**: 2026-01-28

---

## 기술 스택

### Frontend Framework
- **Next.js 16** (App Router)
- **TypeScript** (타입 안전성)
- **React 19** (클라이언트 컴포넌트)

### 스타일링
- **CSS Modules** (`styles.module.css`)
- **디자인 토큰 기반** (CSS 변수: `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`)
- **375px 모바일 프레임 고정** (반응형 미지원)

### 상태 관리
- **React Query** (`@tanstack/react-query`) - 서버 상태 관리
- **React Hooks** - 클라이언트 상태 관리

### API 통신
- **Axios** - HTTP 클라이언트
- **기존 API 클라이언트 구조** (`src/commons/provider/api-provider/`)

### 아이콘
- **@remixicon/react** - 아이콘 라이브러리

### 이미지
- **next/image** - 이미지 최적화

---

## 아키텍처 설계

### 컴포넌트 구조

```
src/components/my-egg-list/
├── index.tsx                    # Feature Container
├── styles.module.css            # 컨테이너 스타일
├── hooks/
│   └── useMyEggList.ts         # 비즈니스 로직 훅
├── components/
│   ├── tab/
│   │   ├── index.tsx           # 탭 컴포넌트
│   │   └── styles.module.css   # 탭 스타일
│   ├── filter/
│   │   ├── index.tsx           # 정렬 필터 컴포넌트
│   │   └── styles.module.css   # 필터 스타일
│   ├── item/
│   │   ├── index.tsx           # 목록 항목 컴포넌트
│   │   └── styles.module.css   # 항목 스타일
│   ├── item-list/
│   │   ├── index.tsx           # 아이템 리스트 컴포넌트
│   │   └── styles.module.css   # 리스트 스타일
│   └── modal/
│       ├── index.tsx           # 상세 모달 컴포넌트
│       └── styles.module.css   # 모달 스타일
```

### 페이지 라우팅

```
src/app/(main)/
└── my-eggs/
    └── page.tsx                # 이스터에그 목록 페이지
```

### API 함수 구조

```
src/commons/apis/
└── easter-egg/
    ├── index.ts                # API 함수 export
    ├── myEggs.ts              # GET /api/capsules/my-eggs
    ├── detail.ts              # GET /api/capsules/{id}/detail
    └── types.ts               # 타입 정의
```

### 공통 컴포넌트

```
src/commons/components/
└── page-header/
    ├── index.tsx               # 페이지 헤더 공통 컴포넌트
    ├── styles.module.css       # 헤더 스타일
    └── types.ts                # 타입 정의
```

---

## 데이터 모델링

### API 응답 타입

#### 내 이스터에그 목록 조회 응답

```typescript
interface MyEggsResponse {
  eggs: MyEggItem[];
}

interface MyEggItem {
  eggId: string;
  type: 'FOUND' | 'PLANTED';
  isMine: boolean;
  title: string;
  message: string;
  imageMediaId?: string;
  imageObjectKey?: string;
  audioMediaId?: string;
  audioObjectKey?: string;
  videoMediaId?: string;
  videoObjectKey?: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  author: {
    id: string;
    nickname: string;
    profileImg?: string;
  };
  createdAt: string;
  foundAt?: string;
  expiredAt?: string;
  discoveredCount: number;
  viewers?: Array<{
    id: string;
    nickname: string;
    profileImg?: string;
    viewedAt: string;
  }>;
}
```

#### 알 상세 정보 조회 응답

```typescript
interface EggDetailResponse {
  id: string;
  title: string;
  content: string;
  message?: string;
  open_at: string;
  is_locked: boolean;
  view_limit: number;
  view_count: number;
  media_items: Array<{
    media_id: string;
    type: 'IMAGE' | 'AUDIO' | 'VIDEO';
    object_key: string;
  }>;
  product: {
    id: string;
    product_type: 'EASTER_EGG';
    max_media_count: number;
  };
  latitude: number;
  longitude: number;
  text_blocks: Array<{
    order: number;
    content: string;
  }>;
  author: {
    id: string;
    nickname: string;
    profile_img?: string;
  };
  viewers: Array<{
    id: string;
    nickname: string;
    profile_img?: string;
    viewed_at: string;
  }>;
  created_at: string;
  type?: 'FOUND' | 'PLANTED';
  foundAt?: string;
  found_at?: string;
}
```

### 컴포넌트 Props 타입

```typescript
// Item 컴포넌트
interface ItemProps {
  id?: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  eggIcon?: string;
  hasImage?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  viewCount?: number;
  showViewCount?: boolean;
  status?: 'ACTIVE' | 'EXPIRED';
  onPress?: () => void;
}

// Modal 컴포넌트
interface EasterEggModalProps {
  visible: boolean;
  onClose: () => void;
  data: EggDetailResponse | null;
}
```

---

## 구현 단계

### Phase 1: 프로젝트 구조 및 기본 설정

#### 1.1 공통 헤더 컴포넌트 생성
- `src/commons/components/page-header/` 디렉토리 생성
- `index.tsx` - 페이지 헤더 공통 컴포넌트 (제목, 닫기 버튼, 서브타이틀)
- `styles.module.css` - 헤더 스타일
- `types.ts` - 타입 정의
- 기존 `my-egg-list/components/header/` 컴포넌트를 공통 컴포넌트로 이동

#### 1.2 페이지 라우팅 설정
- `src/app/(main)/my-eggs/page.tsx` 생성
- 마이페이지에서 이스터에그 영역 클릭 시 라우팅 연결
- 기본 레이아웃 구성

#### 1.3 API 함수 작성
- `src/commons/apis/easter-egg/myEggs.ts` - 목록 조회 API
- `src/commons/apis/easter-egg/detail.ts` - 상세 조회 API
- `src/commons/apis/easter-egg/types.ts` - 타입 정의
- 에러 핸들링 및 인터셉터 설정

### Phase 2: API 연결 및 E2E 테스트

#### 2.1 API 함수 구현
- `src/commons/apis/easter-egg/myEggs.ts` 구현
  - `GET /api/capsules/my-eggs` 호출
  - 인증 토큰 자동 추가 (인터셉터)
  - 응답 타입 정의
  - 에러 핸들링
- `src/commons/apis/easter-egg/detail.ts` 구현
  - `GET /api/capsules/{id}/detail` 호출
  - 인증 토큰 자동 추가
  - 응답 타입 정의
  - 에러 핸들링

#### 2.2 E2E 테스트 작성 (Playwright) - API 전용
- **테스트 계정**: `.env.local` 참고
  - `NEXT_PUBLIC_PHONE_NUMBER=01030728535`
  - `NEXT_PUBLIC_EMAIL=jiho@test.com`
  - `NEXT_PUBLIC_PASSWORD=test1234!@`
- **테스트 방식**: API 함수를 직접 호출하여 검증 (UI 테스트 아님)
- **테스트 시나리오**:
  1. **로그인 API 호출**
     - 테스트 계정으로 로그인
     - 인증 토큰 획득 확인
  2. **내 이스터에그 목록 조회 API 테스트** (`GET /api/capsules/my-eggs`)
     - API 함수 호출
     - 응답 구조 검증 (eggs 배열, 각 항목의 필수 필드)
     - 타입 검증 (eggId, type, title, message 등)
     - FOUND 타입과 PLANTED 타입 구분 확인
     - 응답 시간 검증 (3초 이하)
  3. **알 상세 정보 조회 API 테스트** (`GET /api/capsules/{id}/detail`)
     - 목록에서 첫 번째 이스터에그 ID 추출
     - 상세 정보 조회 API 호출
     - 응답 구조 검증 (id, title, content, author, viewers 등)
     - 미디어 항목 검증 (media_items 배열)
     - 발견자 목록 검증 (viewers 배열)
     - 응답 시간 검증 (3초 이하)
  4. **에러 처리 테스트**
     - 존재하지 않는 ID로 상세 조회 시 에러 처리 확인
     - 네트워크 오류 시 에러 처리 확인
- **파일**: `tests/e2e/my-egg-list/my-egg-list.e2e.spec.ts`
- **주의사항**: 
  - API 연결 후 바로 E2E 테스트부터 진행 (UI 구현 전)
  - 실제 서버 연동이 필요한 테스트
  - `.env.local`에 테스트 계정 정보가 설정되어 있어야 함

### Phase 3: 비즈니스 로직 훅 구현

#### 3.1 useMyEggList 훅 작성
- React Query를 활용한 목록 데이터 조회
- 탭 상태 관리 (discovered/planted)
- 필터 상태 관리 (latest/oldest)
- 모달 상태 관리
- 정렬 로직 구현
- 활성/소멸 구분 로직

#### 3.2 데이터 변환 로직
- API 응답을 컴포넌트 Props로 변환
- 날짜 포맷팅
- 미디어 URL 생성
- 활성/소멸 상태 판단

### Phase 4: UI 컴포넌트 구현 (이미 완료)

#### 4.1 기본 컴포넌트 (완료)
- ✅ PageHeader 컴포넌트 (공통 컴포넌트로 이동 예정)
- ✅ Tab 컴포넌트
- ✅ Filter 컴포넌트
- ✅ Item 컴포넌트
- ✅ ItemList 컴포넌트
- ✅ Modal 컴포넌트

#### 4.2 공통 헤더 컴포넌트 적용
- `my-egg-list` 컴포넌트에서 공통 PageHeader 사용
- 기존 header 컴포넌트 제거

### Phase 5: 데이터 바인딩 및 통합

#### 5.1 API 연동
- useMyEggList 훅에서 실제 API 호출
- React Query 설정 (캐시, 재시도 등)
- 로딩/에러 상태 처리

#### 5.2 컴포넌트 통합
- Feature Container에서 모든 컴포넌트 통합
- Props 전달 및 이벤트 핸들링
- 상태 동기화

### Phase 6: 빈 상태 및 에러 처리

#### 6.1 빈 상태 처리
- 목록이 비어있을 때 메시지 표시
- 적절한 안내 문구

#### 6.2 에러 처리
- 네트워크 오류 처리
- API 오류 처리
- 재시도 기능

### Phase 7: 최적화 및 UI 테스트

#### 7.1 성능 최적화
- 이미지 지연 로딩
- 리스트 가상화 (필요시)
- 메모이제이션 적용

#### 7.2 접근성 개선
- 키보드 네비게이션
- 스크린 리더 지원
- ARIA 속성 추가

#### 7.3 UI 테스트 (Playwright)
- 컴포넌트 렌더링 테스트
- 인터랙션 테스트
- 시각적 회귀 테스트
- 파일: `tests/ui/my-egg-list/my-egg-list.ui.spec.ts`

---

## 주요 구현 세부사항

### 1. 정렬 필터 표시 조건

```typescript
// "발견한 알" 탭에서만 필터 표시
{activeTab === 'discovered' && (
  <div className={styles.filterContainer}>
    <Filter ... />
  </div>
)}
```

### 2. 활성/소멸 상태 구분

```typescript
// expiredAt 기준으로 상태 판단
const isExpired = item.expiredAt 
  ? new Date(item.expiredAt) < new Date()
  : false;

const status = isExpired ? 'EXPIRED' : 'ACTIVE';
```

### 3. 모달 데이터 변환

```typescript
// API 응답을 모달 Props로 변환
const transformToModalData = (apiResponse: EggDetailResponse): EggDetailResponse => {
  return {
    ...apiResponse,
    message: apiResponse.message || apiResponse.content,
    type: apiResponse.type || (apiResponse.viewers?.length > 0 ? 'PLANTED' : 'FOUND'),
  };
};
```

### 4. 미디어 URL 생성

```typescript
// object_key 우선, 없으면 mediaId로 URL 생성
const getMediaUrl = (objectKey?: string, mediaId?: string) => {
  if (objectKey) {
    return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${objectKey}`;
  }
  if (mediaId) {
    return `/api/media/${mediaId}`;
  }
  return null;
};
```

---

## API 엔드포인트

### GET /api/capsules/my-eggs
**목적**: 내 이스터에그 목록 조회

**요청**:
- Headers: `Authorization: Bearer {token}`

**응답**:
```json
{
  "eggs": [
    {
      "eggId": "uuid",
      "type": "FOUND",
      "title": "좋은 하루",
      "message": "오늘도 웃으면서 보내!",
      ...
    }
  ]
}
```

### GET /api/capsules/{id}/detail
**목적**: 알 상세 정보 조회

**요청**:
- Path: `id` (이스터에그 ID)
- Headers: `Authorization: Bearer {token}`

**응답**:
```json
{
  "id": "uuid",
  "title": "capsule",
  "content": "content",
  ...
}
```

---

## 스타일링 규칙

### CSS Module 사용
- 모든 스타일은 `styles.module.css`에 작성
- 인라인 스타일 사용 금지
- CSS 변수만 사용 (하드코딩 색상값 금지)

### 디자인 토큰 참조
```css
/* 색상 */
color: var(--color-black-500);
background-color: var(--color-white-500);

/* 간격 */
padding: var(--spacing-lg);
gap: var(--spacing-md);

/* 반경 */
border-radius: var(--radius-lg);
```

### 375px 고정 레이아웃
- 모든 컴포넌트는 375px 기준으로 설계
- 반응형 미디어 쿼리 사용 금지
- 고정 단위(px) 우선 사용

---

## 테스트 전략

### E2E 테스트 (Playwright) - API 전용 - 우선순위 1
**목적**: API 함수를 직접 호출하여 엔드포인트 검증

**테스트 계정**: `.env.local` 참고
- 전화번호: `01030728535`
- 이메일: `jiho@test.com`
- 비밀번호: `test1234!@`

**테스트 내용**:
1. 로그인 API 호출 및 토큰 획득
2. `GET /api/capsules/my-eggs` API 테스트
   - 응답 구조 검증
   - 타입 검증
   - 응답 시간 검증
3. `GET /api/capsules/{id}/detail` API 테스트
   - 응답 구조 검증
   - 미디어 항목 검증
   - 발견자 목록 검증
4. 에러 처리 테스트

**파일**: `tests/e2e/my-egg-list/my-egg-list.e2e.spec.ts`

**주의사항**:
- 실제 서버 연동이 필요한 테스트
- API 함수를 직접 호출하여 검증 (UI 테스트 아님)
- API 연결 후 바로 E2E 테스트부터 진행

### UI 테스트 (Playwright) - 우선순위 2
**목적**: UI 컴포넌트 렌더링 및 인터랙션 검증

**테스트 내용**:
- 컴포넌트 렌더링 테스트
- 탭 전환 테스트
- 정렬 기능 테스트
- 모달 열기/닫기 테스트
- 인터랙션 테스트
- 시각적 회귀 테스트

**파일**: `tests/ui/my-egg-list/my-egg-list.ui.spec.ts`

---

## 성능 목표

- 페이지 초기 로딩: 1초 이내
- 목록 렌더링: 0.5초 이내
- 모달 표시: 0.3초 이내
- 스크롤 성능: 60fps 유지

---

## 다음 단계

1. **공통 헤더 컴포넌트 생성** - `src/commons/components/page-header/` 생성 및 기존 헤더 이동 ✅
2. **API 함수 작성** - `src/commons/apis/easter-egg/` 디렉토리에 API 함수 구현
3. **E2E 테스트 작성 (API 전용)** - API 함수를 직접 호출하여 검증하는 E2E 테스트 작성
   - 테스트 계정: `.env.local` 참고
   - `GET /api/capsules/my-eggs` API 테스트
   - `GET /api/capsules/{id}/detail` API 테스트
4. **useMyEggList 훅 구현** - 비즈니스 로직 및 상태 관리
5. **페이지 라우팅 설정** - `src/app/(main)/my-eggs/page.tsx` 생성
6. **데이터 바인딩** - 실제 API와 컴포넌트 연결
7. **UI 테스트 작성** - UI 컴포넌트 렌더링 및 인터랙션 테스트

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-28  
**다음 단계**: `/speckit.tasks` 명령어로 작업 목록 생성
