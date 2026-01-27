/**
 * @fileoverview OrderSummary 컴포넌트 타입 정의
 */

import type { OrderSummaryData } from '../../types';

/**
 * OrderSummary 컴포넌트 Props
 */
export interface OrderSummaryProps {
  /** 주문 정보 요약 데이터 */
  data: OrderSummaryData;
}
