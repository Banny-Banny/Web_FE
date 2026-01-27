/**
 * @fileoverview TimeOptionSelector 컴포넌트 타입 정의
 * @description 개봉일 선택 옵션 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * 타임 옵션 정보
 */
export interface TimeOptionInfo {
  /** 옵션 값 */
  value: '1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM';
  /** 표시 라벨 */
  label: string;
  /** 가격 (원) */
  price: number;
}

/**
 * TimeOptionSelector 컴포넌트 Props
 */
export interface TimeOptionSelectorProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** React Hook Form의 setValue 함수 */
  setValue: UseFormSetValue<TimecapsuleFormData>;
  /** React Hook Form의 watch 함수 */
  watch: UseFormWatch<TimecapsuleFormData>;
}
