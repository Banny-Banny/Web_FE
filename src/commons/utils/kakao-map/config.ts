/**
 * 카카오 지도 API 설정 유틸리티
 * 환경 변수에서 카카오 지도 API 키를 안전하게 가져옵니다.
 */

/**
 * 카카오 지도 API 키를 환경 변수에서 가져옵니다.
 * @returns 카카오 지도 API 키
 * @throws {Error} 환경 변수가 설정되지 않은 경우
 */
export function getKakaoMapApiKey(): string {
  try {
    // Next.js 환경 변수 확인
    const nextPublicKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    
    // Expo 환경 변수 확인 (호환성)
    const expoPublicKey = process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;
    
    const apiKey = nextPublicKey || expoPublicKey;
    
    if (!apiKey) {
      const errorMessage = 
        '카카오 지도 API 키가 설정되지 않았습니다.\n\n' +
        '다음 단계를 따라 설정해주세요:\n' +
        '1. 프로젝트 루트에 .env.local 파일을 생성합니다.\n' +
        '2. 다음 환경 변수를 추가합니다:\n' +
        '   NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_api_key_here\n\n' +
        '카카오 개발자 센터(https://developers.kakao.com)에서 API 키를 발급받을 수 있습니다.';
      
      console.error('[Kakao Map Config Error]', errorMessage);
      throw new Error(errorMessage);
    }
    
    // API 키 유효성 검증 (기본적인 형식 체크)
    if (apiKey.trim().length === 0) {
      throw new Error('카카오 지도 API 키가 비어있습니다. 올바른 API 키를 설정해주세요.');
    }
    
    return apiKey.trim();
  } catch (error) {
    // 에러 로깅
    if (error instanceof Error) {
      console.error('[Kakao Map Config Error]', error.message);
    }
    throw error;
  }
}
