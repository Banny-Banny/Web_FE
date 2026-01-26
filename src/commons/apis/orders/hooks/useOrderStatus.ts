/**
 * @fileoverview 주문 상태 조회 React Query 훅
 * @description 주문 상태 및 결제 정보를 조회하는 React Query 훅 (폴링 지원)
 */

import { useQuery } from '@tanstack/react-query';
import { getOrderStatus } from '../index';
import type { GetOrderStatusResponse } from '../types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 주문 상태 조회 훅
 * 
 * 주문 ID를 기반으로 주문 상태와 결제 정보를 조회합니다.
 * 결제 대기 중일 때는 자동으로 폴링합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @param {Object} options - 추가 옵션
 * @param {boolean} options.enablePolling - 폴링 활성화 여부 (기본값: true)
 * @param {number} options.pollingInterval - 폴링 간격 (밀리초, 기본값: 3000)
 * @returns {UseQueryResult<GetOrderStatusResponse, ApiError>} React Query 결과
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useOrderStatus('order-123');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (data) return <div>주문 상태: {data.order_status}</div>;
 * ```
 */
export function useOrderStatus(
  orderId: string | null | undefined,
  options?: {
    enablePolling?: boolean;
    pollingInterval?: number;
  }
) {
  const { enablePolling = true, pollingInterval = 3000 } = options || {};

  return useQuery<GetOrderStatusResponse, ApiError>({
    queryKey: ['orderStatus', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('주문 ID가 필요합니다.');
      }
      return getOrderStatus(orderId);
    },
    enabled: !!orderId,
    staleTime: 1000 * 30, // 30초간 캐시 유지
    gcTime: 1000 * 60 * 5, // 5분간 가비지 컬렉션 방지
    // 결제 대기 중일 때만 폴링
    refetchInterval: (query) => {
      if (!enablePolling || !orderId) {
        return false;
      }
      
      const data = query.state.data;
      // 결제 대기 중일 때만 폴링
      if (data?.order_status === 'PENDING_PAYMENT') {
        return pollingInterval;
      }
      
      return false;
    },
  });
}
