/**
 * 온보딩 Mock 데이터
 */

import type { OnboardingCompleteResponse } from '@/commons/apis/onboarding/types';

/**
 * Mock 온보딩 완료 성공 응답 데이터
 */
export const mockOnboardingSuccessResponse: OnboardingCompleteResponse = {
  success: true,
};

/**
 * Mock 온보딩 완료 실패 응답 (400)
 */
export const mockOnboardingFailureResponse = {
  message: '잘못된 요청입니다. 필수 필드를 확인해주세요.',
  status: 400,
};

/**
 * Mock 인증 오류 응답 (401)
 */
export const mockOnboardingAuthErrorResponse = {
  message: '인증에 실패했습니다. 로그인 후 다시 시도해주세요.',
  status: 401,
};

/**
 * Mock 서버 오류 응답 (500)
 */
export const mockOnboardingServerErrorResponse = {
  message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  status: 500,
};

/**
 * Mock 네트워크 오류
 */
export const mockOnboardingNetworkError = {
  message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  status: 0,
};
