/**
 * @fileoverview Icon 컴포넌트 타입 정의
 */

export type IconName =
  | 'camera'
  | 'capsule'
  | 'close'
  | 'egg'
  | 'friend'
  | 'location-pin'
  | 'marker-cap-red'
  | 'marker-egg-blue'
  | 'marker-egg-gray'
  | 'onboarding-location'
  | 'onboarding-page'
  | 'plus'
  | 'shield'
  | 'unnotification';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /**
   * 아이콘 이름
   */
  name: IconName;

  /**
   * 아이콘 크기
   * @default 'md'
   */
  size?: IconSize;

  /**
   * 아이콘 색상 (CSS color value)
   */
  color?: string;

  /**
   * 추가 CSS 클래스
   */
  className?: string;

  /**
   * 접근성을 위한 alt 텍스트
   */
  alt?: string;
}

/**
 * 아이콘 크기 매핑 (픽셀)
 */
export const IconSizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;
