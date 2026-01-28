/**
 * LocationDisplay 컴포넌트
 * 지도 중앙에 현재 위치 마커를 표시하고, 해당 위치의 주소를 표시합니다.
 */

'use client';

import { useEffect, memo } from 'react';
import { RiMapPinFill } from '@remixicon/react';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useAddress } from '../../hooks/useAddress';
import type { LocationDisplayProps } from './types';
import styles from './styles.module.css';

export const LocationDisplay = memo(function LocationDisplay({
  map,
  userLat,
  userLng,
  className = '',
}: LocationDisplayProps) {
  const { center, updateCenter } = useCurrentLocation(map);
  const { address, isLoading, error, fetchAddress } = useAddress();

  // 사용자 위치 마커 (실제 Geolocation 위치)
  const hasUserLocation = userLat !== null && userLat !== undefined && 
                          userLng !== null && userLng !== undefined;

  /**
   * 지도 중앙점이 변경되면 주소를 조회합니다
   */
  useEffect(() => {
    if (center) {
      try {
        fetchAddress(center.lat, center.lng);
      } catch (fetchError) {
        console.error('[LocationDisplay] 주소 조회 요청 실패:', fetchError);
      }
    }
  }, [center, fetchAddress]);

  /**
   * 사용자 위치에 커스텀 마커를 추가합니다 (Figma 디자인)
   */
  useEffect(() => {
    if (!map || !window.kakao?.maps || !hasUserLocation) {
      return;
    }

    try {
      // 사용자 위치 좌표 생성
      const position = new window.kakao.maps.LatLng(userLat!, userLng!);

      // 커스텀 마커 HTML 생성
      const markerContent = document.createElement('div');
      markerContent.className = styles.userLocationMarker;

      // CustomOverlay 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content: markerContent,
        map,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 10,
      });

      // 클린업: 오버레이 제거
      return () => {
        try {
          customOverlay.setMap(null);
        } catch (err) {
          console.error('커스텀 오버레이 제거 실패:', err);
        }
      };
    } catch (err) {
      console.error('사용자 위치 마커 생성 실패:', err);
    }
  }, [map, hasUserLocation, userLat, userLng]);

  /**
   * 지도 이동 이벤트 리스너를 등록합니다
   */
  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    // 지도 이동 완료 이벤트 리스너
    const handleCenterChanged = () => {
      try {
        const mapCenter = map.getCenter();
        if (mapCenter) {
          const lat = mapCenter.getLat();
          const lng = mapCenter.getLng();
          updateCenter(lat, lng);
        }
      } catch (err) {
        console.error('지도 중앙점 가져오기 실패:', err);
      }
    };

    // 이벤트 리스너 등록
    window.kakao.maps.event.addListener(map, 'center_changed', handleCenterChanged);

    // 초기 중앙점 설정
    handleCenterChanged();

    // 클린업: 이벤트 리스너 제거
    return () => {
      try {
        if (window.kakao?.maps) {
          window.kakao.maps.event.removeListener(map, 'center_changed', handleCenterChanged);
        }
      } catch (err) {
        console.error('이벤트 리스너 제거 실패:', err);
      }
    };
  }, [map, updateCenter]);

  // 지도가 없으면 렌더링하지 않음
  if (!map) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.addressCard} role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? (
          <div className={styles.loadingText}>
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <span>주소 확인 중</span>
          </div>
        ) : error ? (
          <div className={styles.errorText} role="alert" aria-live="assertive">
            <p>{error}</p>
            <p className={styles.errorHint}>잠시 후 다시 시도해주세요</p>
          </div>
        ) : address ? (
          <>
            {/* 위치 아이콘 - remixicon */}
            <RiMapPinFill 
              className={styles.locationIcon}
              size={12}
              aria-hidden="true"
            />
            <p className={styles.addressText}>{address}</p>
          </>
        ) : (
          <p className={styles.loadingText}>주소 확인 중</p>
        )}
        {/* 스크린 리더용 */}
        <span className={styles.srOnly}>
          {error 
            ? `오류: ${error}` 
            : address 
              ? `현재 위치: ${address}` 
              : '현재 위치를 확인하는 중입니다'}
        </span>
      </div>
    </div>
  );
});
