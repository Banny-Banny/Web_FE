'use client';

/**
 * @fileoverview Toast Context
 * @description Toast 상태 관리를 위한 React Context
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ToastType } from '@/commons/components/toast/types';

/**
 * Toast 상태 타입
 */
export interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  position?: 'top' | 'bottom';
}

/**
 * Toast Context 타입
 */
interface ToastContextType {
  toasts: ToastState[];
  addToast: (toast: Omit<ToastState, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Toast Context 생성
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast Provider 컴포넌트
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  /**
   * Toast 추가
   */
  const addToast = useCallback((toast: Omit<ToastState, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastState = {
      ...toast,
      id,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  /**
   * Toast 제거
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * 모든 Toast 제거
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

/**
 * useToastContext 훅
 * Toast Context를 사용하기 위한 커스텀 훅
 */
export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
