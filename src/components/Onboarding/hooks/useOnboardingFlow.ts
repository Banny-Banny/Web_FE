/**
 * 온보딩 플로우 상태 관리 훅 (Mock 버전)
 */

import { useState, useCallback } from 'react';
import type { OnboardingState, OnboardingStep } from '../types';

/**
 * 온보딩 플로우 상태 관리 훅
 * 
 * @returns 온보딩 플로우 상태 및 핸들러 함수들
 */
export function useOnboardingFlow() {
  const [state, setState] = useState<OnboardingState>({
    friendConsent: null,
    locationConsent: null,
    currentStep: 'friend',
  });

  /**
   * 친구 연동 허용 동의 변경 핸들러
   */
  const handleFriendConsentChange = useCallback((consent: boolean) => {
    setState(prev => ({ ...prev, friendConsent: consent }));
  }, []);

  /**
   * 위치 권한 허용 동의 변경 핸들러
   */
  const handleLocationConsentChange = useCallback((consent: boolean) => {
    setState(prev => ({ ...prev, locationConsent: consent }));
  }, []);

  /**
   * 다음 단계로 이동 핸들러
   */
  const handleNext = useCallback(() => {
    setState(prev => {
      if (prev.currentStep === 'friend') {
        return { ...prev, currentStep: 'location' };
      }
      return prev;
    });
  }, []);

  /**
   * 온보딩 완료 요청 데이터 준비
   */
  const prepareCompleteRequest = useCallback(() => {
    // null 값은 기본값(false)으로 처리
    return {
      friend_consent: state.friendConsent ?? false,
      location_consent: state.locationConsent ?? false,
    };
  }, [state.friendConsent, state.locationConsent]);

  /**
   * 온보딩 완료 가능 여부 확인
   */
  const canComplete = useCallback(() => {
    return state.friendConsent !== null && state.locationConsent !== null;
  }, [state.friendConsent, state.locationConsent]);

  return {
    state,
    handleFriendConsentChange,
    handleLocationConsentChange,
    handleNext,
    prepareCompleteRequest,
    canComplete,
  };
}
