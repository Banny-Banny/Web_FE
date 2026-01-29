/**
 * @fileoverview 타임캡슐 제출 Mutation 훅
 * @description 방장이 타임캡슐을 최종 제출하는 React Query mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitCapsule } from '../index';
import type { CapsuleSubmitRequest } from '../types';

/**
 * 타임캡슐 제출 Mutation 훅
 *
 * 방장이 모든 참여자의 콘텐츠 작성 완료 후 타임캡슐을 최종 제출합니다.
 *
 * @param {string} roomId - 대기실 ID
 * @returns React Query mutation 객체
 *
 * @example
 * ```typescript
 * const { mutate, isPending, error } = useCapsuleSubmit('room-123');
 *
 * mutate(
 *   { latitude: 37.5665, longitude: 126.9780 },
 *   {
 *     onSuccess: (data) => {
 *       console.log('제출 완료:', data);
 *     },
 *     onError: (error) => {
 *       console.error('제출 실패:', error);
 *     },
 *   }
 * );
 * ```
 */
export function useCapsuleSubmit(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CapsuleSubmitRequest) => submitCapsule(roomId, data),
    onSuccess: () => {
      // 대기실 정보 캐시 무효화 (상태가 BURIED로 변경됨)
      queryClient.invalidateQueries({
        queryKey: ['waiting-room', roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ['waiting-room-settings', roomId],
      });
    },
  });
}
