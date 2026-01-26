/**
 * MyEggsModal Component Types
 * Version: 1.0.0
 * Created: 2025-01-26
 */

export interface MyEggsModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 현재 보유한 이스터에그 개수 (0-3) */
  eggCount: number;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}
