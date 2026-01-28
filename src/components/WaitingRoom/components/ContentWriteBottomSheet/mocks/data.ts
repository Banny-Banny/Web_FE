/**
 * @fileoverview 컨텐츠 작성 바텀시트 Mock 데이터
 * @description UI 개발 및 테스트를 위한 Mock 데이터
 */

import type { MyContentResponse } from '@/commons/apis/capsules/step-rooms/types';
import type { ContentFormData } from '../types';

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

/**
 * Mock 컨텐츠 폼 데이터
 */
export const mockContentFormData: ContentFormData = {
  text: '타임캡슐에 담을 메시지입니다.',
  images: [],
  existingImageUrls: [],
  music: null,
  video: null,
};
