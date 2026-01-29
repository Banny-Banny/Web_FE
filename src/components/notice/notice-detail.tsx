'use client';

/**
 * 공지사항 상세 컨테이너 (PageHeader + 본문)
 * useNotice(id)로 상세 조회, 로딩/오류 UI
 * 있는 데이터만 표시 (작성자·조회수 없음, imageUrl 없으면 이미지 영역 미표시)
 */

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RiCalendarLine } from '@remixicon/react';
import { PageHeader } from '@/commons/components/page-header';
import { Spinner } from '@/commons/components/spinner';
import { useNotice } from './hooks';
import { formatDate } from '@/commons/utils/date';
import type { NoticeDetailProps } from './types';
import styles from './styles.module.css';

export default function NoticeDetail({ id, className = '' }: NoticeDetailProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useNotice(id);

  const handleClose = useCallback(() => {
    router.push('/notices');
  }, [router]);

  if (isLoading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <PageHeader title="공지사항" onButtonPress={handleClose} />
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <Spinner size="small" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.container} ${className}`}>
        <PageHeader title="공지사항" onButtonPress={handleClose} />
        <div className={styles.errorMessage}>
          <p>공지를 찾을 수 없습니다.</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => refetch()}
            aria-label="다시 시도"
          >
            다시 시도
          </button>
          <button
            type="button"
            className={styles.retryButton}
            onClick={handleClose}
            style={{ marginLeft: 8 }}
            aria-label="목록으로"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <PageHeader title="공지사항" onButtonPress={handleClose} />
      <article className={styles.detailContent}>
        {data.isPinned && (
          <span className={styles.detailTag} aria-hidden="true">
            공지
          </span>
        )}
        <h1 className={styles.detailTitle}>{data.title}</h1>
        <div className={styles.detailMeta}>
          <time className={styles.detailDate} dateTime={data.createdAt}>
            <RiCalendarLine size={16} className={styles.detailMetaIcon} aria-hidden="true" />
            {formatDate(data.createdAt)}
          </time>
        </div>
        <div className={styles.detailDivider} />
        <div className={styles.detailBody}>{data.content}</div>
        {data.imageUrl && (
          <div className={styles.detailImageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt=""
              className={styles.detailImage}
            />
          </div>
        )}
      </article>
    </div>
  );
}
