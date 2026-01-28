/**
 * @fileoverview RetryButton 컴포넌트 타입 정의
 */

/**
 * RetryButton 컴포넌트 Props
 */
export interface RetryButtonProps {
  /** 재시도 핸들러 */
  onRetry: () => void;
  /** 버튼 텍스트 (선택적) */
  label?: string;
}
