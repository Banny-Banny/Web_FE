/**
 * 인증 관련 훅 (추후 구현 예정)
 * 현재는 기본 구조만 제공
 */

import type { AuthContextType } from '@/commons/types/auth';

/**
 * 인증 상태 및 액션에 접근하는 커스텀 훅
 * TODO: 실제 인증 로직 구현 필요
 */
export function useAuth(): AuthContextType {
  // 임시 구현 - 추후 실제 인증 로직으로 교체
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async () => {
      console.log('Login function - to be implemented');
    },
    signup: async () => {
      console.log('Signup function - to be implemented');
    },
    logout: () => {
      console.log('Logout function - to be implemented');
    },
    refreshAuth: async () => {
      console.log('RefreshAuth function - to be implemented');
    },
    clearError: () => {
      console.log('ClearError function - to be implemented');
    },
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