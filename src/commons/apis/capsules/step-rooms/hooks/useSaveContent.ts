/**
 * @fileoverview 컨텐츠 저장 React Query 훅
 * @description 사용자가 작성한 컨텐츠를 저장하는 React Query mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveContent } from '../index';
import type { MyContentSaveResponse, SaveContentRequest } from '../types';

/**
 * 컨텐츠 저장 React Query mutation 훅
 *
 * 사용자가 작성한 컨텐츠를 저장합니다.
 *
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {UseMutationResult<MyContentResponse, Error, SaveContentRequest>} React Query mutation 결과
 *
 * @example
 * ```typescript
 * const saveContentMutation = useSaveContent('capsule-123');
 *
 * const handleSave = async () => {
 *   await saveContentMutation.mutateAsync({
 *     text: '안녕하세요',
 *     images: [file1, file2],
 *   });
 * };
 * ```
 */
export function useSaveContent(capsuleId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation<MyContentSaveResponse, Error, SaveContentRequest>({
    mutationFn: (data: SaveContentRequest) => {
      if (!capsuleId) {
        throw new Error('Capsule ID is required');
      }
      return saveContent(capsuleId, data);
    },
    onSuccess: () => {
      // 컨텐츠 조회 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['myContent', capsuleId] });
    },
  });
}
