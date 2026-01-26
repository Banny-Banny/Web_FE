/**
 * @fileoverview 결제 API 함수
 * @description 결제 완료, 조회 등 결제 관련 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { PAYMENT_ENDPOINTS } from '../endpoints';
import type {
  CompletePaymentRequest,
  CompletePaymentResponse,
} from './types';

/**
 * 결제 완료 API
 * 
 * 토스페이먼츠 결제 성공 후 서버에 결제 완료를 알립니다.
 * 
 * @param {CompletePaymentRequest} data - 결제 완료 요청 데이터
 * @returns {Promise<CompletePaymentResponse>} 결제 완료 응답
 * 
 * @example
 * ```typescript
 * const result = await completePayment({
 *   paymentKey: 'payment-key-123',
 *   orderId: 'order-123',
 *   amount: 15000,
 * });
 * ```
 */
export async function completePayment(
  data: CompletePaymentRequest
): Promise<CompletePaymentResponse> {
  const response = await apiClient.post<CompletePaymentResponse>(
    PAYMENT_ENDPOINTS.COMPLETE,
    data
  );
  return response.data;
}
