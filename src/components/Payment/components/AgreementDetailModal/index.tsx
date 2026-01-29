'use client';

/**
 * @fileoverview AgreementDetailModal 컴포넌트
 * @description 약관 상세 내용을 보여주는 모달 컴포넌트
 */

import React, { useEffect } from 'react';
import { AGREEMENT_DETAILS } from '../../constants/agreements';
import type { AgreementDetailModalProps } from './types';
import styles from './styles.module.css';

/**
 * AgreementDetailModal 컴포넌트
 *
 * 약관 상세 내용을 모달로 표시합니다.
 */
export function AgreementDetailModal({
  visible,
  selectedIndex,
  onClose,
}: AgreementDetailModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!visible) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible || selectedIndex === null) {
    return null;
  }

  const agreement = AGREEMENT_DETAILS[selectedIndex];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{agreement.title}</h2>
          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <span className={styles.modalCloseText}>×</span>
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div className={styles.modalContent}>
          {agreement.content.map((section, index) => (
            <div key={index} className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                {section.sectionTitle}
              </h3>
              <p className={styles.modalText}>{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
