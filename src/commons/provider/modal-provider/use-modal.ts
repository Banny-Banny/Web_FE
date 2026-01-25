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
 * Modal Provider를 통해 모달을 쉽게 열고 닫을 수 있는 커스텀 훅입니다.
 * 
 * @returns {Object} 모달 제어 함수들
 * @returns {function} returns.openModal - 모달을 여는 함수
 * @returns {function} returns.closeModal - 특정 모달을 닫는 함수
 * @returns {function} returns.closeAll - 모든 모달을 닫는 함수
 * 
 * @example
 * ```tsx
 * import { useModal } from '@/commons/provider';
 * 
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 * 
 *   const handleOpen = () => {
 *     const modalId = openModal({
 *       children: (
 *         <div>
 *           <h2>모달 제목</h2>
 *           <p>모달 내용</p>
 *           <button onClick={() => closeModal(modalId)}>닫기</button>
 *         </div>
 *       ),
 *       width: 400,
 *       padding: 24,
 *     });
 *   };
 * 
 *   return <button onClick={handleOpen}>모달 열기</button>;
 * }
 * ```
 * 
 * @see {@link ModalConfig} - 모달 설정 타입
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
