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

/**
 * 캡슐 목록 조회 요청 파라미터
 */
export interface GetCapsulesRequest {
  /** 사용자 현재 위도 (필수) */
  lat: number;
  /** 사용자 현재 경도 (필수) */
  lng: number;
  /** 조회 반경(m) (선택, 기본 300) */
  radius_m?: number;
  /** 페이지 크기 (선택, 기본 50, 최대 200) */
  limit?: number;
  /** 다음 페이지 커서 (선택) */
  cursor?: string;
  /** view_limit 소진 캡슐도 포함 여부 (선택, 기본 false) */
  include_consumed?: boolean;
  /** 좌표 없는 캡슐도 포함 여부 (선택, 기본 false) */
  include_locationless?: boolean;
}

/**
 * 캡슐 기본 정보 조회 요청 파라미터
 */
export interface GetCapsuleRequest {
  /** 캡슐 ID (UUID) */
  id: string;
  /** 사용자 현재 위도 (필수) */
  lat: number;
  /** 사용자 현재 경도 (필수) */
  lng: number;
}

/**
 * 캡슐 발견 기록 요청 데이터
 */
export interface RecordCapsuleViewRequest {
  /** 발견 위치 위도 (선택, -90~90) */
  lat?: number;
  /** 발견 위치 경도 (선택, -180~180) */
  lng?: number;
}

/**
 * 캡슐 타입
 */
export type CapsuleType = 'EASTER_EGG' | 'TIME_CAPSULE';

/**
 * 캡슐 목록 항목
 */
export interface CapsuleItem {
  id: string;
  title?: string;
  content?: string;
  open_at?: string;
  is_locked: boolean;
  view_limit?: number;
  view_count?: number;
  can_open: boolean;
  latitude: number;
  longitude: number;
  distance_m?: number;
  type: CapsuleType;
  is_mine: boolean;
  media_types?: string[];
  media_urls?: string[];
  media_items?: any[];
  product?: any;
}

/**
 * 캡슐 목록 조회 응답
 */
export interface GetCapsulesResponse {
  items: CapsuleItem[];
  page_info: {
    cursor?: string;
    has_next?: boolean;
  } | null;
}

/**
 * 캡슐 기본 정보 응답
 */
export interface GetCapsuleResponse {
  id: string;
  title?: string;
  content?: string;
  open_at?: string;
  is_locked: boolean;
  view_limit?: number;
  view_count?: number;
  media_types?: string[];
  media_urls?: string[];
  media_items?: any[];
  author?: {
    id: string;
    nickname?: string;
    profile_img?: string;
  };
  /** 캡슐 발견자 목록 (GET /api/capsules/{id}에 포함됨) */
  viewers?: ViewerInfo[];
  created_at?: string;
  location_name?: string;
  // 기타 서버 응답 필드
}

/**
 * 캡슐 발견 기록 응답
 */
export interface RecordCapsuleViewResponse {
  success: boolean;
  message: string;
  is_first_view: boolean;
}

/**
 * 발견자 정보
 */
export interface ViewerInfo {
  id: string;
  nickname?: string;
  profile_img?: string | null;
  viewed_at: string;
}

/**
 * 캡슐 발견자 목록 조회 응답
 */
export interface GetCapsuleViewersResponse {
  capsule_id: string;
  total_viewers: number;
  view_limit?: number;
  viewers: ViewerInfo[];
}

/**
 * 내 이스터에그 목록 조회 요청 파라미터
 */
export interface GetMyEggsRequest {
  /** 이스터에그 유형 */
  type: 'PLANTED' | 'FOUND';
  /** 정렬 순서 (type=FOUND일 때만 사용) */
  sort?: 'LATEST' | 'OLDEST';
}

/**
 * 심은 알(PLANTED) 타입 응답
 */
export interface MyEggsPlantedResponse {
  /** 요약 정보 */
  summary: {
    /** 전체 심은 알 개수 */
    totalPlantedCount: number;
    /** 활성 알 개수 */
    activeCount: number;
  };
  /** 데이터 */
  data: {
    /** 활성 알 목록 */
    activeEggs: MyEggPlantedItem[];
    /** 소멸된 알 목록 */
    expiredEggs: MyEggPlantedItem[];
  };
}

/**
 * 발견한 알(FOUND) 타입 응답
 */
export interface MyEggsFoundResponse {
  /** 요약 정보 */
  summary: {
    /** 전체 발견한 알 개수 */
    totalFoundCount: number;
  };
  /** 데이터 (직접 배열) */
  data: MyEggFoundItem[];
}

/**
 * 심은 알 항목 타입
 */
export interface MyEggPlantedItem {
  /** 이스터에그 ID */
  eggId: string;
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 조회 수 */
  viewCount: number;
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 이미지 포함 여부 */
  hasImage: boolean;
  /** 오디오 포함 여부 */
  hasAudio: boolean;
  /** 비디오 포함 여부 */
  hasVideo: boolean;
  /** 생성 일시 */
  createdDate: string;
  /** 상태 (ACTIVE: 활성, EXPIRED: 소멸) */
  status: 'ACTIVE' | 'EXPIRED';
}

/**
 * 발견한 알 항목 타입
 */
export interface MyEggFoundItem {
  /** 이스터에그 ID */
  eggId: string;
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 조회 수 */
  viewCount: number;
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 이미지 포함 여부 */
  hasImage: boolean;
  /** 오디오 포함 여부 */
  hasAudio: boolean;
  /** 비디오 포함 여부 */
  hasVideo: boolean;
  /** 생성 일시 */
  createdDate: string;
  /** 발견 일시 */
  foundDate: string;
}

/**
 * 내 이스터에그 목록 조회 응답 타입 (유니온 타입)
 */
export type MyEggsResponse = MyEggsPlantedResponse | MyEggsFoundResponse;

/**
 * 알 상세 정보 조회 응답 타입
 */
export interface EggDetailResponse {
  /** 이스터에그 ID */
  id: string;
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 메시지 */
  message?: string;
  /** 공개 일시 */
  open_at: string;
  /** 잠금 여부 */
  is_locked: boolean;
  /** 조회 제한 수 */
  view_limit: number;
  /** 조회 수 */
  view_count: number;
  /** 미디어 항목 목록 */
  media_items: Array<{
    /** 미디어 ID */
    media_id: string;
    /** 미디어 유형 */
    type: 'IMAGE' | 'AUDIO' | 'VIDEO';
    /** 객체 키 */
    object_key: string;
  }>;
  /** 상품 정보 */
  product: {
    /** 상품 ID */
    id: string;
    /** 상품 유형 */
    product_type: 'EASTER_EGG';
    /** 최대 미디어 개수 */
    max_media_count: number;
  };
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 텍스트 블록 목록 */
  text_blocks: Array<{
    /** 순서 */
    order: number;
    /** 내용 */
    content: string;
  }>;
  /** 작성자 정보 */
  author: {
    /** 작성자 ID */
    id: string;
    /** 닉네임 */
    nickname: string;
    /** 프로필 이미지 */
    profile_img?: string;
  };
  /** 발견자 목록 */
  viewers: Array<{
    /** 발견자 ID */
    id: string;
    /** 닉네임 */
    nickname: string;
    /** 프로필 이미지 */
    profile_img?: string;
    /** 발견 일시 */
    viewed_at: string;
  }>;
  /** 생성 일시 */
  created_at: string;
  /** 이스터에그 유형 */
  type?: 'FOUND' | 'PLANTED';
  /** 발견 일시 (camelCase) */
  foundAt?: string;
  /** 발견 일시 (snake_case) */
  found_at?: string;
}
