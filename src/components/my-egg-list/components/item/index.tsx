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
import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { default as BrokenEggSvg } from '@/assets/images/broken_egg.svg';
import { default as FilledEggSvg } from '@/assets/images/filled_egg.svg';
import styles from './styles.module.css';

export interface ItemProps {
  id?: string;
  title: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  date: string;
  eggIcon?: string | number | React.ComponentType<{ className?: string; width?: number; height?: number }>;
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
  latitude,
  longitude,
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

  // 카카오 주소 조회 훅 사용
  const { address: addressFromCoord } = useKakaoAddress({
    lat: latitude,
    lng: longitude,
    existingAddress: location,
  });

  // 주소 우선순위: location > addressFromCoord > 빈 문자열
  // location이 없으면 API로 가져온 주소 사용
  const displayLocation = addressFromCoord || location || '';

  // 소멸된 알이면 broken_egg.svg 사용, 아니면 기존 eggIcon 사용
  // eggIcon이 React 컴포넌트면 직접 사용, 문자열/숫자면 Image 컴포넌트 사용, 없으면 기본 filled_egg.svg 사용
  const getIconContent = () => {
    if (isExpired) {
      return (
        <BrokenEggSvg
          className={styles.icon}
          aria-label="소멸된 알"
        />
      );
    }
    
    if (!eggIcon) {
      return (
        <FilledEggSvg
          className={styles.icon}
          aria-label="활성 알"
        />
      );
    }
    
    // eggIcon이 React 컴포넌트인 경우
    if (typeof eggIcon === 'function' || (typeof eggIcon === 'object' && '$$typeof' in eggIcon)) {
      const IconComponent = eggIcon as React.ComponentType<{ className?: string }>;
      return (
        <IconComponent
          className={styles.icon}
        />
      );
    }
    
    // eggIcon이 문자열/숫자인 경우 Image 컴포넌트 사용
    const iconSrc = typeof eggIcon === 'string' 
      ? eggIcon 
      : String(eggIcon);
    
    return (
      <Image
        src={iconSrc}
        alt=""
        width={52}
        height={52}
        className={styles.icon}
        loading="lazy"
      />
    );
  };

  return (
    <button
      className={`${styles.container} ${isExpired ? styles.containerExpired : ''}`}
      onClick={onPress}
      type="button"
      aria-label={title}>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.iconContainer}>
            {getIconContent()}
          </div>
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
            {displayLocation && (
              <>
                <div className={styles.locationContainer}>
                  <div className={styles.locationIconContainer}>
                    <RiMapPinLine size={13} className={styles.locationIcon} />
                  </div>
                  <span className={styles.metaText}>{displayLocation}</span>
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

// 메모이제이션 적용: props가 변경되지 않으면 리렌더링 방지
export default React.memo(Item);
