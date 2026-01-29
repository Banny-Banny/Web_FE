/**
 * @fileoverview 프로필 이미지 업로드 React Query Mutation 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProfileImage } from '@/commons/apis/auth/me-profile-image';
import type { ProfileImageUploadResponse } from '@/commons/apis/auth/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 프로필 이미지 업로드 Mutation 훅
 *
 * 성공 시 ['auth', 'me'] 쿼리를 무효화합니다.
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation<ProfileImageUploadResponse, ApiError, File>({
    mutationFn: (file) => uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
