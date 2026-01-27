'use client';

/**
 * @fileoverview ErrorDisplay 컴포넌트
 * @description 오류 메시지를 표시하는 컴포넌트
 */

import React from 'react';
import type { ErrorDisplayProps } from './types';
import styles from './styles.module.css';

/**
 * ErrorDisplay 컴포넌트
 * 
 * 결제 과정에서 발생하는 오류를 사용자에게 명확하게 표시합니다.
 * - 네트워크 오류
 * - 결제 실패
 * - 주문 정보 오류
 * - 일반 오류
 */
export function ErrorDisplay({ message, type = 'general' }: ErrorDisplayProps) {
  // 오류 타입에 따른 제목 설정
  const getTitle = () => {
    switch (type) {
      case 'network':
        return '네트워크 오류';
      case 'payment':
        return '결제 오류';
      case 'order':
        return '주문 정보 오류';
      default:
        return '오류가 발생했습니다';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{getTitle()}</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
