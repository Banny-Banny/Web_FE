/**
 * 내 알림 관련 API (읽지 않은 알림 개수 등)
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';

/**
 * 읽지 않은 알림 개수 응답 타입
 * GET /api/me/notifications/unread-count 응답
 */
export interface UnreadNotificationCountResponse {
  count: number;
}

/** 서버가 { data: { count } } 형태로 감싸서 반환하는 경우 */
interface UnreadCountWrappedResponse {
  data?: { count?: number };
  count?: number;
}

/**
 * 읽지 않은 알림 개수 조회
 *
 * GET /api/me/notifications/unread-count
 * 사용자의 읽지 않은 알림 개수를 조회합니다. 인증 필요.
 *
 * @returns 읽지 않은 알림 개수
 * @throws ApiError 인증되지 않은 사용자(401) 시
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await apiClient.get<
      UnreadNotificationCountResponse | UnreadCountWrappedResponse
    >(AUTH_ENDPOINTS.ME_NOTIFICATIONS_UNREAD_COUNT);

    const raw = response.data;
    if (raw && typeof (raw as UnreadNotificationCountResponse).count === 'number') {
      return (raw as UnreadNotificationCountResponse).count;
    }
    const wrapped = raw as UnreadCountWrappedResponse;
    if (wrapped?.data && typeof wrapped.data.count === 'number') {
      return wrapped.data.count;
    }
    return 0;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '읽지 않은 알림 개수 조회 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
    throw apiError;
  }
}
