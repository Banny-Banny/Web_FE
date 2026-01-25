'use client';

/**
 * @fileoverview Toast 컴포넌트
 * @description 토스트 메시지 컴포넌트
 *
 * @description
 * - 사용자에게 피드백을 제공하는 토스트 메시지 컴포넌트
 * - 자동 사라짐 기능 지원
 * - 타입별 스타일 지원 (success, error, info, warning)
 *
 * @example
 * ```typescript
 * <Toast
 *   message="저장되었습니다"
 *   visible={isVisible}
 *   onHide={() => setIsVisible(false)}
 *   type="success"
 *   duration={3000}
 * />
 * ```
 */

import React, { useEffect, useState } from 'react';
import { Typography } from '@/commons/styles';
import styles from './styles.module.css';
import type { ToastProps, ToastType } from './types';

/**
 * Toast 컴포넌트
 */
export function Toast({
  message,
  visible,
  onHide,
  duration = 3000,
  type = 'info',
  position = 'bottom',
  className = '',
}: ToastProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(visible);

  // visible이 변경될 때 렌더링 및 애니메이션 상태 업데이트
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 다음 틱에서 애니메이션 시작 (비동기)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 0);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [visible]);

  // 자동 사라짐 타이머
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        // 애니메이션 종료 후 컴포넌트 제거 및 onHide 호출
        const hideTimer = setTimeout(() => {
          setShouldRender(false);
          onHide();
        }, 300);

        return () => clearTimeout(hideTimer);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  // 애니메이션 종료 후 컴포넌트 제거
  useEffect(() => {
    if (!isAnimating && shouldRender && !visible) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, shouldRender, visible]);

  if (!shouldRender) {
    return null;
  }

  // 타입별 클래스명 매핑
  const typeClassMap: Record<ToastType | 'default', string> = {
    success: styles.typeSuccess,
    error: styles.typeError,
    info: styles.typeInfo,
    warning: styles.typeWarning,
    default: styles.typeDefault,
  };

  const typeClass = typeClassMap[type] || typeClassMap.default;

  return (
    <div
      className={`${styles.container} ${
        position === 'top' ? styles.containerTop : styles.containerBottom
      } ${className}`}
    >
      <div
        className={`${styles.toast} ${typeClass} ${
          isAnimating ? styles.animateEnter : styles.animateExit
        }`}
      >
        <p
          className={styles.message}
          style={Typography.body.body2}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default Toast;
