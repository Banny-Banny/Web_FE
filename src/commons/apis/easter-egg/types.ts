/**
 * 이스터에그 API 타입 정의
 */

/**
 * 이스터에그 생성 요청 데이터
 */
export interface CreateEasterEggRequest {
  /** 위도 (필수) */
  latitude: number;
  /** 경도 (필수) */
  longitude: number;
  /** 제목 (필수, 최대 100자) - 서버 요구사항 */
  title: string;
  /** 메시지 (선택, 최대 500자) */
  message?: string;
  /** 미디어 파일 배열 (선택, 최대 3개) */
  media_files?: File[];
  /** 선착순 인원 제한 (선택, 0이면 무제한) */
  view_limit?: number;
  /** 레거시 상품 ID (deprecated) */
  product_id?: string;
}

/**
 * 이스터에그 생성 응답
 */
export interface CreateEasterEggResponse {
  success: boolean;
  data: {
    id: string;
    title?: string;
    message?: string;
    latitude: number;
    longitude: number;
    created_at: string;
    // 기타 서버 응답 필드
  };
  message?: string;
}

/**
 * 슬롯 정보 응답
 */
export interface SlotInfoResponse {
  /** 전체 슬롯 개수 */
  totalSlots: number;
  /** 사용 중인 슬롯 개수 */
  usedSlots: number;
  /** 남은 슬롯 개수 */
  remainingSlots: number;
}

/**
 * 슬롯 초기화 응답
 */
export interface SlotResetResponse {
  /** 초기화된 슬롯 개수 */
  egg_slots: number;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
}
