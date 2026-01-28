'use client';

/**
 * @fileoverview MediaLimits 컴포넌트
 * @description 미디어 제한사항 표시 컴포넌트
 * 
 * @description
 * - 대기실 설정에 따른 미디어 제한사항을 표시
 * - 사진 개수 제한 표시
 * - 음악/영상 허용 여부 표시
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React from 'react';
import type { MediaLimitsProps } from '../../types';
import styles from './styles.module.css';

/**
 * MediaLimits 컴포넌트
 * 
 * 대기실 설정에 따른 미디어 제한사항을 표시합니다.
 * 
 * @param {MediaLimitsProps} props - MediaLimits 컴포넌트의 props
 */
export function MediaLimits({ settings, currentImageCount }: MediaLimitsProps) {
  if (!settings) {
    return null;
  }

  const maxImages = settings.maxImagesPerPerson ?? 0;
  const hasMusic = settings.hasMusic ?? false;
  const hasVideo = settings.hasVideo ?? false;

  return (
    <div className={styles.container}>
      <div className={styles.limitItem}>
        <span className={styles.label}>사진</span>
        <span className={styles.value}>
          {currentImageCount}/{maxImages}
        </span>
      </div>
      
      {hasMusic && (
        <div className={styles.limitItem}>
          <span className={styles.label}>음성</span>
          <span className={styles.value}>1개</span>
        </div>
      )}
      
      {hasVideo && (
        <div className={styles.limitItem}>
          <span className={styles.label}>동영상</span>
          <span className={styles.value}>1개</span>
        </div>
      )}
    </div>
  );
}

export default MediaLimits;
