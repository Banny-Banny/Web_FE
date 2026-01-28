'use client';

/**
 * 문의 내역 리스트 (문의 항목 + 빈 상태 + 새 문의 버튼)
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/commons/components/button';
import type { Inquiry } from '../../types';
import styles from './styles.module.css';

interface InquiryListProps {
  inquiries?: Inquiry[];
  onInquiryPress?: (inquiry: Inquiry) => void;
  onNewInquiryPress?: () => void;
  isLoading?: boolean;
}

function formatTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (diffDays === 0) return `${hours}:${minutes}`;
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${m}/${d}`;
}

function getStatusLabel(status: Inquiry['status']): string {
  const map: Record<Inquiry['status'], string> = {
    PENDING: '대기중',
    IN_PROGRESS: '진행중',
    RESOLVED: '완료',
    CLOSED: '종료',
  };
  return map[status] ?? status;
}

function InquiryItemRow({
  inquiry,
  onPress,
}: {
  inquiry: Inquiry;
  onPress?: (inquiry: Inquiry) => void;
}) {
  const unreadCount = (inquiry as Inquiry & { unreadCount?: number }).unreadCount ?? 0;
  const isClosed = inquiry.status === 'CLOSED';
  const statusClass =
    inquiry.status === 'PENDING'
      ? styles.statusPending
      : inquiry.status === 'IN_PROGRESS'
        ? styles.statusInProgress
        : inquiry.status === 'RESOLVED'
          ? styles.statusResolved
          : styles.statusClosed;

  return (
    <button
      type="button"
      className={`${styles.item} ${isClosed ? styles.itemClosed : ''}`}
      onClick={() => onPress?.(inquiry)}
      aria-label={`문의: ${inquiry.title}`}
    >
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span className={styles.itemTitle} title={inquiry.title}>
            {inquiry.title}
          </span>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {getStatusLabel(inquiry.status)}
          </span>
        </div>
        {inquiry.last_message_preview && (
          <p className={styles.preview} title={inquiry.last_message_preview}>
            {inquiry.last_message_preview}
          </p>
        )}
        <div className={styles.itemFooter}>
          <span className={styles.time}>
            {inquiry.last_message_at
              ? formatTime(inquiry.last_message_at)
              : formatTime(inquiry.created_at)}
          </span>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge} aria-label={`읽지 않음 ${unreadCount}건`}>
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function InquiryList({
  inquiries = [],
  onInquiryPress,
  onNewInquiryPress,
  isLoading = false,
}: InquiryListProps) {
  const router = useRouter();
  const handleNewPress = () => {
    if (onNewInquiryPress) onNewInquiryPress();
    else router.push('/customer-center/chat');
  };
  const handleItemPress = (inquiry: Inquiry) => {
    if (onInquiryPress) onInquiryPress(inquiry);
    else router.push('/customer-center/chat');
  };

  const hasInquiries = inquiries.length > 0;

  return (
    <div className={styles.container}>
      {hasInquiries ? (
        <ul className={styles.list} aria-busy={isLoading}>
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className={styles.listItem}>
              <InquiryItemRow inquiry={inquiry} onPress={handleItemPress} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            문의 내역이 없습니다.
            <br />
            1:1 문의를 시작해보세요.
          </p>
          <div className={styles.emptyButton}>
            <Button
              label="1:1 문의하기"
              variant="primary"
              size="M"
              onPress={handleNewPress}
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
}
