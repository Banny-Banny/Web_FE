/**
 * 로그아웃 API 함수
 * 현재 토큰을 서버에서 무효화하여 재사용을 막습니다.
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';

/**
 * 로그아웃 API 호출
 *
 * POST /api/auth/logout
 * - 성공(200): 로그아웃 성공
 * - 401: 유효하지 않은 토큰 (이미 무효인 경우이므로 로컬 정리만 진행하면 됨)
 *
 * @throws ApiError 서버 오류(500 등) 시
 */
export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const status = axiosError.response?.status;

    // 401(유효하지 않은 토큰)은 로그아웃 의도와 동일하므로 예외로 던지지 않음
    if (status === 401) {
      return;
    }

    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '로그아웃 중 오류가 발생했습니다.',
      status: status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
