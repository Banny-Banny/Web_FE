/**
 * commons/constants/color.ts
 * 디자인 시스템 색상 토큰 정의
 *
 * @description
 * - Figma 디자인 시스템과 연동된 색상 팔레트
 * - tailwind.config.js에서 require로 불러와서 사용
 * - 모든 색상은 이 파일에서 단일 소스로 관리
 *
 * @example
 * ```typescript
 * import { Colors } from '@/commons/styles';
 * // 또는
 * const { Colors } = require('./commons/styles/color');
 * ```
 */
export const Colors = {
  // White 팔레트 (Figma에서 업데이트)
  white: {
    50: '#FFFFFF', // Light
    100: '#FDFDFD', // Light
    200: '#FDFDFD', // Light
    300: '#FCFCFC', // Light
    400: '#FBFBFB', // Light
    500: '#FAFAFA', // Normal
    600: '#E4E4E4', // Normal Hover
    700: '#B2B2B2', // Normal Active
    800: '#8A8A8A', // Dark
    900: '#696969', // Dark Hover
    950: '#696969', // Dark Active
    darker: '#696969', // Darker
  },
  // White Grey 팔레트 (Figma에서 추가)
  whiteGrey: {
    50: '#FCFCFC', // Light
    100: '#F7F7F7', // Light Hover
    200: '#F3F3F3', // Light Active
    300: '#EDEDED', // Light
    400: '#E9E9E9', // Light
    500: '#E4E4E4', // Normal
    600: '#CFCFCF', // Normal Hover
    700: '#A2A2A2', // Normal Active
    800: '#7D7D7D', // Dark
    900: '#606060', // Dark Hover
    950: '#606060', // Dark Active
    darker: '#606060', // Darker
  },
  // Grey 팔레트 (Figma에서 추가)
  grey: {
    50: '#F7F7F7', // Light
    100: '#E7E7E7', // Light Hover
    200: '#DCDCDC', // Light Active
    300: '#CBCBCB', // Light
    400: '#C1C1C1', // Light
    500: '#B2B2B2', // Normal
    600: '#A2A2A2', // Normal Hover
    700: '#7E7E7E', // Normal Active
    800: '#626262', // Dark
    900: '#4B4B4B', // Dark Hover
    950: '#4B4B4B', // Dark Active
    darker: '#4B4B4B', // Darker
  },
  // Dark Grey 팔레트 (Figma에서 추가)
  darkGrey: {
    50: '#F0F0F0', // Light
    100: '#D1D1D1', // Light Hover
    200: '#BABABA', // Light Active
    300: '#9B9B9B', // Light
    400: '#878787', // Light
    500: '#696969', // Normal
    600: '#606060', // Normal Hover
    700: '#4B4B4B', // Normal Active
    800: '#3A3A3A', // Dark
    900: '#2C2C2C', // Dark Hover
    950: '#2C2C2C', // Dark Active
    darker: '#2C2C2C', // Darker
  },
  // Light Black 팔레트 (Figma에서 추가)
  lightBlack: {
    50: '#EBEBEB', // Light
    100: '#C2C2C2', // Light Hover
    200: '#A4A4A4', // Light Active
    300: '#7B7B7B', // Light
    400: '#616161', // Light
    500: '#3A3A3A', // Normal
    600: '#353535', // Normal Hover
    700: '#292929', // Normal Active
    800: '#202020', // Dark
    900: '#181818', // Dark Hover
    950: '#181818', // Dark Active
    darker: '#181818', // Darker
  },
  // Black 팔레트 (Figma에서 업데이트)
  black: {
    50: '#E7E7E7', // Light
    100: '#B3B3B3', // Light Hover
    200: '#8E8E8E', // Light Active
    300: '#5B5B5B', // Light
    400: '#3B3B3B', // Light
    500: '#0A0A0A', // Normal
    600: '#090909', // Normal Hover
    700: '#070707', // Normal Active
    800: '#060606', // Dark
    900: '#040404', // Dark Hover
    950: '#040404', // Dark Active
    darker: '#040404', // Darker
  },
  // Red 팔레트 (Figma에서 업데이트 - 포인트 색상)
  red: {
    50: '#FFEEEF', // Light
    100: '#FFE5E6', // Light Hover
    200: '#FFC9CC', // Light Active
    500: '#FF515A', // Normal
    600: '#E64951', // Normal Hover
    700: '#CC4148', // Normal Active
    800: '#BF3D44', // Dark
    900: '#993136', // Dark Hover
    950: '#732428', // Dark Active
    darker: '#591C1F', // Darker
  },
  // Green 팔레트 (Figma에서 업데이트 - 포인트 색상)
  green: {
    50: '#E6F6EC', // Light
    100: '#D9F2E2', // Light Hover
    200: '#B1E3C3', // Light Active
    500: '#02A63E', // Normal
    600: '#029538', // Normal Hover
    700: '#028532', // Normal Active
    800: '#027D2F', // Dark
    900: '#016425', // Dark Hover
    950: '#014B1C', // Dark Active
    darker: '#013A16', // Darker
  },
  // Blue 팔레트 (Figma에서 업데이트 - 포인트 색상)
  blue: {
    50: '#E9EEFB', // Light
    100: '#DDE6FA', // Light Hover
    200: '#BACCF4', // Light Active
    500: '#1F59DB', // Normal
    600: '#1C50C5', // Normal Hover
    700: '#1947AF', // Normal Active
    800: '#1743A4', // Dark
    900: '#133583', // Dark Hover
    950: '#0E2863', // Dark Active
    darker: '#0B1F4D', // Darker
  },
  // Yellow 팔레트 (진행중 상태 표시용)
  yellow: {
    50: '#FFF9E6', // Light
    100: '#FFF4D9', // Light Hover
    200: '#FFE9B3', // Light Active
    500: '#FFC107', // Normal
    600: '#E6AE06', // Normal Hover
    700: '#CC9B05', // Normal Active
    800: '#BF9205', // Dark
    900: '#997504', // Dark Hover
    950: '#735803', // Dark Active
    darker: '#594602', // Darker
  },
  // Border colors with opacity (Figma 디자인 시스템)
  border: {
    light: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08) - 일반 테두리
    lighter: 'rgba(10, 10, 10, 0.06)', // Figma: rgba(10,10,10,0.06) - 더 연한 테두리
  },
} as const;

export type ColorPalette = typeof Colors;
export type ColorKey = keyof typeof Colors;

/**
 * Colors 객체를 CSS Variables 문자열로 변환하는 함수
 * @returns CSS Variables 문자열 (예: "--color-white-500: #FAFAFA;")
 */
export function generateColorCSSVariables(): string {
  const variables: string[] = [];

  Object.entries(Colors).forEach(([colorName, colorPalette]) => {
    if (typeof colorPalette === 'object' && colorPalette !== null) {
      Object.entries(colorPalette).forEach(([shade, value]) => {
        // colorName을 kebab-case로 변환 (whiteGrey -> white-grey)
        const kebabColorName = colorName.replace(/([A-Z])/g, '-$1').toLowerCase();
        const variableName = `--color-${kebabColorName}-${shade}`;
        variables.push(`  ${variableName}: ${value};`);
      });
    }
  });

  return variables.join('\n');
}
