# 타임캡슐 대기실 진입 기술 구현 계획

**Branch**: `feat/timecapsule-waiting-room` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: 타임캡슐 대기실 진입 및 참여 기능 명세서 (`specs/007-timecapsule-waiting-room/spec.md`)

## Summary

결제가 완료된 사용자(방장)가 타임캡슐 대기실에 진입하고, 캡슐 설정에서 설정한 정보를 불러와 표시하는 기능을 구현합니다. 대기실 페이지에서는 방장이 캡슐 설정 정보(캡슐명, 참여 인원수, 오픈 예정일, 캡슐 테마/디자인)를 확인하고, 참여자 목록을 조회할 수 있습니다.

**주요 목표**:
- 결제 완료 후 대기실 자동 생성 (결제 콜백에서 처리)
- 방장의 대기실 페이지 진입 및 정보 표시
- 캡슐 설정에서 설정한 정보 조회 및 표시
- 대기실 상세 정보 조회 (참여자 목록, 대기실 상태 등)

**기술적 접근**:
- React 19 + TypeScript 기반 컴포넌트 구현
- React Query를 활용한 서버 상태 관리
- CSS Module + Tailwind CSS를 활용한 스타일링
- Figma MCP 서버를 통한 디자인 토큰 및 에셋 추출
- 375px 모바일 고정 레이아웃 기준

---

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.3, Next.js 16.1.4  
**Primary Dependencies**: 
- `@tanstack/react-query` (v5.90.20) - 서버 상태 관리
- `axios` (v1.13.2) - HTTP 클라이언트
- `next` (v16.1.4) - 프레임워크
- `react` (v19.2.3) - UI 라이브러리

**Storage**: 서버 상태는 React Query 캐시에 저장, 클라이언트 상태는 React State  
**Testing**: Playwright (E2E 테스트)  
**Target Platform**: 모바일 웹 (375px 고정 레이아웃)  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: 
- 대기실 페이지 로드 시간 2초 이하
- 대기실 정보 조회 응답 시간 2초 이하
- 대기실 설정값 조회 응답 시간 2초 이하
- 참여자 목록 조회 응답 시간 2초 이하

**Constraints**: 
- 375px 모바일 고정 레이아웃 (반응형 미지원)
- 모든 API 요청에 인증 토큰 포함 (`Authorization: Bearer {token}`)
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용
- 결제 완료 후 대기실 생성은 결제 콜백 기능에서 처리됨

**Scale/Scope**: 
- 대기실 페이지 (`/waiting-room/[capsuleId]`)
- 대기실 정보 조회 및 표시
- 캡슐 설정 정보 조회 및 표시
- 참여자 목록 조회 및 표시

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **아키텍처 준수**: Feature Slice Architecture 준수, `app/` 디렉토리는 라우팅 전용  
✅ **디렉토리 구조**: 페이지 컴포넌트는 `src/components/WaitingRoom/`, 라우팅은 `src/app/`  
✅ **타입 안전성**: TypeScript로 모든 컴포넌트 및 타입 정의  
✅ **디자인 시스템**: Figma MCP를 통한 디자인 토큰 추출 및 `src/commons/styles` 활용  
✅ **상태 관리**: React Query (서버 상태) + React State (클라이언트 상태)  
✅ **API 통신**: Axios 인터셉터를 통한 토큰 자동 첨부  
✅ **성능**: 페이지 로드 최적화, API 호출 최적화

---

## Project Structure

### Documentation (this feature)

