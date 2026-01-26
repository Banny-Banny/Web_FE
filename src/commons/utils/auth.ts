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
