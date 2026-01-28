/**
 * components/my-egg-list/components/item/index.tsx
 * 이스터에그 목록 아이템 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] @remixicon/react 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 585:2856
 * 생성 시각: 2026-01-28
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { RiEyeLine, RiMapPinLine, RiImageLine, RiMicLine, RiVidiconLine } from '@remixicon/react';
import styles from './styles.module.css';

// 소멸된 알 이미지 경로
const BROKEN_EGG_ICON = '/assets/images/broken_egg.svg';

export interface ItemProps {
  id?: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  eggIcon?: string | number;
  hasImage?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  viewCount?: number;
  showViewCount?: boolean;
  status?: 'ACTIVE' | 'EXPIRED';
  onPress?: () => void;
}

export function Item({
  title,
  description,
  location,
  date,
  eggIcon,
  hasImage,
  hasAudio,
  hasVideo,
  viewCount,
  showViewCount = false,
  status,
  onPress,
}: ItemProps) {
  const isExpired = status === 'EXPIRED';

  // 소멸된 알이면 broken_egg.svg 사용, 아니면 기존 eggIcon 사용
  const displayIcon = isExpired ? BROKEN_EGG_ICON : eggIcon;

  // Image src 타입 변환
  const iconSrc = displayIcon 
    ? (typeof displayIcon === 'string' 
        ? displayIcon 
        : typeof displayIcon === 'number' 
          ? String(displayIcon)
          : displayIcon)
    : null;

  return (
    <button
      className={`${styles.container} ${isExpired ? styles.containerExpired : ''}`}
      onClick={onPress}
      type="button"
      aria-label={title}>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          {iconSrc && (
            <div className={styles.iconContainer}>
              <Image
                src={iconSrc}
                alt=""
                width={52}
                height={52}
                className={styles.icon}
              />
            </div>
          )}
          <div className={styles.textContainer}>
            <div className={styles.titleRow}>
              <h3 className={styles.titleText}>{title}</h3>
              {showViewCount && viewCount !== undefined && (
                <div className={styles.viewCountContainer}>
                  <RiEyeLine size={13} className={styles.viewCountIcon} />
                  <span className={styles.viewCountText}>{viewCount}</span>
                </div>
              )}
            </div>
            <p className={styles.descriptionText}>{description}</p>
          </div>
        </div>
        <div className={styles.footerRow}>
          <div className={styles.metaContainer}>
            {location && (
              <>
                <div className={styles.locationContainer}>
                  <div className={styles.locationIconContainer}>
                    <RiMapPinLine size={13} className={styles.locationIcon} />
                  </div>
                  <span className={styles.metaText}>{location}</span>
                </div>
                <div className={styles.divider} />
              </>
            )}
            <span className={styles.metaText}>{date}</span>
          </div>
          <div className={styles.actionContainer}>
            {hasImage && (
              <div className={styles.actionButton}>
                <RiImageLine size={16} className={styles.actionIcon} />
              </div>
            )}
            {hasAudio && (
              <div className={styles.actionButton}>
                <RiMicLine size={16} className={styles.actionIcon} />
              </div>
            )}
            {hasVideo && (
              <div className={styles.actionButton}>
                <RiVidiconLine size={16} className={styles.actionIcon} />
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
