/**
 * @fileoverview useConfirmPayment 훅
 * @description 토스페이먼츠 결제 승인을 위한 React Query mutation 훅
 */

import { useMutation } from '@tanstack/react-query';
import { confirmPayment } from '../index';
import type { ConfirmPaymentRequest, ConfirmPaymentResponse } from '../types';

/**
 * 토스페이먼츠 결제 승인 React Query mutation 훅
 * 
 * 결제 승인 API를 호출하는 mutation을 제공합니다.
 * 
 * @returns React Query mutation 객체
 * 
 * @example
 * ```typescript
 * const confirmPaymentMutation = useConfirmPayment();
 * 
 * const handleConfirm = async () => {
 *   try {
 *     const result = await confirmPaymentMutation.mutateAsync({
 *       paymentKey: 'pay-1234-5678',
 *       orderId: 'order-123',
 *       amount: 10000,
 *     });
 *     console.log('결제 승인 성공:', result);
 *   } catch (error) {
 *     console.error('결제 승인 실패:', error);
 *   }
 * };
 * ```
 */
export function useConfirmPayment() {
  return useMutation<ConfirmPaymentResponse, Error, ConfirmPaymentRequest>({
    mutationFn: confirmPayment,
  });
}
