/**
 * Mobile Frame 컴포넌트
 * 
 * @description
 * - 375px 고정 너비 모바일 프레임 컨테이너
 * - 중앙 정렬 및 배경색 적용
 * - 모든 페이지의 기본 래퍼
 */

import React from 'react';
import styles from './styles.module.css';
import type { MobileFrameProps } from './types';

export default function MobileFrame({
  children,
  className,
}: MobileFrameProps) {
  return (
    <div className={`${styles.frame} ${className || ''}`}>
      {children}
    </div>
  );
}

export type { MobileFrameProps } from './types';
