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

/**
 * Font Size 토큰
 */
export const FontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
} as const;

/**
 * Line Height 토큰
 */
export const LineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

export type FontFamilyKey = keyof typeof FontFamily;
export type FontWeightKey = keyof typeof FontWeight;
export type FontSizeKey = keyof typeof FontSize;
export type LineHeightKey = keyof typeof LineHeight;

/**
 * FontWeight, FontSize, LineHeight를 CSS Variables 문자열로 변환하는 함수
 * @returns CSS Variables 문자열
 */
export function generateTypographyCSSVariables(): string {
  const variables: string[] = [];

  // FontSize variables
  Object.entries(FontSize).forEach(([key, value]) => {
    variables.push(`  --font-size-${key}: ${value};`);
  });

  // FontWeight variables
  Object.entries(FontWeight).forEach(([key, value]) => {
    variables.push(`  --font-weight-${key}: ${value};`);
  });

  // LineHeight variables
  Object.entries(LineHeight).forEach(([key, value]) => {
    variables.push(`  --line-height-${key}: ${value};`);
  });

  return variables.join('\n');
}
