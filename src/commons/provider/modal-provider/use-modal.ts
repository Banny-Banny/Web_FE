'use client';

/**
 * @fileoverview useModal 훅
 * @description Modal을 쉽게 사용할 수 있는 커스텀 훅
 */

import { useCallback } from 'react';
import { useModalContext } from './modal-context';
import type { ModalConfig } from '@/commons/components/modal/types';

/**
 * useModal 훅
 * 
 * @example
 * ```typescript
 * const { openModal, closeModal, closeAll } = useModal();
 * 
 * // 모달 열기
 * openModal({
 *   children: <div>모달 내용</div>,
 *   width: 300,
 *   onClose: () => closeModal(id),
 * });
 * 
 * // 모달 닫기
 * closeModal(modalId);
 * 
 * // 모든 모달 닫기
 * closeAll();
 * ```
 */
export function useModal() {
  const { openModal, closeModal, closeAll } = useModalContext();

  /**
   * 모달 열기 (간편 버전)
   */
  const open = useCallback(
    (config: ModalConfig) => {
      return openModal(config);
    },
    [openModal]
  );

  return {
    openModal: open,
    closeModal,
    closeAll,
  };
}
