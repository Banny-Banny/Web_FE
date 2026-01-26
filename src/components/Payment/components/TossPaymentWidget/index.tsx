'use client';

/**
 * @fileoverview TossPaymentWidget 컴포넌트
 * @description 토스 결제 위젯 래퍼 컴포넌트
 * 
 * @note
 * Phase 5에서 실제 토스페이먼츠 SDK 연동이 완료되었습니다.
 */

import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import type { TossPaymentWidgetProps } from './types';
import styles from './styles.module.css';

/**
 * 고객 키 생성 (UUID 형식)
 */
function generateCustomerKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * TossPaymentWidget 컴포넌트
 * 
 * 토스페이먼츠 SDK를 사용하여 결제 위젯을 렌더링하고 결제를 처리합니다.
 */
export function TossPaymentWidget({
  orderId,
  amount,
  onSuccess,
  onError,
  disabled = false,
}: TossPaymentWidgetProps) {
  const widgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 토스페이먼츠 클라이언트 키
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const customerKey = generateCustomerKey();

  // 위젯 초기화
  useEffect(() => {
    if (!clientKey) {
      const errorMsg = '토스페이먼츠 클라이언트 키가 설정되지 않았습니다.';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
      return;
    }

    if (!containerRef.current) {
      return;
    }

    let mounted = true;

    const initWidget = async () => {
      try {
        // 결제 위젯 로드
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        
        if (!mounted) {
          return;
        }

        widgetRef.current = paymentWidget;

        // 결제 위젯 렌더링
        const container = containerRef.current;
        if (!container) {
          throw new Error('결제 위젯 컨테이너를 찾을 수 없습니다.');
        }

        // containerRef.current의 id를 사용하거나 직접 DOM 요소 전달
        const containerId = container.id || `payment-widget-${orderId}`;
        if (!container.id) {
          container.id = containerId;
        }

        await paymentWidget.renderPaymentMethods(
          `#${containerId}`,
          { value: amount },
          { variantKey: 'DEFAULT' }
        );

        setIsLoading(false);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : '결제 위젯을 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      }
    };

    initWidget();

    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey, amount, orderId, onError]);

  // 결제 요청
  const handleRequestPayment = async () => {
    if (!widgetRef.current) {
      const errorMsg = '결제 위젯이 초기화되지 않았습니다.';
      onError?.(errorMsg);
      return;
    }

    try {
      // 결제 요청
      await widgetRef.current.requestPayment({
        orderId,
        orderName: `타임캡슐 주문 - ${orderId}`,
        successUrl: `${window.location.origin}/payment/success?paymentKey={paymentKey}&orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail?code={code}&message={message}&orderId=${orderId}`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '결제 요청 중 오류가 발생했습니다.';
      onError?.(errorMessage);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p className={styles.loadingMessage}>결제 위젯을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.widgetContainer} />
      <button
        type="button"
        className={styles.paymentButton}
        onClick={handleRequestPayment}
        disabled={isLoading || !!error || disabled}
      >
        토스페이먼츠로 결제하기
      </button>
    </div>
  );
}
