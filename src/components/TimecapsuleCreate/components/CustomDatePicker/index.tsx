'use client';

/**
 * @fileoverview CustomDatePicker 컴포넌트
 * @description 커스텀 날짜 선택 모달 컴포넌트 (직접 선택 옵션 클릭 시 표시)
 */

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { CustomDatePickerProps } from './types';
import styles from './styles.module.css';

/**
 * CustomDatePicker 컴포넌트
 *
 * 직접 선택 옵션 클릭 시 달력 모달을 표시합니다.
 * timeOption이 'CUSTOM'일 때만 표시됩니다.
 * 미래 날짜만 선택 가능하도록 제한됩니다.
 *
 * @param {CustomDatePickerProps} props - CustomDatePicker 컴포넌트의 props
 */
export function CustomDatePicker({}: Omit<CustomDatePickerProps, 'register' | 'errors' | 'setValue' | 'watch'>) {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = errors.customOpenDate;
  const timeOption = watch('timeOption');
  const customOpenDate = watch('customOpenDate');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [lastTimeOptionChange, setLastTimeOptionChange] = useState<number>(0);

  // 직접 선택 클릭 시 항상 모달 오픈
  useEffect(() => {
    if (timeOption === 'CUSTOM') {
      // 이미 선택한 날짜가 있으면 그 날짜로 초기화
      if (customOpenDate) {
        setTempDate(new Date(customOpenDate));
      }
      setIsModalOpen(true);
      setLastTimeOptionChange(Date.now());
    } else {
      setIsModalOpen(false);
      if (customOpenDate) {
        setValue('customOpenDate', undefined, { shouldValidate: false });
      }
    }
  }, [timeOption]);

  // 오늘 이후 날짜만 선택 가능
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  // 모달 닫기
  const handleClose = () => {
    setIsModalOpen(false);
    setTempDate(null);
  };

  // 날짜 선택
  const handleDateChange = (value: Date | null) => {
    if (value) {
      setTempDate(value);
    }
  };

  // 날짜 선택 완료
  const handleConfirm = () => {
    if (tempDate) {
      const formattedDate = tempDate.toISOString().split('T')[0];
      setValue('customOpenDate', formattedDate, { shouldValidate: true });
      setIsModalOpen(false);
      setTempDate(null);
    }
  };

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // CUSTOM 옵션이 아닐 때는 표시하지 않음
  if (timeOption !== 'CUSTOM') {
    return null;
  }

  return (
    <>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
          <div className={styles.modalContainer}>
            {/* 모달 헤더 */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>개봉일 선택</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="닫기"
              >
                닫기
              </button>
            </div>

            {/* 달력 */}
            <div className={styles.calendarContainer}>
              <Calendar
                onChange={(value) => handleDateChange(value as Date)}
                value={tempDate}
                minDate={minDate}
                locale="ko-KR"
                className={styles.customCalendar}
                formatDay={(locale, date) => date.getDate().toString()}
              />
            </div>

            {/* 확인 버튼 */}
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={!tempDate}
              aria-label="선택 완료"
            >
              선택 완료
            </button>
          </div>
        </div>
      )}
      {error && (
        <span
          id="customOpenDate-error"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </span>
      )}
    </>
  );
}
