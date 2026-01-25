'use client';

/**
 * @fileoverview Button 컴포넌트
 * @description 디자인 토큰 기반 버튼 컴포넌트
 */

import React from 'react';
import styles from './styles.module.css';
import type { ButtonProps, ButtonVariant } from './types';

/**
 * Button 컴포넌트
 * 
 * @example
 * ```tsx
 * <Button label="클릭하세요" variant="primary" size="L" onPress={handleClick} />
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = 'primary',
      size = 'L',
      icon,
      iconPosition = 'left',
      fullWidth = true,
      width,
      disabled = false,
      onPress,
      className = '',
      ...props
    },
    ref
  ) => {
    // disabled 상태일 때 variant를 'disabled'로 변경
    const actualVariant: ButtonVariant = disabled ? 'disabled' : variant;

    // className 조합
    const buttonClasses = [
      styles.button,
      styles[`variant${actualVariant.charAt(0).toUpperCase() + actualVariant.slice(1)}`],
      styles[`size${size}`],
      fullWidth && width === undefined && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // width 스타일 계산
    const widthStyle = width !== undefined 
      ? typeof width === 'number' 
        ? { width: `${width}px` }
        : { width }
      : {};

    // 아이콘 표시 여부
    const showIconOnly = iconPosition === 'only' && icon;
    const showIconWithTextLeft = iconPosition === 'left' && icon;
    const showIconWithTextRight = iconPosition === 'right' && icon;
    const hasIcon = icon !== undefined;

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        onClick={disabled ? undefined : onPress}
        style={widthStyle}
        {...props}
      >
        <span className={styles.content}>
          {showIconWithTextLeft && hasIcon && (
            <span className={styles.icon} style={{ marginRight: '8px' }}>
              {/* 아이콘은 나중에 추가 */}
            </span>
          )}
          {!showIconOnly && <span className={styles.text}>{label}</span>}
          {showIconWithTextRight && hasIcon && (
            <span className={styles.icon} style={{ marginLeft: '8px' }}>
              {/* 아이콘은 나중에 추가 */}
            </span>
          )}
          {showIconOnly && hasIcon && (
            <span className={styles.icon}>
              {/* 아이콘은 나중에 추가 */}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
