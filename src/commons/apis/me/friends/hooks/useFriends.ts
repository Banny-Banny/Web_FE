/**
 * @fileoverview 친구 목록 조회 React Query 훅
 * @description 사용자의 친구 목록을 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getFriends } from '../index';
import type { GetFriendsParams, GetFriendsResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * useFriends 옵션
 */
export interface UseFriendsOptions {
  /** true일 때만 친구 목록을 조회 (예: 온보딩에서 친구 연동 허용한 경우) */
  enabled?: boolean;
}

/**
 * 친구 목록 조회 훅
 * 
 * 사용자의 친구 목록을 페이지네이션을 통해 조회합니다.
 * enabled가 false이면 API를 호출하지 않습니다 (친구 연동 미동의 시 사용).
 * 
 * @param params - 조회 파라미터 (limit, offset)
 * @param options - enabled: 친구 연동 허용 시에만 조회할 경우 true
 * @returns {UseQueryResult<GetFriendsResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data: profile } = useProfile();
 * const { data, isLoading, error, refetch } = useFriends(
 *   { limit: 20, offset: 0 },
 *   { enabled: profile?.friendConsent === true }
 * );
 * ```
 */
export function useFriends(params: GetFriendsParams = {}, options: UseFriendsOptions = {}) {
  const { enabled = true } = options;

  return useQuery<GetFriendsResponse, ApiError>({
    queryKey: ['friends', 'list', params.limit, params.offset],
    queryFn: () => getFriends(params),
    enabled,
    staleTime: 1000 * 60 * 1, // 1분간 캐시 유지
    gcTime: 1000 * 60 * 5, // 5분간 가비지 컬렉션 방지
    retry: (failureCount, error) => {
      // 네트워크 오류(status가 없는 경우)는 최대 1회 재시도
      if (!error.status) {
        return failureCount < 1;
      }
      // 401, 404 클라이언트 오류는 재시도하지 않음
      if (error.status === 401 || error.status === 404) {
        return false;
      }
      // 4xx 클라이언트 오류는 재시도하지 않음
      if (error.status >= 400 && error.status < 500) {
        return false;
      }
      // 5xx 서버 오류는 최대 1회 재시도
      return failureCount < 1;
    },
  });
}
