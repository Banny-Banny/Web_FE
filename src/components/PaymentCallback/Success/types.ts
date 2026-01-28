/**
 * @fileoverview 결제 성공 콜백 페이지 타입 정의
 * @description 결제 성공 콜백 처리 관련 타입
 */

/**
 * 결제 성공 페이지 Props
 */
export type PaymentSuccessPageProps = Record<string, never>;

/**
 * 결제 성공 처리 상태
 */
export interface PaymentSuccessState {
  /** 처리 상태 */
  status: 'idle' | 'confirming' | 'creating' | 'success' | 'failed';
  /** 에러 메시지 */
  error?: string;
  /** 주문 ID */
  orderId?: string;
  /** 대기실 ID (또는 캡슐 ID) */
  waitingRoomId?: string;
  /** 결제 승인 응답 데이터 */
  confirmResponse?: {
    order_id: string;
    payment_key: string;
    status: 'PAID' | 'FAILED';
    amount: number;
    approved_at: string;
    capsule_id: string;
    receipt_url: string;
  };
}
