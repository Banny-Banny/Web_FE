/**
 * BottomSheet 컴포넌트 타입 정의
 */

export interface BottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 바텀시트 내부 컨텐츠 */
  children: React.ReactNode;
  /** 하단 고정 영역 (버튼 등) */
  footer?: React.ReactNode;
  /** 드래그 핸들 표시 여부 (기본: true) */
  showHandle?: boolean;
  /** 오버레이 클릭 시 닫기 여부 (기본: true) */
  closeOnBackdropPress?: boolean;
}
