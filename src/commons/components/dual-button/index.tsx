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
 * @example
 * ```tsx
 * <DualButton
 *   cancelLabel="취소"
 *   confirmLabel="확인"
 *   size="L"
 *   onCancelPress={handleCancel}
 *   onConfirmPress={handleConfirm}
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
