/**
 * @fileoverview useTimecapsuleForm 훅
 * @description React Hook Form + Zod를 활용한 타임캡슐 생성 폼 상태 관리 훅
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/commons/apis/orders';
import { TIME_CAPSULE_PRODUCT_ID } from '@/commons/apis/orders/constants';
import type { ApiError } from '@/commons/provider/api-provider/api-client';
import type { CreateOrderRequest, TimeOption } from '@/commons/apis/orders/types';
import { timecapsuleFormSchemaWithRefinements, type TimecapsuleFormData } from '../schemas/timecapsuleFormSchema';

/**
 * useTimecapsuleForm 훅
 * 
 * 타임캡슐 생성 폼의 상태 관리 및 제출 처리를 담당하는 훅입니다.
 * React Hook Form과 Zod를 통합하여 타입 안전한 폼 관리를 제공합니다.
 * 주문 생성 API를 호출하여 주문을 생성한 후 결제 페이지로 이동합니다.
 * 
 * @returns React Hook Form의 반환값과 제출 핸들러
 */
export function useTimecapsuleForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<TimecapsuleFormData>({
    resolver: zodResolver(timecapsuleFormSchemaWithRefinements),
    mode: 'onChange', // 실시간 검증
    defaultValues: {
      capsuleName: '',
      timeOption: '1_WEEK',
      customOpenDate: undefined,
      participantCount: 2,
      photoCount: 3,
      addMusic: false,
      addVideo: false,
    },
  });

  /**
   * 폼 데이터를 API 요청 형식으로 변환
   */
  const transformFormDataToApiRequest = (
    data: TimecapsuleFormData
  ): CreateOrderRequest => {
    let customOpenAt: string | undefined;

    // CUSTOM 옵션일 때만 custom_open_at 설정
    if (data.timeOption === 'CUSTOM' && data.customOpenDate) {
      customOpenAt = new Date(data.customOpenDate).toISOString();
    }

    return {
      product_id: TIME_CAPSULE_PRODUCT_ID,
      capsule_title: data.capsuleName || undefined,
      time_option: data.timeOption as TimeOption,
      custom_open_at: customOpenAt,
      headcount: data.participantCount,
      photo_count: data.photoCount || 0,
      add_music: data.addMusic || false,
      add_video: data.addVideo || false,
    };
  };

  /**
   * 주문 생성 Mutation
   */
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (response) => {
      // 주문 생성 성공 시 결제 페이지로 이동 (주문 ID 포함)
      const queryParams = new URLSearchParams({
        orderId: response.order_id,
      });
      router.push(`/payment?${queryParams.toString()}`);
      setApiError(null);
    },
    onError: (error: ApiError) => {
      // API 에러 처리
      setApiError(error.message || '주문 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('주문 생성 실패:', error);
    },
  });

  /**
   * 첫 번째 에러 필드로 스크롤하는 함수
   */
  const scrollToFirstError = () => {
    const firstErrorField = Object.keys(form.formState.errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  /**
   * 폼 제출 핸들러
   * 
   * 모든 검증을 통과하면 주문 생성 API를 호출합니다.
   * 검증 실패 시 첫 번째 에러 필드로 스크롤합니다.
   */
  const onSubmit = form.handleSubmit(
    async (data: TimecapsuleFormData) => {
      // API 에러 초기화
      setApiError(null);

      // 폼 데이터를 API 요청 형식으로 변환
      const apiRequest = transformFormDataToApiRequest(data);

      // 주문 생성 API 호출
      try {
        await createOrderMutation.mutateAsync(apiRequest);
      } catch {
        // 에러는 mutation의 onError에서 처리됨
        // 여기서는 추가 처리 없음
      }
    },
    () => {
      // 검증 실패 시 첫 번째 에러 필드로 스크롤
      scrollToFirstError();
    }
  );

  /**
   * 제출 버튼 클릭 핸들러
   * 
   * Button 컴포넌트의 onPress에 사용됩니다.
   */
  const handleSubmitClick = () => {
    form.handleSubmit(
      async (data: TimecapsuleFormData) => {
        setApiError(null);
        try {
          // 폼 데이터를 API 요청 형식으로 변환
          const apiRequest = transformFormDataToApiRequest(data);
          await createOrderMutation.mutateAsync(apiRequest);
        } catch {
          // 에러는 mutation의 onError에서 처리됨
        }
      },
      () => {
        scrollToFirstError();
      }
    )();
  };

  return {
    ...form,
    onSubmit,
    handleSubmitClick,
    scrollToFirstError,
    // API 관련 상태
    isSubmitting: createOrderMutation.isPending,
    apiError,
  };
}
