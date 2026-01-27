/**
 * 이스터에그 지도 표시 E2E 테스트용 Mock 데이터
 */

import type { LocalLoginRequest } from '@/commons/apis/auth/types';
import type { 
  GetCapsulesResponse, 
  GetCapsuleResponse,
  RecordCapsuleViewResponse,
  GetCapsuleViewersResponse 
} from '@/commons/apis/easter-egg/types';

/**
 * 테스트 계정 정보
 * 
 * ⚠️ 주의: 
 * - 환경 변수에서 테스트 계정 정보를 가져옵니다.
 * - .env.local에 NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_EMAIL, NEXT_PUBLIC_PASSWORD 설정 필요
 */
export const testLoginRequest: LocalLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '01030728535',
  password: process.env.NEXT_PUBLIC_PASSWORD || 'test1234!@',
};

/**
 * 테스트용 Mock 캡슐 목록 응답
 */
export const mockCapsulesResponse: GetCapsulesResponse = {
  items: [
    {
      id: 'capsule-1',
      title: '친구 이스터에그 1',
      content: '테스트 콘텐츠',
      latitude: 37.5665,
      longitude: 126.978,
      distance_m: 15,
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
      latitude: 37.5666,
      longitude: 126.979,
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
      latitude: 37.5670,
      longitude: 126.980,
      distance_m: 250,
      type: 'EASTER_EGG',
      is_mine: false,
      is_locked: false,
      can_open: false,
    },
  ],
  page_info: null,
};

/**
 * 테스트용 Mock 캡슐 기본 정보 응답
 */
export const mockCapsuleDetailResponse: GetCapsuleResponse = {
  id: 'capsule-1',
  title: '친구 이스터에그 1',
  content: '테스트 콘텐츠',
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
  viewers: [],
  created_at: '2026-01-27T00:00:00.000Z',
};

/**
 * 테스트용 Mock 발견 기록 응답 (첫 발견)
 */
export const mockFirstViewResponse: RecordCapsuleViewResponse = {
  success: true,
  message: '이스터에그를 발견했습니다!',
  is_first_view: true,
};

/**
 * 테스트용 Mock 발견 기록 응답 (중복 발견)
 */
export const mockDuplicateViewResponse: RecordCapsuleViewResponse = {
  success: true,
  message: '이미 발견한 이스터에그입니다.',
  is_first_view: false,
};

/**
 * 테스트용 Mock 발견자 목록 응답
 */
export const mockViewersResponse: GetCapsuleViewersResponse = {
  capsule_id: 'capsule-2',
  total_viewers: 2,
  view_limit: 5,
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
      profile_img: null,
      viewed_at: '2026-01-27T12:00:00.000Z',
    },
  ],
};

/**
 * 테스트용 Mock 빈 발견자 목록 응답
 */
export const mockEmptyViewersResponse: GetCapsuleViewersResponse = {
  capsule_id: 'capsule-2',
  total_viewers: 0,
  view_limit: 5,
  viewers: [],
};
