/**
 * @fileoverview 대기실 페이지 Mock 데이터
 * @description UI 개발 및 테스트를 위한 Mock 데이터
 */

import type {
  WaitingRoomDetailResponse,
  WaitingRoomSettingsResponse,
  CapsuleSubmitResponse,
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
      hasContent: true,
    },
  ],
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
  deadlineAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22시간 후
};

/**
 * Mock 타임캡슐 제출 성공 응답
 */
export const mockSubmitSuccessResponse: CapsuleSubmitResponse = {
  success: true,
  data: {
    capsule_id: 'caps_abc123def456',
    status: 'BURIED',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 중구 세종대로 110',
    },
    buried_at: new Date().toISOString(),
    open_date: '2026-12-31T00:00:00Z',
    participants: 4,
    is_auto_submitted: false,
  },
};

/**
 * Mock 자동 제출 응답
 */
export const mockAutoSubmitResponse: CapsuleSubmitResponse = {
  success: true,
  data: {
    capsule_id: 'caps_auto123def456',
    status: 'BURIED',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 중구 세종대로 110',
    },
    buried_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
    open_date: '2026-12-31T00:00:00Z',
    participants: 4,
    is_auto_submitted: true,
  },
};

/**
 * Mock 자동 제출된 대기실 정보
 */
export const mockAutoSubmittedRoom: WaitingRoomDetailResponse = {
  waitingRoomId: 'waiting-room-auto-submitted',
  capsuleName: '자동 제출된 타임캡슐',
  currentHeadcount: 4,
  maxHeadcount: 4,
  openDate: '2026-12-31T00:00:00Z',
  status: 'BURIED',
  participants: [
    {
      participantId: 'participant-1',
      userId: 'user-1',
      userName: '최홍식',
      userAvatarUrl: undefined,
      slotNumber: 1,
      role: 'HOST',
      status: 'ACCEPTED',
      hasContent: true,
    },
    {
      participantId: 'participant-2',
      userId: 'user-2',
      userName: '김철수',
      userAvatarUrl: undefined,
      slotNumber: 2,
      role: 'PARTICIPANT',
      status: 'ACCEPTED',
      hasContent: true,
    },
  ],
  createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25시간 전
  deadlineAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
  isAutoSubmitted: true,
};
