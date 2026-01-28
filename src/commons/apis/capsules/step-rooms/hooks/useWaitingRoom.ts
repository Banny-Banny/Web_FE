/**
 * @fileoverview 대기실 상세 조회 React Query 훅
 * @description 대기실 상세 정보 및 참여자 목록을 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getWaitingRoomDetail } from '../index';
import type { WaitingRoomDetailResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 대기실 상세 조회 훅
 * 
 * 대기실 ID를 기반으로 대기실 상세 정보 및 참여자 목록을 조회합니다.
 * 참여자 목록은 5초마다 자동으로 갱신됩니다.
 * 
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {UseQueryResult<WaitingRoomDetailResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useWaitingRoom('capsule-123');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (data) return <div>대기실 정보: {data.capsuleName}</div>;
 * ```
 */
export function useWaitingRoom(capsuleId: string | null | undefined) {
  return useQuery<WaitingRoomDetailResponse, ApiError>({
    queryKey: ['waitingRoom', capsuleId],
    queryFn: () => {
      if (!capsuleId) {
        throw new Error('대기실 ID가 필요합니다.');
      }
      return getWaitingRoomDetail(capsuleId);
    },
    enabled: !!capsuleId,
    staleTime: 30000, // 30초간 캐시 유지
    gcTime: 1000 * 60 * 5, // 5분간 가비지 컬렉션 방지
    // refetchInterval: 5000, // 자동 갱신 비활성화
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
