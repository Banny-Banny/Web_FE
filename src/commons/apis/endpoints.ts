/**
 * API 엔드포인트 상수 관리
 * 모든 API 엔드포인트를 중앙에서 관리합니다.
 */

/**
 * 기본 API 경로
 */
export const BASE_PATHS = {
  API: `/api`,
  AUTH: `/api/auth`,
  USER: `/api/users`,
  ADMIN: `/api/admin`,
  // 기본 API 경로 (별칭)
  BASE_API: `/api`,
} as const;

/**
 * 인증 관련 엔드포인트
 */
export const AUTH_ENDPOINTS = {
  // 로그인/로그아웃
  LOGIN: `${BASE_PATHS.AUTH}/login`,
  LOCAL_LOGIN: `${BASE_PATHS.AUTH}/local/login`,
  LOGOUT: `${BASE_PATHS.AUTH}/logout`,
  REFRESH: `${BASE_PATHS.AUTH}/refresh`,
  VERIFY: `${BASE_PATHS.AUTH}/verify`, // 토큰 검증
  
  // 회원가입
  SIGNUP: `${BASE_PATHS.AUTH}/signup`,
  LOCAL_SIGNUP: `${BASE_PATHS.AUTH}/local/signup`,
  VERIFY_EMAIL: `${BASE_PATHS.AUTH}/verify-email`,
  RESEND_VERIFICATION: `${BASE_PATHS.AUTH}/resend-verification`,
  
  // 비밀번호 관리
  FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
  RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
  CHANGE_PASSWORD: `${BASE_PATHS.AUTH}/change-password`,
  
  // 프로필 관리
  ME: `${BASE_PATHS.API}/me`, // 로그인한 사용자 프로필 조회
  ME_UPDATE: `${BASE_PATHS.API}/me/update`,
  ME_PROFILE_IMAGE: `${BASE_PATHS.API}/me/profile-image`,
  PROFILE: `${BASE_PATHS.AUTH}/profile`,
  UPDATE_PROFILE: `${BASE_PATHS.AUTH}/profile`,
  DELETE_ACCOUNT: `${BASE_PATHS.AUTH}/delete-account`,
} as const;

/**
 * 사용자 관련 엔드포인트
 */
export const USER_ENDPOINTS = {
  // 사용자 목록 및 상세
  LIST: BASE_PATHS.USER,
  DETAIL: (id: string) => `${BASE_PATHS.USER}/${id}`,
  
  // 사용자 관리
  CREATE: BASE_PATHS.USER,
  UPDATE: (id: string) => `${BASE_PATHS.USER}/${id}`,
  DELETE: (id: string) => `${BASE_PATHS.USER}/${id}`,
  
  // 사용자 검색
  SEARCH: `${BASE_PATHS.USER}/search`,
  
  // 프로필 이미지
  UPLOAD_AVATAR: (id: string) => `${BASE_PATHS.USER}/${id}/avatar`,
  DELETE_AVATAR: (id: string) => `${BASE_PATHS.USER}/${id}/avatar`,
} as const;

/**
 * TimeEgg 관련 엔드포인트 (추후 구체적인 기능에 따라 확장)
 */
export const TIMEEGG_ENDPOINTS = {
  // 타임캡슐 관련
  CAPSULES: `${BASE_PATHS.API}/capsules`,
  GET_CAPSULES: `${BASE_PATHS.API}/capsules`,
  CAPSULE_DETAIL: (id: string) => `${BASE_PATHS.API}/capsules/${id}`,
  GET_CAPSULE: (id: string) => `${BASE_PATHS.API}/capsules/${id}`,
  CREATE_CAPSULE: `${BASE_PATHS.API}/capsules`,
  UPDATE_CAPSULE: (id: string) => `${BASE_PATHS.API}/capsules/${id}`,
  DELETE_CAPSULE: (id: string) => `${BASE_PATHS.API}/capsules/${id}`,
  
  // 내 이스터에그 목록 조회
  GET_MY_EGGS: `${BASE_PATHS.API}/capsules/my-eggs`,
  
  // 캡슐 발견 관련
  RECORD_CAPSULE_VIEW: (id: string) => `${BASE_PATHS.API}/capsules/${id}/viewers`,
  GET_CAPSULE_VIEWERS: (id: string) => `${BASE_PATHS.API}/capsules/${id}/viewers`,
  
  // 슬롯 관리
  GET_SLOTS: `${BASE_PATHS.API}/capsules/slots`,
  RESET_SLOTS: `${BASE_PATHS.API}/capsules/slots/reset`,
  
  // 위치 관련
  LOCATIONS: `${BASE_PATHS.API}/locations`,
  NEARBY_LOCATIONS: `${BASE_PATHS.API}/locations/nearby`,
  
  // 친구 관련
  FRIENDS: `${BASE_PATHS.API}/friends`,
  FRIEND_REQUESTS: `${BASE_PATHS.API}/friends/requests`,
  SEND_FRIEND_REQUEST: `${BASE_PATHS.API}/friends/request`,
  ACCEPT_FRIEND_REQUEST: (id: string) => `${BASE_PATHS.API}/friends/requests/${id}/accept`,
  REJECT_FRIEND_REQUEST: (id: string) => `${BASE_PATHS.API}/friends/requests/${id}/reject`,
  
  // 알림 관련
  NOTIFICATIONS: `${BASE_PATHS.API}/notifications`,
  MARK_NOTIFICATION_READ: (id: string) => `${BASE_PATHS.API}/notifications/${id}/read`,
  MARK_ALL_READ: `${BASE_PATHS.API}/notifications/read-all`,
} as const;

