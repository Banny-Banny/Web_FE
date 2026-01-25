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
import { ArrowLeft, MoreVertical, X } from 'lucide-react';
import { Icon } from '../icon';
import type { IconName } from '../icon/types';
import { Colors, Typography } from '@/commons/styles';
import styles from './styles.module.css';
import type { TimeCapsuleHeaderProps, HeaderIconName } from './types';

/**
 * TimeCapsuleHeader 컴포넌트
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
            <ArrowLeft size={24} color={Colors.black[500]} />
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

              // lucide-react 아이콘을 사용하는 경우
              let LucideIcon: React.ComponentType<{ size: number; color: string }> | null = null;
              if (rightIcon.icon === 'more' || rightIcon.icon === 'more-2-fill') {
                LucideIcon = MoreVertical;
              } else if (rightIcon.icon === 'close' || rightIcon.icon === 'close-line') {
                LucideIcon = X;
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

              // lucide-react 아이콘 렌더링
              if (LucideIcon) {
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
                    <LucideIcon size={iconSize} color={iconColor} />
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
