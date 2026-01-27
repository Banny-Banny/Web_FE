/**
 * @fileoverview 주문 정보 조회 및 상태 관리 훅
 * @description 주문 정보를 조회하고 OrderSummaryData로 변환하는 훅
 */

import { useOrder } from '@/commons/apis/orders/hooks/useOrder';
import { transformOrderDetailToSummary } from '../types';
import type { OrderSummaryData } from '../types';

/**
 * 주문 정보 조회 훅
 * 
 * 주문 ID를 기반으로 주문 정보를 조회하고 OrderSummaryData로 변환합니다.
 * 
 * @param {string | null | undefined} orderId - 주문 ID
 * @returns {Object} 주문 정보 및 상태
 * @returns {OrderSummaryData | null} orderSummaryData - 주문 정보 요약 데이터
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {Error | null} error - 에러 상태
 * 
 * @example
 * ```typescript
 * const { orderSummaryData, isLoading, error } = useOrderInfo('order-123');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (orderSummaryData) return <OrderSummary data={orderSummaryData} />;
 * ```
 */
export function useOrderInfo(orderId: string | null | undefined) {
  const { data, isLoading, error } = useOrder(orderId);

  const orderSummaryData: OrderSummaryData | null = data
    ? transformOrderDetailToSummary(data.order)
    : null;

  return {
    orderSummaryData,
    isLoading,
    error,
  };
}
