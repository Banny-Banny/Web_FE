'use client';

/**
 * @fileoverview PaymentAmount 컴포넌트
 * @description 결제 금액을 명확하게 표시하는 컴포넌트
 */

import React from 'react';
import type { PaymentAmountProps } from './types';
import styles from './styles.module.css';

/**
 * PaymentAmount 컴포넌트
 * 
 * 총 결제 금액을 명확하게 표시합니다.
 * 숫자 형식으로 표시 (예: 10,000원)
 */
export function PaymentAmount({ amount }: PaymentAmountProps) {
  const formattedAmount = amount.toLocaleString('ko-KR');

  return (
    <div className={styles.container}>
      <span className={styles.label}>총 결제 금액</span>
      <span className={styles.amount}>₩{formattedAmount}</span>
    </div>
  );
}
