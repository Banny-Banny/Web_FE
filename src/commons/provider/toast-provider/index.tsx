'use client';

/**
 * @fileoverview Toast Provider
 * @description Toast 전역 상태 관리 및 렌더링
 */

import React from 'react';
import { ToastProvider as ToastContextProvider, useToastContext } from './toast-context';
import { Toast } from '@/commons/components/toast';

/**
 * Toast 렌더러 컴포넌트
 * ToastContext를 사용하여 토스트들을 렌더링
 */
function ToastRenderer() {
  const { toasts, removeToast } = useToastContext();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          visible={true}
          onHide={() => removeToast(toast.id)}
          duration={toast.duration}
          type={toast.type}
          position={toast.position}
        />
      ))}
    </>
  );
}

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast Provider 컴포넌트
 * 
 * @example
 * ```typescript
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastContextProvider>
      {children}
      <ToastRenderer />
    </ToastContextProvider>
  );
}

// Context와 훅도 export
export { useToastContext } from './toast-context';
export { useToast } from './use-toast';
export type { ToastOptions } from './use-toast';
