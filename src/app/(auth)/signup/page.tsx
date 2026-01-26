/**
 * Signup Page
 * 
 * @description
 * - 회원가입 페이지
 * - GNB 숨김 (Auth Layout 적용)
 * - 375px 모바일 프레임 기준
 * - 이미 인증된 사용자는 홈으로 리다이렉트
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupContainer } from '@/components/Signup';
import { useAuth } from '@/commons/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 이미 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 이미 인증된 경우 빈 화면 표시
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div>
      <SignupContainer />
    </div>
  );
}
