/**
 * FAB Button 컴포넌트
 * 우측 하단에 배치된 Floating Action Button
 * 이스터에그/타임캡슐 생성 선택 기능 제공
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { FabButtonProps } from './types';
import styles from './styles.module.css';
import PlusIcon from '@/assets/icons/plus-icon.svg';
import CloseIcon from '@/assets/icons/close-icon.svg';
import EggIcon from '@/assets/icons/egg-icon.svg';
import CapsuleIcon from '@/assets/icons/capsule-icon.svg';

/**
 * FAB Button 컴포넌트
 */
export function FabButton({
  onEasterEggClick,
  onTimeCapsuleClick,
  className = '',
}: FabButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // FAB 버튼 클릭 핸들러
  const handleFabClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // 오버레이 클릭 핸들러 (닫기)
  const handleOverlayClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 이스터에그 선택 핸들러
  const handleEasterEggClick = useCallback(() => {
    setIsOpen(false);
    onEasterEggClick?.();
  }, [onEasterEggClick]);

  // 타임캡슐 선택 핸들러
  const handleTimeCapsuleClick = useCallback(() => {
    setIsOpen(false);
    onTimeCapsuleClick?.();
  }, [onTimeCapsuleClick]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFabClick();
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  }, [handleFabClick, isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* 오버레이 배경 */}
      <div
        className={`${styles.overlay} ${isOpen ? '' : styles.hidden}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* FAB 버튼 및 선택 옵션 컨테이너 */}
      <div className={`${styles.container} ${className}`}>
        {/* 선택 옵션 */}
        <div className={`${styles.optionsContainer} ${isOpen ? '' : styles.hidden}`}>
          {/* 타임캡슐 옵션 */}
          <div className={styles.optionItem}>
            <span className={styles.optionLabel}>타임캡슐</span>
            <button
              type="button"
              className={styles.optionButton}
              onClick={handleTimeCapsuleClick}
              aria-label="타임캡슐 생성"
              tabIndex={isOpen ? 0 : -1}
            >
              <CapsuleIcon className={styles.optionIcon} aria-hidden="true" />
            </button>
          </div>

          {/* 이스터에그 옵션 */}
          <div className={styles.optionItem}>
            <span className={styles.optionLabel}>이스터에그</span>
            <button
              type="button"
              className={styles.optionButton}
              onClick={handleEasterEggClick}
              aria-label="이스터에그 생성"
              tabIndex={isOpen ? 0 : -1}
            >
              <EggIcon className={styles.optionIcon} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* FAB 메인 버튼 */}
        <button
          type="button"
          className={`${styles.fabButton} ${isOpen ? styles.isOpen : ''}`}
          onClick={handleFabClick}
          onKeyDown={handleKeyDown}
          aria-label={isOpen ? '선택 옵션 닫기' : '콘텐츠 생성 옵션 열기'}
          aria-expanded={isOpen}
          tabIndex={0}
        >
          <span className={styles.srOnly}>
            {isOpen ? '선택 옵션 닫기' : '콘텐츠 생성 옵션 열기'}
          </span>
          <div className={styles.iconContainer}>
            <PlusIcon className={styles.plusIcon} aria-hidden="true" />
            <CloseIcon className={styles.closeIcon} aria-hidden="true" />
          </div>
        </button>
      </div>
    </>
  );
}
