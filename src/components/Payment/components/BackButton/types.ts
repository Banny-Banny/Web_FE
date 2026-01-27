/**
 * @fileoverview BackButton 컴포넌트 타입 정의
 */

/**
 * BackButton 컴포넌트 Props
 */
export interface BackButtonProps {
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 버튼 텍스트 (기본값: "이전") */
  label?: string;
}
