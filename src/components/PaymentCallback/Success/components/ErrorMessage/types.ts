/**
 * @fileoverview ErrorMessage 컴포넌트 타입 정의
 */

/**
 * ErrorMessage 컴포넌트 Props
 */
export interface ErrorMessageProps {
  /** 에러 메시지 */
  message: string;
  /** 재시도 핸들러 (선택적) */
  onRetry?: () => void;
  /** 주문 상태 조회 핸들러 (선택적) */
  onCheckOrderStatus?: () => void;
}
