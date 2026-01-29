/**
 * 내 프로필 수정 API 함수 (닉네임만 전송)
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { MeUpdateRequest } from './types';
import type { MeResponse } from './types';

/**
 * 프로필 수정 API 호출
 *
 * 로그인한 사용자의 닉네임을 수정합니다. 이메일은 전송하지 않습니다.
 *
 * @param payload - 닉네임만 포함한 수정 요청
 * @returns 수정된 프로필 정보 (200 OK 시)
 * @throws ApiError 400, 401, 409 등
 */
export async function updateMe(payload: MeUpdateRequest): Promise<MeResponse> {
  try {
    const response = await apiClient.post<MeResponse>(
      AUTH_ENDPOINTS.ME_UPDATE,
      payload
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    throw {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '프로필 수정 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
  }
}
