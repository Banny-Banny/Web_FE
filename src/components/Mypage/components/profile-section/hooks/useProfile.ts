/**
 * @fileoverview 내 프로필 조회 React Query 훅
 * @description 로그인한 사용자의 프로필 정보를 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/commons/apis/auth/me';
import type { MeResponse } from '@/commons/apis/auth/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 내 프로필 조회 훅
 * 
 * 로그인한 사용자의 프로필 정보를 조회합니다.
 * 
 * @returns {UseQueryResult<MeResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useProfile();
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (data) return <div>닉네임: {data.nickname}</div>;
 * ```
 */
export function useProfile() {
  return useQuery<MeResponse, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: () => getMe(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
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
