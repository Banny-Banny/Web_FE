/**
 * @fileoverview OpenDatePicker 컴포넌트 타입 정의
 * @description 오픈 예정일 선택 필드 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * OpenDatePicker 컴포넌트 Props
 */
export interface OpenDatePickerProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** React Hook Form의 setValue 함수 */
  setValue: UseFormSetValue<TimecapsuleFormData>;
}
