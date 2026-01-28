'use client';

/**
 * @fileoverview SuccessMessage 컴포넌트
 * @description 결제 성공 메시지를 표시하는 컴포넌트
 */

import React from 'react';
import type { SuccessMessageProps } from './types';
import styles from './styles.module.css';

/**
 * SuccessMessage 컴포넌트
 * 
 * 결제 성공 메시지를 표시합니다.
 */
export function SuccessMessage({
  message = '결제가 완료되었습니다.',
  waitingRoomId,
}: SuccessMessageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>✓</div>
        <h2 className={styles.title}>결제 완료</h2>
        <p className={styles.message}>{message}</p>
        {waitingRoomId && (
          <p className={styles.subMessage}>
            대기실로 이동 중...
          </p>
        )}
      </div>
    </div>
  );
}
