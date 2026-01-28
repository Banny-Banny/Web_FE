/**
 * @fileoverview 대기실 설정값 조회 React Query 훅
 * @description 캡슐 설정에서 설정한 정보를 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getWaitingRoomSettings } from '../index';
import type { WaitingRoomSettingsResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 대기실 설정값 조회 훅
 * 
 * 대기실 ID를 기반으로 캡슐 설정에서 설정한 정보를 조회합니다.
 * 설정값은 자주 변경되지 않으므로 캐시 시간이 길게 설정되어 있습니다.
 * 
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {UseQueryResult<WaitingRoomSettingsResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useWaitingRoomSettings('capsule-123');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (data) return <div>캡슐명: {data.capsuleName}</div>;
 * ```
 */
export function useWaitingRoomSettings(capsuleId: string | null | undefined) {
  return useQuery<WaitingRoomSettingsResponse, ApiError>({
    queryKey: ['waitingRoomSettings', capsuleId],
    queryFn: () => {
      if (!capsuleId) {
        throw new Error('대기실 ID가 필요합니다.');
      }
      return getWaitingRoomSettings(capsuleId);
    },
    enabled: !!capsuleId,
    staleTime: 60000, // 1분간 캐시 유지 (설정값은 자주 변경되지 않음)
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
    retry: (failureCount, error) => {
      // 네트워크 오류(status가 없는 경우)는 재시도하지 않음
      if (!error.status) return false;
      // 4xx 클라이언트 오류는 재시도하지 않음
      if (error.status >= 400 && error.status < 500) return false;
      // 5xx 서버 오류는 최대 1회 재시도
      return failureCount < 1;
    },
  });
}
