/**
 * 회원가입 컴포넌트 타입 정의
 */

/**
 * 회원가입 폼 데이터 타입
 */
export interface SignupFormData {
  name: string;  // 이름 (닉네임 대신 사용)
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImg?: string;
  agreeToTerms: boolean;  // 필수 약관 동의
}

/**
 * 회원가입 폼 에러 타입
 */
export interface SignupFormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;  // 서버 오류 메시지
}

/**
 * 회원가입 폼 Props 타입
 */
export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading: boolean;
  error?: string;
}
