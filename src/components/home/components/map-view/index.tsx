/**
 * Map View 컴포넌트
 * 카카오 지도를 렌더링합니다
 */

'use client';

import { useEffect, useRef, memo } from 'react';
import { Spinner } from '@/commons/components/spinner';
import type { MapViewProps } from './types';
import styles from './styles.module.css';

export const MapView = memo(function MapView({
  onMapInit,
  map,
  isLoading = false,
  error = null,
  className = '',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 지도가 이미 생성되었거나 로딩 중이면 초기화하지 않음
    if (map || isLoading || !containerRef.current) {
      return;
    }

    // 지도 초기화 (에러 처리 포함)
    try {
      onMapInit(containerRef.current);
    } catch (initError) {
      console.error('[MapView] 지도 초기화 실패:', initError);
    }
  }, [map, isLoading, onMapInit]);

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`${styles.container} ${className}`} data-testid="map-error">
        <div className={styles.errorContainer} role="alert" aria-live="assertive">
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className={`${styles.container} ${className}`} data-testid="map-loading">
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <Spinner size="large" />
          <p className={styles.loadingText}>지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={`${styles.container} ${className}`} data-testid="map-container">
      <div
        ref={containerRef}
        className={styles.mapContainer}
        role="application"
        aria-label="카카오 지도"
        aria-busy={isLoading}
      />
      {/* 로딩 중 조작 방지 오버레이 */}
      {isLoading && (
        <div 
          className={styles.loadingOverlay}
          aria-hidden="true"
        />
      )}
    </div>
  );
});
