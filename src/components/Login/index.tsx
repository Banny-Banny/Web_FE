'use client';

/**
 * 로그인 컨테이너 컴포넌트
 * 실제 API를 사용한 로그인 플로우
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from './LoginForm';
import type { LoginFormData } from './types';
import { useLoginMutation, getLoginErrorMessage } from './hooks/useLoginMutation';
import styles from './styles.module.css';

/**
 * LoginContainer 컴포넌트
 * 
 * 로그인 폼 상태 관리 및 실제 API 기반 로그인 처리
 */
export function LoginContainer() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleLogin = async (formData: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(formData);
      // 성공 시 리다이렉트는 useLoginMutation에서 처리
    } catch (error: any) {
      // 에러는 LoginForm에 전달됨 (error prop)
      // 여기서는 추가 에러 처리가 필요한 경우에만 구현
      console.error('로그인 실패:', error);
    }
  };

  // 에러 메시지 변환
  const errorMessage = loginMutation.error
    ? getLoginErrorMessage(loginMutation.error)
    : undefined;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} />
        </button>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>이메일과 비밀번호로 로그인하세요</p>
        </div>
      </div>
      <LoginForm
        onSubmit={handleLogin}
        isLoading={loginMutation.isPending}
        error={errorMessage}
      />
    </div>
  );
}
