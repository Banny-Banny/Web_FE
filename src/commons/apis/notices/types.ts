/**
 * @fileoverview 공지사항 API 타입 정의
 * @description 공지사항 목록·상세 조회 요청/응답 타입
 */

/**
 * 공지사항 목록 조회 쿼리 파라미터
 */
export interface GetNoticesParams {
  /** 검색 키워드 (제목/본문) */
  search?: string;
  /** 한 페이지 아이템 수 (클라이언트 기본값: 10) */
  limit?: number;
  /** 건너뛸 아이템 수 (기본값: 0) */
  offset?: number;
}

/**
 * 공지사항 목록 항목 (목록 API items 요소)
 */
export interface NoticeListItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isPinned: boolean;
  isVisible: boolean;
  createdAt: string; // ISO 8601
}

/**
 * 공지사항 목록 API 응답 data
 */
export interface GetNoticesResponseData {
  items: NoticeListItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * 공지사항 상세 (상세 API data)
 */
export interface NoticeDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 서버 공통 래핑: { success, data }
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
