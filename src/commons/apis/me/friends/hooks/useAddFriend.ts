/**
 * @fileoverview 친구 추가 React Query Mutation 훅
 * @description 전화번호 또는 이메일을 통해 친구를 추가하는 React Query Mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFriend } from '../index';
import type { AddFriendRequest, AddFriendResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 친구 추가 Mutation 훅
 * 
 * 전화번호 또는 이메일을 통해 친구를 추가하고 친구 목록 쿼리를 무효화합니다.
 * 
 * @returns {UseMutationResult<AddFriendResponse, ApiError, AddFriendRequest>} React Query Mutation 결과
 * 
 * @example
 * ```typescript
 * const { mutate: addFriendMutation, isPending } = useAddFriend();
 * 
 * const handleAdd = () => {
 *   addFriendMutation(
 *     { phoneNumber: '01012345678' },
 *     {
 *       onSuccess: (data) => {
 *         console.log('친구 추가 성공:', data.friendshipId);
 *       },
 *       onError: (error) => {
 *         console.error('친구 추가 실패:', error.message);
 *       },
 *     }
 *   );
 * };
 * ```
 */
export function useAddFriend() {
  const queryClient = useQueryClient();

  return useMutation<AddFriendResponse, ApiError, AddFriendRequest>({
    mutationFn: (request: AddFriendRequest) => addFriend(request),
    onSuccess: () => {
      // 친구 목록 쿼리 무효화하여 자동으로 다시 조회되도록 함
      queryClient.invalidateQueries({ queryKey: ['friends', 'list'] });
    },
  });
}
