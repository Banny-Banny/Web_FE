/**
 * 온보딩 컴포넌트 타입 정의
 */

/**
 * 온보딩 단계 타입
 */
export type OnboardingStep = 'friend' | 'location' | 'complete';

/**
 * 온보딩 상태 타입
 */
export interface OnboardingState {
  friendConsent: boolean | null;    // 친구 연동 허용 동의 (null: 미선택)
  locationConsent: boolean | null;   // 위치 권한 허용 동의 (null: 미선택)
  currentStep: OnboardingStep;     // 현재 단계
}

/**
 * 동의 단계 공통 Props 타입
 */
export interface ConsentStepProps {
  consent: boolean | null;
  onConsentChange: (consent: boolean) => void;
  onNext: () => void;
  isLoading?: boolean;
}

/**
 * 친구 연동 허용 단계 Props 타입
 */
export interface FriendConsentStepProps {
  consent: boolean | null;
  onConsentChange: (consent: boolean) => void;
  onNext: () => void;
}

/**
 * 위치 권한 허용 단계 Props 타입
 */
export interface LocationConsentStepProps {
  consent: boolean | null;
  onConsentChange: (consent: boolean) => void;
  onComplete: (locationConsent: boolean) => void;
  isLoading?: boolean;
  error?: string;
}
