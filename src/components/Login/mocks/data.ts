/**
 * 로그인 Mock 데이터
 */

import type { LocalLoginResponse } from '@/commons/apis/auth/types';

/**
 * Mock 로그인 성공 응답 데이터
 */
export const mockLoginSuccessResponse: LocalLoginResponse = {
  accessToken: 'mock_access_token_12345',
  refreshToken: 'mock_refresh_token_12345',
  user: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    email: 'test@example.com',
    nickname: '테스트유저',
    profileImage: 'https://example.com/profile.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Mock 로그인 실패 응답 (401)
 */
export const mockLoginFailureResponse = {
  message: '인증에 실패했습니다. 전화번호/이메일 또는 비밀번호를 확인해주세요.',
  status: 401,
};

/**
 * Mock 계정 상태 오류 응답 (403)
 */
export const mockAccountStatusErrorResponse = {
  message: '비활성화된 계정이거나 SNS 계정입니다.',
  status: 403,
};

/**
 * Mock 네트워크 오류
 */
export const mockNetworkError = {
  message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  status: 0,
};
