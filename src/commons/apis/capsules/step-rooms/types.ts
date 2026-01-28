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
 * 응답 예시: { room_id, capsule_name, open_date, max_participants, max_images_per_person, has_music, has_video }
 */
export interface WaitingRoomSettingsApiResponse {
  room_id: string;
  capsule_name: string;
  open_date: string;
  max_participants: number;
  max_images_per_person?: number;
  has_music?: boolean;
  has_video?: boolean;
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
}

/**
 * 참여 슬롯 API 응답 타입 (백엔드 snake_case)
 *
 * 슬롯 예시: { slot_number: 1, user_id, is_host: true, status: "ACCEPTED", nickname: "홍길동" }
 */
export interface SlotApiResponse {
  slot_number: number;
  user_id: string;
  is_host: boolean;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  nickname: string;
  avatar_url?: string;
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
}
