/**
 * 알림 관련 API 타입 정의
 * GET /api/me/notifications, POST read/delete 응답 구조
 */

/**
 * 알림 한 건 (목록 항목)
 */
export interface Notification {
  id: string;
  isRead: boolean;
  type: string;
  targetId?: string | null;
  title?: string;
  body?: string;
  /** 백엔드가 content 필드로 반환하는 경우 */
  content?: string;
  createdAt: string;
}

/**
 * 알림 목록 API 응답 — 서버가 unread/read 구분하여 반환하는 경우
 */
export interface GetNotificationsResponseDataSeparate {
  unread: Notification[];
  read: Notification[];
}

/**
 * 알림 목록 API 응답 — 서버가 단일 배열 + isRead 필드로 반환하는 경우
 */
export interface GetNotificationsResponseDataFlat {
  items: Notification[];
}

export type GetNotificationsResponseData =
  | GetNotificationsResponseDataSeparate
  | GetNotificationsResponseDataFlat;

/**
 * 서버 공통 래핑: { success?, data }
 */
export interface ApiResponse<T> {
  success?: boolean;
  data: T;
}
