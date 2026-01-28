/**
 * Main Layout
 * 
 * @description
 * - 메인 기능 페이지 전용 레이아웃
 * - GNB 표시
 * - 콘텐츠 영역과 GNB 간 겹침 방지
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import GNB from '@/commons/layout/gnb';
import { useAuth } from '@/commons/hooks/useAuth';
import styles from './styles.module.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // /room/join 페이지는 인증 체크 예외 (초대 코드 저장을 위해)
  const isRoomJoinPage = pathname === '/room/join';

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트 (예외: /room/join)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isRoomJoinPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, isRoomJoinPage, router]);

  // /room/join: 인증 없이 접근 가능 (자체 리다이렉트)
  if (isRoomJoinPage) {
    return <>{children}</>;
  }

  // 로딩 중이거나 인증되지 않은 경우 빈 화면 표시
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      {children}
      <GNB />
    </div>
  );
}
