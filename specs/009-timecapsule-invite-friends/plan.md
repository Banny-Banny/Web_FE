# 타임캡슐 대기실 초대/참여 기능 기술 구현 계획

**Branch**: `feat/timecapsule-invite-friends` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)  
**Input**: 타임캡슐 대기실 초대 및 참여 기능 명세서 (`specs/009-timecapsule-invite-friends/spec.md`)

## Summary

결제 완료 후 생성된 타임캡슐 대기실에 친구를 초대하고, 초대받은 사용자가 초대 코드로 대기실에 참여하는 기능을 구현합니다. 기존 React Native 앱에서 이미 구현되어 있는 서버 API 스펙과 요청/응답 구조를 **절대 변경하지 않고** 웹으로 마이그레이션합니다.

**주요 목표**:
- 결제 완료 후 대기실 생성 및 초대 코드 발급 정보 활용
- 호스트의 초대 링크 생성 및 공유 UI 제공
- 초대 링크(`/room/join?invite_code=CODE`) 진입 시 로그인 상태 분기 처리
- 초대 코드로 방 정보 조회 (Public API)
- 초대 코드로 방 참여 (슬롯 배정)
- 이미 참여한 사용자의 재진입 처리 (409 ALREADY_JOINED)
- 초대 코드 오류/만료/정원 초과 등 에러 상황 안내

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Query를 활용한 서버 상태 관리
- 로컬 스토리지를 활용한 비로그인 상태 초대 코드 임시 저장
- CSS Module + Tailwind CSS를 활용한 스타일링
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- 375px 모바일 고정 레이아웃 기준
- Public API 호출 시 인증 토큰 제외 처리

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: 
- `@tanstack/react-query` (v5.90.20) - 서버 상태 관리
- `axios` (v1.13.2) - HTTP 클라이언트
- `next` (v16.1.4) - 프레임워크
- `react` (v19.2.3) - UI 라이브러리

**Storage**: 서버 상태는 React Query 캐시에 저장, 클라이언트 상태는 React State, 비로그인 초대 코드는 로컬 스토리지  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 모바일 웹 (375px 고정 레이아웃)  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: 
- 초대 참여 페이지 최초 로딩 시간 2초 이하
- 방 정보 조회 응답 시간 2초 이하 (95% 이상)
- 참여 요청 처리 응답 시간 3초 이하 (95% 이상)

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 서버 API 스펙 절대 변경 금지 (URL, 메서드, 요청/응답 필드, 에러 코드 구조)
- 초대 코드 조회 API는 Public API (인증 토큰 불필요)
- 초대 코드는 6자리 영숫자, 대소문자 구분 없이 처리
- 409 ALREADY_JOINED 응답을 성공으로 간주하고 JoinRoomResponse로 변환
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용

**Scale/Scope**: 
- 초대 링크 생성/공유 페이지 (호스트용)
- 초대 참여 페이지 (`/room/join?invite_code=CODE`)
- 비로그인 상태 초대 코드 임시 저장 및 복귀 플로우
- 방 정보 조회 및 표시 UI
- 방 참여 처리 및 대기실 이동

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/RoomJoin/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query (서버 상태) + React State (클라이언트 상태) + 로컬 스토리지 (비로그인 초대 코드)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부 (Public API 제외)  
✅ **성능**: 페이지 로드 최적화, API 호출 최적화

---

## Project Structure

### Documentation (this feature)

