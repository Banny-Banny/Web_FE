/**
 * 소식(알림) 페이지
 *
 * @description
 * - 알림 목록 (새 알림/이전 알림) 표시
 * - 새 알림 클릭 시 라우팅·읽음 처리, 이전 알림 삭제
 * - 모달과 동일 훅·동작 사용
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/commons/components/page-header';
import { useNotifications, useMarkNotificationRead, useDeleteNotification } from '@/commons/apis/me/notifications/hooks';
import { getNotificationRoute } from '@/commons/utils/notification-route';
import { useToast } from '@/commons/provider/toast-provider';
import type { Notification as NotificationType } from '@/commons/apis/me/notifications/types';
import { NotificationListContent } from '@/components/Mypage/components/notification/components/NotificationListContent';

export default function NotificationsPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { unread, read, isLoading, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleNewNotificationClick = useCallback(
    (item: NotificationType) => {
      const path = getNotificationRoute(item.type, item.targetId ?? null, item.id);
      if (path) {
        router.push(path);
        markRead.mutate(item.id);
      } else {
        showError('콘텐츠를 찾을 수 없습니다.');
        markRead.mutate(item.id);
      }
    },
    [markRead, router, showError]
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      <PageHeader title="소식" onButtonPress={handleClose} />
      <NotificationListContent
        unread={unread}
        read={read}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        onNewNotificationClick={handleNewNotificationClick}
        onDeleteClick={handleDeleteClick}
        deletingId={deletingId}
      />
    </div>
  );
}
