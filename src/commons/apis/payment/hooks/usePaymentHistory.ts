/**
 * @fileoverview 결제 내역 조회 Hook
 * @description 로그인한 사용자의 결제 내역 목록을 조회하는 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { getMyPayments } from '../index';
import type { GetMyPaymentsParams } from '../types';

/**
 * 내 결제 내역 목록 조회 Hook
 *
 * 로그인한 사용자의 결제 내역을 페이지네이션하여 조회합니다.
 *
 * @param {GetMyPaymentsParams} params - 조회 파라미터 (page, limit, status)
 * @returns React Query result
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useMyPayments({
 *   page: 1,
 *   limit: 10,
 *   status: 'ALL',
 * });
 * ```
 */
export function useMyPayments({ page = 1, limit = 10, status = 'ALL' }: GetMyPaymentsParams = {}) {
  return useQuery({
    queryKey: ['payments', 'my-list', page, limit, status] as const,
    queryFn: () => getMyPayments({ page, limit, status }),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}
