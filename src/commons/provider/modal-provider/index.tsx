'use client';

/**
 * @fileoverview Modal Provider
 * @description Modal 전역 상태 관리 및 렌더링
 */

import React from 'react';
import { ModalProvider as ModalContextProvider, useModalContext } from './modal-context';
import { Modal } from '@/commons/components/modal';

/**
 * Modal 렌더러 컴포넌트
 * ModalContext를 사용하여 모달들을 렌더링
 */
function ModalRenderer() {
  const { modals, closeModal } = useModalContext();

  return (
    <>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          visible={true}
          onClose={() => {
            modal.config.onClose?.();
            closeModal(modal.id);
          }}
          width={modal.config.width}
          height={modal.config.height}
          padding={modal.config.padding}
          closeOnBackdropPress={modal.config.closeOnBackdropPress}
          disableAnimation={modal.config.disableAnimation}
        >
          {modal.config.children}
        </Modal>
      ))}
    </>
  );
}

/**
 * Modal Provider Props
 */
interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * Modal Provider 컴포넌트
 * 
 * @example
 * ```typescript
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export function ModalProvider({ children }: ModalProviderProps) {
  return (
    <ModalContextProvider>
      {children}
      <ModalRenderer />
    </ModalContextProvider>
  );
}

// Context와 훅도 export
export { useModalContext } from './modal-context';
export { useModal } from './use-modal';
export type { ModalState } from './modal-context';
