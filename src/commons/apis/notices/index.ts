/**
 * @fileoverview 공지사항 API 함수
 * @description 공지사항 목록·상세 조회 API 호출
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { NOTICE_ENDPOINTS } from '../endpoints';
import { createEndpoint } from '../endpoints';
import type {
  GetNoticesParams,
  GetNoticesResponseData,
  NoticeDetail,
  ApiResponse,
} from './types';

/**
 * 공지사항 목록 조회 API
 *
 * @param params - search, limit, offset
 * @returns 응답 data (items, total, limit, offset)
 */
export async function getNotices(
  params: GetNoticesParams = {}
): Promise<GetNoticesResponseData> {
  const { search, limit = 10, offset = 0 } = params;
  const queryParams: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
  };
  if (search !== undefined && search !== '') {
    queryParams.search = search;
  }
  const url = createEndpoint.withQuery(NOTICE_ENDPOINTS.LIST, queryParams);

  const response = await apiClient.get<
    GetNoticesResponseData | ApiResponse<GetNoticesResponseData>
  >(url);
  const payload =
    (response.data as ApiResponse<GetNoticesResponseData>)?.data ??
    (response.data as GetNoticesResponseData);
  return payload;
}

/**
 * 공지사항 상세 조회 API
 *
 * @param id - 공지사항 ID
 * @returns 응답 data (NoticeDetail)
 */
export async function getNoticeById(id: string): Promise<NoticeDetail> {
  const response = await apiClient.get<NoticeDetail | ApiResponse<NoticeDetail>>(
    NOTICE_ENDPOINTS.DETAIL(id)
  );
  const payload =
    (response.data as ApiResponse<NoticeDetail>)?.data ??
    (response.data as NoticeDetail);
  return payload;
}
