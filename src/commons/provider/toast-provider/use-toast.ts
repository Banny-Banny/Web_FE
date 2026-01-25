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
 * Toast Provider를 통해 토스트 메시지를 쉽게 표시할 수 있는 커스텀 훅입니다.
 * 
 * @returns {Object} 토스트 제어 함수들
 * @returns {function} returns.showToast - 토스트를 표시하는 함수
 * @returns {function} returns.showSuccess - 성공 토스트를 표시하는 함수
 * @returns {function} returns.showError - 에러 토스트를 표시하는 함수
 * @returns {function} returns.showInfo - 정보 토스트를 표시하는 함수
 * @returns {function} returns.showWarning - 경고 토스트를 표시하는 함수
 * @returns {function} returns.removeToast - 특정 토스트를 제거하는 함수
 * @returns {function} returns.clearAll - 모든 토스트를 제거하는 함수
 * 
 * @example
 * ```tsx
 * import { useToast } from '@/commons/provider';
 * 
 * function MyComponent() {
 *   const { showToast, showSuccess, showError } = useToast();
 * 
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showSuccess('저장되었습니다');
 *     } catch (error) {
 *       showError('저장에 실패했습니다');
 *     }
 *   };
 * 
 *   return <button onClick={handleSave}>저장</button>;
 * }
 * ```
 * 
 * @see {@link ToastOptions} - 토스트 옵션 타입
 * @see {@link ToastType} - 토스트 타입
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
