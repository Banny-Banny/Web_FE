/**
 * @fileoverview CapsuleNameInput 컴포넌트 타입 정의
 * @description 캡슐 이름 입력 필드 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * CapsuleNameInput 컴포넌트 Props
 */
export interface CapsuleNameInputProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** 최대 글자 수 제한 (선택적) */
  maxLength?: number;
  /** 실시간 글자 수 표시 여부 (선택적) */
  showCharCount?: boolean;
}
