/**
 * 문의 내역 조회 훅 (실제 API)
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/hooks/useAuth';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import type { Inquiry } from '../types';

interface ApiInquiry {
  id: string;
  userId: string;
  title: string;
  content: string;
  adminReply?: string;
  isResolved: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface InquiriesResponse {
  items: ApiInquiry[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

function transformApiInquiryToInquiry(apiInquiry: ApiInquiry): Inquiry {
  return {
    id: apiInquiry.id,
    user_id: apiInquiry.userId,
    title: apiInquiry.title,
    content: apiInquiry.content,
    admin_reply: apiInquiry.adminReply,
    is_resolved: apiInquiry.isResolved,
    status: apiInquiry.status,
    last_message_at: apiInquiry.lastMessageAt,
    last_message_preview: apiInquiry.lastMessagePreview,
    created_at: apiInquiry.createdAt,
    updated_at: apiInquiry.updatedAt,
    deleted_at: apiInquiry.deletedAt,
  };
}

interface UseInquiriesOptions {
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  sortBy?: 'latest' | 'oldest';
  limit?: number;
  offset?: number;
}

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
    queryFn: async () => {
      if (!user) {
        return { items: [], total: 0, limit, offset, hasNext: false };
      }
      const queryParams: Record<string, string> = {
        limit: limit.toString(),
        offset: offset.toString(),
      };
      if (status) queryParams.status = status;
      queryParams.sort = sortBy === 'latest' ? 'created_at:desc' : 'created_at:asc';
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      const endpoint = `/api/me/inquiries${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<InquiriesResponse | { data: InquiriesResponse }>(endpoint);
      const payload = (response.data as { data?: InquiriesResponse })?.data ?? response.data;
      return payload as InquiriesResponse;
    },
    enabled: !!user && !authLoading,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const refetch = async () => {
    if (user) await refetchQuery();
  };

  const inquiries = data?.items ? data.items.map(transformApiInquiryToInquiry) : [];

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
