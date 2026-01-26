'use client';

/**
 * 회원가입 컨테이너 컴포넌트
 * 실제 API를 사용한 회원가입 플로우
 */

import React from 'react';
import { SignupForm } from './SignupForm';
import type { SignupFormData } from './types';
import { useSignupMutation, getSignupErrorMessage } from './hooks/useSignupMutation';
import styles from './styles.module.css';

/**
 * SignupContainer 컴포넌트
 * 
 * 회원가입 폼 상태 관리 및 실제 API 기반 회원가입 처리
 */
export function SignupContainer() {
  const signupMutation = useSignupMutation();

  /**
   * 회원가입 폼 제출 핸들러
   */
  const handleSignup = async (formData: SignupFormData) => {
    try {
      await signupMutation.mutateAsync(formData);
      // 성공 시 리다이렉트는 useSignupMutation에서 처리
    } catch (error: any) {
      // 에러는 SignupForm에 전달됨 (error prop)
      console.error('회원가입 실패:', error);
    }
  };

  // 에러 메시지 변환
  const errorMessage = signupMutation.error
    ? getSignupErrorMessage(signupMutation.error)
    : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>회원가입</h1>
      </div>
      <SignupForm
        onSubmit={handleSignup}
        isLoading={signupMutation.isPending}
        error={errorMessage}
      />
    </div>
  );
}
