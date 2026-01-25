/**
 * @fileoverview Button 컴포넌트 타입 정의
 */

import type React from 'react';

/**
 * 버튼 Variant 타입
 * - disabled: 진한 회색 배경 (비활성화 상태)
 * - primary: 검은색 배경 (활성화 상태, 기본)
 * - outline: 흰색 배경 + 검은색 테두리
 * - danger: 빨간색 배경 (로그아웃, 삭제 등)
 */
export type ButtonVariant = 'disabled' | 'primary' | 'outline' | 'danger';

/**
 * 버튼 크기 타입
 * - L: Large (64px)
 * - M: Medium (56px)
 * - S: Small (48px)
 */
export type ButtonSize = 'L' | 'M' | 'S';

/**
 * 아이콘 위치 타입
 * - left: 아이콘 + 텍스트 (아이콘이 텍스트 왼쪽)
 * - right: 아이콘 + 텍스트 (아이콘이 텍스트 오른쪽)
 * - only: 아이콘만 표시 (텍스트 숨김)
 */
export type IconPosition = 'left' | 'right' | 'only';

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onPress'> {
  /**
   * 버튼 텍스트 (필수)
   */
  label: string;

  /**
   * 버튼 variant (선택, 기본값: 'primary')
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기 (선택, 기본값: 'L')
   */
  size?: ButtonSize;

  /**
   * 아이콘 이름 (선택)
   * 나중에 아이콘 시스템이 추가되면 사용
   */
  icon?: string;

  /**
   * 아이콘 위치 (선택, 기본값: 'left')
   * - left: 아이콘 + 텍스트 (아이콘이 텍스트 왼쪽)
   * - right: 아이콘 + 텍스트 (아이콘이 텍스트 오른쪽)
   * - only: 아이콘만
   */
  iconPosition?: IconPosition;

  /**
   * 전체 너비 사용 여부 (선택, 기본값: true)
   * width가 지정되면 무시됨
   */
  fullWidth?: boolean;

  /**
   * 커스텀 너비 (선택)
   * 숫자(px) 또는 퍼센트 문자열 지정 가능
   * @example width={200} // 200px
   * @example width="50%" // 50%
   */
  width?: string | number;

  /**
   * 비활성화 상태 (선택, 기본값: false)
   */
  disabled?: boolean;

  /**
   * 버튼 클릭 핸들러 (필수)
   */
  onPress: () => void;

  /**
   * 추가 className (선택)
   */
  className?: string;
}
