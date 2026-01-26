'use client';

/**
 * @fileoverview PaymentStatus 컴포넌트
 * @description 결제 진행 상태 및 결과를 표시하는 컴포넌트
 */

import React from 'react';
import type { PaymentStatusProps } from './types';
import styles from './styles.module.css';

/**
 * 결제 상태에 따른 메시지 반환
 */
function getStatusMessage(status: PaymentStatusProps['status']): string {
  switch (status) {
    case 'idle':
      return '';
    case 'loading':
      return '주문 정보를 불러오는 중...';
    case 'pending':
      return '결제를 진행하는 중...';
    case 'success':
      return '결제가 완료되었습니다.';
    case 'failed':
      return '결제 처리 중 오류가 발생했습니다.';
    default:
      return '';
  }
}

/**
 * PaymentStatus 컴포넌트
 * 
 * 결제 진행 상태 및 결과를 표시합니다.
 * - idle: 표시하지 않음
 * - loading: 주문 정보 로딩 중
 * - pending: 결제 진행 중
 * - success: 결제 완료
 * - failed: 결제 실패
 */
export function PaymentStatus({ status, error }: PaymentStatusProps) {
  // idle 상태일 때는 표시하지 않음
  if (status === 'idle') {
    return null;
  }

  const message = error || getStatusMessage(status);
  const statusClass = styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`];

  return (
    <div className={`${styles.container} ${statusClass}`}>
      <div className={styles.content}>
        {status === 'loading' || status === 'pending' ? (
          <div className={styles.spinner} />
        ) : null}
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
}
