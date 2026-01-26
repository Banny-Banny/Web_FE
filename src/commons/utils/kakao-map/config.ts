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
  // Next.js 환경 변수 확인
  const nextPublicKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  
  // Expo 환경 변수 확인 (호환성)
  const expoPublicKey = process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;
  
  const apiKey = nextPublicKey || expoPublicKey;
  
  if (!apiKey) {
    throw new Error(
      '카카오 지도 API 키가 설정되지 않았습니다. ' +
      '.env.local 파일에 NEXT_PUBLIC_KAKAO_MAP_API_KEY 또는 ' +
      'EXPO_PUBLIC_KAKAO_MAP_API_KEY 환경 변수를 설정해주세요.'
    );
  }
  
  return apiKey;
}
