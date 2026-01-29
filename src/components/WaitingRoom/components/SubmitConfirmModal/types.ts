/**
 * @fileoverview SubmitConfirmModal 컴포넌트 타입 정의
 */

/**
 * SubmitConfirmModal 컴포넌트 Props
 */
export interface SubmitConfirmModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 확인 핸들러 */
  onConfirm: () => void;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 남은 시간 (시간 단위) */
  remainingHours: number;
  /** 로딩 상태 */
  isLoading?: boolean;
}
