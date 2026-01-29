/**
 * 읽지 않은 알림 개수 조회 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getUnreadNotificationCount } from '../index';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 읽지 않은 알림 개수 조회 훅
 *
 * GET /api/me/notifications/unread-count 를 호출하여
 * 사용자의 읽지 않은 알림 개수를 반환합니다.
 *
 * @returns {UseQueryResult<number, ApiError>} count 및 로딩/에러 상태
 */
export function useUnreadNotificationCount() {
  return useQuery<number, ApiError>({
    queryKey: ['me', 'notifications', 'unread-count'],
    queryFn: getUnreadNotificationCount,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error) => {
      if (!error.status) return failureCount < 1;
      if (error.status === 401 || error.status === 404) return false;
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 1;
    },
  });
}
