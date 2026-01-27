'use client';

/**
 * @fileoverview PaymentSuccess 메인 컨테이너 컴포넌트
 * @description 결제 성공 콜백 페이지의 최상위 컨테이너
 *
 * @note
 * Phase 5에서 실제 API 호출로 교체되었습니다.
 */

import React from 'react';
import { LoadingState } from './components/LoadingState';
import { SuccessMessage } from './components/SuccessMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { usePaymentSuccess } from './hooks/usePaymentSuccess';
import styles from './styles.module.css';

/**
 * PaymentSuccess 컴포넌트
 * 
 * 결제 성공 콜백 페이지의 메인 컨테이너입니다.
 * - 실제 API 호출을 통한 결제 승인 처리
 * - 대기실 페이지로 자동 이동
 * - 오류 처리 및 재시도 로직
 */
export function PaymentSuccess() {
  const { state, handleRetry, handleCheckOrderStatus, isLoading } =
    usePaymentSuccess();

  // 상태별 컴포넌트 렌더링
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {(state.status === 'confirming' || isLoading) && (
          <LoadingState message="결제 승인 중..." />
        )}
        {state.status === 'creating' && (
          <LoadingState message="대기실 생성 중..." />
        )}
        {state.status === 'success' && (
          <SuccessMessage
            message="결제가 완료되었습니다."
            waitingRoomId={state.waitingRoomId}
          />
        )}
        {state.status === 'failed' && (
          <ErrorMessage
            message={state.error || '결제 처리 중 오류가 발생했습니다.'}
            onRetry={handleRetry}
            onCheckOrderStatus={handleCheckOrderStatus}
          />
        )}
      </div>
    </div>
  );
}
