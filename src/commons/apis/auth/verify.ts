/**
 * 토큰 검증 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { VerifyResponse } from './types';

/**
 * 토큰 검증 API 호출
 * 
 * 현재 저장된 액세스 토큰을 서버에 전송하여 유효성을 검증하고,
 * 유효한 경우 사용자 정보를 반환합니다.
 * 
 * @returns 토큰 검증 응답 데이터
 * @throws ApiError 토큰이 유효하지 않거나 서버 오류 시
 */
export async function verifyAuth(): Promise<VerifyResponse> {
  try {
    const response = await apiClient.get<VerifyResponse>(
      AUTH_ENDPOINTS.VERIFY
    );

    return response.data;
  } catch (error) {
    // Axios 에러를 ApiError 형식으로 변환
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message: axiosError.response?.data?.message || axiosError.message || '토큰 검증 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
