'use client';

/**
 * @fileoverview TimeCapsuleHeader 컴포넌트
 * @description 타임캡슐 헤더 공통 컴포넌트
 *
 * @description
 * - step-info, step-room 컴포넌트의 헤더를 통합한 공통 컴포넌트
 * - 순수 UI 컴포넌트로 구현 (비즈니스 로직 없음)
 * - 모든 이벤트 핸들러는 props로 받아서 사용
 *
 * @example
 * ```typescript
 * // 기본 헤더
 * <TimeCapsuleHeader
 *   title="타임캡슐 만들기"
 *   onBack={() => router.back()}
 * />
 *
 * // 확장 헤더
 * <TimeCapsuleHeader
 *   title="캡슐 대기실"
 *   onBack={() => router.back()}
 *   rightIcons={[
 *     { icon: 'more', onPress: handleMore },
 *     { icon: 'close', onPress: handleClose },
 *   ]}
 * />
 * ```
 */

import React from 'react';
import Image from 'next/image';
import RiArrowLeftLine from 'remixicon-react/ArrowLeftLineIcon';
import RiMore2Fill from 'remixicon-react/More2FillIcon';
import RiCloseLine from 'remixicon-react/CloseLineIcon';
import { Icon } from '../icon';
import type { IconName } from '../icon/types';
import { Colors, Typography } from '@/commons/styles';
import styles from './styles.module.css';
import type { TimeCapsuleHeaderProps, HeaderIconName } from './types';

/**
 * TimeCapsuleHeader 컴포넌트
 * 
 * 타임캡슐 관련 페이지에서 사용하는 공통 헤더 컴포넌트입니다.
 * 뒤로가기 버튼, 제목, 오른쪽 아이콘 버튼들을 포함할 수 있습니다.
 * 
 * @param {TimeCapsuleHeaderProps} props - TimeCapsuleHeader 컴포넌트의 props
 * @param {string} props.title - 헤더 제목 (필수)
 * @param {() => void} [props.onBack] - 뒤로가기 버튼 클릭 핸들러
 * @param {HeaderIcon[]} [props.rightIcons] - 오른쪽 아이콘 버튼 배열
 * @param {boolean} [props.showBorder=true] - 하단 보더 표시 여부
 * @param {string} [props.backgroundColor] - 배경색 (기본값: white-500)
 * @param {'center' | 'left'} [props.titleAlign='center'] - 제목 정렬 방식
 * @param {string} [props.className] - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * // 기본 헤더 (뒤로가기 + 제목)
 * <TimeCapsuleHeader
 *   title="타임캡슐 만들기"
 *   onBack={() => router.back()}
 * />
 * 
 * // 확장 헤더 (뒤로가기 + 제목 + 아이콘)
 * <TimeCapsuleHeader
 *   title="캡슐 대기실"
 *   onBack={() => router.back()}
 *   rightIcons={[
 *     {
 *       icon: 'more',
 *       onPress: handleMore,
 *       accessibilityLabel: '더보기',
 *     },
 *   ]}
 * />
 * 
 * // 왼쪽 정렬 제목
 * <TimeCapsuleHeader
 *   title="타임캡슐"
 *   titleAlign="left"
 *   onBack={() => router.back()}
 * />
 * ```
 */
