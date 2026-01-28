# 친구 관리 기능 기술 계획서

**Branch**: `feat/MYP` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/008-friend-management/spec.md`

## Summary

사용자가 자신의 친구 목록을 조회하고, 전화번호나 이메일을 통해 친구를 추가하거나 삭제할 수 있는 기능을 구현합니다. 카카오 소셜 로그인 사용자의 경우 카카오톡 친구 목록이 자동으로 연동됩니다.

**주요 목표**:
- 친구 목록 조회 API 함수 구현 (GET /api/me/friends)
- 친구 추가 API 함수 구현 (POST /api/me/friends)
- 친구 삭제 API 함수 구현 (DELETE /api/me/friends/{friendshipId})
- 친구 목록 조회 React Query 훅 구현
- 친구 추가/삭제 React Query Mutation 훅 구현
- 친구 관리 UI 컴포넌트 구현 (목록, 추가, 삭제)
- 전화번호/이메일 입력 검증 로직 구현
- 로딩/오류/빈 상태 처리

**기술적 접근**:
- React 19 + TypeScript 기반 훅 및 컴포넌트 구현
- React Query를 활용한 서버 상태 관리
- api-client.ts를 통한 API 통신
- 기존 검증 유틸리티 함수 재사용
- CSS Modules 기반 스타일링 (375px 고정)

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3  
**Primary Dependencies**: Next.js 16.1.4, Axios, React Query (@tanstack/react-query v5.90.20)  
**Storage**: N/A (서버 상태는 React Query 캐시로 관리)  
**Testing**: Playwright (E2E 및 UI 테스트)  
**Target Platform**: 웹 브라우저 (모바일 최적화, 375px 고정)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- 친구 목록 조회 2초 이내
- 친구 추가/삭제 응답 2초 이내
- 새로고침 동기화 3초 이내

**Constraints**: 
- API 엔드포인트: GET /api/me/friends, POST /api/me/friends, DELETE /api/me/friends/{friendshipId}
- 페이지네이션: limit 기본값 20, offset 기본값 0
- 친구 추가는 전화번호 또는 이메일 중 하나만 사용 가능
- 카카오톡 친구 자동 연동은 서버 측에서 처리됨

**Scale/Scope**: 
- API 함수 3개 + 타입 정의
- React Query 훅 3개 (조회, 추가, 삭제)
- 친구 관리 UI 컴포넌트 1개
- 검증 로직 (기존 유틸리티 재사용)
- 상태 관리 (로딩, 오류, 빈 상태)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, API 함수는 `src/commons/apis/`에 배치  
✅ **디렉토리 구조**: API 함수는 `src/commons/apis/me/friends/`, 컴포넌트는 `src/components/Mypage/components/activity-stats/friend/`  
✅ **타입 안전성**: TypeScript로 모든 API 요청/응답 타입 정의  
✅ **API 통신**: api-client.ts를 통한 일관된 API 통신  
✅ **에러 핸들링**: 표준화된 에러 처리 및 사용자 피드백  
✅ **성능**: React Query 캐싱 및 자동 재조회 최적화  
✅ **모바일 최적화**: 375px 고정 기준 UI 구현

---

## Project Structure

### Documentation (this feature)

```text
specs/008-friend-management/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── commons/
│   ├── apis/
│   │   └── me/
│   │       └── friends/                 # 친구 관리 API 함수
│   │           ├── index.ts            # API 함수들 (getFriends, addFriend, deleteFriend)
│   │           ├── types.ts            # API 요청/응답 타입 정의
│   │           └── hooks/              # React Query 훅
│   │               ├── index.ts        # 훅 통합 익스포트
│   │               ├── useFriends.ts   # 친구 목록 조회 훅
│   │               ├── useAddFriend.ts # 친구 추가 Mutation 훅
│   │               └── useDeleteFriend.ts # 친구 삭제 Mutation 훅
│   └── components/
│       └── Login/
│           └── utils/
│               └── validation.ts       # 검증 유틸리티 (재사용)
├── components/
│   └── Mypage/
│       └── components/
│           └── activity-stats/
│               └── friend/             # 친구 관리 컴포넌트
│                   ├── index.tsx       # 친구 목록 컴포넌트
│                   └── styles.module.css # 스타일
└── app/
    └── (main)/
        └── friends/
            └── page.tsx                # 친구 목록 페이지 (라우팅)
