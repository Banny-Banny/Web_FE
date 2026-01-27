/**
 * @fileoverview BackButton 컴포넌트 타입 정의
 */

/**
 * BackButton 컴포넌트 Props
 */
export interface BackButtonProps {
  /** 뒤로가기 핸들러 */
  onBack: () => void;
  /** 버튼 텍스트 (선택적) */
  label?: string;
}
