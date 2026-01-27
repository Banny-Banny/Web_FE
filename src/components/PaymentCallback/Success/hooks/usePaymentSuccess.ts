/**
 * @fileoverview usePaymentSuccess 훅
 * @description 결제 성공 콜백 처리 비즈니스 로직 훅
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmPayment } from '@/commons/apis/payment/hooks/useConfirmPayment';
import { useCreateWaitingRoom } from '@/commons/apis/capsules/hooks/useCreateWaitingRoom';
import { useOrderStatus } from '@/commons/apis/orders/hooks/useOrderStatus';
import { extractPaymentInfoFromUrl, convertErrorCodeToMessage } from '@/commons/utils/payment';
import type { PaymentSuccessState } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 네트워크 오류인지 확인하는 함수
 */
function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  const apiError = error as ApiError;
  
  return (
    !apiError.status ||
    apiError.code === 'ERR_NETWORK' ||
    apiError.code === 'ECONNABORTED' ||
    apiError.code === 'ERR_CANCELED' ||
    (typeof apiError.message === 'string' && 
     (apiError.message.toLowerCase().includes('network') ||
      apiError.message.toLowerCase().includes('fetch')))
  );
}

/**
 * 결제 성공 처리 훅
 * 
 * URL 파라미터에서 결제 정보를 추출하고,
 * 결제 승인 API를 호출한 후 대기실 페이지로 이동합니다.
 * 
 * @returns 결제 성공 처리 상태 및 핸들러
 */
export function usePaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState<PaymentSuccessState>({
    status: 'idle',
  });
  
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_COUNT = 3;
  const hasProcessedRef = useRef(false);
  
  const confirmPaymentMutation = useConfirmPayment();
  const createWaitingRoomMutation = useCreateWaitingRoom();
  
  // URL 파라미터에서 결제 정보 추출
  const paymentInfo = extractPaymentInfoFromUrl(searchParams);
  
  // 주문 상태 조회 (중복 처리 방지)
  const { data: orderStatus } = useOrderStatus(
    paymentInfo?.orderId || null,
    { enablePolling: false }
  );
  
  /**
   * 결제 승인 처리
   */
  const handleConfirmPayment = useCallback(async () => {
    if (!paymentInfo) {
      setState({
        status: 'failed',
        error: '결제 정보가 없습니다.',
      });
      return;
    }
    
    const { paymentKey, orderId, amount } = paymentInfo;
    
    // 이미 결제 완료된 주문인지 확인 (중복 처리 방지)
    if (orderStatus?.order_status === 'PAID') {
      // 이미 결제 완료된 경우, capsule_id로 대기실 페이지로 이동
      const capsuleId = orderStatus.payment_key || orderId;
      router.push(`/waiting-room/${capsuleId}`);
      return;
    }
    
    try {
      setState({ status: 'confirming', orderId });
      
      // 결제 승인 API 호출
      const confirmResult = await confirmPaymentMutation.mutateAsync({
        paymentKey,
        orderId,
        amount: Number(amount),
      });
      
      if (confirmResult.status !== 'PAID') {
        setState({
          status: 'failed',
          orderId,
          error: '결제 승인에 실패했습니다.',
          confirmResponse: confirmResult,
        });
        return;
      }
      
      // 결제 승인 성공 시 capsule_id로 대기실 페이지로 이동
      // 백엔드 구현에 따라 대기실 생성이 별도로 필요한지 확인 필요
      // 현재는 capsule_id를 사용하여 바로 이동
      if (confirmResult.capsule_id) {
        router.push(`/waiting-room/${confirmResult.capsule_id}`);
        setState({
          status: 'success',
          orderId,
          waitingRoomId: confirmResult.capsule_id,
          confirmResponse: confirmResult,
        });
      } else {
        // capsule_id가 없는 경우 (백엔드 구현 확인 필요)
        setState({
          status: 'failed',
          orderId,
          error: '대기실 정보를 찾을 수 없습니다.',
          confirmResponse: confirmResult,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      
      // 네트워크 오류인 경우 자동 재시도 (US3)
      if (isNetworkError(error) && retryCount < MAX_RETRY_COUNT) {
        setRetryCount((prev) => prev + 1);
        // 2초 후 재시도
        setTimeout(() => {
          handleConfirmPayment();
        }, 2000);
        return;
      }
      
      // 에러 코드를 사용자 친화적인 메시지로 변환
      const errorMessage = convertErrorCodeToMessage(
        apiError.code || apiError.message,
        apiError.message
      );
      
      setState({
        status: 'failed',
        orderId,
        error: errorMessage,
      });
    }
  }, [paymentInfo, orderStatus, confirmPaymentMutation, router, retryCount]);
  
  /**
   * 재시도 핸들러
   */
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    hasProcessedRef.current = false;
    setState({ status: 'idle' });
    handleConfirmPayment();
  }, [handleConfirmPayment]);
  
  /**
   * 주문 상태 조회 핸들러
   */
  const handleCheckOrderStatus = useCallback(() => {
    if (orderStatus) {
      // 주문 상태가 PAID인 경우 대기실 페이지로 이동
      if (orderStatus.order_status === 'PAID') {
        const capsuleId = orderStatus.payment_key || state.orderId || '';
        router.push(`/waiting-room/${capsuleId}`);
      } else {
        // 주문 상태가 다른 경우 결제 페이지로 이동
        router.push(`/payment?orderId=${state.orderId || ''}`);
      }
    } else {
      // 주문 상태 조회 실패 시 결제 페이지로 이동
      router.push(`/payment?orderId=${state.orderId || ''}`);
    }
  }, [orderStatus, state.orderId, router]);
  
  // 초기 결제 승인 처리 (한 번만 실행)
  useEffect(() => {
    if (paymentInfo && state.status === 'idle' && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      handleConfirmPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo?.paymentKey, paymentInfo?.orderId, paymentInfo?.amount]);
  
  return {
    state,
    handleRetry,
    handleCheckOrderStatus,
    isLoading: confirmPaymentMutation.isPending || createWaitingRoomMutation.isPending,
  };
}
