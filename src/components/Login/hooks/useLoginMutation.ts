/**
 * 로그인 API 훅 (React Query)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { localLogin } from '@/commons/apis/auth/login';
import { saveTokens } from '@/commons/utils/auth';
import type { LocalLoginRequest } from '@/commons/apis/auth/types';
import type { LoginFormData } from '../types';

/**
 * 로그인 폼 데이터를 API 요청 형식으로 변환
 */
function prepareLoginRequest(formData: LoginFormData): LocalLoginRequest {
  const request: LocalLoginRequest = {
    password: formData.password,
  };

  // 선택한 로그인 타입에 따라 하나만 전송
  if (formData.loginType === 'phone' && formData.phoneNumber) {
    request.phoneNumber = formData.phoneNumber;
  } else if (formData.loginType === 'email' && formData.email) {
    request.email = formData.email;
  }

  return request;
}

/**
 * 에러 메시지 매핑
 */
function getErrorMessage(error: any): string {
  const status = error?.status || error?.response?.status;
  const message = error?.message || error?.response?.data?.message;

  switch (status) {
    case 401:
      return '인증에 실패했습니다. 전화번호/이메일 또는 비밀번호를 확인해주세요.';
    case 403:
      return '비활성화된 계정이거나 SNS 계정입니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return message || '로그인 중 오류가 발생했습니다.';
  }
}

/**
 * 로그인 API 호출 훅
 * 
 * @returns 로그인 mutation 객체
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: LoginFormData) => {
      const request = prepareLoginRequest(formData);
      return localLogin(request);
    },
    onSuccess: (data) => {
      // 토큰 저장
      if (data.accessToken) {
        saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || '',
        });
      }

      // 인증 상태 업데이트 (사용자 정보가 있는 경우)
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }

      // 홈 페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      // 에러는 컴포넌트에서 처리
      console.error('로그인 실패:', error);
    },
  });
}

/**
 * 에러 메시지를 가져오는 헬퍼 함수
 */
export function getLoginErrorMessage(error: any): string {
  return getErrorMessage(error);
}
