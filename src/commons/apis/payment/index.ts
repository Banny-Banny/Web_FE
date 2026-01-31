/**
 * @fileoverview 결제 API 함수
 * @description 결제 완료, 조회 등 결제 관련 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { PAYMENT_ENDPOINTS } from '../endpoints';
import type {
  CompletePaymentRequest,
  CompletePaymentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  GetMyPaymentsParams,
  PaymentListResponse,
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

/**
 * 토스페이먼츠 결제 승인 API
 *
 * 토스페이먼츠 결제 완료 후 최종 승인을 처리합니다.
 * JWT Bearer 토큰이 자동으로 포함됩니다.
 *
 * @param {ConfirmPaymentRequest} data - 결제 승인 요청 데이터
 * @returns {Promise<ConfirmPaymentResponse>} 결제 승인 응답
 *
 * @throws {ApiError} 에러 발생 시
 * - 400: AMOUNT_MISMATCH, ORDER_ALREADY_PAID, TOSS_SECRET_KEY_REQUIRED, TOSS_CONFIRM_FAILED
 * - 401: ORDER_NOT_OWNED, JWT 누락/만료
 * - 404: ORDER_NOT_FOUND, PRODUCT_NOT_FOUND_OR_INVALID
 *
 * @example
 * ```typescript
 * const result = await confirmPayment({
 *   paymentKey: 'pay-1234-5678',
 *   orderId: 'order-123',
 *   amount: 10000,
 * });
 * ```
 */
export async function confirmPayment(
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  // 디버깅: 결제 승인 요청 데이터 확인
  console.log('[confirmPayment] 요청 데이터:', {
    endpoint: PAYMENT_ENDPOINTS.CONFIRM,
    data,
  });

  // 백엔드가 snake_case를 기대하는 경우를 대비해 변환
  const requestData = {
    paymentKey: data.paymentKey,
    orderId: data.orderId,
    amount: data.amount,
  };

  console.log('[confirmPayment] 변환된 요청 데이터:', requestData);

  const response = await apiClient.post<ConfirmPaymentResponse>(
    PAYMENT_ENDPOINTS.CONFIRM,
    requestData
  );

  // 디버깅: 결제 승인 응답 확인
  console.log('[confirmPayment] 응답 데이터:', response.data);

  return response.data;
}

/**
 * 내 결제 내역 목록 조회 API
 *
 * 로그인한 사용자의 결제 내역을 페이지네이션하여 조회합니다.
 *
 * @param {GetMyPaymentsParams} params - 조회 파라미터
 * @returns {Promise<PaymentListResponse>} 결제 목록 응답
 *
 * @example
 * ```typescript
 * const result = await getMyPayments({
 *   page: 1,
 *   limit: 10,
 *   status: 'ALL',
 * });
 * ```
 */
export async function getMyPayments(
  params: GetMyPaymentsParams = {}
): Promise<PaymentListResponse> {
  const { page = 1, limit = 10, status = 'ALL' } = params;

  const response = await apiClient.get<PaymentListResponse>(
    PAYMENT_ENDPOINTS.MY_PAYMENTS,
    {
      params: { page, limit, status },
    }
  );

  return response.data;
}
