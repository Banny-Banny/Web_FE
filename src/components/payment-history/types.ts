/**
 * @fileoverview 결제 내역 컴포넌트 타입 정의
 */

import type { PaymentListItem } from '@/commons/apis/payment/types';

/**
 * PaymentHistory 컴포넌트 Props
 */
export interface PaymentHistoryProps {
  /** 컴포넌트 클래스명 */
  className?: string;
}

/**
 * 결제 상세 모달 Props
 */
export interface PaymentDetailModalProps {
  /** 선택된 결제 정보 */
  payment: PaymentListItem | null;
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}
