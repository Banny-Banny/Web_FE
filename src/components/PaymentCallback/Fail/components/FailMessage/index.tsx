'use client';

/**
 * @fileoverview FailMessage 컴포넌트
 * @description 결제 실패 메시지를 표시하는 컴포넌트
 */

import React from 'react';
import type { FailMessageProps } from './types';
import styles from './styles.module.css';

/**
 * FailMessage 컴포넌트
 * 
 * 결제 실패 메시지를 표시합니다.
 */
export function FailMessage({ message }: FailMessageProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>결제 실패</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