export const TimeCapsuleHeader = React.memo(function TimeCapsuleHeader({
  title,
  onBack,
  rightIcons,
  showBorder = true,
  backgroundColor = Colors.white[500],
  titleAlign = 'center',
  className = '',
}: TimeCapsuleHeaderProps) {
  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ backgroundColor }}
    >
      <div
        className={`${styles.headerContainer} ${
          titleAlign === 'left' && !onBack ? styles.headerContainerLeft : ''
        }`}
      >
        {/* 왼쪽: 뒤로가기 버튼 */}
        {onBack && (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label="뒤로가기"
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && onBack) {
                e.preventDefault();
                onBack();
              }
            }}
          >
            <RiArrowLeftLine size={24} color={Colors.black[500]} />
          </button>
        )}

        {/* 제목 */}
        <div
          className={`${styles.headerCenter} ${
            titleAlign === 'left'
              ? styles.headerCenterLeft
              : styles.headerCenterCenter
          }`}
        >
          <h1
            className={`${styles.title} ${
              titleAlign === 'left' ? styles.titleLeft : ''
            }`}
            style={{
              ...Typography.header.h1,
              ...(titleAlign === 'left' ? { lineHeight: '26.4px' } : {}),
            }}
          >
            {title}
          </h1>
        </div>

        {/* 오른쪽: 아이콘 버튼들 */}
        {rightIcons && rightIcons.length > 0 ? (
          <div className={styles.headerRight}>
            {rightIcons.map((rightIcon, index) => {
              const iconSize = rightIcon.size || 24;
              const iconColor = rightIcon.color || Colors.black[500];
              const accessibilityLabel =
                rightIcon.accessibilityLabel ||
                `${rightIcon.icon || '아이콘'} 버튼`;

              // Icon 컴포넌트를 사용할 수 있는 경우 (lucide-react 아이콘이 아닌 경우)
              const lucideIcons: HeaderIconName[] = ['arrow-left', 'more', 'more-2-fill', 'close', 'close-line'];
              if (rightIcon.icon && !lucideIcons.includes(rightIcon.icon)) {
                return (
                  <button
                    key={index}
                    type="button"
                    className={styles.iconButton}
                    style={{ 
                      width: Math.max(iconSize, 44), 
                      height: Math.max(iconSize, 44),
                      minWidth: 44,
                      minHeight: 44,
                    }}
                    onClick={rightIcon.onPress}
                    aria-label={accessibilityLabel}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && rightIcon.onPress) {
                        e.preventDefault();
                        rightIcon.onPress();
                      }
                    }}
                  >
                    <Icon
                      name={rightIcon.icon as IconName}
                      size="md"
                      color={iconColor}
                    />
                  </button>
                );
              }

              // Remix Icon을 사용하는 경우
              let RemixIcon: React.ComponentType<{ size?: number | string; color?: string }> | null = null;
              if (rightIcon.icon === 'more' || rightIcon.icon === 'more-2-fill') {
                RemixIcon = RiMore2Fill;
              } else if (rightIcon.icon === 'close' || rightIcon.icon === 'close-line') {
                RemixIcon = RiCloseLine;
              }

              // 이미지 소스를 사용하는 경우
              if (rightIcon.imageSource) {
                return (
                  <button
                    key={index}
                    type="button"
                    className={styles.iconButton}
                    style={{ 
                      width: Math.max(iconSize, 44), 
                      height: Math.max(iconSize, 44),
                      minWidth: 44,
                      minHeight: 44,
                    }}
                    onClick={rightIcon.onPress}
                    aria-label={accessibilityLabel}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && rightIcon.onPress) {
                        e.preventDefault();
                        rightIcon.onPress();
                      }
                    }}
                  >
                    <Image
                      src={rightIcon.imageSource}
                      alt={accessibilityLabel}
                      width={iconSize}
                      height={iconSize}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </button>
                );
              }

              // Remix Icon 렌더링
              if (RemixIcon) {
                return (
                  <button
                    key={index}
                    type="button"
                    className={styles.iconButton}
                    style={{
                      width: Math.max(iconSize, 44),
                      height: Math.max(iconSize, 44),
                      minWidth: 44,
                      minHeight: 44,
                    }}
                    onClick={rightIcon.onPress}
                    aria-label={accessibilityLabel}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && rightIcon.onPress) {
                        e.preventDefault();
                        rightIcon.onPress();
                      }
                    }}
                  >
                    <RemixIcon size={iconSize} color={iconColor} />
                  </button>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className={styles.headerRightPlaceholder} />
        )}
      </div>

      {/* 하단 보더 */}
      {showBorder && <div className={styles.border} />}
    </div>
  );
});

TimeCapsuleHeader.displayName = 'TimeCapsuleHeader';

export default TimeCapsuleHeader;
