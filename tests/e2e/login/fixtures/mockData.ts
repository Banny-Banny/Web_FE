/**
 * 로그인 E2E 테스트용 Mock 데이터
 */

import type { LocalLoginRequest, LocalLoginResponse } from '@/commons/apis/auth/types';

/**
 * 테스트용 유효한 전화번호 로그인 요청 데이터
 */
export const validPhoneLoginRequest: LocalLoginRequest = {
  phoneNumber: '01012345678',
  password: 'Password123!',
};

/**
 * 테스트용 유효한 이메일 로그인 요청 데이터
 */
export const validEmailLoginRequest: LocalLoginRequest = {
  email: 'test@example.com',
  password: 'Password123!',
};

/**
 * 테스트용 잘못된 자격 증명 로그인 요청 데이터
 */
export const invalidLoginRequest: LocalLoginRequest = {
  phoneNumber: '01099999999',
  password: 'WrongPassword123!',
};

/**
 * 테스트용 비활성화된 계정 로그인 요청 데이터
 */
export const inactiveAccountLoginRequest: LocalLoginRequest = {
  phoneNumber: '01088888888',
  password: 'Password123!',
};

/**
 * 테스트용 Mock 성공 응답 데이터
 */
export const mockSuccessResponse: LocalLoginResponse = {
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
