/**
 * @fileoverview 대기실 API 타입 정의
 * @description 타임캡슐 대기실 조회 관련 타입
 *
 * @note 백엔드 API 문서 기준
 * - 설정값 조회: GET /api/capsules/step-rooms/:capsuleId/settings
 * - 상세 조회: GET /api/capsules/step-rooms/:capsuleId
 */

/**
 * 대기실 설정값 API 응답 타입 (백엔드 snake_case)
 *
 * 응답 예시: { room_id, capsule_name, open_date, max_participants, max_images_per_person, has_music, has_video, invite_code }
 */
export interface WaitingRoomSettingsApiResponse {
  room_id: string;
  capsule_name: string;
  open_date: string;
  max_participants: number;
  max_images_per_person?: number;
  has_music?: boolean;
  has_video?: boolean;
  invite_code?: string;
}

/**
 * 대기실 설정값 응답 타입 (프론트엔드 camelCase)
 */
export interface WaitingRoomSettingsResponse {
  /** 대기실 ID */
  roomId: string;
  /** 캡슐명 */
  capsuleName: string;
  /** 오픈 예정일 (ISO 8601 형식) */
  openDate: string;
  /** 참여 인원수 (최대) */
  maxHeadcount: number;
  /** 1인당 최대 이미지 수 */
  maxImagesPerPerson?: number;
  /** 음악 포함 여부 */
  hasMusic?: boolean;
  /** 비디오 포함 여부 */
  hasVideo?: boolean;
  /** 초대 코드 (6자리 영숫자) */
  inviteCode?: string;
}

/**
 * 참여 슬롯 API 응답 타입 (백엔드 snake_case)
 *
 * 슬롯 예시: { slot_number: 1, user_id, is_host: true, status: "ACCEPTED", nickname: "홍길동" }
 */
export interface SlotApiResponse {
  slot_number: number;
  user_id: string | null;
  is_host: boolean;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  nickname: string | null;
  avatar_url?: string | null;
  /** 참여자 컨텐츠 작성 여부 (백엔드/앱 스펙: has_content) */
  has_content?: boolean;
}

/**
 * 참여자 타입 (프론트엔드 camelCase)
 */
export interface Participant {
  /** 참여자 ID (슬롯 번호 기반) */
  participantId: string;
  /** 사용자 ID */
  userId: string;
  /** 사용자 이름 (닉네임) */
  userName?: string;
  /** 사용자 프로필 이미지 URL */
  userAvatarUrl?: string;
  /** 슬롯 번호 */
  slotNumber: number;
  /** 참여자 역할 */
  role: 'HOST' | 'PARTICIPANT';
  /** 슬롯 상태 */
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  /** 컨텐츠 작성 여부 (앱 StepRoom 기준 표시용) */
  hasContent?: boolean;
}

/**
 * 대기실 상세 정보 API 응답 타입 (백엔드 snake_case)
 *
 * 응답 예시: { room_id, capsule_name, open_date, deadline, status, slots: [...] }
 */
export interface WaitingRoomDetailApiResponse {
  room_id: string;
  capsule_name: string;
  open_date: string;
  deadline?: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  slots?: SlotApiResponse[];
  invite_code?: string;
}

/**
 * 대기실 상세 정보 응답 타입 (프론트엔드 camelCase)
 */
export interface WaitingRoomDetailResponse {
  /** 대기실 ID */
  waitingRoomId: string;
  /** 캡슐명 */
  capsuleName: string;
  /** 오픈 예정일 (ISO 8601 형식) */
  openDate: string;
  /** 마감일 (ISO 8601 형식) */
  deadline?: string;
  /** 대기실 상태 */
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  /** 현재 참여 인원수 */
  currentHeadcount: number;
  /** 최대 참여 인원수 (설정값에서 가져옴) */
  maxHeadcount: number;
  /** 참여자 목록 */
  participants: Participant[];
  /** 초대 코드 (6자리 영숫자) */
  inviteCode?: string;
}

/**
 * 개인 컨텐츠 API 응답 타입 (백엔드 snake_case)
 *
 * 응답 예시: { text, images, music, video, created_at, updated_at }
 */
