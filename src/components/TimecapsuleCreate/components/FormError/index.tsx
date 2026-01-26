'use client';

/**
 * @fileoverview FormError 컴포넌트
 * @description 에러 메시지 표시 컴포넌트
 */

import React from 'react';
import type { FormErrorProps } from './types';
import styles from './styles.module.css';

/**
 * FormError 컴포넌트
 * 
 * 폼 필드의 에러 메시지를 표시하는 컴포넌트입니다.
 * 접근성을 고려하여 aria-live 속성을 포함합니다.
 * 
 * @param {FormErrorProps} props - FormError 컴포넌트의 props
 */
export function FormError({
  message,
  fieldName,
  className = '',
}: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <span
      className={`${styles.error} ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      id={fieldName ? `${fieldName}-error` : undefined}
    >
      {message}
    </span>
  );
}
