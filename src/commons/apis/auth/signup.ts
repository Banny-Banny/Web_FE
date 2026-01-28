/**
 * 자체 회원가입 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { LocalSignupRequest, LocalSignupResponse } from './types';

/**
 * 자체 회원가입 API 호출
 * 
 * @param request 회원가입 요청 데이터
 * @returns 회원가입 응답 데이터
 * @throws ApiError 회원가입 실패 또는 서버 오류 시
 */
export async function localSignup(
  request: LocalSignupRequest
): Promise<LocalSignupResponse> {
  // 필수 필드 검증
  if (!request.nickname) {
    throw new Error('닉네임을 입력해주세요.');
  }
  if (!request.phoneNumber) {
    throw new Error('전화번호를 입력해주세요.');
  }
  if (!request.email) {
    throw new Error('이메일을 입력해주세요.');
  }
  if (!request.password) {
    throw new Error('비밀번호를 입력해주세요.');
  }

  try {
    const response = await apiClient.post<LocalSignupResponse>(
      AUTH_ENDPOINTS.LOCAL_SIGNUP,
      request
    );

    return response.data;
  } catch (error) {
    // Axios 에러를 ApiError 형식으로 변환
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message: axiosError.response?.data?.message || axiosError.message || '회원가입 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
