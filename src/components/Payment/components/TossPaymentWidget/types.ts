/**
 * @fileoverview TossPaymentWidget 컴포넌트 타입 정의
 */

/**
 * TossPaymentWidget 컴포넌트 Props
 */
export interface TossPaymentWidgetProps {
  /** 주문 ID */
  orderId: string;
  /** 결제 금액 */
  amount: number;
  /** 주문명 (결제창에 표시될 주문명) */
  orderName?: string;
  /** 고객명 (캡슐명, 결제창에 표시될 고객명) */
  customerName?: string;
  /** 결제 성공 콜백 */
  onSuccess?: (paymentId: string) => void;
  /** 결제 실패 콜백 */
  onError?: (error: string) => void;
  /** 비활성화 여부 (동의 미완료 시) */
  disabled?: boolean;
}
