/**
 * FAB Button 컴포넌트 타입 정의
 */

/**
 * FAB Button 컴포넌트 Props
 */
export interface FabButtonProps {
  /** 이스터에그 선택 핸들러 */
  onEasterEggClick?: () => void;
  /** 타임캡슐 선택 핸들러 */
  onTimeCapsuleClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