```text
specs/009-timecapsule-invite-friends/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (기술 계획서)
└── tasks.md             # 작업 목록 (다음 단계에서 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (main)/
│       └── room/
│           └── join/
│               └── page.tsx              # 초대 참여 페이지 라우팅
├── components/
│   ├── RoomJoin/                          # 초대 참여 페이지 컴포넌트
│   │   ├── index.tsx                      # 메인 컨테이너 컴포넌트
│   │   ├── types.ts                      # 타입 정의
│   │   ├── styles.module.css             # 스타일 (CSS Module)
│   │   └── hooks/                         # 페이지별 비즈니스 로직
│   │       ├── useRoomJoin.ts            # 초대 참여 처리 훅
│   │       └── useInviteCodeStorage.ts   # 초대 코드 임시 저장 훅
│   └── TimecapsuleCreate/                 # 타임캡슐 생성 컴포넌트 (기존)
│       └── components/                    # 호스트용 초대 링크 공유 UI (확장)
│           └── InviteLinkShare/           # 초대 링크 공유 컴포넌트 (신규 추가)
│               ├── index.tsx
│               ├── types.ts
│               └── styles.module.css
└── commons/
    ├── apis/
    │   └── capsules/
    │       └── step-rooms/                # 대기실 API 함수 (기존 확장)
    │           ├── index.ts               # 대기실 API 함수 (기존 확장)
    │           ├── types.ts               # 대기실 타입 정의 (기존 확장)
    │           └── hooks/                 # React Query 훅 (기존 확장)
    │               ├── useCreateRoom.ts   # 방 생성 훅 (신규 추가)
    │               ├── useInviteCodeQuery.ts  # 초대 코드 조회 훅 (신규 추가)
    │               └── useJoinRoom.ts     # 방 참여 훅 (신규 추가)
    └── utils/
        └── invite.ts                      # 초대 관련 유틸리티 함수 (신규 추가)
```

---

## 데이터 모델링

### API 타입 (신규 추가)

```typescript
// src/commons/apis/capsules/step-rooms/types.ts (확장)

/**
 * 방 생성 요청 타입 (서버 스펙 준수)
 */
export interface CreateRoomRequest {
  /** 주문 ID */
  order_id: string;
}

/**
 * 방 생성 응답 타입 (서버 스펙 준수)
 */
export interface CreateRoomResponse {
  /** 캡슐 ID */
  capsule_id: string;
  /** 생성 일시 */
  created_at: string;
  /** 현재 참여자 수 */
  current_participants: number;
  /** 작성 마감시한 */
  deadline: string;
  /** 초대 코드 (6자리 영숫자) */
  invite_code: string;
  /** 최대 참여 인원 수 */
  max_participants: number;
  /** 개봉일 */
  open_date: string;
  /** 상태 */
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED';
  /** 대기실 제목 */
  title: string;
  /** 캡슐 제목 (optional) */
  capsule_title?: string;
  /** 딥링크 (optional) */
  deep_link?: string;
}

/**
 * 초대 코드로 방 조회 요청 타입
 */
export interface InviteCodeQueryRequest {
  /** 초대 코드 (6자리 영숫자) */
  invite_code: string;
}

/**
 * 초대 코드로 방 조회 응답 타입 (서버 스펙 준수)
 */
export interface InviteCodeQueryResponse {
  /** 방 ID (캡슐 ID) */
  room_id: string;
  /** 캡슐 이름 */
  capsule_name: string;
  /** 개봉일 */
  open_date: string;
  /** 작성 마감시한 */
  deadline: string;
  /** 최대 참여 인원 수 */
  participant_count: number;
  /** 현재 참여 인원 수 */
  current_participants: number;
  /** 상태 */
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED';
  /** 참여 가능 여부 */
  is_joinable: boolean;
}

/**
 * 방 참여 요청 타입 (서버 스펙 준수)
 */
export interface JoinRoomRequest {
  /** 초대 코드 */
  invite_code: string;
}

/**
 * 방 참여 응답 타입 (서버 스펙 준수)
 */
export interface JoinRoomResponse {
  /** 성공 여부 */
  success: boolean;
  /** 방 ID (캡슐 ID) */
  room_id: string;
  /** 슬롯 번호 */
  slot_number: number;
  /** 닉네임 */
  nickname: string;
  /** 참여 일시 */
  joined_at: string;
}

/**
 * 409 ALREADY_JOINED 응답 타입 (서버 스펙 준수)
 */
export interface AlreadyJoinedResponse {
  /** 에러 코드 */
  error: 'ALREADY_JOINED';
  /** 데이터 */
  data: {
    /** 슬롯 번호 */
    slot_number: number;
  };
}
```

### 컴포넌트 타입

