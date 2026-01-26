/**
 * 회원가입 API 훅 (React Query)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { localSignup } from '@/commons/apis/auth/signup';
import { saveTokens } from '@/commons/utils/auth';
import type { LocalSignupRequest } from '@/commons/apis/auth/types';
import type { SignupFormData } from '../types';

/**
 * 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
function prepareSignupRequest(formData: SignupFormData): LocalSignupRequest {
  const request: LocalSignupRequest = {
    nickname: formData.nickname,
    phoneNumber: formData.phoneNumber,
    email: formData.email,
    password: formData.password,
  };

  // 프로필 이미지가 있으면 추가
  if (formData.profileImg) {
    request.profileImg = formData.profileImg;
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
    case 409:
      return '이미 사용 중인 전화번호 또는 이메일입니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return message || '회원가입 중 오류가 발생했습니다.';
  }
}

/**
 * 회원가입 API 호출 훅
 * 
 * @returns 회원가입 mutation 객체
 */
export function useSignupMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: SignupFormData) => {
      const request = prepareSignupRequest(formData);
      return localSignup(request);
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

      // 로그인 페이지로 리다이렉트
      router.push('/login');
    },
    onError: (error: any) => {
      // 에러는 컴포넌트에서 처리
      const errorInfo = {
        message: error?.message || '알 수 없는 오류',
        status: error?.status,
        code: error?.code,
        details: error?.details,
      };
      console.error('회원가입 실패:', JSON.stringify(errorInfo, null, 2));
    },
  });
}

/**
 * 에러 메시지를 가져오는 헬퍼 함수
 */
export function getSignupErrorMessage(error: any): string {
  return getErrorMessage(error);
}
