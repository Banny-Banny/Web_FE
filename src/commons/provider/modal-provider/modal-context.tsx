'use client';

/**
 * @fileoverview Modal Context
 * @description Modal 상태 관리를 위한 React Context
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ModalConfig } from '@/commons/components/modal/types';

/**
 * Modal 상태 타입
 */
export interface ModalState {
  id: string;
  config: ModalConfig;
  zIndex: number;
}

/**
 * Modal Context 타입
 */
interface ModalContextType {
  modals: ModalState[];
  openModal: (config: ModalConfig) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
  getNextZIndex: () => number;
}

/**
 * Modal Context 생성
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Modal Provider Props
 */
interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * Modal Provider 컴포넌트
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalState[]>([]);
  const baseZIndex = 10000;

  /**
   * 다음 z-index 계산
   */
  const getNextZIndex = useCallback(() => {
    const nextZIndex = baseZIndex + modals.length;
    return nextZIndex;
  }, [baseZIndex, modals.length]);

  /**
   * Modal 열기
   */
  const openModal = useCallback(
    (config: ModalConfig) => {
      const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const zIndex = getNextZIndex();

      const newModal: ModalState = {
        id,
        config,
        zIndex,
      };

      setModals((prev) => [...prev, newModal]);
      return id;
    },
    [getNextZIndex]
  );

  /**
   * Modal 닫기
   */
  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  /**
   * 모든 Modal 닫기
   */
  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAll,
    getNextZIndex,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/**
 * useModalContext 훅
 * Modal Context를 사용하기 위한 커스텀 훅
 */
export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}
