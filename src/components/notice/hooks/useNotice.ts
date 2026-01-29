/**
 * @fileoverview 공지사항 상세 조회 React Query 훅
 * @description getNoticeById 호출, staleTime/gcTime 설정
 */

import { useQuery } from '@tanstack/react-query';
import { getNoticeById } from '@/commons/apis/notices';
import type { NoticeDetail } from '@/commons/apis/notices/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

export function useNotice(id: string | null | undefined) {
  return useQuery<NoticeDetail, ApiError>({
    queryKey: ['notices', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('공지 ID가 필요합니다.');
      return getNoticeById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    retry: (failureCount, error) => {
      if (!error.status) return false;
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 1;
    },
  });
}
