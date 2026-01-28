'use client';

/**
 * 로그인 컨테이너 컴포넌트
 * 실제 API를 사용한 로그인 플로우
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine } from '@remixicon/react';
import { LoginForm } from './LoginForm';
import { LoginMethodSelector } from './LoginMethodSelector';
import type { LoginFormData } from './types';
import { useLoginMutation, getLoginErrorMessage } from './hooks/useLoginMutation';
import { useKakaoLogin } from './hooks/useKakaoLogin';
import styles from './styles.module.css';

/**
 * 로그인 화면 타입
 */
type LoginView = 'selector' | 'email' | 'kakao';

/**
 * LoginContainer 컴포넌트
 * 
 * 로그인 방법 선택 화면과 로그인 폼을 관리하는 컨테이너 컴포넌트
 */
export function LoginContainer() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const { loginWithKakao } = useKakaoLogin();
  const [currentView, setCurrentView] = useState<LoginView>('selector');

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

  /**
   * 뒤로가기 핸들러
   * 선택 화면에서는 라우터 뒤로가기, 로그인 폼에서는 선택 화면으로 돌아감
   */
  const handleBack = () => {
    if (currentView === 'selector') {
      router.back();
    } else {
      setCurrentView('selector');
    }
  };

  /**
   * 카카오 로그인 선택 핸들러
   */
  const handleSelectKakao = () => {
    try {
      loginWithKakao();
    } catch (error) {
      console.error('카카오 로그인 시작 실패:', error);
      // 에러 발생 시 사용자에게 알림 (선택적)
      // alert('카카오 로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  /**
   * 이메일 로그인 선택 핸들러
   */
  const handleSelectEmail = () => {
    setCurrentView('email');
  };

  // 로그인 방법 선택 화면
  if (currentView === 'selector') {
    return (
      <LoginMethodSelector
        onSelectKakao={handleSelectKakao}
        onSelectEmail={handleSelectEmail}
      />
    );
  }

  // 이메일 로그인 폼
  if (currentView === 'email') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <RiArrowLeftLine size={24} />
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

  // 카카오 로그인 화면 (향후 구현)
  return null;
}
