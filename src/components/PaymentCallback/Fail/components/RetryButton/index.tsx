'use client';

/**
 * @fileoverview RetryButton 컴포넌트
 * @description 결제 재시도 버튼 컴포넌트
 */

import React from 'react';
import type { RetryButtonProps } from './types';
import styles from './styles.module.css';

/**
 * RetryButton 컴포넌트
 * 
 * 결제 재시도를 위한 버튼을 표시합니다.
 */
export function RetryButton({
  onRetry,
  label = '다시 시도',
}: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className={styles.button}
    >
      {label}
    </button>
  );
}
