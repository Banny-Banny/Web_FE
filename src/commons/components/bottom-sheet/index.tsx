'use client';

/**
 * @fileoverview BottomSheet 컴포넌트
 * @description 하단에서 올라오는 바텀시트 컴포넌트
 *
 * @description
 * - 오버레이와 바텀시트 컨테이너로 구성
 * - children을 통해 내부 컨텐츠를 자유롭게 구성
 * - footer를 통해 하단 고정 영역 제공
 * - Figma 디자인 시스템 기준 스타일 적용
 *
 * @example
 * ```typescript
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   footer={<button>확인</button>}
 * >
 *   <div>바텀시트 내용</div>
 * </BottomSheet>
 * ```
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';
import type { BottomSheetProps } from './types';

/**
 * BottomSheet 컴포넌트
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  footer,
  showHandle = true,
  closeOnBackdropPress = true,
}: BottomSheetProps) {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // isOpen 변경 시 렌더링 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      // 이전 포커스 위치 저장
      previousActiveElement.current = document.activeElement as HTMLElement;
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
      // 렌더링 시작 (다음 틱에서 실행)
      requestAnimationFrame(() => {
        setShouldRender(true);
      });
    } else {
      // body 스크롤 복원
      document.body.style.overflow = '';
      // 애니메이션 종료 후 컴포넌트 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
        // 포커스 복원
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 300); // 애니메이션 duration과 동일

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 오버레이 클릭 핸들러
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  if (!shouldRender) {
    return null;
  }

  const bottomSheetContent = (
    <div className={`${styles.backdrop} ${isOpen ? styles.animateEnter : ''}`}>
      {/* 오버레이 클릭 영역 */}
      <div
        className={styles.backdropPressable}
        onClick={handleBackdropPress}
        aria-hidden="true"
      />
      {/* 바텀시트 컨테이너 */}
      <div
        ref={bottomSheetRef}
        className={styles.bottomSheetContainer}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        {showHandle && (
          <div className={styles.handleContainer}>
            <div className={styles.handle} />
          </div>
        )}

        {/* 바텀시트 내용 */}
        <div className={styles.content}>{children}</div>

        {/* 하단 고정 영역 (footer) */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 렌더링
  if (typeof window !== 'undefined') {
    return createPortal(bottomSheetContent, document.body);
  }

  return null;
}

export default BottomSheet;
