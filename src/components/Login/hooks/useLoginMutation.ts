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
      console.log('🔐 로그인 성공:', { user: data.user });

      // 회원가입에서 넘어온 경우 세션 스토리지의 정보 삭제
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('signup_info');
        } catch (error) {
          console.error('회원가입 정보 삭제 실패:', error);
        }
      }

      // 토큰 저장
      if (data.accessToken) {
        saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || '',
        });
        console.log('✅ 토큰 저장 완료');
      }

      // 인증 상태 업데이트 (사용자 정보가 있는 경우)
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
        console.log('✅ 사용자 정보 캐시 업데이트 완료');
      }

      // 초대 코드 확인
      const pendingInviteCode = typeof window !== 'undefined'
        ? localStorage.getItem('pending_invite_code')
        : null;

      console.log('🔍 초대 코드 확인:', { pendingInviteCode });

      // 온보딩 완료 여부 확인
      const onboardingStatus = queryClient.getQueryData<{ completed: boolean }>(['onboarding', 'status']);
      const isOnboardingCompleted = data.user?.onboardingCompleted ?? onboardingStatus?.completed ?? false;

      console.log('🔍 온보딩 완료 여부:', { isOnboardingCompleted });

      // 초대 코드가 있으면서 온보딩이 완료된 경우: 바로 대기실 참여 페이지로 이동
      if (pendingInviteCode && isOnboardingCompleted) {
        console.log('✅ 초대 코드 발견 + 온보딩 완료 - 대기실 참여 페이지로 이동');
        // 주의: 로컬스토리지는 room/join 페이지에서 삭제됨
        router.push(`/room/join?invite_code=${pendingInviteCode}`);
        return;
      }

      // 초대 코드가 있지만 온보딩이 미완료: 온보딩 페이지로 이동 (초대 코드 유지)
      if (pendingInviteCode && !isOnboardingCompleted) {
        console.log('➡️ 초대 코드 있음 + 온보딩 미완료 - 온보딩 페이지로 이동 (초대 코드 유지)');
        router.push('/onboarding');
        return;
      }

      // 초대 코드가 없는 경우: 온보딩 완료 여부에 따라 리다이렉트
      if (!isOnboardingCompleted) {
        console.log('➡️ 온보딩 페이지로 이동');
        router.push('/onboarding');
      } else {
        console.log('➡️ 홈으로 이동');
        router.push('/');
      }
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
