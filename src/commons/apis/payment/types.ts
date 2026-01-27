/**
 * @fileoverview 결제 API 타입 정의
 * @description 결제 완료, 조회 등 결제 관련 타입
 */

/**
 * 결제 완료 요청 타입
 */
export interface CompletePaymentRequest {
  /** 결제 키 (토스페이먼츠에서 발급) */
  paymentKey: string;
  /** 주문 ID */
  orderId: string;
  /** 결제 금액 */
  amount: number;
}

/**
 * 결제 완료 응답 타입
 */
export interface CompletePaymentResponse {
  /** 결제 완료 여부 */
  success: boolean;
  /** 주문 ID */
  orderId: string;
  /** 결제 키 */
  paymentKey: string;
  /** 주문 상태 */
  orderStatus: 'PAID' | 'FAILED';
  /** 메시지 (선택적) */
  message?: string;
}
