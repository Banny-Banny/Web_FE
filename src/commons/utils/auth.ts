/**
 * 인증 관련 유틸리티 함수
 * 토큰 저장 및 관리
 */

/**
 * 토큰 정보 타입
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로컬 스토리지 키
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'timeEgg_accessToken',
  REFRESH_TOKEN: 'timeEgg_refreshToken',
} as const;

/**
 * 토큰 저장
 * 
 * @param tokens 저장할 토큰 정보
 */
export function saveTokens(tokens: TokenInfo): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
  } catch (error) {
    console.error('토큰 저장 실패:', error);
    throw new Error('토큰 저장에 실패했습니다.');
  }
}

/**
 * 토큰 조회
 * 
 * @returns 저장된 토큰 정보 또는 null
 */
export function getTokens(): TokenInfo | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!accessToken) {
      return null;
    }
    
    return {
      accessToken,
      refreshToken: refreshToken || '',
    };
  } catch (error) {
    console.error('토큰 조회 실패:', error);
    return null;
  }
}

/**
 * 액세스 토큰만 조회
 * 
 * @returns 액세스 토큰 또는 null
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('액세스 토큰 조회 실패:', error);
    return null;
  }
}

/**
 * 리프레시 토큰만 조회
 * 
 * @returns 리프레시 토큰 또는 null
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('리프레시 토큰 조회 실패:', error);
    return null;
  }
}

/**
 * 토큰 제거
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('토큰 제거 실패:', error);
  }
}

/**
 * JWT 토큰의 만료 시간 확인
 * 
 * @param token JWT 토큰
 * @returns 만료 시간 (밀리초) 또는 null (파싱 실패 시)
 */
export function getTokenExpiration(token: string): number | null {
  try {
    // JWT는 header.payload.signature 형식
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // payload 디코딩
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // exp 필드 확인 (초 단위이므로 밀리초로 변환)
    if (decoded.exp) {
      return decoded.exp * 1000;
    }
    
    return null;
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return null;
  }
}

/**
 * 토큰이 만료되었는지 확인
 * 
 * @param token JWT 토큰
 * @param bufferSeconds 만료 전 버퍼 시간 (초) - 기본값 60초
 * @returns 만료되었거나 만료 예정이면 true
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  const expiration = getTokenExpiration(token);
  
  if (!expiration) {
    // 파싱 실패 시 만료된 것으로 간주
    return true;
  }
  
  // 현재 시간 + 버퍼 시간과 비교
  const now = Date.now();
  const buffer = bufferSeconds * 1000;
  
  return expiration <= (now + buffer);
}
