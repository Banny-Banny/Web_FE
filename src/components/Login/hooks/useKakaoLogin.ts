/**
 * 카카오 소셜 로그인 훅
 * OAuth 리다이렉트 방식으로 카카오 로그인을 처리합니다.
 */

import { useCallback } from 'react';
import { EXTERNAL_ENDPOINTS } from '@/commons/apis/endpoints';

/**
 * 카카오 로그인 훅 반환 타입
 */
export interface UseKakaoLoginReturn {
  /**
   * 카카오 로그인 시작
   * 백엔드 OAuth URL로 리다이렉트합니다.
   */
  loginWithKakao: () => void;
}

/**
 * 카카오 소셜 로그인 훅
 * 
 * @returns 카카오 로그인 함수
 */
export function useKakaoLogin(): UseKakaoLoginReturn {
  /**
   * redirect_uri 생성
   * 웹 환경에서는 현재 도메인의 /auth/callback 경로를 사용
   */
  const getRedirectUri = useCallback((): string => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 기본값 사용
      return 'http://localhost:3000/auth/callback';
    }

    // 현재 도메인과 포트 사용
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/auth/callback`;
  }, []);

  /**
   * 카카오 로그인 시작
   * 백엔드 OAuth URL로 리다이렉트합니다.
   */
  const loginWithKakao = useCallback(() => {
    try {
      // redirect_uri 생성
      const redirectUri = getRedirectUri();
      
      // redirect_uri 인코딩
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      
      // 백엔드 OAuth URL 생성
      const oauthUrl = `${EXTERNAL_ENDPOINTS.KAKAO_LOGIN}?redirect_uri=${encodedRedirectUri}`;
      
      // 리다이렉트
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('카카오 로그인 시작 실패:', error);
      // 에러 발생 시 사용자에게 알림 (선택적)
      // alert('카카오 로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [getRedirectUri]);

  return {
    loginWithKakao,
  };
}
