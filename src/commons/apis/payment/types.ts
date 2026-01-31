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

/**
 * 토스페이먼츠 결제 승인 요청 타입
 */
export interface ConfirmPaymentRequest {
  /** 결제 키 (토스페이먼츠에서 발급, 1~200자 문자열) */
  paymentKey: string;
  /** 주문 ID (6~200자 문자열) */
  orderId: string;
  /** 결제 금액 (숫자) */
  amount: number;
}

/**
 * 토스페이먼츠 결제 승인 응답 타입
 */
export interface ConfirmPaymentResponse {
  /** 주문 ID */
  order_id: string;
  /** 결제 키 */
  payment_key: string;
  /** 결제 상태 */
  status: 'PAID' | 'FAILED';
  /** 결제 금액 */
  amount: number;
  /** 결제 승인 일시 (ISO 8601 형식) */
  approved_at: string;
  /** 생성된 캡슐 ID (결제 승인 시 자동 생성됨) */
  capsule_id: string;
  /** 영수증 URL */
  receipt_url: string;
}

/**
 * 토스페이먼츠 콜백 파라미터 타입
 */
export interface TossPaymentCallbackParams {
  /** 결제 키 */
  paymentKey?: string;
  /** 주문 ID */
  orderId?: string;
  /** 결제 금액 */
  amount?: string;
  /** 에러 코드 (실패 시) */
  code?: string;
  /** 에러 메시지 (실패 시) */
  message?: string;
}

/**
 * 결제 목록 아이템 (요약 정보)
 */
export interface PaymentListItem {
  /** 결제 키 */
  paymentKey: string;
  /** 주문 번호 */
  orderNo: string;
  /** 주문명 */
  orderName?: string;
  /** 결제 상태 */
  tossStatus: 'DONE' | 'CANCELED';
  /** 결제 수단 */
  method: string;
  /** 통화 */
  currency: string;
  /** 결제 금액 */
  amount: number;
  /** 결제 승인 일시 */
  approvedAt: string;
  /** 영수증 URL */
  receiptUrl: string;
}

/**
 * 결제 목록 응답
 */
export interface PaymentListResponse {
  /** 결제 목록 */
  payments: PaymentListItem[];
  /** 전체 결제 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지당 항목 수 */
  limit: number;
}

/**
 * 결제 목록 조회 파라미터
 */
export interface GetMyPaymentsParams {
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 항목 수 */
  limit?: number;
  /** 필터 상태 */
  status?: 'ALL' | 'DONE' | 'CANCELED';
}
