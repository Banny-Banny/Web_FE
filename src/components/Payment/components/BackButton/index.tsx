'use client';

/**
 * @fileoverview BackButton 컴포넌트
 * @description 이전 페이지로 이동하는 버튼 컴포넌트
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import type { BackButtonProps } from './types';
import styles from './styles.module.css';

/**
 * BackButton 컴포넌트
 * 
 * 사용자가 주문 정보를 확인하고 수정이 필요한 경우
 * 이전 페이지(타임캡슐 생성 페이지)로 돌아갈 수 있는 버튼입니다.
 */
export function BackButton({ onClick, label = '이전' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 동작: 타임캡슐 생성 페이지로 이동
      router.push('/timecapsule/create');
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label="이전 페이지로 이동"
    >
      {label}
    </button>
  );
}