```text
specs/007-timecapsule-waiting-room/
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
│               └── page.tsx              # 대기실 페이지 라우팅
├── components/
│   └── WaitingRoom/                      # 대기실 페이지 컴포넌트
│       ├── index.tsx                     # 메인 컨테이너 컴포넌트
│       ├── types.ts                      # 타입 정의
│       ├── styles.module.css              # 스타일 (CSS Module)
│       ├── hooks/                         # 페이지별 비즈니스 로직
│       │   └── useWaitingRoom.ts          # 대기실 정보 조회 훅
│       └── components/                    # UI 컴포넌트
│           ├── WaitingRoomInfo/           # 대기실 정보 표시 컴포넌트
│           │   ├── index.tsx
│           │   ├── types.ts
│           │   └── styles.module.css
│           └── ParticipantList/           # 참여자 목록 컴포넌트
│               ├── index.tsx
│               ├── types.ts
│               └── styles.module.css
└── commons/
    ├── apis/
    │   └── capsules/
    │       ├── step-rooms/                # 대기실 API 함수 (신규 추가)
    │       │   ├── index.ts               # 대기실 API 함수
    │       │   ├── types.ts               # 대기실 타입 정의
    │       │   └── hooks/                 # React Query 훅 (신규 추가)
    │       │       ├── useWaitingRoom.ts  # 대기실 상세 조회 훅
    │       │       ├── useWaitingRoomSettings.ts  # 대기실 설정값 조회 훅
    │       │       └── useParticipants.ts # 참여자 목록 조회 훅
    └── utils/
        └── waiting-room.ts                # 대기실 관련 유틸리티 함수 (신규 추가)
```

---

## 데이터 모델링

### API 타입 (신규 추가)

```typescript
// src/commons/apis/capsules/step-rooms/types.ts (신규 추가)
export interface WaitingRoomSettingsResponse {
  /** 캡슐명 */
  capsuleName: string;
  /** 참여 인원수 (최대) */
  maxHeadcount: number;
  /** 오픈 예정일 (ISO 8601 형식) */
  openDate: string;
  /** 캡슐 테마/디자인 정보 */
  theme?: string;
  /** 캡슐 디자인 정보 */
  design?: string;
}

export interface Participant {
  /** 참여자 ID */
  participantId: string;
  /** 사용자 ID */
  userId: string;
  /** 사용자 이름 */
  userName?: string;
  /** 사용자 프로필 이미지 URL */
  userAvatarUrl?: string;
  /** 슬롯 번호 */
  slotNumber: number;
  /** 참여 일시 (ISO 8601 형식) */
  joinedAt: string;
  /** 참여자 역할 */
  role: 'HOST' | 'PARTICIPANT';
}

export interface WaitingRoomDetailResponse {
  /** 대기실 ID */
  waitingRoomId: string;
  /** 주문 ID */
  orderId: string;
  /** 캡슐명 */
  capsuleName: string;
  /** 현재 참여 인원수 */
  currentHeadcount: number;
  /** 최대 참여 인원수 */
  maxHeadcount: number;
  /** 오픈 예정일 (ISO 8601 형식) */
  openDate: string;
  /** 캡슐 테마/디자인 정보 */
  theme?: string;
  /** 캡슐 디자인 정보 */
  design?: string;
  /** 생성 일시 (ISO 8601 형식) */
  createdAt: string;
  /** 대기실 상태 */
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  /** 참여자 목록 */
  participants: Participant[];
}
```

### 대기실 페이지 컴포넌트 타입

```typescript
// src/components/WaitingRoom/types.ts
export interface WaitingRoomPageProps {
  params: {
    capsuleId: string;
  };
}

export interface WaitingRoomState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  waitingRoomId?: string;
}

export interface WaitingRoomInfoProps {
  /** 대기실 상세 정보 */
  waitingRoom: WaitingRoomDetailResponse;
  /** 대기실 설정값 */
  settings: WaitingRoomSettingsResponse;
}

export interface ParticipantListProps {
  /** 참여자 목록 */
  participants: Participant[];
  /** 현재 참여 인원수 */
  currentHeadcount: number;
  /** 최대 참여 인원수 */
  maxHeadcount: number;
}
```

---

## API 설계

### 신규 API 추가

