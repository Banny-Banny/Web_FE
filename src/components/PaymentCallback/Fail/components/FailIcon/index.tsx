'use client';

/**
 * @fileoverview FailIcon 컴포넌트
 * @description 결제 실패 아이콘을 표시하는 컴포넌트
 */

import React from 'react';
import type { FailIconProps } from './types';
import styles from './styles.module.css';

/**
 * FailIcon 컴포넌트
 * 
 * 결제 실패를 나타내는 아이콘을 표시합니다.
 */
export function FailIcon({ size = 64 }: FailIconProps) {
  return (
    <div
      className={styles.container}
      style={{ width: size, height: size }}
    >
      <span className={styles.icon}>✕</span>
    </div>
  );
}
