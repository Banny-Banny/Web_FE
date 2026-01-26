/**
 * @fileoverview RetryButton 컴포넌트 타입 정의
 */

/**
 * RetryButton 컴포넌트 Props
 */
export interface RetryButtonProps {
  /** 재시도 핸들러 */
  onRetry: () => void;
  /** 버튼 텍스트 (기본값: "다시 시도") */
  label?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}
