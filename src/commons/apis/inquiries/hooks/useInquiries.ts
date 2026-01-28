/**
 * 문의 목록 조회 훅
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/hooks/useAuth';
import { getInquiries } from '../api';
import type { GetInquiriesParams, Inquiry } from '../types';

type UseInquiriesOptions = GetInquiriesParams;

interface UseInquiriesReturn {
  inquiries: Inquiry[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function transformItems(data: Awaited<ReturnType<typeof getInquiries>>): Inquiry[] {
  if (!data?.items?.length) return [];
  return data.items.map((api) => ({
    id: api.id,
    user_id: api.userId,
    title: api.title,
    content: api.content,
    admin_reply: api.adminReply,
    is_resolved: api.isResolved,
    status: api.status,
    last_message_at: api.lastMessageAt,
    last_message_preview: api.lastMessagePreview,
    created_at: api.createdAt,
    updated_at: api.updatedAt,
    deleted_at: api.deletedAt,
  }));
}

export function useInquiries(options: UseInquiriesOptions = {}): UseInquiriesReturn {
  const { user, isLoading: authLoading } = useAuth();
  const { status, sortBy = 'latest', limit = 20, offset = 0 } = options;

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['inquiries', status, sortBy, limit, offset],
    queryFn: () => getInquiries({ status, sortBy, limit, offset }),
    enabled: !!user && !authLoading,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const refetch = async () => {
    if (user) await refetchQuery();
  };

  const inquiries = data ? transformItems(data) : [];

  return {
    inquiries,
    total: data?.total ?? 0,
    limit: data?.limit ?? limit,
    offset: data?.offset ?? offset,
    hasNext: data?.hasNext ?? false,
    isLoading: isLoading || authLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : '문의 내역을 불러오는 중 오류가 발생했습니다.'
      : null,
    refetch,
  };
}
