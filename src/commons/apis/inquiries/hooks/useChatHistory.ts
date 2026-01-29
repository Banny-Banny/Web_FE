/**
 * 채팅 내역 조회 및 WebSocket 메시지 병합 훅 (한 유저당 채팅방 1개)
 */

import { useMemo, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/commons/hooks/useAuth';
import { getFirstInquiryId, getChatHistory } from '../api';
import type { ChatMessage, ChatMessageWithStatus, ApiChatMessage } from '../types';

function transformApiMessageToMessage(api: ApiChatMessage): ChatMessage {
  return {
    id: api.id,
    customer_service_id: '',
    sender_type: api.senderType,
    sender_user_id: api.senderUserId,
    sender_admin_id: api.senderAdminId,
    content: api.content,
    attachments: api.attachments,
    is_read_by_admin: api.isReadByAdmin,
    is_read_by_user: api.isReadByUser,
    created_at: api.createdAt,
    updated_at: api.updatedAt,
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
    queryFn: () => getFirstInquiryId(),
    enabled: !!user && !authLoading,
  });

  const inquiryId = inquiriesData ?? null;

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
      return getChatHistory(inquiryId, { limit: 20, offset: pageParam as number });
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
