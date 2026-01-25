'use client';

/**
 * @fileoverview useToast 훅
 * @description Toast를 쉽게 사용할 수 있는 커스텀 훅
 */

import { useCallback } from 'react';
import { useToastContext } from './toast-context';
import type { ToastType } from '@/commons/components/toast/types';

/**
 * Toast 옵션
 */
export interface ToastOptions {
  /** Toast 타입 (기본값: 'info') */
  type?: ToastType;
  /** 자동 사라짐 시간 (밀리초, 기본값: 3000) */
  duration?: number;
  /** Toast 위치 (기본값: 'bottom') */
  position?: 'top' | 'bottom';
}

/**
 * useToast 훅
 * 
 * @example
 * ```typescript
 * const { showToast, removeToast, clearAll } = useToast();
 * 
 * // 성공 메시지 표시
 * showToast('저장되었습니다', { type: 'success' });
 * 
 * // 에러 메시지 표시
 * showToast('오류가 발생했습니다', { type: 'error', duration: 5000 });
 * ```
 */
export function useToast() {
  const { addToast, removeToast, clearAll } = useToastContext();

  /**
   * Toast 표시
   */
  const showToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const {
        type = 'info',
        duration = 3000,
        position = 'bottom',
      } = options;

      return addToast({
        message,
        type,
        duration,
        position,
      });
    },
    [addToast]
  );

  /**
   * 성공 Toast 표시
   */
  const showSuccess = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );

  /**
   * 에러 Toast 표시
   */
  const showError = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );

  /**
   * 정보 Toast 표시
   */
  const showInfo = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );

  /**
   * 경고 Toast 표시
   */
  const showWarning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'warning' });
    },
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast,
    clearAll,
  };
}
