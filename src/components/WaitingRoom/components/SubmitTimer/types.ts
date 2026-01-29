/**
 * @fileoverview SubmitTimer 컴포넌트 타입 정의
 */

/**
 * SubmitTimer 컴포넌트 Props
 */
export interface SubmitTimerProps {
  /** 방 생성 시각 (ISO 8601) */
  createdAt: string;
  /** 타이머 만료 시 콜백 (선택) */
  onExpired?: () => void;
}
