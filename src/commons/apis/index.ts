/**
 * @fileoverview API 함수 및 데이터 타입 통합 익스포트
 * @description Axios를 활용한 API 클라이언트 및 요청/응답 타입 정의
 */

// Health Check API
export * from './health';

// 주문 관리 API
export * from './orders';
export type * from './orders/types';

// 결제 API
export * from './payment';
export type * from './payment/types';

// 캡슐 API
export * from './capsules';
export type * from './capsules/types';

// 미디어 API
export * from './media';
export type * from './media/types';

// 문의(고객센터) API
export * from './inquiries';
export type * from './inquiries/types';

// 공지사항 API
export * from './notices';
export type * from './notices/types';

// API 클라이언트 및 함수들이 여기에 추가됩니다
// 예: export { apiClient } from './client';
// 예: export * from './user';
// 예: export * from './auth';