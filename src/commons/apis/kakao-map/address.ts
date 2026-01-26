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
    // 좌표 유효성 검증
    if (!params.x || !params.y) {
      throw new Error('좌표 정보가 올바르지 않습니다.');
    }
    
    // 좌표 범위 검증 (대한민국 범위)
    if (params.x < 124 || params.x > 132 || params.y < 33 || params.y > 43) {
      console.warn('[Kakao Address API] 좌표가 대한민국 범위를 벗어났습니다:', params);
    }
    
    const apiKey = getKakaoRestApiKey();
    
    // 타임아웃 설정 (10초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // API 요청
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${params.x}&y=${params.y}`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      
      // HTTP 상태 코드별 에러 처리
      if (!response.ok) {
        let errorMessage = '주소 조회에 실패했습니다.';
        
        switch (response.status) {
          case 400:
            errorMessage = '잘못된 요청입니다. 좌표 정보를 확인해주세요.';
            break;
          case 401:
            errorMessage = 'API 키 인증에 실패했습니다. API 키를 확인해주세요.';
            break;
          case 403:
            errorMessage = 'API 접근 권한이 없습니다. API 키 설정을 확인해주세요.';
            break;
          case 429:
            errorMessage = 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = '카카오 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = `주소 조회 실패 (${response.status}): ${response.statusText}`;
        }
        
        console.error('[Kakao Address API]', errorMessage, {
          status: response.status,
          statusText: response.statusText,
          params,
        });
        
        throw new Error(errorMessage);
      }
      
      const data: Coord2RegionCodeResponse = await response.json();
      
      // 결과가 없는 경우
      if (!data.documents || data.documents.length === 0) {
        console.warn('[Kakao Address API] 해당 좌표에 대한 주소를 찾을 수 없습니다:', params);
        return null;
      }
      
      // 첫 번째 결과의 region_2depth_name 반환
      const firstResult = data.documents[0];
      const address = firstResult.region_2depth_name || null;
      
      if (!address) {
        console.warn('[Kakao Address API] 주소 정보가 비어있습니다:', firstResult);
      }
      
      return address;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // AbortError (타임아웃)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        const timeoutError = new Error(
          '주소 조회 시간이 초과되었습니다.\n' +
          '네트워크 연결을 확인하고 다시 시도해주세요.'
        );
        console.error('[Kakao Address API]', timeoutError.message);
        throw timeoutError;
      }
      
      // 네트워크 에러
      if (fetchError instanceof TypeError) {
        const networkError = new Error(
          '네트워크 연결에 문제가 발생했습니다.\n' +
          '인터넷 연결을 확인하고 다시 시도해주세요.'
        );
        console.error('[Kakao Address API]', networkError.message, fetchError);
        throw networkError;
      }
      
      throw fetchError;
    }
  } catch (error) {
    // 에러 로깅
    if (error instanceof Error) {
      console.error('[Kakao Address API] 주소 조회 실패:', error.message, { params });
    } else {
      console.error('[Kakao Address API] 알 수 없는 오류:', error);
    }
    
    throw error;
  }
}
