'use client';

/**
 * @fileoverview DualButton 컴포넌트
 * @description 듀얼 버튼 컴포넌트 (취소 + 확인)
 * 
 * @description
 * - 2개의 Button 컴포넌트를 가로로 배치
 * - 왼쪽: 기본 outline variant (커스터마이징 가능)
 * - 오른쪽: 기본 primary variant (커스터마이징 가능)
 * - 동일한 크기 (L/M/S)
 * - 버튼 간격: 12px
 * - 용도: 바텀시트_버튼, 모달_버튼
 */

import React from 'react';
import { Button } from '../button';
import styles from './styles.module.css';
import type { DualButtonProps } from './types';

/**
 * DualButton 컴포넌트
 * 
 * 취소와 확인 버튼을 나란히 배치한 듀얼 버튼 컴포넌트입니다.
 * 주로 모달이나 바텀시트의 하단 버튼 영역에 사용됩니다.
 * 
 * @param {DualButtonProps} props - DualButton 컴포넌트의 props
 * @param {string} props.cancelLabel - 취소 버튼 텍스트 (필수)
 * @param {string} props.confirmLabel - 확인 버튼 텍스트 (필수)
 * @param {ButtonSize} [props.size='L'] - 버튼 크기 ('L' | 'M' | 'S')
 * @param {ButtonVariant} [props.cancelVariant='outline'] - 취소 버튼 variant
 * @param {ButtonVariant} [props.confirmVariant='primary'] - 확인 버튼 variant
 * @param {boolean} [props.fullWidth=true] - 전체 너비 사용 여부
 * @param {string | number} [props.width] - 커스텀 너비
 * @param {boolean} [props.confirmDisabled=false] - 확인 버튼 비활성화 여부
 * @param {() => void} [props.onCancelPress] - 취소 버튼 클릭 핸들러
 * @param {() => void} [props.onConfirmPress] - 확인 버튼 클릭 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * // 기본 사용 (모달/바텀시트)
 * <DualButton
 *   cancelLabel="취소"
 *   confirmLabel="확인"
 *   size="L"
 *   onCancelPress={() => closeModal()}
 *   onConfirmPress={() => handleConfirm()}
 * />
 * 
 * // 삭제 확인 모달
 * <DualButton
 *   cancelLabel="취소"
 *   confirmLabel="삭제"
 *   size="L"
 *   cancelVariant="outline"
 *   confirmVariant="danger"
 *   onCancelPress={handleCancel}
 *   onConfirmPress={handleDelete}
 * />
 * 
 * // 확인 버튼 비활성화
 * <DualButton
 *   cancelLabel="취소"
 *   confirmLabel="제출"
 *   size="L"
 *   confirmDisabled={!isValid}
 *   onCancelPress={handleCancel}
 *   onConfirmPress={handleSubmit}
 * />
 * ```
 */
export const DualButton = React.memo(function DualButton({
  cancelLabel,
  confirmLabel,
  size = 'L',
  cancelVariant = 'outline',
  confirmVariant = 'primary',
  fullWidth = true,
  width,
  confirmDisabled = false,
  onCancelPress,
  onConfirmPress,
  className = '',
}: DualButtonProps) {
  // width 우선순위: width prop > fullWidth
  const containerWidth = width !== undefined 
    ? typeof width === 'number' 
      ? { width: `${width}px` }
      : { width }
    : fullWidth 
      ? { width: '100%' }
      : {};

  const containerClasses = [styles.container, className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={containerWidth} role="group" aria-label="이중 버튼">
      {/* 취소 버튼 (왼쪽) - 항상 활성화 */}
      <Button
        label={cancelLabel}
        variant={cancelVariant}
        size={size}
        disabled={false}
        onPress={onCancelPress}
        fullWidth={true}
        className={styles.button}
        aria-label={`${cancelLabel} 버튼`}
      />

      {/* 확인 버튼 (오른쪽) */}
      {/* Note: disabled={true}일 때 Button 컴포넌트가 자동으로 variant를 'disabled'로 변경합니다 */}
      <Button
        label={confirmLabel}
        variant={confirmVariant}
        size={size}
        disabled={confirmDisabled}
        onPress={onConfirmPress}
        fullWidth={true}
        className={styles.button}
        aria-label={`${confirmLabel} 버튼`}
      />
    </div>
  );
});

export default DualButton;
