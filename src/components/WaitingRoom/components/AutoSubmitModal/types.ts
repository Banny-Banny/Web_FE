/**
 * @fileoverview AutoSubmitModal 컴포넌트 타입 정의
 */

/**
 * AutoSubmitModal 컴포넌트 Props
 */
export interface AutoSubmitModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 시각 (ISO 8601) */
  buriedAt: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 보관함으로 이동 핸들러 */
  onNavigateToVault: () => void;
}
