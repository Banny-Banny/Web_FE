/**
 * Onboarding Page
 * 
 * @description
 * - 온보딩 페이지
 * - GNB 숨김 (Auth Layout 적용)
 * - 375px 모바일 프레임 기준
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingContainer } from '@/components/Onboarding';
import { useAuth } from '@/commons/hooks/useAuth';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우 빈 화면 표시
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <OnboardingContainer />
    </div>
  );
}
