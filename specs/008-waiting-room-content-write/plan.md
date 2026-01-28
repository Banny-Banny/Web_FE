# 타임캡슐 대기실 개인 컨텐츠 작성 및 저장 기술 구현 계획

**Branch**: `feat/waiting-room-content-write` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)  
**Input**: 타임캡슐 대기실 개인 컨텐츠 작성 및 저장 기능 명세서 (`specs/008-waiting-room-content-write/spec.md`)

## Summary

대기실에 참여한 각 사용자가 자신의 슬롯에 타임캡슐 컨텐츠(텍스트, 이미지, 음악, 영상)를 작성하고 저장하는 기능을 구현합니다. 사용자는 대기실 설정에 따라 허용된 범위 내에서 자유롭게 컨텐츠를 작성하고, 작성한 내용을 저장하여 나중에 수정할 수 있습니다.

**주요 목표**:
- 대기실 설정 조회 및 미디어 제한사항 확인
- 개인 컨텐츠 작성 (텍스트, 이미지, 음악, 영상)
- 개인 컨텐츠 저장 (신규 작성 및 수정)
- 기존 작성 컨텐츠 조회 및 불러오기
- 자동 저장 기능 (debounce 3초)

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Query를 활용한 서버 상태 관리
- React Hook Form을 활용한 폼 상태 관리
- CSS Module + Tailwind CSS를 활용한 스타일링
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- 375px 모바일 고정 레이아웃 기준
- multipart/form-data 형식의 파일 업로드 처리

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: 
- `@tanstack/react-query` (v5.90.20) - 서버 상태 관리
- `react-hook-form` (v7.54.2) - 폼 상태 관리
- `axios` (v1.13.2) - HTTP 클라이언트
- `next` (v16.1.4) - 프레임워크
- `react` (v19.2.3) - UI 라이브러리

**Storage**: 서버 상태는 React Query 캐시에 저장, 클라이언트 상태는 React State  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 모바일 웹 (375px 고정 레이아웃)  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: 
- 대기실 설정 조회 응답 시간 2초 이하
- 기존 컨텐츠 조회 응답 시간 2초 이하
- 컨텐츠 저장 응답 시간 3초 이하
- 이미지 업로드 응답 시간 5초 이하
- 음악/영상 업로드 응답 시간 10초 이하

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 모든 API 요청에 인증 토큰 포함 (`Authorization: Bearer {token}`)
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- multipart/form-data 형식의 파일 업로드 지원
- 자동 저장 debounce 3초
- 바텀시트 컴포넌트 사용

**Scale/Scope**: 
- 대기실 페이지 내 컨텐츠 작성 바텀시트
- 컨텐츠 작성 폼 (텍스트, 이미지, 음악, 영상)
- 파일 업로드 및 미리보기
- 자동 저장 기능

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/WaitingRoom/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query (서버 상태) + React Hook Form (폼 상태) + React State (클라이언트 상태)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부  
✅ **성능**: 페이지 로드 최적화, API 호출 최적화, 자동 저장 debounce

---

## Project Structure

### Documentation (this feature)

