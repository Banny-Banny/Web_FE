/**
 * @fileoverview 디자인 시스템 컴포넌트 통합 익스포트
 * @description 공용 버튼, 인풋, 카드 등 재사용 가능한 UI 컴포넌트
 */

// Button 컴포넌트
export { Button } from './button';
export type { ButtonProps, ButtonVariant, ButtonSize, IconPosition } from './button/types';

// DualButton 컴포넌트
export { DualButton } from './dual-button';
export type { DualButtonProps } from './dual-button/types';

// Spinner 컴포넌트
export { Spinner } from './spinner';
export type { SpinnerProps, SpinnerSize } from './spinner/types';

// Icon 컴포넌트
export { Icon } from './icon';
export type { IconProps, IconName, IconSize } from './icon/types';

// 향후 추가될 컴포넌트들
// 예: export { Input } from './Input';
// 예: export { Card } from './Card';

export {};