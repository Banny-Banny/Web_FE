/**
 * @fileoverview useWaitingRoom 훅
 * @description 대기실 정보 조회 훅 (실제 API 사용)
 */

import { useWaitingRoom as useWaitingRoomApi } from '@/commons/apis/capsules/step-rooms/hooks/useWaitingRoom';
import { useWaitingRoomSettings as useWaitingRoomSettingsApi } from '@/commons/apis/capsules/step-rooms/hooks/useWaitingRoomSettings';
import type { WaitingRoomState } from '../types';

/**
 * 대기실 정보 조회 훅
 *
 * 대기실 상세 정보와 설정값을 조회합니다.
 *
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns 대기실 정보 및 상태
 *
 * @example
 * ```typescript
 * const { state, waitingRoom, settings, isLoading, error } = useWaitingRoom('capsule-123');
 *
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error}</div>;
 * if (waitingRoom && settings) return <WaitingRoomInfo waitingRoom={waitingRoom} settings={settings} />;
 * ```
 */
export function useWaitingRoom(capsuleId: string | null | undefined) {
  const {
    data: waitingRoom,
    isLoading: isLoadingWaitingRoom,
    error: waitingRoomError,
  } = useWaitingRoomApi(capsuleId);

  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useWaitingRoomSettingsApi(capsuleId);

  const isLoading = isLoadingWaitingRoom || isLoadingSettings;

  // 에러 메시지 추출
  const getErrorMessage = (): string | undefined => {
    // 대기실 정보 조회 에러만 치명적 에러로 처리
    // 설정값 조회 실패는 graceful degradation
    if (!waitingRoomError) return undefined;

    // 네트워크 오류 (status가 없는 경우) - 먼저 체크
    if (!waitingRoomError.status) {
      return '네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.';
    }

    // API 에러의 message 필드 사용
    if (waitingRoomError.message) {
      return waitingRoomError.message;
    }

    // 기본 에러 메시지
    return '대기실 정보를 불러오는 중 오류가 발생했습니다.';
  };

  // 상태 결정
  const getState = (): WaitingRoomState => {
    if (!capsuleId) {
      return { status: 'error', error: '대기실 ID가 필요합니다.' };
    }

    if (isLoading) {
      return { status: 'loading' };
    }

    // 대기실 정보 조회 에러만 치명적 에러로 처리
    if (waitingRoomError) {
      return { status: 'error', error: getErrorMessage() };
    }

    // 대기실 정보가 있으면 성공 (설정값은 optional)
    if (waitingRoom) {
      return { status: 'success', waitingRoomId: capsuleId };
    }

    return { status: 'idle' };
  };

  const state = getState();

  return {
    state,
    waitingRoom: state.status === 'success' ? waitingRoom : undefined,
    // 설정값은 있으면 사용, 없으면 대기실 정보로 fallback
    settings: state.status === 'success' ? settings : undefined,
    isLoading,
    error: getErrorMessage(),
  };
}
