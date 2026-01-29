/**
 * 자체 로그인 API 타입 정의
 */

import type { User } from '@/commons/types/auth';

/**
 * 자체 로그인 요청 타입
 */
export interface LocalLoginRequest {
  phoneNumber?: string;  // 전화번호 (선택)
  email?: string;         // 이메일 (선택)
  password: string;      // 비밀번호 (필수)
}

/**
 * 자체 로그인 응답 타입
 */
export interface LocalLoginResponse {
  accessToken: string;    // JWT 액세스 토큰
  refreshToken?: string; // 리프레시 토큰 (선택)
  user?: User;           // 사용자 정보 (선택)
}

/**
 * 자체 회원가입 요청 타입
 */
export interface LocalSignupRequest {
  nickname: string;       // 닉네임 (필수)
  phoneNumber: string;   // 전화번호 (필수)
  email: string;          // 이메일 (필수)
  password: string;      // 비밀번호 (필수)
  profileImg?: string;   // 프로필 이미지 URL (선택)
}

/**
 * 자체 회원가입 응답 타입
 */
export interface LocalSignupResponse {
  accessToken: string;    // JWT 액세스 토큰
  refreshToken?: string; // 리프레시 토큰 (선택)
  user?: User;           // 사용자 정보 (선택)
}

/**
 * 로그인 에러 응답 타입
 */
export interface LoginErrorResponse {
  message: string;        // 오류 메시지
  status: number;         // HTTP 상태 코드
  code?: string;         // 오류 코드 (선택)
}

/**
 * 토큰 검증 응답 타입
 */
export interface VerifyResponse {
  valid: boolean;         // 토큰 유효성 여부
  userId?: string;        // 사용자 ID (토큰이 유효한 경우)
  user?: User;            // 사용자 정보 (토큰이 유효한 경우) - 선택적
  expiresAt?: string;    // 토큰 만료 시간 (선택)
}

/**
 * 내 정보 조회 시 반환되는 활동 요약 타입 (GET /api/auth/me data.summary)
 */
export interface MeSummary {
  timeCapsuleCount: number;   // 타임캡슐 수
  easterEggCount: number;     // 이스터에그 수
  friendCount: number;        // 친구 수
}

/**
 * 내 프로필 조회 응답 타입
 */
export interface MeResponse {
  id?: string;                   // 사용자 ID (선택)
  nickname: string;             // 닉네임
  name: string;                  // 이름
  email: string;                // 이메일
  phoneNumber?: string;         // 전화번호 (선택)
  profileImg?: string | null;    // 프로필 이미지 URL (선택)
  profileImageUrl?: string | null; // 프로필 이미지 URL - API 문서 필드명 (선택)
  isPushAgreed?: boolean;        // 푸시 알림 동의 여부 (선택)
  isMarketingAgreed?: boolean;  // 마케팅 동의 여부 (선택)
  eggSlots?: number;            // 이스터에그 슬롯 수 (선택)
  createdAt?: string;           // 생성일시 (선택)
  /** 활동 통계 요약 (타임캡슐/이스터에그/친구 수) */
  summary?: MeSummary;
}
