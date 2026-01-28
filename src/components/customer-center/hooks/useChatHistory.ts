/**
 * 채팅 내역 조회 및 병합 훅 (한 유저당 채팅방 1개)
 */

import { useMemo, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/hooks/useAuth';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import type { ChatMessage, ChatMessageWithStatus } from '../types';

interface ApiChatMessage {
  id: string;
  senderType: 'USER' | 'ADMIN';
  senderUserId?: string;
  senderAdminId?: string;
  content: string;
  attachments?: Array<{
    id: string;
    type: 'IMAGE' | 'FILE';
    name: string;
    url: string;
    size?: number;
    mimeType?: string;
  }>;
  isReadByAdmin: boolean;
  isReadByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryResponse {
  inquiry?: {
    id: string;
    status: string;
    isResolved: boolean;
    title: string;
    createdAt: string;
    lastMessageAt?: string;
    lastMessagePreview?: string;
  };
  messages: ApiChatMessage[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

function transformApiMessageToMessage(apiMessage: ApiChatMessage): ChatMessage {
  return {
    id: apiMessage.id,
    customer_service_id: '',
    sender_type: apiMessage.senderType,
    sender_user_id: apiMessage.senderUserId,
    sender_admin_id: apiMessage.senderAdminId,
    content: apiMessage.content,
    attachments: apiMessage.attachments?.map((att) => ({
      id: att.id,
      type: att.type,
      name: att.name,
      url: att.url,
      size: att.size,
      mimeType: att.mimeType,
    })),
    is_read_by_admin: apiMessage.isReadByAdmin,
    is_read_by_user: apiMessage.isReadByUser,
    created_at: apiMessage.createdAt,
    updated_at: apiMessage.updatedAt,
  };
}

interface UseChatHistoryOptions {
  webSocketMessages?: ChatMessage[];
}

interface UseChatHistoryReturn {
  messages: ChatMessageWithStatus[];
  isLoading: boolean;
  hasNext: boolean;
  loadMore: () => void;
  isFetchingNextPage: boolean;
}

export function useChatHistory({
  webSocketMessages = [],
}: UseChatHistoryOptions): UseChatHistoryReturn {
  const { user, isLoading: authLoading } = useAuth();

  const { data: inquiriesData } = useQuery({
    queryKey: ['inquiries', 'first'],
    queryFn: async () => {
      if (!user) return { items: [], total: 0, limit: 1, offset: 0, hasNext: false };
      const response = await apiClient.get<{ items: Array<{ id: string }> } | { data: { items: Array<{ id: string }> } }>(
        '/api/me/inquiries?limit=1&offset=0'
      );
      const payload = (response.data as { data?: { items: Array<{ id: string }> } })?.data ?? response.data;
      return payload as { items: Array<{ id: string }>; total: number; limit: number; offset: number; hasNext: boolean };
    },
    enabled: !!user && !authLoading,
  });

  const inquiryId = inquiriesData?.items?.[0]?.id;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chatHistory', inquiryId],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (!user || !inquiryId) {
        return { messages: [], total: 0, limit: 20, offset: 0, hasNext: false };
      }
      const queryParams = { limit: '20', offset: pageParam.toString() };
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      const endpoint = `/api/me/inquiries/${inquiryId}${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<ChatHistoryResponse | { data: ChatHistoryResponse }>(endpoint);
      const payload = (response.data as { data?: ChatHistoryResponse })?.data ?? response.data;
      return payload as ChatHistoryResponse;
    },
    enabled: !!user && !authLoading && !!inquiryId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNext) return allPages.length * lastPage.limit;
      return undefined;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const apiMessages = useMemo(() => {
    if (!data?.pages) return [];
    const all: ChatMessage[] = [];
    data.pages.forEach((page) => {
      if (page?.messages?.length) {
        page.messages.map(transformApiMessageToMessage).forEach((m) => all.push(m));
      }
    });
    return all;
  }, [data]);

  const mergedMessages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    apiMessages.forEach((msg) => map.set(msg.id, msg));
    webSocketMessages.forEach((wsMsg) => {
      const existing = map.get(wsMsg.id);
      const existingTime = existing
        ? new Date(existing.updated_at || existing.created_at).getTime()
        : 0;
      const wsTime = new Date(wsMsg.updated_at || wsMsg.created_at).getTime();
      if (!existing || wsTime >= existingTime) map.set(wsMsg.id, wsMsg);
    });
    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return merged.map((msg) => ({ ...msg, status: 'sent' as const }));
  }, [apiMessages, webSocketMessages]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    messages: mergedMessages,
    isLoading: isLoading || authLoading,
    hasNext: hasNextPage ?? false,
    loadMore,
    isFetchingNextPage,
  };
}
