/**
 * 문의(고객센터) API 진입점
 */

export * from './hooks';
export {
  getInquiries,
  getFirstInquiryId,
  getChatHistory,
  fetchInquiries,
} from './api';
export type { Inquiry, ChatMessage, GetInquiriesParams, GetInquiriesResponse, GetChatHistoryResponse } from './api';
export type * from './types';
