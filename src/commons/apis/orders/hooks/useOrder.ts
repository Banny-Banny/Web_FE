/**
 * @fileoverview 주문 정보 조회 React Query 훅
 * @description 주문 상세 정보를 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../index';
import type { GetOrderResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 주문 정보 조회 훅
 * 
 * 주문 ID를 기반으로 주문 상세 정보를 조회합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @returns {UseQueryResult<GetOrderResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useOrder('order-123');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (data) return <div>주문 정보: {data.order.order_id}</div>;
 * ```
 */
export function useOrder(orderId: string | null | undefined) {
  return useQuery<GetOrderResponse, ApiError>({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('주문 ID가 필요합니다.');
      }
      return getOrder(orderId);
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
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
