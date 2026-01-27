/**
 * 슬롯 관리 E2E 테스트용 Mock 데이터
 */

import type { LocalLoginRequest } from '@/commons/apis/auth/types';
import type { SlotInfoResponse, SlotResetResponse } from '@/commons/apis/easter-egg/types';

/**
 * 테스트 계정 정보
 * 
 * ⚠️ 주의: 
 * - 실제 서버에 등록된 테스트 계정을 사용하세요.
 * - 테스트 실패 시 비밀번호가 서버와 일치하는지 확인하세요.
 */
export const testLoginRequest: LocalLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  password: process.env.NEXT_PUBLIC_PASSWORD,
};

/**
 * 테스트용 Mock 슬롯 정보 응답
 */
export const mockSlotInfoResponse: SlotInfoResponse = {
  totalSlots: 3,
  usedSlots: 1,
  remainingSlots: 2,
};

/**
 * 테스트용 Mock 슬롯 초기화 응답
 */
export const mockSlotResetResponse: SlotResetResponse = {
  egg_slots: 3,
};

/**
 * 테스트용 Mock 슬롯 정보 (모두 사용)
 */
export const mockSlotInfoAllUsed: SlotInfoResponse = {
  totalSlots: 3,
  usedSlots: 3,
  remainingSlots: 0,
};

/**
 * 테스트용 Mock 슬롯 정보 (초기화 후)
 */
export const mockSlotInfoAfterReset: SlotInfoResponse = {
  totalSlots: 3,
  usedSlots: 0,
  remainingSlots: 3,
};
