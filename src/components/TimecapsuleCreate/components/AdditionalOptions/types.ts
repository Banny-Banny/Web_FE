/**
 * @fileoverview AdditionalOptions 컴포넌트 타입 정의
 * @description 추가 옵션 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * 추가 옵션 정보
 */
export interface AdditionalOptionInfo {
  /** 필드 이름 */
  fieldName: 'addMusic' | 'addVideo';
  /** 라벨 텍스트 */
  label: string;
  /** 아이콘 이름 (선택적) */
  icon?: string;
  /** 추가 가격 (원) */
  price: number;
}

/**
 * AdditionalOptions 컴포넌트 Props
 */
export interface AdditionalOptionsProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** React Hook Form의 watch 함수 */
  watch: UseFormWatch<TimecapsuleFormData>;
}
