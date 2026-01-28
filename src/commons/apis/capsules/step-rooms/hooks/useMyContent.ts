/**
 * @fileoverview 본인 컨텐츠 조회 React Query 훅
 * @description 사용자가 작성한 컨텐츠를 조회하는 React Query query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getMyContent } from '../index';
import type { MyContentResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 본인 컨텐츠 조회 React Query query 훅
 *
 * 사용자가 작성한 컨텐츠를 조회합니다.
 * 404 에러는 "내용이 없음"을 의미하는 정상적인 응답이므로 재시도하지 않습니다.
 *
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {UseQueryResult<MyContentResponse, Error>} React Query query 결과
 *
 * @example
 * ```typescript
 * const { data: content, isLoading, error } = useMyContent('capsule-123');
 * ```
 */
export function useMyContent(capsuleId: string | null | undefined) {
  return useQuery<MyContentResponse>({
    queryKey: ['myContent', capsuleId],
    queryFn: () => {
      if (!capsuleId) {
        throw new Error('Capsule ID is required');
      }
      return getMyContent(capsuleId);
    },
    enabled: !!capsuleId,
    staleTime: 30000, // 30초
    // 404 에러는 getMyContent에서 이미 처리되므로 재시도하지 않음
    retry: (failureCount, error) => {
      const apiError = error as ApiError;
      // 404 에러일 때는 재시도하지 않음 (getMyContent에서 이미 빈 응답으로 처리됨)
      if (apiError?.status === 404) {
        return false;
      }
      // 403 에러는 방 참여 직후 서버 상태 동기화 지연으로 발생할 수 있으므로 1회 재시도
      if (apiError?.status === 403 && failureCount < 1) {
        return true;
      }
      // 다른 에러는 기본 재시도 로직 사용 (최대 3회)
      return failureCount < 3;
    },
    // 재시도 간격 설정 (403 에러 시 빠른 재시도)
    retryDelay: (attemptIndex, error) => {
      const apiError = error as ApiError;
      // 403 에러는 서버 상태 동기화 지연이므로 500ms 후 재시도
      if (apiError?.status === 403) {
        return 500;
      }
      // 다른 에러는 기본 exponential backoff (1000ms * 2^attemptIndex)
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
    // 404는 정상 응답이므로 에러로 간주하지 않음
    throwOnError: (error) => {
      const apiError = error as ApiError;
      // 404는 에러로 간주하지 않음
      return apiError?.status !== 404;
    },
  });
}
