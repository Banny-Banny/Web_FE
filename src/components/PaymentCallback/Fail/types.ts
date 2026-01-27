/**
 * @fileoverview 결제 실패 콜백 페이지 타입 정의
 * @description 결제 실패 콜백 처리 관련 타입
 */

/**
 * 결제 실패 페이지 Props
 */
export type PaymentFailPageProps = Record<string, never>;

/**
 * 결제 실패 처리 상태
 */
export interface PaymentFailState {
  /** 에러 코드 */
  errorCode?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 주문 ID */
  orderId?: string;
}
