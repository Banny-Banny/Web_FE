'use client';
/**
 * @fileoverview 홈 페이지
 * @description TimeEgg 홈 페이지 - 카카오 지도 표시
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/commons/hooks/useAuth';
import { HomeFeature } from '@/components/home';

export default function HomePage() {
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
    <div style={{ height: 'calc(100vh - 60px)', width: '100%', overflow: 'hidden' }}>
      {/* 지도 */}
      <HomeFeature />
    </div>
  );
}
