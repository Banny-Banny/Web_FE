/**
 * @fileoverview usePaymentFail 훅
 * @description 결제 실패 콜백 처리 비즈니스 로직 훅
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { convertErrorCodeToMessage } from '@/commons/utils/payment';
import type { PaymentFailState } from '../types';

/**
 * 결제 실패 처리 훅
 * 
 * URL 파라미터에서 실패 정보를 추출하고,
 * 사용자 친화적인 메시지로 변환합니다.
 * 
 * @returns 결제 실패 처리 상태 및 핸들러
 */
export function usePaymentFail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터에서 실패 정보 추출
  const failState = useMemo<PaymentFailState>(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');
    
    return {
      errorCode: code || undefined,
      errorMessage: message || undefined,
      orderId: orderId || undefined,
    };
  }, [searchParams]);
  
  // 사용자 친화적인 메시지 변환
  const userFriendlyMessage = useMemo(() => {
    return convertErrorCodeToMessage(
      failState.errorCode,
      failState.errorMessage
    );
  }, [failState.errorCode, failState.errorMessage]);
  
  /**
   * 재시도 핸들러
   * 결제 페이지로 이동
   */
  const handleRetry = () => {
    if (failState.orderId) {
      router.push(`/payment?orderId=${failState.orderId}`);
    } else {
      router.push('/payment');
    }
  };
  
  /**
   * 뒤로가기 핸들러
   * 이전 페이지로 이동
   */
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };
  
  return {
    state: failState,
    userFriendlyMessage,
    handleRetry,
    handleBack,
  };
}
