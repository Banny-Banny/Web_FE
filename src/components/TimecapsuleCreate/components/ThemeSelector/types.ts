/**
 * @fileoverview ThemeSelector 컴포넌트 타입 정의
 * @description 캡슐 테마/디자인 선택 필드 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * 테마 옵션 인터페이스
 */
export interface ThemeOption {
  /** 테마 ID */
  id: string;
  /** 테마 이름 */
  name: string;
  /** 테마 미리보기 이미지 URL (선택적) */
  image?: string;
  /** 테마 설명 (선택적) */
  description?: string;
}

/**
 * ThemeSelector 컴포넌트 Props
 */
export interface ThemeSelectorProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** 테마 옵션 배열 */
  themes: ThemeOption[];
}
