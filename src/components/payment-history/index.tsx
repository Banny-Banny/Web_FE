'use client';

/**
 * 결제 내역 컴포넌트
 *
 * @description
 * - 결제 내역 목록 표시 (실제 API 연동)
 * - 각 카드 클릭 시 상세 Modal 표시
 * - 영수증 상세보기 기능
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowRightSLine,
  RiCloseLine,
  RiInboxLine,
  RiExternalLinkLine,
} from '@remixicon/react';
import { useMyPayments } from '@/commons/apis/payment/hooks/usePaymentHistory';
import type { PaymentListItem } from '@/commons/apis/payment/types';
import { formatCurrency } from '@/commons/utils/format';
import styles from './styles.module.css';
import type { PaymentHistoryProps } from './types';

/**
 * 날짜 포맷팅 함수
 * ISO 8601 → "YYYY-MM-DD"
 */
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 결제 상태 텍스트 변환
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case 'DONE':
      return '완료';
    case 'CANCELED':
      return '취소됨';
    default:
      return status;
  }
};

/**
 * PaymentHistory 컴포넌트
 */
export function PaymentHistory({ className = '' }: PaymentHistoryProps) {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // API 호출
  const { data, isLoading, error } = useMyPayments({
    page: 1,
    limit: 100,
    status: 'ALL',
  });

  const allPayments = data?.payments || [];

  // 헤더 닫기 핸들러
  const handleClose = () => {
    router.back();
  };

  // 카드 클릭 핸들러
  const handleCardPress = (payment: PaymentListItem) => {
    setSelectedPayment(payment);
    setIsDetailVisible(true);
  };

  // 영수증 상세보기
  const handleViewReceipt = (payment: PaymentListItem) => {
    // 샌드박스 환경 체크
    const isSandbox = payment.receiptUrl?.includes('sandbox');

    if (isSandbox) {
      // 샌드박스 환경에서는 영수증 URL이 제대로 작동하지 않을 수 있음
      alert(
        '⚠️ 테스트 환경 안내\n\n' +
        '현재 샌드박스(테스트) 환경에서는 영수증 상세보기가 제한됩니다.\n\n' +
        `결제 정보:\n` +
        `• 주문번호: ${payment.orderNo}\n` +
        `• 결제금액: ${formatCurrency(payment.amount)}\n` +
        `• 결제수단: ${payment.method}\n` +
        `• 결제일: ${formatDate(payment.approvedAt)}\n\n` +
        '실제 프로덕션 환경에서는 정상적으로 영수증을 확인하실 수 있습니다.'
      );
      return;
    }

    // 프로덕션 환경에서는 영수증 URL 열기
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('영수증 URL을 찾을 수 없습니다.');
    }
  };

  // 결제 카드 렌더링
  const renderPaymentCard = (item: PaymentListItem) => {
    const isDone = item.tossStatus === 'DONE';

    return (
      <button
        key={item.orderNo}
        className={styles.paymentCard}
        onClick={() => handleCardPress(item)}
        type="button"
      >
        {/* 헤더: 주문명 + 화살표 */}
        <div className={styles.cardHeader}>
          <div className={styles.orderName}>
            {item.orderName || '타임캡슐 결제'}
          </div>
          <RiArrowRightSLine size={20} className={styles.cardArrow} />
        </div>

        {/* 바디: 날짜 + 상태 뱃지 + 금액 */}
        <div className={styles.cardBody}>
          <div className={styles.cardInfo}>
            <div className={styles.cardDate}>{formatDate(item.approvedAt)}</div>
            <div
              className={`${styles.statusBadge} ${
                isDone ? styles.statusBadgeDone : styles.statusBadgeCanceled
              }`}
            >
              <span className={styles.statusText}>{getStatusText(item.tossStatus)}</span>
            </div>
          </div>
          <div className={styles.cardAmount}>{formatCurrency(item.amount)}</div>
        </div>
      </button>
    );
  };

  // 빈 화면
  const renderEmpty = () => {
    return (
      <div className={styles.emptyContainer}>
        <RiInboxLine size={64} className={styles.emptyIcon} />
        <div className={styles.emptyText}>결제 내역이 없습니다</div>
        <div className={styles.emptySubText}>결제한 내역이 없습니다</div>
      </div>
    );
  };

  // 상세 정보 Modal (영수증)
  const renderDetailModal = () => {
    if (!selectedPayment || !isDetailVisible) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setIsDetailVisible(false)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            className={styles.modalCloseButton}
            onClick={() => setIsDetailVisible(false)}
            type="button"
            aria-label="닫기"
          >
            <RiCloseLine size={24} />
          </button>

          {/* 헤더 */}
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>결제 영수증</h2>
            <p className={styles.modalSubtitle}>Receipt</p>
          </div>

          <div className={styles.modalDivider} />

          {/* 상세 정보 */}
          <div className={styles.modalSection}>
            <div className={styles.modalInfoItem}>
              <p className={styles.modalLabel}>주문번호</p>
              <p className={styles.modalValue}>{selectedPayment.orderNo}</p>
            </div>

            <div className={styles.modalInfoItem}>
              <p className={styles.modalLabel}>결제일</p>
              <p className={styles.modalValue}>{formatDate(selectedPayment.approvedAt)}</p>
            </div>

            <div className={styles.modalInfoItem}>
              <p className={styles.modalLabel}>결제수단</p>
              <p className={styles.modalValue}>{selectedPayment.method}</p>
            </div>
          </div>

          <div className={styles.modalDivider} />

          {/* 상세 내역 */}
          <div className={styles.modalSection}>
            <div className={styles.modalItemList}>
              <div className={styles.modalItemRow}>
                <span className={styles.modalItemLabel}>
                  {selectedPayment.orderName || '타임캡슐 결제'}
                </span>
                <span className={styles.modalItemValue}>
                  {formatCurrency(selectedPayment.amount)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalDivider} />

          {/* 총 결제금액 */}
          <div className={styles.modalTotalSection}>
            <span className={styles.modalTotalLabel}>총 결제금액</span>
            <span className={styles.modalTotalAmount}>
              {formatCurrency(selectedPayment.amount)}
            </span>
          </div>

          {/* 영수증 상세보기 버튼 */}
          <div className={styles.modalButtonContainer}>
            <button
              className={styles.receiptButton}
              onClick={() => handleViewReceipt(selectedPayment)}
              type="button"
            >
              <RiExternalLinkLine size={16} />
              {selectedPayment.receiptUrl?.includes('sandbox')
                ? '결제 정보 확인'
                : '영수증 상세보기'}
            </button>
          </div>

          {/* 하단 텍스트 */}
          <div className={styles.modalFooter}>
            <p className={styles.modalFooterText}>이 영수증은 결제 확인용입니다</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>결제 내역</h1>
          <p className={styles.headerSubtitle}>
            총 {data?.total ?? allPayments.length}건의 결제
            {data && data.total !== allPayments.length && ` (표시: ${allPayments.length}건)`}
          </p>
        </div>
        <button
          className={styles.headerCloseButton}
          onClick={handleClose}
          type="button"
          aria-label="닫기"
        >
          <RiCloseLine size={24} />
        </button>
      </div>

      {/* 결제 내역 목록 */}
      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>결제 내역을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>결제 내역을 불러올 수 없습니다</p>
            <p className={styles.emptySubText}>잠시 후 다시 시도해주세요</p>
          </div>
        ) : allPayments.length === 0 ? (
          renderEmpty()
        ) : (
          allPayments.map(renderPaymentCard)
        )}
      </div>

      {/* 상세 정보 Modal */}
      {renderDetailModal()}
    </div>
  );
}

export default PaymentHistory;
