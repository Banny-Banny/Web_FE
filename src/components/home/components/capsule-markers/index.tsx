/**
 * 캡슐 마커 컴포넌트
 * 카카오 지도에 캡슐 마커를 표시합니다
 */

'use client';

import { useEffect, useRef, memo } from 'react';
import type { KakaoCustomOverlay } from '@/commons/utils/kakao-map/types';
import type { CapsuleMarkersProps } from './types';
import type { CapsuleItem } from '@/commons/apis/easter-egg/types';
import styles from './styles.module.css';

// SVG 파일 경로 (public 폴더 기준)
const MARKER_EGG_BLUE_PATH = '/assets/icons/marker_egg_blue.svg';
const MARKER_CAP_RED_PATH = '/assets/icons/marker_cap_red.svg';

export const CapsuleMarkers = memo(function CapsuleMarkers({
  map,
  capsules,
  onMarkerClick,
  className = '',
}: CapsuleMarkersProps) {
  const overlaysRef = useRef<Map<string, KakaoCustomOverlay>>(new Map());

  /**
   * 캡슐 타입에 따라 마커 아이콘 경로를 반환합니다
   */
  const getMarkerIconPath = (type: CapsuleItem['type']): string => {
    if (type === 'TIME_CAPSULE') {
      // 타임캡슐: 빨간색 캡 마커
      return MARKER_CAP_RED_PATH;
    }
    // 이스터에그: 파란색 알 마커
    return MARKER_EGG_BLUE_PATH;
  };

  /**
   * 마커 HTML 요소를 생성합니다
   */
  const createMarkerElement = (capsule: CapsuleItem): HTMLElement => {
    const markerWrapper = document.createElement('div');
    markerWrapper.className = styles.markerWrapper;
    markerWrapper.setAttribute('data-capsule-id', capsule.id);
    markerWrapper.setAttribute('role', 'button');
    markerWrapper.setAttribute('aria-label', `${capsule.title || '캡슐'} 마커`);
    markerWrapper.setAttribute('tabindex', '0');

    // SVG 이미지 생성
    const markerImage = document.createElement('img');
    markerImage.src = getMarkerIconPath(capsule.type);
    markerImage.alt = `${capsule.type === 'EASTER_EGG' ? '이스터에그' : '타임캡슐'} 마커`;
    markerImage.className = styles.markerImage;
    markerImage.setAttribute('draggable', 'false');

    markerWrapper.appendChild(markerImage);

    // 클릭 이벤트 핸들러
    const handleClick = (e: MouseEvent | KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onMarkerClick(capsule);
    };

    markerWrapper.addEventListener('click', handleClick);
    markerWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick(e);
      }
    });

    return markerWrapper;
  };

  /**
   * 마커를 생성하고 지도에 추가합니다
   */
  useEffect(() => {
    if (!map || !window.kakao?.maps || capsules.length === 0) {
      return;
    }

    try {
      // 기존 오버레이 제거
      overlaysRef.current.forEach((overlay) => {
        try {
          overlay.setMap(null);
        } catch (err) {
          console.error('오버레이 제거 실패:', err);
        }
      });
      overlaysRef.current.clear();

      // 개발 환경에서 마커 생성 시작 로그
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CapsuleMarkers] 마커 생성 시작: ${capsules.length}개 캡슐`);
      }

      let createdCount = 0;
      let skippedCount = 0;

      // 각 캡슐에 대해 마커 생성
      capsules.forEach((capsule) => {
        try {
          // 좌표가 유효한지 확인
          if (
            typeof capsule.latitude !== 'number' ||
            typeof capsule.longitude !== 'number' ||
            isNaN(capsule.latitude) ||
            isNaN(capsule.longitude)
          ) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[CapsuleMarkers] 유효하지 않은 좌표: ${capsule.id}`);
            }
            skippedCount++;
            return;
          }

          // 위치 좌표 생성
          const position = new window.kakao.maps.LatLng(
            capsule.latitude,
            capsule.longitude
          );

          // 마커 HTML 요소 생성
          const markerElement = createMarkerElement(capsule);

          // CustomOverlay 생성
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position,
            content: markerElement,
            map,
            xAnchor: 0.5, // 마커 중심점 기준 x축
            yAnchor: 1, // 마커 하단 기준 y축 (SVG의 핀 끝부분)
            zIndex: 5, // 사용자 위치 마커(z-index: 10)보다 낮게
          });

          // 오버레이 맵에 저장
          overlaysRef.current.set(capsule.id, customOverlay);
          createdCount++;

          // 개발 환경에서 개별 마커 생성 로그
          if (process.env.NODE_ENV === 'development') {
            console.log(`[CapsuleMarkers] 마커 생성 완료: ${capsule.id} (${capsule.type})`, {
              position: { lat: capsule.latitude, lng: capsule.longitude },
              title: capsule.title,
            });
          }
        } catch (err) {
          console.error(`[CapsuleMarkers] 마커 생성 실패 (${capsule.id}):`, err);
          skippedCount++;
        }
      });

      // 개발 환경에서 마커 생성 완료 로그
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CapsuleMarkers] 마커 생성 완료: ${createdCount}개 생성, ${skippedCount}개 건너뜀`);
      }
    } catch (err) {
      console.error('[CapsuleMarkers] 마커 생성 중 오류:', err);
    }

    // 클린업: 모든 오버레이 제거
    return () => {
      overlaysRef.current.forEach((overlay) => {
        try {
          overlay.setMap(null);
        } catch (err) {
          console.error('오버레이 제거 실패:', err);
        }
      });
      overlaysRef.current.clear();
    };
  }, [map, capsules, onMarkerClick]);

  // 지도가 없으면 렌더링하지 않음
  if (!map) {
    return null;
  }

  return null; // 마커는 지도 위에 직접 렌더링되므로 JSX 반환 불필요
});
