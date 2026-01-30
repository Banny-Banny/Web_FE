'use client';

import React from 'react';
import { RiTimeLine, RiCalendarLine, RiCalendarCheckLine } from '@remixicon/react';
import { formatCapsuleDate, formatDday } from '@/commons/utils/date';
import type { LockedCapsuleListProps } from '../types';
import styles from './LockedCapsuleList.module.css';

export function LockedCapsuleList({ capsules }: LockedCapsuleListProps) {
  if (capsules.length === 0) {
    return (
      <div className={styles.list}>
        <p className={styles.empty}>잠긴 캡슐이 없어요</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {capsules.map((capsule) => (
        <div key={capsule.id} className={styles.card}>
          <div className={styles.cardImageContainer}>
            <div className={styles.cardGradient} />
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <span className={styles.emoji}>💊</span>
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.titleContainer}>
                  <h3 className={styles.title}>{capsule.title}</h3>
                </div>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <RiCalendarLine size={16} className={styles.icon} />
                    <span className={styles.detailText}>
                      묻은 날짜: {capsule.createdAt ? formatCapsuleDate(capsule.createdAt) : '—'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <RiCalendarCheckLine size={16} className={styles.icon} />
                    <span className={styles.detailText}>
                      열리는 날짜: {capsule.openDate ? formatCapsuleDate(capsule.openDate) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <RiTimeLine size={16} className={styles.footerIcon} />
            <span className={styles.footerText}>{formatDday(capsule.openDate)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
