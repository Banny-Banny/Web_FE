'use client';

/**
 * @fileoverview PaymentHeader 컴포넌트
 * @description 결제 페이지 헤더 (뒤로가기 화살표 + "결제하기" 제목)
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

/**
 * PaymentHeader 컴포넌트
 * 
 * Figma 디자인에 따른 결제 페이지 헤더입니다.
 * - 왼쪽: 뒤로가기 화살표
 * - 오른쪽: "결제하기" 제목
 */
export function PaymentHeader() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/timecapsule/create');
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
        aria-label="이전 페이지로 이동"
      >
        <span className={styles.arrow}>←</span>
      </button>
      <h1 className={styles.title}>결제하기</h1>
    </div>
  );
}
