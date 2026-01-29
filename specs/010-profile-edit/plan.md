# 프로필 수정 기능 기술 계획서

**Branch**: `feat/profile-edit` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/010-profile-edit/spec.md`

## Summary

마이페이지 프로필 섹션에서 사용자가 **프로필 사진**과 **닉네임**만 수정할 수 있도록 합니다. 프로필 이미지 오른쪽 하단의 카메라 버튼(cameraButtonWrapper) 클릭 시 프로필 수정 모달이 열리고, Figma 디자인(노드 161-24140) 기준 모달에서 "사진 변경"으로 이미지 업로드, 닉네임 입력 후 "저장"으로 서버에 반영합니다.

**주요 목표**:
- 프로필 수정 API 함수 구현 (POST /api/me/update, 닉네임만 전송)
- 프로필 이미지 업로드 API 함수 구현 (POST /api/me/profile-image, multipart/form-data)
- 프로필 수정/이미지 업로드용 React Query Mutation 훅 구현
- 프로필 수정 모달 컴포넌트 구현 (Figma 디자인 기준)
- ProfileSection에서 cameraButtonWrapper 클릭 시 모달 열기 연동
- 파일 선택(input type="file") → 업로드 → 미리보기 갱신 및 저장 플로우
- 로딩/오류/409(닉네임 중복) 처리

**기술적 접근**:
- React 19 + TypeScript 기반 훅 및 컴포넌트
- React Query로 서버 상태 관리 및 `['auth', 'me']` 쿼리 무효화
- api-client.ts를 통한 API 통신 (multipart 업로드 시 FormData 사용)
- CSS Modules + Tailwind(디자인 토큰) 기반 스타일링, 375px 고정
- 모달은 클라이언트 컴포넌트, 배경 클릭/ESC로 닫기

---

## Technical Context

**Language/Version**: TypeScript 5, React 19  
**Primary Dependencies**: Next.js 16, Axios, React Query (@tanstack/react-query)  
**Storage**: N/A (서버 상태는 React Query 캐시)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**:
- 모달 열기 1초 이내
- 이미지 업로드 5초 이내
- 닉네임 저장 3초 이내

**Constraints**:
- API: POST /api/me/update (body: nickname만 전송), POST /api/me/profile-image (multipart/form-data, 최대 5MB, jpeg/png/webp)
- 사용자 화면에서는 이메일 수정 UI 미제공
- 모달 UI는 Figma 프로필 수정 모달(노드 161-24140) 기준

**Scale/Scope**:
- API 함수 2개 + 요청/응답 타입
- Mutation 훅 2개 (updateMe, uploadProfileImage)
- 프로필 수정 모달 1개 + ProfileSection 수정(모달 트리거)
- 클라이언트 검증: 이미지 형식/크기, 닉네임 유효성

---

## Constitution Check

✅ **아키텍처 준수**: Feature Slice 준수, API는 `src/commons/apis/auth/` 확장  
✅ **디렉토리 구조**: API는 `commons/apis/auth/`, UI는 `components/Mypage/components/profile-section/`  
✅ **타입 안전성**: TypeScript로 API 요청/응답 및 모달 폼 타입 정의  
✅ **API 통신**: api-client 사용, multipart는 FormData  
✅ **에러 핸들링**: 400/401/409 등 표준 처리 및 사용자 메시지  
✅ **모바일 최적화**: 375px 고정, 터치 친화적 모달

---

## Project Structure

### Documentation (this feature)

```text
specs/010-profile-edit/
├── spec.md    # 기능 명세서
├── plan.md    # 이 파일 (기술 계획서)
└── tasks.md  # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   ├── endpoints.ts           # ME_UPDATE, ME_PROFILE_IMAGE 추가
│   │   └── auth/
│   │       ├── me.ts             # getMe (기존)
│   │       ├── me-update.ts      # updateMe (신규)
│   │       ├── me-profile-image.ts # uploadProfileImage (신규)
│   │       └── types.ts          # MeUpdateRequest, ProfileImageUploadResponse 등 추가
│   └── ...
├── components/
│   └── Mypage/
│       └── components/
│           └── profile-section/
│               ├── index.tsx           # ProfileSection (cameraButtonWrapper 클릭 → 모달 열기)
│               ├── styles.module.css
│               ├── hooks/
│               │   └── useProfile.ts  # 기존
│               └── components/
│                   └── ProfileEditModal/   # 프로필 수정 모달
│                       ├── index.tsx
│                       └── styles.module.css
└── app/
    └── ...
