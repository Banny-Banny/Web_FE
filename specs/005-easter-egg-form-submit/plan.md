# 이스터에그 폼 제출 기능 기술 계획서

**Branch**: `feat/easter-egg-form-submit` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-easter-egg-form-submit/spec.md`

## Summary

이스터에그 바텀시트에서 작성한 폼 데이터를 서버에 전송하여 이스터에그를 생성하는 기능을 구현합니다. 사용자가 제목, 메시지, 첨부파일을 입력하고 작성 완료 버튼을 클릭하면, 현재 위치 정보와 함께 multipart/form-data 형식으로 서버에 전송되어 이스터에그가 생성됩니다.

**주요 목표**:
- 이스터에그 생성 API 엔드포인트 함수 구현 (POST /api/capsules)
- 폼 데이터 검증 및 multipart/form-data 변환 로직 구현
- 위치 정보 자동 수집 및 포함 로직 구현
- 멀티미디어 파일 업로드 처리 (이미지, 음원, 동영상)
- 서버 응답 처리 및 에러 핸들링
- 제출 중 상태 관리 및 사용자 피드백 제공

**기술적 접근**:
- React 19 + TypeScript 기반 훅 및 유틸리티 함수 구현
- Axios를 활용한 multipart/form-data 전송
- React Query를 활용한 서버 상태 관리
- 기존 useGeolocation 훅 활용
- api-client.ts를 통한 API 통신

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, Axios, React Query, @tanstack/react-query  
**Storage**: N/A (폼 데이터는 서버로 전송)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 폼 제출 요청 3초 이내, 위치 정보 수집 2초 이내  
**Constraints**: 
- API 엔드포인트: POST /api/capsules
- 요청 형식: multipart/form-data
- 위치 정보(latitude, longitude) 필수
- 제목 최대 30자, 메시지 최대 500자
- 미디어 파일 최대 3개 (이미지, 음원, 동영상 각 1개씩)
- 슬롯 부족 시 409 에러 처리
**Scale/Scope**: API 함수 + 폼 제출 훅 + 에러 핸들링 + 상태 관리

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, API 함수는 `src/commons/apis/`에 배치  
✅ **디렉토리 구조**: API 함수는 `src/commons/apis/easter-egg/`, 훅은 `src/components/home/hooks/`  
✅ **타입 안전성**: TypeScript로 모든 API 요청/응답 타입 정의  
✅ **API 통신**: api-client.ts를 통한 일관된 API 통신  
✅ **에러 핸들링**: 표준화된 에러 처리 및 사용자 피드백  
✅ **성능**: 파일 업로드 진행률 표시, 제출 중 상태 관리

---

## Project Structure

### Documentation (this feature)

```text
specs/005-easter-egg-form-submit/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   └── apis/
│       └── easter-egg/                    # 캡슐 관련 API 함수
│           ├── index.ts                 # 이스터에그 생성 API 함수
│           └── types.ts                # API 요청/응답 타입 정의
├── components/
│   └── home/
│       ├── hooks/                       # 홈 페이지 관련 훅
│       │   ├── useGeolocation.ts       # 위치 정보 수집 훅 (기존)
│       │   └── useEasterEggSubmit.ts  # 이스터에그 제출 훅 (신규)
│       └── components/
│           └── easter-egg-bottom-sheet/
│               ├── index.tsx           # 바텀시트 컴포넌트 (수정)
│               └── types.ts            # 타입 정의 (확장)
└── app/
    └── (main)/
        └── page.tsx                    # 홈 페이지 (수정)
```

---

## Data Model

### API Request Types

```typescript
/**
 * 이스터에그 생성 요청 데이터
 */
export interface CreateEasterEggRequest {
  /** 위도 (필수) */
  latitude: number;
  /** 경도 (필수) */
  longitude: number;
  /** 제목 (선택, 최대 30자) */
  title?: string;
  /** 메시지 (선택, 최대 500자) */
  message?: string;
  /** 미디어 파일 배열 (선택, 최대 3개) */
  media_files?: File[];
  /** 선착순 인원 제한 (선택, 0이면 무제한) */
  view_limit?: number;
  /** 레거시 상품 ID (deprecated) */
  product_id?: string;
}
```

### API Response Types

```typescript
/**
 * 이스터에그 생성 응답
 */
