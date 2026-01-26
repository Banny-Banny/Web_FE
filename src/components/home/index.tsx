/**
 * Home Feature Container
 * 홈 페이지의 메인 컨테이너
 */

'use client';

import { useEffect, useState } from 'react';
import { loadKakaoMapScript } from '@/commons/utils/kakao-map/script-loader';
import { useKakaoMap } from './hooks/useKakaoMap';
import { MapView } from './components/map-view';
import type { HomeFeatureProps } from './types';

export function HomeFeature({ className = '' }: HomeFeatureProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const { map, isLoading, error, initializeMap } = useKakaoMap();

  // 카카오 지도 스크립트 로딩
  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        setScriptLoaded(true);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : '지도 스크립트를 로드하는데 실패했습니다.';
        setScriptError(errorMessage);
      });
  }, []);

  // 스크립트 로딩 중
  if (!scriptLoaded && !scriptError) {
    return (
      <div className={`h-full w-full ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          isLoading={true}
        />
      </div>
    );
  }

  // 스크립트 로딩 실패
  if (scriptError) {
    return (
      <div className={`h-full w-full ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          error={scriptError}
        />
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={`h-full w-full ${className}`}>
      <MapView
        onMapInit={initializeMap}
        map={map}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
