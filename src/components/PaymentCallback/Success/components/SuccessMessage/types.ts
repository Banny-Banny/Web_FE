/**
 * @fileoverview SuccessMessage 컴포넌트 타입 정의
 */

/**
 * SuccessMessage 컴포넌트 Props
 */
export interface SuccessMessageProps {
  /** 성공 메시지 */
  message?: string;
  /** 대기실 ID (또는 캡슐 ID) */
  waitingRoomId?: string;
}