```text
specs/008-waiting-room-content-write/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── waiting-room/
│           └── [capsuleId]/
│               └── page.tsx              # 대기실 페이지 라우팅 (기존)
├── components/
│   └── WaitingRoom/                      # 대기실 페이지 컴포넌트 (기존)
│       ├── index.tsx                      # 메인 컨테이너 컴포넌트 (기존)
│       ├── types.ts                      # 타입 정의 (기존)
│       ├── styles.module.css              # 스타일 (기존)
│       ├── hooks/                         # 페이지별 비즈니스 로직 (기존)
│       │   └── useWaitingRoom.ts          # 대기실 정보 조회 훅 (기존)
│       └── components/                    # UI 컴포넌트
│           ├── ContentWriteBottomSheet/   # 컨텐츠 작성 바텀시트 (신규 추가)
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   ├── styles.module.css
│           │   └── components/            # 하위 컴포넌트
│           │       ├── TextInput/         # 텍스트 입력 컴포넌트
│           │       │   ├── index.tsx
│           │       │   ├── types.ts
│           │       │   └── styles.module.css
│           │       ├── ImageUpload/       # 이미지 업로드 컴포넌트
│           │       │   ├── index.tsx
│           │       │   ├── types.ts
│           │       │   └── styles.module.css
│           │       ├── MusicUpload/       # 음악 업로드 컴포넌트
│           │       │   ├── index.tsx
│           │       │   ├── types.ts
│           │       │   └── styles.module.css
│           │       ├── VideoUpload/      # 영상 업로드 컴포넌트
│           │       │   ├── index.tsx
│           │       │   ├── types.ts
│           │       │   └── styles.module.css
│           │       └── MediaLimits/      # 미디어 제한사항 표시 컴포넌트
│           │           ├── index.tsx
│           │           ├── types.ts
│           │           └── styles.module.css
│           └── ... (기존 컴포넌트)
└── commons/
    ├── apis/
    │   └── capsules/
    │       └── step-rooms/                # 대기실 API 함수 (기존)
    │           ├── index.ts               # 대기실 API 함수 (기존)
    │           ├── types.ts               # 대기실 타입 정의 (기존, 확장)
    │           └── hooks/                 # React Query 훅 (기존, 확장)
    │               ├── useWaitingRoom.ts  # 대기실 상세 조회 훅 (기존)
    │               ├── useWaitingRoomSettings.ts  # 대기실 설정값 조회 훅 (기존)
    │               ├── useMyContent.ts     # 본인 컨텐츠 조회 훅 (신규 추가)
    │               ├── useSaveContent.ts  # 컨텐츠 저장 훅 (신규 추가)
    │               └── useUpdateContent.ts  # 컨텐츠 수정 훅 (신규 추가)
    └── utils/
        └── content.ts                      # 컨텐츠 관련 유틸리티 함수 (신규 추가)
```

---

## 데이터 모델링

### API 타입 (신규 추가)

```typescript
// src/commons/apis/capsules/step-rooms/types.ts (확장)

/**
 * 개인 컨텐츠 API 응답 타입 (백엔드 snake_case)
 */
export interface MyContentApiResponse {
  text?: string;
  images?: string[]; // 이미지 URL 배열
  music?: string; // 음악 URL
  video?: string; // 영상 URL
  created_at?: string;
  updated_at?: string;
}

/**
 * 개인 컨텐츠 응답 타입 (프론트엔드 camelCase)
 */
export interface MyContentResponse {
  /** 텍스트 내용 */
  text?: string;
  /** 이미지 URL 배열 */
  images?: string[];
  /** 음악 URL */
  music?: string;
  /** 영상 URL */
  video?: string;
  /** 작성 일시 (ISO 8601 형식) */
  createdAt?: string;
  /** 수정 일시 (ISO 8601 형식) */
  updatedAt?: string;
}

/**
 * 컨텐츠 저장 요청 타입
 */
export interface SaveContentRequest {
  /** 텍스트 내용 */
  text?: string;
  /** 이미지 파일 배열 */
  images?: File[];
  /** 음악 파일 */
  music?: File;
  /** 영상 파일 */
  video?: File;
}

/**
 * 컨텐츠 수정 요청 타입
 */
export interface UpdateContentRequest {
  /** 텍스트 내용 */
  text?: string;
  /** 이미지 파일 배열 */
  images?: File[];
  /** 음악 파일 */
  music?: File;
  /** 영상 파일 */
  video?: File;
}
```

### 컨텐츠 작성 폼 타입

