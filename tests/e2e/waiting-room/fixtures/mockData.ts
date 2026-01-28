/**
 * @fileoverview 대기실 E2E 테스트용 Mock 데이터
 * @description 대기실 정보, 설정값, 참여자 목록 등 테스트에 사용할 Mock 데이터
 */

import type {
  WaitingRoomDetailResponse,
  WaitingRoomSettingsResponse,
  Participant,
  MyContentResponse,
} from '@/commons/apis/capsules/step-rooms/types';

/**
 * Mock 대기실 설정값
 */
export const mockWaitingRoomSettings: WaitingRoomSettingsResponse = {
  roomId: 'waiting-room-123',
  capsuleName: '우리의 추억',
  maxHeadcount: 5,
  openDate: '2026-12-31T00:00:00Z',
  maxImagesPerPerson: 5,
  hasMusic: true,
  hasVideo: true,
};

/**
 * Mock 대기실 설정값 (소규모 - 3명)
 */
export const mockWaitingRoomSettingsSmall: WaitingRoomSettingsResponse = {
  roomId: 'waiting-room-456',
  capsuleName: '빈 대기실',
  maxHeadcount: 3,
  openDate: '2026-12-31T00:00:00Z',
  maxImagesPerPerson: 5,
  hasMusic: true,
  hasVideo: true,
};

/**
 * Mock 참여자 목록
 */
export const mockParticipants: Participant[] = [
  {
    participantId: 'participant-1',
    userId: 'user-1',
    userName: '홍길동',
    userAvatarUrl: 'https://example.com/avatar1.jpg',
    slotNumber: 1,
    role: 'HOST',
    status: 'ACCEPTED',
    hasContent: true,
  },
  {
    participantId: 'participant-2',
    userId: 'user-2',
    userName: '김철수',
    userAvatarUrl: 'https://example.com/avatar2.jpg',
    slotNumber: 2,
    role: 'PARTICIPANT',
    status: 'ACCEPTED',
    hasContent: false,
  },
];

/**
 * Mock 대기실 상세 정보
 */
export const mockWaitingRoomDetail: WaitingRoomDetailResponse = {
  waitingRoomId: 'waiting-room-123',
  capsuleName: '우리의 추억',
  currentHeadcount: 2,
  maxHeadcount: 5,
  openDate: '2026-12-31T00:00:00Z',
  status: 'WAITING',
  participants: mockParticipants,
};

/**
 * Mock 대기실 상세 정보 (참여자 없음)
 */
export const mockWaitingRoomDetailEmpty: WaitingRoomDetailResponse = {
  waitingRoomId: 'waiting-room-456',
  capsuleName: '빈 대기실',
  currentHeadcount: 1,
  maxHeadcount: 3,
  openDate: '2026-12-31T00:00:00Z',
  status: 'WAITING',
  participants: [
    {
      participantId: 'participant-host',
      userId: 'user-host',
      userName: '방장',
      userAvatarUrl: 'https://example.com/avatar-host.jpg',
      slotNumber: 1,
      role: 'HOST',
      status: 'ACCEPTED',
      hasContent: false,
    },
  ],
};

/**
 * Mock 에러 응답
 */
export const mockErrorResponses = {
  NOT_FOUND: {
    status: 404,
    body: {
      error: 'STEP_ROOM_NOT_FOUND',
      message: '대기실을 찾을 수 없습니다.',
    },
  },
  UNAUTHORIZED: {
    status: 401,
    body: {
      error: 'UNAUTHORIZED',
      message: '인증되지 않은 사용자입니다.',
    },
  },
  FORBIDDEN: {
    status: 403,
    body: {
      error: 'FORBIDDEN',
      message: '대기실에 접근할 수 있는 권한이 없습니다.',
    },
  },
};

/**
 * Mock 본인 컨텐츠 응답
 */
export const mockMyContent: MyContentResponse = {
  text: '타임캡슐에 담을 메시지입니다.',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
  ],
  music: 'https://example.com/music.mp3',
  video: undefined,
  createdAt: '2026-01-28T10:00:00Z',
  updatedAt: '2026-01-28T12:00:00Z',
};

/**
 * Mock 빈 컨텐츠 응답
 */
export const mockEmptyContent: MyContentResponse = {
  text: undefined,
  images: undefined,
  music: undefined,
  video: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};