```

---

## Data Model

### API Request Types

```typescript
/**
 * 친구 목록 조회 요청 파라미터
 */
export interface GetFriendsParams {
  limit?: number;    // 한 페이지에 표시할 아이템 수 (기본값: 20)
  offset?: number;   // 건너뛸 아이템 수 (기본값: 0)
}

/**
 * 친구 추가 요청
 */
export interface AddFriendRequest {
  phoneNumber?: string;  // 친구의 전화번호 (선택사항)
  email?: string;        // 친구의 이메일 (선택사항)
}
```

### API Response Types

```typescript
/**
 * 친구 정보
 */
export interface Friend {
  id: string;
  nickname: string;
  profileImg: string | null;
}

/**
 * 친구 관계 정보
 */
export interface Friendship {
  id: string;                    // 친구 관계 고유 식별자
  status: 'CONNECTED' | 'PENDING' | 'BLOCKED';
  friend: Friend;
  createdAt: string;
}

/**
 * 친구 목록 조회 응답
 */
export interface GetFriendsResponse {
  items: Friendship[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

/**
 * 친구 추가 응답
 */
export interface AddFriendResponse {
  message: string;
  friendshipId: string;
}
```

### Component State Types

```typescript
/**
 * 친구 추가 폼 상태
 */
interface AddFriendFormState {
  addType: 'phone' | 'email';
  phoneNumber: string;
  email: string;
  addError: string | null;
  showAddForm: boolean;
}
```

---

## API Design

### 1. 친구 목록 조회

**Endpoint**: `GET /api/me/friends`

**Query Parameters**:
- `limit` (optional, number): 한 페이지에 표시할 아이템 수 (기본값: 20)
- `offset` (optional, number): 건너뛸 아이템 수 (기본값: 0)

**Response**:
- `200 OK`: 친구 목록 조회 성공
  ```json
  {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "status": "CONNECTED",
        "friend": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nickname": "바니친구",
          "profileImg": "https://s3.amazonaws.com/bucket/profile/123.jpg"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 157,
    "limit": 20,
    "offset": 0,
    "hasNext": true
  }
  ```
- `401 Unauthorized`: 인증되지 않은 사용자

**Error Handling**:
- 네트워크 오류: 재시도 옵션 제공
- 401 오류: 로그인 페이지로 리다이렉트 (api-client에서 처리)

### 2. 친구 추가

**Endpoint**: `POST /api/me/friends`

**Request Body**:
```json
{
  "phoneNumber": "01012345678"  // 또는 "email": "example@email.com"
}
```

**Response**:
- `201 Created`: 친구 추가 성공
  ```json
  {
    "message": "친구가 추가되었습니다.",
    "friendshipId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- `400 Bad Request`: 잘못된 요청 데이터 (자기 자신 추가 시도)
- `401 Unauthorized`: 인증되지 않은 사용자
- `404 Not Found`: 해당 전화번호/이메일의 사용자를 찾을 수 없음
- `409 Conflict`: 이미 친구 관계이거나 차단된 사용자

**Error Handling**:
- 클라이언트 측 검증: 전화번호/이메일 형식 검증
- 서버 오류: 사용자에게 명확한 오류 메시지 표시

### 3. 친구 삭제

**Endpoint**: `DELETE /api/me/friends/{friendshipId}`

**Path Parameters**:
- `friendshipId` (required, string): 친구 관계 ID

**Response**:
- `204 No Content`: 친구 삭제 성공
- `401 Unauthorized`: 인증되지 않은 사용자
- `403 Forbidden`: 친구 관계를 삭제할 권한이 없음
- `404 Not Found`: 친구 관계를 찾을 수 없음

**Error Handling**:
- 삭제 전 확인 다이얼로그 표시
- 삭제 실패 시 오류 메시지 표시

---

## Component Design

### FriendList Component

**Location**: `src/components/Mypage/components/activity-stats/friend/index.tsx`

**Props**:
```typescript
interface FriendListProps {
  className?: string;
  onClose?: () => void;
}
```

**Features**:
1. **친구 목록 조회**
   - `useFriends` 훅을 사용하여 친구 목록 조회
   - 로딩 상태 표시
   - 오류 상태 처리 및 재시도 옵션
   - 빈 상태 안내 메시지

2. **친구 추가**
   - 전화번호/이메일 타입 선택
   - 입력 필드 및 검증
   - `useAddFriend` 훅을 사용하여 친구 추가
   - 성공 시 폼 초기화 및 목록 자동 갱신

3. **친구 삭제**
   - 각 친구 항목에 삭제 버튼
   - 확인 다이얼로그
   - `useDeleteFriend` 훅을 사용하여 친구 삭제
   - 성공 시 목록 자동 갱신

4. **새로고침**
   - 새로고침 버튼 클릭 시 `refetch()` 호출
   - 새로고침 중 로딩 표시

**State Management**:
- React Query를 통한 서버 상태 관리
- 로컬 상태: 친구 추가 폼 상태 (useState)

**Styling**:
- CSS Modules 사용
- 375px 고정 기준 디자인
- 디자인 토큰 기반 스타일링

---

## Implementation Strategy

### Phase 1: API Layer (완료)

**목표**: API 통신 레이어 구축

**작업 내용**:
1. ✅ API 타입 정의 (`types.ts`)
   - `Friend`, `Friendship`, `GetFriendsParams`, `GetFriendsResponse`
   - `AddFriendRequest`, `AddFriendResponse`

2. ✅ API 함수 구현 (`index.ts`)
   - `getFriends()`: 친구 목록 조회
   - `addFriend()`: 친구 추가
   - `deleteFriend()`: 친구 삭제

3. ✅ 에러 핸들링
   - Axios 에러를 ApiError 형식으로 변환
   - 사용자 친화적인 오류 메시지

### Phase 2: React Query Hooks (완료)

**목표**: 서버 상태 관리 훅 구현

**작업 내용**:
1. ✅ `useFriends` 훅
   - 친구 목록 조회
   - 캐싱 전략 (staleTime: 1분, gcTime: 5분)
   - 재시도 전략 (4xx 오류는 재시도 안 함)

2. ✅ `useAddFriend` 훅
   - 친구 추가 Mutation
   - 성공 시 친구 목록 쿼리 무효화

3. ✅ `useDeleteFriend` 훅
   - 친구 삭제 Mutation
   - 성공 시 친구 목록 쿼리 무효화

### Phase 3: UI Component (완료)

**목표**: 친구 관리 UI 구현

**작업 내용**:
1. ✅ 친구 목록 표시
   - 친구 항목 렌더링 (닉네임, 프로필 이미지)
   - 빈 상태 처리
   - 로딩 상태 표시
   - 오류 상태 처리

2. ✅ 친구 추가 UI
   - 전화번호/이메일 타입 선택
   - 입력 필드 및 검증
   - 추가/취소 버튼
   - 오류 메시지 표시

3. ✅ 친구 삭제 UI
   - 삭제 버튼
   - 확인 다이얼로그
   - 로딩 상태 표시

4. ✅ 새로고침 기능
   - 새로고침 버튼
   - 새로고침 중 표시

5. ✅ 스타일링
   - CSS Modules 스타일
   - 375px 고정 기준
   - 디자인 토큰 활용

### Phase 4: Validation (완료)

**목표**: 입력 검증 로직 구현

**작업 내용**:
1. ✅ 기존 검증 유틸리티 재사용
   - `isValidPhoneNumber()`: 전화번호 형식 검증
   - `isValidEmail()`: 이메일 형식 검증

2. ✅ 클라이언트 측 검증
   - 입력 필드 실시간 검증
   - 오류 메시지 표시

---

## State Management

### Server State (React Query)

**Query Keys**:
- `['friends', 'list', limit, offset]`: 친구 목록 조회

**Cache Strategy**:
- `staleTime`: 1분 (1분간 캐시 유지)
- `gcTime`: 5분 (5분간 가비지 컬렉션 방지)
- `refetchOnWindowFocus`: false (창 포커스 시 자동 재조회 안 함)

**Mutation Strategy**:
- 성공 시 관련 쿼리 무효화 (`invalidateQueries`)
- 낙관적 업데이트 없음 (서버 응답 후 갱신)

### Client State (useState)

**로컬 상태**:
- `addType`: 친구 추가 타입 ('phone' | 'email')
- `phoneNumber`: 전화번호 입력값
- `email`: 이메일 입력값
- `addError`: 친구 추가 오류 메시지
- `showAddForm`: 친구 추가 폼 표시 여부

---

## Error Handling Strategy

### API Error Handling

**에러 타입**:
```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}
```

**에러 처리 전략**:
1. **401 Unauthorized**: api-client에서 자동 처리 (로그인 페이지로 리다이렉트)
2. **404 Not Found**: 사용자에게 명확한 메시지 표시
3. **409 Conflict**: "이미 친구 관계입니다" 메시지 표시
4. **네트워크 오류**: 재시도 옵션 제공

### UI Error Handling

**오류 표시 방식**:
- 친구 목록 조회 오류: 오류 메시지 + 재시도 버튼
- 친구 추가 오류: 입력 필드 하단에 오류 메시지 표시
- 친구 삭제 오류: alert로 오류 메시지 표시

---

## Performance Optimization

### React Query Optimization

1. **캐싱 전략**
   - 친구 목록은 1분간 캐시 유지
   - 동일한 파라미터로 재조회 시 캐시 사용

2. **재시도 전략**
   - 4xx 클라이언트 오류는 재시도 안 함
   - 5xx 서버 오류는 최대 1회 재시도
   - 네트워크 오류는 최대 1회 재시도

3. **자동 갱신**
   - Mutation 성공 시 관련 쿼리 자동 무효화
   - 수동 새로고침 버튼 제공

### Component Optimization

1. **렌더링 최적화**
   - 조건부 렌더링으로 불필요한 렌더링 방지
   - 로딩/오류 상태 분리

2. **이미지 최적화**
   - Next.js Image 컴포넌트 사용
   - 프로필 이미지 lazy loading

---

## Testing Strategy

### E2E Tests (Playwright)

**테스트 시나리오**:
1. 친구 목록 조회 테스트
2. 친구 추가 테스트 (전화번호)
3. 친구 추가 테스트 (이메일)
4. 친구 삭제 테스트
5. 새로고침 테스트
6. 오류 처리 테스트

### UI Tests (Playwright)

**테스트 항목**:
1. 컴포넌트 렌더링 테스트
2. 로딩 상태 표시 테스트
3. 오류 상태 표시 테스트
4. 빈 상태 표시 테스트
5. 친구 추가 폼 상호작용 테스트
6. 친구 삭제 확인 다이얼로그 테스트

---

## Security Considerations

1. **인증**
   - 모든 API 요청은 인증 토큰 필요
   - api-client에서 자동으로 토큰 포함

2. **입력 검증**
   - 클라이언트 측 검증 (UX 개선)
   - 서버 측 검증 (보안)

3. **권한 검증**
   - 친구 삭제는 본인만 가능
   - 서버에서 권한 검증

---

## Accessibility

1. **키보드 접근성**
   - 모든 버튼은 키보드로 접근 가능
   - Tab 순서 명확

2. **스크린 리더**
   - 적절한 aria-label 제공
   - 오류 메시지에 role="alert" 사용

3. **시각적 피드백**
   - 로딩 상태 명확히 표시
   - 오류 상태 명확히 표시

---

## Next Steps

1. ✅ API 함수 및 타입 정의 완료
2. ✅ React Query 훅 구현 완료
3. ✅ UI 컴포넌트 구현 완료
4. ⏳ E2E 테스트 작성 (다음 단계)
5. ⏳ UI 테스트 작성 (다음 단계)
6. ⏳ 사용자 승인 및 피드백 반영

---

## Dependencies

### Existing Dependencies
- `@tanstack/react-query` (v5.90.20): 서버 상태 관리
- `axios` (v1.13.4): HTTP 클라이언트
- `next` (v16.1.4): 프레임워크
- `react` (v19.2.3): UI 라이브러리

### No New Dependencies Required
- 기존 검증 유틸리티 재사용
- 기존 API 클라이언트 재사용
- 기존 스타일링 시스템 재사용

---

## Notes

1. **카카오톡 친구 자동 연동**: 서버 측에서 처리되므로 프론트엔드에서는 별도 구현 불필요
2. **페이지네이션**: 현재는 기본값(limit: 20, offset: 0)만 사용, 추후 무한 스크롤 구현 가능
3. **친구 추가 폼**: 전화번호/이메일 중 하나만 입력 가능하도록 UI 제한
4. **성능**: 친구 목록이 많아질 경우 가상화(virtualization) 고려 가능