```typescript
// src/components/RoomJoin/types.ts
export interface RoomJoinPageProps {
  // URL 쿼리 파라미터에서 초대 코드 추출
}

export interface RoomJoinState {
  status: 'idle' | 'loading' | 'loaded' | 'joining' | 'success' | 'failed';
  inviteCode?: string;
  roomInfo?: InviteCodeQueryResponse;
  error?: string;
}

// src/components/RoomJoin/hooks/useInviteCodeStorage.ts
export interface InviteCodeStorage {
  /** 초대 코드 저장 */
  saveInviteCode: (code: string) => void;
  /** 초대 코드 조회 */
  getInviteCode: () => string | null;
  /** 초대 코드 삭제 */
  clearInviteCode: () => void;
}

// src/components/TimecapsuleCreate/components/InviteLinkShare/types.ts
export interface InviteLinkShareProps {
  /** 초대 코드 */
  inviteCode: string;
  /** 대기실 ID */
  capsuleId: string;
}
```

---

## API 설계

### 신규 API 추가

**방 생성 + 초대 코드 발급** (`POST /api/capsules/step-rooms/create`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.CREATE_ROOM` (신규 추가)
- **함수**: `createRoom(data: CreateRoomRequest)` (신규 추가)
- **응답**: `CreateRoomResponse` (capsule_id, invite_code, deadline, max_participants, open_date, status, title 등)
- **용도**: 결제 완료 후 타임캡슐 대기실 생성 및 초대 코드 발급
- **인증**: JWT Bearer 토큰 필수
- **에러 케이스**:
  - 400: 잘못된 order_id 형식
  - 401: JWT 토큰 없음/유효하지 않음
  - 404: 존재하지 않는 order_id
  - 500: 서버 내부 오류

**초대 코드로 방 조회** (`GET /api/capsules/step-rooms/by-code?invite_code={code}`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.INVITE_CODE_QUERY(code)` (신규 추가)
- **함수**: `queryRoomByInviteCode(code: string)` (신규 추가)
- **응답**: `InviteCodeQueryResponse` (room_id, capsule_name, open_date, deadline, participant_count, current_participants, status, is_joinable)
- **용도**: 초대 코드로 방 정보 조회 (친구가 링크 열었을 때)
- **인증**: 불필요 (Public API)
- **에러 케이스**:
  - 400: 코드 형식 오류 → "유효하지 않은 초대 코드입니다."
  - 404: 존재하지 않는 초대 코드 → "존재하지 않는 초대 코드입니다."
  - 500: 서버 내부 오류

**방 참여** (`POST /api/capsules/step-rooms/{capsuleId}/join`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.JOIN_ROOM(capsuleId)` (신규 추가)
- **함수**: `joinRoom(capsuleId: string, data: JoinRoomRequest)` (신규 추가)
- **응답**: `JoinRoomResponse` (success, room_id, slot_number, nickname, joined_at)
- **용도**: 초대 코드로 방 참여 (슬롯 배정)
- **인증**: JWT Bearer 토큰 필수
- **특별 케이스**: 409 ALREADY_JOINED
  - 서버 응답: `{ error: "ALREADY_JOINED", data: { slot_number: number } }`
  - 클라이언트 처리: JoinRoomResponse로 변환하여 성공으로 간주
- **에러 케이스**:
  - 403:
    - INVALID_INVITE_CODE → "잘못된 초대 코드입니다."
    - DEADLINE_EXPIRED → "작성 마감시한이 지났습니다."
    - SLOTS_FULL → "정원이 초과되었습니다."
    - 기타 → "대기실에 참여할 수 없습니다."
  - 404: "대기실을 찾을 수 없습니다."
  - 409:
    - ALREADY_JOINED이지만 data.slot_number가 없는 경우 → "이미 참여 중입니다."
  - 기타: "API 호출 실패: {status || 'Network Error'}"

### API 엔드포인트 추가

```typescript
// src/commons/apis/endpoints.ts에 추가
export const CAPSULE_ENDPOINTS = {
  // 기존
  WAITING_ROOM_SETTINGS: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/settings`,
  WAITING_ROOM_DETAIL: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}`,
  // 신규 추가
  CREATE_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
  INVITE_CODE_QUERY: (code: string) => `${BASE_PATHS.API}/capsules/step-rooms/by-code?invite_code=${code}`,
  JOIN_ROOM: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/join`,
} as const;
```

### Public API 처리

초대 코드 조회 API는 Public API이므로 인증 토큰 없이 호출해야 합니다.

```typescript
// src/commons/apis/capsules/step-rooms/index.ts (확장)
import { apiClient } from '@/commons/provider/api-provider/api-client';

/**
 * 초대 코드로 방 정보 조회 API (Public API - 인증 불필요)
 */
export async function queryRoomByInviteCode(
  code: string
): Promise<InviteCodeQueryResponse> {
  // Public API이므로 별도의 클라이언트 인스턴스 사용 또는
  // 요청 시 Authorization 헤더 제거
  const response = await apiClient.get<InviteCodeQueryResponse>(
    CAPSULE_ENDPOINTS.INVITE_CODE_QUERY(code),
    {
      headers: {
        Authorization: undefined, // Public API이므로 토큰 제거
      },
    }
  );
  return response.data;
}
```

---

## 컴포넌트 설계

### 1. RoomJoin (초대 참여 페이지)

**역할**: 초대 링크로 진입한 사용자가 방 정보를 확인하고 참여하는 페이지

**책임**:
- URL 쿼리 파라미터에서 초대 코드 추출
- 로그인 상태 확인 및 분기 처리
- 비로그인 상태: 초대 코드를 로컬 스토리지에 저장하고 로그인/온보딩 페이지로 리다이렉트
- 로그인 상태: 초대 코드로 방 정보 조회 및 표시
- 방 정보 표시 (캡슐 이름, 개봉일, 마감일, 현재 인원/최대 인원, 상태)
- 참여 가능 여부 확인 및 "참여하기" 버튼 표시
- 방 참여 처리 및 대기실 페이지로 이동
- 409 ALREADY_JOINED 처리
- 오류 처리 및 사용자 안내

**구조**:
```tsx
<RoomJoin>
  {status === 'loading' && <LoadingState message="방 정보를 불러오는 중..." />}
  {status === 'loaded' && (
    <>
      <RoomInfo roomInfo={roomInfo} />
      {roomInfo.is_joinable ? (
        <JoinButton onClick={handleJoin} />
      ) : (
        <JoinDisabledMessage reason={getJoinDisabledReason(roomInfo)} />
      )}
    </>
  )}
  {status === 'joining' && <LoadingState message="참여 중..." />}
  {status === 'failed' && <ErrorMessage error={error} />}
</RoomJoin>
```

### 2. InviteLinkShare (초대 링크 공유 컴포넌트)

**역할**: 호스트가 초대 링크를 확인하고 공유할 수 있는 UI

**책임**:
- 초대 코드 표시
- 초대 링크 생성 (`https://{web-domain}/room/join?invite_code={code}`)
- 초대 링크 복사 기능
- 초대 링크 공유 기능 (카카오톡, 메신저 등)

**구조**:
```tsx
<InviteLinkShare inviteCode={inviteCode} capsuleId={capsuleId}>
  <InviteCodeDisplay code={inviteCode} />
  <InviteLinkDisplay link={inviteLink} />
  <CopyButton onClick={handleCopy} />
  <ShareButton onClick={handleShare} />
</InviteLinkShare>
```

---

## 상태 관리 전략

### 서버 상태 (React Query)

**방 생성**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useCreateRoom.ts
export function useCreateRoom() {
  return useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      // 방 생성 성공 처리
    },
    onError: (error) => {
      // 방 생성 실패 처리
    },
  });
}
```

**초대 코드로 방 조회**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useInviteCodeQuery.ts
export function useInviteCodeQuery(code: string | null) {
  return useQuery({
    queryKey: ['inviteCodeQuery', code],
    queryFn: () => queryRoomByInviteCode(code!),
    enabled: !!code,
    retry: false, // 404는 재시도 불필요
  });
}
```

