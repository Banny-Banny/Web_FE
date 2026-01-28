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

const PENDING_INVITE_CODE_KEY = 'pending_invite_code';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 이미 인증된 사용자 처리
  useEffect(() => {
    console.log('🔍 [LoginPage] 인증 상태 체크:', { isLoading, isAuthenticated });
    
    if (!isLoading && isAuthenticated) {
      // 초대 코드가 있는지 확인
      const pendingInviteCode = typeof window !== 'undefined'
        ? localStorage.getItem(PENDING_INVITE_CODE_KEY)
        : null;

      console.log('🔍 [LoginPage] 초대 코드 확인:', { pendingInviteCode });

      if (pendingInviteCode) {
        // 초대 코드가 있으면 room/join 페이지로 이동
        console.log('✅ [LoginPage] 이미 로그인됨 - 저장된 초대 코드로 이동:', pendingInviteCode);
        localStorage.removeItem(PENDING_INVITE_CODE_KEY);
        router.push(`/room/join?invite_code=${pendingInviteCode}`);
      } else {
        // 초대 코드가 없으면 홈으로 이동
        console.log('➡️ [LoginPage] 홈으로 이동');
        router.push('/');
      }
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
