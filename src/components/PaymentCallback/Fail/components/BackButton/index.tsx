'use client';

/**
 * @fileoverview BackButton 컴포넌트
 * @description 이전 페이지로 돌아가기 버튼 컴포넌트
 */

import React from 'react';
import type { BackButtonProps } from './types';
import styles from './styles.module.css';

/**
 * BackButton 컴포넌트
 * 
 * 이전 페이지로 돌아가기 위한 버튼을 표시합니다.
 */
export function BackButton({
  onBack,
  label = '이전 페이지로',
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className={styles.button}
    >
      {label}
    </button>
  );
}
