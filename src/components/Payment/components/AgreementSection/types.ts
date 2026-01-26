/**
 * @fileoverview AgreementSection 컴포넌트 타입 정의
 */

/**
 * 동의 상태
 */
export interface AgreementState {
  /** 전체 동의 여부 */
  allAgreed: boolean;
  /** 이용약관 동의 여부 */
  termsAgreed: boolean;
  /** 개인정보 처리방침 동의 여부 */
  privacyAgreed: boolean;
  /** 결제 진행 동의 여부 */
  paymentAgreed: boolean;
}

/**
 * AgreementSection 컴포넌트 Props
 */
export interface AgreementSectionProps {
  /** 동의 상태 변경 콜백 */
  onAgreementChange?: (state: AgreementState) => void;
}
