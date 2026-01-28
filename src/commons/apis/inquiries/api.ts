/**
 * 문의(고객센터) API 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { INQUIRY_ENDPOINTS } from '@/commons/apis/endpoints';
import { createEndpoint } from '@/commons/apis/endpoints';
import type {
  GetInquiriesParams,
  GetInquiriesResponse,
  GetChatHistoryResponse,
  ApiInquiry,
  Inquiry,
  ChatMessage,
} from './types';

function transformApiInquiryToInquiry(api: ApiInquiry): Inquiry {
  return {
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
  };
}

/**
 * 문의 목록 조회
 */
export async function getInquiries(
  params: GetInquiriesParams = {}
): Promise<GetInquiriesResponse> {
  const { status, sortBy = 'latest', limit = 20, offset = 0 } = params;
  const queryParams: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
    sort: sortBy === 'latest' ? 'created_at:desc' : 'created_at:asc',
  };
  if (status) queryParams.status = status;
  const url = createEndpoint.withQuery(INQUIRY_ENDPOINTS.LIST, queryParams);

  const response = await apiClient.get<GetInquiriesResponse | { data: GetInquiriesResponse }>(url);
  const payload = (response.data as { data?: GetInquiriesResponse })?.data ?? response.data;
  const result = payload as GetInquiriesResponse;
  return result;
}

/**
 * 문의 목록 조회 후 첫 번째 문의 ID 반환 (채팅방 1개 가정)
 */
export async function getFirstInquiryId(): Promise<string | null> {
  const res = await getInquiries({ limit: 1, offset: 0 });
  return res.items?.[0]?.id ?? null;
}

/**
 * 문의별 채팅 내역 조회
 */
export async function getChatHistory(
  inquiryId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<GetChatHistoryResponse> {
  const { limit = 20, offset = 0 } = params;
  const url = createEndpoint.withQuery(INQUIRY_ENDPOINTS.CHAT_HISTORY(inquiryId), {
    limit,
    offset,
  });

  const response = await apiClient.get<GetChatHistoryResponse | { data: GetChatHistoryResponse }>(url);
  const payload = (response.data as { data?: GetChatHistoryResponse })?.data ?? response.data;
  return payload as GetChatHistoryResponse;
}

/**
 * 문의 목록 조회 후 도메인 타입(Inquiry[])으로 반환
 */
export async function fetchInquiries(
  params: GetInquiriesParams = {}
): Promise<{ inquiries: Inquiry[]; response: GetInquiriesResponse }> {
  const response = await getInquiries(params);
  const inquiries = (response.items ?? []).map(transformApiInquiryToInquiry);
  return { inquiries, response };
}

export type { Inquiry, ChatMessage, GetInquiriesParams, GetInquiriesResponse, GetChatHistoryResponse };
