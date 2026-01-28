/**
 * @fileoverview 대기실 API 타입 정의
 * @description 타임캡슐 대기실 조회 관련 타입
 */

/**
 * 대기실 설정값 응답 타입
 */
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

/**
 * 참여자 타입
 */
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

/**
 * 대기실 상세 정보 응답 타입
 */
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
