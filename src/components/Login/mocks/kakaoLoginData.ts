/**
 * 카카오 로그인 Mock 데이터
 * UI 개발 단계에서 사용하는 테스트 데이터
 */

import type { User } from '@/commons/types/auth';

/**
 * Mock 카카오 로그인 성공 응답 데이터
 */
export const mockKakaoLoginSuccess: {
  accessToken: string;
  refreshToken?: string;
  user?: User;
} = {
  accessToken: 'mock_access_token_kakao_123456789',
  refreshToken: 'mock_refresh_token_kakao_123456789',
  user: {
    id: 'mock-user-id-kakao',
    email: 'kakao@example.com',
    nickname: '카카오유저',
    profileImage: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Mock 카카오 로그인 실패 응답 데이터
 */
export const mockKakaoLoginError = {
  message: '카카오 인증에 실패했습니다.',
  status: 401,
  code: 'KAKAO_AUTH_FAILED',
};