/**
 * 관리자 관련 엔드포인트
 */
export const ADMIN_ENDPOINTS = {
  // 대시보드
  DASHBOARD: `${BASE_PATHS.ADMIN}/dashboard`,
  STATISTICS: `${BASE_PATHS.ADMIN}/statistics`,
  
  // 사용자 관리
  USERS: `${BASE_PATHS.ADMIN}/users`,
  USER_DETAIL: (id: string) => `${BASE_PATHS.ADMIN}/users/${id}`,
  SUSPEND_USER: (id: string) => `${BASE_PATHS.ADMIN}/users/${id}/suspend`,
  ACTIVATE_USER: (id: string) => `${BASE_PATHS.ADMIN}/users/${id}/activate`,
  
  // 컨텐츠 관리
  CONTENT_MODERATION: `${BASE_PATHS.ADMIN}/content`,
  REPORTED_CONTENT: `${BASE_PATHS.ADMIN}/content/reported`,
  
  // 시스템 설정
  SETTINGS: `${BASE_PATHS.ADMIN}/settings`,
  UPDATE_SETTINGS: `${BASE_PATHS.ADMIN}/settings`,
} as const;

/**
 * 파일 업로드 관련 엔드포인트
 */
export const UPLOAD_ENDPOINTS = {
  // 이미지 업로드
  IMAGE: `${BASE_PATHS.API}/upload/image`,
  IMAGES: `${BASE_PATHS.API}/upload/images`,
  
  // 파일 업로드
  FILE: `${BASE_PATHS.API}/upload/file`,
  FILES: `${BASE_PATHS.API}/upload/files`,
  
  // 프로필 이미지
  AVATAR: `${BASE_PATHS.API}/upload/avatar`,
  
  // 임시 업로드 (미리보기용)
  TEMP: `${BASE_PATHS.API}/upload/temp`,
} as const;

/**
 * 외부 서비스 연동 엔드포인트
 */
export const EXTERNAL_ENDPOINTS = {
  // 소셜 로그인
  GOOGLE_LOGIN: `${BASE_PATHS.AUTH}/google`,
  KAKAO_LOGIN: `${BASE_PATHS.AUTH}/kakao`,
  NAVER_LOGIN: `${BASE_PATHS.AUTH}/naver`,
  
  // 지도 서비스
  GEOCODING: `${BASE_PATHS.API}/external/geocoding`,
  REVERSE_GEOCODING: `${BASE_PATHS.API}/external/reverse-geocoding`,
  
  // 푸시 알림
  REGISTER_PUSH_TOKEN: `${BASE_PATHS.API}/push/register`,
  UNREGISTER_PUSH_TOKEN: `${BASE_PATHS.API}/push/unregister`,
} as const;

/**
 * 주문 관리 관련 엔드포인트
 */
export const ORDER_ENDPOINTS = {
  // 주문 생성
  CREATE: `${BASE_PATHS.API}/orders`,
  // 주문 상세 조회
  DETAIL: (id: string) => `${BASE_PATHS.API}/orders/${id}`,
  // 주문 상태 및 결제 정보 조회
  STATUS: (id: string) => `${BASE_PATHS.API}/orders/${id}/status`,
  // 주문 상태 변경 (수동)
  UPDATE_STATUS: (id: string) => `${BASE_PATHS.API}/orders/${id}/status`,
} as const;

/**
 * 결제 관련 엔드포인트
 */
export const PAYMENT_ENDPOINTS = {
  // 결제 완료 처리
  COMPLETE: `${BASE_PATHS.API}/payment/complete`,
  // 토스페이먼츠 결제 승인 처리
  CONFIRM: `${BASE_PATHS.API}/payments/toss/confirm`,
} as const;

