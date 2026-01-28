/**
 * components/my-egg-list/components/tab/index.tsx
 * 이스터에그 목록 탭 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 * - [✓] 모던하고 깔끔한 탭 UI
 *
 * 생성 시각: 2026-01-28
 */

'use client';

import React from 'react';
import styles from './styles.module.css';

interface TabProps {
  activeTab: 'discovered' | 'planted';
  onTabChange: (tab: 'discovered' | 'planted') => void;
  discoveredCount?: number;
  plantedCount?: number;
}

export function Tab({
  activeTab,
  onTabChange,
  discoveredCount = 5,
  plantedCount = 5,
}: TabProps) {
  return (
    <div className={styles.container}>
      <button
        className={styles.tabButton}
        onClick={() => onTabChange('discovered')}
        type="button"
        aria-label="발견한 알"
        aria-pressed={activeTab === 'discovered'}>
        <span
          className={`${styles.tabText} ${
            activeTab === 'discovered' ? styles.tabTextActive : ''
          }`}>
          발견한 알 ({discoveredCount})
        </span>
        {activeTab === 'discovered' && <span className={styles.underline} />}
      </button>
      <button
        className={styles.tabButton}
        onClick={() => onTabChange('planted')}
        type="button"
        aria-label="심은 알"
        aria-pressed={activeTab === 'planted'}>
        <span
          className={`${styles.tabText} ${
            activeTab === 'planted' ? styles.tabTextActive : ''
          }`}>
          심은 알 ({plantedCount})
        </span>
        {activeTab === 'planted' && <span className={styles.underline} />}
      </button>
    </div>
  );
}
