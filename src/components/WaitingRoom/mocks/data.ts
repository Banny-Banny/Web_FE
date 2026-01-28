/**
 * @fileoverview 대기실 페이지 Mock 데이터
 * @description UI 개발 및 테스트를 위한 Mock 데이터
 */

import type {
  WaitingRoomDetailResponse,
  WaitingRoomSettingsResponse,
} from '@/commons/apis/capsules/step-rooms/types';

/**
 * Mock 대기실 설정값
 */
export const mockWaitingRoomSettings: WaitingRoomSettingsResponse = {
  roomId: 'waiting-room-123',
  capsuleName: '강동 불주먹들👊',
  maxHeadcount: 4,
  openDate: '2026-01-16T00:00:00Z',
};

/**
 * Mock 대기실 상세 정보
 */
export const mockWaitingRoomDetail: WaitingRoomDetailResponse = {
  waitingRoomId: 'waiting-room-123',
  capsuleName: '강동 불주먹들👊',
  currentHeadcount: 1,
  maxHeadcount: 4,
  openDate: '2026-01-16T00:00:00Z',
  status: 'WAITING',
  participants: [
    {
      participantId: 'participant-1',
      userId: 'user-1',
      userName: '최홍식',
      userAvatarUrl: undefined,
      slotNumber: 1,
      role: 'HOST',
      status: 'ACCEPTED',
    },
  ],
};
