/**
 * @fileoverview Toast 컴포넌트 타입 정의
 * @description 토스트 메시지 컴포넌트의 Props 및 관련 타입
 */

/**
 * Toast 타입 enum
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast Props 타입
 */
export interface ToastProps {
  /** 토스트 메시지 내용 */
  message: string;
  /** 토스트 표시 여부 */
  visible: boolean;
  /** 토스트 숨김 핸들러 */
  onHide: () => void;
  /** 자동 사라짐 시간 (밀리초, 기본값: 3000) */
  duration?: number;
  /** Toast 타입 (기본값: 'info') */
  type?: ToastType;
  /** 토스트 위치 (기본값: 'bottom') */
  position?: 'top' | 'bottom';
  /** 추가 CSS 클래스 */
  className?: string;
}
