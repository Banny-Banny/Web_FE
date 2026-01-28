/**
 * @fileoverview 캡슐 API 타입 정의
 * @description 타임캡슐 대기실 생성 등 캡슐 관련 타입
 *
 * @note 백엔드 API 문서 기준 (snake_case 사용)
 * POST /api/capsules/step-rooms/create
 * Request: { order_id: string }
 * Response: { room_id, capsule_name, open_date, max_participants, ... }
 */

/**
 * 타임캡슐 대기실 생성 요청 타입 (백엔드 snake_case)
 */
export interface CreateWaitingRoomRequest {
  /** 주문 ID */
  order_id: string;
}

/**
 * 타임캡슐 대기실 생성 응답 타입 (백엔드 snake_case)
 */
export interface CreateWaitingRoomResponse {
  /** 대기실 ID */
  room_id: string;
  /** 주문 ID */
  order_id?: string;
  /** 캡슐명 */
  capsule_name?: string;
  /** 참여 인원수 */
  max_participants?: number;
  /** 초대 코드 */
  invite_code?: string;
  /** 생성 일시 */
  created_at?: string;
}
