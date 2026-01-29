/**
 * @fileoverview 프로필 수정(닉네임) React Query Mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe } from '@/commons/apis/auth/me-update';
import type { MeUpdateRequest } from '@/commons/apis/auth/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 프로필 수정(닉네임) Mutation 훅
 *
 * 성공 시 ['auth', 'me'] 쿼리를 무효화합니다.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, MeUpdateRequest>({
    mutationFn: async (payload) => {
      await updateMe(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
