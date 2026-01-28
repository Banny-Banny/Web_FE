/**
 * components/page-header/index.tsx
 * 페이지 헤더 공통 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] @remixicon/react 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * 생성 시각: 2026-01-28
 */

'use client';

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import styles from './styles.module.css';

interface PageHeaderProps {
  /** 제목 */
  title: string;
  /** 닫기 버튼 클릭 핸들러 */
  onButtonPress?: () => void;
  /** 서브타이틀 (선택) */
  subtitle?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 페이지 헤더 공통 컴포넌트
 * 
 * 제목, 닫기 버튼, 서브타이틀을 포함하는 공통 헤더 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="이스터에그"
 *   subtitle="발견한 알 12개 · 심은 알 26개 (활성 1/1)"
 *   onButtonPress={() => router.back()}
 * />
 * ```
 */
export function PageHeader({
  title,
  onButtonPress,
  subtitle,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.headerRow}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleText}>{title}</h1>
        </div>
        {onButtonPress && (
          <button
            className={styles.button}
            onClick={onButtonPress}
            type="button"
            aria-label="닫기">
            <RiCloseLine size={20} className={styles.icon} />
          </button>
        )}
      </div>
      {subtitle && (
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitleText}>{subtitle}</p>
        </div>
      )}
    </div>
  );
}
