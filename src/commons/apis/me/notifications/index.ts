/**
 * 내 알림 관련 API (목록 조회, 읽음 처리, 삭제, 읽지 않은 개수)
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { GetNotificationsResponseData } from './types';

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

/**
 * 알림 목록 조회
 *
 * GET /api/me/notifications
 * 사용자의 알림 목록을 조회합니다. 인증 필요.
 * 서버가 unread/read 구분 또는 items+isRead 형태로 반환할 수 있음.
 *
 * @returns 알림 목록 응답 data (unread/read 또는 items)
 */
export async function getNotifications(): Promise<GetNotificationsResponseData> {
  try {
    const response = await apiClient.get<
      ApiResponse<GetNotificationsResponseData> | GetNotificationsResponseData
    >(AUTH_ENDPOINTS.ME_NOTIFICATIONS);

    const raw = response.data;
    if (raw && typeof (raw as ApiResponse<GetNotificationsResponseData>).data !== 'undefined') {
      return (raw as ApiResponse<GetNotificationsResponseData>).data;
    }
    return raw as GetNotificationsResponseData;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '알림 목록 조회 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
    throw apiError;
  }
}

/**
 * 알림 읽음 처리
 *
 * POST /api/me/notifications/{notificationId}/read
 * 해당 알림을 읽음으로 처리합니다. 인증 필요.
 *
 * @param notificationId - 알림 ID
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    const url =
      typeof AUTH_ENDPOINTS.ME_NOTIFICATION_READ === 'function'
        ? AUTH_ENDPOINTS.ME_NOTIFICATION_READ(notificationId)
        : `${AUTH_ENDPOINTS.ME_NOTIFICATIONS}/${notificationId}/read`;
    await apiClient.post(url);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '알림 읽음 처리 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
    throw apiError;
  }
}

/**
 * 알림 삭제
 *
 * POST /api/me/notifications/{notificationId}/delete
 * 해당 알림을 삭제합니다. 인증 필요.
 *
 * @param notificationId - 알림 ID
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const url =
      typeof AUTH_ENDPOINTS.ME_NOTIFICATION_DELETE === 'function'
        ? AUTH_ENDPOINTS.ME_NOTIFICATION_DELETE(notificationId)
        : `${AUTH_ENDPOINTS.ME_NOTIFICATIONS}/${notificationId}/delete`;
    await apiClient.post(url);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '알림 삭제 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
    throw apiError;
  }
}