export interface MyContentApiResponse {
  // GET /my-content 응답 스펙(문서 기준) + 레거시 호환
  slot_id?: string;
  user_id?: string;
  // 문서 예시에선 {}로 표시되지만 실제로는 string이어야 함
  text_message?: unknown;
  // 레거시 호환 (일부 환경에서 text로 내려오는 경우)
  text?: unknown;
  status?: string;
  // 문서: images: [{ media_id, url, order }]
  images?: Array<{ media_id: string; url: string; order: number }> | string[];
  // 문서: music/video: { media_id, url, order }
  music?: { media_id: string; url: string; order: number } | string;
  video?: { media_id: string; url: string; order: number } | string;
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
 * 스텝룸 콘텐츠 저장(재저장) API 응답 data (백엔드 snake_case)
 *
 * 문서 예시:
 * { user_id, nickname, status, saved_at, uploaded_images, uploaded_music, uploaded_video }
 */
export interface MyContentSaveApiData {
  user_id: string;
  nickname: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  saved_at: string;
  uploaded_images: number;
  uploaded_music: boolean;
  uploaded_video: boolean;
}

/**
 * 스텝룸 콘텐츠 저장(재저장) API 응답 data (프론트 camelCase)
 */
export interface MyContentSaveResponse {
  userId: string;
  nickname: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  savedAt: string;
  uploadedImages: number;
  uploadedMusic: boolean;
  uploadedVideo: boolean;
}

/**
 * 스텝룸 콘텐츠 부분 수정(PATCH) API 응답 data (백엔드 snake_case)
 *
 * 문서 예시:
 * { user_id, nickname, status, updated_at, uploaded_images, uploaded_music, uploaded_video }
 */
export interface MyContentUpdateApiData {
  user_id: string;
  nickname: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  updated_at: string;
  uploaded_images: number;
  uploaded_music: boolean;
  uploaded_video: boolean;
}

/**
 * 스텝룸 콘텐츠 부분 수정(PATCH) API 응답 data (프론트 camelCase)
 */
export interface MyContentUpdateResponse {
  userId: string;
  nickname: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string;
  updatedAt: string;
  uploadedImages: number;
  uploadedMusic: boolean;
  uploadedVideo: boolean;
}

/**
 * 컨텐츠 저장 요청 타입
 */
export interface SaveContentRequest {
  /** 텍스트 내용 */
  text?: string;
  /** 초대 코드 (선택) */
  inviteCode?: string;
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
  /** 유지할 기존 이미지 URL 배열 (전달 시 해당 URL만 유지) */
  existingImageUrls?: string[];
  /** 음악 파일 */
  music?: File;
  /** 영상 파일 */
  video?: File;
}

/**
 * 방 생성 요청 타입 (서버 스펙 준수)
 *
 * POST /api/capsules/step-rooms/create
 */
export interface CreateRoomRequest {
  /** 주문 ID */
  order_id: string;
}

/**
 * 방 생성 응답 타입 (서버 스펙 준수)
 *
 * {
 *   "capsule_id": "UUID-OF-CAPSULE",
 *   "created_at": "2025-01-01T10:00:00Z",
 *   "current_participants": 1,
 *   "deadline": "2025-01-02T10:00:00Z",
 *   "invite_code": "ABC123",
 *   "max_participants": 4,
 *   "open_date": "2025-06-10T00:00:00Z",
 *   "status": "WAITING",
 *   "title": "우리의 첫 타임캡슐",
 *   "capsule_title": "우리의 첫 타임캡슐",
 *   "deep_link": "timeegg://room/join?invite_code=ABC123"
 * }
 */
export interface CreateRoomResponse {
  capsule_id: string;
  created_at: string;
  current_participants: number;
  deadline: string;
  invite_code: string;
  max_participants: number;
  open_date: string;
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED';
  title: string;
  capsule_title?: string;
  deep_link?: string;
}

/**
 * 초대 코드로 방 조회 요청 타입
 *
 * GET /api/capsules/step-rooms/by-code?invite_code={code}
 */
export interface InviteCodeQueryRequest {
  /** 초대 코드 (6자리 영숫자) */
  invite_code: string;
}

/**
 * 초대 코드로 방 조회 응답 타입 (서버 스펙 준수)
 *
 * {
 *   "room_id": "UUID-OF-CAPSULE",
 *   "capsule_name": "우리의 첫 타임캡슐",
 *   "open_date": "2025-06-10T00:00:00Z",
 *   "deadline": "2025-01-02T10:00:00Z",
 *   "participant_count": 4,
 *   "current_participants": 2,
 *   "status": "WAITING",
 *   "is_joinable": true
 * }
 */
export interface InviteCodeQueryResponse {
  room_id: string;
  capsule_name: string;
  open_date: string;
  deadline: string;
  participant_count: number;
  current_participants: number;
  status: 'WAITING' | 'COMPLETED' | 'EXPIRED';
  is_joinable: boolean;
}

/**
 * 방 참여 요청 타입 (서버 스펙 준수)
 *
 * POST /api/capsules/step-rooms/{capsuleId}/join
 */
export interface JoinRoomRequest {
  invite_code: string;
}

/**
 * 방 참여 응답 타입 (서버 스펙 준수)
 *
 * {
 *   "success": true,
 *   "room_id": "UUID-OF-CAPSULE",
 *   "slot_number": 3,
 *   "nickname": "친구닉네임",
 *   "joined_at": "2025-01-01T11:00:00Z"
 * }
 */
export interface JoinRoomResponse {
  success: boolean;
  room_id: string;
  slot_number: number;
  nickname: string;
  joined_at: string;
}

/**
 * 409 ALREADY_JOINED 응답 타입 (서버 스펙 준수)
 *
 * {
 *   "error": "ALREADY_JOINED",
 *   "data": {
 *     "slot_number": 2
 *   }
 * }
 */
export interface AlreadyJoinedResponse {
  error: 'ALREADY_JOINED';
  data: {
    slot_number: number;
  };
}
