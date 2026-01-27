/**
 * EggSlotModal 컴포넌트 타입 정의
 */

/**
 * EggSlotModal 컴포넌트 Props
 */
export interface EggSlotModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
}

/**
 * 슬롯 정보
 */
export interface SlotInfo {
  /** 전체 슬롯 개수 */
  totalSlots: number;
  /** 사용 중인 슬롯 개수 */
  usedSlots: number;
  /** 남은 슬롯 개수 */
  remainingSlots: number;
}
