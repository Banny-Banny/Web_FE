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
 * 디자인 토큰 기반의 재사용 가능한 버튼 컴포넌트입니다.
 * 
 * @param {ButtonProps} props - Button 컴포넌트의 props
 * @param {string} props.label - 버튼에 표시될 텍스트 (필수)
 * @param {ButtonVariant} [props.variant='primary'] - 버튼 스타일 variant ('primary' | 'outline' | 'danger' | 'disabled')
 * @param {ButtonSize} [props.size='L'] - 버튼 크기 ('L' | 'M' | 'S')
 * @param {string} [props.icon] - 아이콘 이름 (향후 아이콘 시스템 추가 예정)
 * @param {IconPosition} [props.iconPosition='left'] - 아이콘 위치 ('left' | 'right' | 'only')
 * @param {boolean} [props.fullWidth=true] - 전체 너비 사용 여부
 * @param {string | number} [props.width] - 커스텀 너비 (px 또는 %)
 * @param {boolean} [props.disabled=false] - 비활성화 상태
 * @param {() => void} props.onPress - 버튼 클릭 핸들러 (필수)
 * @param {string} [props.className] - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * // 기본 사용
 * <Button label="클릭하세요" variant="primary" size="L" onPress={handleClick} />
 * 
 * // Outline 버튼
 * <Button label="취소" variant="outline" size="M" onPress={handleCancel} />
 * 
 * // 비활성화 버튼
 * <Button label="제출" variant="primary" size="L" disabled onPress={handleSubmit} />
 * 
 * // 커스텀 너비
 * <Button label="작은 버튼" variant="primary" size="S" width={200} onPress={handleClick} />
 * ```
 * 
 * @see {@link ButtonVariant} - 버튼 variant 타입
 * @see {@link ButtonSize} - 버튼 크기 타입
 */
const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && onPress) {
            e.preventDefault();
            onPress();
          }
          props.onKeyDown?.(e);
        }}
        style={widthStyle}
        aria-label={props['aria-label'] || label}
        aria-disabled={disabled}
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

ButtonComponent.displayName = 'Button';

export const Button = React.memo(ButtonComponent);

export default Button;
