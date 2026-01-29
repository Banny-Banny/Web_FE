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

/**
 * 24시간 타이머 상태
 */
export interface TimerState {
  /** 남은 시간 (시) */
  hours: number;
  /** 남은 시간 (분) */
  minutes: number;
  /** 남은 시간 (초) */
  seconds: number;
  /** 타이머 만료 여부 */
  expired: boolean;
  /** 긴급 상태 (1시간 미만) */
  isUrgent: boolean;
  /** 위급 상태 (10분 미만) */
  isCritical: boolean;
}

/**
 * GPS 위치 정보
 */
export interface GeolocationData {
  latitude: number;
  longitude: number;
}

/**
 * 제출 버튼 Props
 */
export interface SubmitButtonProps {
  /** 버튼 활성화 여부 */
  disabled: boolean;
  /** 비활성화 사유 */
  disabledReason?: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 제출 확인 모달 Props
 */
export interface SubmitConfirmModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 확인 핸들러 */
  onConfirm: () => void;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 남은 시간 (시간 단위) */
  remainingHours: number;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 제출 완료 모달 Props
 */
export interface SubmitCompleteModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 타임캡슐 ID */
  capsuleId: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 자동 제출 여부 */
  isAutoSubmitted: boolean;
}

/**
 * 자동 제출 안내 모달 Props
 */
export interface AutoSubmitModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 제출 시각 (ISO 8601) */
  buriedAt: string;
  /** 개봉 예정일 (ISO 8601) */
  openDate: string;
  /** 보관함으로 이동 핸들러 */
  onNavigateToVault: () => void;
}
