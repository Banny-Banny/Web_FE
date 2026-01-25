/**
 * Health Check API 타입 정의
 */

/**
 * 서버 상태 응답 타입
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  message?: string;
  timestamp?: string;
  version?: string;
  uptime?: number;
}

/**
 * 기본 API 응답 타입
 */
export interface BaseApiResponse {
  message?: string;
  timestamp?: string;
}
