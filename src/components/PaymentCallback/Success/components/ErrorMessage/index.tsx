'use client';

/**
 * @fileoverview ErrorMessage 컴포넌트
 * @description 결제 승인 처리 중 오류를 표시하는 컴포넌트
 */

import React from 'react';
import type { ErrorMessageProps } from './types';
import styles from './styles.module.css';

/**
 * ErrorMessage 컴포넌트
 * 
 * 결제 승인 처리 중 발생한 오류를 표시합니다.
 * - 재시도 옵션 제공
 * - 주문 상태 조회 옵션 제공 (US3)
 */
export function ErrorMessage({
  message,
  onRetry,
  onCheckOrderStatus,
}: ErrorMessageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>✕</div>
        <h2 className={styles.title}>결제 처리 오류</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={styles.retryButton}
            >
              다시 시도
            </button>
          )}
          {onCheckOrderStatus && (
            <button
              type="button"
              onClick={onCheckOrderStatus}
              className={styles.checkButton}
            >
              주문 상태 확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
