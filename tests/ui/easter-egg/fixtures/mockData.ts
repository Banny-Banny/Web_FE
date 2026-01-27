/**
 * 이스터에그 폼 제출 UI 테스트용 Mock 데이터
 */

import type { LocalLoginRequest } from '@/commons/apis/auth/types';

/**
 * 환경 변수에서 테스트 계정 정보 가져오기
 */
export const testLoginRequest: LocalLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '01030728535',
  password: process.env.NEXT_PUBLIC_PASSWORD || 'test1234!@',
};
