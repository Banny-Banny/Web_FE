/**
 * 알림 삭제 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotification } from '../index';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 알림 삭제 훅
 *
 * POST /api/me/notifications/{notificationId}/delete 호출.
 * 성공 시 ['me', 'notifications'] 쿼리 무효화 (목록·unread-count 갱신).
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'notifications'] });
    },
  });
}
