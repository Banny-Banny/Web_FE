/**
 * Home Feature Container
 * 홈 페이지의 메인 컨테이너
 */

'use client';

import { useEffect, useState } from 'react';
import { loadKakaoMapScript } from '@/commons/utils/kakao-map/script-loader';
import { useKakaoMap } from './hooks/useKakaoMap';
import { useGeolocation } from './hooks/useGeolocation';
import { MapView } from './components/map-view';
import { MapControls } from './components/map-controls';
import { LocationDisplay } from './components/location-display';
import { FabButton } from './components/fab-button';
import { EggSlot } from './components/egg-slot';
import { Modal } from '@/commons/components/modal';
import type { HomeFeatureProps } from './types';

export function HomeFeature({ className = '' }: HomeFeatureProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationCount] = useState<number>(3); // 임시 Mock 데이터 (향후 API 연동 시 실제 데이터로 변경)
  const geolocation = useGeolocation();
  
  // Geolocation 값을 useKakaoMap에 전달
  const { map, isLoading, error, initializeMap } = useKakaoMap({
    initialLat: geolocation.latitude,
    initialLng: geolocation.longitude,
  });

  // 재시도 핸들러
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setScriptError(null);
    setScriptLoaded(false);
  };

  // 이스터에그 선택 핸들러 (임시)
  const handleEasterEggClick = () => {
    // TODO: 향후 이스터에그 생성 페이지로 라우팅
    console.log('이스터에그 생성 선택');
    // 예시: router.push('/easter-egg/create');
  };

  // 타임캡슐 선택 핸들러 (임시)
  const handleTimeCapsuleClick = () => {
    // TODO: 향후 타임캡슐 생성 페이지로 라우팅
    console.log('타임캡슐 생성 선택');
    // 예시: router.push('/time-capsule/create');
  };

  // 알림 슬롯 클릭 핸들러
  const handleEggSlotClick = () => {
    setNotificationModalOpen(true);
  };

  // 알림 모달 닫기 핸들러
  const handleNotificationModalClose = () => {
    setNotificationModalOpen(false);
  };

  // 카카오 지도 스크립트 로딩
  useEffect(() => {
    if (scriptLoaded || scriptError) return;

    let isMounted = true;

    loadKakaoMapScript()
      .then(() => {
        if (isMounted) {
          setScriptLoaded(true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '지도 스크립트를 로드하는데 실패했습니다.';
          setScriptError(errorMessage);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [scriptLoaded, scriptError]);

  // 스크립트 로딩 중 또는 Geolocation 로딩 중
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

  // Geolocation 로딩 중 (스크립트는 로드됨)
  if (scriptLoaded && geolocation.isLoading) {
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
    // 환경 변수 미설정 에러인지 확인
    const isEnvError = scriptError.includes('API 키가 설정되지 않았습니다');
    // 네트워크 에러인지 확인
    const isNetworkError = scriptError.includes('네트워크');
    
    const errorMessage = isEnvError
      ? '지도를 표시할 수 없습니다. 관리자에게 문의해주세요.'
      : scriptError;

    return (
      <div className={`h-full w-full relative ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          error={errorMessage}
        />
        {/* 네트워크 에러인 경우 재시도 버튼 표시 */}
        {isNetworkError && (
          <div style={{ 
            position: 'absolute', 
            bottom: '50%', 
            left: '50%', 
            transform: 'translate(-50%, 50%)',
            marginTop: '40px'
          }}>
            <button
              onClick={handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              aria-label="지도 다시 불러오기"
            >
              다시 시도 {retryCount > 0 && `(${retryCount})`}
            </button>
          </div>
        )}
        {/* 개발 환경에서만 상세 에러 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: '8px', 
            backgroundColor: '#fee', 
            fontSize: '12px',
            borderTop: '1px solid #fcc'
          }}>
            <strong>개발자 정보:</strong> {scriptError}
          </div>
        )}
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={`h-full w-full relative ${className}`}>
      <MapView
        onMapInit={initializeMap}
        map={map}
        isLoading={isLoading}
        error={error}
      />
      {map && (
        <>
          <LocationDisplay 
            map={map}
            userLat={geolocation.latitude}
            userLng={geolocation.longitude}
          />
          <MapControls 
            map={map}
            userLat={geolocation.latitude}
            userLng={geolocation.longitude}
          />
          {/* FAB 버튼은 항상 표시 (GNB 위에 위치) */}
          <FabButton
            onEasterEggClick={handleEasterEggClick}
            onTimeCapsuleClick={handleTimeCapsuleClick}
          />
          {/* 알 슬롯 (우측 상단) */}
          <EggSlot
            count={notificationCount}
            onClick={handleEggSlotClick}
          />
        </>
      )}

      {/* 알림 모달 */}
      <Modal
        visible={notificationModalOpen}
        onClose={handleNotificationModalClose}
        height="auto"
        padding={24}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          minHeight: '200px'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: 0,
            color: '#0A0A0A'
          }}>
            알림
          </h2>
          {notificationCount === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '150px',
              color: '#696969',
              fontSize: '14px'
            }}>
              알림이 없습니다
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              {/* 임시 Mock 알림 데이터 */}
              {Array.from({ length: notificationCount }).map((_, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '12px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '8px',
                    border: '1px solid rgba(10, 10, 10, 0.08)'
                  }}
                >
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: '#0A0A0A'
                  }}>
                    알림 {index + 1}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#696969'
                  }}>
                    새로운 이스터에그가 도착했습니다!
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
