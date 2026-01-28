/**
 * 자체 로그인 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { LocalLoginRequest, LocalLoginResponse } from './types';

/**
 * 자체 로그인 API 호출
 * 
 * @param request 로그인 요청 데이터
 * @returns 로그인 응답 데이터
 * @throws ApiError 인증 실패 또는 서버 오류 시
 */
export async function localLogin(
  request: LocalLoginRequest
): Promise<LocalLoginResponse> {
  // 전화번호 또는 이메일 중 하나는 필수
  if (!request.phoneNumber && !request.email) {
    throw new Error('전화번호 또는 이메일 중 하나를 입력해주세요.');
  }

  // 비밀번호 필수
  if (!request.password) {
    throw new Error('비밀번호를 입력해주세요.');
  }

  try {
    const response = await apiClient.post<LocalLoginResponse>(
      AUTH_ENDPOINTS.LOCAL_LOGIN,
      request
    );

    return response.data;
  } catch (error) {
    // Axios 에러를 ApiError 형식으로 변환
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message: axiosError.response?.data?.message || axiosError.message || '로그인 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
