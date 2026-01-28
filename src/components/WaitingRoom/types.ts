/**
 * @fileoverview 대기실 페이지 컴포넌트 타입 정의
 * @description 대기실 페이지 및 관련 컴포넌트의 타입 정의
 */

import type {
  WaitingRoomDetailResponse,
  WaitingRoomSettingsResponse,
  Participant,
} from '@/commons/apis/capsules/step-rooms/types';

/**
 * 대기실 페이지 Props
 */
export interface WaitingRoomPageProps {
  params: {
    capsuleId: string;
  };
}

/**
 * 대기실 페이지 상태
 */
export interface WaitingRoomState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  waitingRoomId?: string;
}

/**
 * 대기실 정보 표시 컴포넌트 Props
 */
export interface WaitingRoomInfoProps {
  /** 대기실 상세 정보 */
  waitingRoom: WaitingRoomDetailResponse;
  /** 대기실 설정값 */
  settings: WaitingRoomSettingsResponse;
}

/**
 * 참여자 목록 컴포넌트 Props
 */
export interface ParticipantListProps {
  /** 참여자 목록 */
  participants: Participant[];
  /** 현재 참여 인원수 */
  currentHeadcount: number;
  /** 최대 참여 인원수 */
  maxHeadcount: number;
}
