'use client';

/**
 * @fileoverview TossPaymentWidget 컴포넌트
 * @description 토스페이먼츠 결제창 연동 컴포넌트
 */

import React, { useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { Button } from '@/commons/components/button';
import type { TossPaymentWidgetProps } from './types';
import styles from './styles.module.css';

/**
 * TossPaymentWidget 컴포넌트
 *
 * 토스페이먼츠 SDK를 사용하여 결제창을 호출합니다.
 */
export function TossPaymentWidget({
  orderId,
  amount,
  orderName,
  customerName,
  onSuccess: _onSuccess,
  onError,
  disabled = false,
}: TossPaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 토스페이먼츠 클라이언트 키
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  // 결제 요청
  const handleRequestPayment = async () => {
    if (!clientKey) {
      const errorMsg = '토스페이먼츠 클라이언트 키가 설정되지 않았습니다.';
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      // 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(clientKey);

      // 결제창 호출
      const payment = tossPayments.payment({ customerKey: orderId });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: amount,
        },
        orderId,
        orderName: orderName || '타임캡슐 생성',
        customerName: customerName || undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '결제 요청 중 오류가 발생했습니다.';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 버튼 레이블 결정
  const getButtonLabel = () => {
    if (isLoading) return '결제 준비 중...';
    return '카드로 결제하기';
  };

  return (
    <div className={styles.container}>
      {/* 공통 Button 컴포넌트 사용 */}
      <Button
        label={getButtonLabel()}
        variant={disabled || isLoading ? 'disabled' : 'primary'}
        size="L"
        fullWidth
        disabled={isLoading || disabled}
        onPress={handleRequestPayment}
      />
    </div>
  );
}
