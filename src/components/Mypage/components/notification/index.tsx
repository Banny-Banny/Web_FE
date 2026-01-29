'use client';

/**
 * 알림(소식) 컴포넌트
 *
 * @description
 * - 마이페이지 헤더의 notificationButton(알림 버튼)을 눌렀을 때 진입
 * - 마이페이지 내비게이션 메뉴에서 '소식' 메뉴항목을 눌렀을 때 진입
 * - 알림 목록 표시, 닫기 시 onClose 호출
 * - CSS Modules 기반 스타일링, 마이페이지와 일관된 디자인 시스템 유지
 */

import React from 'react';
import { RiCloseLine, RiNotificationLine } from '@remixicon/react';
import styles from './styles.module.css';

/**
 * 알림 컴포넌트 Props
 */
export interface NotificationProps {
  /** 알림 화면 닫기 핸들러 (notificationButton / '소식' 메뉴 진입 시 부모에서 전달) */
  onClose?: () => void;
  className?: string;
}

/**
 * Notification 컴포넌트
 *
 * @param {NotificationProps} props - 컴포넌트 props
 */
export function Notification({ className = '', onClose }: NotificationProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>알림</h2>
          <div className={styles.headerRight}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="닫기"
            >
              <RiCloseLine size={20} className={styles.closeIcon} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.emptyState}>
            <RiNotificationLine size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>알림이 없습니다</p>
            <p className={styles.emptySubtext}>
              새로운 소식이 있으면 여기에 표시됩니다.
            </p>
          </div>
        </div>

        <div className={styles.versionInfo}>VERSION 1.0.0 © 2024</div>
      </div>
    </div>
  );
}

export default Notification;
