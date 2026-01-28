/**
 * components/my-egg-list/components/header/index.tsx
 * 이스터에그 목록 헤더 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] @remixicon/react 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 161:29250
 * 생성 시각: 2026-01-28
 */

'use client';

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import styles from './styles.module.css';

interface HeaderProps {
  onButtonPress?: () => void;
  discoveredCount?: number;
  plantedCount?: number;
  activeCount?: number;
}

export function Header({
  onButtonPress,
  discoveredCount = 5,
  plantedCount = 5,
  activeCount = 3,
}: HeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleText}>이스터에그</h1>
        </div>
        <button
          className={styles.button}
          onClick={onButtonPress}
          type="button"
          aria-label="닫기">
          <RiCloseLine size={20} className={styles.icon} />
        </button>
      </div>
      <div className={styles.subtitleContainer}>
        <p className={styles.subtitleText}>
          발견한 알 {discoveredCount}개 · 심은 알 {plantedCount}개 (활성 {activeCount}/{activeCount})
        </p>
      </div>
    </div>
  );
}
