'use client';

/**
 * 알림 목록 본문 (새 알림/이전 알림 섹션)
 * 모달·소식 페이지에서 공통 사용
 * 알림 타입별 아이콘 표시
 */

import React from 'react';
import {
  RiNotificationLine,
  RiInformationLine,
  RiTimeLine,
  RiUserAddLine,
  RiMegaphoneLine,
  RiUserLine,
  RiMailSendLine,
  RiGiftLine,
} from '@remixicon/react';
import { Spinner } from '@/commons/components/spinner';
import type { Notification as NotificationType } from '@/commons/apis/me/notifications/types';
import styles from '../../styles.module.css';

type IconComponent = typeof RiNotificationLine;

/** 알림 type(대소문자·하이픈 무관) → 표시할 아이콘 컴포넌트 */
const NOTIFICATION_TYPE_ICONS: Record<string, IconComponent> = {
  SYSTEM: RiInformationLine,
  TIME_CAPSULE_INVITE: RiTimeLine,
  WAITING_ROOM_INVITE: RiMailSendLine,
  FRIEND_REQUEST: RiUserAddLine,
  NOTICE: RiMegaphoneLine,
  MY_EGGS: RiGiftLine,
  PROFILE: RiUserLine,
};

const DEFAULT_NOTIFICATION_ICON = RiNotificationLine;

function getNotificationIcon(type: string): IconComponent {
  if (!type) return DEFAULT_NOTIFICATION_ICON;
  const normalized = type.toUpperCase().replace(/-/g, '_');
  return NOTIFICATION_TYPE_ICONS[normalized] ?? DEFAULT_NOTIFICATION_ICON;
}

export function formatNotificationDate(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export interface NotificationListContentProps {
  unread: NotificationType[];
  read: NotificationType[];
  isLoading: boolean;
  isError: boolean;
  error: { message?: string } | null;
  refetch: () => void;
  onNewNotificationClick: (item: NotificationType) => void;
  onDeleteClick: (e: React.MouseEvent, notificationId: string) => void;
  deletingId: string | null;
  onMarkAllRead?: () => void;
}

export function NotificationListContent({
  unread,
  read,
  isLoading,
  isError,
  error,
  refetch,
  onNewNotificationClick,
  onDeleteClick,
  deletingId,
  onMarkAllRead,
}: NotificationListContentProps) {
  const isEmpty = !isLoading && !isError && unread.length === 0 && read.length === 0;

  return (
    <div className={styles.content}>
      {isLoading && (
        <div className={styles.loadingState}>
          <Spinner size="small" />
          <p className={styles.loadingText}>알림을 불러오는 중...</p>
        </div>
      )}

      {isError && (
        <div className={styles.errorState}>
          <p className={styles.errorText}>
            {error?.message ?? '알림 목록을 불러오지 못했습니다.'}
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => refetch()}
          >
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && !isEmpty && (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>새로운 알림</h3>
              {unread.length > 0 && onMarkAllRead && (
                <button
                  type="button"
                  className={styles.markAllReadButton}
                  onClick={onMarkAllRead}
                  aria-label="모두 읽음 처리"
                >
                  모두읽음
                </button>
              )}
            </div>
            {unread.length === 0 ? (
              <p className={styles.emptySectionText}>새 알림이 없어요</p>
            ) : (
              <ul className={styles.list} role="list">
                {unread.map((item) => {
                  const ItemIcon = getNotificationIcon(item.type);
                  return (
                    <li key={item.id} className={styles.listItem}>
                      <button
                        type="button"
                        className={styles.itemButton}
                        onClick={() => onNewNotificationClick(item)}
                        aria-label={item.title ?? '알림 보기'}
                      >
                        <span className={styles.itemIconWrap} aria-hidden>
                          <ItemIcon size={24} className={styles.itemIcon} />
                        </span>
                        <div className={styles.itemContent}>
                          <span className={styles.itemTitle}>{item.title ?? '알림'}</span>
                          {(item.body ?? item.content) && (
                            <span className={styles.itemBody}>{item.body ?? item.content}</span>
                          )}
                          <span className={styles.itemDate}>
                            {formatNotificationDate(item.createdAt)}
                          </span>
                        </div>
                        <span className={styles.unreadDot} aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>이전 알림</h3>
            {read.length === 0 ? (
              <p className={styles.emptySectionText}>이전 알림이 없어요</p>
            ) : (
              <ul className={styles.list} role="list">
                {read.map((item) => {
                  const ItemIcon = getNotificationIcon(item.type);
                  return (
                    <li key={item.id} className={`${styles.listItem} ${styles.listItemRead}`}>
                      <span className={styles.itemIconWrap} aria-hidden>
                        <ItemIcon size={24} className={styles.itemIcon} />
                      </span>
                      <div className={styles.itemContent}>
                        <span className={styles.itemTitle}>{item.title ?? '알림'}</span>
                        {(item.body ?? item.content) && (
                          <span className={styles.itemBody}>{item.body ?? item.content}</span>
                        )}
                        <span className={styles.itemDate}>
                          {formatNotificationDate(item.createdAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.deleteTextButton}
                        onClick={(e) => onDeleteClick(e, item.id)}
                        disabled={deletingId === item.id}
                        aria-label="알림 삭제"
                      >
                        삭제
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {!isLoading && !isError && isEmpty && (
        <div className={styles.emptyState}>
          <RiNotificationLine size={48} className={styles.emptyIcon} />
          <p className={styles.emptyText}>알림이 없습니다</p>
          <p className={styles.emptySubtext}>
            새로운 소식이 있으면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
