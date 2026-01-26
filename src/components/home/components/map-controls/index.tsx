/**
 * 지도 관리 기능을 제공하는 Map Controls 컴포넌트
 */

'use client';

import { memo } from 'react';
import { useMapControl } from '../../hooks/useMapControl';
import type { MapControlsProps } from './types';
import styles from './styles.module.css';

/**
 * Map Controls 컴포넌트
 */
export const MapControls = memo(function MapControls({ 
  map, 
  userLat, 
  userLng, 
  className 
}: MapControlsProps) {
  const { canReset, resetMap } = useMapControl({ map, userLat, userLng });

  const handleReset = () => {
    resetMap();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleReset();
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <button
        type="button"
        className={styles.button}
        onClick={handleReset}
        onKeyDown={handleKeyDown}
        disabled={!canReset}
        aria-label="지도를 초기 위치로 복원"
        tabIndex={0}
        role="button"
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
    </div>
  );
});
