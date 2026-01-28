/**
 * @fileoverview 컨텐츠 수정 React Query 훅
 * @description 사용자가 작성한 컨텐츠를 수정하는 React Query mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContent } from '../index';
import type { MyContentUpdateResponse, UpdateContentRequest } from '../types';

/**
 * 컨텐츠 수정 React Query mutation 훅
 *
 * 사용자가 작성한 컨텐츠를 수정합니다.
 *
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {UseMutationResult<MyContentResponse, Error, UpdateContentRequest>} React Query mutation 결과
 *
 * @example
 * ```typescript
 * const updateContentMutation = useUpdateContent('capsule-123');
 *
 * const handleUpdate = async () => {
 *   await updateContentMutation.mutateAsync({
 *     text: '수정된 텍스트',
 *     images: [file1],
 *   });
 * };
 * ```
 */
export function useUpdateContent(capsuleId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation<MyContentUpdateResponse, Error, UpdateContentRequest>({
    mutationFn: (data: UpdateContentRequest) => {
      if (!capsuleId) {
        throw new Error('Capsule ID is required');
      }
      return updateContent(capsuleId, data);
    },
    onSuccess: () => {
      // 컨텐츠 조회 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['myContent', capsuleId] });
    },
  });
}
