'use client';

/**
 * 공지사항 목록 컨테이너 (PageHeader + 검색 + 리스트 + 더보기)
 * 검색은 디바운싱으로 자동 실행(버튼 없음). useNotices 훅 사용.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiSearchLine } from '@remixicon/react';
import { PageHeader } from '@/commons/components/page-header';
import { Spinner } from '@/commons/components/spinner';
import { useNotices } from './hooks';
import { formatRelativeTime } from '@/commons/utils/date';
import type { NoticeListItem } from '@/commons/apis/notices/types';
import styles from './styles.module.css';

const SEARCH_DEBOUNCE_MS = 400;

export default function NoticeList() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const {
    items,
    total,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    fetchNextPage,
    refetch,
  } = useNotices({ search: submittedSearch, limit: 10 });

  // 디바운싱: 입력 멈춘 후 SEARCH_DEBOUNCE_MS 뒤에 검색어 반영
  useEffect(() => {
    const trimmed = searchInput.trim();
    const timer = window.setTimeout(() => {
      setSubmittedSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const handleClose = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleItemPress = useCallback(
    (id: string) => {
      router.push(`/notices/${id}`);
    },
    [router]
  );

  const subtitle =
    total >= 0
      ? submittedSearch
        ? `검색 결과 ${total}개`
        : `총 ${total}개의 공지사항`
      : undefined;

  return (
    <div className={styles.container}>
      <PageHeader
        title="공지사항"
        subtitle={subtitle}
        onButtonPress={handleClose}
      />
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon} aria-hidden>
          <RiSearchLine size={16} />
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="공지사항 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="공지사항 검색"
        />
      </div>

      {isLoading && (
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <Spinner size="small" />
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => refetch()}
            aria-label="다시 시도"
          >
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className={styles.emptyMessage} role="status">
          {submittedSearch ? '검색 결과가 없습니다.' : '공지사항이 없습니다.'}
        </p>
      )}

      {!isLoading && !error && items.length > 0 && (
        <>
          <ul className={styles.list} role="list">
            {items.map((item: NoticeListItem) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.listItem}
                  onClick={() => handleItemPress(item.id)}
                  aria-label={`공지: ${item.title}`}
                >
                  <div className={styles.listItemHeader}>
                    {item.isPinned && (
                      <span className={styles.pinnedLabel}>공지</span>
                    )}
                    <span className={styles.listItemTitle}>{item.title}</span>
                  </div>
                  <span className={styles.listItemTime}>
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              aria-label="더보기"
            >
              {isFetchingNextPage ? '로딩 중...' : '더보기'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
