/**
 * @fileoverview Button 컴포넌트 타입 정의
 */

import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 변형 스타일
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태
   * @default false
   */
  isLoading?: boolean;

  /**
   * 비활성화 상태
   * @default false
   */
  disabled?: boolean;

  /**
   * 버튼 내용
   */
  children: React.ReactNode;
}