```typescript
// src/components/WaitingRoom/components/ContentWriteBottomSheet/types.ts
export interface ContentFormData {
  /** 텍스트 내용 */
  text: string;
  /** 이미지 파일 배열 */
  images: File[];
  /** 음악 파일 */
  music?: File | null;
  /** 영상 파일 */
  video?: File | null;
}

export interface ContentWriteBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 대기실 ID */
  capsuleId: string;
  /** 대기실 설정 */
  settings: WaitingRoomSettingsResponse;
}

export interface MediaLimitsProps {
  /** 대기실 설정 */
  settings: WaitingRoomSettingsResponse;
  /** 현재 업로드된 이미지 개수 */
  currentImageCount: number;
}
```

---

## API 설계

### 신규 API 추가

**본인 컨텐츠 조회** (`GET /api/capsules/step-rooms/{capsuleId}/my-content`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)` (신규 추가)
- **함수**: `getMyContent(capsuleId: string)` (신규 추가)
- **응답**: `MyContentResponse` (텍스트, 이미지, 음악, 영상)
- **용도**: 사용자가 작성한 컨텐츠 조회
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 대기실 존재 여부 확인
  - 사용자가 대기실에 참여한 상태인지 확인

**컨텐츠 저장 (신규 작성)** (`POST /api/capsules/step-rooms/{capsuleId}/my-content`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)` (신규 추가)
- **함수**: `saveContent(capsuleId: string, data: SaveContentRequest)` (신규 추가)
- **요청**: `multipart/form-data` 형식 (text, images[], music, video)
- **응답**: `MyContentResponse`
- **용도**: 사용자가 작성한 컨텐츠 저장 (신규 작성)
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 대기실 존재 여부 확인
  - 사용자가 대기실에 참여한 상태인지 확인
  - 대기실 설정에 따른 미디어 제한사항 확인

