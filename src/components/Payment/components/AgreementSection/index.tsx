'use client';

/**
 * @fileoverview AgreementSection 컴포넌트
 * @description 전체 동의 섹션 컴포넌트 (Figma 디자인 기반)
 */

import React, { useState } from 'react';
import CheckboxBlankCircleLineIcon from 'remixicon-react/CheckboxBlankCircleLineIcon';
import CheckboxCircleFillIcon from 'remixicon-react/CheckboxCircleFillIcon';
import { Colors } from '@/commons/styles/color';
import type { AgreementSectionProps } from './types';
import styles from './styles.module.css';

/**
 * AgreementSection 컴포넌트
 * 
 * Figma 디자인에 따른 전체 동의 섹션입니다.
 * - 전체 동의 체크박스
 * - 이용약관 동의 (필수)
 * - 개인정보 처리방침 동의 (필수)
 * - 결제 진행 동의 (필수)
 */
export function AgreementSection({
  onAgreementChange,
}: AgreementSectionProps) {
  const [allAgreed, setAllAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [paymentAgreed, setPaymentAgreed] = useState(false);

  const handleAllAgree = (checked: boolean) => {
    setAllAgreed(checked);
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
    setPaymentAgreed(checked);
    
    if (onAgreementChange) {
      onAgreementChange({
        allAgreed: checked,
        termsAgreed: checked,
        privacyAgreed: checked,
        paymentAgreed: checked,
      });
    }
  };

  const handleIndividualAgree = (
    type: 'terms' | 'privacy' | 'payment',
    checked: boolean
  ) => {
    if (type === 'terms') {
      setTermsAgreed(checked);
    } else if (type === 'privacy') {
      setPrivacyAgreed(checked);
    } else if (type === 'payment') {
      setPaymentAgreed(checked);
    }

    // 모든 항목이 체크되었는지 확인
    const allChecked =
      (type === 'terms' ? checked : termsAgreed) &&
      (type === 'privacy' ? checked : privacyAgreed) &&
      (type === 'payment' ? checked : paymentAgreed);

    setAllAgreed(allChecked);

    if (onAgreementChange) {
      onAgreementChange({
        allAgreed: allChecked,
        termsAgreed: type === 'terms' ? checked : termsAgreed,
        privacyAgreed: type === 'privacy' ? checked : privacyAgreed,
        paymentAgreed: type === 'payment' ? checked : paymentAgreed,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.allAgreeLabel}>
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={(e) => handleAllAgree(e.target.checked)}
            className={styles.checkboxInput}
            aria-label="전체 동의"
          />
          <span className={styles.checkboxIcon}>
            {allAgreed ? (
              <CheckboxCircleFillIcon size={20} color={Colors.black[500]} />
            ) : (
              <CheckboxBlankCircleLineIcon size={20} color={Colors.black[500]} />
            )}
          </span>
          <span className={styles.allAgreeText}>전체 동의</span>
        </label>
      </div>

      <div className={styles.agreements}>
        <label className={styles.agreementItem}>
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => handleIndividualAgree('terms', e.target.checked)}
            className={styles.checkboxInput}
            aria-label="이용약관 동의"
          />
          <span className={styles.checkboxIcon}>
            {termsAgreed ? (
              <CheckboxCircleFillIcon size={20} color={Colors.black[500]} />
            ) : (
              <CheckboxBlankCircleLineIcon size={20} color={Colors.grey[500]} />
            )}
          </span>
          <span className={styles.agreementText}>
            <span className={styles.agreementTextBold}>이용약관 동의</span> <span className={styles.required}>(필수)</span>
          </span>
          <span className={styles.chevron}>›</span>
        </label>

        <label className={styles.agreementItem}>
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => handleIndividualAgree('privacy', e.target.checked)}
            className={styles.checkboxInput}
            aria-label="개인정보 처리방침 동의"
          />
          <span className={styles.checkboxIcon}>
            {privacyAgreed ? (
              <CheckboxCircleFillIcon size={20} color={Colors.black[500]} />
            ) : (
              <CheckboxBlankCircleLineIcon size={20} color={Colors.grey[500]} />
            )}
          </span>
          <span className={styles.agreementText}>
            <span className={styles.agreementTextBold}>개인정보 처리방침 동의</span> <span className={styles.required}>(필수)</span>
          </span>
          <span className={styles.chevron}>›</span>
        </label>

        <label className={styles.agreementItem}>
          <input
            type="checkbox"
            checked={paymentAgreed}
            onChange={(e) => handleIndividualAgree('payment', e.target.checked)}
            className={styles.checkboxInput}
            aria-label="결제 진행 동의"
          />
          <span className={styles.checkboxIcon}>
            {paymentAgreed ? (
              <CheckboxCircleFillIcon size={20} color={Colors.black[500]} />
            ) : (
              <CheckboxBlankCircleLineIcon size={20} color={Colors.grey[500]} />
            )}
          </span>
          <span className={styles.agreementText}>
            <span className={styles.agreementTextBold}>결제 진행 동의</span> <span className={styles.required}>(필수)</span>
          </span>
          <span className={styles.chevron}>›</span>
        </label>
      </div>
    </div>
  );
}
