/**
 * 알림 읽음 처리 뮤테이션 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationRead } from '../index';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 알림 읽음 처리 훅
 *
 * POST /api/me/notifications/{notificationId}/read 호출.
 * 성공 시 ['me', 'notifications'] 쿼리 무효화 (목록·unread-count 갱신).
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'notifications'] });
    },
  });
}
