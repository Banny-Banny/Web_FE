/**
 * @fileoverview 캡슐 API 타입 정의
 * @description 타임캡슐 대기실 생성 등 캡슐 관련 타입
 */

/**
 * 타임캡슐 대기실 생성 요청 타입
 */
export interface CreateWaitingRoomRequest {
  /** 주문 ID */
  orderId: string;
}

/**
 * 타임캡슐 대기실 생성 응답 타입
 */
export interface CreateWaitingRoomResponse {
  /** 대기실 ID */
  waitingRoomId: string;
  /** 주문 ID */
  orderId: string;
  /** 캡슐명 */
  capsuleName: string;
  /** 참여 인원수 */
  headcount: number;
  /** 초대 코드 */
  inviteCode: string;
  /** 생성 일시 */
  createdAt: string;
}
