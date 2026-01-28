/**
 * 인증 관련 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthContextType, LoginRequest, User } from '@/commons/types/auth';
import { getAccessToken, clearTokens } from '@/commons/utils/auth';
import { localLogin } from '@/commons/apis/auth/login';
import { verifyAuth } from '@/commons/apis/auth/verify';

/**
 * 인증 상태 및 액션에 접근하는 커스텀 훅
 */
export function useAuth(): AuthContextType {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 인증 상태 확인
   */
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = getAccessToken();
        
        if (!token) {
          // 토큰이 없으면 인증되지 않은 상태
          setUser(null);
          setIsLoading(false);
          return;
        }

        // 캐시에서 사용자 정보 확인
        const cachedUser = queryClient.getQueryData<User>(['auth', 'user']);
        
        if (cachedUser) {
          // 캐시된 사용자 정보가 있으면 그대로 사용
          // 토큰 만료 여부는 API 검증 시 확인
          setUser(cachedUser);
          setIsLoading(false);
          return;
        }

        // 토큰 검증 API 호출하여 사용자 정보 가져오기
        // 토큰 파싱 실패나 만료 여부는 서버 검증을 통해 확인
        try {
          const verifyResult = await verifyAuth();

          if (verifyResult.valid && (verifyResult.user || verifyResult.userId)) {
            console.log('✅ [useAuth] 토큰 유효');

            // user 객체가 있으면 사용, 없으면 userId로 간단한 객체 생성
            const userInfo: User = verifyResult.user || {
              id: verifyResult.userId!,
              email: '',
              nickname: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            setUser(userInfo);
            queryClient.setQueryData(['auth', 'user'], userInfo);
          } else if (verifyResult.valid === false) {
            // 서버가 명시적으로 토큰이 유효하지 않다고 응답한 경우에만 토큰 제거
            console.warn('❌ [useAuth] 서버가 토큰을 유효하지 않다고 응답. 토큰 제거.');
            clearTokens();
            setUser(null);
          } else {
            // valid가 undefined이거나 userId도 없는 경우
            // 토큰은 유지하고 사용자 정보만 null로 설정
            console.warn('⚠️ [useAuth] 검증 응답에 사용자 정보가 없습니다. 토큰은 유지합니다.');
            setUser(null);
          }
        } catch (err: unknown) {
          // 토큰 검증 실패 시
          const errorStatus = (err as { status?: number; statusCode?: number }).status 
            || (err as { statusCode?: number }).statusCode;
          const errorMessage = (err as { message?: string }).message || '알 수 없는 오류';
          console.error('❌ [useAuth] 토큰 검증 실패:', {
            status: errorStatus,
            message: errorMessage,
            error: err,
          });
          
          // 401 에러인 경우에만 토큰이 만료된 것으로 간주하고 제거
          // 네트워크 오류, 서버 오류(500 등)는 토큰 유지
          if (errorStatus === 401) {
            console.warn('❌ [useAuth] 401 에러: 토큰 만료로 간주하고 제거');
            clearTokens();
            setUser(null);
          } else {
            // 네트워크 오류, 서버 오류 등 다른 에러는 로그만 남기고 토큰 유지
            console.warn('⚠️ [useAuth] 네트워크/서버 오류. 토큰은 유지합니다.');
            // 토큰은 유효하므로 사용자 정보만 null로 설정 (토큰은 유지)
            setUser(null);
          }
        }
      } catch (err: unknown) {
        console.error('❌ [useAuth] 예상치 못한 오류:', err);
        const errorMessage = (err as { message?: string }).message || '인증 상태 확인 중 오류가 발생했습니다.';
        setError(errorMessage);
        // 예상치 못한 오류는 토큰을 유지
        setUser(null);
        } finally {
          setIsLoading(false);
        }
    };

    checkAuth();
  }, [queryClient]);

  /**
   * 로그인 함수
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await localLogin(credentials);
      
      // 사용자 정보 저장
      if (response.user) {
        setUser(response.user);
        queryClient.setQueryData(['auth', 'user'], response.user);
      }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  /**
   * 회원가입 함수
   */
  const signup = useCallback(async () => {
    // TODO: 회원가입 로직 구현
    console.warn('Signup function - to be implemented');
  }, []);

  /**
   * 로그아웃 함수
   */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    queryClient.removeQueries({ queryKey: ['auth'] });
  }, [queryClient]);

  /**
   * 인증 상태 갱신
   */
  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      
      if (!token) {
        setUser(null);
        return;
      }

      // 토큰 검증 API 호출
      try {
        const verifyResult = await verifyAuth();

        if (verifyResult.valid && (verifyResult.user || verifyResult.userId)) {
          // user 객체가 있으면 사용, 없으면 userId로 간단한 객체 생성
          const userInfo: User = verifyResult.user || {
            id: verifyResult.userId!,
            email: '',
            nickname: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setUser(userInfo);
          queryClient.setQueryData(['auth', 'user'], userInfo);
        } else {
          // 토큰이 유효하지 않은 경우
          clearTokens();
          setUser(null);
        }
      } catch (err: unknown) {
        // 토큰 검증 실패 시 토큰 제거
        console.error('토큰 검증 실패:', err);
        clearTokens();
        setUser(null);
      }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || '인증 상태 갱신 중 오류가 발생했습니다.';
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 토큰 기반 인증 상태 확인
  // 토큰이 있으면 인증된 것으로 간주 (실제 유효성은 API 검증을 통해 확인)
  // 토큰 파싱 실패나 만료 여부는 서버 검증을 통해 확인하므로,
  // 클라이언트에서는 토큰 존재 여부만 확인
  // 네트워크 오류 등으로 사용자 정보를 가져오지 못해도 토큰이 있으면 인증된 것으로 간주
  const token = getAccessToken();
  const isAuthenticated = !!token;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshAuth,
    clearError,
  };
}

/**
 * 인증 상태만 반환하는 가벼운 훅
 */
export function useAuthState() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}

/**
 * 인증 액션만 반환하는 훅
 */
export function useAuthActions() {
  const { login, signup, logout, refreshAuth, clearError } = useAuth();
  
  return {
    login,
    signup,
    logout,
    refreshAuth,
    clearError,
  };
}