/**
 * 이스터에그 지도 표시 UI 테스트용 Mock 데이터
 */

import type { 
  GetCapsulesResponse, 
  GetCapsuleResponse,
} from '@/commons/apis/easter-egg/types';

/**
 * 테스트용 Mock 캡슐 목록 응답
 * 
 * ⚠️ 주의: .env.local의 테스트 위치(37.565119, 127.053776) 근처 캡슐
 */
export const mockCapsulesResponse: GetCapsulesResponse = {
  items: [
    {
      id: 'capsule-1',
      title: '친구 이스터에그 1',
      content: '테스트 콘텐츠',
      latitude: 37.565119, // 테스트 위치와 동일 (자동 발견 테스트용, 거리 0m)
      longitude: 127.053776,
      distance_m: 15, // 자동 발견 범위 내 (30m 이내)
      type: 'EASTER_EGG',
      is_mine: false,
      is_locked: false,
      can_open: true,
      view_limit: 10,
      view_count: 3,
      media_types: ['image'],
      media_urls: ['https://example.com/image.jpg'],
    },
    {
      id: 'capsule-2',
      title: '내 이스터에그',
      content: '내가 숨긴 이스터에그',
      latitude: 37.565219, // 테스트 위치에서 약 11m
      longitude: 127.053876,
      distance_m: 100,
      type: 'EASTER_EGG',
      is_mine: true,
      is_locked: false,
      can_open: true,
      view_limit: 5,
      view_count: 2,
    },
    {
      id: 'capsule-3',
      title: '친구 이스터에그 2',
      content: '멀리 있는 캡슐',
      latitude: 37.567119, // 테스트 위치에서 약 222m (힌트 모달 테스트용)
      longitude: 127.055776,
      distance_m: 250,
      type: 'EASTER_EGG',
      is_mine: false,
      is_locked: false,
      can_open: false,
    },
    {
      id: 'capsule-4',
      title: '타임캡슐 1',
      content: '타임캡슐 콘텐츠',
      latitude: 37.565419, // 테스트 위치에서 약 33m
      longitude: 127.054076,
      distance_m: 50,
      type: 'TIME_CAPSULE',
      is_mine: false,
      is_locked: false,
      can_open: true,
    },
  ],
  page_info: null,
};

/**
 * 테스트용 Mock 캡슐 기본 정보 응답 (친구 이스터에그)
 */
export const mockCapsuleDetailResponse: GetCapsuleResponse = {
  id: 'capsule-1',
  title: '친구 이스터에그 1',
  content: '테스트 콘텐츠입니다. 이것은 친구가 숨긴 이스터에그입니다.',
  is_locked: false,
  view_limit: 10,
  view_count: 3,
  media_types: ['image'],
  media_urls: ['https://example.com/image.jpg'],
  author: {
    id: 'user-1',
    nickname: '친구',
    profile_img: 'https://example.com/profile.jpg',
  },
  viewers: [
    {
      id: 'viewer-1',
      nickname: '발견자1',
      profile_img: 'https://example.com/viewer1.jpg',
      viewed_at: '2026-01-26T10:00:00.000Z',
    },
    {
      id: 'viewer-2',
      nickname: '발견자2',
      viewed_at: '2026-01-27T12:00:00.000Z',
    },
  ],
  created_at: '2026-01-27T00:00:00.000Z',
};

/**
 * 테스트용 Mock 내 캡슐 기본 정보 응답
 */
export const mockMyCapsuleDetailResponse: GetCapsuleResponse = {
  id: 'capsule-2',
  title: '내 이스터에그',
  content: '내가 숨긴 이스터에그입니다.',
  is_locked: false,
  view_limit: 5,
  view_count: 2,
  author: {
    id: 'my-user-id',
    nickname: '나',
    profile_img: 'https://example.com/my-profile.jpg',
  },
  viewers: [
    {
      id: 'viewer-3',
      nickname: '발견자3',
      profile_img: 'https://example.com/viewer3.jpg',
      viewed_at: '2026-01-27T14:00:00.000Z',
    },
  ],
  created_at: '2026-01-26T00:00:00.000Z',
};

/**
 * 테스트용 Mock 힌트 캡슐 응답 (30m 밖)
 */
export const mockHintCapsuleDetailResponse: GetCapsuleResponse = {
  id: 'capsule-3',
  title: '친구 이스터에그 2',
  content: '멀리 있는 캡슐입니다.',
  is_locked: false,
  view_limit: 10,
  view_count: 1,
  author: {
    id: 'user-2',
    nickname: '친구2',
  },
  viewers: [],
  created_at: '2026-01-25T00:00:00.000Z',
};
