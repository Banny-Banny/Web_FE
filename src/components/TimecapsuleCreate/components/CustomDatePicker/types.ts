/**
 * @fileoverview CustomDatePicker 컴포넌트 타입 정의
 * @description 커스텀 날짜 선택 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * CustomDatePicker 컴포넌트 Props
 */
export interface CustomDatePickerProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** React Hook Form의 setValue 함수 */
  setValue: UseFormSetValue<TimecapsuleFormData>;
  /** React Hook Form의 watch 함수 */
  watch: UseFormWatch<TimecapsuleFormData>;
}