export interface CreateEasterEggResponse {
  success: boolean;
  data: {
    id: string;
    title?: string;
    message?: string;
    latitude: number;
    longitude: number;
    created_at: string;
    // 기타 서버 응답 필드
  };
  message?: string;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
}
```

### Form Data Types (기존 확장)

```typescript
/**
 * 이스터에그 폼 데이터 (기존 타입 확장)
 */
export interface EasterEggFormData {
  title: string;
  message: string;
  attachments: Attachment[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * 제출 상태
 */
export interface SubmitState {
  isSubmitting: boolean;
  progress: number; // 파일 업로드 진행률 (0-100)
  error: string | null;
}
```

---

## API Design

### Endpoint

**POST** `/api/capsules`

**Request Format**: `multipart/form-data`

**Request Fields**:
- `latitude` (number, required): 위도
- `longitude` (number, required): 경도
- `title` (string, optional, max 30 chars): 제목
- `message` (string, optional, max 500 chars): 메시지
- `media_files` (File[], optional, max 3 files): 미디어 파일 배열
- `view_limit` (number, optional): 선착순 인원 제한
- `product_id` (string, optional, deprecated): 레거시 상품 ID

**Response Codes**:
- `200`: 성공
- `400`: 잘못된 요청 데이터
- `401`: 인증 실패
- `409`: 슬롯 부족
- `500`: 서버 오류

### API Function Implementation

```typescript
/**
 * 이스터에그 생성 API
 * 
 * @param data - 이스터에그 생성 요청 데이터
 * @param onProgress - 파일 업로드 진행률 콜백 (선택)
 * @returns 이스터에그 생성 응답
 */
export async function createEasterEgg(
  data: CreateEasterEggRequest,
  onProgress?: (progress: number) => void
): Promise<CreateEasterEggResponse> {
  const formData = new FormData();
  
  // 필수 필드
  formData.append('latitude', data.latitude.toString());
  formData.append('longitude', data.longitude.toString());
  
  // 선택 필드
  if (data.title) {
    formData.append('title', data.title);
  }
  if (data.message) {
    formData.append('message', data.message);
  }
  if (data.view_limit !== undefined) {
    formData.append('view_limit', data.view_limit.toString());
  }
  if (data.product_id) {
    formData.append('product_id', data.product_id);
  }
  
  // 미디어 파일
  if (data.media_files && data.media_files.length > 0) {
    data.media_files.forEach((file) => {
      formData.append('media_files', file);
    });
  }
  
  const response = await apiClient.post<CreateEasterEggResponse>(
    TIMEEGG_ENDPOINTS.CREATE_CAPSULE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    }
  );
  
  return response.data;
}
```

---

## Component Design

### useEasterEggSubmit Hook

**목적**: 이스터에그 제출 로직을 캡슐화한 커스텀 훅

**기능**:
- 폼 데이터 검증
- 위치 정보 수집
- API 요청 생성 및 전송
- 제출 상태 관리
- 에러 핸들링

**인터페이스**:
```typescript
export interface UseEasterEggSubmitReturn {
  /** 제출 함수 */
  submit: (formData: EasterEggFormData) => Promise<void>;
  /** 제출 중 여부 */
  isSubmitting: boolean;
  /** 파일 업로드 진행률 (0-100) */
  progress: number;
  /** 에러 메시지 */
  error: string | null;
  /** 에러 초기화 */
  clearError: () => void;
}
```

**구현 계획**:
1. React Query mutation 활용
2. 위치 정보 수집 로직 통합
3. 폼 데이터 검증 및 변환
4. multipart/form-data 생성
5. 진행률 추적
6. 에러 처리 및 사용자 피드백

### EasterEggBottomSheet Component 수정

**수정 사항**:
- `handleConfirm` 함수에서 API 호출 로직 추가
- 제출 중 상태 표시
- 에러 메시지 표시
- 제출 성공 후 처리

---

## State Management Strategy

### Server State (React Query)

**Mutation**: `useMutation`을 활용한 이스터에그 생성
- 캐싱 불필요 (생성 작업)
- 낙관적 업데이트 불필요
- 에러 핸들링 및 재시도 로직 포함

### Client State (Component State)

**제출 상태**:
- `isSubmitting`: 제출 중 여부
- `progress`: 파일 업로드 진행률
- `error`: 에러 메시지

**위치 정보**:
- 기존 `useGeolocation` 훅 활용
- 제출 시점에 위치 정보 수집

---

## Implementation Phases

### Phase 1: API 함수 및 타입 정의

**목표**: 이스터에그 생성 API 함수와 타입 정의

**작업**:
1. `src/commons/apis/easter-egg/types.ts` 생성
   - `CreateEasterEggRequest` 타입 정의
   - `CreateEasterEggResponse` 타입 정의
   - `ApiErrorResponse` 타입 정의
2. `src/commons/apis/easter-egg/index.ts` 생성
   - `createEasterEgg` 함수 구현
   - multipart/form-data 생성 로직
   - 파일 업로드 진행률 콜백 지원
3. `src/commons/apis/endpoints.ts` 확인
   - `TIMEEGG_ENDPOINTS.CREATE_CAPSULE` 사용 확인

**결과물**: 완전히 작동하는 API 통신 레이어

---

### Phase 2: 폼 데이터 검증 및 변환 로직

**목표**: 폼 데이터를 API 요청 형식으로 검증 및 변환

**작업**:
1. 폼 데이터 검증 함수 구현
   - 제목 길이 검증 (최대 30자)
   - 메시지 길이 검증 (최대 500자)
   - 첨부파일 개수 검증 (최대 3개)
   - 필수 필드 검증 (제목, 위치 정보)
2. 폼 데이터 변환 함수 구현
   - `EasterEggFormData` → `CreateEasterEggRequest` 변환
   - 첨부파일 배열 변환
   - 위치 정보 포함

**결과물**: 타입 안전한 데이터 변환 로직

---

### Phase 3: 위치 정보 수집 및 포함 로직

**목표**: 제출 시점에 위치 정보를 자동으로 수집하고 포함

**작업**:
1. `useGeolocation` 훅 활용
2. 위치 정보 수집 실패 시 에러 처리
3. 위치 정보 수집 중 로딩 상태 표시
4. 위치 정보를 폼 데이터에 포함

**결과물**: 위치 정보 자동 수집 및 포함 로직

---

### Phase 4: 제출 훅 구현

**목표**: 이스터에그 제출 로직을 캡슐화한 커스텀 훅 구현

**작업**:
1. `src/components/home/hooks/useEasterEggSubmit.ts` 생성
2. React Query mutation 설정
3. 위치 정보 수집 통합
4. 폼 데이터 검증 및 변환
5. API 호출 및 진행률 추적
6. 에러 핸들링

**결과물**: 재사용 가능한 제출 훅

---

### Phase 5: 바텀시트 컴포넌트 통합

**목표**: 바텀시트 컴포넌트에 제출 로직 통합

**작업**:
1. `EasterEggBottomSheet` 컴포넌트 수정
2. `useEasterEggSubmit` 훅 사용
3. 제출 중 상태 표시 (로딩 인디케이터)
4. 파일 업로드 진행률 표시
5. 에러 메시지 표시
6. 제출 성공 후 바텀시트 닫기 및 폼 초기화

**결과물**: 완전히 작동하는 이스터에그 제출 기능

---

### Phase 6: 에러 핸들링 및 사용자 피드백

**목표**: 다양한 에러 상황에 대한 적절한 처리 및 사용자 피드백

**작업**:
1. 에러 타입별 메시지 정의
   - 400: 잘못된 요청 데이터
   - 401: 인증 실패
   - 409: 슬롯 부족
   - 500: 서버 오류
   - 네트워크 오류
   - 위치 정보 수집 실패
2. 사용자 친화적 에러 메시지 표시
3. 재시도 옵션 제공
4. 제출 실패 시 폼 데이터 보존

**결과물**: 완전한 에러 핸들링 시스템

---

### Phase 7: 홈 페이지 통합

**목표**: 홈 페이지에서 제출 기능 연결

**작업**:
1. `src/app/(main)/page.tsx` 또는 `src/components/home/index.tsx` 수정
2. `handleEasterEggConfirm` 함수에서 API 호출 연결
3. 제출 성공 후 지도 업데이트 (선택적)

**결과물**: 완전히 통합된 이스터에그 생성 플로우

---

### Phase 8: 테스트 및 최적화

**목표**: 기능 검증 및 성능 최적화

**작업**:
1. E2E 테스트 작성
   - 이스터에그 생성 성공 시나리오
   - 위치 정보 수집 실패 시나리오
   - 슬롯 부족 시나리오
   - 네트워크 오류 시나리오
2. UI 테스트 작성
   - 제출 중 상태 표시
   - 에러 메시지 표시
   - 파일 업로드 진행률 표시
3. 성능 최적화
   - 파일 업로드 최적화
   - 메모리 누수 방지 (미리보기 URL 정리)

**결과물**: 프로덕션 준비 완료

---

## Error Handling Strategy

### Error Types

1. **위치 정보 수집 실패**
   - 권한 거부
   - 타임아웃
   - 브라우저 미지원

2. **폼 데이터 검증 실패**
   - 제목 길이 초과
   - 메시지 길이 초과
   - 첨부파일 개수 초과
   - 필수 필드 누락

3. **API 에러**
   - 400: 잘못된 요청 데이터
   - 401: 인증 실패
   - 409: 슬롯 부족
   - 500: 서버 오류
   - 네트워크 오류

### Error Messages

```typescript
const ERROR_MESSAGES = {
  LOCATION_PERMISSION_DENIED: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
  LOCATION_TIMEOUT: '위치 정보를 가져오는 데 시간이 오래 걸립니다. 잠시 후 다시 시도해주세요.',
  LOCATION_UNAVAILABLE: '위치 정보를 사용할 수 없습니다.',
  TITLE_TOO_LONG: '제목은 최대 30자까지 입력할 수 있습니다.',
  MESSAGE_TOO_LONG: '메시지는 최대 500자까지 입력할 수 있습니다.',
  TOO_MANY_FILES: '미디어 파일은 최대 3개까지 첨부할 수 있습니다.',
  MISSING_REQUIRED_FIELDS: '제목과 위치 정보는 필수 항목입니다.',
  SLOT_INSUFFICIENT: '이스터에그를 생성할 슬롯이 부족합니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};
```

---

## Testing Strategy

### E2E Tests (Playwright)

**시나리오 1**: 이스터에그 생성 성공
- 폼 입력 → 제출 → 성공 확인

**시나리오 2**: 위치 정보 수집 실패
- 위치 권한 거부 → 에러 메시지 확인

**시나리오 3**: 슬롯 부족
- 제출 → 409 에러 → 에러 메시지 확인

**시나리오 4**: 네트워크 오류
- 네트워크 차단 → 제출 → 에러 메시지 확인

### UI Tests (Playwright)

**테스트 항목**:
- 제출 중 로딩 인디케이터 표시
- 파일 업로드 진행률 표시
- 에러 메시지 표시
- 제출 성공 후 바텀시트 닫기

---

## Performance Considerations

### Optimization Strategies

1. **파일 업로드 최적화**
   - 파일 크기 사전 검증
   - 업로드 진행률 실시간 표시
   - 대용량 파일 처리

2. **메모리 관리**
   - 미리보기 URL 정리 (URL.revokeObjectURL)
   - 제출 완료 후 폼 데이터 초기화

3. **네트워크 최적화**
   - 타임아웃 설정 (30초)
   - 재시도 로직 (선택적)

---

## Security Considerations

1. **인증 토큰**
   - api-client.ts의 인터셉터를 통한 자동 토큰 포함

2. **파일 검증**
   - MIME 타입 검증 (기존 로직 활용)
   - 파일 크기 검증 (기존 로직 활용)

3. **위치 정보 보안**
   - HTTPS를 통한 안전한 전송
   - 사용자 동의 하에 수집

---

## Dependencies

### Existing Dependencies

- `axios`: API 통신
- `@tanstack/react-query`: 서버 상태 관리
- 기존 `useGeolocation` 훅

### No New Dependencies Required

모든 기능은 기존 라이브러리와 훅을 활용하여 구현 가능합니다.

---

## Migration Notes

### Breaking Changes

없음 (신규 기능 추가)

### Backward Compatibility

기존 이스터에그 바텀시트 컴포넌트와 완전히 호환됩니다.

---

## Success Criteria

### Functional

- ✅ 이스터에그 생성 API 호출 성공
- ✅ 위치 정보 자동 수집 및 포함
- ✅ 멀티미디어 파일 업로드 성공
- ✅ 모든 에러 상황 처리

### Performance

- ✅ 폼 제출 요청 3초 이내 완료
- ✅ 위치 정보 수집 2초 이내 완료
- ✅ 파일 업로드 진행률 실시간 표시

### User Experience

- ✅ 제출 중 상태 명확히 표시
- ✅ 에러 메시지 명확하고 이해하기 쉬움
- ✅ 제출 실패 시 폼 데이터 보존

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-27  
**다음 단계**: `/speckit.tasks` 명령어로 작업 목록 생성
