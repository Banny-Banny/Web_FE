/**
 * commons/constants/typography.ts
 * 전역 Typography 스타일 정의
 *
 * @description
 * - Figma 디자인 시스템의 Typography 스타일을 CSS 스타일로 정의
 * - Header, Body, Caption 카테고리별로 관리
 * - 모든 텍스트 스타일은 이 파일에서 단일 소스로 관리
 * - Pretendard Variable 폰트 사용
 *
 * @example
 * ```typescript
 * import { Typography } from '@/commons/styles';
 *
 * <h1 style={Typography.header.h1}>제목 텍스트</h1>
 * <p style={Typography.body.body1}>본문 텍스트</p>
 * <span style={Typography.caption.caption1}>캡션 텍스트</span>
 * ```
 */

import { CSSProperties } from 'react';
import { FontFamily, FontWeight } from './fonts';

// Typography 스타일 정의
// Figma 디자인 시스템과 1:1 매칭
export const Typography = {
  // Header 스타일
  // - h1: 헤더바 메뉴 이름
  // - h2: 일반 헤더
  // - h3: 서브 헤더
  // - h4: 탭
  // - h5: 대형 헤더
  header: {
    h1: {
      fontFamily: FontFamily.variable,
      fontSize: '24px',
      lineHeight: '24px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    h2: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    h3: {
      fontFamily: FontFamily.variable,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: FontWeight.medium,
      letterSpacing: '-0.150390625px',
    } as CSSProperties,
    h4: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.semibold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    h5: {
      fontFamily: FontFamily.variable,
      fontSize: '30px',
      lineHeight: '36px',
      fontWeight: FontWeight.extrabold,
      letterSpacing: '0.3955078125px',
    } as CSSProperties,
  },

  // Body 스타일
  // - body1: 기본 본문 (Bold)
  // - body2: 플레이스홀더 (Bold, lineHeight: auto)
  // - body3: 작은 본문 (Bold)
  // - body4: 기본 본문 (Regular)
  // - body5: 작은 본문 (Bold)
  // - body6: 중간 본문 (Regular)
  // - body7: 작은 본문 (Regular)
  // - body8: 작은 본문 (SemiBold)
  // - body9: 작은 본문 (Medium)
  // - body10: 작은 본문 (Bold, lineHeight: 18px)
  // - body11: body 타이틀 (SemiBold)
  body: {
    body1: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    body2: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
      // lineHeight: auto (명시하지 않음)
    } as CSSProperties,
    body3: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: FontWeight.bold,
      letterSpacing: '0',
    } as CSSProperties,
    body4: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.regular,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    body5: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: FontWeight.bold,
      letterSpacing: '0',
    } as CSSProperties,
    body6: {
      fontFamily: FontFamily.variable,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: FontWeight.regular,
      letterSpacing: '-0.150390625px',
    } as CSSProperties,
    body7: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: FontWeight.regular,
      letterSpacing: '0',
    } as CSSProperties,
    body8: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: FontWeight.semibold,
      letterSpacing: '0',
    } as CSSProperties,
    body9: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: FontWeight.medium,
      letterSpacing: '0',
    } as CSSProperties,
    body10: {
      fontFamily: FontFamily.variable,
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: FontWeight.bold,
      letterSpacing: '0',
    } as CSSProperties,
    body11: {
      fontFamily: FontFamily.variable,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: FontWeight.semibold,
      letterSpacing: '-0.150390625px',
    } as CSSProperties,
  },

  // Caption 스타일
  // - caption1: 각 가격 표시전
  // - caption2: 단위
  // - button: 버튼 글씨
  // - sectionTitle: 섹션 타이틀
  caption: {
    caption1: {
      fontFamily: FontFamily.variable,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.150390625px',
    } as CSSProperties,
    caption2: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
    button: {
      fontFamily: FontFamily.variable,
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.43950000405311584px',
    } as CSSProperties,
    sectionTitle: {
      fontFamily: FontFamily.variable,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: FontWeight.bold,
      letterSpacing: '-0.3125px',
    } as CSSProperties,
  },
} as const;

/**
 * Typography 타입 정의
 */
export type TypographyKey =
  | `header.${keyof typeof Typography.header}`
  | `body.${keyof typeof Typography.body}`
  | `caption.${keyof typeof Typography.caption}`;

/**
 * Typography 스타일을 가져오는 헬퍼 함수
 *
 * @example
 * ```typescript
 * import { getTypographyStyle } from '@/commons/styles';
 *
 * const style = getTypographyStyle('header.h1');
 * ```
 */
export function getTypographyStyle(key: TypographyKey): CSSProperties {
  const [category, style] = key.split('.') as [keyof typeof Typography, string];
  return Typography[category][style as never] as CSSProperties;
}