```

---

## Data Model

### API Request Types

```typescript
// src/commons/apis/auth/types.ts 추가

/**
 * 프로필 수정 요청 (닉네임만 전송, 이메일은 UI에서 미제공)
 */
export interface MeUpdateRequest {
  nickname: string;
  // email은 명세상 클라이언트에서 전송하지 않음
}

/**
 * 프로필 이미지 업로드 요청
 * - multipart/form-data, 필드명은 백엔드 스펙에 맞춤 (예: file 또는 image)
 */
// FormData로 전송하므로 별도 인터페이스는 파일 참조만
```

### API Response Types

```typescript
/**
 * 프로필 수정 성공 시 응답 (200 OK)
 * - MeResponse와 동일한 형태로 전체 프로필 반환 가능
 */
// MeResponse 재사용

/**
 * 프로필 이미지 업로드 성공 시 응답 (201 Created)
 */
export interface ProfileImageUploadResponse {
  profileImageUrl: string;
}
```

### Component State Types

```typescript
/**
 * 프로필 수정 모달 폼 상태
 */
interface ProfileEditModalState {
  nickname: string;
  previewImageUrl: string | null;  // 업로드 직후 미리보기 (파일 또는 서버 반환 URL)
  uploadedFile: File | null;        // "사진 변경"으로 선택한 파일 (저장 전)
  error: string | null;
  isSubmitting: boolean;
}
```

---

## API Design

### 1. 프로필 수정 (닉네임)

**Endpoint**: `POST /api/me/update`

**Request Body** (application/json):
```json
{
  "nickname": "새로운닉네임"
}
```
- 이메일은 전송하지 않음 (명세: 사진·닉네임만 수정)

**Response**:
- `200 OK`: 프로필 수정 성공 (MeResponse 형태 가능)
- `400 Bad Request`: 잘못된 요청 데이터
- `401 Unauthorized`: 인증되지 않은 사용자
- `409 Conflict`: 중복된 닉네임

**Error Handling**:
- 409 시 "이미 사용 중인 닉네임입니다" 등 메시지 표시, 모달 유지

### 2. 프로필 이미지 업로드

**Endpoint**: `POST /api/me/profile-image`

**Request**: multipart/form-data  
- 필드명: 백엔드 스펙에 따름 (예: `file`, `image` 등)
- 허용 형식: jpeg, png, webp
- 최대 크기: 5MB

**Response**:
- `201 Created`: `{ "profileImageUrl": "https://..." }`
- `400 Bad Request`: 파일 검증 실패 (형식/크기)
- `401 Unauthorized`: 인증되지 않은 사용자

**Error Handling**:
- 클라이언트에서 선택 단계에서 형식/크기 검증 후 업로드
- 서버 400 시 "파일 형식이 올바르지 않습니다" / "파일 크기는 5MB 이하여야 합니다" 등 표시

---

## Component Design

### ProfileSection (수정)

**Location**: `src/components/Mypage/components/profile-section/index.tsx`

**변경 사항**:
- `cameraButtonWrapper`(또는 그 내부 버튼)에 `onClick` 연결
- 클릭 시 프로필 수정 모달 열기 (open state)
- 모달 컴포넌트: `ProfileEditModal` 렌더, `open`/`onClose` props
- 로딩/에러/프로필 없음 시 카메라 버튼 `disabled` 유지 (기존 동작)

### ProfileEditModal (신규)

**Location**: `src/components/Mypage/components/profile-section/components/ProfileEditModal/index.tsx`

**Props**:
```typescript
interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: MeResponse | null;  // 현재 프로필 (닉네임, profileImg)
  onSuccess?: () => void;      // 저장 성공 시 콜백 (예: 쿼리 무효화 후 부모 리페치)
}
```

**Features**:
1. **모달 레이아웃 (Figma 기준)**
   - 제목: "프로필 수정"
   - 원형 프로필 미리보기 (현재 이미지 또는 업로드한 파일 미리보기)
   - "사진 변경" 버튼 → `<input type="file" accept="image/jpeg,image/png,image/webp" />` 트리거
   - "닉네임" 레이블 + 입력 필드 (초기값: profile.nickname)
   - 하단: "취소" | "저장"

2. **사진 변경**
   - 파일 선택 시 클라이언트에서 형식/크기(5MB) 검증
   - 통과 시 로컬 미리보기 갱신 및 uploadedFile 상태 보관
   - 실패 시 error 메시지 표시

3. **저장**
   - "저장" 클릭 시: (1) 이미지 변경 있으면 먼저 POST /api/me/profile-image 호출 (2) 닉네임 변경 있으면 POST /api/me/update (nickname만) 호출. 순서는 이미지 먼저 후 닉네임 권장.
   - 저장 중 isSubmitting, 버튼 비활성화
   - 성공 시 onClose 호출, onSuccess로 부모에서 refetch 등 처리
   - 409 시 모달 유지 + "이미 사용 중인 닉네임입니다" 표시

4. **취소 / 닫기**
   - "취소" 또는 배경 클릭 시 onClose, 미저장 변경 버림
   - ESC 키 닫기 (선택 구현)

**State Management**:
- 로컬: nickname, previewImageUrl, uploadedFile, error, isSubmitting
- 서버: useMutation(updateMe), useMutation(uploadProfileImage), 성공 시 queryClient.invalidateQueries(['auth', 'me'])

**Styling**:
- CSS Modules (및 필요 시 Tailwind 디자인 토큰)
- 375px 고정, 모달 중앙, 배경 딤 처리

---

## Implementation Strategy

### Phase 1: API Layer

**목표**: 프로필 수정 및 프로필 이미지 업로드 API 연동

1. **엔드포인트 추가** (`src/commons/apis/endpoints.ts`)
   - `ME_UPDATE`: `${AUTH_ENDPOINTS.ME}/update`
   - `ME_PROFILE_IMAGE`: `${AUTH_ENDPOINTS.ME}/profile-image`

2. **타입 정의** (`src/commons/apis/auth/types.ts`)
   - `MeUpdateRequest`, `ProfileImageUploadResponse` 추가

3. **API 함수**
   - `updateMe(payload: MeUpdateRequest)`: POST /api/me/update, JSON
   - `uploadProfileImage(file: File)`: POST /api/me/profile-image, FormData
   - 에러 변환: Axios 에러 → ApiError 형태, 409 등 status 전달

### Phase 2: React Query Hooks

**목표**: Mutation 훅 및 쿼리 무효화

1. **useUpdateMe** (또는 profile-section 전용 훅 내부에서 mutation 사용)
   - updateMe 호출, 성공 시 `queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })`

2. **useUploadProfileImage**
   - uploadProfileImage 호출, 성공 시 동일하게 `['auth', 'me']` 무효화
   - 반환 URL은 필요 시 모달 내 미리보기 갱신에 사용

(훅 위치: `src/components/Mypage/components/profile-section/hooks/` 에서 useUpdateProfile, useUploadProfileImage 형태로 두거나, `commons/apis/auth/hooks/` 에 두고 ProfileEditModal에서 사용)

### Phase 3: ProfileEditModal UI

**목표**: Figma 디자인(161-24140) 기준 모달 구현

1. **구조**
   - 오버레이 + 모달 컨테이너
   - 제목, 프로필 미리보기, "사진 변경" 버튼, 닉네임 입력, 취소/저장 버튼

2. **동작**
   - open 시 profile 기준으로 nickname·profileImg 초기화
   - hidden file input + "사진 변경" 클릭 시 input.click()
   - 파일 선택 → 검증 → 미리보기 갱신
   - 저장 시 이미지 업로드 → 닉네임 업데이트 순서, 성공 시 onClose + onSuccess

3. **스타일**
   - CSS Modules (styles.module.css), 375px 기준, 디자인 토큰 활용

### Phase 4: ProfileSection 연동

**목표**: 카메라 버튼 클릭 시 모달 열기

1. **상태**
   - `const [modalOpen, setModalOpen] = useState(false)`

2. **이벤트**
   - cameraButtonWrapper(또는 내부 버튼) onClick → setModalOpen(true)
   - profile 없거나 loading/error 시 버튼 disabled 유지

3. **모달**
   - `<ProfileEditModal open={modalOpen} onClose={() => setModalOpen(false)} profile={profile} onSuccess={() => refetch()} />`
   - useProfile의 refetch 전달하여 저장 후 프로필 섹션 갱신

### Phase 5: 검증 및 에러 처리

1. **클라이언트 검증**
   - 이미지: accept="image/jpeg,image/png,image/webp", file.size <= 5 * 1024 * 1024
   - 닉네임: 공백만/빈 값 방지, 길이 제한(백엔드 스펙에 맞춤)

2. **에러 메시지**
   - 409 → "이미 사용 중인 닉네임입니다"
   - 400 (파일) → "파일 형식 또는 크기를 확인해주세요" 등
   - 네트워크/기타 → "일시적인 오류가 발생했습니다. 다시 시도해주세요."

### Phase 6: E2E / UI 테스트 (Playwright)

- 프로필 섹션에서 카메라 버튼 클릭 → 모달 표시
- "사진 변경" → 파일 선택 (테스트용 작은 이미지) → 미리보기 갱신
- 닉네임 수정 후 "저장" → 모달 닫힘, 프로필 섹션 갱신
- "취소" 및 배경 클릭 시 모달 닫힘
- 409 시뮬레이션 시 오류 메시지 노출 (선택)

---

## Workflow (TimeEgg 순서)

1. **API 연결**: updateMe, uploadProfileImage + 타입 + 엔드포인트
2. **E2E 테스트**: 프로필 수정 플로우 시나리오 작성
3. **UI 구현**: ProfileEditModal (Figma 기준) + ProfileSection 모달 트리거, Mock 또는 실제 API
4. **사용자 승인**: UI/UX 검증
5. **데이터 바인딩**: Mutation 훅과 모달 연결, 쿼리 무효화
6. **UI 테스트**: 모달 열기/닫기, 사진 변경, 닉네임 저장, 오류 케이스

---

## Layout & Style Rules

- **375px 고정**: 모달 및 버튼/입력 필드 모두 375px 기준
- **쿠캣 스타일**: 모달은 중앙 정렬, 배경 딤
- **디자인 토큰**: tailwind.config.js 또는 프로젝트 색상/간격 변수 사용, 하드코딩 색상 지양
- **Figma**: 노드 161-24140 프로필 수정 모달 레이아웃·텍스트·버튼 배치 준수

---

## Testing Strategy

- **E2E**: 마이페이지 진입 → 카메라 버튼 클릭 → 모달 열림 → 닉네임 변경 + 저장 → 모달 닫힘 및 프로필 텍스트 갱신
- **E2E**: 사진 변경 → 파일 선택 → 저장 → 프로필 이미지 갱신 (가능 시)
- **UI**: ProfileEditModal 렌더, 취소/배경 클릭 시 onClose 호출, 저장 시 mutation 호출 및 onSuccess 호출 검증
- **에러**: 409 응답 시 메시지 표시 확인 (Mock 또는 MSW)

---

## Dependencies

- 기존: `@/commons/apis/auth/me`, `@/commons/apis/auth/types`, `@/commons/provider/api-provider/api-client`, `@tanstack/react-query`, `useProfile`
- 신규: `updateMe`, `uploadProfileImage` (auth), file input + FormData (네이티브)
- 추가 라이브러리: 없음 (이미지 크롭 등 필요 시 추후 검토)

---

## Open Points

- 프로필 이미지 업로드 multipart 필드명: 백엔드 스펙 확인 후 `file` / `image` 등으로 통일
- "사진 변경" 후 "저장" 전에만 미리보기 갱신할지, 업로드 즉시 서버 반영 후 미리보기할지: 명세상 "업로드 성공 시 모달 내 프로필 미리보기 갱신"이므로, 저장 버튼 누를 때 이미지 업로드 + 닉네임 수정 순서로 한 번에 반영하는 방식으로 구현 가능. 즉, "사진 변경"으로 선택만 하고 "저장" 시 이미지 업로드와 닉네임 수정을 함께 보내는 플로우로 정리함.
