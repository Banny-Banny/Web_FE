/**
 * Main Layout
 * 
 * @description
 * - 메인 기능 페이지 전용 레이아웃
 * - GNB 표시
 * - 콘텐츠 영역과 GNB 간 겹침 방지
 */

import React from 'react';
import GNB from '@/commons/layout/gnb';
import styles from './styles.module.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {children}
      <GNB />
    </div>
  );
}
