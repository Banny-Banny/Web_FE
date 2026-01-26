/**
 * 카카오 REST API 주소 조회
 */

/**
 * 좌표를 주소로 변환하는 API 요청 파라미터
 */
export interface Coord2RegionCodeParams {
  /** 경도 (longitude) */
  x: number;
  /** 위도 (latitude) */
  y: number;
}

/**
 * 좌표를 주소로 변환하는 API 응답
 */
export interface Coord2RegionCodeResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    region_type: string;
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    code: string;
    x: number;
    y: number;
  }>;
}

/**
 * 카카오 REST API 키를 환경 변수에서 가져옵니다.
 * @returns 카카오 REST API 키
 * @throws {Error} 환경 변수가 설정되지 않은 경우
 */
function getKakaoRestApiKey(): string {
  // Next.js 환경 변수 확인
  const nextPublicKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  
  // Expo 환경 변수 확인 (호환성)
  const expoPublicKey = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
  
  const apiKey = nextPublicKey || expoPublicKey;
  
  if (!apiKey) {
    throw new Error(
      '카카오 REST API 키가 설정되지 않았습니다. ' +
      '.env.local 파일에 NEXT_PUBLIC_KAKAO_REST_API_KEY 또는 ' +
      'EXPO_PUBLIC_KAKAO_REST_API_KEY 환경 변수를 설정해주세요.'
    );
  }
  
  return apiKey;
}

/**
 * 좌표를 주소로 변환합니다.
 * 카카오 REST API의 coord2regioncode 엔드포인트를 사용합니다.
 * 
 * @param params 좌표 파라미터 (x: 경도, y: 위도)
 * @returns 주소 정보 (region_2depth_name 형식, 예: "성남시 분당구")
 * @throws {Error} API 호출 실패 시
 */
export async function getAddressFromCoord(
  params: Coord2RegionCodeParams
): Promise<string | null> {
  try {
    const apiKey = getKakaoRestApiKey();
    
    // API 요청
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${params.x}&y=${params.y}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`카카오 REST API 호출 실패: ${response.status} ${response.statusText}`);
    }
    
    const data: Coord2RegionCodeResponse = await response.json();
    
    // 결과가 없는 경우
    if (!data.documents || data.documents.length === 0) {
      return null;
    }
    
    // 첫 번째 결과의 region_2depth_name 반환
    const firstResult = data.documents[0];
    return firstResult.region_2depth_name || null;
  } catch (error) {
    console.error('주소 조회 실패:', error);
    throw error;
  }
}
