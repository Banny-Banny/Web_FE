/**
 * 슬롯 관리 E2E 테스트용 Mock 데이터
 */

import type { LocalLoginRequest } from '@/commons/apis/auth/types';
import type { SlotInfoResponse, SlotResetResponse } from '@/commons/apis/easter-egg/types';

/**
 * 환경 변수에서 테스트 계정 정보 가져오기
 */
export const testLoginRequest: LocalLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '01030728535',
  password: process.env.NEXT_PUBLIC_PASSWORD || 'test1234!@',
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