**방 참여**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useJoinRoom.ts
export function useJoinRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ capsuleId, inviteCode }: { capsuleId: string; inviteCode: string }) =>
      joinRoom(capsuleId, { invite_code: inviteCode }),
    onSuccess: (data, variables) => {
      // 방 참여 성공 처리
      // 대기실 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['waitingRoom', variables.capsuleId] });
    },
    onError: (error) => {
      // 방 참여 실패 처리
      // 409 ALREADY_JOINED는 성공으로 처리
    },
  });
}
```

### 클라이언트 상태 (React State + 로컬 스토리지)

**초대 참여 페이지 상태 관리**:
```typescript
// src/components/RoomJoin/hooks/useRoomJoin.ts
export function useRoomJoin() {
  const [state, setState] = useState<RoomJoinState>({
    status: 'idle',
  });
  
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite_code');
  const { data: roomInfo, isLoading, error } = useInviteCodeQuery(inviteCode);
  const joinRoomMutation = useJoinRoom();
  const { saveInviteCode, getInviteCode, clearInviteCode } = useInviteCodeStorage();
  
  // 로그인 상태 확인
  const isAuthenticated = useAuth(); // 기존 인증 훅 사용
  
  useEffect(() => {
    if (!inviteCode) {
      setState({ status: 'failed', error: '초대 코드가 없습니다.' });
      return;
    }
    
    // 비로그인 상태 처리
    if (!isAuthenticated) {
      saveInviteCode(inviteCode);
      router.push('/onboarding'); // 또는 로그인 페이지
      return;
    }
    
    // 로그인 상태: 방 정보 조회
    if (isLoading) {
      setState({ status: 'loading' });
    } else if (error) {
      setState({ status: 'failed', error: getErrorMessage(error) });
    } else if (roomInfo) {
      setState({ status: 'loaded', inviteCode, roomInfo });
    }
  }, [inviteCode, isAuthenticated, isLoading, error, roomInfo]);
  
  const handleJoin = async () => {
    if (!inviteCode || !roomInfo) return;
    
    setState({ status: 'joining' });
    
    try {
      const result = await joinRoomMutation.mutateAsync({
        capsuleId: roomInfo.room_id,
        inviteCode,
      });
      
      // 성공 시 대기실 페이지로 이동
      router.push(`/waiting-room/${result.room_id}`);
      setState({ status: 'success' });
    } catch (error) {
      // 409 ALREADY_JOINED 처리
      if (isAlreadyJoinedError(error)) {
        const slotNumber = extractSlotNumber(error);
        router.push(`/waiting-room/${roomInfo.room_id}`);
        setState({ status: 'success' });
      } else {
        setState({ status: 'failed', error: getErrorMessage(error) });
      }
    }
  };
  
  return {
    state,
    handleJoin,
  };
}
```

**초대 코드 임시 저장**:
```typescript
// src/components/RoomJoin/hooks/useInviteCodeStorage.ts
const STORAGE_KEY = 'pending_invite_code';

