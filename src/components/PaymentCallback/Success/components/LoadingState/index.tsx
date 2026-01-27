'use client';

/**
 * @fileoverview LoadingState 컴포넌트
 * @description 결제 승인 처리 중 로딩 상태를 표시하는 컴포넌트
 */

import React from 'react';
import type { LoadingStateProps } from './types';
import styles from './styles.module.css';

/**
 * LoadingState 컴포넌트
 * 
 * 결제 승인 처리 중 로딩 상태를 표시합니다.
 * - 결제 승인 중: "결제 승인 중..."
 * - 대기실 생성 중: "대기실 생성 중..."
 */
export function LoadingState({ message = '처리 중...' }: LoadingStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinner} />
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
}
