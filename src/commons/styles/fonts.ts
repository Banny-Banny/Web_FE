/**
 * @fileoverview 폰트 패밀리 및 폰트 웨이트 상수
 * @description 프로젝트에서 사용하는 폰트 관련 정의
 */

export const FontFamily = {
  variable: 'var(--font-pretendard), -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
  dungGeunMo: 'var(--font-dunggeunmo), monospace',
  thinDungGeunMo: 'var(--font-thin-dunggeunmo), monospace',
} as const;

export const FontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export type FontFamilyKey = keyof typeof FontFamily;
export type FontWeightKey = keyof typeof FontWeight;
