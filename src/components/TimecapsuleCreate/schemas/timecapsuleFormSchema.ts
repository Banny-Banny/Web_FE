/**
 * @fileoverview 타임캡슐 생성 폼 유효성 검사 스키마
 * @description Zod를 사용한 폼 유효성 검사 스키마 정의
 */

import { z } from 'zod';

/**
 * 타임캡슐 생성 폼 유효성 검사 스키마
 * 
 * @description
 * - 캡슐 이름: 필수, 최대 50자
 * - 타임 옵션: 필수 (1_WEEK, 1_MONTH, 1_YEAR, CUSTOM)
 * - 커스텀 오픈일: CUSTOM일 때만 필수, 미래 날짜
 * - 참여 인원 수: 필수, 1~10 범위의 정수
 * - 이미지 슬롯 수: 선택적, 0 이상, 최대 5개
 * - 음악 추가: 선택적
 * - 영상 추가: 선택적
 */
export const timecapsuleFormSchema = z.object({
  /** 캡슐 이름: 필수, 최대 50자 */
  capsuleName: z
    .string()
    .min(1, '캡슐 이름을 입력해주세요')
    .max(50, '캡슐 이름은 50자 이하여야 합니다')
    .trim(),

  /** 타임 옵션: 필수 */
  timeOption: z.enum(['1_WEEK', '1_MONTH', '1_YEAR', 'CUSTOM']),

  /** 커스텀 오픈일: CUSTOM일 때만 필수, 미래 날짜 */
  customOpenDate: z.string().optional(),

  /** 참여 인원 수: 필수, 1~10 범위의 정수 */
  participantCount: z
    .number('참여 인원 수는 숫자여야 합니다')
    .int('참여 인원 수는 정수여야 합니다')
    .min(1, '참여 인원 수는 1명 이상이어야 합니다')
    .max(10, '참여 인원 수는 10명 이하여야 합니다')
    .positive('참여 인원 수는 양수여야 합니다'),

  /** 이미지 슬롯 수: 선택적, 0 이상, 최대 5개 */
  photoCount: z
    .number('이미지 슬롯 수는 숫자여야 합니다')
    .int('이미지 슬롯 수는 정수여야 합니다')
    .min(0, '이미지 슬롯 수는 0 이상이어야 합니다')
    .optional(),

  /** 음악 추가 여부 */
  addMusic: z.boolean().optional(),

  /** 영상 추가 여부 */
  addVideo: z.boolean().optional(),
});

/**
 * 스키마 레벨 유효성 검사 (커스텀 오픈일 제약)
 */
export const timecapsuleFormSchemaWithRefinements = timecapsuleFormSchema
  .superRefine((data, ctx) => {
    // CUSTOM 옵션인 경우 customOpenDate 필수
    if (data.timeOption === 'CUSTOM' && !data.customOpenDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '커스텀 오픈일을 선택해주세요',
        path: ['customOpenDate'],
      });
    }

    // CUSTOM 옵션이고 customOpenDate가 있을 때 미래 날짜인지 확인
    if (data.timeOption === 'CUSTOM' && data.customOpenDate) {
      const selectedDate = new Date(data.customOpenDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '커스텀 오픈일은 오늘 이후의 날짜여야 합니다',
          path: ['customOpenDate'],
        });
      }
    }
  });

/**
 * 타임캡슐 폼 데이터 타입 (Zod 스키마에서 추론)
 */
export type TimecapsuleFormData = z.infer<typeof timecapsuleFormSchemaWithRefinements>;
