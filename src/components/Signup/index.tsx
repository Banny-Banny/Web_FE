'use client';

/**
 * 회원가입 컨테이너 컴포넌트
 * 실제 API를 사용한 회원가입 플로우
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
  const router = useRouter();
  const signupMutation = useSignupMutation();

  /**
   * 회원가입 폼 제출 핸들러
   */
  const handleSignup = async (formData: SignupFormData) => {
    try {
      await signupMutation.mutateAsync(formData);
      // 성공 시 리다이렉트는 useSignupMutation에서 처리
    } catch (error: any) {
      // 500 에러는 onError에서 이미 처리되므로 여기서는 무시
      // (onError에서 로그인 페이지로 리다이렉트됨)
      const errorStatus = error?.status || error?.response?.status;
      if (errorStatus === 500) {
        // 500 에러는 onError에서 처리되므로 여기서는 아무것도 하지 않음
        return;
      }
      
      // 400 에러 등 유효성 검증 실패는 폼에 에러 메시지로 표시
      // 에러는 SignupForm에 전달됨 (error prop)
      const errorInfo = {
        message: error?.message || '알 수 없는 오류',
        status: error?.status,
        code: error?.code,
        details: error?.details,
      };
      console.error('회원가입 실패:', JSON.stringify(errorInfo, null, 2));
    }
  };

  // 에러 메시지 변환 (500 에러는 사용자에게 표시하지 않음)
  const errorMessage = signupMutation.error
    ? (() => {
        const errorStatus = signupMutation.error?.status || signupMutation.error?.response?.status;
        // 500 에러는 백엔드 버그로 인해 발생하지만 데이터는 저장되므로 사용자에게 표시하지 않음
        // 로그인 페이지로 리다이렉트되어 사용자가 직접 로그인할 수 있음
        if (errorStatus === 500) {
          return undefined;
        }
        return getSignupErrorMessage(signupMutation.error);
      })()
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
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>타임캡슐과 함께 추억을 보관하세요</p>
        </div>
      </div>
      <SignupForm
        onSubmit={handleSignup}
        isLoading={signupMutation.isPending}
        error={errorMessage}
      />
    </div>
  );
}
