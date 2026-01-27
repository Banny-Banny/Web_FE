'use client';

/**
 * @fileoverview PaymentFail 메인 컨테이너 컴포넌트
 * @description 결제 실패 콜백 페이지의 최상위 컨테이너
 *
 * @note
 * Phase 5에서 실제 URL 파라미터로 교체되었습니다.
 */

import React from 'react';
import { FailIcon } from './components/FailIcon';
import { FailMessage } from './components/FailMessage';
import { RetryButton } from './components/RetryButton';
import { BackButton } from './components/BackButton';
import { usePaymentFail } from './hooks/usePaymentFail';
import styles from './styles.module.css';

/**
 * PaymentFail 컴포넌트
 * 
 * 결제 실패 콜백 페이지의 메인 컨테이너입니다.
 * - 실제 URL 파라미터에서 실패 정보 추출
 * - 사용자 친화적인 메시지 표시
 * - 재시도 및 뒤로가기 옵션 제공
 */
export function PaymentFail() {
  const { userFriendlyMessage, handleRetry, handleBack } = usePaymentFail();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FailIcon />
        <FailMessage message={userFriendlyMessage} />
        <div className={styles.actions}>
          <RetryButton onRetry={handleRetry} />
          <BackButton onBack={handleBack} />
        </div>
      </div>
    </div>
  );
}
