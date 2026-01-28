'use client';

/**
 * @fileoverview Modal 컴포넌트
 * @description 모달 컴포넌트
 *
 * @description
 * - Backdrop과 Modal Container로 구성
 * - children (ReactNode)를 통해 모든 내부 컨텐츠를 자유롭게 구성
 * - Figma 디자인 시스템 기준 스타일 적용
 *
 * @example
 * ```typescript
 * <Modal
 *   visible={isVisible}
 *   onClose={handleClose}
 *   width={300}
 *   closeOnBackdropPress={true}
 * >
 *   <div>
 *     <h2>모달 제목</h2>
 *     <p>모달 내용</p>
 *   </div>
 * </Modal>
 * ```
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';
import type { ModalProps } from './types';

/**
 * 기본 설정값
 */
const DEFAULT_CONFIG = {
  defaultWidth: 344,
  defaultHeight: 'auto' as const,
  defaultPadding: 0,
  closeOnBackdropPress: true,
} as const;

/**
 * Modal 컴포넌트
 */
export function Modal({
  visible,
  onClose,
  children,
  width = DEFAULT_CONFIG.defaultWidth,
  height = DEFAULT_CONFIG.defaultHeight,
  padding = DEFAULT_CONFIG.defaultPadding,
  closeOnBackdropPress = DEFAULT_CONFIG.closeOnBackdropPress,
  disableAnimation = false,
}: ModalProps) {
  const [isAnimating, setIsAnimating] = React.useState(visible);
  const [shouldRender, setShouldRender] = React.useState(visible);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // visible이 변경될 때 렌더링 및 애니메이션 상태 업데이트
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 이전 포커스 위치 저장
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      if (disableAnimation) {
        // 애니메이션이 비활성화된 경우 즉시 표시
        setIsAnimating(true);
      } else {
        // 다음 틱에서 애니메이션 시작
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const timer = setTimeout(() => {
          setIsAnimating(true);
        }, 0);

        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [visible, disableAnimation]);

  // 애니메이션 종료 후 컴포넌트 제거
  useEffect(() => {
    if (!isAnimating && shouldRender && !visible) {
      const delay = disableAnimation ? 0 : 100; // 애니메이션 비활성화 시 즉시 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
        // 포커스 복원
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, shouldRender, visible, disableAnimation]);

  // 포커스 트랩 구현
  useEffect(() => {
    if (!visible || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // 첫 번째 포커스 가능한 요소로 포커스 이동
    // 약간의 지연을 두어 모달이 완전히 렌더링된 후 포커스 이동
    const focusTimer = setTimeout(() => {
      if (firstElement) {
        firstElement.focus();
      } else {
        // 포커스 가능한 요소가 없으면 모달 컨테이너에 포커스
        modal.focus();
      }
    }, 0);

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement || document.activeElement === modal) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  // 모달 컨테이너 스타일 계산
  const modalContainerStyle = useMemo(() => {
    const dynamicStyle: React.CSSProperties = {
      overflow: 'hidden',
      alignSelf: 'center',
    };

    // width 설정
    if (typeof width === 'number') {
      dynamicStyle.width = `${width}px`;
      dynamicStyle.maxWidth = `${width}px`;
    } else if (typeof width === 'string') {
      dynamicStyle.width = width;
      if (width !== 'auto') {
        dynamicStyle.maxWidth = width;
      }
    }

    // height 설정
    if (height !== 'auto') {
      if (typeof height === 'number') {
        dynamicStyle.height = `${height}px`;
        dynamicStyle.maxHeight = `${height}px`;
      } else if (typeof height === 'string') {
        dynamicStyle.height = height;
        if (height !== 'auto') {
          dynamicStyle.maxHeight = height;
        }
      }
    }

    // padding 설정
    if (padding !== undefined) {
      dynamicStyle.padding = `${padding}px`;
    }

    return dynamicStyle;
  }, [width, height, padding]);

  // 뒷배경 클릭 핸들러
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  if (!shouldRender) {
    return null;
  }

  const modalContent = (
    <div
      className={`${styles.backdrop} ${
        disableAnimation ? styles.noAnimation : isAnimating ? styles.animateEnter : styles.animateExit
      }`}
    >
      {/* Backdrop 영역 - 클릭 시 모달 닫기 */}
      <div
        className={styles.backdropPressable}
        onClick={handleBackdropPress}
        aria-hidden="true"
      />
      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${styles.modalContainerAbsolute}`}
        style={modalContainerStyle}
        role="dialog"
        aria-modal="true"
        aria-label="모달"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Modal Content - children을 그대로 렌더링 */}
        {children}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 렌더링
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

export default Modal;
