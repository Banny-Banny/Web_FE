/**
 * Customer Center Page
 *
 * @description
 * - 고객 센터 페이지 (마이페이지에서 라우팅)
 * - 추후 Expo Go 연동·최적화 시 확장 예정
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftSLine } from '@remixicon/react';
import styles from './styles.module.css';

const PAGE_TITLE = '고객 센터';
const PLACEHOLDER_MESSAGE = '문의·불편 신고는 아래 채널로 연락해 주세요. (추후 Expo Go 연동 예정)';

export default function CustomerCenterPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="마이페이지로 돌아가기"
        >
          <RiArrowLeftSLine size={24} className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>{PAGE_TITLE}</h1>
      </header>
      <main className={styles.main}>
        <p className={styles.placeholder}>{PLACEHOLDER_MESSAGE}</p>
      </main>
    </div>
  );
}
