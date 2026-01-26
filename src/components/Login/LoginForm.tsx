'use client';

/**
 * 로그인 폼 컴포넌트
 */

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/commons/components/button';
import type { LoginFormProps, LoginFormData, LoginFormErrors } from './types';
import { validateLoginForm } from './utils/validation';
import styles from './styles.module.css';

/**
 * LoginForm 컴포넌트
 * 
 * 전화번호/이메일과 비밀번호를 입력받는 로그인 폼
 */
export function LoginForm({ onSubmit, isLoading, error: serverError }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    loginType: 'phone',  // 기본값: 전화번호
    phoneNumber: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState({
    phoneNumber: false,
    email: false,
    password: false,
  });
  
  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  /**
   * 로그인 타입 변경 핸들러
   */
  const handleLoginTypeChange = (type: 'phone' | 'email') => {
    setFormData((prev) => ({
      ...prev,
      loginType: type,
      // 타입 변경 시 다른 필드 초기화
      phoneNumber: type === 'phone' ? prev.phoneNumber : '',
      email: type === 'email' ? prev.email : '',
    }));
    
    // 에러 초기화
    setErrors({});
  };

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = (field: 'phoneNumber' | 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    
    // 전화번호: 숫자만 허용
    if (field === 'phoneNumber') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // 터치 상태 업데이트
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // 실시간 검증 (onChange)
    const updatedData = { ...formData, [field]: value };
    const fieldErrors = validateLoginForm(updatedData);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
      phoneNumber: true,
      email: true,
      password: true,
    });
    
    // 유효성 검증
    const validationErrors = validateLoginForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // 첫 번째 에러 필드에 포커스
      const firstErrorField = Object.keys(validationErrors)[0] as keyof LoginFormErrors;
      if (firstErrorField !== 'general') {
        const input = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
        input?.focus();
      }
      return;
    }
    
    // 전화번호에서 하이픈 제거 후 제출
    const submitData = {
      ...formData,
      phoneNumber: formData.phoneNumber.replace(/-/g, ''),
    };
    
    // 에러 초기화 후 제출
    setErrors({});
    onSubmit(submitData);
  };

  /**
   * 입력 필드 블러 핸들러 (유효성 검증)
   */
  const handleBlur = (field: 'phoneNumber' | 'email' | 'password') => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // 해당 필드만 검증
    const fieldErrors = validateLoginForm(formData);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  // 폼 유효성 확인
  const isFormValid = Object.keys(validateLoginForm(formData)).length === 0;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* 서버 오류 메시지 */}
      {(serverError || errors.general) && (
        <div className={styles.errorMessage} role="alert" aria-live="polite">
          {serverError || errors.general}
        </div>
      )}

      {/* 로그인 타입 선택 (라디오 버튼) */}
      <div className={styles.loginTypeSelector}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="loginType"
            value="phone"
            checked={formData.loginType === 'phone'}
            onChange={() => handleLoginTypeChange('phone')}
            className={styles.radioInput}
          />
          <span className={styles.radioText}>전화번호</span>
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="loginType"
            value="email"
            checked={formData.loginType === 'email'}
            onChange={() => handleLoginTypeChange('email')}
            className={styles.radioInput}
          />
          <span className={styles.radioText}>이메일</span>
        </label>
      </div>

      {/* 전화번호 입력 필드 (전화번호 선택 시에만 표시) */}
      {formData.loginType === 'phone' && (
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
      )}

      {/* 이메일 입력 필드 (이메일 선택 시에만 표시) */}
      {formData.loginType === 'email' && (
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
            placeholder="user@example.com"
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
      )}

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
            placeholder="비밀번호를 입력하세요"
            className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
            aria-label="비밀번호"
            aria-required="true"
            aria-invalid={!!errors.password}
            autoComplete="current-password"
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

      {/* 로그인 버튼 */}
      <div className={styles.buttonGroup}>
        <Button
          label={isLoading ? '로그인 중...' : '로그인'}
          variant="primary"
          size="L"
          fullWidth
          disabled={!isFormValid || isLoading}
          onPress={() => {
            // 폼 제출은 form의 onSubmit에서 처리
            const form = document.querySelector(`.${styles.form}`) as HTMLFormElement;
            form?.requestSubmit();
          }}
        />
      </div>

      {/* 회원가입 링크 */}
      <div className={styles.signupLink}>
        <span className={styles.signupText}>계정이 없으신가요? </span>
        <Link href="/signup" className={styles.signupLinkAnchor}>
          회원가입
        </Link>
      </div>
    </form>
  );
}
