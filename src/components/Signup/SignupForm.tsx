'use client';

/**
 * 회원가입 폼 컴포넌트
 */

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/commons/components/button';
import type { SignupFormProps, SignupFormData, SignupFormErrors } from './types';
import { validateSignupForm } from './utils/validation';
import styles from './styles.module.css';

/**
 * SignupForm 컴포넌트
 * 
 * 닉네임, 전화번호, 이메일, 비밀번호를 입력받는 회원가입 폼
 */
export function SignupForm({ onSubmit, isLoading, error: serverError }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  
  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value: string | boolean = e.target.value;
    
    // 전화번호: 숫자만 허용
    if (field === 'phoneNumber') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    // 체크박스 처리
    if (field === 'agreeToTerms') {
      value = e.target.checked;
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // 터치 상태 업데이트
    if (field !== 'agreeToTerms') {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
    
    // 실시간 검증 (onChange)
    if (field !== 'agreeToTerms') {
      const updatedData = { ...formData, [field]: value };
      const fieldErrors = validateSignupForm(updatedData);
      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }
    
    // 에러 초기화
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 모든 필드를 터치 상태로 설정
    setTouched({
      name: true,
      phoneNumber: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    
    // 유효성 검증
    const validationErrors = validateSignupForm(formData);
    
    // 약관 동의 검증
    if (!formData.agreeToTerms) {
      validationErrors.general = '필수 약관에 동의해주세요.';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // 첫 번째 에러 필드에 포커스
      const firstErrorField = Object.keys(validationErrors)[0] as keyof SignupFormErrors;
      if (firstErrorField !== 'general') {
        const input = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
        input?.focus();
      }
      return;
    }
    
    // 전화번호는 prepareSignupRequest에서 정규화되므로 그대로 제출
    // 에러 초기화 후 제출
    setErrors({});
    onSubmit(formData);
  };

  /**
   * 입력 필드 블러 핸들러 (유효성 검증)
   */
  const handleBlur = (field: keyof SignupFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // 해당 필드만 검증
    const fieldErrors = validateSignupForm(formData);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  // 폼 유효성 확인 (모든 필드 검증 통과 + 약관 동의)
  const isFormValid = 
    Object.keys(validateSignupForm(formData)).length === 0 && 
    formData.agreeToTerms;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* 서버 오류 메시지 */}
      {(serverError || errors.general) && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {serverError || errors.general}
        </div>
      )}

      {/* 이름 입력 필드 */}
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          placeholder="홍길동"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          aria-label="이름"
          aria-required="true"
          aria-invalid={!!errors.name}
          autoComplete="name"
        />
        {(touched.name || errors.name) && errors.name && (
          <span className={styles.fieldError} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* 전화번호 입력 필드 */}
      <div className={styles.inputGroup}>
        <label htmlFor="phoneNumber" className={styles.label}>
          전화번호
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          inputMode="numeric"
          value={formData.phoneNumber}
          onChange={handleChange('phoneNumber')}
          onBlur={handleBlur('phoneNumber')}
          placeholder="01012345678"
          className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
          aria-label="전화번호"
          aria-required="true"
          aria-invalid={!!errors.phoneNumber}
          autoComplete="tel"
        />
        {(touched.phoneNumber || errors.phoneNumber) && errors.phoneNumber && (
          <span className={styles.fieldError} role="alert">
            {errors.phoneNumber}
          </span>
        )}
      </div>

      {/* 이메일 입력 필드 */}
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="example@email.com"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          aria-label="이메일"
          aria-required="true"
          aria-invalid={!!errors.email}
          autoComplete="email"
        />
        {(touched.email || errors.email) && errors.email && (
          <span className={styles.fieldError} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>
          비밀번호
        </label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="8자 이상 입력해주세요"
            className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
            aria-label="비밀번호"
            aria-required="true"
            aria-invalid={!!errors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3C5 3 1.73 6.11 1 10C1.73 13.89 5 17 10 17C15 17 18.27 13.89 19 10C18.27 6.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="#6B7280"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3C5 3 1.73 6.11 1 10C1.73 13.89 5 17 10 17C15 17 18.27 13.89 19 10C18.27 6.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="#6B7280"/>
                <path d="M2.5 2.5L17.5 17.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        {(touched.password || errors.password) && errors.password && (
          <span className={styles.fieldError} role="alert">
            {errors.password}
          </span>
        )}
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          비밀번호 확인
        </label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            placeholder="비밀번호를 다시 입력하세요"
            className={`${styles.input} ${styles.passwordInput} ${errors.confirmPassword ? styles.inputError : ''}`}
            aria-label="비밀번호 확인"
            aria-required="true"
            aria-invalid={!!errors.confirmPassword}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3C5 3 1.73 6.11 1 10C1.73 13.89 5 17 10 17C15 17 18.27 13.89 19 10C18.27 6.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="#6B7280"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3C5 3 1.73 6.11 1 10C1.73 13.89 5 17 10 17C15 17 18.27 13.89 19 10C18.27 6.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="#6B7280"/>
                <path d="M2.5 2.5L17.5 17.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        {(touched.confirmPassword || errors.confirmPassword) && errors.confirmPassword && (
          <span className={styles.fieldError} role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* 약관 동의 */}
      <div className={styles.termsGroup}>
        <label className={styles.termsLabel}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange('agreeToTerms')}
            className={styles.termsCheckbox}
            aria-required="true"
          />
          <span className={styles.termsText}>
            <span className={styles.termsRequired}>[필수]</span> 이용약관 및 개인정보 처리방침에 동의합니다.
          </span>
        </label>
      </div>

      {/* 회원가입 버튼 */}
      <div className={styles.buttonGroup}>
        <Button
          label={isLoading ? '회원가입 중...' : '회원가입'}
          variant="primary"
          size="L"
          fullWidth
          disabled={!isFormValid || isLoading}
          onPress={() => {
            const form = document.querySelector(`.${styles.form}`) as HTMLFormElement;
            form?.requestSubmit();
          }}
        />
      </div>

      {/* 로그인 링크 */}
      <div className={styles.loginLink}>
        <span className={styles.loginText}>이미 계정이 있으신가요? </span>
        <Link href="/login" className={styles.loginLinkAnchor}>
          로그인
        </Link>
      </div>
    </form>
  );
}
