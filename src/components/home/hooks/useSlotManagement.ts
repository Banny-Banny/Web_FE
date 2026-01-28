/**
 * 슬롯 관리 훅
 * 
 * 이스터에그 슬롯 조회 및 초기화 기능을 제공합니다.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSlotInfo, resetSlots } from '@/commons/apis/easter-egg';
import type { SlotInfoResponse, SlotResetResponse } from '@/commons/apis/easter-egg/types';

/**
 * 슬롯 쿼리 키
 */
export const SLOT_QUERY_KEYS = {
  /** 슬롯 관련 모든 쿼리 */
  slots: ['slots'] as const,
  /** 슬롯 정보 쿼리 */
  slotInfo: () => [...SLOT_QUERY_KEYS.slots, 'info'] as const,
};

/**
 * useSlotManagement 반환 타입
 */
export interface UseSlotManagementReturn {
  /** 슬롯 정보 */
  slotInfo: SlotInfoResponse | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
  /** 재조회 함수 */
  refetch: () => void;
  /** 초기화 함수 */
  resetSlots: () => void;
  /** 초기화 중 상태 */
  isResetting: boolean;
  /** 초기화 에러 */
  resetError: Error | null;
  /** 초기화 성공 상태 */
  resetSuccess: boolean;
  /** 초기화 상태 클리어 함수 */
  clearResetStatus: () => void;
}

/**
 * 슬롯 관리 훅
 * 
 * 이스터에그 슬롯 조회 및 초기화 기능을 제공합니다.
 * 
 * @example
 * ```tsx
 * const { 
 *   slotInfo, 
 *   isLoading, 
 *   resetSlots, 
 *   isResetting 
 * } = useSlotManagement();
 * 
 * // 슬롯 정보 표시
 * if (slotInfo) {
 *   console.log(`남은 슬롯: ${slotInfo.remainingSlots}개`);
 * }
 * 
 * // 슬롯 초기화
 * const handleReset = () => {
 *   resetSlots();
 * };
 * ```
 */
export function useSlotManagement(): UseSlotManagementReturn {
  const queryClient = useQueryClient();

  // 슬롯 정보 조회 쿼리
  const {
    data: slotInfo,
    isLoading,
    error,
    refetch,
  } = useQuery<SlotInfoResponse, Error>({
    queryKey: SLOT_QUERY_KEYS.slotInfo(),
    queryFn: getSlotInfo,
    staleTime: 1000 * 60, // 1분
    retry: 2, // 2번 재시도
  });

  // 슬롯 초기화 뮤테이션
  const resetMutation = useMutation<SlotResetResponse, Error>({
    mutationFn: resetSlots,
    onSuccess: () => {
      // 슬롯 정보 쿼리 무효화 (자동 재조회)
      queryClient.invalidateQueries({ 
        queryKey: SLOT_QUERY_KEYS.slotInfo() 
      });
    },
  });

  return {
    slotInfo,
    isLoading,
    error: error || null,
    refetch: () => {
      refetch();
    },
    resetSlots: () => {
      resetMutation.mutate();
    },
    isResetting: resetMutation.isPending,
    resetError: resetMutation.error || null,
    resetSuccess: resetMutation.isSuccess,
    clearResetStatus: () => {
      resetMutation.reset();
    },
  };
}
