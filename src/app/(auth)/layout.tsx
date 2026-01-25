/**
 * Auth Layout
 * 
 * @description
 * - 인증 관련 페이지 전용 레이아웃
 * - GNB 숨김
 * - Mobile Frame은 Root Layout에서 이미 적용됨
 */

import React from 'react';
import styles from './styles.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
