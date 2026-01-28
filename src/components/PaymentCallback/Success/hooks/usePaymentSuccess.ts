/**
 * @fileoverview usePaymentSuccess 훅
 * @description 결제 성공 콜백 처리 비즈니스 로직 훅
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmPayment } from '@/commons/apis/payment/hooks/useConfirmPayment';
import { useCreateWaitingRoom } from '@/commons/apis/capsules/hooks/useCreateWaitingRoom';
import { useOrderStatus } from '@/commons/apis/orders/hooks/useOrderStatus';
import { getOrder } from '@/commons/apis/orders';
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
    // 중복 실행 방지 (가장 먼저 체크)
    if (hasProcessedRef.current) {
      console.log('[usePaymentSuccess] handleConfirmPayment 중복 실행 방지');
      return;
    }

    if (!paymentInfo) {
      setState({
        status: 'failed',
        error: '결제 정보가 없습니다.',
      });
      return;
    }

    const { paymentKey, orderId, amount } = paymentInfo;

    // 필수 파라미터 확인
    if (!paymentKey || !orderId || !amount) {
      setState({
        status: 'failed',
        error: '결제 정보가 불완전합니다.',
      });
      return;
    }

    console.log('[usePaymentSuccess] 결제 승인 시작 (최초 1회):', { paymentKey, orderId, amount });
    hasProcessedRef.current = true;

    // 이미 결제 완료된 주문인지 확인 (중복 처리 방지)
    if (orderStatus?.order_status === 'PAID') {
      console.log('[usePaymentSuccess] 이미 결제 완료된 주문:', orderStatus);
      // 이미 결제 완료된 경우, 주문 상세 조회로 capsule_id 확인
      try {
        const orderDetail = await getOrder(orderId);
        if (orderDetail.order.capsule_id) {
          console.log('[usePaymentSuccess] 대기실로 이동:', orderDetail.order.capsule_id);
          router.push(`/waiting-room/${orderDetail.order.capsule_id}`);
        } else {
          console.log('[usePaymentSuccess] capsule_id 없음, 대기실 생성 필요');
          // capsule_id가 없으면 대기실 생성
          const waitingRoomResult = await createWaitingRoomMutation.mutateAsync({
            order_id: orderId,
          });
          if (waitingRoomResult.room_id) {
            router.push(`/waiting-room/${waitingRoomResult.room_id}`);
          }
        }
      } catch (error) {
        console.error('[usePaymentSuccess] 주문 조회/대기실 생성 실패:', error);
      }
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
      const errorMessage = apiError.message || '';
      const errorCode = apiError.code || '';

      // 디버깅: 에러 전체 출력
      console.error('[usePaymentSuccess] 결제 승인 실패:', {
        message: errorMessage,
        messageType: typeof errorMessage,
        code: errorCode,
        status: apiError.status,
        details: apiError.details,
        fullError: apiError,
      });

      // 에러 메시지를 문자열로 변환 (혹시 객체인 경우를 대비)
      const errorString = typeof errorMessage === 'string' 
        ? errorMessage 
        : JSON.stringify(errorMessage);

      console.log('[usePaymentSuccess] 에러 문자열:', errorString);
      console.log('[usePaymentSuccess] S008 포함 여부:', errorString.includes('S008'));

      // 토스 "기존 요청을 처리중입니다" 에러 - 결제는 이미 처리됨
      // 주문 상태를 폴링하면서 capsule_id가 생성될 때까지 대기
      const isProcessingError = 
        errorString.includes('FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING') ||
        errorString.includes('기존 요청을 처리중입니다') ||
        errorString.includes('ALREADY_PROCESSED') ||
        errorString.includes('S008');

      console.log('[usePaymentSuccess] 처리 중 에러 감지:', isProcessingError);

      if (isProcessingError) {
        console.log('[usePaymentSuccess] ✅ 결제 처리 중 (S008) 감지! 주문 상태 폴링 시작...');

        setState({ status: 'confirming', orderId });

        // 주문 상태 폴링 (최대 30초, 2초 간격)
        const pollOrderStatus = async (maxAttempts = 15, interval = 2000) => {
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`[usePaymentSuccess] 주문 상태 확인 시도 ${attempt}/${maxAttempts}...`);

            try {
              const orderDetail = await getOrder(orderId);
              console.log('[usePaymentSuccess] 주문 상세:', orderDetail);

              // capsule_id가 생성되었으면 대기실로 이동
              if (orderDetail.order.capsule_id) {
                console.log('[usePaymentSuccess] capsule_id 발견, 대기실로 이동:', orderDetail.order.capsule_id);
                router.push(`/waiting-room/${orderDetail.order.capsule_id}`);
                setState({
                  status: 'success',
                  orderId,
                  waitingRoomId: orderDetail.order.capsule_id,
                });
                return true;
              }

              // 주문 상태가 PAID인데 capsule_id가 없으면 대기실 생성 시도
              if (orderDetail.order.status === 'PAID' && !orderDetail.order.capsule_id) {
                console.log('[usePaymentSuccess] 결제 완료, capsule_id 없음. 대기실 생성 시도...');
                try {
                  const waitingRoomResult = await createWaitingRoomMutation.mutateAsync({
                    order_id: orderId,
                  });
                  console.log('[usePaymentSuccess] 대기실 생성 결과:', waitingRoomResult);

                  if (waitingRoomResult.room_id) {
                    console.log('[usePaymentSuccess] 대기실 생성 성공, 대기실로 이동:', waitingRoomResult.room_id);
                    router.push(`/waiting-room/${waitingRoomResult.room_id}`);
                    setState({
                      status: 'success',
                      orderId,
                      waitingRoomId: waitingRoomResult.room_id,
                    });
                    return true;
                  }
                } catch (createError) {
                  console.error('[usePaymentSuccess] 대기실 생성 실패:', createError);
                  // 대기실 생성 실패 시 다음 폴링 시도
                }
              }

              // 아직 처리 중이면 대기
              if (attempt < maxAttempts) {
                console.log(`[usePaymentSuccess] ${interval}ms 후 재시도...`);
                await new Promise((resolve) => setTimeout(resolve, interval));
              }
            } catch (error) {
              console.error(`[usePaymentSuccess] 주문 조회 실패 (${attempt}/${maxAttempts}):`, error);
              if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, interval));
              }
            }
          }

          // 최대 시도 횟수 초과
          console.error('[usePaymentSuccess] 주문 상태 폴링 타임아웃');
          return false;
        };

        const success = await pollOrderStatus();

        if (!success) {
          setState({
            status: 'failed',
            orderId,
            error: '결제 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
          });
        }

        return;
      }

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
      const userErrorMessage = convertErrorCodeToMessage(
        apiError.code || apiError.message,
        apiError.message
      );

      setState({
        status: 'failed',
        orderId,
        error: userErrorMessage,
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
    // paymentInfo가 있고 아직 처리하지 않았을 때만 실행
    if (paymentInfo && !hasProcessedRef.current) {
      console.log('[usePaymentSuccess] useEffect 트리거: 결제 승인 처리 시작');
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
