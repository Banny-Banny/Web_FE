'use client';

/**
 * @fileoverview Payment 메인 컨테이너 컴포넌트
 * @description 결제 페이지의 최상위 컨테이너, 전체 결제 플로우 관리
 * 
 * @note
 * Phase 5에서 실제 API 호출로 교체되었습니다.
 */

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderSummary } from './components/OrderSummary';
import { TossPaymentWidget } from './components/TossPaymentWidget';
import { PaymentStatus } from './components/PaymentStatus';
import { PaymentHeader } from './components/PaymentHeader';
import { AgreementSection } from './components/AgreementSection';
import { ErrorDisplay } from './components/ErrorDisplay';
import { RetryButton } from './components/RetryButton';
import { useOrderInfo } from './hooks/useOrderInfo';
import { usePayment } from './hooks/usePayment';
import { useOrderStatus } from '@/commons/apis/orders/hooks/useOrderStatus';
import type { AgreementState } from './components/AgreementSection/types';
import styles from './styles.module.css';

/**
 * Payment 컴포넌트
 * 
 * 결제 페이지의 최상위 컨테이너입니다.
 * - URL 쿼리 파라미터에서 주문 ID 추출
 * - 실제 API를 통한 주문 정보 조회
 * - 결제 플로우 오케스트레이션
 */
export function Payment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // 주문 정보 조회
  const { orderSummaryData, isLoading: isLoadingOrder, error: orderError } =
    useOrderInfo(orderId);

  // 주문 상태 조회 (결제 완료 후 폴링)
  const { data: orderStatus } = useOrderStatus(orderId, {
    enablePolling: true,
    pollingInterval: 3000,
  });

  // 동의 상태 관리
  const [agreementState, setAgreementState] = useState<AgreementState>({
    allAgreed: false,
    termsAgreed: false,
    privacyAgreed: false,
    paymentAgreed: false,
  });

  // 결제 플로우 관리
  const {
    paymentState,
    handlePaymentSuccess,
    handlePaymentError,
    retry,
  } = usePayment(
    orderId || '',
    orderSummaryData?.totalAmount || 0,
    `타임캡슐 주문 - ${orderId || ''}`
  );

  // 모든 필수 동의가 완료되었는지 확인
  const isAllAgreed =
    agreementState.termsAgreed &&
    agreementState.privacyAgreed &&
    agreementState.paymentAgreed;

  // 주문 정보 로딩 중
  if (isLoadingOrder) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <PaymentStatus status="loading" />
        </div>
      </div>
    );
  }

  // 주문 정보 조회 실패
  if (orderError || !orderSummaryData) {
    const errorMessage =
      orderError?.message || '주문 정보를 불러올 수 없습니다.';
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <PaymentHeader />
          <div className={styles.errorSection}>
            <ErrorDisplay message={errorMessage} type="order" />
            <RetryButton
              onRetry={() => {
                window.location.reload();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 결제 완료 상태 확인
  const isPaymentCompleted =
    orderStatus?.order_status === 'PAID' ||
    paymentState.status === 'success';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 헤더: 뒤로가기 + "결제하기" 제목 */}
        <PaymentHeader />

        {/* 주문 상품 섹션 */}
        <OrderSummary data={orderSummaryData} />

        {/* 전체 동의 섹션 */}
        <AgreementSection
          onAgreementChange={(state) => setAgreementState(state)}
        />

        {/* 결제 완료된 경우 위젯 숨김 */}
        {!isPaymentCompleted && (
          <TossPaymentWidget
            orderId={orderId || ''}
            amount={orderSummaryData.totalAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            disabled={!isAllAgreed}
          />
        )}

        {/* 결제 상태 표시 */}
        {paymentState.status !== 'idle' && (
          <PaymentStatus
            status={paymentState.status}
            error={paymentState.error}
          />
        )}

        {/* US3: 오류 처리 */}
        {paymentState.status === 'failed' && paymentState.error && (
          <div className={styles.errorSection}>
            <ErrorDisplay message={paymentState.error} type="payment" />
            <RetryButton onRetry={retry} />
          </div>
        )}
      </div>
    </div>
  );
}