export function useInviteCodeStorage(): InviteCodeStorage {
  const saveInviteCode = (code: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
  };
  
  const getInviteCode = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  };
  
  const clearInviteCode = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  
  return {
    saveInviteCode,
    getInviteCode,
    clearInviteCode,
  };
}
```

---

## 개발 워크플로우

### Step 1: API 연결

**목적**: 방 생성, 초대 코드 조회, 방 참여 API 구현

**작업**:
1. `src/commons/apis/endpoints.ts`에 신규 엔드포인트 추가
   - `CAPSULE_ENDPOINTS.CREATE_ROOM`
   - `CAPSULE_ENDPOINTS.INVITE_CODE_QUERY(code)`
   - `CAPSULE_ENDPOINTS.JOIN_ROOM(capsuleId)`
2. `src/commons/apis/capsules/step-rooms/types.ts` 확장
   - `CreateRoomRequest`
   - `CreateRoomResponse`
   - `InviteCodeQueryRequest`
   - `InviteCodeQueryResponse`
   - `JoinRoomRequest`
   - `JoinRoomResponse`
   - `AlreadyJoinedResponse`
3. `src/commons/apis/capsules/step-rooms/index.ts` 확장
   - `createRoom(data: CreateRoomRequest)`
   - `queryRoomByInviteCode(code: string)` (Public API 처리)
   - `joinRoom(capsuleId: string, data: JoinRoomRequest)`
   - `handleAlreadyJoinedError(error: any): JoinRoomResponse` (409 처리 함수)
4. `src/commons/apis/capsules/step-rooms/hooks/useCreateRoom.ts` 생성
   - React Query mutation 훅 구현
5. `src/commons/apis/capsules/step-rooms/hooks/useInviteCodeQuery.ts` 생성
   - React Query query 훅 구현 (Public API)
6. `src/commons/apis/capsules/step-rooms/hooks/useJoinRoom.ts` 생성
   - React Query mutation 훅 구현 (409 ALREADY_JOINED 처리 포함)
7. API 호출 단위 테스트 작성

**결과물**: 완전히 작동하는 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 초대/참여 플로우 검증

**작업**:
1. 방 생성 플로우 테스트
   - 결제 완료 후 방 생성 API 호출 테스트
   - 초대 코드 발급 테스트
   - 초대 링크 생성 테스트
2. 비로그인 초대 링크 진입 플로우 테스트
   - 초대 링크 클릭 테스트
   - 초대 코드 로컬 스토리지 저장 테스트
   - 로그인/온보딩 페이지 리다이렉트 테스트
   - 로그인 완료 후 초대 페이지 복귀 테스트
3. 로그인 초대 링크 진입 플로우 테스트
   - 초대 링크 클릭 테스트
   - 방 정보 조회 테스트
   - 방 정보 표시 테스트
   - 참여하기 버튼 클릭 테스트
   - 방 참여 성공 테스트
   - 대기실 페이지 이동 테스트
4. 이미 참여한 사용자 재진입 테스트
   - 초대 링크 재클릭 테스트
   - 409 ALREADY_JOINED 응답 처리 테스트
   - 대기실 페이지 이동 테스트
5. 에러 처리 테스트
   - 잘못된 초대 코드 테스트
   - 존재하지 않는 초대 코드 테스트
   - 만료된 초대 코드 테스트
   - 정원 초과 테스트
   - 마감시한 지난 테스트

**도구**: Playwright  
**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. Figma MCP를 사용하여 디자인 시안 확인
   - 초대 참여 페이지 디자인
   - 방 정보 표시 UI 디자인
   - 초대 링크 공유 UI 디자인
2. Mock 데이터 기반 UI 컴포넌트 구현
   - `RoomJoin` 컴포넌트
     - 초대 코드 입력/표시
     - 방 정보 표시 (캡슐 이름, 개봉일, 마감일, 인원 수, 상태)
     - 참여하기 버튼
     - 참여 불가 메시지
     - 에러 메시지 표시
   - `InviteLinkShare` 컴포넌트
     - 초대 코드 표시
     - 초대 링크 표시
     - 복사 버튼
     - 공유 버튼
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

**목적**: 실제 API와 UI 연결, 초대/참여 플로우 완성

**작업**:
1. `useRoomJoin` 훅 구현
   - URL 쿼리 파라미터에서 초대 코드 추출
   - 로그인 상태 확인 및 분기 처리
   - 방 정보 조회 및 표시
   - 방 참여 처리
   - 409 ALREADY_JOINED 처리
   - 오류 처리
2. `useInviteCodeStorage` 훅 구현
   - 로컬 스토리지 저장/조회/삭제
3. Mock 데이터를 실제 API 호출로 교체
4. React Query 훅과 UI 컴포넌트 연결
5. 로딩/에러 상태 처리
6. 비로그인 상태 초대 코드 임시 저장 및 복귀 플로우 구현

**결과물**: 완전히 작동하는 초대/참여 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
   - 초대 참여 페이지 렌더링 테스트
   - 방 정보 표시 테스트
   - 참여하기 버튼 상호작용 테스트
   - 에러 메시지 표시 테스트
   - 초대 링크 공유 UI 테스트
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 에러 처리 전략

### 초대 코드 형식 오류

**시나리오**: 6자리가 아니거나 영숫자가 아닌 문자가 포함된 코드

**처리**:
- "유효하지 않은 초대 코드입니다." 메시지 표시
- 사용자가 코드를 다시 입력하거나 홈으로 이동할 수 있는 선택지 제공

### 존재하지 않는 초대 코드

**시나리오**: 형식은 맞지만 실제로 존재하지 않는 초대 코드

**처리**:
- "존재하지 않는 초대 코드입니다." 메시지 표시
- 잘못 전달된 링크일 수 있다는 안내와 함께, 호스트에게 재요청하거나 홈으로 이동할 수 있는 안내 제공

### 참여 불가 상태

**시나리오**: 마감, 만료, 정원 초과 등으로 is_joinable이 false

**처리**:
- 상태에 따라 구체적인 메시지 표시:
  - 마감: "작성 마감시한이 지났습니다."
  - 정원 초과: "정원이 초과되었습니다."
  - 만료: "만료된 초대 코드입니다."
- 참여하기 버튼 비활성화 또는 숨김
- 다른 행동 선택지 제공 (홈으로 이동 등)

### 이미 참여한 사용자 (409 ALREADY_JOINED)

**시나리오**: 이미 해당 대기실에 참여한 사용자가 다시 초대 링크를 통해 참여 시도

**처리**:
- 에러 화면 대신, 성공으로 간주
- `data.slot_number`를 추출하여 `JoinRoomResponse` 형태로 변환
- 사용자를 자신의 대기실 화면으로 즉시 이동
- 에러 메시지 노출하지 않음

### 네트워크 오류

**시나리오**: API 호출 중 네트워크 연결 끊김

**처리**:
- 네트워크 오류 메시지 표시
- 재시도 옵션 제공
- 네트워크 연결 확인 안내

---

## 성능 최적화

### 페이지 로드 최적화

- 초대 코드 조회는 Public API이므로 빠르게 응답 가능
- React Query 캐싱 활용
- 불필요한 리렌더링 방지 (React.memo 활용)

### API 호출 최적화

- 초대 코드 조회는 Public API이므로 인증 토큰 없이 호출하여 오버헤드 감소
- 404 에러는 재시도 불필요 (retry: false)
- 중복 요청 방지

### 상태 업데이트 최적화

- 로딩 상태를 명확하게 구분하여 사용자 경험 개선
- 불필요한 상태 업데이트 방지

---

## 테스트 전략

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 방 생성 플로우
   - 결제 완료 후 방 생성
   - 초대 코드 발급
   - 초대 링크 생성
2. 비로그인 초대 링크 진입 플로우
   - 초대 링크 클릭
   - 초대 코드 저장
   - 로그인/온보딩 페이지 이동
   - 로그인 완료 후 초대 페이지 복귀
3. 로그인 초대 링크 진입 플로우
   - 초대 링크 클릭
   - 방 정보 조회
   - 방 정보 표시
   - 참여하기 버튼 클릭
   - 방 참여 성공
   - 대기실 페이지 이동
4. 이미 참여한 사용자 재진입
   - 초대 링크 재클릭
   - 409 ALREADY_JOINED 처리
   - 대기실 페이지 이동
5. 에러 처리
   - 잘못된 초대 코드
   - 존재하지 않는 초대 코드
   - 만료된 초대 코드
   - 정원 초과
   - 마감시한 지남

**파일 위치**: `tests/e2e/room/room-join.spec.ts`

### UI 테스트 (Playwright)

**테스트 항목**:
- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- 시각적 검증 (스크린샷 비교)
- 로딩 상태 표시 테스트
- 에러 메시지 표시 테스트

**파일 위치**: `tests/e2e/room/room-join-ui.spec.ts`

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

---

## 보안 고려사항

### 인증 토큰 관리

- 방 생성 및 참여 API는 인증 토큰 필수
- Axios 인터셉터를 통한 토큰 자동 첨부
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- Public API(초대 코드 조회)는 인증 토큰 제외

### 초대 코드 보안

- 초대 코드는 URL에 노출되지만 민감 정보(결제 정보 등)를 유추할 수 없음
- 초대 코드는 6자리 영숫자로 제한되어 있음
- 서버에서 초대 코드 유효성 검증 수행

---

## 의존성 관리

### 신규 패키지 설치

없음 (기존 패키지 활용)

### 기존 패키지 활용

- `@tanstack/react-query`: 서버 상태 관리
- `axios`: HTTP 클라이언트
- `next`: 프레임워크
- `react`: UI 라이브러리

---

## 유틸리티 함수

### 초대 관련 유틸리티

```typescript
// src/commons/utils/invite.ts (신규 추가)
/**
 * 초대 링크 생성
 * 
 * @param inviteCode - 초대 코드 (6자리 영숫자)
 * @returns 초대 링크 URL
 */
