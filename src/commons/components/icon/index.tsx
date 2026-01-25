/**
 * @fileoverview Icon 컴포넌트
 * @description 프로젝트 아이콘을 표시하는 컴포넌트
 */

import React from 'react';
import Image from 'next/image';
import type { IconProps } from './types';
import { IconSizeMap } from './types';

/**
 * 아이콘 경로 매핑
 * src/assets/icons/ 폴더의 아이콘 파일과 매핑
 */
const IconPathMap: Record<string, string> = {
  'camera': '/icons/camera.png',
  'capsule': '/icons/capsule-icon.svg',
  'close': '/icons/close-icon.svg',
  'egg': '/icons/egg-icon.svg',
  'friend': '/icons/friend.png',
  'location-pin': '/icons/locationPin.png',
  'marker-cap-red': '/icons/marker_cap_red.svg',
  'marker-egg-blue': '/icons/marker_egg_blue.svg',
  'marker-egg-gray': '/icons/marker_egg_gray.svg',
  'onboarding-location': '/icons/onboarding_location.png',
  'onboarding-page': '/icons/onboarding_page_icon.png',
  'plus': '/icons/plus-icon.svg',
  'shield': '/icons/shield.png',
  'unnotification': '/icons/unnotification.png',
};

/**
 * Icon 컴포넌트
 * 
 * @example
 * ```tsx
 * <Icon name="camera" size="md" alt="카메라 아이콘" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  className = '',
  alt,
}) => {
  const iconPath = IconPathMap[name];
  const iconSize = IconSizeMap[size];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found in IconPathMap`);
    return null;
  }

  const isSvg = iconPath.endsWith('.svg');

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: iconSize,
        height: iconSize,
        color: color,
      }}
    >
      <Image
        src={iconPath}
        alt={alt || `${name} icon`}
        width={iconSize}
        height={iconSize}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          ...(isSvg && color ? { filter: 'currentColor' } : {}),
        }}
      />
    </span>
  );
};

Icon.displayName = 'Icon';
