/**
 * 온보딩 API 타입 정의
 */

/**
 * 온보딩 완료 요청 타입
 */
export interface OnboardingCompleteRequest {
  friend_consent: boolean;    // 친구 연동 허용 동의 여부
  location_consent: boolean;   // 위치 권한 허용 동의 여부
}

/**
 * 온보딩 완료 응답 타입
 */
export interface OnboardingCompleteResponse {
  success: boolean;  // 온보딩 완료 성공 여부
}

/**
 * 온보딩 에러 응답 타입
 */
export interface OnboardingErrorResponse {
  message: string;   // 오류 메시지
  status: number;    // HTTP 상태 코드
  code?: string;     // 오류 코드 (선택)
}
