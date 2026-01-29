/**
 * 온보딩 완료 API 호출 훅
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/commons/apis/onboarding/complete';
import type { OnboardingCompleteRequest } from '@/commons/apis/onboarding/types';

/**
 * 온보딩 완료 API 호출 훅
 * 
 * @returns 온보딩 완료 mutation 객체
 */
export function useOnboardingMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: OnboardingCompleteRequest) => {
      return completeOnboarding(request);
    },
    onSuccess: () => {
      // 온보딩 완료 상태 업데이트 (필요시)
      queryClient.setQueryData(['onboarding', 'status'], { completed: true });
      // 프로필(동의 값) 갱신을 위해 GET /me 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // 초대 코드가 저장되어 있으면 대기실 참여 페이지로 리다이렉트
      const pendingInviteCode = typeof window !== 'undefined'
        ? localStorage.getItem('pending_invite_code')
        : null;

      if (pendingInviteCode) {
        localStorage.removeItem('pending_invite_code');
        router.push(`/room/join?invite_code=${pendingInviteCode}`);
        return;
      }

      // 초대 코드가 없으면 메인 페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      // 에러는 컴포넌트에서 처리
      console.error('온보딩 완료 실패:', error);
    },
  });
}

/**
 * 에러 메시지를 가져오는 헬퍼 함수
 */
export function getOnboardingErrorMessage(error: any): string {
  if (!error) {
    return '온보딩 완료 중 오류가 발생했습니다.';
  }

  // 상태 코드에 따른 메시지 매핑
  switch (error.status) {
    case 400:
      return '잘못된 요청입니다. 필수 필드를 확인해주세요.';
    case 401:
      return '인증에 실패했습니다. 로그인 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return error.message || '온보딩 완료 중 오류가 발생했습니다.';
  }
}
