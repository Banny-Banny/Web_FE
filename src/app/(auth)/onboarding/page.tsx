/**
 * Onboarding Page
 *
 * @description
 * - 온보딩 페이지
 * - GNB 숨김 (Auth Layout 적용)
 * - 375px 모바일 프레임 기준
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 * - 이미 온보딩을 완료한 사용자는 자동으로 다음 페이지로 이동
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingContainer } from '@/components/Onboarding';
import { useAuth } from '@/commons/hooks/useAuth';

const PENDING_INVITE_CODE_KEY = 'pending_invite_code';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 이미 온보딩을 완료한 사용자는 자동으로 다음 페이지로 이동
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.onboardingCompleted) {
      // 초대 코드가 있으면 대기실 참여 페이지로 이동
      const pendingInviteCode = typeof window !== 'undefined'
        ? localStorage.getItem(PENDING_INVITE_CODE_KEY)
        : null;

      if (pendingInviteCode) {
        localStorage.removeItem(PENDING_INVITE_CODE_KEY);
        router.replace(`/room/join?invite_code=${pendingInviteCode}`);
      } else {
        // 초대 코드가 없으면 홈으로 이동
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // 로딩 중이거나 인증되지 않은 경우 또는 이미 온보딩 완료한 경우 빈 화면 표시
  if (isLoading || !isAuthenticated || user?.onboardingCompleted) {
    return null;
  }

  return (
    <div>
      <OnboardingContainer />
    </div>
  );
}
