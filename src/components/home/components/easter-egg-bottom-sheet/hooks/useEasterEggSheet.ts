/**
 * @fileoverview 이스터에그 바텀시트 상태 관리 Hook
 * 
 * 이 Hook은 이스터에그 바텀시트의 상태(열림/닫힘, 선택된 옵션 등)를 관리합니다.
 * 
 * @module components/home/components/easter-egg-bottom-sheet/hooks/useEasterEggSheet
 */

import { useState, useCallback } from 'react';
import type { EasterEggSheetState } from '../types';

/**
 * useEasterEggSheet Hook 반환 타입
 */
export interface UseEasterEggSheetReturn {
  /** 바텀시트 상태 */
  state: EasterEggSheetState;
  /** 바텀시트 열기 핸들러 */
  handleOpen: () => void;
  /** 바텀시트 닫기 핸들러 */
  handleClose: () => void;
  /** 옵션 선택 핸들러 */
  handleSelectOption: (optionId: string) => void;
  /** 선택된 옵션이 있는지 여부 */
  hasSelectedOption: boolean;
}

/**
 * 이스터에그 바텀시트 상태 관리 Hook
 * 
 * 바텀시트의 열림/닫힘 상태, 선택된 옵션, 드래그 상태 등을 관리합니다.
 * 
 * @returns {UseEasterEggSheetReturn} 바텀시트 상태 및 핸들러
 * 
 * @example
 * ```typescript
 * const {
 *   state,
 *   handleOpen,
 *   handleClose,
 *   handleSelectOption,
 *   hasSelectedOption,
 * } = useEasterEggSheet();
 * 
 * // 바텀시트 열기
 * <button onClick={handleOpen}>이스터에그 생성</button>
 * 
 * // 바텀시트 컴포넌트에 전달
 * <EasterEggBottomSheet
 *   isOpen={state.isOpen}
 *   onClose={handleClose}
 *   selectedOption={state.selectedOption}
 *   onSelectOption={handleSelectOption}
 * />
 * ```
 */
export function useEasterEggSheet(): UseEasterEggSheetReturn {
  // 바텀시트 상태
  const [state, setState] = useState<EasterEggSheetState>({
    isOpen: false,
    selectedOption: null,
    height: 0,
    isDragging: false,
  });

  /**
   * 바텀시트 열기
   * 
   * 바텀시트를 열고 선택된 옵션을 초기화합니다.
   */
  const handleOpen = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      selectedOption: null, // 열 때마다 선택 초기화
    }));
  }, []);

  /**
   * 바텀시트 닫기
   * 
   * 바텀시트를 닫고 상태를 초기화합니다.
   */
  const handleClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      selectedOption: null, // 닫을 때 선택 초기화
      isDragging: false,
    }));
  }, []);

  /**
   * 옵션 선택
   * 
   * @param optionId - 선택된 옵션의 ID
   */
  const handleSelectOption = useCallback((optionId: string) => {
    setState((prev) => ({
      ...prev,
      selectedOption: optionId,
    }));
  }, []);

  /**
   * 선택된 옵션이 있는지 확인
   */
  const hasSelectedOption = state.selectedOption !== null;

  return {
    state,
    handleOpen,
    handleClose,
    handleSelectOption,
    hasSelectedOption,
  };
}
