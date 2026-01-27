/**
 * @fileoverview 결제 관련 유틸리티 함수
 * @description 결제 콜백 처리 및 에러 메시지 변환 유틸리티
 */

import type { TossPaymentCallbackParams } from '@/commons/apis/payment/types';

/**
 * 토스페이먼츠 콜백 URL에서 결제 정보 추출
 * 
 * URL 쿼리 파라미터에서 paymentKey, orderId, amount를 추출합니다.
 * 
 * @param searchParams - URL 쿼리 파라미터
 * @returns 결제 정보 또는 null (파라미터 누락 시)
 * 
 * @example
 * ```typescript
 * const searchParams = new URLSearchParams(window.location.search);
 * const paymentInfo = extractPaymentInfoFromUrl(searchParams);
 * if (paymentInfo) {
 *   console.log('결제 키:', paymentInfo.paymentKey);
 *   console.log('주문 ID:', paymentInfo.orderId);
 *   console.log('결제 금액:', paymentInfo.amount);
 * }
 * ```
 */
export function extractPaymentInfoFromUrl(
  searchParams: URLSearchParams
): TossPaymentCallbackParams | null {
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  if (!paymentKey || !orderId || !amount) {
    return null;
  }

  return {
    paymentKey,
    orderId,
    amount,
  };
}

/**
 * 결제 실패 원인을 사용자 친화적인 메시지로 변환
 * 
 * 백엔드에서 반환된 에러 코드를 사용자가 이해하기 쉬운 메시지로 변환합니다.
 * 
 * @param errorCode - 에러 코드 (예: AMOUNT_MISMATCH, ORDER_ALREADY_PAID 등)
 * @param errorMessage - 에러 메시지 (선택적)
 * @returns 사용자 친화적인 메시지
 * 
 * @example
 * ```typescript
 * const message = convertErrorCodeToMessage('AMOUNT_MISMATCH');
 * // "결제 금액이 주문 금액과 일치하지 않습니다."
 * 
 * const message2 = convertErrorCodeToMessage('UNKNOWN_ERROR', '알 수 없는 오류');
 * // "알 수 없는 오류"
 * ```
 */
export function convertErrorCodeToMessage(
  errorCode?: string,
  errorMessage?: string
): string {
  const errorMessages: Record<string, string> = {
    AMOUNT_MISMATCH: '결제 금액이 주문 금액과 일치하지 않습니다.',
    ORDER_ALREADY_PAID: '이미 결제가 완료된 주문입니다.',
    ORDER_NOT_FOUND: '주문을 찾을 수 없습니다.',
    ORDER_NOT_OWNED: '본인의 주문이 아닙니다.',
    PRODUCT_NOT_FOUND_OR_INVALID: '유효하지 않은 상품입니다.',
    TOSS_SECRET_KEY_REQUIRED: '결제 서비스 설정 오류가 발생했습니다.',
    TOSS_CONFIRM_FAILED: '결제 승인 처리 중 오류가 발생했습니다.',
  };

  return (
    errorMessages[errorCode || ''] ||
    errorMessage ||
    '결제 처리 중 오류가 발생했습니다.'
  );
}
