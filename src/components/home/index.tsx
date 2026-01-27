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
import { CapsuleMarkers } from './components/capsule-markers';
import { FabButton } from './components/fab-button';
import { EggSlot } from './components/egg-slot';
import { EggSlotModal } from './components/egg-slot-modal';
import { EasterEggBottomSheet } from './components/easter-egg-bottom-sheet';
import type { HomeFeatureProps } from './types';
import { useSlotManagement } from './hooks/useSlotManagement';
import { useCapsuleMarkers } from './hooks/useCapsuleMarkers';

export function HomeFeature({ className = '' }: HomeFeatureProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [easterEggSheetOpen, setEasterEggSheetOpen] = useState(false);
  const geolocation = useGeolocation();
  
  // 슬롯 관리 훅
  const { slotInfo, isLoading: isSlotLoading } = useSlotManagement();
  
  // Geolocation 값을 useKakaoMap에 전달
  const { map, isLoading, error, initializeMap } = useKakaoMap({
    initialLat: geolocation.latitude,
    initialLng: geolocation.longitude,
  });

  // 캡슐 마커 관리 훅
  // 위치가 없어도 기본 위치 기준으로 Mock 데이터 표시
  const { capsules, isLoading: isCapsulesLoading } = useCapsuleMarkers({
    lat: geolocation.latitude,
    lng: geolocation.longitude,
    radius_m: 300,
  });

  // 개발 환경에서 캡슐 로딩 상태 로그
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (isCapsulesLoading) {
        console.log('[HomeFeature] 캡슐 목록 로딩 중...');
      } else if (capsules.length > 0) {
        console.log('[HomeFeature] 캡슐 목록 로드 완료:', {
          count: capsules.length,
          types: {
            easter_egg: capsules.filter(c => c.type === 'EASTER_EGG').length,
            time_capsule: capsules.filter(c => c.type === 'TIME_CAPSULE').length,
          },
          mine: capsules.filter(c => c.is_mine).length,
        });
      }
    }
  }, [isCapsulesLoading, capsules]);

  // 마커 클릭 핸들러
  // ⚠️ 참고: 이 task 내 기능은 이스터에그만 대상입니다. 타임캡슐은 마커 표시만 됩니다.
  const handleMarkerClick = (capsule: import('@/commons/apis/easter-egg/types').CapsuleItem) => {
    // 타임캡슐은 기능 대상이 아니므로 무시
    if (capsule.type === 'TIME_CAPSULE') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[HomeFeature] 타임캡슐은 이 task에서 기능 대상이 아닙니다.');
      }
      return;
    }
    
    // TODO: Phase 7에서 구현 예정 - 마커 클릭 시 캡슐 정보 조회 및 모달 표시 (이스터에그만)
    if (process.env.NODE_ENV === 'development') {
      console.log('[HomeFeature] 마커 클릭:', {
        id: capsule.id,
        title: capsule.title,
        type: capsule.type,
        is_mine: capsule.is_mine,
        distance_m: capsule.distance_m,
      });
      // 개발 환경에서 간단한 알림 표시
      alert(`[개발 모드] 캡슐 클릭\n\n제목: ${capsule.title || '제목 없음'}\n타입: ${capsule.type === 'EASTER_EGG' ? '이스터에그' : '타임캡슐'}\n거리: ${capsule.distance_m ? `${capsule.distance_m}m` : '알 수 없음'}\n\nPhase 7에서 모달이 표시됩니다.`);
    }
  };

  // 재시도 핸들러
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setScriptError(null);
    setScriptLoaded(false);
  };

  // 이스터에그 선택 핸들러
  const handleEasterEggClick = () => {
    setEasterEggSheetOpen(true);
  };

  // 타임캡슐 선택 핸들러 (임시)
  const handleTimeCapsuleClick = () => {
    // TODO: 향후 타임캡슐 생성 페이지로 라우팅
    // 예시: router.push('/time-capsule/create');
  };

  // 이스터에그 바텀시트 닫기 핸들러
  const handleEasterEggSheetClose = () => {
    setEasterEggSheetOpen(false);
  };

  // 이스터에그 작성 완료 핸들러
  const handleEasterEggConfirm = (_formData: import('./components/easter-egg-bottom-sheet/types').EasterEggFormData) => {
    // 제출 로직은 바텀시트 컴포넌트 내부에서 처리됨
    // 성공 시 지도 업데이트 등 추가 작업이 필요하면 여기서 처리
    setEasterEggSheetOpen(false);
  };

  // 알 슬롯 클릭 핸들러 (슬롯 모달 열기)
  const handleEggSlotClick = () => {
    setSlotModalOpen(true);
  };

  // 슬롯 모달 닫기 핸들러
  const handleSlotModalClose = () => {
    setSlotModalOpen(false);
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
          {/* 캡슐 마커 표시 */}
          <CapsuleMarkers
            map={map}
            capsules={capsules}
            onMarkerClick={handleMarkerClick}
          />
          {/* FAB 버튼은 항상 표시 (GNB 위에 위치) */}
          <FabButton
            onEasterEggClick={handleEasterEggClick}
            onTimeCapsuleClick={handleTimeCapsuleClick}
          />
          {/* 알 슬롯 (우측 상단) */}
          <EggSlot
            count={slotInfo?.remainingSlots ?? 0}
            onClick={handleEggSlotClick}
            isLoading={isSlotLoading}
          />
        </>
      )}

      {/* 슬롯 정보 모달 */}
      <EggSlotModal
        isOpen={slotModalOpen}
        onClose={handleSlotModalClose}
      />

      {/* 이스터에그 바텀시트 */}
      <EasterEggBottomSheet
        isOpen={easterEggSheetOpen}
        onClose={handleEasterEggSheetClose}
        onConfirm={handleEasterEggConfirm}
      />
    </div>
  );
}
