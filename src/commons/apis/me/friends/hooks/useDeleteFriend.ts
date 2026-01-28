/**
 * @fileoverview 친구 삭제 React Query Mutation 훅
 * @description 친구 관계를 삭제하는 React Query Mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFriend } from '../index';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 친구 삭제 Mutation 훅
 * 
 * 친구 관계를 삭제하고 친구 목록 쿼리를 무효화합니다.
 * 
 * @returns {UseMutationResult<void, ApiError, string>} React Query Mutation 결과
 * 
 * @example
 * ```typescript
 * const { mutate: deleteFriendMutation, isPending } = useDeleteFriend();
 * 
 * const handleDelete = (friendshipId: string) => {
 *   deleteFriendMutation(friendshipId, {
 *     onSuccess: () => {
 *       console.log('친구 삭제 성공');
 *     },
 *     onError: (error) => {
 *       console.error('친구 삭제 실패:', error.message);
 *     },
 *   });
 * };
 * ```
 */
export function useDeleteFriend() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (friendshipId: string) => deleteFriend(friendshipId),
    onSuccess: () => {
      // 친구 목록 쿼리 무효화하여 자동으로 다시 조회되도록 함
      queryClient.invalidateQueries({ queryKey: ['friends', 'list'] });
    },
  });
}
