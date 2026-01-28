/**
 * GNB 컴포넌트 타입 정의
 * 
 * @description
 * - Global Navigation Bar의 Props 및 관련 타입 정의
 */

export interface GNBProps {
  currentPath?: string;
}

export interface MenuItem {
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  label: string;
  path: string;
  ariaLabel: string;
}
