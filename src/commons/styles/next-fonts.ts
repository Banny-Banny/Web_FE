/**
 * @fileoverview Next.js 폰트 설정
 * @description Next.js localFont를 사용한 폰트 정의
 */

import localFont from 'next/font/local';

/**
 * Pretendard Variable Font
 * - 가변 폰트로 모든 weight를 하나의 파일로 제공
 * - 최적의 성능을 위해 Variable 폰트 우선 사용
 */
export const pretendard = localFont({
  src: '../../assets/fonts/PretendardVariable.ttf',
  variable: '--font-pretendard',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'sans-serif',
  ],
});

/**
 * Pretendard Static Fonts
 * - Variable 폰트를 지원하지 않는 환경을 위한 폴백
 * - 필요한 weight만 선택적으로 로드
 */
export const pretendardStatic = localFont({
  src: [
    {
      path: '../../assets/fonts/Pretendard-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Pretendard-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard-static',
  display: 'swap',
  preload: false,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'sans-serif',
  ],
});

/**
 * DungGeunMo Font
 * - 픽셀 스타일 폰트
 * - 특수한 UI 요소에 사용
 */
export const dungGeunMo = localFont({
  src: '../../assets/fonts/DungGeunMo.ttf',
  variable: '--font-dunggeunmo',
  display: 'swap',
  preload: false,
  fallback: ['monospace'],
});

/**
 * Thin DungGeunMo Font
 * - 얇은 픽셀 스타일 폰트
 */
export const thinDungGeunMo = localFont({
  src: '../../assets/fonts/ThinDungGeunMo.ttf',
  variable: '--font-thin-dunggeunmo',
  display: 'swap',
  preload: false,
  fallback: ['monospace'],
});
