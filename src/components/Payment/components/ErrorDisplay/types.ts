/**
 * @fileoverview ErrorDisplay 컴포넌트 타입 정의
 */

/**
 * ErrorDisplay 컴포넌트 Props
 */
export interface ErrorDisplayProps {
  /** 오류 메시지 */
  message: string;
  /** 오류 타입 (선택적) */
  type?: 'network' | 'payment' | 'order' | 'general';
}
