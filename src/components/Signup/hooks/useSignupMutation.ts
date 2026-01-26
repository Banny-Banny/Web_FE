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
 * 전화번호 정규화 함수
 * 모든 하이픈, 공백, 특수문자를 제거하고 숫자만 남김
 */
function normalizePhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  // 모든 하이픈, 공백, 특수문자 제거하고 숫자만 추출
  return phoneNumber.replace(/[^0-9]/g, '').trim();
}

/**
 * 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
function prepareSignupRequest(formData: SignupFormData): LocalSignupRequest {
  const normalizedPhoneNumber = normalizePhoneNumber(formData.phoneNumber);
  
  const request: LocalSignupRequest = {
    nickname: formData.name.trim(),  // 프론트엔드의 name을 API의 nickname으로 매핑, 공백 제거
    phoneNumber: normalizedPhoneNumber,  // 전화번호 정규화 (하이픈, 공백 제거)
    email: formData.email.trim().toLowerCase(),  // 공백 제거 및 소문자 변환
    password: formData.password,
  };

  // 프로필 이미지가 있으면 추가
  if (formData.profileImg) {
    request.profileImg = formData.profileImg;
  }

  // 개발 환경에서 요청 데이터 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log('📤 회원가입 요청 데이터:', {
      ...request,
      password: request.password ? '***' : undefined, // 비밀번호는 마스킹
      originalPhoneNumber: formData.phoneNumber, // 원본 전화번호도 로깅
      normalizedPhoneNumber: normalizedPhoneNumber,
    });
  }

  return request;
}

/**
 * 에러 메시지 매핑
 */
function getErrorMessage(error: any): string {
  const status = error?.status || error?.response?.status;
  const errorData = error?.details || error?.response?.data;
  
  // 서버에서 배열로 에러 메시지를 보내는 경우 처리
  let message: string | string[] | undefined;
  if (errorData?.message) {
    message = errorData.message;
  } else {
    message = error?.message;
  }
  
  // 배열인 경우 첫 번째 메시지 사용
  if (Array.isArray(message)) {
    message = message[0];
  }

  switch (status) {
    case 400:
      // 400 에러는 유효성 검증 실패
      if (message) {
        // 서버 메시지를 사용자 친화적으로 변환
        if (typeof message === 'string') {
          if (message.includes('email')) {
            return '올바른 이메일 형식을 입력해주세요.';
          }
          if (message.includes('phone')) {
            return '올바른 전화번호 형식을 입력해주세요.';
          }
          if (message.includes('password')) {
            return '올바른 비밀번호 형식을 입력해주세요.';
          }
          return message;
        }
      }
      return '입력한 정보를 확인해주세요.';
    case 409:
      return '이미 사용 중인 전화번호 또는 이메일입니다.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return typeof message === 'string' ? message : '회원가입 중 오류가 발생했습니다.';
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
      // 회원가입 API 호출 (500 에러 발생 시에도 catch 블록으로 이동)
      // 백엔드 버그로 인해 데이터는 저장되지만 응답에서 500 에러 발생
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

      // 온보딩 완료 여부 확인
      const onboardingStatus = queryClient.getQueryData<{ completed: boolean }>(['onboarding', 'status']);
      const isOnboardingCompleted = onboardingStatus?.completed === true;

      // 온보딩이 완료되지 않았다면 온보딩 페이지로, 완료되었다면 홈으로 리다이렉트
      if (!isOnboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      const errorStatus = error?.status || error?.response?.status;
      
      // 500 에러는 백엔드 버그로 인해 데이터는 저장되지만 응답에서 에러가 발생
      // 사용자에게는 에러 메시지를 표시하지 않고 로그인 페이지로 리다이렉트
      // 사용자가 직접 로그인하여 온보딩을 진행할 수 있도록 함
      if (errorStatus === 500) {
        // 500 에러는 사용자에게 표시하지 않고 로그인 페이지로 리다이렉트
        router.push('/login');
      } else {
        // 500이 아닌 다른 에러는 로그인 페이지로 리다이렉트
        router.push('/login');
      }
    },
  });
}

/**
 * 에러 메시지를 가져오는 헬퍼 함수
 */
export function getSignupErrorMessage(error: any): string {
  return getErrorMessage(error);
}