export function generateInviteLink(inviteCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://timeegg.com';
  return `${baseUrl}/room/join?invite_code=${inviteCode}`;
}

/**
 * URL에서 초대 코드 추출
 * 
 * @param url - URL 문자열 또는 URLSearchParams
 * @returns 초대 코드 또는 null
 */
export function extractInviteCodeFromUrl(
  url: string | URLSearchParams
): string | null {
  const searchParams = typeof url === 'string' 
    ? new URLSearchParams(new URL(url).search)
    : url;
  return searchParams.get('invite_code');
}

/**
 * 초대 코드 형식 검증
 * 
 * @param code - 초대 코드 문자열
 * @returns 유효한 형식인지 여부
 */
export function validateInviteCodeFormat(code: string): boolean {
  // 6자리 영숫자 정규식
  const pattern = /^[A-Za-z0-9]{6}$/;
  return pattern.test(code);
}

/**
 * 초대 코드 정규화 (대문자로 변환)
 * 
 * @param code - 초대 코드 문자열
 * @returns 정규화된 초대 코드 (대문자)
 */
export function normalizeInviteCode(code: string): string {
  return code.toUpperCase();
}

/**
 * 409 ALREADY_JOINED 에러인지 확인
 * 
 * @param error - 에러 객체
 * @returns ALREADY_JOINED 에러인지 여부
 */
