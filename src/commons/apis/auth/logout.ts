/**
 * 로그아웃 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient, ApiResponse } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';

/**
 * 로그아웃 API 호출
 *
 * 서버에 로그아웃 요청을 보내 세션/리프레시 토큰을 무효화합니다.
 * 실패해도 클라이언트에서는 토큰을 제거하므로 에러는 던지지 않고 무시합니다.
 */
export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post<ApiResponse<unknown>>(AUTH_ENDPOINTS.LOGOUT);
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.warn(
      '로그아웃 API 실패 (클라이언트 토큰은 제거됨):',
      axiosError.response?.data?.message ?? axiosError.message
    );
    // 서버 오류/네트워크 오류 시에도 클라이언트는 정리하므로 throw 하지 않음
  }
}
