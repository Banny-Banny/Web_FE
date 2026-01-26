/**
 * Map View 컴포넌트
 * 카카오 지도를 렌더링합니다
 */

'use client';

import { useEffect, useRef } from 'react';
import type { MapViewProps } from './types';
import styles from './styles.module.css';

export function MapView({
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

    // 지도 초기화
    onMapInit(containerRef.current);
  }, [map, isLoading, onMapInit]);

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <p className={styles.loadingText}>지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={`${styles.container} ${className}`}>
      <div
        ref={containerRef}
        className={styles.mapContainer}
        role="application"
        aria-label="카카오 지도"
      />
    </div>
  );
}
