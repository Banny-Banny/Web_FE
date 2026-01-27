/**
 * @fileoverview 타임캡슐 생성 페이지 타입 정의
 * @description 타임캡슐 생성 폼 데이터 및 관련 타입 정의
 */

/**
 * 타임캡슐 생성 폼 데이터 타입
 * 
 * @description
 * 사용자가 입력하는 타임캡슐 기본 정보
 * 
 * @note
 * 실제 타입은 schemas/timecapsuleFormSchema.ts에서 z.infer로 추론됩니다.
 * 이 파일에서는 다른 타입만 정의합니다.
 */
export type { TimecapsuleFormData } from './schemas/timecapsuleFormSchema';

/**
 * 폼 필드 에러 메시지 타입
 */
export interface FormFieldErrors {
  capsuleName?: string;
  openDate?: string;
  participantCount?: string;
  theme?: string;
}

/**
 * 결제 페이지로 전달할 데이터 타입
 * 
 * @description
 * 타임캡슐 생성 폼에서 입력한 데이터를 결제 페이지로 전달하기 위한 타입
 */
export interface PaymentPageData {
  /** 캡슐 이름 */
  capsuleName: string;
  /** 오픈 예정일 (YYYY-MM-DD 형식) */
  openDate: string;
  /** 참여 인원 수 */
  participantCount: number;
  /** 캡슐 테마/디자인 ID */
  theme: string;
}
