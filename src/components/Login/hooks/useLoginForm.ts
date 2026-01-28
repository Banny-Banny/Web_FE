/**
 * 로그인 폼 상태 관리 훅
 * 
 * 이 훅은 LoginForm 컴포넌트 내부에서 직접 상태를 관리하므로
 * 현재는 선택적으로 사용됩니다.
 * 향후 폼 상태를 외부에서 관리해야 할 경우를 대비하여 구현합니다.
 */

import { useState, useCallback } from 'react';
import type { LoginFormData, LoginFormErrors, LoginFormTouched } from '../types';
import { validateLoginForm } from '../utils/validation';

/**
 * 로그인 폼 상태 관리 훅
 * 
 * @returns 폼 상태 및 핸들러
 */
export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    loginType: 'phone',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<LoginFormTouched>({
    phoneNumber: false,
    email: false,
    password: false,
  });

  /**
   * 입력 필드 변경 핸들러
   */
  const handleChange = useCallback((field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // 터치 상태 업데이트
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // 에러 초기화 (loginType은 에러가 없으므로 체크하지 않음)
    if (field !== 'loginType' && errors[field as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  }, [errors]);

  /**
   * 입력 필드 블러 핸들러
   */
  const handleBlur = useCallback((field: keyof LoginFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // 해당 필드만 검증 (loginType은 검증하지 않음)
    if (field !== 'loginType') {
      const fieldErrors = validateLoginForm(formData);
      if (fieldErrors[field as keyof LoginFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof LoginFormErrors] }));
      }
    }
  }, [formData]);

  /**
   * 폼 유효성 검증
   */
  const validate = useCallback(() => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  /**
   * 폼 리셋
   */
  const reset = useCallback(() => {
    setFormData({
      loginType: 'phone',
      phoneNumber: '',
      email: '',
      password: '',
    });
    setErrors({});
    setTouched({
      phoneNumber: false,
      email: false,
      password: false,
    });
  }, []);

  /**
   * 폼이 유효한지 확인
   */
  const isValid = Object.keys(validateLoginForm(formData)).length === 0;

  return {
    formData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFormData,
    setErrors,
  };
}
