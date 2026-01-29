/**
 * @fileoverview SubmitButton 컴포넌트 타입 정의
 */

/**
 * SubmitButton 컴포넌트 Props
 */
export interface SubmitButtonProps {
  /** 버튼 활성화 여부 */
  disabled: boolean;
  /** 비활성화 사유 */
  disabledReason?: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}
