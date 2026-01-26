/**
 * @fileoverview PaymentStatus 컴포넌트 타입 정의
 */

import type { PaymentStateStatus } from '../../types';

/**
 * PaymentStatus 컴포넌트 Props
 */
export interface PaymentStatusProps {
  /** 결제 상태 */
  status: PaymentStateStatus;
  /** 오류 메시지 (실패 상태일 때) */
  error?: string;
}
