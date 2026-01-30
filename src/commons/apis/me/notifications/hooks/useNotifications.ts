/**
 * 알림 목록 조회 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../index';
import type { Notification } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';
import type { GetNotificationsResponseData } from '../types';

export interface UseNotificationsResult {
  unread: Notification[];
  read: Notification[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

function normalizeNotifications(
  data: GetNotificationsResponseData
): { unread: Notification[]; read: Notification[] } {
  if ('unread' in data && 'read' in data) {
    return { unread: data.unread ?? [], read: data.read ?? [] };
  }
  if ('items' in data && Array.isArray(data.items)) {
    const unread: Notification[] = [];
    const read: Notification[] = [];
    for (const item of data.items) {
      if (item.isRead) read.push(item);
      else unread.push(item);
    }
    return { unread, read };
  }
  return { unread: [], read: [] };
}

/**
 * 알림 목록 조회 훅
 *
 * GET /api/me/notifications 를 호출하여
 * 새 알림(unread)·이전 알림(read)으로 분리하여 반환합니다.
 *
 * @returns unread, read, isLoading, isError, error, refetch
 */
export function useNotifications(): UseNotificationsResult {
  const query = useQuery<GetNotificationsResponseData, ApiError>({
    queryKey: ['me', 'notifications', 'list'],
    queryFn: getNotifications,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error) => {
      if (!error.status) return failureCount < 1;
      if (error.status === 401 || error.status === 404) return false;
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 1;
    },
  });

  const { unread, read } =
    query.data != null ? normalizeNotifications(query.data) : { unread: [], read: [] };

  return {
    unread,
    read,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