/**
 * Health Check 관련 엔드포인트
 */
export const HEALTH_ENDPOINTS = {
  // 기본 API 엔드포인트
  BASE: BASE_PATHS.BASE_API,
  // 서버 상태 확인
  HEALTH: `${BASE_PATHS.BASE_API}/health`,
} as const;

/**
 * 온보딩 관련 엔드포인트
 */
export const ONBOARDING_ENDPOINTS = {
  // 온보딩 완료
  COMPLETE: `${BASE_PATHS.API}/onboarding/complete`,
} as const;

/**
 * 캡슐 관련 엔드포인트
 */
export const CAPSULE_ENDPOINTS = {
  // 타임캡슐 대기실 생성 (방 생성 + 초대 코드 발급)
  CREATE_WAITING_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
  // 009 스펙 호환을 위한 별칭 (동일 엔드포인트)
  CREATE_ROOM: `${BASE_PATHS.API}/capsules/step-rooms/create`,
  // 대기실 설정값 조회
  WAITING_ROOM_SETTINGS: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/settings`,
  // 대기실 상세 조회
  WAITING_ROOM_DETAIL: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}`,
  // 본인 컨텐츠 조회 및 저장
  MY_CONTENT: (capsuleId: string) => `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/my-content`,
  // 초대 코드로 방 조회 (Public API)
  INVITE_CODE_QUERY: (code: string) =>
    `${BASE_PATHS.API}/capsules/step-rooms/by-code?invite_code=${code}`,
  // 초대 코드로 방 참여
  JOIN_ROOM: (capsuleId: string) =>
    `${BASE_PATHS.API}/capsules/step-rooms/${capsuleId}/join`,
  // 타임캡슐 제출 (방장 전용)
  SUBMIT_CAPSULE: (roomId: string) =>
    `${BASE_PATHS.API}/capsules/step-rooms/${roomId}/submit`,
} as const;

/**
 * 미디어 관련 엔드포인트
 */
export const MEDIA_ENDPOINTS = {
  // 미디어 URL 조회
  GET_MEDIA_URL: (id: string) => `${BASE_PATHS.API}/media/${id}/url`,
} as const;

/**
 * 문의(고객센터) 관련 엔드포인트
 */
export const INQUIRY_ENDPOINTS = {
  // 내 문의 목록 조회
  LIST: `${AUTH_ENDPOINTS.ME}/inquiries`,
  // 문의별 채팅 내역 조회
  CHAT_HISTORY: (inquiryId: string) => `${AUTH_ENDPOINTS.ME}/inquiries/${inquiryId}`,
} as const;

/**
 * 공지사항 관련 엔드포인트
 */
export const NOTICE_ENDPOINTS = {
  // 공지사항 목록 조회
  LIST: `${BASE_PATHS.API}/notices`,
  // 공지사항 상세 조회
  DETAIL: (id: string) => `${BASE_PATHS.API}/notices/${id}`,
} as const;

/**
 * 모든 엔드포인트를 통합한 객체
 */
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  TIMEEGG: TIMEEGG_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  ORDER: ORDER_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  CAPSULE: CAPSULE_ENDPOINTS,
  MEDIA: MEDIA_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  EXTERNAL: EXTERNAL_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
  ONBOARDING: ONBOARDING_ENDPOINTS,
  INQUIRY: INQUIRY_ENDPOINTS,
  NOTICE: NOTICE_ENDPOINTS,
} as const;

/**
 * 엔드포인트 타입
 */
export type EndpointType = typeof ENDPOINTS;

/**
 * 동적 경로 생성 헬퍼 함수
 */
export const createEndpoint = {
  /**
   * 쿼리 파라미터를 포함한 URL 생성
   */
  withQuery: (endpoint: string, params: Record<string, string | number | boolean>) => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return `${endpoint}${queryString ? `?${queryString}` : ''}`;
  },
  
  /**
   * 페이지네이션 파라미터를 포함한 URL 생성
   */
  withPagination: (endpoint: string, page: number = 1, limit: number = 20) => {
    return createEndpoint.withQuery(endpoint, { page, limit });
  },
  
  /**
   * 정렬 파라미터를 포함한 URL 생성
   */
  withSort: (endpoint: string, sortBy: string, order: 'asc' | 'desc' = 'desc') => {
    return createEndpoint.withQuery(endpoint, { sortBy, order });
  },
  
  /**
   * 검색 파라미터를 포함한 URL 생성
   */
  withSearch: (endpoint: string, query: string, filters?: Record<string, any>) => {
    const params = { q: query, ...filters };
    return createEndpoint.withQuery(endpoint, params);
  },
};