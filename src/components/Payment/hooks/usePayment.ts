/**
 * @fileoverview 결제 플로우 관리 훅
 * @description 토스페이먼츠 SDK 연동 및 결제 플로우 관리
 */

import { useState, useCallback } from 'react';
import { completePayment } from '@/commons/apis/payment';
import type { PaymentState } from '../types';

/**
 * 결제 플로우 관리 훅
 * 
 * 토스페이먼츠 SDK를 사용한 결제 요청 및 완료 처리를 관리합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @param {number} amount - 결제 금액
 * @param {string} orderName - 주문명
 * @returns {Object} 결제 상태 및 핸들러
 * 
 * @example
 * ```typescript
 * const { paymentState, requestPayment, handlePaymentSuccess, handlePaymentError } = usePayment(
 *   'order-123',
 *   15000,
 *   '타임캡슐 주문'
 * );
 * ```
 */
export function usePayment(
  orderId: string,
  amount: number,
  orderName: string
) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'idle',
  });

  /**
   * 결제 요청
   * 
   * 토스페이먼츠 SDK를 사용하여 결제를 요청합니다.
   * 실제 구현은 TossPaymentWidget 컴포넌트에서 처리됩니다.
   */
  const requestPayment = useCallback(async () => {
    setPaymentState({ status: 'pending' });
  }, []);

  /**
   * 결제 성공 처리
   * 
   * 토스페이먼츠에서 결제가 성공한 후 서버에 결제 완료를 알립니다.
   * 
   * @param {string} paymentKey - 토스페이먼츠에서 발급한 결제 키
   */
  const handlePaymentSuccess = useCallback(
    async (paymentKey: string) => {
      try {
        setPaymentState({ status: 'pending' });

        // 서버에 결제 완료 알림
        const result = await completePayment({
          paymentKey,
          orderId,
          amount,
        });

        if (result.success && result.orderStatus === 'PAID') {
          setPaymentState({
            status: 'success',
            paymentId: paymentKey,
          });
        } else {
          setPaymentState({
            status: 'failed',
            error: result.message || '결제 처리 중 오류가 발생했습니다.',
          });
        }
      } catch (error) {
        // 네트워크 오류 처리
        if (error instanceof Error) {
          // 네트워크 오류인지 확인
          if (
            error.message.includes('network') ||
            error.message.includes('Network') ||
            error.message.includes('fetch')
          ) {
            setPaymentState({
              status: 'failed',
              error: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
            });
          } else {
            setPaymentState({
              status: 'failed',
              error: error.message || '결제 완료 처리 중 오류가 발생했습니다.',
            });
          }
        } else {
          setPaymentState({
            status: 'failed',
            error: '결제 완료 처리 중 오류가 발생했습니다.',
          });
        }
      }
    },
    [orderId, amount]
  );

  /**
   * 결제 실패 처리
   * 
   * 네트워크 오류, 결제 실패 등 다양한 오류를 처리합니다.
   * 
   * @param {string | Error} error - 오류 메시지 또는 Error 객체
   */
  const handlePaymentError = useCallback((error: string | Error) => {
    let errorMessage: string;

    if (error instanceof Error) {
      // 네트워크 오류인지 확인
      if (
        error.message.includes('network') ||
        error.message.includes('Network') ||
        error.message.includes('fetch') ||
        error.message.includes('Failed to fetch')
      ) {
        errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
      } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      } else {
        errorMessage = error.message || '결제 처리 중 오류가 발생했습니다.';
      }
    } else {
      errorMessage = error || '결제 처리 중 오류가 발생했습니다.';
    }

    setPaymentState({
      status: 'failed',
      error: errorMessage,
    });
  }, []);

  /**
   * 재시도
   * 
   * 결제 상태를 초기화하여 재시도할 수 있도록 합니다.
   */
  const retry = useCallback(() => {
    setPaymentState({ status: 'idle' });
  }, []);

  return {
    paymentState,
    requestPayment,
    handlePaymentSuccess,
    handlePaymentError,
    retry,
  };
}
