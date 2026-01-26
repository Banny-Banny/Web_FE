/**
 * 로그인 컴포넌트 타입 정의
 */

/**
 * 로그인 타입 (전화번호 또는 이메일)
 */
export type LoginType = 'phone' | 'email';

/**
 * 로그인 폼 데이터 타입
 */
export interface LoginFormData {
  loginType: LoginType;  // 로그인 타입 (전화번호 또는 이메일)
  phoneNumber: string;
  email: string;
  password: string;
}

/**
 * 로그인 폼 에러 타입
 */
export interface LoginFormErrors {
  phoneNumber?: string;
  email?: string;
  password?: string;
  general?: string;  // 서버 오류 메시지
}

/**
 * 로그인 폼 Props 타입
 */
export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  error?: string;
}

/**
 * 로그인 폼 터치 상태 타입
 */
export interface LoginFormTouched {
  phoneNumber: boolean;
  email: boolean;
  password: boolean;
}
