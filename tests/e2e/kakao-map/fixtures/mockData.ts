/**
 * 카카오 지도 E2E 테스트용 Mock 데이터
 */

/**
 * Mock 지도 좌표
 */
export const MOCK_COORDINATES = {
  /** 서울시청 좌표 */
  SEOUL_CITY_HALL: {
    lat: 37.5665,
    lng: 126.9780,
  },
  /** 강남역 좌표 */
  GANGNAM_STATION: {
    lat: 37.4979,
    lng: 127.0276,
  },
  /** 판교역 좌표 */
  PANGYO_STATION: {
    lat: 37.3950,
    lng: 127.1110,
  },
} as const;

/**
 * Mock 주소 데이터
 */
export const MOCK_ADDRESSES = {
  SEOUL_CITY_HALL: '중구',
  GANGNAM_STATION: '강남구',
  PANGYO_STATION: '분당구',
} as const;

/**
 * Mock 지도 설정
 */
export const MOCK_MAP_CONFIG = {
  DEFAULT_LEVEL: 3,
  MIN_LEVEL: 1,
  MAX_LEVEL: 14,
} as const;

/**
 * Mock 카카오 REST API 응답
 */
export const MOCK_COORD2REGIONCODE_RESPONSE = {
  meta: {
    total_count: 1,
  },
  documents: [
    {
      region_type: 'H',
      address_name: '서울특별시 중구',
      region_1depth_name: '서울특별시',
      region_2depth_name: '중구',
      region_3depth_name: '',
      region_4depth_name: '',
      code: '1114000000',
      x: 126.9780,
      y: 37.5665,
    },
  ],
} as const;
