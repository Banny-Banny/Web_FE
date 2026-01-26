'use client';

/**
 * 온보딩 컨테이너 컴포넌트
 * 실제 API 기반 구현
 */

import React, { useCallback } from 'react';
import { FriendConsentStep } from './FriendConsentStep';
import { LocationConsentStep } from './LocationConsentStep';
import { useOnboardingFlow } from './hooks/useOnboardingFlow';
import { useOnboardingMutation, getOnboardingErrorMessage } from './hooks/useOnboardingMutation';
import type { OnboardingCompleteRequest } from '@/commons/apis/onboarding/types';
import styles from './styles.module.css';

/**
 * OnboardingContainer 컴포넌트
 * 
 * 온보딩 플로우를 관리하는 컨테이너 컴포넌트
 */
export function OnboardingContainer() {
  const {
    state,
    handleFriendConsentChange,
    handleLocationConsentChange,
    handleNext,
    prepareCompleteRequest,
    canComplete,
  } = useOnboardingFlow();

  const onboardingMutation = useOnboardingMutation();

  /**
   * 온보딩 완료 처리
   * 
   * @param locationConsent 위치 권한 동의 값 (선택적, 없으면 state에서 가져옴)
   */
  const handleComplete = useCallback(async (locationConsent?: boolean) => {
    // locationConsent가 전달되면 최신 값을 사용, 아니면 state에서 가져옴
    const finalLocationConsent = locationConsent !== undefined 
      ? locationConsent 
      : state.locationConsent;
    
    const finalFriendConsent = state.friendConsent;

    // 두 동의 값이 모두 null이 아니어야 함
    if (finalFriendConsent === null || finalLocationConsent === null) {
      console.warn('온보딩 완료: 모든 동의 값이 선택되어야 합니다.');
      return;
    }

    if (onboardingMutation.isPending) {
      return;
    }

    try {
      const request: OnboardingCompleteRequest = {
        friend_consent: finalFriendConsent ?? false,
        location_consent: finalLocationConsent ?? false,
      };
      
      await onboardingMutation.mutateAsync(request);
      // 성공 시 리다이렉트는 useOnboardingMutation에서 처리
    } catch (error: any) {
      // 에러는 LocationConsentStep에 전달됨 (error prop)
      console.error('온보딩 완료 실패:', error);
    }
  }, [state.friendConsent, state.locationConsent, onboardingMutation]);

  // 에러 메시지 변환
  const errorMessage = onboardingMutation.error
    ? getOnboardingErrorMessage(onboardingMutation.error)
    : undefined;

  // 현재 단계에 따라 컴포넌트 렌더링
  if (state.currentStep === 'friend') {
    return (
      <FriendConsentStep
        consent={state.friendConsent}
        onConsentChange={handleFriendConsentChange}
        onNext={handleNext}
      />
    );
  }

  if (state.currentStep === 'location') {
    return (
      <LocationConsentStep
        consent={state.locationConsent}
        onConsentChange={handleLocationConsentChange}
        onComplete={handleComplete}
        isLoading={onboardingMutation.isPending}
        error={errorMessage}
      />
    );
  }

  return null;
}
