'use client';

/**
 * @fileoverview RetryButton 컴포넌트
 * @description 재시도 버튼 컴포넌트
 */

import React from 'react';
import type { RetryButtonProps } from './types';
import styles from './styles.module.css';

/**
 * RetryButton 컴포넌트
 * 
 * 오류 발생 시 사용자가 재시도할 수 있는 버튼입니다.
 * 재시도 시 결제 상태를 초기화하고 다시 시도할 수 있도록 합니다.
 */
export function RetryButton({
  onRetry,
  label = '다시 시도',
  disabled = false,
}: RetryButtonProps) {
  const handleClick = () => {
    if (!disabled && onRetry) {
      onRetry();
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      {label}
    </button>
  );
}
