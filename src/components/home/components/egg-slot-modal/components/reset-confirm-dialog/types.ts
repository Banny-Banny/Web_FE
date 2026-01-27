/**
 * ResetConfirmDialog 컴포넌트 타입 정의
 */

/**
 * ResetConfirmDialog 컴포넌트 Props
 */
export interface ResetConfirmDialogProps {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 확인 핸들러 */
  onConfirm: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}
