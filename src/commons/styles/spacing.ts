/**
 * @fileoverview 간격 디자인 토큰
 * @description 마진, 패딩, 갭 등에 사용되는 간격 토큰
 */

export const Spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',     // 32px
  '3xl': '3rem',     // 48px
  '4xl': '4rem',     // 64px
} as const;

/**
 * CSS 변수를 사용하는 간격 토큰
 */
export const CSSSpacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
  '4xl': 'var(--spacing-4xl)',
} as const;

/**
 * Border Radius 토큰
 */
export const BorderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.25rem',  // 20px
  full: '9999px',
} as const;

/**
 * CSS 변수를 사용하는 Border Radius 토큰
 */
export const CSSBorderRadius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const;

export type SpacingScale = typeof Spacing;
export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusScale = typeof BorderRadius;
export type BorderRadiusKey = keyof typeof BorderRadius;

/**
 * Spacing과 BorderRadius를 CSS Variables 문자열로 변환하는 함수
 * @returns CSS Variables 문자열
 */
export function generateSpacingCSSVariables(): string {
  const variables: string[] = [];

  // Spacing variables
  Object.entries(Spacing).forEach(([key, value]) => {
    variables.push(`  --spacing-${key}: ${value};`);
  });

  // BorderRadius variables
  Object.entries(BorderRadius).forEach(([key, value]) => {
    variables.push(`  --radius-${key}: ${value};`);
  });

  return variables.join('\n');
}
