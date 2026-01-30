'use client';

/**
 * 알림(소식) 컴포넌트 — 모달
 *
 * @description
 * - 마이페이지 헤더의 notificationButton(알림 버튼)을 눌렀을 때 진입
 * - 알림 목록(새 알림/이전 알림) 표시, 새 알림 클릭 시 라우팅·읽음 처리, 이전 알림 삭제
 * - 닫기 시 onClose 호출
 */

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiCloseLine } from '@remixicon/react';
import { useNotifications, useMarkNotificationRead, useDeleteNotification } from '@/commons/apis/me/notifications/hooks';
import { getNotificationRoute } from '@/commons/utils/notification-route';
import { useToast } from '@/commons/provider/toast-provider';
import type { Notification as NotificationType } from '@/commons/apis/me/notifications/types';
import { NotificationListContent } from './components/NotificationListContent';
import styles from './styles.module.css';

export interface NotificationProps {
  onClose?: () => void;
  className?: string;
}

export function Notification({ className = '', onClose }: NotificationProps) {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { unread, read, isLoading, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleNewNotificationClick = useCallback(
    (item: NotificationType) => {
      const path = getNotificationRoute(item.type, item.targetId ?? null, item.id);
      if (path) {
        router.push(path);
        onClose?.();
        markRead.mutate(item.id);
      } else {
        showError('콘텐츠를 찾을 수 없습니다.');
        markRead.mutate(item.id);
      }
    },
    [markRead, router, onClose, showError]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, notificationId: string) => {
      e.stopPropagation();
      if (deletingId) return;
      setDeletingId(notificationId);
      deleteNotification.mutate(notificationId, {
        onSuccess: () => showSuccess('알림이 삭제되었습니다.'),
        onError: () => showError('삭제에 실패했습니다.'),
        onSettled: () => setDeletingId(null),
      });
    },
    [deleteNotification, deletingId, showSuccess, showError]
  );

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>알림</h2>
            {unread.length > 0 && (
              <p className={styles.headerSubtitle}>새 알림 {unread.length}개</p>
            )}
          </div>
          <div className={styles.headerRight}>
           
            <button
              type="button"
              className={styles.headerIconButton}
              onClick={onClose}
              aria-label="닫기"
            >
              <RiCloseLine size={20} className={styles.headerIcon} />
            </button>
          </div>
        </header>

        <NotificationListContent
          unread={unread}
          read={read}
          onMarkAllRead={
            unread.length > 0
              ? () => unread.forEach((item) => markRead.mutate(item.id))
              : undefined
          }
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
          onNewNotificationClick={handleNewNotificationClick}
          onDeleteClick={handleDeleteClick}
          deletingId={deletingId}
        />

        <div className={styles.versionInfo}>VERSION 1.0.0 © 2024</div>
      </div>
    </div>
  );
}

export default Notification;
