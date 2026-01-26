/**
 * @fileoverview QuantitySelector 컴포넌트 타입 정의
 * @description 수량 선택 컴포넌트의 Props 타입
 */

import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';

/**
 * QuantitySelector 컴포넌트 Props
 */
export interface QuantitySelectorProps {
  /** 필드 이름 */
  fieldName: 'participantCount' | 'photoCount';
  /** 라벨 텍스트 */
  label: string;
  /** 서브 라벨 텍스트 */
  subLabel?: string;
  /** 단위 가격 (원) */
  unitPrice?: number;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<TimecapsuleFormData>;
  /** React Hook Form의 에러 객체 */
  errors: FieldErrors<TimecapsuleFormData>;
  /** React Hook Form의 setValue 함수 */
  setValue: UseFormSetValue<TimecapsuleFormData>;
  /** React Hook Form의 watch 함수 */
  watch: UseFormWatch<TimecapsuleFormData>;
}
