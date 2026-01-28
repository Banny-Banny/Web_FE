/**
 * 내 프로필 조회 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { MeResponse } from './types';

/**
 * 내 프로필 조회 API 호출
 * 
 * 로그인한 사용자의 프로필 정보를 조회합니다.
 * 인증 토큰은 apiClient에서 자동으로 헤더에 포함됩니다.
 * 
 * @returns 프로필 정보
 * @throws ApiError 인증되지 않은 사용자(401) 또는 사용자를 찾을 수 없음(404) 시
 * 
 * @example
 * ```typescript
 * try {
 *   const profile = await getMe();
 *   console.log('프로필:', profile.nickname);
 * } catch (error) {
 *   if (error.status === 401) {
 *     console.error('인증이 필요합니다.');
 *   }
 * }
 * ```
 */
export async function getMe(): Promise<MeResponse> {
  try {
    const response = await apiClient.get<MeResponse>(
      AUTH_ENDPOINTS.ME
    );

    return response.data;
  } catch (error) {
    // Axios 에러를 ApiError 형식으로 변환
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message: axiosError.response?.data?.message || axiosError.message || '프로필 조회 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