**컨텐츠 저장 (수정)** (`PATCH /api/capsules/step-rooms/{capsuleId}/my-content`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)` (신규 추가)
- **함수**: `updateContent(capsuleId: string, data: UpdateContentRequest)` (신규 추가)
- **요청**: `multipart/form-data` 형식 (text, images[], music, video)
- **응답**: `MyContentResponse`
- **용도**: 사용자가 작성한 컨텐츠 수정
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 대기실 존재 여부 확인
  - 사용자가 대기실에 참여한 상태인지 확인
  - 대기실 설정에 따른 미디어 제한사항 확인

### API 엔드포인트 추가

```typescript
// src/commons/apis/endpoints.ts에 추가
export const CAPSULE_ENDPOINTS = {
  // 기존
  CREATE_WAITING_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
  WAITING_ROOM_SETTINGS: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/settings`,
  WAITING_ROOM_DETAIL: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}`,
  // 신규 추가
  MY_CONTENT: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/my-content`,
} as const;
```

### multipart/form-data 처리

```typescript
// src/commons/apis/capsules/step-rooms/index.ts (확장)
import FormData from 'form-data';

/**
 * 컨텐츠 저장 요청을 FormData로 변환
 */
function createContentFormData(data: SaveContentRequest | UpdateContentRequest): FormData {
  const formData = new FormData();
  
  if (data.text !== undefined) {
    formData.append('text', data.text);
  }
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append('images', image);
    });
  }
  
  if (data.music) {
    formData.append('music', data.music);
  }
  
  if (data.video) {
    formData.append('video', data.video);
  }
  
  return formData;
}

/**
 * 본인 컨텐츠 조회 API
 */
export async function getMyContent(capsuleId: string): Promise<MyContentResponse> {
  const response = await apiClient.get<MyContentApiResponse>(
    CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)
  );
  // snake_case → camelCase 변환
  return transformMyContent(response.data);
}

/**
 * 컨텐츠 저장 API (신규 작성)
 */
export async function saveContent(
  capsuleId: string,
  data: SaveContentRequest
): Promise<MyContentResponse> {
  const formData = createContentFormData(data);
  const response = await apiClient.post<MyContentApiResponse>(
    CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return transformMyContent(response.data);
}

/**
 * 컨텐츠 수정 API
 */
export async function updateContent(
  capsuleId: string,
  data: UpdateContentRequest
): Promise<MyContentResponse> {
  const formData = createContentFormData(data);
  const response = await apiClient.patch<MyContentApiResponse>(
    CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return transformMyContent(response.data);
}
```

---

## 컴포넌트 설계

### 1. ContentWriteBottomSheet (컨텐츠 작성 바텀시트)

**역할**: 컨텐츠 작성 바텀시트 컨테이너

**책임**:
- 바텀시트 열기/닫기 관리
- 대기실 설정 조회
- 기존 컨텐츠 조회 및 불러오기
- 폼 상태 관리 (React Hook Form)
- 자동 저장 트리거 (debounce 3초)
- 컨텐츠 저장/수정 처리
- 로딩 상태 표시
- 오류 처리 및 사용자 안내

**구조**:
```tsx
<BottomSheet isOpen={isOpen} onClose={handleClose} footer={<SaveButton />}>
  <MediaLimits settings={settings} currentImageCount={imageCount} />
  <TextInput />
  <ImageUpload />
  {settings.hasMusic && <MusicUpload />}
  {settings.hasVideo && <VideoUpload />}
</BottomSheet>
```

### 2. TextInput (텍스트 입력)

**역할**: 텍스트 입력 컴포넌트

**책임**:
- 텍스트 입력 필드 표시
- 텍스트 입력 처리
- 실시간 표시

**구조**:
```tsx
<TextInput
  value={text}
  onChange={handleTextChange}
  placeholder="타임캡슐에 담을 메시지를 입력하세요"
/>
```

### 3. ImageUpload (이미지 업로드)

**역할**: 이미지 업로드 컴포넌트

**책임**:
- 이미지 파일 선택
- 이미지 파일 형식 검증 (jpg, png, gif)
- 이미지 파일 크기 검증 (5MB)
- 대기실 설정에 따른 사진 개수 제한 확인
- 이미지 미리보기 표시
- 이미지 업로드 중 로딩 상태 표시
- 이미지 업로드 실패 처리

**구조**:
```tsx
<ImageUpload
  images={images}
  maxCount={settings.maxImagesPerPerson}
  onChange={handleImagesChange}
  onRemove={handleImageRemove}
/>
```

### 4. MusicUpload (음악 업로드)

**역할**: 음악 업로드 컴포넌트

**책임**:
- 음악 파일 선택
- 음악 파일 형식 검증 (mp3, wav)
- 음악 파일 크기 검증 (50MB)
- 대기실 설정에서 음악 허용 여부 확인
- 음악 업로드 중 로딩 상태 표시
- 음악 업로드 실패 처리

**구조**:
```tsx
{settings.hasMusic && (
  <MusicUpload
    music={music}
    onChange={handleMusicChange}
    onRemove={handleMusicRemove}
  />
)}
```

### 5. VideoUpload (영상 업로드)

**역할**: 영상 업로드 컴포넌트

**책임**:
- 영상 파일 선택
- 영상 파일 형식 검증 (mp4, mov)
- 영상 파일 크기 검증 (50MB)
- 대기실 설정에서 영상 허용 여부 확인
- 영상 업로드 중 로딩 상태 표시
- 영상 업로드 실패 처리

**구조**:
```tsx
{settings.hasVideo && (
  <VideoUpload
    video={video}
    onChange={handleVideoChange}
    onRemove={handleVideoRemove}
  />
)}
```

### 6. MediaLimits (미디어 제한사항 표시)

**역할**: 미디어 제한사항 표시 컴포넌트

**책임**:
- 대기실 설정에 따른 미디어 제한사항 표시
- 사진 개수 제한 표시 (현재/최대)
- 음악/영상 허용 여부 표시

**구조**:
```tsx
<MediaLimits
  settings={settings}
  currentImageCount={imageCount}
/>
```

---

## 상태 관리 전략

### 서버 상태 (React Query)

**본인 컨텐츠 조회**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useMyContent.ts
export function useMyContent(capsuleId: string) {
  return useQuery({
    queryKey: ['myContent', capsuleId],
    queryFn: () => getMyContent(capsuleId),
    enabled: !!capsuleId,
    staleTime: 30000, // 30초
  });
}
```

**컨텐츠 저장 (신규 작성)**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useSaveContent.ts
export function useSaveContent(capsuleId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SaveContentRequest) => saveContent(capsuleId, data),
    onSuccess: () => {
      // 컨텐츠 조회 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['myContent', capsuleId] });
    },
  });
}
```

**컨텐츠 수정**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useUpdateContent.ts
export function useUpdateContent(capsuleId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateContentRequest) => updateContent(capsuleId, data),
    onSuccess: () => {
      // 컨텐츠 조회 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['myContent', capsuleId] });
    },
  });
}
```

### 폼 상태 (React Hook Form)

**컨텐츠 작성 폼 상태 관리**:
```typescript
// src/components/WaitingRoom/components/ContentWriteBottomSheet/hooks/useContentForm.ts
export function useContentForm(
  capsuleId: string,
  settings: WaitingRoomSettingsResponse,
  existingContent?: MyContentResponse
) {
  const form = useForm<ContentFormData>({
    defaultValues: {
      text: existingContent?.text || '',
      images: [],
      music: null,
      video: null,
    },
  });

  const { watch, setValue } = form;
  const text = watch('text');
  const images = watch('images');
  const music = watch('music');
  const video = watch('video');

  // 자동 저장 debounce (3초)
  const debouncedSave = useDebouncedCallback(
    async (data: ContentFormData) => {
      // 자동 저장 로직
    },
    3000
  );

  useEffect(() => {
    if (text || images.length > 0 || music || video) {
      debouncedSave(form.getValues());
    }
  }, [text, images, music, video]);

  return {
    form,
    text,
    images,
    music,
    video,
  };
}
```

### 클라이언트 상태 (React State)

**바텀시트 상태 관리**:
```typescript
// src/components/WaitingRoom/components/ContentWriteBottomSheet/index.tsx
const [isOpen, setIsOpen] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [saveError, setSaveError] = useState<string | null>(null);
```

---

## 개발 워크플로우

### Step 1: API 연결

**목적**: 컨텐츠 조회 및 저장 API 구현

**작업**:
1. `src/commons/apis/endpoints.ts`에 신규 엔드포인트 추가
   - `CAPSULE_ENDPOINTS.MY_CONTENT(capsuleId)`
2. `src/commons/apis/capsules/step-rooms/types.ts` 확장
   - `MyContentApiResponse`
   - `MyContentResponse`
   - `SaveContentRequest`
   - `UpdateContentRequest`
3. `src/commons/apis/capsules/step-rooms/index.ts` 확장
   - `getMyContent(capsuleId: string)`
   - `saveContent(capsuleId: string, data: SaveContentRequest)`
   - `updateContent(capsuleId: string, data: UpdateContentRequest)`
   - `createContentFormData()` - FormData 변환 함수
   - `transformMyContent()` - snake_case → camelCase 변환 함수
4. `src/commons/apis/capsules/step-rooms/hooks/useMyContent.ts` 생성
   - React Query query 훅 구현
5. `src/commons/apis/capsules/step-rooms/hooks/useSaveContent.ts` 생성
   - React Query mutation 훅 구현
6. `src/commons/apis/capsules/step-rooms/hooks/useUpdateContent.ts` 생성
   - React Query mutation 훅 구현
7. API 호출 단위 테스트 작성

**결과물**: 완전히 작동하는 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 컨텐츠 작성 및 저장 플로우 검증

**작업**:
1. 컨텐츠 작성 플로우 테스트
   - 대기실 설정 조회 테스트
   - 기존 컨텐츠 조회 테스트
   - 텍스트 입력 테스트
   - 이미지 업로드 테스트
   - 음악/영상 업로드 테스트
   - 컨텐츠 저장 테스트
2. 컨텐츠 수정 플로우 테스트
   - 기존 컨텐츠 불러오기 테스트
   - 컨텐츠 수정 테스트
   - 컨텐츠 수정 저장 테스트
3. 자동 저장 플로우 테스트
   - 자동 저장 트리거 테스트
   - 자동 저장 완료 테스트
4. 미디어 제한사항 테스트
   - 사진 개수 제한 테스트
   - 음악/영상 허용 여부 테스트
   - 파일 크기 제한 테스트
   - 파일 형식 제한 테스트
5. 오류 처리 테스트
   - 컨텐츠 조회 실패 처리 테스트
   - 컨텐츠 저장 실패 처리 테스트
   - 네트워크 오류 처리 테스트

**도구**: Playwright  
**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. Figma MCP를 사용하여 디자인 시안 확인
   - 컨텐츠 작성 바텀시트 디자인
   - 텍스트 입력 필드 디자인
   - 이미지 업로드 UI 디자인
   - 음악/영상 업로드 UI 디자인
   - 미디어 제한사항 표시 디자인
2. Mock 데이터 기반 UI 컴포넌트 구현
   - `ContentWriteBottomSheet` 컴포넌트
     - 바텀시트 열기/닫기
     - 미디어 제한사항 표시
     - 텍스트 입력 필드
     - 이미지 업로드 UI
     - 음악/영상 업로드 UI
     - 저장 버튼
   - `TextInput` 컴포넌트
     - 텍스트 입력 필드
     - 실시간 표시
   - `ImageUpload` 컴포넌트
     - 이미지 파일 선택
     - 이미지 미리보기
     - 이미지 삭제
   - `MusicUpload` 컴포넌트
     - 음악 파일 선택
     - 음악 파일 정보 표시
     - 음악 파일 삭제
   - `VideoUpload` 컴포넌트
     - 영상 파일 선택
     - 영상 파일 정보 표시
     - 영상 파일 삭제
   - `MediaLimits` 컴포넌트
     - 미디어 제한사항 표시
3. 375px 고정 레이아웃으로 스타일링
4. 디자인 토큰 활용 (Figma에서 추출)

**결과물**: 375px 모바일 프레임 전용 완전한 UI/UX

### Step 4: 사용자 승인 단계

**목적**: UI/UX 최종 검증 및 피드백 수집

**작업**:
1. 스테이징 환경 배포 (375px 모바일 프레임)
2. 사용자 테스트 및 피드백 수집
3. UI/UX 개선사항 반영

**결과물**: 사용자 승인된 최종 UI

### Step 5: 데이터 바인딩

**목적**: 실제 API와 UI 연결, 컨텐츠 작성 및 저장 플로우 완성

**작업**:
1. `useContentForm` 훅 구현
   - React Hook Form 설정
   - 기존 컨텐츠 불러오기
   - 폼 상태 관리
   - 자동 저장 debounce 로직
2. Mock 데이터를 실제 API 호출로 교체
3. React Query 훅과 UI 컴포넌트 연결
4. 로딩/에러 상태 처리
5. 자동 저장 기능 구현
6. 파일 업로드 처리 (multipart/form-data)

**결과물**: 완전히 작동하는 컨텐츠 작성 및 저장 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
   - 컨텐츠 작성 바텀시트 렌더링 테스트
   - 텍스트 입력 테스트
   - 이미지 업로드 테스트
   - 음악/영상 업로드 테스트
   - 미디어 제한사항 표시 테스트
   - 자동 저장 테스트
   - 로딩 상태 표시 테스트
   - 에러 메시지 표시 테스트
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 에러 처리 전략

### 컨텐츠 조회 실패

**시나리오**: 본인 컨텐츠 조회 API 호출이 실패

**에러 코드별 처리**:
- **404 STEP_ROOM_NOT_FOUND**: 대기실을 찾을 수 없음 → "대기실을 찾을 수 없습니다." 메시지 표시
- **401 UNAUTHORIZED**: 인증되지 않은 사용자 → 로그인 페이지로 이동
- **403 FORBIDDEN**: 권한 없는 사용자 → "대기실에 접근할 수 있는 권한이 없습니다." 메시지 표시

**일반 처리**:
- 명확한 에러 메시지를 표시 (에러 코드를 사용자 친화적인 메시지로 변환)
- 재시도 옵션 제공 (일시적 오류의 경우)
- 네트워크 오류의 경우 네트워크 연결 확인 안내
- 빈 컨텐츠 작성 화면을 표시하여 사용자가 새로 작성할 수 있도록 함

### 컨텐츠 저장 실패

**시나리오**: 컨텐츠 저장 API 호출이 실패

**에러 코드별 처리**:
- **400 VALIDATION_ERROR**: 유효성 검사 실패 → "입력한 내용을 확인해주세요." 메시지 표시
- **400 FILE_SIZE_EXCEEDED**: 파일 크기 초과 → "파일 크기가 너무 큽니다." 메시지 표시
- **400 FILE_TYPE_INVALID**: 파일 형식 불일치 → "지원하지 않는 파일 형식입니다." 메시지 표시
- **400 MEDIA_LIMIT_EXCEEDED**: 미디어 제한 초과 → "업로드 가능한 개수를 초과했습니다." 메시지 표시

**일반 처리**:
- 명확한 에러 메시지를 표시
- 재시도 옵션 제공 (일시적 오류의 경우)
- 네트워크 오류의 경우 네트워크 연결 확인 안내
- 작성한 컨텐츠가 손실되지 않도록 로컬에 임시 저장 (가능한 경우)

### 파일 업로드 실패

**시나리오**: 파일 업로드 중 오류 발생

**처리**:
- 파일 크기 초과 안내 메시지 표시
- 파일 형식 불일치 안내 메시지 표시
- 허용된 파일 형식 및 크기를 명확하게 안내
- 파일 선택을 다시 할 수 있도록 안내

### 자동 저장 실패

**시나리오**: 자동 저장이 실패

**처리**:
- 자동 저장 실패를 조용히 처리 (사용자 작업을 방해하지 않음)
- 자동 저장 재시도 로직 실행
- 사용자에게 수동 저장을 권장하는 안내 표시 (반복 실패 시)

---

## 성능 최적화

### 파일 업로드 최적화

- 이미지 파일은 클라이언트에서 압축하여 업로드 (가능한 경우)
- 파일 업로드 진행 상황 표시
- 대용량 파일 업로드 시 청크 업로드 고려

### 자동 저장 최적화

- debounce 3초로 설정하여 불필요한 API 호출 방지
- 자동 저장 중 사용자 입력 방해하지 않음
- 자동 저장 실패 시 재시도 로직

### 상태 업데이트 최적화

- React.memo를 활용한 불필요한 리렌더링 방지
- React Hook Form의 `watch` 최적화
- 파일 미리보기 최적화

---

## 테스트 전략

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 컨텐츠 작성 플로우
   - 대기실 설정 조회
   - 기존 컨텐츠 조회
   - 텍스트 입력
   - 이미지 업로드
   - 음악/영상 업로드
   - 컨텐츠 저장
2. 컨텐츠 수정 플로우
   - 기존 컨텐츠 불러오기
   - 컨텐츠 수정
   - 컨텐츠 수정 저장
3. 자동 저장 플로우
   - 자동 저장 트리거
   - 자동 저장 완료
4. 미디어 제한사항
   - 사진 개수 제한
   - 음악/영상 허용 여부
   - 파일 크기 제한
   - 파일 형식 제한
5. 오류 처리
   - 컨텐츠 조회 실패 처리
   - 컨텐츠 저장 실패 처리
   - 네트워크 오류 처리

**파일 위치**: `tests/e2e/waiting-room/content-write.spec.ts`

### UI 테스트 (Playwright)

**테스트 항목**:
- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- 시각적 검증 (스크린샷 비교)
- 로딩 상태 표시 테스트
- 에러 메시지 표시 테스트
- 파일 업로드 테스트
- 자동 저장 테스트

**파일 위치**: `tests/e2e/waiting-room/content-write-ui.spec.ts`

---

## 디자인 시스템 준수

### Figma 디자인 토큰

- **색상**: `src/commons/styles/color.ts`에서 정의된 변수 사용
- **간격**: `src/commons/styles/spacing.ts`에서 정의된 변수 사용
- **타이포그래피**: `src/commons/styles/fonts.ts`에서 정의된 변수 사용

### 375px 고정 레이아웃

- 모든 컴포넌트는 375px 기준으로 설계
- 반응형 CSS 미사용
- 고정 단위(px) 사용

### 디자인 정확도

- Figma 디자인과 pixel-perfect 수준으로 일치
- 모든 컴포넌트의 크기, 간격, 색상, 스타일 정확히 반영

### 바텀시트 컴포넌트 사용

- 공통 바텀시트 컴포넌트 (`src/commons/components/bottom-sheet`) 사용
- 바텀시트 내부 컨텐츠만 커스터마이징

---

## 보안 고려사항

### 인증 토큰 관리

- 모든 API 요청에 `Authorization: Bearer {token}` 헤더 자동 포함
- Axios 인터셉터를 통한 토큰 자동 첨부
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용

### 파일 업로드 보안

- 파일 형식 검증 (클라이언트 및 서버)
- 파일 크기 제한 (클라이언트 및 서버)
- 업로드된 파일이 안전하게 저장됨

### 컨텐츠 보안

- 사용자는 자신의 컨텐츠만 조회하고 수정할 수 있음
- 대기실에 참여한 사용자만 컨텐츠 작성 가능

---

## 의존성 관리

### 신규 패키지 설치

- `form-data` (multipart/form-data 처리용) - 필요시 설치

### 기존 패키지 활용

- `@tanstack/react-query`: 서버 상태 관리
- `react-hook-form`: 폼 상태 관리
- `axios`: HTTP 클라이언트
- `next`: 프레임워크
- `react`: UI 라이브러리

---

## 유틸리티 함수

### 컨텐츠 관련 유틸리티

```typescript
// src/commons/utils/content.ts (신규 추가)
/**
 * 파일 크기를 사용자 친화적인 형식으로 포맷팅
 * 
 * @param bytes - 파일 크기 (바이트)
 * @returns 포맷팅된 파일 크기 문자열 (예: "5.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 파일 형식 검증
 * 
 * @param file - 파일 객체
 * @param allowedTypes - 허용된 파일 형식 배열 (예: ['image/jpeg', 'image/png'])
 * @returns 파일 형식이 허용된 형식인지 여부
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 파일 크기 검증
 * 
 * @param file - 파일 객체
 * @param maxSizeBytes - 최대 파일 크기 (바이트)
 * @returns 파일 크기가 허용된 크기 이하인지 여부
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * 이미지 파일인지 확인
 * 
 * @param file - 파일 객체
 * @returns 이미지 파일인지 여부
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 음악 파일인지 확인
 * 
 * @param file - 파일 객체
 * @returns 음악 파일인지 여부
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * 영상 파일인지 확인
 * 
 * @param file - 파일 객체
 * @returns 영상 파일인지 여부
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}
```

---

## 다음 단계

1. `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록 생성
2. 작업 목록에 따라 순차적으로 구현 진행
3. 각 단계별 테스트 작성 및 통과 확인
