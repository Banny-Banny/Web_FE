/**
 * 온보딩 완료 API 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { ONBOARDING_ENDPOINTS } from '@/commons/apis/endpoints';
import type { OnboardingCompleteRequest, OnboardingCompleteResponse } from './types';

/**
 * 온보딩 완료 API 호출
 * 
 * @param request 온보딩 완료 요청 데이터
 * @returns 온보딩 완료 응답 데이터
 * @throws ApiError 온보딩 완료 실패 또는 서버 오류 시
 */
export async function completeOnboarding(
  request: OnboardingCompleteRequest
): Promise<OnboardingCompleteResponse> {
  // 필수 필드 검증
  if (typeof request.friend_consent !== 'boolean') {
    throw new Error('친구 연동 허용 동의 상태를 선택해주세요.');
  }
  if (typeof request.location_consent !== 'boolean') {
    throw new Error('위치 권한 허용 동의 상태를 선택해주세요.');
  }

  try {
    const response = await apiClient.post<OnboardingCompleteResponse>(
      ONBOARDING_ENDPOINTS.COMPLETE,
      request
    );

    return response.data;
  } catch (error: any) {
    // Axios 에러를 ApiError 형식으로 변환
    const apiError = {
      message: error.response?.data?.message || error.message || '온보딩 완료 중 오류가 발생했습니다.',
      status: error.response?.status || 500,
      code: error.response?.data?.code || error.code,
      details: error.response?.data,
    };

    throw apiError;
  }
}
