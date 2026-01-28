/**
 * 임시 백엔드 콜백 처리
 * 백엔드가 /api/auth/kakao/callback로 리다이렉트하는 경우를 처리합니다.
 * 백엔드 수정 후 이 파일은 제거 예정입니다.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * 임시 백엔드 콜백 라우트 핸들러
 * 백엔드에서 /api/auth/kakao/callback로 리다이렉트한 경우,
 * 프론트엔드 콜백 라우트(/auth/callback)로 재리다이렉트합니다.
 */
export async function GET(request: NextRequest) {
  try {
    // URL에서 token 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    // 프론트엔드 콜백 라우트로 재리다이렉트
    const callbackUrl = new URL('/auth/callback', request.url);
    
    // token이 있으면 파라미터로 전달
    if (token) {
      callbackUrl.searchParams.set('token', token);
    }

    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error('임시 백엔드 콜백 처리 실패:', error);
    
    // 에러 발생 시 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}
