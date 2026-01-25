/**
 * @fileoverview Spinner 컴포넌트 타입 정의
 */

/**
 * 스피너 크기 타입
 * - small: 작은 크기
 * - large: 큰 크기
 */
export type SpinnerSize = 'small' | 'large';

/**
 * Spinner 컴포넌트 Props
 */
export interface SpinnerProps {
  /**
   * 스피너 크기 (선택, 기본값: 'large')
   */
  size?: SpinnerSize;

  /**
   * 스피너 색상 (선택)
   * 기본값은 디자인 토큰의 primary 색상 사용
   */
  color?: string;

  /**
   * 전체 화면 모드 (선택, 기본값: false)
   * true일 경우 전체 화면을 덮는 오버레이와 함께 표시
   */
  fullScreen?: boolean;

  /**
   * 추가 className (선택)
   */
  className?: string;
}