**대기실 설정값 조회** (`GET /api/capsules/step-rooms/{capsuleId}/settings`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.WAITING_ROOM_SETTINGS(capsuleId)` (신규 추가)
- **함수**: `getWaitingRoomSettings(capsuleId: string)` (신규 추가)
- **응답**: `WaitingRoomSettingsResponse` (캡슐명, 참여 인원수, 오픈 예정일, 캡슐 테마/디자인)
- **용도**: 캡슐 설정에서 설정한 정보 조회
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 대기실 존재 여부 확인
  - 사용자가 대기실에 접근 권한이 있는지 확인 (방장 또는 참여자)

**대기실 상세 조회** (`GET /api/capsules/step-rooms/{capsuleId}`)
- **엔드포인트**: `CAPSULE_ENDPOINTS.WAITING_ROOM_DETAIL(capsuleId)` (신규 추가)
- **함수**: `getWaitingRoomDetail(capsuleId: string)` (신규 추가)
- **응답**: `WaitingRoomDetailResponse` (대기실 정보, 참여자 목록 포함)
- **용도**: 대기실 상세 정보 및 참여자 목록 조회
- **인증**: JWT Bearer 토큰 필수
- **검증**: 
  - 대기실 존재 여부 확인
  - 사용자가 대기실에 접근 권한이 있는지 확인 (방장 또는 참여자)

### API 엔드포인트 추가

```typescript
// src/commons/apis/endpoints.ts에 추가
export const CAPSULE_ENDPOINTS = {
  // 기존
  CREATE_WAITING_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
  // 신규 추가
  WAITING_ROOM_SETTINGS: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/settings`,
  WAITING_ROOM_DETAIL: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}`,
} as const;
```

---

## 컴포넌트 설계

### 1. WaitingRoom (대기실 페이지)

**역할**: 대기실 정보 조회 및 표시, 참여자 목록 표시

**책임**:
- URL 파라미터에서 대기실 ID 추출
- 대기실 상세 정보 조회
- 대기실 설정값 조회
- 대기실 정보 표시
- 참여자 목록 표시
- 로딩 상태 표시
- 오류 처리 및 사용자 안내

**구조**:
```tsx
<WaitingRoom>
  <TimeCapsuleHeader title="캡슐 대기실" onBack={handleBack} />
  {status === 'loading' && <Spinner fullScreen={true} />}
  {status === 'error' && <ErrorMessage error={error} />}
  {status === 'success' && (
    <>
      <WaitingRoomInfo 
        waitingRoom={waitingRoom} 
        settings={settings} 
      />
      <ParticipantList 
        participants={participants}
        currentHeadcount={currentHeadcount}
        maxHeadcount={maxHeadcount}
      />
    </>
  )}
</WaitingRoom>
```

### 2. WaitingRoomInfo (대기실 정보 표시)

**역할**: 대기실 정보 및 캡슐 설정 정보 표시

**책임**:
- 캡슐명 표시
- 참여 인원수 표시 (현재/최대)
- 오픈 예정일 표시
- 캡슐 테마/디자인 정보 표시
- 대기실 상태 표시

**구조**:
```tsx
<WaitingRoomInfo waitingRoom={waitingRoom} settings={settings}>
  <CapsuleName>{capsuleName}</CapsuleName>
  <HeadcountInfo current={currentHeadcount} max={maxHeadcount} />
  <OpenDate>{openDate}</OpenDate>
  <ThemeInfo theme={theme} design={design} />
  <StatusBadge status={status} />
</WaitingRoomInfo>
```

### 3. ParticipantList (참여자 목록)

**역할**: 참여자 목록 표시

**책임**:
- 참여자 목록 표시
- 참여 인원수 표시 (현재/최대)
- 각 참여자 정보 표시 (이름, 프로필 이미지, 슬롯 번호, 역할)
- 참여자 목록이 비어있는 경우 안내 표시

**구조**:
```tsx
<ParticipantList participants={participants} currentHeadcount={currentHeadcount} maxHeadcount={maxHeadcount}>
  <HeadcountSummary current={currentHeadcount} max={maxHeadcount} />
  {participants.length === 0 ? (
    <EmptyState message="아직 참여자가 없습니다." />
  ) : (
    <ParticipantItems>
      {participants.map(participant => (
        <ParticipantItem key={participant.participantId} participant={participant} />
      ))}
    </ParticipantItems>
  )}
</ParticipantList>
```

---

## 상태 관리 전략

### 서버 상태 (React Query)

**대기실 상세 조회**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useWaitingRoom.ts
export function useWaitingRoom(capsuleId: string) {
  return useQuery({
    queryKey: ['waitingRoom', capsuleId],
    queryFn: () => getWaitingRoomDetail(capsuleId),
    enabled: !!capsuleId,
    staleTime: 30000, // 30초
    refetchInterval: 5000, // 5초마다 자동 갱신 (참여자 목록 업데이트)
  });
}
```

**대기실 설정값 조회**:
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useWaitingRoomSettings.ts
export function useWaitingRoomSettings(capsuleId: string) {
  return useQuery({
    queryKey: ['waitingRoomSettings', capsuleId],
    queryFn: () => getWaitingRoomSettings(capsuleId),
    enabled: !!capsuleId,
    staleTime: 60000, // 1분 (설정값은 자주 변경되지 않음)
  });
}
```

**참여자 목록 조회** (대기실 상세 조회에 포함되지만 별도 훅으로 분리 가능):
```typescript
// src/commons/apis/capsules/step-rooms/hooks/useParticipants.ts
export function useParticipants(capsuleId: string) {
  const { data: waitingRoom } = useWaitingRoom(capsuleId);
  return {
    participants: waitingRoom?.participants || [],
    currentHeadcount: waitingRoom?.currentHeadcount || 0,
    maxHeadcount: waitingRoom?.maxHeadcount || 0,
  };
}
```

### 클라이언트 상태 (React State)

**대기실 페이지 상태 관리**:
```typescript
// src/components/WaitingRoom/hooks/useWaitingRoom.ts
export function useWaitingRoom(capsuleId: string) {
  const [state, setState] = useState<WaitingRoomState>({
    status: 'idle',
  });

  const waitingRoomQuery = useWaitingRoomQuery(capsuleId);
  const settingsQuery = useWaitingRoomSettingsQuery(capsuleId);

  useEffect(() => {
    if (waitingRoomQuery.isLoading || settingsQuery.isLoading) {
      setState({ status: 'loading' });
    } else if (waitingRoomQuery.isError || settingsQuery.isError) {
      setState({ 
        status: 'error', 
        error: waitingRoomQuery.error?.message || settingsQuery.error?.message 
      });
    } else if (waitingRoomQuery.data && settingsQuery.data) {
      setState({ 
        status: 'success', 
        waitingRoomId: capsuleId 
      });
    }
  }, [waitingRoomQuery, settingsQuery, capsuleId]);

  return {
    state,
    waitingRoom: waitingRoomQuery.data,
    settings: settingsQuery.data,
    isLoading: waitingRoomQuery.isLoading || settingsQuery.isLoading,
    error: waitingRoomQuery.error || settingsQuery.error,
  };
}
```

---

## 개발 워크플로우

### Step 1: API 연결

**목적**: 대기실 조회 API 구현

**작업**:
1. `src/commons/apis/endpoints.ts`에 신규 엔드포인트 추가
   - `CAPSULE_ENDPOINTS.WAITING_ROOM_SETTINGS(capsuleId)`
   - `CAPSULE_ENDPOINTS.WAITING_ROOM_DETAIL(capsuleId)`
2. `src/commons/apis/capsules/step-rooms/types.ts` 생성
   - `WaitingRoomSettingsResponse`
   - `WaitingRoomDetailResponse`
   - `Participant`
3. `src/commons/apis/capsules/step-rooms/index.ts` 생성
   - `getWaitingRoomSettings(capsuleId: string)`
   - `getWaitingRoomDetail(capsuleId: string)`
4. `src/commons/apis/capsules/step-rooms/hooks/useWaitingRoom.ts` 생성
   - React Query query 훅 구현
5. `src/commons/apis/capsules/step-rooms/hooks/useWaitingRoomSettings.ts` 생성
   - React Query query 훅 구현
6. `src/commons/apis/capsules/step-rooms/hooks/useParticipants.ts` 생성
   - 참여자 목록 조회 훅 구현
7. API 호출 단위 테스트 작성

**결과물**: 완전히 작동하는 API 통신 레이어

### Step 2: E2E 테스트 작성 (Playwright)

**목적**: 전체 대기실 진입 및 정보 조회 플로우 검증

**작업**:
1. 대기실 진입 플로우 테스트
   - 대기실 ID 파라미터 추출 테스트
   - 대기실 상세 정보 조회 테스트
   - 대기실 설정값 조회 테스트
   - 대기실 정보 표시 테스트
2. 참여자 목록 조회 테스트
   - 참여자 목록 조회 테스트
   - 참여자 정보 표시 테스트
   - 참여자 목록 업데이트 테스트
3. 오류 처리 테스트
   - 대기실 조회 실패 처리 테스트
   - 대기실 설정값 조회 실패 처리 테스트
   - 네트워크 오류 처리 테스트
   - 권한 없는 사용자 접근 처리 테스트

**도구**: Playwright  
**결과물**: 자동화된 E2E 테스트 스위트

### Step 3: UI 구현 (375px 고정 기준)

**목적**: 모바일 전용 사용자 인터페이스 완성

**작업**:
1. Figma MCP를 사용하여 디자인 시안 확인
   - 대기실 페이지 디자인
   - 대기실 정보 표시 디자인
   - 참여자 목록 디자인
2. Mock 데이터 기반 UI 컴포넌트 구현
   - `WaitingRoom` 컴포넌트
     - 로딩 상태 표시
     - 에러 메시지 표시
     - 대기실 정보 및 참여자 목록 표시
   - `WaitingRoomInfo` 컴포넌트
     - 캡슐명 표시
     - 참여 인원수 표시
     - 오픈 예정일 표시
     - 캡슐 테마/디자인 정보 표시
   - `ParticipantList` 컴포넌트
     - 참여자 목록 표시
     - 참여 인원수 표시
     - 빈 상태 안내
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

**목적**: 실제 API와 UI 연결, 대기실 정보 조회 플로우 완성

**작업**:
1. `useWaitingRoom` 훅 구현
   - URL 파라미터에서 대기실 ID 추출
   - 대기실 상세 정보 조회
   - 대기실 설정값 조회
   - 오류 처리 및 재시도 로직
2. Mock 데이터를 실제 API 호출로 교체
3. React Query 훅과 UI 컴포넌트 연결
4. 로딩/에러 상태 처리
5. 참여자 목록 자동 갱신 설정

**결과물**: 완전히 작동하는 대기실 진입 및 정보 조회 기능

### Step 6: UI 테스트 (Playwright)

**목적**: 통합된 기능의 최종 검증

**작업**:
1. 기능별 UI 테스트 파일 작성
   - 대기실 페이지 렌더링 테스트
   - 대기실 정보 표시 테스트
   - 참여자 목록 표시 테스트
   - 로딩 상태 표시 테스트
   - 에러 메시지 표시 테스트
2. 375px 모바일 프레임 기준 테스트
3. 성능 및 접근성 검증

**결과물**: 프로덕션 준비 완료

---

## 에러 처리 전략

### 대기실 정보 조회 실패

**시나리오**: 대기실 정보 조회 API 호출이 실패

**에러 코드별 처리**:
- **404 STEP_ROOM_NOT_FOUND**: 대기실을 찾을 수 없음 → "대기실을 찾을 수 없습니다." 메시지 표시
- **401 UNAUTHORIZED**: 인증되지 않은 사용자 → 로그인 페이지로 이동
- **403 FORBIDDEN**: 권한 없는 사용자 → "대기실에 접근할 수 있는 권한이 없습니다." 메시지 표시

**일반 처리**:
- 명확한 에러 메시지를 표시 (에러 코드를 사용자 친화적인 메시지로 변환)
- 재시도 옵션 제공 (일시적 오류의 경우)
- 네트워크 오류의 경우 네트워크 연결 확인 안내

### 대기실 설정값 조회 실패

**시나리오**: 대기실 설정값 조회 API 호출이 실패

**처리**:
- 명확한 에러 메시지를 표시
- 재시도 옵션 제공
- 네트워크 오류의 경우 네트워크 연결 확인 안내
- 설정값 조회 실패 시에도 대기실 기본 정보는 표시 (graceful degradation)

### 인증 토큰 만료

**시나리오**: 대기실 진입 과정에서 인증 토큰이 만료

**처리**:
- 인증 토큰 만료 메시지를 표시
- 로그인 페이지로 이동할 수 있는 옵션 제공
- 인증 토큰 갱신 후 재시도 옵션 제공

### 권한 없는 사용자의 대기실 접근

**시나리오**: 인증되지 않은 사용자 또는 권한이 없는 사용자가 대기실에 접근

**처리**:
- 권한 없음 메시지를 표시
- 로그인 페이지로 이동할 수 있는 옵션 제공
- 적절한 접근 권한이 필요함을 안내

---

## 성능 최적화

### 페이지 로드 최적화

- 대기실 상세 정보와 설정값을 병렬로 조회하여 로딩 시간 단축
- React Query 캐싱 활용
- 불필요한 리렌더링 방지 (React.memo 활용)

### API 호출 최적화

- 대기실 상세 정보와 설정값을 병렬로 호출
- 참여자 목록은 대기실 상세 정보에 포함되어 별도 호출 불필요
- 에러 발생 시 적절한 재시도 로직
- React Query의 `staleTime`과 `refetchInterval` 설정으로 불필요한 요청 방지

### 상태 업데이트 최적화

- 로딩 상태를 명확하게 구분하여 사용자 경험 개선
- 참여자 목록은 5초마다 자동 갱신하여 실시간성 확보
- 불필요한 상태 업데이트 방지

---

## 테스트 전략

### E2E 테스트 (Playwright)

**테스트 시나리오**:
1. 대기실 진입 플로우
   - 대기실 ID 파라미터 추출
   - 대기실 상세 정보 조회
   - 대기실 설정값 조회
   - 대기실 정보 표시
2. 참여자 목록 조회
   - 참여자 목록 조회
   - 참여자 정보 표시
   - 참여자 목록 업데이트
3. 오류 처리
   - 대기실 조회 실패 처리
   - 대기실 설정값 조회 실패 처리
   - 네트워크 오류 처리
   - 권한 없는 사용자 접근 처리

**파일 위치**: `tests/e2e/waiting-room/waiting-room.spec.ts`

### UI 테스트 (Playwright)

**테스트 항목**:
- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- 시각적 검증 (스크린샷 비교)
- 로딩 상태 표시 테스트
- 에러 메시지 표시 테스트
- 참여자 목록 표시 테스트

**파일 위치**: `tests/e2e/waiting-room/waiting-room-ui.spec.ts`

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

- 모든 API 요청에 `Authorization: Bearer {token}` 헤더 자동 포함
- Axios 인터셉터를 통한 토큰 자동 첨부
- 개발 환경에서는 `NEXT_PUBLIC_DEV_TOKEN` 환경 변수 사용

### 대기실 정보 보안

- 대기실 정보가 인증된 사용자에게만 제공
- 방장 또는 참여자만 대기실에 접근 가능
- 참여자 정보가 적절하게 보호됨

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

### 대기실 관련 유틸리티

```typescript
// src/commons/utils/waiting-room.ts (신규 추가)
/**
 * 대기실 상태를 사용자 친화적인 텍스트로 변환
 * 
 * @param status - 대기실 상태 ('WAITING' | 'IN_PROGRESS' | 'COMPLETED')
 * @returns 사용자 친화적인 상태 텍스트
 */
export function getWaitingRoomStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    WAITING: '대기 중',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료됨',
  };
  
  return statusMap[status] || '알 수 없음';
}

/**
 * 날짜를 사용자 친화적인 형식으로 포맷팅
 * 
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: "2026년 1월 27일")
 */
export function formatOpenDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 참여자 역할을 사용자 친화적인 텍스트로 변환
 * 
 * @param role - 참여자 역할 ('HOST' | 'PARTICIPANT')
 * @returns 사용자 친화적인 역할 텍스트
 */
export function getParticipantRoleText(role: string): string {
  const roleMap: Record<string, string> = {
    HOST: '방장',
    PARTICIPANT: '참여자',
  };
  
  return roleMap[role] || '참여자';
}
```

---

## 다음 단계

1. `/speckit.tasks` 명령을 실행하여 구체적인 작업 목록 생성
2. 작업 목록에 따라 순차적으로 구현 진행
3. 각 단계별 테스트 작성 및 통과 확인
