/**
 * 알림 상세 페이지
 *
 * @description
 * - 알림 id로 상세 표시 (title, content)
 * - 목록에서 해당 id 알림을 찾아 표시 (단건 API 없을 때)
 */

'use client';

import React, { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/commons/components/page-header';
import { useNotifications } from '@/commons/apis/me/notifications/hooks';
import { Spinner } from '@/commons/components/spinner';

export default function NotificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { unread, read, isLoading, isError } = useNotifications();

  const notification = useMemo(() => {
    const all = [...unread, ...read];
    return all.find((n) => n.id === id) ?? null;
  }, [id, unread, read]);

  const handleBack = () => {
    router.push('/notifications');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
        <PageHeader title="알림" onButtonPress={handleBack} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Spinner size="small" />
        </div>
      </div>
    );
  }

  if (isError || !notification) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
        <PageHeader title="알림" onButtonPress={handleBack} />
        <div style={{ flex: 1, padding: 24, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-grey-700)' }}>
            알림을 찾을 수 없습니다.
          </p>
          <button
            type="button"
            onClick={handleBack}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              fontSize: 14,
              color: 'var(--color-blue-500)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            소식 목록으로
          </button>
        </div>
      </div>
    );
  }

  const title = notification.title ?? '알림';
  const body = notification.body ?? notification.content ?? '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      <PageHeader title={title} onButtonPress={handleBack} />
      <div
        style={{
          flex: 1,
          padding: '16px 20px 24px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {body ? (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-pretendard, sans-serif)',
              fontSize: 15,
              lineHeight: 1.5,
              color: 'var(--color-grey-800)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {body}
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-grey-500)' }}>
            내용이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
