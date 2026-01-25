'use client';

/**
 * @fileoverview Spinner 컴포넌트
 * @description 로딩 스피너 컴포넌트
 * 
 * [Pure UI Component] 로딩 스피너
 * - 전역적으로 사용 가능한 로딩 인디케이터
 */

import React from 'react';
import styles from './styles.module.css';
import type { SpinnerProps } from './types';

/**
 * Spinner 컴포넌트
 * 
 * 로딩 상태를 표시하는 스피너 컴포넌트입니다.
 * 
 * @param {SpinnerProps} props - Spinner 컴포넌트의 props
 * @param {'small' | 'large'} [props.size='large'] - 스피너 크기
 * @param {string} [props.color] - 스피너 색상 (기본값: blue-500)
 * @param {boolean} [props.fullScreen=false] - 전체 화면 오버레이 표시 여부
 * @param {string} [props.className] - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * // 기본 사용
 * <Spinner size="large" />
 * 
 * // 작은 스피너
 * <Spinner size="small" />
 * 
 * // 커스텀 색상
 * <Spinner size="large" color="#FF0000" />
 * 
 * // 전체 화면 오버레이
 * {isLoading && <Spinner size="large" fullScreen={true} />}
 * ```
 */
export const Spinner = React.memo(function Spinner({ 
  size = 'large', 
  color, 
  fullScreen = false,
  className = '',
}: SpinnerProps = {}) {
  // 기본 색상은 디자인 토큰의 blue-500 사용
  const spinnerColor = color || 'var(--color-blue-500)'; // Colors.blue[500]
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;
  const spinnerSizeClass = size === 'small' ? styles.sizeSmall : styles.sizeLarge;
  
  const containerClasses = [containerStyle, className].filter(Boolean).join(' ');
  const spinnerClasses = [styles.spinner, spinnerSizeClass].filter(Boolean).join(' ');

  // 스피너 스타일 (색상 적용)
  // ActivityIndicator 스타일: 상단만 색상이 있고 나머지는 투명
  const spinnerStyle: React.CSSProperties = {
    borderTopColor: spinnerColor,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  };

  return (
    <div className={containerClasses} role="status" aria-label="로딩 중">
      <div className={spinnerClasses} style={spinnerStyle} aria-hidden="true" />
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
