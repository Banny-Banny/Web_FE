/**
 * FAB Button Component
 * Version: 1.0.0
 * Created: 2025-01-26
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.module.css → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { RiAddLine } from '@remixicon/react';
import type { FabButtonProps } from './types';
import styles from './styles.module.css';
import { default as FabEggSvg } from '@/assets/images/fab_btn_egg.svg';
import { default as FabCapSvg } from '@/assets/images/fab_btn_cap.svg';

// 텍스트 상수
const LABELS = {
  easterEgg: '이스터에그',
  timeCapsule: '타임캡슐',
};

export function FabButton({
  onEasterEggClick,
  onTimeCapsuleClick,
  className = '',
}: FabButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainButtonPress = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleSubButtonPress = useCallback((callback?: () => void) => {
    setIsExpanded(false);
    callback?.();
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Dimmed Overlay */}
      {isExpanded && (
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.overlayPressable}
            onClick={() => handleMainButtonPress()}
            aria-label="닫기"
          />
        </div>
      )}

      {/* Sub Buttons Container */}
      {isExpanded && (
        <div className={styles.subButtonsContainer}>
          {/* Easter Egg Button */}
          <button
            type="button"
            className={styles.subButtonRow}
            onClick={() => handleSubButtonPress(onEasterEggClick)}
            aria-label={LABELS.easterEgg}
          >
            <span className={styles.subButtonLabel}>{LABELS.easterEgg}</span>
            <FabEggSvg
              className={styles.fabButtonIcon}
              aria-label="이스터에그 FAB 아이콘"
            />
          </button>

          {/* Time Capsule Button */}
          <button
            type="button"
            className={styles.subButtonRow}
            onClick={() => handleSubButtonPress(onTimeCapsuleClick)}
            aria-label={LABELS.timeCapsule}
          >
            <span className={styles.subButtonLabel}>{LABELS.timeCapsule}</span>
            <FabCapSvg
              className={styles.fabButtonIcon}
              aria-label="타임캡슐 FAB 아이콘"
            />
          </button>
        </div>
      )}

      {/* Main FAB Button */}
      <div className={styles.mainButtonContainer}>
        <button
          type="button"
          className={styles.mainButton}
          onClick={handleMainButtonPress}
          aria-label={isExpanded ? '닫기' : '메뉴 열기'}
          aria-expanded={isExpanded}
        >
          <div className={`${styles.mainButtonInner} ${isExpanded ? styles.rotated : ''}`}>
            <RiAddLine className={styles.mainButtonIcon} size={36} aria-hidden="true" />
          </div>
          <div className={styles.mainButtonShadowInset} />
        </button>
      </div>
    </div>
  );
}
