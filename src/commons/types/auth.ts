/**
 * 사용자 정보 타입
 */
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 인증 상태 타입
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 로그인 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

/**
 * 인증 액션 타입
 */
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * 인증 컨텍스트 타입
 */
export interface AuthContextType extends AuthState, AuthActions {}

/**
 * 토큰 정보 타입
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}