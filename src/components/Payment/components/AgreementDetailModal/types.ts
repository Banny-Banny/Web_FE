/**
 * @fileoverview AgreementDetailModal 컴포넌트 타입 정의
 */

export interface AgreementDetailModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 선택된 약관 인덱스 (0: 이용약관, 1: 개인정보, 2: 결제) */
  selectedIndex: number | null;
  /** 닫기 핸들러 */
  onClose: () => void;
}
