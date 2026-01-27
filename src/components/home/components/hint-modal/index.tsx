/**
 * 힌트 모달 (토스트/팝업)
 * 30m 밖에서 친구 이스터에그를 클릭했을 때 표시되는 작은 팝업
 * Figma 디자인: node-id=291-1301
 */

'use client';

import { useEffect } from 'react';
import { RiRouteLine, RiNavigationFill } from '@remixicon/react';
import type { HintModalProps } from './types';
import styles from './styles.module.css';

export function HintModal({ isOpen, distance = 70, direction = 0, onClose }: HintModalProps) {
  // 3초 후 자동으로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.popup}>
        {/* 방향 표시 아이콘 (현재 위치 기준) */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle}>
            <div 
              className={styles.iconArrow}
              style={{ transform: `rotate(${direction + 45}deg)` }}
            >
              <RiNavigationFill size={20} color="white" />
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className={styles.content}>
          <p className={styles.mainText}>근처에 이스터에그가 있어요!</p>
          <div className={styles.distanceInfo}>
            <RiRouteLine size={12} className={styles.distanceIcon} />
            <span className={styles.distanceText}>약 {distance}m 거리</span>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 진행 바 */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}
