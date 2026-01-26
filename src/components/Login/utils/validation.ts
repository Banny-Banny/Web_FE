/**
 * 로그인 폼 유효성 검증 유틸리티
 */

import type { LoginFormData, LoginFormErrors } from '../types';

/**
 * 한국 전화번호 형식 검증 (숫자만 허용)
 * 
 * @param phoneNumber 검증할 전화번호
 * @returns 유효한 전화번호 형식인지 여부
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  
  // 하이픈 제거 후 숫자만 검증
  const digitsOnly = phoneNumber.replace(/-/g, '');
  const phoneRegex = /^01[0-9][0-9]{3,4}[0-9]{4}$/;
  return phoneRegex.test(digitsOnly);
}

/**
 * 이메일 형식 검증 (@와 .이 포함된 유효한 형식)
 * 
 * @param email 검증할 이메일
 * @returns 유효한 이메일 형식인지 여부
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // @와 .이 포함된 기본 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 로그인 폼 데이터 유효성 검증
 * 
 * @param data 검증할 폼 데이터
 * @returns 검증 에러 객체
 */
export function validateLoginForm(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  
  // 선택한 로그인 타입에 따라 검증
  if (data.loginType === 'phone') {
    // 전화번호 필수
    if (!data.phoneNumber) {
      errors.phoneNumber = '전화번호를 입력해주세요.';
    } else if (!isValidPhoneNumber(data.phoneNumber)) {
      errors.phoneNumber = '올바른 전화번호 형식이 아닙니다. (예: 01012345678)';
    }
  } else if (data.loginType === 'email') {
    // 이메일 필수
    if (!data.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(data.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다. (@와 .이 포함되어야 합니다)';
    }
  }
  
  // 비밀번호 필수 (로그인에서는 기본 검증만)
  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.';
  }
  
  return errors;
}

/**
 * 폼 데이터가 유효한지 확인
 * 
 * @param data 검증할 폼 데이터
 * @returns 유효한지 여부
 */
export function isFormValid(data: LoginFormData): boolean {
  const errors = validateLoginForm(data);
  return Object.keys(errors).length === 0;
}
