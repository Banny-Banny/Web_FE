/**
 * 회원가입 폼 유효성 검증 유틸리티
 */

import type { SignupFormData, SignupFormErrors } from '../types';

/**
 * 한국 전화번호 형식 검증 (숫자만 허용)
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
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  // @와 .이 포함된 기본 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증 (영문, 숫자, 특수문자 포함, 최소 8자 이상)
 */
export function isValidPassword(password: string): boolean {
  if (!password) return false;
  if (password.length < 8) return false;
  
  // 영문, 숫자, 특수문자 모두 포함되어야 함
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasLetter && hasNumber && hasSpecialChar;
}

/**
 * 회원가입 폼 데이터 유효성 검증
 */
export function validateSignupForm(data: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {};
  
  // 이름 필수
  if (!data.name) {
    errors.name = '이름을 입력해주세요.';
  } else if (data.name.length < 2) {
    errors.name = '이름은 2자 이상이어야 합니다.';
  }
  
  // 전화번호 필수 및 형식 검증
  if (!data.phoneNumber) {
    errors.phoneNumber = '전화번호를 입력해주세요.';
  } else if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = '올바른 전화번호 형식이 아닙니다. (예: 01012345678)';
  }
  
  // 이메일 필수 및 형식 검증
  if (!data.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!isValidEmail(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다. (@와 .이 포함되어야 합니다)';
  }
  
  // 비밀번호 필수 및 강도 검증
  if (!data.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (data.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.';
  }
  
  // 비밀번호 확인
  if (!data.confirmPassword) {
    errors.confirmPassword = '비밀번호를 다시 입력해주세요.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }
  
  // 약관 동의는 폼 컴포넌트에서 별도로 검증
  
  return errors;
}

/**
 * 폼 데이터가 유효한지 확인
 */
export function isFormValid(data: SignupFormData): boolean {
  const errors = validateSignupForm(data);
  return Object.keys(errors).length === 0;
}
