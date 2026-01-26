/**
 * @fileoverview 바텀시트 드래그 제스처 Hook
 * 
 * @use-gesture/react를 사용하여 바텀시트의 드래그 인터랙션을 구현합니다.
 * - 최대 높이 70% 제한
 * - 드래그로 닫기 (threshold: 30%)
 * - rubber band effect (70% 초과 시)
 * 
 * @module commons/components/bottom-sheet/hooks/useDragGesture
 */

import { useDrag } from '@use-gesture/react';
import { useSpring } from '@react-spring/web';
import { useCallback, useState } from 'react';

/**
 * 드래그 제스처 Hook 옵션
 */
export interface UseDragGestureOptions {
  /** 바텀시트가 열려있는지 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 최대 높이 (vh 단위, 기본: 70) */
  maxHeightVh?: number;
  /** 닫기 threshold (%, 기본: 30) */
  closeThreshold?: number;
  /** 드래그 종료 핸들러 (선택적) */
  onDragEnd?: () => void;
}

/**
 * 드래그 제스처 Hook 반환 타입
 */
export interface UseDragGestureReturn {
  /** react-spring 스타일 객체 */
  style: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y: any;
  };
  /** 드래그 제스처 바인딩 함수 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bind: () => any;
  /** 드래그 중인지 여부 */
  isDragging: boolean;
}

/**
 * 바텀시트 드래그 제스처 Hook
 * 
 * @use-gesture/react와 @react-spring/web를 사용하여
 * 부드러운 드래그 인터랙션을 제공합니다.
 * 
 * @param options - 드래그 제스처 옵션
 * @returns 드래그 제스처 바인딩 및 스타일
 * 
 * @example
 * ```tsx
 * const { style, bind, isDragging } = useDragGesture({
 *   isOpen: true,
 *   onClose: handleClose,
 *   maxHeightVh: 70,
 *   closeThreshold: 30,
 * });
 * 
 * <animated.div {...bind()} style={style}>
 *   바텀시트 내용
 * </animated.div>
 * ```
 */
export function useDragGesture({
  isOpen,
  onClose,
  maxHeightVh = 70,
  closeThreshold = 30,
  onDragEnd,
}: UseDragGestureOptions): UseDragGestureReturn {
  const [isDragging, setIsDragging] = useState(false);

  // react-spring 애니메이션 설정
  const [{ y }, api] = useSpring(() => ({
    y: 0,
    config: {
      tension: 300,
      friction: 30,
      clamp: false,
    },
  }));

  // 화면 높이 가져오기
  const getViewportHeight = useCallback(() => {
    return typeof window !== 'undefined' ? window.innerHeight : 0;
  }, []);

  // 최대 드래그 가능 거리 계산 (화면 높이의 70%)
  const getMaxDragDistance = useCallback(() => {
    const vh = getViewportHeight();
    return vh * (maxHeightVh / 100);
  }, [getViewportHeight, maxHeightVh]);

  // 닫기 threshold 거리 계산
  const getCloseThreshold = useCallback(() => {
    const vh = getViewportHeight();
    return vh * (closeThreshold / 100);
  }, [getViewportHeight, closeThreshold]);

  // rubber band effect 계산
  const applyRubberBand = useCallback(
    (distance: number, maxDistance: number) => {
      if (distance <= maxDistance) {
        return distance;
      }
      // 최대 거리를 초과하면 저항력 적용
      const excess = distance - maxDistance;
      const rubberBand = Math.log(1 + excess / 100) * 50;
      return maxDistance + rubberBand;
    },
    []
  );

  // 드래그 제스처 바인딩
  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      setIsDragging(down);

      // 위로 드래그하는 경우 (음수 방향)
      if (my < 0) {
        const maxDistance = getMaxDragDistance();
        const adjustedY = applyRubberBand(Math.abs(my), maxDistance);
        
        api.start({
          y: -adjustedY,
          immediate: down,
        });
        return;
      }

      // 아래로 드래그하는 경우 (양수 방향)
      if (down) {
        // 드래그 중
        api.start({
          y: my,
          immediate: true,
        });
      } else {
        // 드래그 종료
        const closeThresholdDistance = getCloseThreshold();

        // 빠른 스와이프 또는 threshold 초과 시 닫기
        if (
          (vy > 0.5 && dy > 0) || // 빠른 아래 스와이프
          my > closeThresholdDistance // threshold 초과
        ) {
          // 바텀시트 닫기
          api.start({
            y: getViewportHeight(),
            immediate: false,
            onRest: () => {
              onClose();
              api.set({ y: 0 });
            },
          });
        } else {
          // 원래 위치로 복귀
          api.start({
            y: 0,
            immediate: false,
          });
        }

        // 드래그 종료 콜백
        if (onDragEnd) {
          onDragEnd();
        }
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: -getMaxDragDistance() },
      rubberband: true,
    }
  );

  // 바텀시트가 닫힐 때 위치 초기화
  if (!isOpen && isDragging) {
    api.set({ y: 0 });
    setIsDragging(false);
  }

  return {
    style: { y },
    bind,
    isDragging,
  };
}
