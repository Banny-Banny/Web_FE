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
          setUser(null);
          setIsLoading(false);
          return;
        }

        // 캐시에서 사용자 정보 확인
        const cachedUser = queryClient.getQueryData<User>(['auth', 'user']);
        
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          // 토큰은 있지만 사용자 정보가 없는 경우
          // 토큰 검증 API 호출하여 사용자 정보 가져오기
          try {
            const verifyResult = await verifyAuth();
            
            if (verifyResult.valid && verifyResult.user) {
              setUser(verifyResult.user);
              queryClient.setQueryData(['auth', 'user'], verifyResult.user);
            } else {
              // 토큰이 유효하지 않은 경우
              clearTokens();
              setUser(null);
            }
          } catch (err: any) {
            // 토큰 검증 실패 시 토큰 제거
            console.error('토큰 검증 실패:', err);
            clearTokens();
            setUser(null);
          }
        }
      } catch (err: any) {
        setError(err.message || '인증 상태 확인 중 오류가 발생했습니다.');
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
    } catch (err: any) {
      const errorMessage = err.message || '로그인 중 오류가 발생했습니다.';
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
    console.log('Signup function - to be implemented');
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
        
        if (verifyResult.valid && verifyResult.user) {
          setUser(verifyResult.user);
          queryClient.setQueryData(['auth', 'user'], verifyResult.user);
        } else {
          // 토큰이 유효하지 않은 경우
          clearTokens();
          setUser(null);
        }
      } catch (err: any) {
        // 토큰 검증 실패 시 토큰 제거
        console.error('토큰 검증 실패:', err);
        clearTokens();
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message || '인증 상태 갱신 중 오류가 발생했습니다.');
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
  const isAuthenticated = !!getAccessToken() && !!user;

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