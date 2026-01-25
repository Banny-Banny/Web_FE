'use client';

/**
 * @fileoverview Button 컴포넌트
 * @description CSS 모듈과 TypeScript 토큰을 활용한 버튼 컴포넌트 예시
 */

import React from 'react';
import styles from './styles.module.css';
import type { ButtonProps } from './types';

/**
 * 재사용 가능한 Button 컴포넌트
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   클릭하세요
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      isLoading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
