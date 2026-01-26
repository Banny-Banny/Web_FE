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
import { animated } from '@react-spring/web';
import { useDragGesture } from './hooks/useDragGesture';
import styles from './styles.module.css';
import type { BottomSheetProps } from './types';

/**
 * BottomSheet 컴포넌트
 * 
 * 하단에서 올라오는 바텀시트 컴포넌트입니다.
 * 모바일 UI 패턴에 적합하며, 선택지나 추가 정보를 표시할 때 사용됩니다.
 * 
 * @param {BottomSheetProps} props - BottomSheet 컴포넌트의 props
 * @param {boolean} props.isOpen - 바텀시트 표시 여부
 * @param {() => void} props.onClose - 바텀시트 닫기 핸들러
 * @param {ReactNode} props.children - 바텀시트 내부 컨텐츠
 * @param {ReactNode} [props.footer] - 하단 고정 영역 (주로 버튼)
 * @param {boolean} [props.showHandle=false] - 드래그 핸들 표시 여부
 * @param {boolean} [props.closeOnBackdropPress=true] - 오버레이 클릭 시 닫기 여부
 * @param {boolean} [props.draggable=false] - 드래그 가능 여부
 * @param {string | number} [props.maxHeight="70vh"] - 최대 높이
 * @param {Function} [props.onDragEnd] - 드래그 종료 핸들러
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   footer={
 *     <DualButton
 *       cancelLabel="취소"
 *       confirmLabel="확인"
 *       onCancelPress={() => setIsOpen(false)}
 *       onConfirmPress={handleConfirm}
 *     />
 *   }
 * >
 *   <div>
 *     <h3>바텀시트 제목</h3>
 *     <p>바텀시트 내용</p>
 *   </div>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  footer,
  showHandle = false,
  closeOnBackdropPress = true,
  draggable = false,
  maxHeight = '70vh',
  onDragEnd,
}: BottomSheetProps) {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 드래그 제스처 Hook (draggable이 true일 때만 활성화)
  const { style: dragStyle, bind: dragBind, isDragging } = useDragGesture({
    isOpen: isOpen && draggable,
    onClose,
    maxHeightVh: typeof maxHeight === 'string' && maxHeight.includes('vh') 
      ? parseFloat(maxHeight) 
      : 70,
    closeThreshold: 30,
    onDragEnd,
  });

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

  // 최대 높이 스타일 계산
  const maxHeightStyle = typeof maxHeight === 'number' 
    ? { maxHeight: `${maxHeight}px` }
    : { maxHeight };

  // 바텀시트 컨테이너 클래스
  const containerClasses = [
    styles.bottomSheetContainer,
    isDragging ? styles.dragging : '',
  ].filter(Boolean).join(' ');

  const bottomSheetContent = (
    <div className={`${styles.backdrop} ${isOpen ? styles.animateEnter : ''}`}>
      {/* 오버레이 클릭 영역 */}
      <div
        className={styles.backdropPressable}
        onClick={handleBackdropPress}
        aria-hidden="true"
      />
      {/* 바텀시트 컨테이너 */}
      {draggable ? (
        <animated.div
          ref={bottomSheetRef}
          className={containerClasses}
          style={{
            ...maxHeightStyle,
            y: dragStyle.y,
            touchAction: 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="바텀시트"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          tabIndex={-1}
        >
          {/* 드래그 핸들 */}
          {showHandle && (
            <div className={styles.handleContainer} {...dragBind()}>
              <div className={styles.handle} />
            </div>
          )}

          {/* 바텀시트 내용 */}
          <div className={styles.content}>{children}</div>

          {/* 하단 고정 영역 (footer) */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </animated.div>
      ) : (
        <div
          ref={bottomSheetRef}
          className={containerClasses}
          style={maxHeightStyle}
          role="dialog"
          aria-modal="true"
          aria-label="바텀시트"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          tabIndex={-1}
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
      )}
    </div>
  );

  // Portal을 사용하여 body에 렌더링
  if (typeof window !== 'undefined') {
    return createPortal(bottomSheetContent, document.body);
  }

  return null;
}

export default BottomSheet;
