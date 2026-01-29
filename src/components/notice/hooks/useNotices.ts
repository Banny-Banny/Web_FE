/**
 * @fileoverview 공지사항 목록 조회 React Query 훅 (더보기 누적)
 * @description getNotices 호출, 검색어 변경 시 offset 0 초기화, 더보기 시 concat
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotices } from '@/commons/apis/notices';
import type { NoticeListItem } from '@/commons/apis/notices/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

const DEFAULT_LIMIT = 10;

export interface UseNoticesOptions {
  /** 검색 키워드 (변경 시 offset 0으로 재조회) */
  search?: string;
  /** 한 번에 가져올 개수 (기본 10) */
  limit?: number;
}

export interface UseNoticesReturn {
  /** 누적된 공지 목록 */
  items: NoticeListItem[];
  /** 전체 개수 */
  total: number;
  /** 더 불러올 항목이 있는지 */
  hasNextPage: boolean;
  /** 다음 페이지(더보기) 로드 중인지 */
  isFetchingNextPage: boolean;
  /** 초기 로딩 중인지 */
  isLoading: boolean;
  /** 에러 (메시지 또는 null) */
  error: string | null;
  /** 더보기 호출 */
  fetchNextPage: () => void;
  /** 재조회 */
  refetch: () => void;
}

export function useNotices(
  options: UseNoticesOptions = {}
): UseNoticesReturn {
  const { search = '', limit = DEFAULT_LIMIT } = options;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['notices', 'list', search],
    queryFn: ({ pageParam }) =>
      getNotices({ search: search || undefined, limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.offset + lastPage.items.length;
      if (loaded < lastPage.total) return lastPage.offset + limit;
      return undefined;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, err: ApiError) => {
      if (!err.status) return failureCount < 1;
      if (err.status === 401 || err.status === 404) return false;
      if (err.status >= 400 && err.status < 500) return false;
      return failureCount < 1;
    },
  });

  const items: NoticeListItem[] =
    data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    items,
    total,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '공지사항 목록을 불러오는 중 오류가 발생했습니다.'
      : null,
    fetchNextPage,
    refetch,
  };
}
