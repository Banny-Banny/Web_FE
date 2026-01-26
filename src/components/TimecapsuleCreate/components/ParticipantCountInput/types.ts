/**
 * @fileoverview ParticipantCountInput 컴포넌트 타입 정의
 * @description 참여 인원 수 입력 필드 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * ParticipantCountInput 컴포넌트 Props
 */
export interface ParticipantCountInputProps {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
}