export function isAlreadyJoinedError(error: any): boolean {
  return (
    error?.response?.status === 409 &&
    error?.response?.data?.error === 'ALREADY_JOINED'
  );
}

/**
 * 409 ALREADY_JOINED 응답에서 슬롯 번호 추출
 * 
 * @param error - 에러 객체
 * @returns 슬롯 번호 또는 null
 */
export function extractSlotNumberFromError(error: any): number | null {
  if (isAlreadyJoinedError(error)) {
    return error?.response?.data?.data?.slot_number ?? null;
  }
  return null;
}

/**
 * 409 ALREADY_JOINED 응답을 JoinRoomResponse로 변환
 * 
 * @param error - 에러 객체
 * @param roomId - 방 ID
 * @returns JoinRoomResponse
 */
export function convertAlreadyJoinedToJoinResponse(
  error: any,
  roomId: string
): JoinRoomResponse {
  const slotNumber = extractSlotNumberFromError(error);
  
  return {
    success: true,
    room_id: roomId,
    slot_number: slotNumber ?? 0,
    nickname: '',
    joined_at: new Date().toISOString(),
  };
}

/**
 * 에러 코드를 사용자 친화적인 메시지로 변환
 * 
 * @param error - 에러 객체
 * @returns 사용자 친화적인 메시지
 */
export function getInviteErrorMessage(error: any): string {
  if (error?.response?.status === 400) {
    return '유효하지 않은 초대 코드입니다.';
  }
  
  if (error?.response?.status === 404) {
    return '존재하지 않는 초대 코드입니다.';
  }
  
  if (error?.response?.status === 403) {
    const errorCode = error?.response?.data?.error;
    
    switch (errorCode) {
      case 'INVALID_INVITE_CODE':
        return '잘못된 초대 코드입니다.';
      case 'DEADLINE_EXPIRED':
        return '작성 마감시한이 지났습니다.';
      case 'SLOTS_FULL':
        return '정원이 초과되었습니다.';
      default:
        return '대기실에 참여할 수 없습니다.';
    }
  }
  
  if (error?.response?.status === 409) {
    return '이미 참여 중입니다.';
  }
  
  return `API 호출 실패: ${error?.response?.status || 'Network Error'}`;
}
```

---

## 다음 단계

1. `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록 생성
2. 작업 목록에 따라 순차적으로 구현 진행
3. 각 단계별 테스트 작성 및 통과 확인
