/**
 * @fileoverview 초대 코드 및 대기실 참여 관련 유틸리티
 */

import type { JoinRoomResponse } from '@/commons/apis/capsules/step-rooms/types';

/**
 * 초대 링크 생성
 *
 * @param inviteCode - 초대 코드 (6자리 영숫자)
 * @returns 초대 링크 URL
 */
export function generateInviteLink(inviteCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL ?? '';
  const origin =
    baseUrl.trim().length > 0
      ? baseUrl.replace(/\/+$/, '')
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';

  return `${origin}/room/join?invite_code=${inviteCode}`;
}

/**
 * 초대 코드 형식 검증 (6자리 영숫자)
 */
export function validateInviteCodeFormat(code: string): boolean {
  const pattern = /^[A-Za-z0-9]{6}$/;
  return pattern.test(code);
}

/**
 * 초대 코드 정규화 (대문자로 변환)
 */
export function normalizeInviteCode(code: string): string {
  return code.toUpperCase();
}

/**
 * 409 ALREADY_JOINED 에러인지 확인
 */
export function isAlreadyJoinedError(error: any): boolean {
  return (
    error?.response?.status === 409 &&
    error?.response?.data?.error === 'ALREADY_JOINED'
  );
}

/**
 * 409 ALREADY_JOINED 응답에서 슬롯 번호 추출
 */
export function extractSlotNumberFromError(error: any): number | null {
  if (!isAlreadyJoinedError(error)) return null;
  const slot = error?.response?.data?.data?.slot_number;
  return typeof slot === 'number' ? slot : null;
}

/**
 * 409 ALREADY_JOINED 응답을 JoinRoomResponse로 변환
 */
export function convertAlreadyJoinedToJoinResponse(
  error: any,
  roomId: string
): JoinRoomResponse {
  const slotNumber = extractSlotNumberFromError(error) ?? 0;

  return {
    success: true,
    room_id: roomId,
    slot_number: slotNumber,
    nickname: '',
    joined_at: new Date().toISOString(),
  };
}

/**
 * 초대/참여 에러를 사용자 친화적인 메시지로 변환
 */
export function getInviteErrorMessage(error: any): string {
  const status = error?.response?.status;
  const code = error?.response?.data?.error;

  if (status === 400) {
    return '유효하지 않은 초대 코드입니다.';
  }

  if (status === 404) {
    return '존재하지 않는 초대 코드입니다.';
  }

  if (status === 403) {
    switch (code) {
      case 'INVALID_INVITE_CODE':
        return '잘못된 초대 코드입니다.';
      case 'DEADLINE_EXPIRED':
        return '작성 마감시한이 지났습니다.';
      case 'SLOTS_FULL':
        return '정원이 초과되었습니다.';
      default:
        return '대기실에 참여할 수 없습니다.';
    }
  }

  if (status === 409) {
    // data.slot_number 없는 ALREADY_JOINED 등
    return '이미 참여 중입니다.';
  }

  return `API 호출 실패: ${status || 'Network Error'}`;
}

