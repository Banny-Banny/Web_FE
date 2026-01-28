/**
 * 문의(고객센터) API 타입 정의
 */

export type InquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SenderType = 'USER' | 'ADMIN';
export type MessageStatus = 'sending' | 'sent' | 'failed';
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface Inquiry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  admin_reply?: string;
  is_resolved: boolean;
  status: InquiryStatus;
  last_message_at?: string;
  last_message_preview?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'IMAGE' | 'FILE';
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  customer_service_id: string;
  sender_type: SenderType;
  sender_user_id?: string;
  sender_admin_id?: string;
  content: string;
  attachments?: MessageAttachment[];
  is_read_by_admin: boolean;
  is_read_by_user: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChatMessageWithStatus extends ChatMessage {
  status?: MessageStatus;
}

/** API 응답: 문의 목록 항목 (camelCase) */
export interface ApiInquiry {
  id: string;
  userId: string;
  title: string;
  content: string;
  adminReply?: string;
  isResolved: boolean;
  status: InquiryStatus;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface GetInquiriesParams {
  status?: InquiryStatus;
  sortBy?: 'latest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface GetInquiriesResponse {
  items: ApiInquiry[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

/** API 응답: 채팅 메시지 (camelCase) */
export interface ApiChatMessage {
  id: string;
  senderType: SenderType;
  senderUserId?: string;
  senderAdminId?: string;
  content: string;
  attachments?: MessageAttachment[];
  isReadByAdmin: boolean;
  isReadByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetChatHistoryResponse {
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
