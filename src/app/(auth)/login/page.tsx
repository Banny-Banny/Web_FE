/**
 * Login Page
 * 
 * @description
 * - 로그인 페이지
 * - GNB 숨김 (Auth Layout 적용)
 * - 375px 모바일 프레임 기준
 * - 이미 인증된 사용자는 홈으로 리다이렉트
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginContainer } from '@/components/Login';
import { useAuth } from '@/commons/hooks/useAuth';

export default function LoginPage() {
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
      <LoginContainer />
    </div>
  );
}
