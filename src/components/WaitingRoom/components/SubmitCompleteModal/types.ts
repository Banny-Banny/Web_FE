/**
 * @fileoverview SubmitCompleteModal 컴포넌트 타입 정의
 */

/**
 * SubmitCompleteModal 컴포넌트 Props
 */
export interface SubmitCompleteModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 타임캡슐 ID */
  capsuleId: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 자동 제출 여부 */
  isAutoSubmitted: boolean;
}
